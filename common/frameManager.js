/*
 * (c) Copyright Ascensio System SIA 2010-2023
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(function (window)
{

	function CCellFrameManager(oApi)
	{
		this.api = oApi;
		this.generalDocumentUrls = {};
	}

	CCellFrameManager.prototype.getWorkbookBinary = function ()
	{
		const oBinaryFileWriter = new AscCommonExcel.BinaryFileWriter(this.api.wbModel);
		const arrBinaryData = oBinaryFileWriter.Write().split(';');
		return arrBinaryData[arrBinaryData.length - 1];
	}
	CCellFrameManager.prototype.getAllImageIds = function ()
	{
		const arrRasterImageIds = [];
		const arrWorksheetLength = this.api.wbModel.aWorksheets.length;
		for (let i = 0; i < arrWorksheetLength; i += 1) {
			const oWorksheet = this.api.wbModel.aWorksheets[i];
			const arrDrawings = oWorksheet.Drawings;
			if (arrDrawings) {
				for (let j = 0; j < arrDrawings.length; j += 1) {
					const oDrawing = arrDrawings[j];
					oDrawing.graphicObject.getAllRasterImages(arrRasterImageIds);
				}
			}
		}
		return arrRasterImageIds;
	}
	CCellFrameManager.prototype.getImagesForHistory = function ()
	{
		const arrRasterImageIds = this.getAllImageIds();
		const urlsForAddToHistory = [];
		for (let i = 0; i < arrRasterImageIds.length; i += 1) {
			const url = AscCommon.g_oDocumentUrls.mediaPrefix + arrRasterImageIds[i];
			if (!(this.generalDocumentUrls[url] && this.generalDocumentUrls[url] === AscCommon.g_oDocumentUrls.getUrls()[url])) {
				urlsForAddToHistory.push(arrRasterImageIds[i]);
			}
		}

		return urlsForAddToHistory;
	}

	CCellFrameManager.prototype.obtain = function (oInfo)
	{
		const sStream = oInfo["binary"];
		this.setGeneralDocumentUrls(oInfo["documentImageUrls"]);
		this.openWorkbookData(sStream);
	};
	CCellFrameManager.prototype.setGeneralDocumentUrls = function (oPr)
	{
		this.generalDocumentUrls = oPr;
	};
	CCellFrameManager.prototype.getGeneralImageUrl = function (sImageId)
	{
		return this.generalDocumentUrls[sImageId];
	};
	CCellFrameManager.prototype.openWorkbookData = function (sStream)
	{
		const oFile = new AscCommon.OpenFileResult();
		oFile.bSerFormat = AscCommon.checkStreamSignature(sStream, AscCommon.c_oSerFormat.Signature);
		oFile.data = sStream;
		this.api.asc_CloseFile();

		this.api.imagesFromGeneralEditor = this.generalDocumentUrls;
		this.api.openDocument(oFile);
	}
	CCellFrameManager.prototype.isDiagramEditor = function ()
	{
		return false;
	};
	CCellFrameManager.prototype.isOleEditor = function ()
	{
		return false;
	};




	function COleCellFrameManager(oApi)
	{
		CCellFrameManager.call(this, oApi);
		this.imageWidthCoefficient = null;
		this.imageHeightCoefficient = null;
		this.isFromSheetEditor = false;
	}
	AscFormat.InitClassWithoutType(COleCellFrameManager, CCellFrameManager);

	COleCellFrameManager.prototype.getBase64Image = function ()
	{
		return this.api.wb.getImageFromTableOleObject();
	};
	COleCellFrameManager.prototype.getImageWidthCoefficient = function ()
	{
		return this.imageWidthCoefficient || undefined;
	}
	COleCellFrameManager.prototype.getImageHeightCoefficient = function ()
	{
		return this.imageHeightCoefficient || undefined;
	}
	COleCellFrameManager.prototype.getBinary = function ()
	{
		return {
			'binary': this.getWorkbookBinary(),
			'base64Image': this.getBase64Image(),
			'imagesForAddToHistory': this.getImagesForHistory(),
			'widthCoefficient': this.getImageWidthCoefficient(),
			'heightCoefficient': this.getImageHeightCoefficient()
		};
	};
	COleCellFrameManager.prototype.calculateImageSaveCoefficients = function (nImageHeight, nImageWidth)
	{
		if (!nImageHeight || !nImageWidth)
			return;

		const saveImageCoefficients = this.api.getScaleCoefficientsForOleTableImage(nImageWidth, nImageHeight)
		this.imageWidthCoefficient = saveImageCoefficients.widthCoefficient;
		this.imageHeightCoefficient = saveImageCoefficients.heightCoefficient;
	}
	COleCellFrameManager.prototype.obtain = function (oInfo)
	{
		this.isFromSheetEditor = oInfo["isFromSheetEditor"];
		this.calculateImageSaveCoefficients(oInfo["imageHeight"], oInfo["imageWidth"]);
		CCellFrameManager.prototype.obtain.call(this, oInfo);
	}
	COleCellFrameManager.prototype.sendFromFrameToGeneralEditor = function (oSendObject)
	{
		this.api.sendFromFrameToGeneralEditor(oSendObject);
	};
	COleCellFrameManager.prototype.sendFromGeneralToFrameEditor = function (oSendObject)
	{
		this.api.sendFromGeneralToFrameEditor(oSendObject);
	};
	COleCellFrameManager.prototype.isFromSheetEditor = function ()
	{
		return this.isFromSheetEditor;
	}

	COleCellFrameManager.prototype.setAfterLoadCallback = function ()
	{

		const oApi = this.api;
		const oThis = this;
		oApi.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Open);
		// на случай, если изображение поставили на загрузку, закрыли редактор, и потом опять открыли
		oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.LoadImage);

		this.sendFromFrameToGeneralEditor({
			"type": AscCommon.c_oAscFrameDataType.OpenFrame
		});

		oApi.fAfterLoad = function () {
			oThis.api.wb.scrollToOleSize();
			// добавляем первый поинт после загрузки, чтобы в локальную историю добавился либо стандартный oleSize, либо заданный пользователем
			const oleSize = oThis.api.wb.getOleSize();
			oleSize.addPointToLocalHistory();

			oThis.api.wb.onOleEditorReady();
			oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Open);
		}
	};
	COleCellFrameManager.prototype.openWorkbookData = function (sStream)
	{
		this.setAfterLoadCallback();
		CCellFrameManager.prototype.openWorkbookData.call(this, sStream);
	}

	CDiagramCellFrameManager.prototype.isOleEditor = function ()
	{
		return !this.isGeneralEditor;
	};




	function CDiagramCellFrameManager(oApi)
	{
		CCellFrameManager.call(this, oApi);
	}
	AscFormat.InitClassWithoutType(CDiagramCellFrameManager, CCellFrameManager);

	CDiagramCellFrameManager.prototype.isDiagramEditor = function ()
	{
		return !this.isGeneralEditor;
	};
	CDiagramCellFrameManager.prototype.obtain = function (oInfo)
	{

		CCellFrameManager.prototype.obtain.call(this, oInfo);
	}

	AscCommon.CDiagramCellFrameManager = CDiagramCellFrameManager;
	AscCommon.COleCellFrameManager = COleCellFrameManager;
})(window);
