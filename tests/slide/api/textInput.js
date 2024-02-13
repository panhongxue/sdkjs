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
		CreateLogicDocument,
		SelectDrawings,
		GetDrawingObjects,
		GetParagraphText,
		EnterText,
		CorrectEnterText,
		BeginCompositeInput,
		ReplaceCompositeInput,
		EndCompositeInput,
		EnterTextCompositeInput,
		ClearShapeAndAddParagraph,
		AddTextArt,
		StartCollaboration,
		SyncCollaboration,
		EndCollaboration
	} = AscTest;
	let logicDocument = CreateLogicDocument();

	editor.asc_GetRevisionsChangesStack = Asc.asc_docs_api.prototype.asc_GetRevisionsChangesStack.bind(editor);
	editor.asc_createSmartArt = Asc.asc_docs_api.prototype.asc_createSmartArt.bind(editor);
	editor._createSmartArt = Asc.asc_docs_api.prototype._createSmartArt.bind(editor);

	editor.textArtPreviewManager = new AscCommon.TextArtPreviewManager();
	editor.textArtPreviewManager.initStyles();

	// disable fit font size
	AscFormat.SmartArt.prototype.fitFontSize = function () {};
	AscFormat.CShape.prototype.setTruthFontSizeInSmartArt = function () {};

	function AddSmartArt() {
		return editor.asc_createSmartArt(Asc.c_oAscSmartArtTypes.BasicBlockList).then((oSmartArt) => {
			const oFirstShape = oSmartArt.spTree[0].spTree[0];
			SelectDrawings([oSmartArt]);
			oSmartArt.selectObject(oFirstShape, 0);
			oSmartArt.selection.textSelection = oFirstShape;
			GetDrawingObjects().selection.groupSelection = oSmartArt;
			const paragraph = oFirstShape.txBody.content.GetAllParagraphs()[0];
			return {smartArt: oSmartArt, paragraph: paragraph};
		});
	}

	logicDocument.addNextSlide(0);

	QUnit.module("Check text input in the presentation editor");
	QUnit.test("EnterText/CorrectEnterText/CompositeInput", function (assert) {
		const TestWithParagraph = (paragraph) => {
			logicDocument.SelectAll();
			assert.strictEqual(logicDocument.GetSelectedText(), "", "Check empty selection");

			logicDocument.AddTextWithPr("Hello World!");

			logicDocument.SelectAll();
			assert.strictEqual(logicDocument.GetSelectedText(false, {NewLineParagraph: true}), "Hello World!\r\n", "Add text 'Hello World!'");

			logicDocument.MoveCursorToStartPos();
			logicDocument.MoveCursorRight();
			logicDocument.MoveCursorRight();

			EnterText("123");
			assert.strictEqual(GetParagraphText(paragraph), "He123llo World!", "Add text '123'");

			EnterText("AA");
			assert.strictEqual(GetParagraphText(paragraph), "He123AAllo World!", "Add text 'AA'");

			CorrectEnterText("AB", "ABC");
			assert.strictEqual(GetParagraphText(paragraph), "He123AAllo World!", "Check wrong correction AB to ABC");

			CorrectEnterText("AA", "ABC");
			assert.strictEqual(GetParagraphText(paragraph), "He123ABCllo World!", "Check correction AA to ABC");

			EnterText("DD");
			logicDocument.MoveCursorLeft();
			CorrectEnterText("DD", "CC");
			assert.strictEqual(GetParagraphText(paragraph), "He123ABCDDllo World!", "Add text DD move left and check wrong correction");

			logicDocument.MoveCursorToEndPos();
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

			AscTest.ClearParagraph(paragraph);
			EnterTextCompositeInput("x");
			EnterTextCompositeInput("yz");
			CorrectEnterText("yz", "x");
			assert.strictEqual(GetParagraphText(paragraph), "xx", "Test special case, when added symbols collect to a single grapheme with previous symbols");
		};

		const done = assert.async();
		AddSmartArt().then(({paragraph}) => {
			TestWithParagraph(paragraph);
			done();
		});

		TestWithParagraph(ClearShapeAndAddParagraph("").paragraph);

		const textArt = AddTextArt();
		logicDocument.SelectAll();
		logicDocument.Remove();
		TestWithParagraph(textArt.paragraph);

	});
	QUnit.test("EnterText/CorrectEnterText/CompositeInput in collaboration", function (assert) {
		assert.timeout(1000);
		const TestWithParagraph = (paragraph) => {
			EnterText("ABC");
			assert.strictEqual(GetParagraphText(paragraph), "ABC", "Add text 'ABC' in collaboration");
			logicDocument.MoveCursorLeft();
			EnterText("111");
			SyncCollaboration();
			CorrectEnterText("11", "23");
			SyncCollaboration();
			assert.strictEqual(GetParagraphText(paragraph), "AB123C", "Add text '111' and correct it with '123' in collaboration (sync between actions)");

			EnterText("QQQ");
			CorrectEnterText("QQ", "RS");
			SyncCollaboration();
			assert.strictEqual(GetParagraphText(paragraph), "AB123QRSC", "Add text '111' and correct it with '123' in collaboration (no sync between actions)");
		};
		StartCollaboration(true);
		TestWithParagraph(ClearShapeAndAddParagraph("").paragraph);
		const textArt = AddTextArt();
		logicDocument.SelectAll();
		logicDocument.Remove();
		TestWithParagraph(textArt.paragraph);
		EndCollaboration();

		const done = assert.async();
		AddSmartArt().then(({paragraph}) => {
			StartCollaboration(true);
			TestWithParagraph(paragraph);
			done();
			EndCollaboration();
		});
	});
});
