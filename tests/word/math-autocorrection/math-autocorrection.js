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
	let logicDocument = AscTest.CreateLogicDocument();
	let ParaMath = null;
	AscCommonWord.CMathContent.prototype.Recalculate_Range = function (){}

	function Create()
	{
		AscTest.ClearDocument();
		let oParagraph = AscTest.CreateParagraph();
		logicDocument.AddToContent(0, oParagraph);

		let oParaMath = new AscCommonWord.ParaMath();
		oParaMath.Root.CorrectContent()
		oParagraph.AddToContent(0, oParaMath);

		ParaMath = oParaMath;
		return oParaMath;
	}
	function AddTextToRoot(str)
	{
		let one = str.getUnicodeIterator();
		while (one.isInside())
		{
			let oElement = new AscWord.CRunText(one.value());
			ParaMath.Add(oElement);
			one.next();
		}
	}

	QUnit.module("Stacked Fraction - Convert");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("/");
		assert.ok(true, "Add '/'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "/", "Check linear content");
	});
	QUnit.test("Add fraction with pre-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("1/");
		assert.ok(true, "Add '1/'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "1/", "Check linear content");
	});
	QUnit.test("Add fraction with post-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("/x");
		assert.ok(true, "Add '/x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "/x", "Check linear content");
	});
	QUnit.test("Add fraction with bi-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("y/x");
		assert.ok(true, "Add 'y/x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "y", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "y/x", "Check linear content");
	});
	QUnit.test("Add fraction with pre block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+2)/");
		assert.ok(true, "Add '(1+2)/'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+2", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+2)/", "Check linear content");
	});
	QUnit.test("Add fraction with post block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("/(1+2)");
		assert.ok(true, "Add '/(1+2)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "1+2", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "/(1+2)", "Check linear content");
	});
	QUnit.test("Add fraction with bi block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+y)/(x+d)");
		assert.ok(true, "Add '(1+y)/(x+d)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+y", "Check content of Numerator is 1+y");
		assert.strictEqual(strDenominator, "x+d", "Check content of Denominator is 'x+d'");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+y)/(x+d)", "Check linear content");
	});
	QUnit.test("Add long numerator content fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("23245yhgfvdsw34354/");
		assert.ok(true, "Add '23245yhgfvdsw34354/'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "23245yhgfvdsw34354", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "23245yhgfvdsw34354/", "Check linear content");
	});
	QUnit.test("Add inner bracket in fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("((a+c))/d");
		assert.ok(true, "Add '((a+c))/d'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(a+c)/d", "Check linear content");
	});

	QUnit.module("Skewed Fraction - Convert");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⁄");
		assert.ok(true, "Add '⁄'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⁄", "Check linear content");
	});
	QUnit.test("Add fraction with pre-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("1⁄");
		assert.ok(true, "Add '1⁄'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "1⁄", "Check linear content");
	});
	QUnit.test("Add fraction with post-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⁄x");
		assert.ok(true, "Add '⁄x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⁄x", "Check linear content");
	});
	QUnit.test("Add fraction with bi-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("y⁄x");
		assert.ok(true, "Add 'y⁄x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "y", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "y⁄x", "Check linear content");
	});
	QUnit.test("Add fraction with pre block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+2)⁄");
		assert.ok(true, "Add '(1+2)⁄'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+2", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+2)⁄", "Check linear content");
	});
	QUnit.test("Add fraction with post block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⁄(1+2)");
		assert.ok(true, "Add '⁄(1+2)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "1+2", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⁄(1+2)", "Check linear content");
	});
	QUnit.test("Add fraction with bi block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+y)⁄(x+d)");
		assert.ok(true, "Add '(1+y)⁄(x+d)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+y", "Check content of Numerator is 1+y");
		assert.strictEqual(strDenominator, "x+d", "Check content of Denominator is 'x+d'");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+y)⁄(x+d)", "Check linear content");
	});
	QUnit.test("Add long numerator content fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("23245yhgfvdsw34354⁄");
		assert.ok(true, "Add '23245yhgfvdsw34354⁄'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "23245yhgfvdsw34354", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "23245yhgfvdsw34354⁄", "Check linear content");
	});
	QUnit.test("Add inner bracket in fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("((a+c))⁄d");
		assert.ok(true, "Add '((a+c))⁄d'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(a+c)⁄d", "Check linear content");
	});

	QUnit.module("Linear Fraction - Convert");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⊘");
		assert.ok(true, "Add '⊘'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⊘", "Check linear content");
	});
	QUnit.test("Add fraction with pre-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("1⊘");
		assert.ok(true, "Add '1⊘'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "1⊘", "Check linear content");
	});
	QUnit.test("Add fraction with post-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⊘x");
		assert.ok(true, "Add '⊘x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⊘x", "Check linear content");
	});
	QUnit.test("Add fraction with bi-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("y⊘x");
		assert.ok(true, "Add 'y⊘x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "y", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "y⊘x", "Check linear content");
	});
	QUnit.test("Add fraction with pre block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+2)⊘");
		assert.ok(true, "Add '(1+2)⊘'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+2", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+2)⊘", "Check linear content");
	});
	QUnit.test("Add fraction with post block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⊘(1+2)");
		assert.ok(true, "Add '⊘(1+2)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "1+2", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⊘(1+2)", "Check linear content");
	});
	QUnit.test("Add fraction with bi block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+y)⊘(x+d)");
		assert.ok(true, "Add '(1+y)⊘(x+d)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+y", "Check content of Numerator is 1+y");
		assert.strictEqual(strDenominator, "x+d", "Check content of Denominator is 'x+d'");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+y)⊘(x+d)", "Check linear content");
	});
	QUnit.test("Add long numerator content fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("23245yhgfvdsw34354⊘");
		assert.ok(true, "Add '23245yhgfvdsw34354⊘'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "23245yhgfvdsw34354", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "23245yhgfvdsw34354⊘", "Check linear content");
	});
	QUnit.test("Add inner bracket in fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("((a+c))⊘d");
		assert.ok(true, "Add '((a+c))⊘d'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(a+c)⊘d", "Check linear content");
	});

	QUnit.module("Binomial Fraction - Convert");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("¦");
		assert.ok(true, "Add '¦'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "¦", "Check linear content");
	});
	QUnit.test("Add fraction with pre-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("1¦");
		assert.ok(true, "Add '1¦'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "1¦", "Check linear content");
	});
	QUnit.test("Add fraction with post-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("¦x");
		assert.ok(true, "Add '¦x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "¦x", "Check linear content");
	});
	QUnit.test("Add fraction with bi-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("y¦x");
		assert.ok(true, "Add 'y¦x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "y", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "y¦x", "Check linear content");
	});
	QUnit.test("Add fraction with pre block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+2)¦");
		assert.ok(true, "Add '(1+2)¦'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+2", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+2)¦", "Check linear content");
	});
	QUnit.test("Add fraction with post block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("¦(1+2)");
		assert.ok(true, "Add '¦(1+2)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "1+2", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "¦(1+2)", "Check linear content");
	});
	QUnit.test("Add fraction with bi block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+y)¦(x+d)");
		assert.ok(true, "Add '(1+y)¦(x+d)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+y", "Check content of Numerator is 1+y");
		assert.strictEqual(strDenominator, "x+d", "Check content of Denominator is 'x+d'");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+y)¦(x+d)", "Check linear content");
	});
	QUnit.test("Add long numerator content fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("23245yhgfvdsw34354¦");
		assert.ok(true, "Add '23245yhgfvdsw34354¦'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "23245yhgfvdsw34354", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "23245yhgfvdsw34354¦", "Check linear content");
	});
	QUnit.test("Add inner bracket in fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("((a+c))¦d");
		assert.ok(true, "Add '((a+c))¦d'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(a+c)¦d", "Check linear content");
	});

	QUnit.module("Fraction - Autocorrection");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("/ ");
		assert.ok(true, "Add '/ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator is empty");
		assert.strictEqual(strDenominator, "", "Check content of Denominator is empty");
	});
})
