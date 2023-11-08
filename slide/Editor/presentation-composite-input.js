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
	 * Class for composite input in presentations
	 * @param presentation {AscCommonSlide.CPresentation}
	 * @constructor
	 */
	function PresentationCompositeInput(presentation) {
		this.presentation = presentation;
		this.compositeInput = new AscWord.RunCompositeInput(true);
		this.inUse = false;
	}

	PresentationCompositeInput.prototype.isInProgress = function () {
		return this.inUse;
	};

	PresentationCompositeInput.prototype.begin = function () {
		if (this.isInProgress())
			return;

		const presentation = this.presentation;
		const currentSlide = presentation.GetCurrentSlide();
		if (!presentation.FocusOnNotes && currentSlide && currentSlide.graphicObjects.selectedObjects.length === 0) {
			const title = currentSlide.getMatchingShape(AscFormat.phType_title, null);
			if (title) {
				const content = title.getDocContent();
				if (content.Is_Empty()) {
					content.Set_CurrentElement(0, false);
				} else {
					return;
				}
			} else {
				return;
			}
		}

		if (this.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props, null, undefined, undefined, true)) {
			return false;
		}

		presentation.StartAction(AscDFH.historydescription_Document_CompositeInput);
		const controller = presentation.GetCurrentController();
		if (controller) {
			controller.CreateDocContent();
		}

		const content = presentation.Get_TargetDocContent();
		if (!content) {
			presentation.History.Remove_LastPoint();
			return false;
		}

		presentation.DrawingDocument.TargetStart();
		presentation.DrawingDocument.TargetShow();
		const paragraph = content.GetCurrentParagraph();
		if (!paragraph) {
			presentation.History.Remove_LastPoint();
			return false;
		}
		if (true === content.IsSelectionUse())
			content.Remove(1, true, false, true);
		const run = paragraph.Get_ElementByPos(paragraph.Get_ParaContentPos(false, false));
		if (!run || !(run instanceof ParaRun)) {
			presentation.History.Remove_LastPoint();
			return false;
		}

		this.compositeInput.begin(run);

		presentation.FinalizeAction();
		this.inUse = true;
		return true;
	};
	PresentationCompositeInput.prototype.end = function () {
		if (!this.isInProgress()) {
			return;
		}

		this.validateInput();
		this.compositeInput.end();

		this.presentation.UpdateInterface();
		this.presentation.RecalculateCurPos(true, true);
		this.presentation.private_UpdateCursorXY(true, true);
		this.presentation.DrawingDocument.ClearCachePages();
		this.presentation.DrawingDocument.FirePaint();

		this.inUse = false;
	};
	PresentationCompositeInput.prototype.replace = function (codePoints) {
		let runInput = this.compositeInput;
		this.doAction(function () {
			runInput.replace(codePoints);
		});
	};
	PresentationCompositeInput.prototype.remove = function (count) {
		let runInput = this.compositeInput;
		this.doAction(function () {
			runInput.remove(count);
		});
	};
	PresentationCompositeInput.prototype.add = function (codePoint) {
		let runInput = this.compositeInput;
		this.doAction(function () {
			runInput.add(codePoint);
		});
	};
	PresentationCompositeInput.prototype.setPos = function (pos) {
		if (!this.isInProgress())
			return;

		this.compositeInput.setPos(pos);
	};
	PresentationCompositeInput.prototype.getPos = function () {
		if (!this.isInProgress())
			return 0;

		return this.compositeInput.getPos();
	};
	PresentationCompositeInput.prototype.getMaxPos = function () {
		if (!this.isInProgress())
			return 0;

		return this.compositeInput.getLength();
	};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	PresentationCompositeInput.prototype.validateInput = function () {
		if (0 !== this.compositeInput.getLength())
			return;

		let changes = AscCommon.History.UndoCompositeInput();
		if (changes) {
			AscCommon.History.ClearRedo();
			this.presentation.UpdateAfterUndoRedo(changes);
		}
	};
	PresentationCompositeInput.prototype.doAction = function (actionFunc) {
		if (!this.isInProgress())
			return;

		let presentation = this.presentation;
		presentation.StartAction(AscDFH.historydescription_Document_CompositeInputReplace);

		actionFunc();

		presentation.checkCurrentTextObjectExtends();
		presentation.Recalculate();
		presentation.UpdateSelection();
		presentation.UpdateUndoRedo();
		presentation.FinalizeAction(false);

		this.presentation.RecalculateCurPos(true, true);
		this.presentation.private_UpdateCursorXY(true, true);
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscCommonSlide.PresentationCompositeInput = PresentationCompositeInput;

})(window);

