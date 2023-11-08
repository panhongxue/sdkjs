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

$(function () {

	const {
		EnterText,
		CorrectEnterText,
		BeginCompositeInput,
		ReplaceCompositeInput,
		EndCompositeInput,
		AddTextWithPr,
		EnterTextCompositeInput,
		GetParagraphText,
		ClearShapeAndAddParagraph,
		GetDrawingObjects,
		InitEditor,
		StartCollaboration,
		SyncCollaboration,
		EndCollaboration,
		SelectRange,
		GetCellEditorText,
		GetSelectedCellEditorText
	} = AscTest;

	QUnit.config.autostart = false;
	let editor;
	let wb;
	let wbView;
	let wsView;
	let cellEditor;
	InitEditor(() => {
		editor = Asc.editor;
		wb = editor.wbModel;
		wbView = editor.wb;
		cellEditor = wbView.cellEditor;
		wsView = wbView.getWorksheet();
		QUnit.start();
	});

	QUnit.module("Check text input in spreadsheet editor on shapes");
	QUnit.test("EnterText/CorrectEnterText/CompositeInput", function (assert) {
		wsView.isSelectOnShape = true;
		const {paragraph} = ClearShapeAndAddParagraph("");
		const controller = GetDrawingObjects();
		wbView.selectAll();
		assert.strictEqual(controller.GetSelectedText(), "", "Check empty selection");

		AddTextWithPr("Hello World!");

		wbView.selectAll();
		assert.strictEqual(controller.GetSelectedText(false, {NewLineParagraph: true}), "Hello World!\r\n", "Add text 'Hello World!'");

		controller.cursorMoveToStartPos();
		controller.cursorMoveRight();
		controller.cursorMoveRight();

		EnterText("123");
		assert.strictEqual(GetParagraphText(paragraph), "He123llo World!", "Add text '123'");

		EnterText("AA");
		assert.strictEqual(GetParagraphText(paragraph), "He123AAllo World!", "Add text 'AA'");

		CorrectEnterText("AB", "ABC");
		assert.strictEqual(GetParagraphText(paragraph), "He123AAllo World!", "Check wrong correction AB to ABC");

		CorrectEnterText("AA", "ABC");
		assert.strictEqual(GetParagraphText(paragraph), "He123ABCllo World!", "Check correction AA to ABC");

		EnterText("DD");
		controller.cursorMoveLeft();
		CorrectEnterText("DD", "CC");
		assert.strictEqual(GetParagraphText(paragraph), "He123ABCDDllo World!", "Add text DD move left and check wrong correction");

		controller.cursorMoveToEndPos();
		EnterText("qq");
		CorrectEnterText("!qq", "!?");
		assert.strictEqual(GetParagraphText(paragraph), "He123ABCDDllo World!?", "Move to the end, add qq and correct !qq to !?");

		BeginCompositeInput();
		ReplaceCompositeInput("WWW");
		ReplaceCompositeInput("123");
		EndCompositeInput();
		assert.strictEqual(GetParagraphText(paragraph), "He123ABCDDllo World!?123", "Add text '123' with composite input");

		EnterTextCompositeInput("Zzz");
		CorrectEnterText("3Zzz", "$");
		assert.strictEqual(GetParagraphText(paragraph), "He123ABCDDllo World!?12$", "Add text 'Zzz' with composite input and correct it from '3Zzz' to '$'");
		wsView.isSelectOnShape = false;
		controller.resetSelection();
	});
	QUnit.test("EnterText/CorrectEnterText/CompositeInput in collaboration", function (assert) {
		wsView.isSelectOnShape = true;
		const controller = GetDrawingObjects();
		StartCollaboration(true);
		const {paragraph} = ClearShapeAndAddParagraph("");
		EnterText("ABC");
		assert.strictEqual(GetParagraphText(paragraph), "ABC", "Add text 'ABC' in collaboration");
		controller.cursorMoveLeft();
		EnterText("111");
		SyncCollaboration();
		CorrectEnterText("11", "23");
		SyncCollaboration();
		assert.strictEqual(GetParagraphText(paragraph), "AB123C", "Add text '111' and correct it with '123' in collaboration (sync between actions)");

		EnterText("QQQ");
		CorrectEnterText("QQ", "RS");
		SyncCollaboration();
		assert.strictEqual(GetParagraphText(paragraph), "AB123QRSC", "Add text '111' and correct it with '123' in collaboration (no sync between actions)");
		wsView.isSelectOnShape = false;
		controller.resetSelection();
	});

	QUnit.module("Check text input in spreadsheet editor on cell editor");
	QUnit.test("EnterText/CorrectEnterText/CompositeInput", function (assert) {
		SelectRange(0, 0, 0, 0, 0, 0);
		assert.strictEqual(GetSelectedCellEditorText(), "", "Check empty selection");

		AddTextWithPr("Hello World!");

		wbView.selectAll();
		assert.strictEqual(GetSelectedCellEditorText(), "Hello World!", "Add text 'Hello World!'");

		cellEditor._moveCursor(AscCommonExcel.cellEditorMoveTypes.kBeginOfText);
		cellEditor._moveCursor(AscCommonExcel.cellEditorMoveTypes.kNextChar);
		cellEditor._moveCursor(AscCommonExcel.cellEditorMoveTypes.kNextChar);

		EnterText("123");
		assert.strictEqual(GetCellEditorText(), "He123llo World!", "Add text '123'");

		EnterText("AA");
		assert.strictEqual(GetCellEditorText(), "He123AAllo World!", "Add text 'AA'");

		CorrectEnterText("AB", "ABC");
		assert.strictEqual(GetCellEditorText(), "He123AAllo World!", "Check wrong correction AB to ABC");

		CorrectEnterText("AA", "ABC");
		assert.strictEqual(GetCellEditorText(), "He123ABCllo World!", "Check correction AA to ABC");

		EnterText("DD");
		cellEditor._moveCursor(AscCommonExcel.cellEditorMoveTypes.kPrevChar);
		CorrectEnterText("DD", "CC");
		assert.strictEqual(GetCellEditorText(), "He123ABCDDllo World!", "Add text DD move left and check wrong correction");

		cellEditor._moveCursor(AscCommonExcel.cellEditorMoveTypes.kEndOfText);
		EnterText("qq");
		CorrectEnterText("!qq", "!?");
		assert.strictEqual(GetCellEditorText(), "He123ABCDDllo World!?", "Move to the end, add qq and correct !qq to !?");

		BeginCompositeInput();
		ReplaceCompositeInput("WWW");
		ReplaceCompositeInput("123");
		EndCompositeInput();
		assert.strictEqual(GetCellEditorText(), "He123ABCDDllo World!?123", "Add text '123' with composite input");

		EnterTextCompositeInput("Zzz");
		CorrectEnterText("3Zzz", "$");
		assert.strictEqual(GetCellEditorText(), "He123ABCDDllo World!?12$", "Add text 'Zzz' with composite input and correct it from '3Zzz' to '$'");
	});
});
