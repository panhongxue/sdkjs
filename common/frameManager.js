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
	function InitClassWithoutType(CMain, CBase)
	{
		CMain.prototype = Object.create(CBase.prototype);
		CMain.prototype.constructor = CMain;
	}

	function CFrameManagerBase()
	{
		this.isInitFrameManager = false;
	}
	CFrameManagerBase.prototype.clear = function () {};
	CFrameManagerBase.prototype.getWorkbookBinary = function () {};
	CFrameManagerBase.prototype.getAllImageIds = function () {};
	CFrameManagerBase.prototype.getImagesForHistory = function () {};
	CFrameManagerBase.prototype.obtain = function (oInfo) {};
	CFrameManagerBase.prototype.setGeneralDocumentUrls = function (oPr) {};
	CFrameManagerBase.prototype.getGeneralImageUrl = function (sImageId) {};
	CFrameManagerBase.prototype.openWorkbookData = function (sStream) {};
	CFrameManagerBase.prototype.updateGeneralDiagramCache = function (aRanges) {};
	CFrameManagerBase.prototype.sendLoadImages = function (arrImages, token, bNotShowError) {};
	CFrameManagerBase.prototype.sendFromFrameToGeneralEditor = function (oSendObject) {};
	CFrameManagerBase.prototype.sendFromGeneralToFrameEditor = function (oSendObject) {};
	CFrameManagerBase.prototype.getAscSettings               = function (oSendObject) {};
	CFrameManagerBase.prototype.startLoadOleEditor = function () {};
	CFrameManagerBase.prototype.endLoadOleEditor = function () {};
	CFrameManagerBase.prototype.startLoadChartEditor = function () {};
	CFrameManagerBase.prototype.sendUpdateDiagram = function () {};
	CFrameManagerBase.prototype.endLoadChartEditor = function () {};

	CFrameManagerBase.prototype.preObtain = function (oInfo) {
		this.obtain(oInfo);
	};
	CFrameManagerBase.prototype.isDiagramEditor = function ()
	{
		return false;
	};
	CFrameManagerBase.prototype.isOleEditor = function ()
	{
		return false;
	};
	CFrameManagerBase.prototype.isGeneralEditor = function ()
	{
		return false;
	};
	CFrameManagerBase.prototype.isFrameEditor = function () {
		return false;
	};


	function CMainEditorFrameManager()
	{
		CFrameManagerBase.call(this);
		this.isInitFrameManager = true;
		this.isLoadingOleEditor = false;
		this.isLoadingChartEditor = false;
	}
	InitClassWithoutType(CMainEditorFrameManager, CFrameManagerBase);
	CMainEditorFrameManager.prototype.isGeneralEditor = function ()
	{
		return true;
	};
	CMainEditorFrameManager.prototype.startLoadOleEditor = function ()
	{
		this.isLoadingOleEditor = true;
	};
	CMainEditorFrameManager.prototype.endLoadOleEditor = function ()
	{
		this.isLoadingOleEditor = false;
	};

	CMainEditorFrameManager.prototype.startLoadChartEditor = function ()
	{
		this.isLoadingChartEditor = true;
	};
	CMainEditorFrameManager.prototype.endLoadChartEditor = function ()
	{
		this.isLoadingChartEditor = false;
	};


	function CCellFrameManager()
	{
		CFrameManagerBase.call(this);
		this.api = Asc.editor || editor;
		this.generalDocumentUrls = {};
		this.isInitFrameManager = true;
	}
	InitClassWithoutType(CCellFrameManager, CFrameManagerBase);

	CCellFrameManager.prototype.getWorkbookBinary = function ()
	{
		const oBinaryFileWriter = new AscCommonExcel.BinaryFileWriter(this.api.wbModel);
		const arrBinaryData = oBinaryFileWriter.Write().split(';');
		return arrBinaryData[arrBinaryData.length - 1];
	};
	CCellFrameManager.prototype.getAllImageIds = function ()
	{
		const arrRasterImageIds = [];
		const arrWorksheetLength = this.api.wbModel.aWorksheets.length;
		for (let i = 0; i < arrWorksheetLength; i += 1)
		{
			const oWorksheet = this.api.wbModel.aWorksheets[i];
			const arrDrawings = oWorksheet.Drawings;
			if (arrDrawings)
			{
				for (let j = 0; j < arrDrawings.length; j += 1)
				{
					const oDrawing = arrDrawings[j];
					oDrawing.graphicObject.getAllRasterImages(arrRasterImageIds);
				}
			}
		}
		return arrRasterImageIds;
	};

	CCellFrameManager.prototype.getImagesForHistory = function ()
	{
		const arrRasterImageIds = this.getAllImageIds();
		const urlsForAddToHistory = [];
		for (let i = 0; i < arrRasterImageIds.length; i += 1)
		{
			const url = AscCommon.g_oDocumentUrls.mediaPrefix + arrRasterImageIds[i];
			if (!(this.generalDocumentUrls[url] && this.generalDocumentUrls[url] === AscCommon.g_oDocumentUrls.getUrls()[url]))
			{
				urlsForAddToHistory.push(arrRasterImageIds[i]);
			}
		}

		return urlsForAddToHistory;
	};

	CCellFrameManager.prototype.obtain = function (oInfo)
	{
		this.isInitFrameManager = false;
		const sStream = oInfo["binary"];
		this.setGeneralDocumentUrls(oInfo["documentImageUrls"] || {});
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
	CCellFrameManager.prototype.isGeneralEditor = function ()
	{
		return false;
	};
	CCellFrameManager.prototype.isFrameEditor = function ()
	{
		return true;
	};

	CCellFrameManager.prototype.sendLoadImages = function (arrImages, token, bNotShowError)
	{
		this.sendFromFrameToGeneralEditor(new CFrameImageData(arrImages, token, bNotShowError));
	}

	CCellFrameManager.prototype.sendFromFrameToGeneralEditor = function (oSendObject)
	{
		this.api.sendFromFrameToGeneralEditor(oSendObject);
	};

	CCellFrameManager.prototype.sendFromGeneralToFrameEditor = function (oSendObject)
	{
		this.api.sendFromGeneralToFrameEditor(oSendObject);
	};

	function COleCellFrameManager()
	{
		CCellFrameManager.call(this);
		this.imageWidthCoefficient = null;
		this.imageHeightCoefficient = null;
		this.isFromSheetEditor = false;
		this.isCreatingOleObject = false;
	}

	InitClassWithoutType(COleCellFrameManager, CCellFrameManager);
	COleCellFrameManager.prototype.clear = function ()
	{
		this.imageWidthCoefficient = null;
		this.imageHeightCoefficient = null;
		this.isFromSheetEditor = false;
		this.isCreatingOleObject = false;
	}
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
			'binary'               : this.getWorkbookBinary(),
			'base64Image'          : this.getBase64Image(),
			'imagesForAddToHistory': this.getImagesForHistory(),
			'widthCoefficient'     : this.getImageWidthCoefficient(),
			'heightCoefficient'    : this.getImageHeightCoefficient()
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
		if (!oInfo)
		{
			oInfo = {"binary": AscCommon.getEmpty()};
			this.isCreatingOleObject = true;
		}
		this.isFromSheetEditor = oInfo["isFromSheetEditor"];
		this.calculateImageSaveCoefficients(oInfo["imageHeight"], oInfo["imageWidth"]);
		CCellFrameManager.prototype.obtain.call(this, oInfo);
	}
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
		oApi.fAfterLoad = function ()
		{
			if (oThis.isCreatingOleObject)
			{
				AscFormat.ExecuteNoHistory(function ()
				{
					const oFirstWorksheet = oThis.api.wbModel.getWorksheet(0);
					if (oFirstWorksheet)
					{
						oFirstWorksheet.sName = '';
						const sName = oThis.api.wbModel.getUniqueSheetNameFrom(AscCommon.translateManager.getValue(AscCommonExcel.g_sNewSheetNamePattern), false);
						oFirstWorksheet.setName(sName);
						oThis.api.sheetsChanged();
					}
				}, oThis, []);
			}
			oThis.api.wb.scrollToOleSize();
			// добавляем первый поинт после загрузки, чтобы в локальную историю добавился либо стандартный oleSize, либо заданный пользователем
			const oleSize = oApi.wb.getOleSize();
			oleSize.addPointToLocalHistory();

			oApi.wb.onFrameEditorReady();
			oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Open);
			delete oApi.fAfterLoad;
		}
	};
	COleCellFrameManager.prototype.openWorkbookData = function (sStream)
	{
		this.setAfterLoadCallback();
		CCellFrameManager.prototype.openWorkbookData.call(this, sStream);
	}

	COleCellFrameManager.prototype.isOleEditor = function ()
	{
		return true;
	};


	function CDiagramCellFrameManager(oApi)
	{
		CCellFrameManager.call(this, oApi);
		this.arrAfterLoadCallbacks = [];
		this.mainDiagram = null;
	}
	InitClassWithoutType(CDiagramCellFrameManager, CCellFrameManager);

	CDiagramCellFrameManager.prototype.clear = function ()
	{
		this.arrAfterLoadCallbacks = [];
		this.mainDiagram = null;
	};
	CDiagramCellFrameManager.prototype.isDiagramEditor = function ()
	{
		return true;
	};
	CDiagramCellFrameManager.prototype.updateProtectChart = function (bProtect)
	{
		if (bProtect && this.api.canEdit())
		{
			this.api.asc_addRestriction(Asc.c_oAscRestrictionType.View);
		} else if (!bProtect && !this.api.canEdit())
		{
			this.api.asc_removeRestriction(Asc.c_oAscRestrictionType.View);
		}
		this.api.sendEvent('asc_onShowProtectedChartPopup', bProtect);
	};
	CDiagramCellFrameManager.prototype.repairDiagramXLSX = function ()
	{
		const oThis = this;
		AscFormat.ExecuteNoHistory(function ()
		{
			AscCommonExcel.executeInR1C1Mode(false,
				function ()
				{
					oThis.fillWorkbookFromDiagramCache();
				});
		}, this, []);
	}
	CDiagramCellFrameManager.prototype.fillWorkbookFromDiagramCache = function ()
	{
		const worksheet = this.api.wb.getWorksheet();
		const model = worksheet.model;
		const oMaxRange = this.mainDiagram.fillWorksheetFromCache(model);
		worksheet._updateRange(oMaxRange);
		worksheet.draw();
	}
	CDiagramCellFrameManager.prototype.setMainDiagram = function (oInfo)
	{
		AscFormat.ExecuteNoHistory(function ()
		{
			const asc_chart_binary = new Asc.asc_CChartBinary();
			asc_chart_binary.asc_setBinary(oInfo["binary"]);
			const oModel = this.api.wb.getWorksheet().model;
			const oNewChartSpace = asc_chart_binary.getChartSpace(oModel);
			oNewChartSpace.setWorksheet(oModel);

			oNewChartSpace.convertToFrameChart();
			this.mainDiagram = oNewChartSpace;
		}, this, []);
	}
	CDiagramCellFrameManager.prototype.preObtain = function (oInfo)
	{
		this.setAfterLoadCallback(oInfo);
		if (oInfo["workbookBinary"])
		{
			this.obtain({"binary": oInfo["workbookBinary"], "documentImageUrls": oInfo["documentImageUrls"], "openOnClient": oInfo["isOpenWorkbookOnClient"]});
		}
		else
		{
			this.obtainWithRepair({"binary": AscCommon.getEmpty(), "documentImageUrls": oInfo["documentImageUrls"]});
		}
	}
	CDiagramCellFrameManager.prototype.obtainWithRepair = function (oInfo)
	{
		this.setRepairAfterLoadCallback();
		this.obtain(oInfo);
	}
	CDiagramCellFrameManager.prototype.setRepairAfterLoadCallback = function ()
	{
		this.arrAfterLoadCallbacks.push(this.repairDiagramXLSX.bind(this));
	}
	CDiagramCellFrameManager.prototype.selectMainDiagram = function ()
	{
		const oWb = this.api.wb;
		const oController = this.api.getGraphicController();
		const oWs = oWb.getWorksheet();
		if (oWs)
		{
			oController.resetSelection();
			oWs.objectRender.selectDrawingObjectRange(this.mainDiagram)
			oController.selectObject(this.mainDiagram, this.api.asc_getActiveWorksheetIndex());
			oWs.setSelectionShape(true);
			oWs.draw();
		}
	};
	CDiagramCellFrameManager.prototype.setAfterLoadCallback = function (oInfo)
	{
		const oApi = this.api;
		const oThis = this;
		oApi.fAfterLoad = function ()
		{
			oThis.setMainDiagram(oInfo);
			for (let i = 0; i < oThis.arrAfterLoadCallbacks.length; i += 1)
			{
				oThis.arrAfterLoadCallbacks[i]();
			}
			oThis.selectMainDiagram();
			oThis.api.wb.onFrameEditorReady();
			if (oThis.mainDiagram.isExternal())
			{
				oThis.updateProtectChart(true);
			}
			else
			{
				oThis.updateProtectChart(false);
			}
			oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Open);
			delete oApi.fAfterLoad;
		}
	}

	CDiagramCellFrameManager.prototype.getBinary = function ()
	{
		const noHistory = !AscCommon.History.Can_Undo();
		if (noHistory)
		{
			const oRet = {};
			oRet['noHistory'] = true;
			return oRet;
		}
		else
		{
			const oDiagramBinary = new Asc.asc_CChartBinary(this.mainDiagram);
			oDiagramBinary["workbookBinary"] = this.getWorkbookBinary();
			oDiagramBinary["imagesForAddToHistory"] = this.getImagesForHistory();
			return oDiagramBinary;
		}
	}

	CDiagramCellFrameManager.prototype.updateGeneralDiagramCache = function (aRanges)
	{
		const aRefsToChange = [];
		this.mainDiagram.collectIntersectionRefs(aRanges, aRefsToChange);
		for (let i = 0; i < aRefsToChange.length; i += 1)
		{
			aRefsToChange[i].updateCacheAndCat();
		}
		if (aRefsToChange.length)
		{
			this.sendUpdateDiagram();
		}
	};
	CDiagramCellFrameManager.prototype.sendUpdateDiagram = function ()
	{
		this.sendFromFrameToGeneralEditor(new CFrameUpdateDiagramData(this.mainDiagram, true));
	};

	CDiagramCellFrameManager.prototype.getAscSettings = function ()
	{
		const oProps = this.mainDiagram.getAscSettings();
		const oThis = this;

		oProps.setFUpdateGeneralChart(function (bSelectFrameChartRange)
		{
			oThis.sendUpdateDiagram();
			if (bSelectFrameChartRange)
			{
				oThis.selectMainDiagram();
			}
		});
		return oProps;
	};

	function CFrameUpdateDiagramData(oDiagram, bNoHistory)
	{
		const oBinary = new Asc.asc_CChartBinary(oDiagram);
		const oData = {"binary": oBinary, "noHistory": !!bNoHistory};
		CFrameData.call(this, AscCommon.c_oAscFrameDataType.UpdateDiagramInGeneral, oData);
	}

	function CGeneralUpdateDiagramData(oData)
	{
		CFrameData.call(this, AscCommon.c_oAscFrameDataType.UpdateDiagramInFrame, oData);
	}


	function CFrameData(type, information)
	{
		this["information"] = information;
		this["type"] = type;
	}

	function CFrameImageData(arrImages, token, bNotShowError)
	{
		const oData = {
			"images"       : arrImages,
			"token"        : token,
			"bNotShowError": bNotShowError
		}
		CFrameData.call(this, AscCommon.c_oAscFrameDataType.SendImageUrls, oData);
	}


	function CFrameBinaryLoader()
	{
		this.api = Asc.editor || editor;
		this.binary = null;
	}
	CFrameBinaryLoader.prototype.loadFrame = function ()
	{

	}
	CFrameBinaryLoader.prototype.isOpenedFrame = function ()
	{
		return true;
	}
	CFrameBinaryLoader.prototype.isOpenedChartFrame = function ()
	{
		return false;
	};
	CFrameBinaryLoader.prototype.isOpenedOleFrame = function ()
	{
		return false;
	};
	CFrameBinaryLoader.prototype.destroy = function ()
	{
		this.api.frameLoader = null;
	}


	function CFrameDiagramBinaryLoader(oChart, fCallback)
	{
		CFrameBinaryLoader.call(this);
		this.chart = oChart;
		this.canLoad = true;
		this.XLSXBase64 = null;
		this.fCallback = fCallback || this.resolvePromise.bind(this);
		const isLocalDesktop = window["AscDesktopEditor"] && window["AscDesktopEditor"]["IsLocalFile"]();
		this.isOpenOnClient = this.api["asc_isSupportFeature"]("ooxml") && !isLocalDesktop;
	}
	InitClassWithoutType(CFrameDiagramBinaryLoader, CFrameBinaryLoader);

	CFrameDiagramBinaryLoader.getBase64 = function (arrStream)
	{
		const nDataSize = arrStream.length;
		const sData = AscCommon.Base64.encode(arrStream);
		return "XLSY;v2;" + nDataSize + ";" + sData;
	};

	CFrameDiagramBinaryLoader.prototype.createChartSpace = function (nType, oPlaceholder)
	{

	};
	CFrameDiagramBinaryLoader.prototype.isOpenedChartFrame = function ()
	{
		return true;
	};

	CFrameDiagramBinaryLoader.prototype.canLoadFrame = function ()
	{
		return this.canLoad;
	};
	CFrameDiagramBinaryLoader.prototype.getBinaryChart = function ()
	{
		const oBinaryChart = new Asc.asc_CChartBinary(this.chart);
		oBinaryChart.setWorkbookBinary(this.XLSXBase64);
		oBinaryChart.setOpenWorkbookOnClient(this.isOpenOnClient);
		return oBinaryChart;

	};
	CFrameDiagramBinaryLoader.prototype.setXLSX = function (sStream)
	{
		if (sStream && sStream.length)
		{
			if (typeof sStream === 'string')
			{
				this.XLSXBase64 = sStream;
			}
			else
			{
				this.XLSXBase64 = Array.from(sStream);
			}
		}
		else
		{
			this.XLSXBase64 = null;
		}
	};
	CFrameDiagramBinaryLoader.prototype.resolveFromArray = function (arrValues)
	{
		const isLocalDesktop = window["AscDesktopEditor"] && window["AscDesktopEditor"]["IsLocalFile"]();
		let arrStream;
		if (arrValues && arrValues.length === 1)
		{
			arrStream = arrValues[0].stream;
			if (!this.isOpenOnClient)
			{
				if (!isLocalDesktop) {
					//xlst
					let jsZlib = new AscCommon.ZLib();
					if (jsZlib.open(arrStream))
					{
						if (jsZlib.files && jsZlib.files.length) {
							arrStream = jsZlib.getFile(jsZlib.files[0]);
						}
					}
					else
					{
						arrStream = null;
					}
				}
			}
		}
		this.fCallback(arrStream ? Array.from(arrStream) : arrStream);
	}
	CFrameDiagramBinaryLoader.prototype.resolvePromise = function (sStream)
	{
		if (this.isTruthStream(sStream))
		{
			this.setXLSX(sStream);
			this.loadFrame();
		}
		this.endLoadWorksheet();
	};

	CFrameDiagramBinaryLoader.prototype.setCanLoad = function (bPr)
	{
		this.canLoad = bPr;
	}
	CFrameDiagramBinaryLoader.prototype.isExternal = function ()
	{
		return this.chart.isExternal()
	}
	CFrameDiagramBinaryLoader.prototype.isTruthStream = function (arrStream)
	{
		return (arrStream && (arrStream.length !== 0)) || !this.isExternal();
	}
	CFrameDiagramBinaryLoader.prototype.startLoadWorksheet = function ()
	{
		this.api.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Waiting);
	};
	CFrameDiagramBinaryLoader.prototype.endLoadWorksheet = function ()
	{
		this.api.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Waiting);
	};

	CFrameDiagramBinaryLoader.prototype.loadExternal = function ()
	{
		const oExternalDataChartManager = new AscCommon.CExternalDataLoader([this.getAscLink()], this.api, this.resolveFromArray.bind(this));
		oExternalDataChartManager.updateExternalData();
	}
	CFrameDiagramBinaryLoader.prototype.resolve = function ()
	{
		if (this.isExternal())
		{
			this.loadExternal();
		}
		else
		{
			const oPromise = this.getNestedPromise();
			oPromise.then(this.fCallback);
		}
	}
	CFrameDiagramBinaryLoader.prototype.tryOpen = function ()
	{
		this.startLoadWorksheet();
		this.resolve();
	};

	CFrameDiagramBinaryLoader.prototype.loadFrame = function ()
	{
		this.api.asc_onOpenChartFrame();
		if(!window['IS_NATIVE_EDITOR'])
		{
			this.api.WordControl.onMouseUpMainSimple();
		}
		this.api.frameManager.startLoadChartEditor();
		this.api.sendEvent('asc_doubleClickOnChart', this.getBinaryChart());
	};
	CFrameDiagramBinaryLoader.prototype.getAscLink = function ()
	{
		const oExternalReference = this.chart.getExternalReference();
		return oExternalReference.getAscLink();
	}
	CFrameDiagramBinaryLoader.prototype.getNestedPromise = function ()
	{
		const oThis = this;
		return new Promise(function (resolve)
		{
			resolve(oThis.chart.XLSX.length ? CFrameDiagramBinaryLoader.getBase64(oThis.chart.XLSX) : null);
		});
	}

	function CDiagramUpdater(oChart)
	{
		this.chart = oChart;
		this.api = Asc.editor || editor;
		this.frameLoader = new CFrameDiagramBinaryLoader(this.chart, this.resolvePromise.bind(this));
	}

	CDiagramUpdater.prototype.update = function ()
	{
		this.frameLoader.startLoadWorksheet();
		this.frameLoader.resolve();
	};

	CDiagramUpdater.prototype.getChartBinary = function (stream)
	{
		const oChartBinary = new Asc.asc_CChartBinary(this.chart);
		oChartBinary.setOpenWorkbookOnClient(this.frameLoader.isOpenOnClient);
		oChartBinary.setWorkbookBinary(stream);
		return oChartBinary;
	};

	CDiagramUpdater.prototype.resolvePromise = function (sStream)
	{
		if (sStream)
		{
			const oBinaryData = this.getChartBinary(sStream);
			oBinaryData.setWorkbookBinary(sStream);
			this.sendToFrameEditor(oBinaryData);
		}
		else
		{
			this.frameLoader.endLoadWorksheet();
			// todo
		}
	};

	CDiagramUpdater.prototype.sendToFrameEditor = function (oBinary)
	{
		this.api.sendFromGeneralToFrameEditor(new CGeneralUpdateDiagramData(oBinary));
	}

	window["AscCommon"].CDiagramCellFrameManager = CDiagramCellFrameManager;
	window["AscCommon"].CMainEditorFrameManager  = CMainEditorFrameManager;
	window["AscCommon"].COleCellFrameManager = COleCellFrameManager;
	window["AscCommon"].CFrameDiagramBinaryLoader = CFrameDiagramBinaryLoader;
	window["AscCommon"].CDiagramUpdater = CDiagramUpdater;
	window["AscCommon"].CFrameUpdateDiagramData = CFrameUpdateDiagramData;
})(window);