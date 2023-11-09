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

(function (window) {
	/**
	 * Class for composite input in table shapes
	 * @param drawingObjects {AscFormat.DrawingObjects}
	 * @constructor
	 */
	function DrawingCompositeInput(drawingObjects) {
		this.drawingObjects = drawingObjects;
		this.controller = drawingObjects.controller;
		this.compositeInput = new AscWord.RunCompositeInput(true);
		this.inUse = false;
	}

	DrawingCompositeInput.prototype.isInProgress = function () {
		return this.inUse;
	};
	DrawingCompositeInput.prototype.begin = function () {
		if (this.isInProgress())
			return;

		const drawingObjects = this.drawingObjects;
		const controller = this.controller;
		if (!controller.canEdit()) {
			return;
		}
		if (this.controller.checkSelectedObjectsProtectionText()) {
			return;
		}
		History.Create_NewPoint(AscDFH.historydescription_Document_CompositeInput);
		controller.CreateDocContent();
		drawingObjects.drawingDocument.TargetStart();
		drawingObjects.drawingDocument.TargetShow();
		const content = controller.getTargetDocContent(true);
		if (!content) {
			return false;
		}
		const paragraph = content.GetCurrentParagraph();
		if (!paragraph) {
			return false;
		}
		if (true === content.IsSelectionUse())
			content.Remove(1, true, false, true);
		const run = paragraph.Get_ElementByPos(paragraph.Get_ParaContentPos(false, false));
		if (!run || !(run instanceof ParaRun)) {
			return false;
		}

		this.compositeInput.begin(run);

		controller.startRecalculate();
		drawingObjects.sendGraphicObjectProps();
		controller.recalculateCurPos(true, true);

		this.inUse = true;
		return true;
	};
	DrawingCompositeInput.prototype.end = function () {
		if (!this.isInProgress()) {
			return;
		}

		this.validateInput();
		this.compositeInput.end();

		this.controller.recalculateCurPos(true, true);
		this.drawingObjects.sendGraphicObjectProps();
		this.controller.updateDrawingTextCache();
		this.drawingObjects.showDrawingObjects();

		this.inUse = false;
	};
	DrawingCompositeInput.prototype.replace = function (codePoints) {
		let runInput = this.compositeInput;
		this.doAction(function () {
			runInput.replace(codePoints);
		});
	};
	DrawingCompositeInput.prototype.remove = function (count) {
		let runInput = this.compositeInput;
		this.doAction(function () {
			runInput.remove(count);
		});
	};
	DrawingCompositeInput.prototype.add = function (codePoint) {
		let runInput = this.compositeInput;
		this.doAction(function () {
			runInput.add(codePoint);
		});
	};
	DrawingCompositeInput.prototype.setPos = function (pos) {
		if (!this.isInProgress())
			return;

		this.compositeInput.setPos(pos);
		this.controller.recalculateCurPos(true, true);
		this.controller.updateSelectionState();
	};
	DrawingCompositeInput.prototype.getPos = function () {
		if (!this.isInProgress())
			return 0;

		return this.compositeInput.getPos();
	};
	DrawingCompositeInput.prototype.getMaxPos = function () {
		if (!this.isInProgress())
			return 0;

		return this.compositeInput.getLength();
	};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	DrawingCompositeInput.prototype.validateInput = function () {
		if (0 !== this.compositeInput.getLength())
			return;

		if (AscCommon.History.UndoCompositeInput()) {
			AscCommon.History.ClearRedo();
			this.controller.recalculate2();
			AscCommon.History._sendCanUndoRedo();
		}
	};
	DrawingCompositeInput.prototype.doAction = function (actionFunc) {
		if (!this.isInProgress())
			return;

		AscCommon.History.Create_NewPoint(AscDFH.historydescription_Document_CompositeInputReplace);

		actionFunc();

		this.drawingObjects.checkCurrentTextObjectExtends();
		this.controller.startRecalculate();
		this.controller.recalculateCurPos(true, true);
		this.controller.updateSelectionState();
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscCommon.DrawingCompositeInput = DrawingCompositeInput;
})(window);
