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
	function CreateAutocorrection(str)
	{
		for (let i = 0; i < str.length; i++)
		{
			let strCurrent = str[i];
			QUnit.test("Check " + strCurrent, function (assert)
			{
				let r = Create();
				assert.ok(true, "Create math equation");

				AddTextToRoot(strCurrent + " ");
				assert.ok(true, "'" + strCurrent + " " + "'");

				r.ConvertView(false, 0);
				assert.ok(true, "Convert to professional");

				let oFraction = r.Root.Content[0];
				assert.ok(oFraction instanceof ParaRun, "Created " + strCurrent);
			});
		}
	}

	QUnit.module("Autocorrection - Simple check");

	CreateAutocorrection('abcdefghijklmnopqrstuvwxyz0123456789')

	QUnit.module("Getting text and comparing framing brackets with Word");

	QUnit.test("(2+x)/[x+2]", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(2+x)/[x+2]");
		assert.ok(true, "Add '(2+x)/[x+2]'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "2+x", "Check content of Numerator");
		assert.strictEqual(strDenominator, "[x+2]", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(2+x)/[x+2]", "Check linear content");
	});
	QUnit.test("x/[x+2]", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x/[x+2]");
		assert.ok(true, "Add 'x/[x+2]'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "x", "Check content of Numerator");
		assert.strictEqual(strDenominator, "[x+2]", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x/[x+2]", "Check linear content");
	});
	QUnit.test("(y+2)_x", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(y+2)_x");
		assert.ok(true, "Add '(y+2)_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(y+2)", "Check content of degree base");
		assert.strictEqual(strIterator, "x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(y+2)_x", "Check linear content");
	});
	QUnit.test("[y+2]_x", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("[y+2]_x");
		assert.ok(true, "Add '[y+2]_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "[y+2]", "Check content of degree base");
		assert.strictEqual(strIterator, "x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "[y+2]_x", "Check linear content");
	});
	QUnit.test("(y+2)_(x+1)", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(y+2)_(x+1)");
		assert.ok(true, "Add '(y+2)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(y+2)", "Check content of degree base");
		assert.strictEqual(strIterator, "x+1", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(y+2)_(x+1)", "Check linear content");
	});
	QUnit.test("[y+2]_[x*4]", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("[y+2]_[x*4]");
		assert.ok(true, "Add '[y+2]_[x*4]'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "[y+2]", "Check content of degree base");
		assert.strictEqual(strIterator, "[x*4]", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "[y+2]_[x*4]", "Check linear content");
	});
	QUnit.test("(y+2)^x", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(y+2)^x");
		assert.ok(true, "Add '(y+2)^x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(y+2)", "Check content of degree base");
		assert.strictEqual(strIterator, "x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(y+2)^x", "Check linear content");
	});
	QUnit.test("[y+2]^x", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("[y+2]^x");
		assert.ok(true, "Add '[y+2]^x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "[y+2]", "Check content of degree base");
		assert.strictEqual(strIterator, "x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "[y+2]^x", "Check linear content");
	});
	QUnit.test("(y+2)^(x+1)", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(y+2)^(x+1)");
		assert.ok(true, "Add '(y+2)^(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(y+2)", "Check content of degree base");
		assert.strictEqual(strIterator, "x+1", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(y+2)^(x+1)", "Check linear content");
	});
	QUnit.test("[y+2]^[x*4]", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("[y+2]^[x*4]");
		assert.ok(true, "Add '[y+2]^[x*4]'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "[y+2]", "Check content of degree base");
		assert.strictEqual(strIterator, "[x*4]", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "[y+2]^[x*4]", "Check linear content");
	});
	QUnit.test("(y+2)^x_u", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(y+2)^x_u");
		assert.ok(true, "Add '(y+2)^x_u'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase				= oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator	= oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator	= oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(y+2)", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "x", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "u", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(y+2)_u^x", "Check linear content");
	});
	QUnit.test("[y+2]^x_u", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("[y+2]^x_u");
		assert.ok(true, "Add '[y+2]^x_u'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase				= oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator	= oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator	= oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "[y+2]", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "x", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "u", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "[y+2]_u^x", "Check linear content");
	});
	QUnit.test("(y+2)^(x+1)_(g-i)", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(y+2)^(x+1)_(g-i)");
		assert.ok(true, "Add '(y+2)^(x+1)_(g-i)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase				= oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator	= oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator	= oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(y+2)", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "x+1", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "g-i", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(y+2)_(g-i)^(x+1)", "Check linear content");
	});
	QUnit.test("[y+2]^[x*4]_{f-h}", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("[y+2]^[x*4]_{f-h}");
		assert.ok(true, "Add '[y+2]^[x*4]_{f-h}'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase				= oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator	= oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator	= oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "[y+2]", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "[x*4]", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "{f-h}", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "[y+2]_{f-h}^[x*4]", "Check linear content");
	});
	QUnit.test("√5", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√5");
		assert.ok(true, "Add '√5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5", "Check content of degree base");
		assert.strictEqual(strDegree, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√5", "Check linear content");
	});
	QUnit.test("√(5+1)", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√(5+1)");
		assert.ok(true, "Add '√(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+1", "Check content of degree base");
		assert.strictEqual(strDegree, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√(5+1)", "Check linear content");
	});
	QUnit.test("√[5+1]", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√[5+1]");
		assert.ok(true, "Add '√[5+1]'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "[5+1]", "Check content of degree base");
		assert.strictEqual(strDegree, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√[5+1]", "Check linear content");
	});
	QUnit.test("√[5&5+1]", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√[5&5+1]");
		assert.ok(true, "Add '√[5&5+1]'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+1", "Check content of degree base");
		assert.strictEqual(strDegree, "5", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√(5&5+1)", "Check linear content");
	});
	QUnit.test("√[(5+3)&5+1]", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√[(5+3)&5+1]");
		assert.ok(true, "Add '√[(5+3)&5+1]'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+1", "Check content of degree base");
		assert.strictEqual(strDegree, "(5+3)", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√((5+3)&5+1)", "Check linear content");
	});
	QUnit.test("⋀_(2/1)^[g+2]▒1", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀_(2/1)^[g+2]▒1 ");
		assert.ok(true, "Add '⋀_(2/1)^[g+2]▒1 '");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "1", "Check content of nary base");
		assert.strictEqual(strLower, "2/1", "Check content of nary lower");
		assert.strictEqual(strUpper, "[g+2]", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_(2/1)^[g+2]▒1", "Check linear content");
	});
	QUnit.test("⋀_2^g▒[1+x]", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀_2^g▒[1+x]");
		assert.ok(true, "⋀_2^g▒[1+x]'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "[1+x]", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "g", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_2^g▒[1+x]", "Check linear content");
	});
	QUnit.test("⋀_2^g▒(1+x)", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀_2^g▒(1+x)");
		assert.ok(true, "Add '⋀_2^g▒(1+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "(1+x)", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "g", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_2^g▒(1+x)", "Check linear content");
	});
	QUnit.test("⋀_2^g▒〖1+1/2〗", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀_2^g▒〖1+1/2〗");
		assert.ok(true, "Add '⋀_2^g▒〖1+1/2〗'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "1+1/2", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "g", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_2^g▒〖1+1/2〗", "Check linear content");
	});
	QUnit.test("⋀_(2/1)^[g+2]▒1/2", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀_(2/1)^[g+2]▒1/2");
		assert.ok(true, "Add '⋀_(2/1)^[g+2]▒1/2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "1/2", "Check content of nary base");
		assert.strictEqual(strLower, "2/1", "Check content of nary lower");
		assert.strictEqual(strUpper, "[g+2]", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_(2/1)^[g+2]▒1/2", "Check linear content");
	});

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "((a+c))/d", "Check linear content");
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
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "((a+c))⁄d", "Check linear content");
	});

	QUnit.module("Linear Fraction - Convert");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∕");
		assert.ok(true, "Add '∕'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∕", "Check linear content");
	});
	QUnit.test("Add fraction with pre-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("1∕");
		assert.ok(true, "Add '1∕'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "1∕", "Check linear content");
	});
	QUnit.test("Add fraction with post-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∕x");
		assert.ok(true, "Add '∕x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∕x", "Check linear content");
	});
	QUnit.test("Add fraction with bi-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("y∕x");
		assert.ok(true, "Add 'y∕x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "y", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "y∕x", "Check linear content");
	});
	QUnit.test("Add fraction with pre block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+2)∕");
		assert.ok(true, "Add '(1+2)∕'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+2", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+2)∕", "Check linear content");
	});
	QUnit.test("Add fraction with post block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∕(1+2)");
		assert.ok(true, "Add '∕(1+2)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "1+2", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∕(1+2)", "Check linear content");
	});
	QUnit.test("Add fraction with bi block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+y)∕(x+d)");
		assert.ok(true, "Add '(1+y)∕(x+d)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+y", "Check content of Numerator is 1+y");
		assert.strictEqual(strDenominator, "x+d", "Check content of Denominator is 'x+d'");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+y)∕(x+d)", "Check linear content");
	});
	QUnit.test("Add long numerator content fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("23245yhgfvdsw34354∕");
		assert.ok(true, "Add '23245yhgfvdsw34354∕'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "23245yhgfvdsw34354", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "23245yhgfvdsw34354∕", "Check linear content");
	});
	QUnit.test("Add inner bracket in fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("((a+c))∕d");
		assert.ok(true, "Add '((a+c))∕d'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "((a+c))∕d", "Check linear content");
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
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "((a+c))¦d", "Check linear content");
	});

	QUnit.module("Fractions words - Autocorrection");

	QUnit.test("\\sdiv", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\sdiv ");
		assert.ok(true, "Add '\\sdiv '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⁄", "Check correction");
	});
	QUnit.test("\\atop", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\atop ");
		assert.ok(true, "Add '\\atop '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "¦", "Check correction");
	});
	QUnit.test("\\ldiv", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\ldiv ");
		assert.ok(true, "Add '\\ldiv '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∕", "Check correction");
	});
	QUnit.test("\\ndiv", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\ndiv ");
		assert.ok(true, "Add '\\ndiv '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⊘", "Check correction");
	});

	QUnit.module("Stacked Fraction - Autocorrection");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("/ ");
		assert.ok(true, "Add '/ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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

		AddTextToRoot("1/ ");
		assert.ok(true, "Add '1/ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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

		AddTextToRoot("/x ");
		assert.ok(true, "Add '/x '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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

		AddTextToRoot("y/x ");
		assert.ok(true, "Add 'y/x '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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

		AddTextToRoot("(1+2)/ ");
		assert.ok(true, "Add '(1+2)/ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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

		AddTextToRoot("/(1+2) ");
		assert.ok(true, "Add '/(1+2) '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

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
		assert.ok(oFraction.Pr.type === 0, "Stacked Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "((a+c))/d", "Check linear content");
	});

	QUnit.module("Skewed Fraction - Autocorrection");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⁄ ");
		assert.ok(true, "Add '⁄ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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

		AddTextToRoot("1⁄ ");
		assert.ok(true, "Add '1⁄ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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

		AddTextToRoot("⁄x ");
		assert.ok(true, "Add '⁄x '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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

		AddTextToRoot("y⁄x ");
		assert.ok(true, "Add 'y⁄x '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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

		AddTextToRoot("(1+2)⁄ ");
		assert.ok(true, "Add '(1+2)⁄ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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

		AddTextToRoot("⁄(1+2) ");
		assert.ok(true, "Add '⁄(1+2) '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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

		AddTextToRoot("(1+y)⁄(x+d) ");
		assert.ok(true, "Add '(1+y)⁄(x+d) '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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

		AddTextToRoot("23245yhgfvdsw34354⁄ ");
		assert.ok(true, "Add '23245yhgfvdsw34354⁄ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

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

		AddTextToRoot("((a+c))⁄d ");
		assert.ok(true, "Add '((a+c))⁄d '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 1, "Skewed Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "((a+c))⁄d", "Check linear content");
	});

	QUnit.module("Linear Fraction - Autocorrection");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∕ ");
		assert.ok(true, "Add '∕ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∕", "Check linear content");
	});
	QUnit.test("Add fraction with pre-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("1∕ ");
		assert.ok(true, "Add '1∕ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "1∕", "Check linear content");
	});
	QUnit.test("Add fraction with post-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∕x ");
		assert.ok(true, "Add '∕x '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∕x", "Check linear content");
	});
	QUnit.test("Add fraction with bi-content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("y∕x ");
		assert.ok(true, "Add 'y∕x '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "y", "Check content of Numerator");
		assert.strictEqual(strDenominator, "x", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "y∕x", "Check linear content");
	});
	QUnit.test("Add fraction with pre block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+2)∕ ");
		assert.ok(true, "Add '(1+2)∕ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+2", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+2)∕", "Check linear content");
	});
	QUnit.test("Add fraction with post block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∕(1+2) ");
		assert.ok(true, "Add '∕(1+2) '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "", "Check content of Numerator");
		assert.strictEqual(strDenominator, "1+2", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∕(1+2)", "Check linear content");
	});
	QUnit.test("Add fraction with bi block content", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(1+y)∕(x+d) ");
		assert.ok(true, "Add '(1+y)∕(x+d) '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "1+y", "Check content of Numerator is 1+y");
		assert.strictEqual(strDenominator, "x+d", "Check content of Denominator is 'x+d'");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(1+y)∕(x+d)", "Check linear content");
	});
	QUnit.test("Add long numerator content fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("23245yhgfvdsw34354∕ ");
		assert.ok(true, "Add '23245yhgfvdsw34354∕ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "23245yhgfvdsw34354", "Check content of Numerator");
		assert.strictEqual(strDenominator, "", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "23245yhgfvdsw34354∕", "Check linear content");
	});
	QUnit.test("Add inner bracket in fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("((a+c))∕d ");
		assert.ok(true, "Add '((a+c))∕d '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 2, "Linear Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "((a+c))∕d", "Check linear content");
	});

	QUnit.module("Binomial Fraction - Autocorrection");

	QUnit.test("Add empty fraction", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("¦ ");
		assert.ok(true, "Add '¦ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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

		AddTextToRoot("1¦ ");
		assert.ok(true, "Add '1¦ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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

		AddTextToRoot("¦x ");
		assert.ok(true, "Add '¦x '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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

		AddTextToRoot("y¦x ");
		assert.ok(true, "Add 'y¦x '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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

		AddTextToRoot("(1+2)¦ ");
		assert.ok(true, "Add '(1+2)¦ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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

		AddTextToRoot("¦(1+2) ");
		assert.ok(true, "Add '¦(1+2) '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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

		AddTextToRoot("(1+y)¦(x+d) ");
		assert.ok(true, "Add '(1+y)¦(x+d) '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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

		AddTextToRoot("23245yhgfvdsw34354¦ ");
		assert.ok(true, "Add '23245yhgfvdsw34354¦ '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

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

		AddTextToRoot("((a+c))¦d ");
		assert.ok(true, "Add '((a+c))¦d '");

		let oFraction = r.Root.Content[1];
		assert.ok(oFraction instanceof CFraction, "Created CFraction");
		assert.ok(oFraction.Pr.type === 3, "Binomial Fraction type");

		let strNumerator = oFraction.getNumerator().GetTextOfElement().GetText();
		let strDenominator = oFraction.getDenominator().GetTextOfElement().GetText();

		assert.strictEqual(strNumerator, "(a+c)", "Check content of Numerator");
		assert.strictEqual(strDenominator, "d", "Check content of Denominator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "((a+c))¦d", "Check linear content");
	});

	QUnit.module("Scripts - Convert");

	QUnit.test("Add empty up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("^");
		assert.ok(true, "Add '^'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "^", "Check linear content");
	});
	QUnit.test("Add empty down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("_");
		assert.ok(true, "Add '_'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "_", "Check linear content");
	});
	QUnit.test("Add empty base up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("^2");
		assert.ok(true, "Add '^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "^2", "Check linear content");
	});
	QUnit.test("Add empty base down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("_2");
		assert.ok(true, "Add '_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "_2", "Check linear content");
	});
	QUnit.test("Add empty base up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("^(2+x)");
		assert.ok(true, "Add '^(2+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "2+x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "^(2+x)", "Check linear content");
	});
	QUnit.test("Add empty base down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("_(2+x)");
		assert.ok(true, "Add '_(2+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "2+x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "_(2+x)", "Check linear content");
	});

	QUnit.test("Add up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x^2");
		assert.ok(true, "Add 'x^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x^2", "Check linear content");
	});
	QUnit.test("Add down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x_2");
		assert.ok(true, "Add 'x_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_2", "Check linear content");
	});
	QUnit.test("Add block up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(x*y)^(2+x)");
		assert.ok(true, "Add '(x*y)^(2+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(x*y)", "Check content of degree base");
		assert.strictEqual(strIterator, "2+x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(x*y)^(2+x)", "Check linear content");
	});
	QUnit.test("Add block base down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(x*y)_(2+x)");
		assert.ok(true, "Add '(x*y)_(2+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(x*y)", "Check content of degree base");
		assert.strictEqual(strIterator, "2+x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(x*y)_(2+x)", "Check linear content");
	});

	QUnit.test("Add up down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x^2_y");
		assert.ok(true, "Add 'x^2_y'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "y", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_y^2", "Check linear content");
	});
	QUnit.test("Add up down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x_2^y");
		assert.ok(true, "Add 'x_2^y'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_2^y", "Check linear content");
	});
	QUnit.test("Add up down block script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x^(2+y)_(x+b)");
		assert.ok(true, "Add 'x^(2+y)_(x+b)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2+y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "x+b", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_(x+b)^(2+y)", "Check linear content");
	});
	QUnit.test("Add up down block script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x_(x+b)^(2+y)");
		assert.ok(true, "Add 'x_(x+b)^(2+y)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2+y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "x+b", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_(x+b)^(2+y)", "Check linear content");
	});
	QUnit.test("Add up down base block script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(x*c)^(2+y)_(x+b)");
		assert.ok(true, "Add '(x*c)^(2+y)_(x+b)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(x*c)", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2+y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "x+b", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(x*c)_(x+b)^(2+y)", "Check linear content");
	});
	QUnit.test("Add up down base script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(x*c)_(x+b)^(2+y)");
		assert.ok(true, "Add '(x*c)_(x+b)^(2+y)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(x*c)", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2+y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "x+b", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(x*c)_(x+b)^(2+y)", "Check linear content");
	});

	QUnit.module("Scripts - Autocorrection");

	QUnit.test("Add empty up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("^ ");
		assert.ok(true, "Add '^ '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "^", "Check linear content");
	});
	QUnit.test("Add empty down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("_ ");
		assert.ok(true, "Add '_ '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "_", "Check linear content");
	});
	QUnit.test("Add empty base up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("^2 ");
		assert.ok(true, "Add '^2 '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "^2", "Check linear content");
	});
	QUnit.test("Add empty base down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("_2 ");
		assert.ok(true, "Add '_2 '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "_2", "Check linear content");
	});
	QUnit.test("Add empty base up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("^(2+x) ");
		assert.ok(true, "Add '^(2+x) '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "2+x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "^(2+x)", "Check linear content");
	});
	QUnit.test("Add empty base down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("_(2+x) ");
		assert.ok(true, "Add '_(2+x) '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strIterator, "2+x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "_(2+x)", "Check linear content");
	});

	QUnit.test("Add up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x^2 ");
		assert.ok(true, "Add 'x^2 '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x^2", "Check linear content");
	});
	QUnit.test("Add down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x_2 ");
		assert.ok(true, "Add 'x_2 '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_2", "Check linear content");
	});
	QUnit.test("Add block up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(x*y)^(2+x) ");
		assert.ok(true, "Add '(x*y)^(2+x) '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(x*y)", "Check content of degree base");
		assert.strictEqual(strIterator, "2+x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(x*y)^(2+x)", "Check linear content");
	});
	QUnit.test("Add block base down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(x*y)_(2+x) ");
		assert.ok(true, "Add '(x*y)_(2+x) '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(x*y)", "Check content of degree base");
		assert.strictEqual(strIterator, "2+x", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(x*y)_(2+x)", "Check linear content");
	});

	QUnit.test("Add up down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x^2_y ");
		assert.ok(true, "Add 'x^2_y '");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "y", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_y^2", "Check linear content");
	});
	QUnit.test("Add up down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x_2^y ");
		assert.ok(true, "Add 'x_2^y '");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_2^y", "Check linear content");
	});
	QUnit.test("Add up down block script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x^(2+y)_(x+b) ");
		assert.ok(true, "Add 'x^(2+y)_(x+b) '");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2+y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "x+b", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_(x+b)^(2+y)", "Check linear content");
	});
	QUnit.test("Add up down block script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x_(x+b)^(2+y) ");
		assert.ok(true, "Add 'x_(x+b)^(2+y) '");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "x", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2+y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "x+b", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_(x+b)^(2+y)", "Check linear content");
	});
	QUnit.test("Add up down base block script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(x*c)^(2+y)_(x+b) ");
		assert.ok(true, "Add '(x*c)^(2+y)_(x+b) '");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(x*c)", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2+y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "x+b", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(x*c)_(x+b)^(2+y)", "Check linear content");
	});
	QUnit.test("Add up down base script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("(x*c)_(x+b)^(2+y) ");
		assert.ok(true, "Add '(x*c)_(x+b)^(2+y) '");

		let oDegreeSubSup = r.Root.Content[1];
		assert.ok(oDegreeSubSup instanceof CDegreeSubSup, "Created CDegreeSubSup");

		let strBase = oDegreeSubSup.getBase().GetTextOfElement().GetText();
		let strUpperIterator = oDegreeSubSup.getUpperIterator().GetTextOfElement().GetText();
		let strLowerIterator = oDegreeSubSup.getLowerIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "(x*c)", "Check content of degree base");
		assert.strictEqual(strUpperIterator, "2+y", "Check content of degree iterator");
		assert.strictEqual(strLowerIterator, "x+b", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "(x*c)_(x+b)^(2+y)", "Check linear content");
	});

	QUnit.test("Add chain up script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x^2^3^4^5^6^7 ");
		assert.ok(true, "Add 'x^2^3^4^5^6^7 '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === 1, "Upper CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "6", "Check content of degree base");
		assert.strictEqual(strIterator, "7", "Check content of degree iterator");

		AddTextToRoot(" ");
		oDegree = r.Root.Content[1];
		strBase = oDegree.getBase().GetTextOfElement().GetText();
		strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5", "Check content of degree base");
		assert.strictEqual(strIterator, "6^7", "Check content of degree iterator");

		AddTextToRoot(" ");
		oDegree = r.Root.Content[1];
		strBase = oDegree.getBase().GetTextOfElement().GetText();
		strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "4", "Check content of degree base");
		assert.strictEqual(strIterator, "5^(6^7)", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x^2^3^4^(5^(6^7))", "Check linear content");
	});
	QUnit.test("Add chain down script", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("x_2_3_4_5_6_7 ");
		assert.ok(true, "Add 'x_2_3_4_5_6_7 '");

		let oDegree = r.Root.Content[1];
		assert.ok(oDegree instanceof CDegree, "Created CDegree");
		assert.ok(oDegree.Pr.type === -1, "Down CDegree type");

		let strBase = oDegree.getBase().GetTextOfElement().GetText();
		let strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "6", "Check content of degree base");
		assert.strictEqual(strIterator, "7", "Check content of degree iterator");

		AddTextToRoot(" ");
		oDegree = r.Root.Content[1];
		strBase = oDegree.getBase().GetTextOfElement().GetText();
		strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5", "Check content of degree base");
		assert.strictEqual(strIterator, "6_7", "Check content of degree iterator");

		AddTextToRoot(" ");
		oDegree = r.Root.Content[1];
		strBase = oDegree.getBase().GetTextOfElement().GetText();
		strIterator = oDegree.getIterator().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "4", "Check content of degree base");
		assert.strictEqual(strIterator, "5_(6_7)", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "x_2_3_4_(5_(6_7))", "Check linear content");
	});

	//todo prescript

	QUnit.module("Radicals words - Autocorrection");

	QUnit.test("\\sqrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\sqrt ");
		assert.ok(true, "Add '\\sqrt '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "√", "Check correction");
	});
	QUnit.test("\\cbrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\cbrt ");
		assert.ok(true, "Add '\\cbrt '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∛", "Check correction");
	});
	QUnit.test("\\qdrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\qdrt ");
		assert.ok(true, "Add '\\qdrt '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∜", "Check correction");
	});

	QUnit.module("Radicals - Convert");
	QUnit.test("Add empty radical", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√");
		assert.ok(true, "Add '√'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strDegree, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√", "Check linear content");
	});
	QUnit.test("Add radical", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√5");
		assert.ok(true, "Add '√5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5", "Check content of degree base");
		assert.strictEqual(strDegree, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√5", "Check linear content");
	});
	QUnit.test("Add block radical", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√(5+x)");
		assert.ok(true, "Add '√(5+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√(5+x)", "Check linear content");
	});
	QUnit.test("Add block radical with degree", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√(2&5+x)");
		assert.ok(true, "Add '√(2&5+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√(2&5+x)", "Check linear content");
	});
	QUnit.test("Add block radical with degree", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√(2+y&5+x)");
		assert.ok(true, "Add '√(2+y&5+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "2+y", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√(2+y&5+x)", "Check linear content");
	});

	QUnit.test("Add empty cbrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∛");
		assert.ok(true, "Add '∛'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strDegree, "3", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∛", "Check linear content");
	});
	QUnit.test("Add cbrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∛5");
		assert.ok(true, "Add '∛5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5", "Check content of degree base");
		assert.strictEqual(strDegree, "3", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∛5", "Check linear content");
	});
	QUnit.test("Add block cbrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∛(5+x)");
		assert.ok(true, "Add '∛(5+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "3", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∛(5+x)", "Check linear content");
	});

	QUnit.test("Add empty qdrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∜");
		assert.ok(true, "Add '∜'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strDegree, "4", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∜", "Check linear content");
	});
	QUnit.test("Add qdrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∜5");
		assert.ok(true, "Add '∜5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5", "Check content of degree base");
		assert.strictEqual(strDegree, "4", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∜5", "Check linear content");
	});
	QUnit.test("Add block qdrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∜(5+x)");
		assert.ok(true, "Add '∜(5+x)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "4", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∜(5+x)", "Check linear content");
	});

	QUnit.module("Radicals - Autocorrection");

	QUnit.test("Add empty radical", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√ ");
		assert.ok(true, "Add '√ '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strDegree, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√", "Check linear content");
	});
	QUnit.test("Add radical", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√5 ");
		assert.ok(true, "Add '√5 '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5", "Check content of degree base");
		assert.strictEqual(strDegree, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√5", "Check linear content");
	});
	QUnit.test("Add block radical", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√(5+x) ");
		assert.ok(true, "Add '√(5+x) '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√(5+x)", "Check linear content");
	});
	QUnit.test("Add block radical with degree", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√(2&5+x) ");
		assert.ok(true, "Add '√(2&5+x) '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "2", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√(2&5+x)", "Check linear content");
	});
	QUnit.test("Add block radical with degree", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("√(2+y&5+x) ");
		assert.ok(true, "Add '√(2+y&5+x) '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "2+y", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "√(2+y&5+x)", "Check linear content");
	});

	QUnit.test("Add empty cbrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∛ ");
		assert.ok(true, "Add '∛ '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strDegree, "3", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∛", "Check linear content");
	});
	QUnit.test("Add cbrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∛5 ");
		assert.ok(true, "Add '∛5 '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5", "Check content of degree base");
		assert.strictEqual(strDegree, "3", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∛5", "Check linear content");
	});
	QUnit.test("Add block cbrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∛(5+x) ");
		assert.ok(true, "Add '∛(5+x) '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "3", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∛(5+x)", "Check linear content");
	});

	QUnit.test("Add empty qdrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∜ ");
		assert.ok(true, "Add '∜ '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "", "Check content of degree base");
		assert.strictEqual(strDegree, "4", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∜", "Check linear content");
	});
	QUnit.test("Add qdrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∜5 ");
		assert.ok(true, "Add '∜5 '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5", "Check content of degree base");
		assert.strictEqual(strDegree, "4", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∜5", "Check linear content");
	});
	QUnit.test("Add block qdrt", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∜(5+x) ");
		assert.ok(true, "Add '∜(5+x) '");

		let oRadical = r.Root.Content[1];
		assert.ok(oRadical instanceof CRadical, "Created CRadical");

		let strBase = oRadical.getBase().GetTextOfElement().GetText();
		let strDegree = oRadical.getDegree().GetTextOfElement().GetText();

		assert.strictEqual(strBase, "5+x", "Check content of degree base");
		assert.strictEqual(strDegree, "4", "Check content of degree iterator");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∜(5+x)", "Check linear content");
	});

	QUnit.module("Nary words - Autocorrection");

	QUnit.test("\\int", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\int ");
		assert.ok(true, "Add '\\int '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∫", "Check correction");
	});
	QUnit.test("\\iint", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\iint ");
		assert.ok(true, "Add '\\iint '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∬", "Check correction");
	});
	QUnit.test("\\iiint", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\iiint ");
		assert.ok(true, "Add '\\iiint '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∭", "Check correction");
	});
	QUnit.test("\\iiiint", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\iiiint ");
		assert.ok(true, "Add '\\iiiint '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⨌", "Check correction");
	});
	QUnit.test("\\oint", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\oint ");
		assert.ok(true, "Add '\\oint '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∮", "Check correction");
	});
	QUnit.test("\\oiint", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\oiint ");
		assert.ok(true, "Add '\\oiint '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∯", "Check correction");
	});
	QUnit.test("\\oiiint", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\oiiint ");
		assert.ok(true, "Add '\\oiiint '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∰", "Check correction");
	});
	QUnit.test("\\prod", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\prod ");
		assert.ok(true, "Add '\\prod '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∏", "Check correction");
	});
	QUnit.test("\\sum", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\sum ");
		assert.ok(true, "Add '\\sum '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∑", "Check correction");
	});
	QUnit.test("\\coint", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\coint ");
		assert.ok(true, "Add '\\coint '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∲", "Check correction");
	});
	QUnit.test("\\amalg", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\amalg ");
		assert.ok(true, "Add '\\amalg '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∐", "Check correction");
	});
	QUnit.test("\\aoint", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\aoint ");
		assert.ok(true, "Add '\\aoint '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "∳", "Check correction");
	});
	QUnit.test("\\bigcap", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\bigcap ");
		assert.ok(true, "Add '\\bigcap '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⋂", "Check correction");
	});
	QUnit.test("\\bigcup", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\bigcup ");
		assert.ok(true, "Add '\\bigcup '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⋃", "Check correction");
	});
	QUnit.test("\\bigodot", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\bigodot ");
		assert.ok(true, "Add '\\bigodot '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⨀", "Check correction");
	});
	QUnit.test("\\bigoplus", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\bigoplus ");
		assert.ok(true, "Add '\\bigoplus '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⨁", "Check correction");
	});
	QUnit.test("\\bigotimes", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\bigotimes ");
		assert.ok(true, "Add '\\bigotimes '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⨂", "Check correction");
	});
	QUnit.test("\\bigsqcup", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\bigsqcup ");
		assert.ok(true, "Add '\\bigsqcup '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⨆", "Check correction");
	});
	QUnit.test("\\biguplus", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\biguplus ");
		assert.ok(true, "Add '\\biguplus '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⨄", "Check correction");
	});
	QUnit.test("\\bigvee", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\bigvee ");
		assert.ok(true, "Add '\\bigvee '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⋁", "Check correction");
	});
	QUnit.test("\\bigwedge", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("\\bigwedge ");
		assert.ok(true, "Add '\\bigwedge '");

		let strWord = r.Root.GetTextOfElement().GetText();
		assert.strictEqual(strWord, "⋀", "Check correction");
	});

	QUnit.module("Nary - Convert");

	QUnit.test("Add integral empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫");
		assert.ok(true, "Add '∫'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫", "Check linear content");
	});
	QUnit.test("Add integral lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫_2");
		assert.ok(true, "Add '∫_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫_2", "Check linear content");
	});
	QUnit.test("Add integral lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫_(2+1)");
		assert.ok(true, "Add '∫_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫_(2+1)", "Check linear content");
	});
	QUnit.test("Add integral upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫^2");
		assert.ok(true, "Add '∫^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫^2", "Check linear content");
	});
	QUnit.test("Add integral upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫^(2+1)");
		assert.ok(true, "Add '∫^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫^(2+1)", "Check linear content");
	});
	QUnit.test("Add integral upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫^2_x");
		assert.ok(true, "Add '∫^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫_x^2", "Check linear content");
	});
	QUnit.test("Add integral upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫^(2+1)_(x+1)");
		assert.ok(true, "Add '∫^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add integral with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫5");
		assert.ok(true, "Add '∫5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫5", "Check linear content");
	});
	QUnit.test("Add integral with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫(5+1)");
		assert.ok(true, "Add '∫(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫(5+1)", "Check linear content");
	});

	QUnit.test("Add iintegral empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬");
		assert.ok(true, "Add '∬'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬", "Check linear content");
	});
	QUnit.test("Add iintegral lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬_2");
		assert.ok(true, "Add '∬_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬_2", "Check linear content");
	});
	QUnit.test("Add iintegral lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬_(2+1)");
		assert.ok(true, "Add '∬_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬_(2+1)", "Check linear content");
	});
	QUnit.test("Add iintegral upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬^2");
		assert.ok(true, "Add '∬^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬^2", "Check linear content");
	});
	QUnit.test("Add iintegral upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬^(2+1)");
		assert.ok(true, "Add '∬^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬^(2+1)", "Check linear content");
	});
	QUnit.test("Add iintegral upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬^2_x");
		assert.ok(true, "Add '∬^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬_x^2", "Check linear content");
	});
	QUnit.test("Add iintegral upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬^(2+1)_(x+1)");
		assert.ok(true, "Add '∬^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add iintegral with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬5");
		assert.ok(true, "Add '∬5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬5", "Check linear content");
	});
	QUnit.test("Add iintegral with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬(5+1)");
		assert.ok(true, "Add '∬(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬(5+1)", "Check linear content");
	});

	QUnit.test("Add iiintegral empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭");
		assert.ok(true, "Add '∭'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭", "Check linear content");
	});
	QUnit.test("Add iiintegral lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭_2");
		assert.ok(true, "Add '∭_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭_2", "Check linear content");
	});
	QUnit.test("Add iiintegral lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭_(2+1)");
		assert.ok(true, "Add '∭_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭_(2+1)", "Check linear content");
	});
	QUnit.test("Add iiintegral upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭^2");
		assert.ok(true, "Add '∭^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭^2", "Check linear content");
	});
	QUnit.test("Add iiintegral upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭^(2+1)");
		assert.ok(true, "Add '∭^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭^(2+1)", "Check linear content");
	});
	QUnit.test("Add iiintegral upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭^2_x");
		assert.ok(true, "Add '∭^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭_x^2", "Check linear content");
	});
	QUnit.test("Add iiintegralupper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭^(2+1)_(x+1)");
		assert.ok(true, "Add '∭^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add iiintegral with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭5");
		assert.ok(true, "Add '∭5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭5", "Check linear content");
	});
	QUnit.test("Add iiintegral with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭(5+1)");
		assert.ok(true, "Add '∭(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭(5+1)", "Check linear content");
	});

	QUnit.test("Add iiiintegral empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌");
		assert.ok(true, "Add '⨌'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌", "Check linear content");
	});
	QUnit.test("Add iiiintegral lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌_2");
		assert.ok(true, "Add '⨌_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌_2", "Check linear content");
	});
	QUnit.test("Add iiiintegral lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌_(2+1)");
		assert.ok(true, "Add '⨌_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌_(2+1)", "Check linear content");
	});
	QUnit.test("Add iiiintegral upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌^2");
		assert.ok(true, "Add '⨌^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌^2", "Check linear content");
	});
	QUnit.test("Add iiiintegral upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌^(2+1)");
		assert.ok(true, "Add '⨌^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌^(2+1)", "Check linear content");
	});
	QUnit.test("Add iiiintegral upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌^2_x");
		assert.ok(true, "Add '⨌^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌_x^2", "Check linear content");
	});
	QUnit.test("Add iiiintegral upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌^(2+1)_(x+1)");
		assert.ok(true, "Add '⨌^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add iiiintegral with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌5");
		assert.ok(true, "Add '⨌5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌5", "Check linear content");
	});
	QUnit.test("Add iiiintegral with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌(5+1)");
		assert.ok(true, "Add '⨌(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌(5+1)", "Check linear content");
	});

	QUnit.test("Add oint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮");
		assert.ok(true, "Add '∮'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮", "Check linear content");
	});
	QUnit.test("Add oint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮_2");
		assert.ok(true, "Add '∮_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮_2", "Check linear content");
	});
	QUnit.test("Add oint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮_(2+1)");
		assert.ok(true, "Add '∮_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮_(2+1)", "Check linear content");
	});
	QUnit.test("Add oint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮^2");
		assert.ok(true, "Add '∮^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮^2", "Check linear content");
	});
	QUnit.test("Add oint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮^(2+1)");
		assert.ok(true, "Add '∮^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮^(2+1)", "Check linear content");
	});
	QUnit.test("Add oint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮^2_x");
		assert.ok(true, "Add '∮^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮_x^2", "Check linear content");
	});
	QUnit.test("Add oint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮^(2+1)_(x+1)");
		assert.ok(true, "Add '∮^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add oint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮5");
		assert.ok(true, "Add '∮5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮5", "Check linear content");
	});
	QUnit.test("Add oint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮(5+1)");
		assert.ok(true, "Add '∮(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮(5+1)", "Check linear content");
	});

	QUnit.test("Add oiint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯");
		assert.ok(true, "Add '∯'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯", "Check linear content");
	});
	QUnit.test("Add oiint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯_2");
		assert.ok(true, "Add '∯_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯_2", "Check linear content");
	});
	QUnit.test("Add oiint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯_(2+1)");
		assert.ok(true, "Add '∯_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯_(2+1)", "Check linear content");
	});
	QUnit.test("Add oiint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯^2");
		assert.ok(true, "Add '∯^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯^2", "Check linear content");
	});
	QUnit.test("Add oiint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯^(2+1)");
		assert.ok(true, "Add '∯^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯^(2+1)", "Check linear content");
	});
	QUnit.test("Add oiint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯^2_x");
		assert.ok(true, "Add '∯^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯_x^2", "Check linear content");
	});
	QUnit.test("Add oiint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯^(2+1)_(x+1)");
		assert.ok(true, "Add '∯^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add oiint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯5");
		assert.ok(true, "Add '∯5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯5", "Check linear content");
	});
	QUnit.test("Add oiint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯(5+1)");
		assert.ok(true, "Add '∯(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯(5+1)", "Check linear content");
	});

	QUnit.test("Add oiiint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰");
		assert.ok(true, "Add '∰'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰", "Check linear content");
	});
	QUnit.test("Add oiiint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰_2");
		assert.ok(true, "Add '∰_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰_2", "Check linear content");
	});
	QUnit.test("Add oiiint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰_(2+1)");
		assert.ok(true, "Add '∰_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰_(2+1)", "Check linear content");
	});
	QUnit.test("Add oiiint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰^2");
		assert.ok(true, "Add '∰^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰^2", "Check linear content");
	});
	QUnit.test("Add oiiint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰^(2+1)");
		assert.ok(true, "Add '∰^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰^(2+1)", "Check linear content");
	});
	QUnit.test("Add oiiint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰^2_x");
		assert.ok(true, "Add '∰^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰_x^2", "Check linear content");
	});
	QUnit.test("Add oiiint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰^(2+1)_(x+1)");
		assert.ok(true, "Add '∰^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add oiiint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰5");
		assert.ok(true, "Add '∰5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰5", "Check linear content");
	});
	QUnit.test("Add oiiint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰(5+1)");
		assert.ok(true, "Add '∰(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰(5+1)", "Check linear content");
	});

	QUnit.test("Add prod empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏");
		assert.ok(true, "Add '∏'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏", "Check linear content");
	});
	QUnit.test("Add prod lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏_2");
		assert.ok(true, "Add '∏_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏_2", "Check linear content");
	});
	QUnit.test("Add prod lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏_(2+1)");
		assert.ok(true, "Add '∏_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏_(2+1)", "Check linear content");
	});
	QUnit.test("Add prod upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏^2");
		assert.ok(true, "Add '∏^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏^2", "Check linear content");
	});
	QUnit.test("Add prod upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏^(2+1)");
		assert.ok(true, "Add '∏^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏^(2+1)", "Check linear content");
	});
	QUnit.test("Add prod upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏^2_x");
		assert.ok(true, "Add '∏^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏_x^2", "Check linear content");
	});
	QUnit.test("Add prod upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏^(2+1)_(x+1)");
		assert.ok(true, "Add '∏^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add prod with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏5");
		assert.ok(true, "Add '∏5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏5", "Check linear content");
	});
	QUnit.test("Add prod with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏(5+1)");
		assert.ok(true, "Add '∏(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏(5+1)", "Check linear content");
	});

	QUnit.test("Add sum empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑");
		assert.ok(true, "Add '∑'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑", "Check linear content");
	});
	QUnit.test("Add sum lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑_2");
		assert.ok(true, "Add '∑_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑_2", "Check linear content");
	});
	QUnit.test("Add sum lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑_(2+1)");
		assert.ok(true, "Add '∑_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑_(2+1)", "Check linear content");
	});
	QUnit.test("Add sum upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑^2");
		assert.ok(true, "Add '∑^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑^2", "Check linear content");
	});
	QUnit.test("Add sum upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑^(2+1)");
		assert.ok(true, "Add '∑^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑^(2+1)", "Check linear content");
	});
	QUnit.test("Add sum upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑^2_x");
		assert.ok(true, "Add '∑^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑_x^2", "Check linear content");
	});
	QUnit.test("Add sum upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑^(2+1)_(x+1)");
		assert.ok(true, "Add '∑^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add sum with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑5");
		assert.ok(true, "Add '∑5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑5", "Check linear content");
	});
	QUnit.test("Add sum with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑(5+1)");
		assert.ok(true, "Add '∑(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑(5+1)", "Check linear content");
	});

	QUnit.test("Add coint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲");
		assert.ok(true, "Add '∲'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲", "Check linear content");
	});
	QUnit.test("Add coint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲_2");
		assert.ok(true, "Add '∲_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲_2", "Check linear content");
	});
	QUnit.test("Add coint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲_(2+1)");
		assert.ok(true, "Add '∲_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲_(2+1)", "Check linear content");
	});
	QUnit.test("Add coint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲^2");
		assert.ok(true, "Add '∲^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲^2", "Check linear content");
	});
	QUnit.test("Add coint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲^(2+1)");
		assert.ok(true, "Add '∲^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲^(2+1)", "Check linear content");
	});
	QUnit.test("Add coint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲^2_x");
		assert.ok(true, "Add '∲^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲_x^2", "Check linear content");
	});
	QUnit.test("Add coint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲^(2+1)_(x+1)");
		assert.ok(true, "Add '∲^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add coint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲5");
		assert.ok(true, "Add '∲5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲5", "Check linear content");
	});
	QUnit.test("Add coint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲(5+1)");
		assert.ok(true, "Add '∲(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲(5+1)", "Check linear content");
	});

	QUnit.test("Add amalg empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐");
		assert.ok(true, "Add '∐'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐", "Check linear content");
	});
	QUnit.test("Add amalg lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐_2");
		assert.ok(true, "Add '∐_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐_2", "Check linear content");
	});
	QUnit.test("Add amalg lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐_(2+1)");
		assert.ok(true, "Add '∐_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐_(2+1)", "Check linear content");
	});
	QUnit.test("Add amalg upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐^2");
		assert.ok(true, "Add '∐^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐^2", "Check linear content");
	});
	QUnit.test("Add amalg upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐^(2+1)");
		assert.ok(true, "Add '∐^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐^(2+1)", "Check linear content");
	});
	QUnit.test("Add amalg upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐^2_x");
		assert.ok(true, "Add '∐^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐_x^2", "Check linear content");
	});
	QUnit.test("Add amalg upper lower block ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐^(2+1)_(x+1)");
		assert.ok(true, "Add '∐^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add amalg with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐5");
		assert.ok(true, "Add '∐5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐5", "Check linear content");
	});
	QUnit.test("Add amalg with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐(5+1)");
		assert.ok(true, "Add '∐(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐(5+1)", "Check linear content");
	});

	QUnit.test("Add aoint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳");
		assert.ok(true, "Add '∳'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳", "Check linear content");
	});
	QUnit.test("Add aoint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳_2");
		assert.ok(true, "Add '∳_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳_2", "Check linear content");
	});
	QUnit.test("Add aoint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳_(2+1)");
		assert.ok(true, "Add '∳_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳_(2+1)", "Check linear content");
	});
	QUnit.test("Add aoint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳^2");
		assert.ok(true, "Add '∳^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳^2", "Check linear content");
	});
	QUnit.test("Add aoint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳^(2+1)");
		assert.ok(true, "Add '∳^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳^(2+1)", "Check linear content");
	});
	QUnit.test("Add aoint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳^2_x");
		assert.ok(true, "Add '∳^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳_x^2", "Check linear content");
	});
	QUnit.test("Add aoint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳^(2+1)_(x+1)");
		assert.ok(true, "Add '∳^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add aoint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳5");
		assert.ok(true, "Add '∳5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳5", "Check linear content");
	});
	QUnit.test("Add aoint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳(5+1)");
		assert.ok(true, "Add '∳(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳(5+1)", "Check linear content");
	});

	QUnit.test("Add bigcap empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂");
		assert.ok(true, "Add '⋂'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂", "Check linear content");
	});
	QUnit.test("Add bigcap lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂_2");
		assert.ok(true, "Add '⋂_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂_2", "Check linear content");
	});
	QUnit.test("Add bigcap lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂_(2+1)");
		assert.ok(true, "Add '⋂_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcap upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂^2");
		assert.ok(true, "Add '⋂^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂^2", "Check linear content");
	});
	QUnit.test("Add bigcap upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂^(2+1)");
		assert.ok(true, "Add '⋂^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcap upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂^2_x");
		assert.ok(true, "Add '⋂^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂_x^2", "Check linear content");
	});
	QUnit.test("Add bigcap upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂^(2+1)_(x+1)");
		assert.ok(true, "Add '⋂^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcap with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂5");
		assert.ok(true, "Add '⋂5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂5", "Check linear content");
	});
	QUnit.test("Add bigcap with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂(5+1)");
		assert.ok(true, "Add '⋂(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂(5+1)", "Check linear content");
	});

	QUnit.test("Add bigcup empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃");
		assert.ok(true, "Add '⋃'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃", "Check linear content");
	});
	QUnit.test("Add bigcup lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃_2");
		assert.ok(true, "Add '⋃_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃_2", "Check linear content");
	});
	QUnit.test("Add bigcup lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃_(2+1)");
		assert.ok(true, "Add '⋃_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcup upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃^2");
		assert.ok(true, "Add '⋃^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃^2", "Check linear content");
	});
	QUnit.test("Add bigcup upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃^(2+1)");
		assert.ok(true, "Add '⋃^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcup upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃^2_x");
		assert.ok(true, "Add '⋃^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃_x^2", "Check linear content");
	});
	QUnit.test("Add bigcup upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃^(2+1)_(x+1)");
		assert.ok(true, "Add '⋃^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcup with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃5");
		assert.ok(true, "Add '⋃5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃5", "Check linear content");
	});
	QUnit.test("Add bigcup with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃(5+1)");
		assert.ok(true, "Add '⋃(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃(5+1)", "Check linear content");
	});

	QUnit.test("Add bigodot empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀");
		assert.ok(true, "Add '⨀'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀", "Check linear content");
	});
	QUnit.test("Add bigodot lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀_2");
		assert.ok(true, "Add '⨀_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀_2", "Check linear content");
	});
	QUnit.test("Add bigodot lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀_(2+1)");
		assert.ok(true, "Add '⨀_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigodot upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀^2");
		assert.ok(true, "Add '⨀^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀^2", "Check linear content");
	});
	QUnit.test("Add bigodot upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀^(2+1)");
		assert.ok(true, "Add '⨀^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigodot upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀^2_x");
		assert.ok(true, "Add '⨀^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀_x^2", "Check linear content");
	});
	QUnit.test("Add bigodot upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀^(2+1)_(x+1)");
		assert.ok(true, "Add '⨀^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigodot with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀5");
		assert.ok(true, "Add '⨀5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀5", "Check linear content");
	});
	QUnit.test("Add bigodot with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀(5+1)");
		assert.ok(true, "Add '⨀(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀(5+1)", "Check linear content");
	});

	QUnit.test("Add bigoplus empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁");
		assert.ok(true, "Add '⨁'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁", "Check linear content");
	});
	QUnit.test("Add bigoplus lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁_2");
		assert.ok(true, "Add '⨁_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁_2", "Check linear content");
	});
	QUnit.test("Add bigoplus lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁_(2+1)");
		assert.ok(true, "Add '⨁_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigoplus upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁^2");
		assert.ok(true, "Add '⨁^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁^2", "Check linear content");
	});
	QUnit.test("Add bigoplus upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁^(2+1)");
		assert.ok(true, "Add '⨁^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigoplus upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁^2_x");
		assert.ok(true, "Add '⨁^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁_x^2", "Check linear content");
	});
	QUnit.test("Add bigoplus upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁^(2+1)_(x+1)");
		assert.ok(true, "Add '⨁^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigoplus with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁5");
		assert.ok(true, "Add '⨁5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁5", "Check linear content");
	});
	QUnit.test("Add bigoplus with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁(5+1)");
		assert.ok(true, "Add '⨁(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁(5+1)", "Check linear content");
	});

	QUnit.test("Add bigotimes empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂");
		assert.ok(true, "Add '⨂'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂", "Check linear content");
	});
	QUnit.test("Add bigotimes lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂_2");
		assert.ok(true, "Add '⨂_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂_2", "Check linear content");
	});
	QUnit.test("Add bigotimes lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂_(2+1)");
		assert.ok(true, "Add '⨂_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigotimes upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂^2");
		assert.ok(true, "Add '⨂^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂^2", "Check linear content");
	});
	QUnit.test("Add bigotimes upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂^(2+1)");
		assert.ok(true, "Add '⨂^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigotimes upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂^2_x");
		assert.ok(true, "Add '⨂^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂_x^2", "Check linear content");
	});
	QUnit.test("Add bigotimes upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂^(2+1)_(x+1)");
		assert.ok(true, "Add '⨂^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigotimes with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂5");
		assert.ok(true, "Add '⨂5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂5", "Check linear content");
	});
	QUnit.test("Add bigotimes with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂(5+1)");
		assert.ok(true, "Add '⨂(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂(5+1)", "Check linear content");
	});

	QUnit.test("Add bigsqcup empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆");
		assert.ok(true, "Add '⨆'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆", "Check linear content");
	});
	QUnit.test("Add bigsqcup lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆_2");
		assert.ok(true, "Add '⨆_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆_2", "Check linear content");
	});
	QUnit.test("Add bigsqcup lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆_(2+1)");
		assert.ok(true, "Add '⨆_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigsqcup upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆^2");
		assert.ok(true, "Add '⨆^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆^2", "Check linear content");
	});
	QUnit.test("Add bigsqcup upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆^(2+1)");
		assert.ok(true, "Add '⨆^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigsqcup upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆^2_x");
		assert.ok(true, "Add '⨆^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆_x^2", "Check linear content");
	});
	QUnit.test("Add bigsqcup upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆^(2+1)_(x+1)");
		assert.ok(true, "Add '⨆^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigsqcup with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆5");
		assert.ok(true, "Add '⨆5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆5", "Check linear content");
	});
	QUnit.test("Add bigsqcup with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆(5+1)");
		assert.ok(true, "Add '⨆(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆(5+1)", "Check linear content");
	});

	QUnit.test("Add biguplus empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄");
		assert.ok(true, "Add '⨄'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄", "Check linear content");
	});
	QUnit.test("Add biguplus lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄_2");
		assert.ok(true, "Add '⨄_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄_2", "Check linear content");
	});
	QUnit.test("Add biguplus lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄_(2+1)");
		assert.ok(true, "Add '⨄_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄_(2+1)", "Check linear content");
	});
	QUnit.test("Add biguplus upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄^2");
		assert.ok(true, "Add '⨄^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄^2", "Check linear content");
	});
	QUnit.test("Add biguplus upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄^(2+1)");
		assert.ok(true, "Add '⨄^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄^(2+1)", "Check linear content");
	});
	QUnit.test("Add biguplus upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄^2_x");
		assert.ok(true, "Add '⨄^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄_x^2", "Check linear content");
	});
	QUnit.test("Add biguplus upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄^(2+1)_(x+1)");
		assert.ok(true, "Add '⨄^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add biguplus with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄5");
		assert.ok(true, "Add '⨄5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄5", "Check linear content");
	});
	QUnit.test("Add biguplus with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄(5+1)");
		assert.ok(true, "Add '⨄(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄(5+1)", "Check linear content");
	});

	QUnit.test("Add bigvee empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁");
		assert.ok(true, "Add '⋁'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁", "Check linear content");
	});
	QUnit.test("Add bigvee lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁_2");
		assert.ok(true, "Add '⋁_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁_2", "Check linear content");
	});
	QUnit.test("Add bigvee lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁_(2+1)");
		assert.ok(true, "Add '⋁_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigvee upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁^2");
		assert.ok(true, "Add '⋁^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁^2", "Check linear content");
	});
	QUnit.test("Add bigvee upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁^(2+1)");
		assert.ok(true, "Add '⋁^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigvee upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁^2_x");
		assert.ok(true, "Add '⋁^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁_x^2", "Check linear content");
	});
	QUnit.test("Add bigvee upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁^(2+1)_(x+1)");
		assert.ok(true, "Add '⋁^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigvee with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁5");
		assert.ok(true, "Add '⋁5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁5", "Check linear content");
	});
	QUnit.test("Add bigvee with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁(5+1)");
		assert.ok(true, "Add '⋁(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁(5+1)", "Check linear content");
	});

	QUnit.test("Add bigwedge empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀");
		assert.ok(true, "Add '⋀'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀", "Check linear content");
	});
	QUnit.test("Add bigwedge lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀_2");
		assert.ok(true, "Add '⋀_2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_2", "Check linear content");
	});
	QUnit.test("Add bigwedge lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀_(2+1)");
		assert.ok(true, "Add '⋀_(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigwedge upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀^2");
		assert.ok(true, "Add '⋀^2'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀^2", "Check linear content");
	});
	QUnit.test("Add bigwedge upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀^(2+1)");
		assert.ok(true, "Add '⋀^(2+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigwedge upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀^2_x");
		assert.ok(true, "Add '⋀^2_x'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_x^2", "Check linear content");
	});
	QUnit.test("Add bigwedge upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀^(2+1)_(x+1)");
		assert.ok(true, "Add '⋀^(2+1)_(x+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigwedge with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀5");
		assert.ok(true, "Add '⋀5'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀5", "Check linear content");
	});
	QUnit.test("Add bigwedge with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀(5+1)");
		assert.ok(true, "Add '⋀(5+1)'");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀(5+1)", "Check linear content");
	});

	QUnit.module("Nary - Autocorrection");

	QUnit.test("Add integral empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫ ");
		assert.ok(true, "Add '∫ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫", "Check linear content");
	});
	QUnit.test("Add integral lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫_2 ");
		assert.ok(true, "Add '∫_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫_2", "Check linear content");
	});
	QUnit.test("Add integral lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫_(2+1) ");
		assert.ok(true, "Add '∫_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫_(2+1)", "Check linear content");
	});
	QUnit.test("Add integral upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫^2 ");
		assert.ok(true, "Add '∫^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫^2", "Check linear content");
	});
	QUnit.test("Add integral upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫^(2+1) ");
		assert.ok(true, "Add '∫^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫^(2+1)", "Check linear content");
	});
	QUnit.test("Add integral upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫^2_x ");
		assert.ok(true, "Add '∫^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫_x^2", "Check linear content");
	});
	QUnit.test("Add integral upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫^(2+1)_(x+1) ");
		assert.ok(true, "Add '∫^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add integral with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫5 ");
		assert.ok(true, "Add '∫5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫5", "Check linear content");
	});
	QUnit.test("Add integral with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∫(5+1) ");
		assert.ok(true, "Add '∫(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8747, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∫(5+1)", "Check linear content");
	});

	QUnit.test("Add iintegral empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬ ");
		assert.ok(true, "Add '∬ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬", "Check linear content");
	});
	QUnit.test("Add iintegral lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬_2 ");
		assert.ok(true, "Add '∬_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬_2", "Check linear content");
	});
	QUnit.test("Add iintegral lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬_(2+1) ");
		assert.ok(true, "Add '∬_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬_(2+1)", "Check linear content");
	});
	QUnit.test("Add iintegral upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬^2 ");
		assert.ok(true, "Add '∬^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬^2", "Check linear content");
	});
	QUnit.test("Add iintegral upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬^(2+1) ");
		assert.ok(true, "Add '∬^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬^(2+1)", "Check linear content");
	});
	QUnit.test("Add iintegral upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬^2_x ");
		assert.ok(true, "Add '∬^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬_x^2", "Check linear content");
	});
	QUnit.test("Add iintegral upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬^(2+1)_(x+1) ");
		assert.ok(true, "Add '∬^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add iintegral with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬5 ");
		assert.ok(true, "Add '∬5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬5", "Check linear content");
	});
	QUnit.test("Add iintegral with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∬(5+1) ");
		assert.ok(true, "Add '∬(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8748, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∬(5+1)", "Check linear content");
	});

	QUnit.test("Add iiintegral empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭ ");
		assert.ok(true, "Add '∭ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭", "Check linear content");
	});
	QUnit.test("Add iiintegral lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭_2 ");
		assert.ok(true, "Add '∭_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭_2", "Check linear content");
	});
	QUnit.test("Add iiintegral lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭_(2+1) ");
		assert.ok(true, "Add '∭_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭_(2+1)", "Check linear content");
	});
	QUnit.test("Add iiintegral upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭^2 ");
		assert.ok(true, "Add '∭^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭^2", "Check linear content");
	});
	QUnit.test("Add iiintegral upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭^(2+1) ");
		assert.ok(true, "Add '∭^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭^(2+1)", "Check linear content");
	});
	QUnit.test("Add iiintegral upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭^2_x ");
		assert.ok(true, "Add '∭^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭_x^2", "Check linear content");
	});
	QUnit.test("Add iiintegralupper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭^(2+1)_(x+1) ");
		assert.ok(true, "Add '∭^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add iiintegral with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭5 ");
		assert.ok(true, "Add '∭5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭5", "Check linear content");
	});
	QUnit.test("Add iiintegral with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∭(5+1) ");
		assert.ok(true, "Add '∭(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8749, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∭(5+1)", "Check linear content");
	});

	QUnit.test("Add iiiintegral empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌ ");
		assert.ok(true, "Add '⨌ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌", "Check linear content");
	});
	QUnit.test("Add iiiintegral lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌_2 ");
		assert.ok(true, "Add '⨌_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌_2", "Check linear content");
	});
	QUnit.test("Add iiiintegral lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌_(2+1) ");
		assert.ok(true, "Add '⨌_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌_(2+1)", "Check linear content");
	});
	QUnit.test("Add iiiintegral upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌^2 ");
		assert.ok(true, "Add '⨌^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌^2", "Check linear content");
	});
	QUnit.test("Add iiiintegral upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌^(2+1) ");
		assert.ok(true, "Add '⨌^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌^(2+1)", "Check linear content");
	});
	QUnit.test("Add iiiintegral upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌^2_x ");
		assert.ok(true, "Add '⨌^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌_x^2", "Check linear content");
	});
	QUnit.test("Add iiiintegral upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌^(2+1)_(x+1) ");
		assert.ok(true, "Add '⨌^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add iiiintegral with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌5 ");
		assert.ok(true, "Add '⨌5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌5", "Check linear content");
	});
	QUnit.test("Add iiiintegral with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨌(5+1) ");
		assert.ok(true, "Add '⨌(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10764, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨌(5+1)", "Check linear content");
	});

	QUnit.test("Add oint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮ ");
		assert.ok(true, "Add '∮ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮", "Check linear content");
	});
	QUnit.test("Add oint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮_2 ");
		assert.ok(true, "Add '∮_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮_2", "Check linear content");
	});
	QUnit.test("Add oint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮_(2+1) ");
		assert.ok(true, "Add '∮_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮_(2+1)", "Check linear content");
	});
	QUnit.test("Add oint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮^2 ");
		assert.ok(true, "Add '∮^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮^2", "Check linear content");
	});
	QUnit.test("Add oint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮^(2+1) ");
		assert.ok(true, "Add '∮^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮^(2+1)", "Check linear content");
	});
	QUnit.test("Add oint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮^2_x ");
		assert.ok(true, "Add '∮^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮_x^2", "Check linear content");
	});
	QUnit.test("Add oint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮^(2+1)_(x+1) ");
		assert.ok(true, "Add '∮^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add oint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮5 ");
		assert.ok(true, "Add '∮5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮5", "Check linear content");
	});
	QUnit.test("Add oint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∮(5+1) ");
		assert.ok(true, "Add '∮(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8750, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∮(5+1)", "Check linear content");
	});

	QUnit.test("Add oiint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯ ");
		assert.ok(true, "Add '∯ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯", "Check linear content");
	});
	QUnit.test("Add oiint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯_2 ");
		assert.ok(true, "Add '∯_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯_2", "Check linear content");
	});
	QUnit.test("Add oiint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯_(2+1) ");
		assert.ok(true, "Add '∯_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯_(2+1)", "Check linear content");
	});
	QUnit.test("Add oiint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯^2 ");
		assert.ok(true, "Add '∯^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯^2", "Check linear content");
	});
	QUnit.test("Add oiint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯^(2+1) ");
		assert.ok(true, "Add '∯^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯^(2+1)", "Check linear content");
	});
	QUnit.test("Add oiint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯^2_x ");
		assert.ok(true, "Add '∯^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯_x^2", "Check linear content");
	});
	QUnit.test("Add oiint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯^(2+1)_(x+1) ");
		assert.ok(true, "Add '∯^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add oiint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯5 ");
		assert.ok(true, "Add '∯5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯5", "Check linear content");
	});
	QUnit.test("Add oiint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∯(5+1) ");
		assert.ok(true, "Add '∯(5+1) '");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8751, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∯(5+1)", "Check linear content");
	});

	QUnit.test("Add oiiint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰ ");
		assert.ok(true, "Add '∰ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰", "Check linear content");
	});
	QUnit.test("Add oiiint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰_2 ");
		assert.ok(true, "Add '∰_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰_2", "Check linear content");
	});
	QUnit.test("Add oiiint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰_(2+1) ");
		assert.ok(true, "Add '∰_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰_(2+1)", "Check linear content");
	});
	QUnit.test("Add oiiint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰^2 ");
		assert.ok(true, "Add '∰^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰^2", "Check linear content");
	});
	QUnit.test("Add oiiint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰^(2+1) ");
		assert.ok(true, "Add '∰^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰^(2+1)", "Check linear content");
	});
	QUnit.test("Add oiiint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰^2_x ");
		assert.ok(true, "Add '∰^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰_x^2", "Check linear content");
	});
	QUnit.test("Add oiiint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰^(2+1)_(x+1) ");
		assert.ok(true, "Add '∰^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add oiiint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰5 ");
		assert.ok(true, "Add '∰5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰5", "Check linear content");
	});
	QUnit.test("Add oiiint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∰(5+1) ");
		assert.ok(true, "Add '∰(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∰(5+1)", "Check linear content");
	});

	QUnit.test("Add prod empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏ ");
		assert.ok(true, "Add '∏ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏", "Check linear content");
	});
	QUnit.test("Add prod lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏_2 ");
		assert.ok(true, "Add '∏_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏_2", "Check linear content");
	});
	QUnit.test("Add prod lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏_(2+1) ");
		assert.ok(true, "Add '∏_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏_(2+1)", "Check linear content");
	});
	QUnit.test("Add prod upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏^2 ");
		assert.ok(true, "Add '∏^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏^2", "Check linear content");
	});
	QUnit.test("Add prod upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏^(2+1) ");
		assert.ok(true, "Add '∏^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏^(2+1)", "Check linear content");
	});
	QUnit.test("Add prod upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏^2_x ");
		assert.ok(true, "Add '∏^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏_x^2", "Check linear content");
	});
	QUnit.test("Add prod upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏^(2+1)_(x+1) ");
		assert.ok(true, "Add '∏^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add prod with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏5 ");
		assert.ok(true, "Add '∏5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏5", "Check linear content");
	});
	QUnit.test("Add prod with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∏(5+1) ");
		assert.ok(true, "Add '∏(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8719, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∏(5+1)", "Check linear content");
	});

	QUnit.test("Add sum empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑ ");
		assert.ok(true, "Add '∑ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑", "Check linear content");
	});
	QUnit.test("Add sum lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑_2 ");
		assert.ok(true, "Add '∑_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑_2", "Check linear content");
	});
	QUnit.test("Add sum lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑_(2+1) ");
		assert.ok(true, "Add '∑_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑_(2+1)", "Check linear content");
	});
	QUnit.test("Add sum upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑^2 ");
		assert.ok(true, "Add '∑^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑^2", "Check linear content");
	});
	QUnit.test("Add sum upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑^(2+1) ");
		assert.ok(true, "Add '∑^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑^(2+1)", "Check linear content");
	});
	QUnit.test("Add sum upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑^2_x ");
		assert.ok(true, "Add '∑^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑_x^2", "Check linear content");
	});
	QUnit.test("Add sum upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑^(2+1)_(x+1) ");
		assert.ok(true, "Add '∑^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add sum with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑5 ");
		assert.ok(true, "Add '∑5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑5", "Check linear content");
	});
	QUnit.test("Add sum with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∑(5+1) ");
		assert.ok(true, "Add '∑(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8721, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∑(5+1)", "Check linear content");
	});

	QUnit.test("Add coint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲ ");
		assert.ok(true, "Add '∲ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲", "Check linear content");
	});
	QUnit.test("Add coint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲_2 ");
		assert.ok(true, "Add '∲_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲_2", "Check linear content");
	});
	QUnit.test("Add coint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲_(2+1) ");
		assert.ok(true, "Add '∲_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲_(2+1)", "Check linear content");
	});
	QUnit.test("Add coint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲^2 ");
		assert.ok(true, "Add '∲^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲^2", "Check linear content");
	});
	QUnit.test("Add coint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲^(2+1) ");
		assert.ok(true, "Add '∲^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲^(2+1)", "Check linear content");
	});
	QUnit.test("Add coint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲^2_x ");
		assert.ok(true, "Add '∲^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲_x^2", "Check linear content");
	});
	QUnit.test("Add coint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲^(2+1)_(x+1) ");
		assert.ok(true, "Add '∲^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add coint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲5 ");
		assert.ok(true, "Add '∲5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲5", "Check linear content");
	});
	QUnit.test("Add coint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∲(5+1) ");
		assert.ok(true, "Add '∲(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∲(5+1)", "Check linear content");
	});

	QUnit.test("Add amalg empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐ ");
		assert.ok(true, "Add '∐ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐", "Check linear content");
	});
	QUnit.test("Add amalg lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐_2 ");
		assert.ok(true, "Add '∐_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐_2", "Check linear content");
	});
	QUnit.test("Add amalg lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐_(2+1) ");
		assert.ok(true, "Add '∐_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐_(2+1)", "Check linear content");
	});
	QUnit.test("Add amalg upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐^2 ");
		assert.ok(true, "Add '∐^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐^2", "Check linear content");
	});
	QUnit.test("Add amalg upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐^(2+1) ");
		assert.ok(true, "Add '∐^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐^(2+1)", "Check linear content");
	});
	QUnit.test("Add amalg upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐^2_x ");
		assert.ok(true, "Add '∐^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐_x^2", "Check linear content");
	});
	QUnit.test("Add amalg upper lower block ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐^(2+1)_(x+1) ");
		assert.ok(true, "Add '∐^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add amalg with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐5 ");
		assert.ok(true, "Add '∐5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐5", "Check linear content");
	});
	QUnit.test("Add amalg with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∐(5+1) ");
		assert.ok(true, "Add '∐(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8720, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∐(5+1)", "Check linear content");
	});

	QUnit.test("Add aoint empty", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳ ");
		assert.ok(true, "Add '∳ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳", "Check linear content");
	});
	QUnit.test("Add aoint lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳_2 ");
		assert.ok(true, "Add '∳_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳_2", "Check linear content");
	});
	QUnit.test("Add aoint lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳_(2+1) ");
		assert.ok(true, "Add '∳_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳_(2+1)", "Check linear content");
	});
	QUnit.test("Add aoint upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳^2 ");
		assert.ok(true, "Add '∳^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳^2", "Check linear content");
	});
	QUnit.test("Add aoint upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳^(2+1) ");
		assert.ok(true, "Add '∳^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳^(2+1)", "Check linear content");
	});
	QUnit.test("Add aoint upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳^2_x ");
		assert.ok(true, "Add '∳^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳_x^2", "Check linear content");
	});
	QUnit.test("Add aoint upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳^(2+1)_(x+1) ");
		assert.ok(true, "Add '∳^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add aoint with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳5 ");
		assert.ok(true, "Add '∳5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳5", "Check linear content");
	});
	QUnit.test("Add aoint with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("∳(5+1) ");
		assert.ok(true, "Add '∳(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8755, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "∳(5+1)", "Check linear content");
	});

	QUnit.test("Add bigcap empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂ ");
		assert.ok(true, "Add '⋂ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂", "Check linear content");
	});
	QUnit.test("Add bigcap lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂_2 ");
		assert.ok(true, "Add '⋂_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂_2", "Check linear content");
	});
	QUnit.test("Add bigcap lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂_(2+1) ");
		assert.ok(true, "Add '⋂_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcap upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂^2 ");
		assert.ok(true, "Add '⋂^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂^2", "Check linear content");
	});
	QUnit.test("Add bigcap upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂^(2+1) ");
		assert.ok(true, "Add '⋂^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcap upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂^2_x ");
		assert.ok(true, "Add '⋂^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂_x^2", "Check linear content");
	});
	QUnit.test("Add bigcap upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂^(2+1)_(x+1) ");
		assert.ok(true, "Add '⋂^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcap with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂5 ");
		assert.ok(true, "Add '⋂5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂5", "Check linear content");
	});
	QUnit.test("Add bigcap with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋂(5+1) ");
		assert.ok(true, "Add '⋂(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8898, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋂(5+1)", "Check linear content");
	});

	QUnit.test("Add bigcup empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃ ");
		assert.ok(true, "Add '⋃ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃", "Check linear content");
	});
	QUnit.test("Add bigcup lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃_2 ");
		assert.ok(true, "Add '⋃_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃_2", "Check linear content");
	});
	QUnit.test("Add bigcup lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃_(2+1) ");
		assert.ok(true, "Add '⋃_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcup upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃^2 ");
		assert.ok(true, "Add '⋃^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃^2", "Check linear content");
	});
	QUnit.test("Add bigcup upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃^(2+1) ");
		assert.ok(true, "Add '⋃^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcup upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃^2_x ");
		assert.ok(true, "Add '⋃^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃_x^2", "Check linear content");
	});
	QUnit.test("Add bigcup upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃^(2+1)_(x+1) ");
		assert.ok(true, "Add '⋃^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigcup with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃5 ");
		assert.ok(true, "Add '⋃5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃5", "Check linear content");
	});
	QUnit.test("Add bigcup with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋃(5+1) ");
		assert.ok(true, "Add '⋃(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8899, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋃(5+1)", "Check linear content");
	});

	QUnit.test("Add bigodot empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀ ");
		assert.ok(true, "Add '⨀ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀", "Check linear content");
	});
	QUnit.test("Add bigodot lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀_2 ");
		assert.ok(true, "Add '⨀_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀_2", "Check linear content");
	});
	QUnit.test("Add bigodot lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀_(2+1) ");
		assert.ok(true, "Add '⨀_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigodot upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀^2 ");
		assert.ok(true, "Add '⨀^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀^2", "Check linear content");
	});
	QUnit.test("Add bigodot upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀^(2+1) ");
		assert.ok(true, "Add '⨀^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigodot upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀^2_x ");
		assert.ok(true, "Add '⨀^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀_x^2", "Check linear content");
	});
	QUnit.test("Add bigodot upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀^(2+1)_(x+1) ");
		assert.ok(true, "Add '⨀^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigodot with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀5 ");
		assert.ok(true, "Add '⨀5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀5", "Check linear content");
	});
	QUnit.test("Add bigodot with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨀(5+1) ");
		assert.ok(true, "Add '⨀(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10752, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨀(5+1)", "Check linear content");
	});

	QUnit.test("Add bigoplus empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁ ");
		assert.ok(true, "Add '⨁ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁", "Check linear content");
	});
	QUnit.test("Add bigoplus lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁_2 ");
		assert.ok(true, "Add '⨁_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁_2", "Check linear content");
	});
	QUnit.test("Add bigoplus lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁_(2+1) ");
		assert.ok(true, "Add '⨁_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigoplus upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁^2 ");
		assert.ok(true, "Add '⨁^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁^2", "Check linear content");
	});
	QUnit.test("Add bigoplus upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁^(2+1) ");
		assert.ok(true, "Add '⨁^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigoplus upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁^2_x ");
		assert.ok(true, "Add '⨁^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁_x^2", "Check linear content");
	});
	QUnit.test("Add bigoplus upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁^(2+1)_(x+1) ");
		assert.ok(true, "Add '⨁^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigoplus with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁5 ");
		assert.ok(true, "Add '⨁5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁5", "Check linear content");
	});
	QUnit.test("Add bigoplus with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨁(5+1) ");
		assert.ok(true, "Add '⨁(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10753, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨁(5+1)", "Check linear content");
	});

	QUnit.test("Add bigotimes empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂ ");
		assert.ok(true, "Add '⨂ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂", "Check linear content");
	});
	QUnit.test("Add bigotimes lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂_2 ");
		assert.ok(true, "Add '⨂_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂_2", "Check linear content");
	});
	QUnit.test("Add bigotimes lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂_(2+1) ");
		assert.ok(true, "Add '⨂_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigotimes upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂^2 ");
		assert.ok(true, "Add '⨂^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂^2", "Check linear content");
	});
	QUnit.test("Add bigotimes upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂^(2+1) ");
		assert.ok(true, "Add '⨂^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigotimes upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂^2_x ");
		assert.ok(true, "Add '⨂^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂_x^2", "Check linear content");
	});
	QUnit.test("Add bigotimes upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂^(2+1)_(x+1) ");
		assert.ok(true, "Add '⨂^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigotimes with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂5 ");
		assert.ok(true, "Add '⨂5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂5", "Check linear content");
	});
	QUnit.test("Add bigotimes with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨂(5+1) ");
		assert.ok(true, "Add '⨂(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10754, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨂(5+1)", "Check linear content");
	});

	QUnit.test("Add bigsqcup empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆ ");
		assert.ok(true, "Add '⨆ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆", "Check linear content");
	});
	QUnit.test("Add bigsqcup lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆_2 ");
		assert.ok(true, "Add '⨆_2 '");

		r.ConvertView(false, 0);
		assert.ok(true, "Convert to professional");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆_2", "Check linear content");
	});
	QUnit.test("Add bigsqcup lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆_(2+1) ");
		assert.ok(true, "Add '⨆_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigsqcup upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆^2 ");
		assert.ok(true, "Add '⨆^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆^2", "Check linear content");
	});
	QUnit.test("Add bigsqcup upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆^(2+1) ");
		assert.ok(true, "Add '⨆^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigsqcup upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆^2_x ");
		assert.ok(true, "Add '⨆^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆_x^2", "Check linear content");
	});
	QUnit.test("Add bigsqcup upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆^(2+1)_(x+1) ");
		assert.ok(true, "Add '⨆^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigsqcup with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆5 ");
		assert.ok(true, "Add '⨆5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆5", "Check linear content");
	});
	QUnit.test("Add bigsqcup with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨆(5+1) ");
		assert.ok(true, "Add '⨆(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10758, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨆(5+1)", "Check linear content");
	});

	QUnit.test("Add biguplus empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄ ");
		assert.ok(true, "Add '⨄ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄", "Check linear content");
	});
	QUnit.test("Add biguplus lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄_2 ");
		assert.ok(true, "Add '⨄_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄_2", "Check linear content");
	});
	QUnit.test("Add biguplus lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄_(2+1) ");
		assert.ok(true, "Add '⨄_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄_(2+1)", "Check linear content");
	});
	QUnit.test("Add biguplus upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄^2 ");
		assert.ok(true, "Add '⨄^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄^2", "Check linear content");
	});
	QUnit.test("Add biguplus upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄^(2+1) ");
		assert.ok(true, "Add '⨄^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄^(2+1)", "Check linear content");
	});
	QUnit.test("Add biguplus upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄^2_x ");
		assert.ok(true, "Add '⨄^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄_x^2", "Check linear content");
	});
	QUnit.test("Add biguplus upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄^(2+1)_(x+1) ");
		assert.ok(true, "Add '⨄^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add biguplus with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄5 ");
		assert.ok(true, "Add '⨄5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄5", "Check linear content");
	});
	QUnit.test("Add biguplus with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⨄(5+1) ");
		assert.ok(true, "Add '⨄(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 10756, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⨄(5+1)", "Check linear content");
	});

	QUnit.test("Add bigvee empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁ ");
		assert.ok(true, "Add '⋁ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁", "Check linear content");
	});
	QUnit.test("Add bigvee lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁_2 ");
		assert.ok(true, "Add '⋁_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁_2", "Check linear content");
	});
	QUnit.test("Add bigvee lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁_(2+1) ");
		assert.ok(true, "Add '⋁_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigvee upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁^2 ");
		assert.ok(true, "Add '⋁^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁^2", "Check linear content");
	});
	QUnit.test("Add bigvee upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁^(2+1) ");
		assert.ok(true, "Add '⋁^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigvee upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁^2_x ");
		assert.ok(true, "Add '⋁^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁_x^2", "Check linear content");
	});
	QUnit.test("Add bigvee upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁^(2+1)_(x+1) ");
		assert.ok(true, "Add '⋁^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigvee with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁5 ");
		assert.ok(true, "Add '⋁5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁5", "Check linear content");
	});
	QUnit.test("Add bigvee with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋁(5+1) ");
		assert.ok(true, "Add '⋁(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8897, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋁(5+1)", "Check linear content");
	});

	QUnit.test("Add bigwedge empty ", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀ ");
		assert.ok(true, "Add '⋀ '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀", "Check linear content");
	});
	QUnit.test("Add bigwedge lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀_2 ");
		assert.ok(true, "Add '⋀_2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_2", "Check linear content");
	});
	QUnit.test("Add bigwedge lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀_(2+1) ");
		assert.ok(true, "Add '⋀_(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "2+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_(2+1)", "Check linear content");
	});
	QUnit.test("Add bigwedge upper", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀^2 ");
		assert.ok(true, "Add '⋀^2 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀^2", "Check linear content");
	});
	QUnit.test("Add bigwedge upper block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀^(2+1) ");
		assert.ok(true, "Add '⋀^(2+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigwedge upper lower", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀^2_x ");
		assert.ok(true, "Add '⋀^2_x '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x", "Check content of nary lower");
		assert.strictEqual(strUpper, "2", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_x^2", "Check linear content");
	});
	QUnit.test("Add bigwedge upper lower block", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀^(2+1)_(x+1) ");
		assert.ok(true, "Add '⋀^(2+1)_(x+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "", "Check content of nary base");
		assert.strictEqual(strLower, "x+1", "Check content of nary lower");
		assert.strictEqual(strUpper, "2+1", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀_(x+1)^(2+1)", "Check linear content");
	});
	QUnit.test("Add bigwedge with base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀5 ");
		assert.ok(true, "Add '⋀5 '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀5", "Check linear content");
	});
	QUnit.test("Add bigwedge with block base", function (assert)
	{
		let r = Create();
		assert.ok(true, "Create math equation");

		AddTextToRoot("⋀(5+1) ");
		assert.ok(true, "Add '⋀(5+1) '");

		let oNary = r.Root.Content[1];
		assert.ok(oNary instanceof CNary, "Created CNary");
		assert.strictEqual(oNary.Pr.chr, 8896, "Check char of nary");

		let strBase = oNary.getBase().GetTextOfElement().GetText();
		let oLower = oNary.getLowerIterator();
		let oUpper = oNary.getUpperIterator();

		let strLower = oLower ? oLower.GetTextOfElement().GetText() : "";
		let strUpper =  oUpper? oUpper.GetTextOfElement().GetText() : "";

		assert.strictEqual(strBase, "5+1", "Check content of nary base");
		assert.strictEqual(strLower, "", "Check content of nary lower");
		assert.strictEqual(strUpper, "", "Check content of nary upper");

		r.ConvertView(true, 0);
		assert.ok(true, "Convert to professional");
		assert.strictEqual(r.GetText(), "⋀(5+1)", "Check linear content");
	});


	function BracketEmptyCheck(str, num, arr, isAutoCorrect)
	{
		QUnit.test("Check bracket "+str, function (assert)
		{
			AscMath.SetIsAllowAutoCorrect(!isAutoCorrect == false);
			let r = Create();
			assert.ok(true, "Create math equation");

			AddTextToRoot(str);
			assert.ok(true, "Add '" + str + "'");
			AscMath.SetIsAllowAutoCorrect(true);

			r.ConvertView(false, 0);
			assert.ok(true, "Convert to professional");

			let oDelimiter = r.Root.Content[1];
			assert.ok(oDelimiter instanceof CDelimiter, "Created CDelimiter");
			let nCountOfColumns = oDelimiter.getColumnsCount();
			assert.strictEqual(nCountOfColumns, num, "Check count of columns");

			for (let i = 0; i < nCountOfColumns; i++)
			{
				let oCurrentContent = oDelimiter.getElementMathContent(i);
				if (oCurrentContent)
				{
					let strCurrentContent = oCurrentContent.GetTextOfElement().GetText();
					assert.strictEqual(strCurrentContent, arr[i], "Check " + i + " content of CDelimiter");
				}
			}

			r.ConvertView(true, 0);
			assert.ok(true, "Convert to professional");
			assert.strictEqual(r.GetText(), str, "Check linear content");
		});
	}

	QUnit.module("Brackets - Convert");

	BracketEmptyCheck("()", 1, [""]);
	BracketEmptyCheck("[]", 1, [""]);
	BracketEmptyCheck("{}", 1, [""]);
	BracketEmptyCheck("⟨⟩", 1, [""]);
	BracketEmptyCheck("⌊⌋", 1, [""]);
	BracketEmptyCheck("⌈⌉", 1, [""]);
	BracketEmptyCheck("||", 1, [""]);
	BracketEmptyCheck("‖‖", 1, [""]);
	BracketEmptyCheck("[┤[", 1, [""]);
	BracketEmptyCheck("├]┤]", 1, [""]);
	BracketEmptyCheck("├]┤[", 1, [""]);
	BracketEmptyCheck("⟦⟧", 1, [""]);

	BracketEmptyCheck("(x)", 1, ["x"]);
	BracketEmptyCheck("[x]", 1, ["x"]);
	BracketEmptyCheck("{x}", 1, ["x"]);
	BracketEmptyCheck("⟨x⟩", 1, ["x"]);
	BracketEmptyCheck("⌊x⌋", 1, ["x"]);
	BracketEmptyCheck("⌈x⌉", 1, ["x"]);
	BracketEmptyCheck("|x|", 1, ["x"]);
	BracketEmptyCheck("‖x‖", 1, ["x"]);
	BracketEmptyCheck("[x┤[", 1, ["x"]);
	BracketEmptyCheck("├]x┤]", 1, ["x"]);
	BracketEmptyCheck("├]x┤[", 1, ["x"]);
	BracketEmptyCheck("⟦x⟧", 1, ["x"]);

	BracketEmptyCheck("(x+1)", 1, ["x+1"]);
	BracketEmptyCheck("[x+1]", 1, ["x+1"]);
	BracketEmptyCheck("{x+1}", 1, ["x+1"]);
	BracketEmptyCheck("⟨x+1⟩", 1, ["x+1"]);
	BracketEmptyCheck("⌊x+1⌋", 1, ["x+1"]);
	BracketEmptyCheck("⌈x+1⌉", 1, ["x+1"]);
	BracketEmptyCheck("|x+1|", 1, ["x+1"]);
	BracketEmptyCheck("‖x+1‖", 1, ["x+1"]);
	BracketEmptyCheck("[x+1┤[", 1, ["x+1"]);
	BracketEmptyCheck("├]x+1┤]", 1, ["x+1"]);
	BracketEmptyCheck("├]x+1┤[", 1, ["x+1"]);
	BracketEmptyCheck("⟦x+1⟧", 1, ["x+1"]);

	BracketEmptyCheck("((x+1))", 1, ["(x+1)"]);
	BracketEmptyCheck("[(x+1)]", 1, ["(x+1)"]);
	BracketEmptyCheck("{(x+1)}", 1, ["(x+1)"]);
	BracketEmptyCheck("⟨(x+1)⟩", 1, ["(x+1)"]);
	BracketEmptyCheck("⌊(x+1)⌋", 1, ["(x+1)"]);
	BracketEmptyCheck("⌈(x+1)⌉", 1, ["(x+1)"]);
	BracketEmptyCheck("|(x+1)|", 1, ["(x+1)"]);
	BracketEmptyCheck("‖(x+1)‖", 1, ["(x+1)"]);
	BracketEmptyCheck("[(x+1)┤[", 1, ["(x+1)"]);
	BracketEmptyCheck("├](x+1)┤]", 1, ["(x+1)"]);
	BracketEmptyCheck("├](x+1)┤[", 1, ["(x+1)"]);
	BracketEmptyCheck("⟦(x+1)⟧", 1, ["(x+1)"]);

	BracketEmptyCheck("(y∣(x+1))", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("[y∣(x+1)]", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("{y∣(x+1)}", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("⟨y∣(x+1)⟩", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("⌊y∣(x+1)⌋", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("⌈y∣(x+1)⌉", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("|y∣(x+1)|", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("‖y∣(x+1)‖", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("[y∣(x+1)┤[", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("├]y∣(x+1)┤]", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("├]y∣(x+1)┤[", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("⟦y∣(x+1)⟧", 2, [ "y", "(x+1)"]);

	BracketEmptyCheck("(∣(x+1))", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("[∣(x+1)]", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("{∣(x+1)}", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("⟨∣(x+1)⟩", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("⌊∣(x+1)⌋", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("⌈∣(x+1)⌉", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("|∣(x+1)|", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("‖∣(x+1)‖", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("[∣(x+1)┤[", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("├]∣(x+1)┤]", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("├]∣(x+1)┤[", 2, [ "", "(x+1)"]);
	BracketEmptyCheck("⟦∣(x+1)⟧", 2, [ "", "(x+1)"]);

	BracketEmptyCheck("((x+1)∣)", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("[(x+1)∣]", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("{(x+1)∣}", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("⟨(x+1)∣⟩", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("⌊(x+1)∣⌋", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("⌈(x+1)∣⌉", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("|(x+1)∣|", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("‖(x+1)∣‖", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("[(x+1)∣┤[", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("├](x+1)∣┤]", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("├](x+1)∣┤[", 2, [ "(x+1)", ""]);
	BracketEmptyCheck("⟦(x+1)∣⟧", 2, [ "(x+1)", ""]);

	BracketEmptyCheck("(∣)", 2, [ "", ""]);
	BracketEmptyCheck("[∣]", 2, [ "", ""]);
	BracketEmptyCheck("{∣}", 2, [ "", ""]);
	BracketEmptyCheck("⟨∣⟩", 2, [ "", ""]);
	BracketEmptyCheck("⌊∣⌋", 2, [ "", ""]);
	BracketEmptyCheck("⌈∣⌉", 2, [ "", ""]);
	BracketEmptyCheck("|∣|", 2, [ "", ""]);
	BracketEmptyCheck("‖∣‖", 2, [ "", ""]);
	BracketEmptyCheck("[∣┤[", 2, [ "", ""]);
	BracketEmptyCheck("├]∣┤]", 2, [ "", ""]);
	BracketEmptyCheck("├]∣┤[", 2, [ "", ""]);
	BracketEmptyCheck("⟦∣⟧", 2, [ "", ""]);

	BracketEmptyCheck("(∣∣)", 3, [ "", "", ""]);
	BracketEmptyCheck("[∣∣]", 3, [ "", "", ""]);
	BracketEmptyCheck("{∣∣}", 3, [ "", "", ""]);
	BracketEmptyCheck("⟨∣∣⟩", 3, [ "", "", ""]);
	BracketEmptyCheck("⌊∣∣⌋", 3, [ "", "", ""]);
	BracketEmptyCheck("⌈∣∣⌉", 3, [ "", "", ""]);
	BracketEmptyCheck("|∣∣|", 3, [ "", "", ""]);
	BracketEmptyCheck("‖∣∣‖", 3, [ "", "", ""]);
	BracketEmptyCheck("[∣∣┤[", 3, [ "", "", ""]);
	BracketEmptyCheck("├]∣∣┤]", 3, [ "", "", ""]);
	BracketEmptyCheck("├]∣∣┤[", 3, [ "", "", ""]);
	BracketEmptyCheck("⟦∣∣⟧", 3, [ "", "", ""]);

	BracketEmptyCheck("(┤", 1, [""]);
	BracketEmptyCheck("[┤", 1, [""]);
	BracketEmptyCheck("{┤", 1, [""]);
	BracketEmptyCheck("⟨┤", 1, [""]);
	BracketEmptyCheck("⌊┤", 1, [""]);
	BracketEmptyCheck("⌈┤", 1, [""]);
	BracketEmptyCheck("|┤", 1, [""]);
	BracketEmptyCheck("‖┤", 1, [""]);
	BracketEmptyCheck("⟦┤", 1, [""]);

	BracketEmptyCheck("(x┤", 1, ["x"]);
	BracketEmptyCheck("[x┤", 1, ["x"]);
	BracketEmptyCheck("{x┤", 1, ["x"]);
	BracketEmptyCheck("⟨x┤", 1, ["x"]);
	BracketEmptyCheck("⌊x┤", 1, ["x"]);
	BracketEmptyCheck("⌈x┤", 1, ["x"]);
	BracketEmptyCheck("|x┤", 1, ["x"]);
	BracketEmptyCheck("‖x┤", 1, ["x"]);
	BracketEmptyCheck("⟦x┤", 1, ["x"]);

	BracketEmptyCheck("(x+1┤", 1, ["x+1"]);
	BracketEmptyCheck("[x+1┤", 1, ["x+1"]);
	BracketEmptyCheck("{x+1┤", 1, ["x+1"]);
	BracketEmptyCheck("⟨x+1┤", 1, ["x+1"]);
	BracketEmptyCheck("⌊x+1┤", 1, ["x+1"]);
	BracketEmptyCheck("⌈x+1┤", 1, ["x+1"]);
	BracketEmptyCheck("|x+1┤", 1, ["x+1"]);
	BracketEmptyCheck("‖x+1┤", 1, ["x+1"]);
	BracketEmptyCheck("⟦x+1┤", 1, ["x+1"]);

	BracketEmptyCheck("(y∣(x+1)┤", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("[y∣(x+1)┤", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("{y∣(x+1)┤", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("⟨y∣(x+1)┤", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("⌊y∣(x+1)┤", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("⌈y∣(x+1)┤", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("|y∣(x+1)┤", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("‖y∣(x+1)┤", 2, [ "y", "(x+1)"]);
	BracketEmptyCheck("⟦y∣(x+1)┤", 2, [ "y", "(x+1)"]);

	BracketEmptyCheck("├┤)", 1, [""]);
	BracketEmptyCheck("├┤]", 1, [""]);
	BracketEmptyCheck("├┤}", 1, [""]);
	BracketEmptyCheck("├┤⟩", 1, [""]);
	BracketEmptyCheck("├┤⌋", 1, [""]);
	BracketEmptyCheck("├┤⌉", 1, [""]);
	BracketEmptyCheck("├┤|", 1, [""]);
	BracketEmptyCheck("├┤‖", 1, [""]);
	BracketEmptyCheck("├┤⟧", 1, [""]);

	BracketEmptyCheck("├x┤)", 1, ["x"]);
	BracketEmptyCheck("├x┤]", 1, ["x"]);
	BracketEmptyCheck("├x┤}", 1, ["x"]);
	BracketEmptyCheck("├x┤⟩", 1, ["x"]);
	BracketEmptyCheck("├x┤⌋", 1, ["x"]);
	BracketEmptyCheck("├x┤⌉", 1, ["x"]);
	BracketEmptyCheck("├x┤|", 1, ["x"]);
	BracketEmptyCheck("├x┤‖", 1, ["x"]);
	BracketEmptyCheck("├x┤⟧", 1, ["x"]);

	BracketEmptyCheck("├x+1┤)", 1, ["x+1"]);
	BracketEmptyCheck("├x+1┤]", 1, ["x+1"]);
	BracketEmptyCheck("├x+1┤}", 1, ["x+1"]);
	BracketEmptyCheck("├x+1┤⟩", 1, ["x+1"]);
	BracketEmptyCheck("├x+1┤⌋", 1, ["x+1"]);
	BracketEmptyCheck("├x+1┤⌉", 1, ["x+1"]);
	BracketEmptyCheck("├x+1┤|", 1, ["x+1"]);
	BracketEmptyCheck("├x+1┤‖", 1, ["x+1"]);
	BracketEmptyCheck("├x+1┤⟧", 1, ["x+1"]);

	QUnit.module("Brackets - Autocorrection");

	BracketEmptyCheck("()", 1, [""], true);
	BracketEmptyCheck("[]", 1, [""], true);
	BracketEmptyCheck("{}", 1, [""], true);
	BracketEmptyCheck("⟨⟩", 1, [""], true);
	BracketEmptyCheck("⌊⌋", 1, [""], true);
	BracketEmptyCheck("⌈⌉", 1, [""], true);
	BracketEmptyCheck("||", 1, [""], true);
	BracketEmptyCheck("‖‖", 1, [""], true);
	BracketEmptyCheck("[┤[", 1, [""], true);
	BracketEmptyCheck("├]┤]", 1, [""], true);
	BracketEmptyCheck("├]┤[", 1, [""], true);
	BracketEmptyCheck("⟦⟧", 1, [""], true);

	BracketEmptyCheck("(x)", 1, ["x"], true);
	BracketEmptyCheck("[x]", 1, ["x"], true);
	BracketEmptyCheck("{x}", 1, ["x"], true);
	BracketEmptyCheck("⟨x⟩", 1, ["x"], true);
	BracketEmptyCheck("⌊x⌋", 1, ["x"], true);
	BracketEmptyCheck("⌈x⌉", 1, ["x"], true);
	BracketEmptyCheck("|x|", 1, ["x"], true);
	BracketEmptyCheck("‖x‖", 1, ["x"], true);
	BracketEmptyCheck("[x┤[", 1, ["x"], true);
	BracketEmptyCheck("├]x┤]", 1, ["x"], true);
	BracketEmptyCheck("├]x┤[", 1, ["x"], true);
	BracketEmptyCheck("⟦x⟧", 1, ["x"], true);

	BracketEmptyCheck("(x+1)", 1, ["x+1"], true);
	BracketEmptyCheck("[x+1]", 1, ["x+1"], true);
	BracketEmptyCheck("{x+1}", 1, ["x+1"], true);
	BracketEmptyCheck("⟨x+1⟩", 1, ["x+1"], true);
	BracketEmptyCheck("⌊x+1⌋", 1, ["x+1"], true);
	BracketEmptyCheck("⌈x+1⌉", 1, ["x+1"], true);
	BracketEmptyCheck("|x+1|", 1, ["x+1"], true);
	BracketEmptyCheck("‖x+1‖", 1, ["x+1"], true);
	BracketEmptyCheck("[x+1┤[", 1, ["x+1"], true);
	BracketEmptyCheck("├]x+1┤]", 1, ["x+1"], true);
	BracketEmptyCheck("├]x+1┤[", 1, ["x+1"], true);
	BracketEmptyCheck("⟦x+1⟧", 1, ["x+1"], true);

	BracketEmptyCheck("((x+1))", 1, ["(x+1)"], true);
	BracketEmptyCheck("[(x+1)]", 1, ["(x+1)"], true);
	BracketEmptyCheck("{(x+1)}", 1, ["(x+1)"], true);
	BracketEmptyCheck("⟨(x+1)⟩", 1, ["(x+1)"], true);
	BracketEmptyCheck("⌊(x+1)⌋", 1, ["(x+1)"], true);
	BracketEmptyCheck("⌈(x+1)⌉", 1, ["(x+1)"], true);
	BracketEmptyCheck("|(x+1)|", 1, ["(x+1)"], true);
	BracketEmptyCheck("‖(x+1)‖", 1, ["(x+1)"], true);
	BracketEmptyCheck("[(x+1)┤[", 1, ["(x+1)"], true);
	BracketEmptyCheck("├](x+1)┤]", 1, ["(x+1)"], true);
	BracketEmptyCheck("├](x+1)┤[", 1, ["(x+1)"], true);
	BracketEmptyCheck("⟦(x+1)⟧", 1, ["(x+1)"], true);

	BracketEmptyCheck("(y∣(x+1))", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("[y∣(x+1)]", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("{y∣(x+1)}", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("⟨y∣(x+1)⟩", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("⌊y∣(x+1)⌋", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("⌈y∣(x+1)⌉", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("|y∣(x+1)|", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("‖y∣(x+1)‖", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("[y∣(x+1)┤[", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("├]y∣(x+1)┤]", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("├]y∣(x+1)┤[", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("⟦y∣(x+1)⟧", 2, [ "y", "(x+1)"], true);

	BracketEmptyCheck("(∣(x+1))", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("[∣(x+1)]", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("{∣(x+1)}", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("⟨∣(x+1)⟩", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("⌊∣(x+1)⌋", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("⌈∣(x+1)⌉", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("|∣(x+1)|", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("‖∣(x+1)‖", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("[∣(x+1)┤[", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("├]∣(x+1)┤]", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("├]∣(x+1)┤[", 2, [ "", "(x+1)"], true);
	BracketEmptyCheck("⟦∣(x+1)⟧", 2, [ "", "(x+1)"], true);

	BracketEmptyCheck("((x+1)∣)", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("[(x+1)∣]", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("{(x+1)∣}", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("⟨(x+1)∣⟩", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("⌊(x+1)∣⌋", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("⌈(x+1)∣⌉", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("|(x+1)∣|", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("‖(x+1)∣‖", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("[(x+1)∣┤[", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("├](x+1)∣┤]", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("├](x+1)∣┤[", 2, [ "(x+1)", ""], true);
	BracketEmptyCheck("⟦(x+1)∣⟧", 2, [ "(x+1)", ""], true);

	BracketEmptyCheck("(∣)", 2, [ "", ""], true);
	BracketEmptyCheck("[∣]", 2, [ "", ""], true);
	BracketEmptyCheck("{∣}", 2, [ "", ""], true);
	BracketEmptyCheck("⟨∣⟩", 2, [ "", ""], true);
	BracketEmptyCheck("⌊∣⌋", 2, [ "", ""], true);
	BracketEmptyCheck("⌈∣⌉", 2, [ "", ""], true);
	BracketEmptyCheck("|∣|", 2, [ "", ""], true);
	BracketEmptyCheck("‖∣‖", 2, [ "", ""], true);
	BracketEmptyCheck("[∣┤[", 2, [ "", ""], true);
	BracketEmptyCheck("├]∣┤]", 2, [ "", ""], true);
	BracketEmptyCheck("├]∣┤[", 2, [ "", ""], true);
	BracketEmptyCheck("⟦∣⟧", 2, [ "", ""], true);

	BracketEmptyCheck("(∣∣)", 3, [ "", "", ""], true);
	BracketEmptyCheck("[∣∣]", 3, [ "", "", ""], true);
	BracketEmptyCheck("{∣∣}", 3, [ "", "", ""], true);
	BracketEmptyCheck("⟨∣∣⟩", 3, [ "", "", ""], true);
	BracketEmptyCheck("⌊∣∣⌋", 3, [ "", "", ""], true);
	BracketEmptyCheck("⌈∣∣⌉", 3, [ "", "", ""], true);
	BracketEmptyCheck("|∣∣|", 3, [ "", "", ""], true);
	BracketEmptyCheck("‖∣∣‖", 3, [ "", "", ""], true);
	BracketEmptyCheck("[∣∣┤[", 3, [ "", "", ""], true);
	BracketEmptyCheck("├]∣∣┤]", 3, [ "", "", ""], true);
	BracketEmptyCheck("├]∣∣┤[", 3, [ "", "", ""], true);
	BracketEmptyCheck("⟦∣∣⟧", 3, [ "", "", ""], true);

	BracketEmptyCheck("(┤", 1, [""], true);
	BracketEmptyCheck("[┤", 1, [""], true);
	BracketEmptyCheck("{┤", 1, [""], true);
	BracketEmptyCheck("⟨┤", 1, [""], true);
	BracketEmptyCheck("⌊┤", 1, [""], true);
	BracketEmptyCheck("⌈┤", 1, [""], true);
	BracketEmptyCheck("|┤", 1, [""], true);
	BracketEmptyCheck("‖┤", 1, [""], true);
	BracketEmptyCheck("⟦┤", 1, [""], true);

	BracketEmptyCheck("(x┤", 1, ["x"], true);
	BracketEmptyCheck("[x┤", 1, ["x"], true);
	BracketEmptyCheck("{x┤", 1, ["x"], true);
	BracketEmptyCheck("⟨x┤", 1, ["x"], true);
	BracketEmptyCheck("⌊x┤", 1, ["x"], true);
	BracketEmptyCheck("⌈x┤", 1, ["x"], true);
	BracketEmptyCheck("|x┤", 1, ["x"], true);
	BracketEmptyCheck("‖x┤", 1, ["x"], true);
	BracketEmptyCheck("⟦x┤", 1, ["x"], true);

	BracketEmptyCheck("(x+1┤", 1, ["x+1"], true);
	BracketEmptyCheck("[x+1┤", 1, ["x+1"], true);
	BracketEmptyCheck("{x+1┤", 1, ["x+1"], true);
	BracketEmptyCheck("⟨x+1┤", 1, ["x+1"], true);
	BracketEmptyCheck("⌊x+1┤", 1, ["x+1"], true);
	BracketEmptyCheck("⌈x+1┤", 1, ["x+1"], true);
	BracketEmptyCheck("|x+1┤", 1, ["x+1"], true);
	BracketEmptyCheck("‖x+1┤", 1, ["x+1"], true);
	BracketEmptyCheck("⟦x+1┤", 1, ["x+1"], true);

	BracketEmptyCheck("(y∣(x+1)┤", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("[y∣(x+1)┤", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("{y∣(x+1)┤", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("⟨y∣(x+1)┤", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("⌊y∣(x+1)┤", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("⌈y∣(x+1)┤", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("|y∣(x+1)┤", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("‖y∣(x+1)┤", 2, [ "y", "(x+1)"], true);
	BracketEmptyCheck("⟦y∣(x+1)┤", 2, [ "y", "(x+1)"], true);

	BracketEmptyCheck("├┤)", 1, [""], true);
	BracketEmptyCheck("├┤]", 1, [""], true);
	BracketEmptyCheck("├┤}", 1, [""], true);
	BracketEmptyCheck("├┤⟩", 1, [""], true);
	BracketEmptyCheck("├┤⌋", 1, [""], true);
	BracketEmptyCheck("├┤⌉", 1, [""], true);
	BracketEmptyCheck("├┤|", 1, [""], true);
	BracketEmptyCheck("├┤‖", 1, [""], true);
	BracketEmptyCheck("├┤⟧", 1, [""], true);

	BracketEmptyCheck("├x┤)", 1, ["x"], true);
	BracketEmptyCheck("├x┤]", 1, ["x"], true);
	BracketEmptyCheck("├x┤}", 1, ["x"], true);
	BracketEmptyCheck("├x┤⟩", 1, ["x"], true);
	BracketEmptyCheck("├x┤⌋", 1, ["x"], true);
	BracketEmptyCheck("├x┤⌉", 1, ["x"], true);
	BracketEmptyCheck("├x┤|", 1, ["x"], true);
	BracketEmptyCheck("├x┤‖", 1, ["x"], true);
	BracketEmptyCheck("├x┤⟧", 1, ["x"], true);

	BracketEmptyCheck("├x+1┤)", 1, ["x+1"], true);
	BracketEmptyCheck("├x+1┤]", 1, ["x+1"], true);
	BracketEmptyCheck("├x+1┤}", 1, ["x+1"], true);
	BracketEmptyCheck("├x+1┤⟩", 1, ["x+1"], true);
	BracketEmptyCheck("├x+1┤⌋", 1, ["x+1"], true);
	BracketEmptyCheck("├x+1┤⌉", 1, ["x+1"], true);
	BracketEmptyCheck("├x+1┤|", 1, ["x+1"], true);
	BracketEmptyCheck("├x+1┤‖", 1, ["x+1"], true);
	BracketEmptyCheck("├x+1┤⟧", 1, ["x+1"], true);

	function FunctCorrect(str, strLinear, isAutoCorrect)
	{
		QUnit.test("Check func " + str, function (assert)
		{
			AscMath.SetIsAllowAutoCorrect(isAutoCorrect);
			let r = Create();
			assert.ok(true, "Create math equation");

			AddTextToRoot(str);
			assert.ok(true, "Add '" + str + "'");
			AscMath.SetIsAllowAutoCorrect(true);

			r.ConvertView(false, 0);
			assert.ok(true, "Convert to professional");

			let oFunc = r.Root.Content[1];
			assert.ok(oFunc instanceof CMathFunc, "Created CMathFunc");

			r.ConvertView(true, 0);
			assert.ok(true, "Convert to professional");
			assert.strictEqual(r.GetText(), strLinear, "Check linear content");
		});
	};
	let arr = [
		"cos", 'arcsin', 'asin', 'sin', 'arcsinh', 'asinh', 'sinh', 'arcsec', 'sec', 'asec', 'arcsech',
		'asech', 'sech', 'arccos', 'acos', 'cos', 'arccosh', 'acosh', 'cosh', 'arccsc', 'acsc', 'csc',
		'arccsch', 'acsch', 'csch', 'arctan', 'atan', 'tan', 'arctanh', 'atanh', 'tanh', 'arccot', 'acot',
		'cot', 'arccoth', 'acoth', 'coth', 'arg', 'det', 'exp', 'inf', 'lim', 'min', 'def', 'dim', 'gcd',
		'log', 'Pr', 'deg', 'erf', 'lg', 'ln', 'max', 'sup', "ker", 'hom', 'sgn',
	];

	QUnit.module("Func - Autoconvert");
	for (let i = 0; i < arr.length; i++)
	{
		let strFuncName = arr[i];
		FunctCorrect(strFuncName + " ", strFuncName + "⁡", true);
	};
	for (let i = 0; i < arr.length; i++)
	{
		let strFuncName = arr[i];
		FunctCorrect(strFuncName + "⁡" + "1", strFuncName + "⁡1", true);
	};
	for (let i = 0; i < arr.length; i++)
	{
		let strFuncName = arr[i];
		FunctCorrect(strFuncName + "⁡" + "(1+2)", strFuncName + "⁡(1+2)", true);
	};
	for (let i = 0; i < arr.length; i++)
	{
		let strFuncName = arr[i];
		FunctCorrect(strFuncName + "⁡" + "〖1+2〗", strFuncName + "⁡〖1+2〗", true);
	};

	let accentArr = ["̇", "̈", "⃛", "̂", "̌", "́", "̀", "̆", "̃", "̅", "̿", "⃖", "⃗", "⃡", "⃐", "⃑"];
	function AccentCorrect(str, strLinear, isAutoCorrect)
	{
		QUnit.test("Check accent " + str, function (assert)
		{
			AscMath.SetIsAllowAutoCorrect(isAutoCorrect);
			let r = Create();
			assert.ok(true, "Create math equation");

			AddTextToRoot(str);
			assert.ok(true, "Add '" + str + "'");
			AscMath.SetIsAllowAutoCorrect(true);

			r.ConvertView(false, 0);
			assert.ok(true, "Convert to professional");

			let oFunc = r.Root.Content[1];
			assert.ok(oFunc instanceof CAccent, "Created CAccent");

			r.ConvertView(true, 0);
			assert.ok(true, "Convert to professional");
			assert.strictEqual(r.GetText(), strLinear, "Check linear content");
		});
	};

	QUnit.module("Accent - Convert");
	for (let i = 0; i < accentArr.length; i++)
	{
		let strCurrentAccent = accentArr[i];
		AccentCorrect("x" + strCurrentAccent, "x" + strCurrentAccent, false);
	};
	for (let i = 0; i < accentArr.length; i++)
	{
		let strCurrentAccent = accentArr[i];
		AccentCorrect("(1+2)" + strCurrentAccent, "(1+2)" + strCurrentAccent, false);
	};
	for (let i = 0; i < accentArr.length; i++)
	{
		let strCurrentAccent = accentArr[i];
		AccentCorrect("[1+2]" + strCurrentAccent, "(" + "[1+2]" + ")" + strCurrentAccent, false);
	};

	QUnit.module("Accent - Autocorrect");
	for (let i = 0; i < accentArr.length; i++)
	{
		let strCurrentAccent = accentArr[i];
		AccentCorrect("x" + strCurrentAccent + " ", "x" + strCurrentAccent, true);
	};
	for (let i = 0; i < accentArr.length; i++)
	{
		let strCurrentAccent = accentArr[i];
		AccentCorrect("(1+2)" + strCurrentAccent + " ", "(1+2)" + strCurrentAccent, false);
	};
	for (let i = 0; i < accentArr.length; i++)
	{
		let strCurrentAccent = accentArr[i];
		AccentCorrect("[1+2]" + strCurrentAccent + " ", "(" + "[1+2]" + ")" + strCurrentAccent, false);
	};

	QUnit.module("Underbar/Overbar - Correct")

	let arrUnderbar = ["⏞", "⏟"];

	function AccentBar(str, strLinear, isAutoCorrect)
	{
		QUnit.test("Check Underbar/Overbar " + str, function (assert)
		{
			AscMath.SetIsAllowAutoCorrect(isAutoCorrect);
			let r = Create();
			assert.ok(true, "Create math equation");

			AddTextToRoot(str);
			assert.ok(true, "Add '" + str + "'");
			AscMath.SetIsAllowAutoCorrect(true);

			r.ConvertView(false, 0);
			assert.ok(true, "Convert to professional");

			let oLimit = r.Root.Content[1];
			console.log(oLimit)
			assert.ok(oLimit instanceof CGroupCharacter, "Created CGroupCharacter");

			r.ConvertView(true, 0);
			assert.ok(true, "Convert to professional");
			assert.strictEqual(r.GetText(), strLinear, "Check linear content");
		});
	};

	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str, str, false);
	}
	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str + "x", str + "x", false);
	}
	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str + "(x+1)", str + "(x+1)", false);
	}
	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str + "[x+1]", str + "(" + "[x+1]" + ")", false);
	}
	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str + "[x+1]", str + "(" + "[x+1]" + ")", false);
	}



	QUnit.module("Underbar/Overbar - above/below - Correct")

	let arrUnderbar = ["⏞", "⏟"];
	let content = ["┴", "┴"];

	function AccentBar(str, strLinear, isAutoCorrect)
	{
		QUnit.test("Check Underbar/Overbar " + str, function (assert)
		{
			AscMath.SetIsAllowAutoCorrect(isAutoCorrect);
			let r = Create();
			assert.ok(true, "Create math equation");

			AddTextToRoot(str);
			assert.ok(true, "Add '" + str + "'");
			AscMath.SetIsAllowAutoCorrect(true);

			r.ConvertView(false, 0);
			assert.ok(true, "Convert to professional");

			let oLimit = r.Root.Content[1];
			console.log(oLimit)
			assert.ok(oLimit instanceof CGroupCharacter, "Created CGroupCharacter");

			r.ConvertView(true, 0);
			assert.ok(true, "Convert to professional");
			assert.strictEqual(r.GetText(), strLinear, "Check linear content");
		});
	};

	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str , str, false);
	}
	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str + "x", str + "x", false);
	}
	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str + "(x+1)", str + "(x+1)", false);
	}
	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str + "[x+1]", str + "(" + "[x+1]" + ")", false);
	}
	for (let i = 0; i < arrUnderbar.length; i++)
	{
		let str = arrUnderbar[i];
		AccentBar(str + "[x+1]", str + "(" + "[x+1]" + ")", false);
	}

	//autocorrection triggers
	//find tokens
})
