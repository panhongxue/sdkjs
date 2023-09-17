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
    const Literals = AscMath.MathLiterals;
    const Struc = AscMath.MathStructures;

    const UnicodeSpecialScript = AscMath.UnicodeSpecialScript;
    const ConvertTokens = AscMath.ConvertTokens;
    const Tokenizer = AscMath.Tokenizer;
    const FunctionNames = AscMath.MathAutoCorrectionFuncNames;
    const LimitNames = AscMath.LimitFunctions;

    function CUnicodeParser()
    {
        this.oTokenizer = new Tokenizer(false);
        this.isTextLiteral = false;
        this.arrSavedTokens = [];
        this.isSaveTokens = false;
        this.SearchContext = [];

        //need for group like "|1+2|"
        this.strBreakSymbol = [];
    }

    CUnicodeParser.prototype.IsNotStopToken = function ()
    {
        if (this.SearchContext.length === 0)
            return true;

        let isFind,
            LastToken = this.SearchContext[this.SearchContext.length - 1];

        if (Array.isArray(LastToken))
            isFind = LastToken.includes(this.oLookahead.data);
        else
            isFind = this.oLookahead.data === LastToken;

        return !isFind;
    };
    CUnicodeParser.prototype.SetStopToken = function (str)
    {
        this.SearchContext.push(str);
    };
    CUnicodeParser.prototype.RemoveLastStopToken = function ()
    {
        let lastToken = this.SearchContext[this.SearchContext.length - 1];

        if (Array.isArray(lastToken))
        {
            for (let i = 0, len = lastToken.length; i < len; i++)
            {
                if (lastToken[i] === this.oLookahead.data)
                {
                    lastToken.splice(i, 1);
                    break;
                }
            }
        }
        else if (this.oLookahead.data === lastToken)
        {
            this.SearchContext.pop();
        }
    };
    CUnicodeParser.prototype.RemoveLastStopTokenForce = function ()
    {
        if (this.SearchContext.length > 0)
        {
            this.SearchContext.pop();
        }
    };
    CUnicodeParser.prototype.Parse = function (string)
    {
        this.oTokenizer.Init(string);

        // while (this.oTokenizer.IsHasMoreTokens())
        // {
        //     console.log( this.oTokenizer.GetNextToken())
        // }
        // return
        this.oLookahead = this.oTokenizer.GetNextToken();
        return this.Program();
    };
    CUnicodeParser.prototype.Program = function ()
    {
        const arrExp = [];
        while (this.oLookahead.data)
        {
            if (this.IsExpLiteral())
                arrExp.push(this.GetExpLiteral());
            else
                this.WriteDataAsCharLiteral(arrExp);
        }

        return {type: "UnicodeEquation", body: arrExp};
    };
    CUnicodeParser.prototype.WriteDataAsCharLiteral = function (arrExp)
    {
		let newData = {
			type: Literals.char.id,
			value: this.oLookahead.data,
			style: this.oLookahead.style
		};

        arrExp.push(newData);
        this.EatToken(this.oLookahead.class);
    };
    CUnicodeParser.prototype.GetSpaceLiteral = function ()
    {
        const oSpaceLiteral = this.EatToken(Literals.space.id);
        return {
            type: Struc.space,
            value: oSpaceLiteral.data,
            style: oSpaceLiteral.style,
        };
    };
    CUnicodeParser.prototype.IsSpaceLiteral = function ()
    {
        return this.oLookahead.class === Literals.space.id;
    };
    CUnicodeParser.prototype.GetOpCloseLiteral = function ()
    {
        let oCloseLiteral;

        if (this.oLookahead.data === "┤")
            return this.EatToken(this.oLookahead.class).data;

        if (this.oLookahead.class === Literals.lrBrackets.id)
        {
            oCloseLiteral = this.EatToken(Literals.lrBrackets.id);
            return oCloseLiteral.data;
        }

        oCloseLiteral = this.EatToken(Literals.rBrackets.id);
        return oCloseLiteral.data;
    };
    // CUnicodeParser.prototype.GetOpCloserLiteral = function () {
    // 	switch (this.oLookahead.class) {
    // 		case "┤":
    // 			return {
    // 				type: Struc.char,
    // 				value: this.EatToken("┤").data,
    // 			};
    // 		case Literals.rBrackets.id:
    // 		case Literals.lrBrackets.id:
    // 			return this.GetOpCloseLiteral();
    // 	}
    // };
    CUnicodeParser.prototype.IsOpNaryLiteral = function ()
    {
        return this.oLookahead.class === Literals.nary.id;
    };
    CUnicodeParser.prototype.GetOpNaryLiteral = function ()
    {
        let oContent;
        let oNaryPr = this.oLookahead.style;
		let oOfStyle;
        let strNaryLiteral = this.EatToken(Literals.nary.id).data;

        if (this.oLookahead.class === Literals.of.id)
        {
			oOfStyle = this.oLookahead.style;
            this.EatToken( Literals.of.id);
            oContent = this.GetElementLiteral()
        }
		else if (this.oLookahead.class !== Literals.subSup.id)
		{
			oContent = this.GetElementLiteral()
		}

        return {
            type: Struc.nary,
            value: strNaryLiteral,
            third: oContent,
	        thirdStyle: oOfStyle,
            style: oNaryPr,
        }
    };
    CUnicodeParser.prototype.GetOpOpenLiteral = function ()
    {
        let oOpLiteral;

        if (this.oLookahead.class === Literals.lrBrackets.id)
        {
            oOpLiteral = this.EatToken(Literals.lrBrackets.id);
            return oOpLiteral.data;
        }

        oOpLiteral = this.EatToken(Literals.lBrackets.id);

        return oOpLiteral.data;
    };
    CUnicodeParser.prototype.IsOpOpenLiteral = function ()
    {
        return this.oLookahead.class === Literals.lrBrackets.id ||
            this.oLookahead.class === Literals.lBrackets.id;
    };
    CUnicodeParser.prototype.IsOpOpenerLiteral = function ()
    {
        return this.oLookahead.class === Literals.lBrackets.id;
    };
    CUnicodeParser.prototype.GetDigitsLiteral = function ()
    {
        const arrNASCIIList = [this.GetASCIILiteral()];

        while (this.oLookahead.class === "nASCII")
            arrNASCIIList.push(this.GetASCIILiteral());

        return this.GetContentOfLiteral(arrNASCIIList);
    };
    CUnicodeParser.prototype.IsDigitsLiteral = function ()
    {
        return this.oLookahead.class === Literals.number.id;
    };
    CUnicodeParser.prototype.GetNumberLiteral = function ()
    {
        return this.GetDigitsLiteral();
    };
    CUnicodeParser.prototype.IsNumberLiteral = function ()
    {
        return this.IsDigitsLiteral();
    };
    CUnicodeParser.prototype.EatCloseOrOpenBracket = function ()
    {
        let strOpenLiteral,
            strCloseLiteral,
            oExp,
            startStyle,
            endStyle;

        if (this.oLookahead.data === "├")
        {
			this.strBreakSymbol.push("|", "‖");

            startStyle = this.oLookahead.style;
            this.EatToken(this.oLookahead.class);

            if (this.oLookahead.class === Literals.lrBrackets.id || this.oLookahead.class === Literals.lBrackets.id || this.oLookahead.class === Literals.rBrackets.id)
            {
                strOpenLiteral = this.EatBracket();
            }
            else
            {
                strOpenLiteral = ".";
            }

            let arrContent = this.GetContentOfBracket();
            oExp = arrContent[0];
            let counter = arrContent[1];

            if (this.oLookahead.data === "┤")
            {
                endStyle = this.oLookahead.style;
                this.EatToken(this.oLookahead.class);
            }

            if (this.oLookahead.class === Literals.lrBrackets.id || this.oLookahead.class === Literals.rBrackets.id || this.oLookahead.class === Literals.lBrackets.id)
            {
	            endStyle = this.oLookahead.style;
                strCloseLiteral = this.EatBracket();
            }
            else
            {
                strCloseLiteral = ".";
            }

            return {
                type: Struc.bracket_block,
                left: strOpenLiteral,
                right: strCloseLiteral,
                value: oExp,
                counter: counter,
                style: {
                    startStyle : startStyle,
                    endStyle : endStyle,
	                middle: [],
                }
            };
        }
    };
    CUnicodeParser.prototype.EatBracket = function ()
    {
		return this.EatToken(this.oLookahead.class).data;
    };
    CUnicodeParser.prototype.GetSoOperandLiteral = function (isSubSup)
    {
        if (this.IsOperandLiteral())
        {
            let one = this.GetOperandLiteral(isSubSup);
            this.EatOneSpace();
            return one;
        }

        switch (this.oLookahead.data)
        {
            case "-":
                let minus = this.EatToken(Literals.operator.id);

                if (this.IsOperandLiteral())
                {
                    const operand = this.GetOperandLiteral();
                    this.EatOneSpace();
                    return {
                        type: Struc.minus,
                        value: operand,
                    };
                }

                return {
                    type: Struc.char,
                    value: minus.data,
                }
            case "-∞":
                const token = this.EatToken(Literals.operator.id);
                return token.data;
            case "∞":
                const tokens = this.EatToken(Literals.operator.id);
                return tokens.data;
        }

        if (this.oLookahead.class === Literals.operator.id)
        {
            let one = this.GetOperandLiteral(isSubSup);
            this.EatOneSpace();
            return one;
        }

    };
    CUnicodeParser.prototype.IsSoOperandLiteral = function ()
    {
        return this.IsOperandLiteral() ||
            this.oLookahead.data === "-" ||
            this.oLookahead.data === "-∞" ||
            this.oLookahead.data === "∞"
    };
    CUnicodeParser.prototype.IsTextLiteral = function ()
    {
        return (this.oLookahead.data === "\"" || this.oLookahead.data === "\'") && !this.isTextLiteral
    };
    CUnicodeParser.prototype.GetTextLiteral = function ()
    {
        this.EatToken(this.oLookahead.class);
        let strExp = "";

        while (this.oLookahead.data !== "\"" && this.oLookahead.data !== "\'" && this.oLookahead.class !== undefined)
            strExp += this.EatToken(this.oLookahead.class).data;

        if (this.oLookahead.data === "\"" || this.oLookahead.data === "\'")
            this.EatToken(this.oLookahead.class);

        return {
            type: Struc.plain,
            value: strExp,
        }
    };
    CUnicodeParser.prototype.IsBoxLiteral = function ()
    {
        return this.oLookahead.data === "□";
    };
    CUnicodeParser.prototype.GetBoxLiteral = function ()
    {
        this.SaveTokensWhileReturn();

        if (this.oLookahead.data === "□")
        {
            let ctrlPr = this.oLookahead.style;
            this.EatToken(this.oLookahead.class);
            if (this.IsOperandLiteral())
            {
                const oToken = this.GetOperandLiteral();
                this.EatOneSpace();
                return {
                    type: Struc.box,
                    value: oToken,
                    style: ctrlPr,
                };
            }
        }

        return this.WriteSavedTokens();
    };
    CUnicodeParser.prototype.isRectLiteral = function ()
    {
        return this.oLookahead.class === Literals.rect.id;
    };
	CUnicodeParser.prototype.GetRectLiteral = function ()
	{
        let oCtrPr = this.oLookahead.style;
		this.EatToken(this.oLookahead.class);
		this.EatOneSpace();
		if (this.IsOperandLiteral())
		{
			const oToken = this.GetOperandLiteral();
			this.EatOneSpace();
			return {
				type: Struc.rect,
				value: oToken,
                style: oCtrPr,
			};
		}
		else
		{
			return {
				type: Struc.rect,
				value: {},
                style: oCtrPr,
			};
		}
	};
	CUnicodeParser.prototype.GetHBracketLiteral = function (oBase)
	{
		let strHBracket = this.oLookahead,
			oUp, oDown;
        let oPr = this.oLookahead.style;
		this.EatToken(this.oLookahead.class);

		if (this.IsOperandLiteral())
		{
			if (!oBase)
			{
				this.EatOneSpace();
				oBase = this.GetOperandLiteral("custom");
			}

			if (this.IsScriptStandardContentLiteral())
			{
				if (this.oLookahead.data === "_")
				{
					this.EatToken(this.oLookahead.class);
					oDown = this.GetSoOperandLiteral();
				}
				else if (this.oLookahead.data === "^")
				{
					this.EatToken(this.oLookahead.class);
					oUp = this.GetSoOperandLiteral();
				}
			}
			else if (this.IsOperandLiteral())
			{
				oDown = this.GetOperandLiteral("custom");

				return {
					type: Struc.limit,
					base: {
						type: Struc.group_character,
						hBrack: strHBracket,
						value: oBase,
						up: oUp,
						down: oDown,
						style: oPr,
					},
					value: oDown,
					style: oPr,
				}
			}

			return {
				type: Struc.group_character,
				hBrack: strHBracket,
				value: oBase,
				up: oUp,
				down: oDown,
                style: oPr,
			};
		}

		return {
			type: Struc.group_character,
			hBrack: strHBracket,
			value: oBase,
            style: oPr,
		};
    };
    CUnicodeParser.prototype.IsHBracketLiteral = function ()
    {
        return this.oLookahead.class === Literals.hbrack.id
    };
    CUnicodeParser.prototype.IsRootLiteral = function ()
    {
        return this.oLookahead.data === "⒭";
    };
    CUnicodeParser.prototype.GetRootLiteral = function ()
    {
        let oRadicalStyle = this.oLookahead.style;
        this.EatToken(this.oLookahead.class);
        this.EatOneSpace();

        let oIndex = this.GetExpLiteral();
        let oBase;

        if (this.oLookahead.data === "▒")
        {
            this.EatToken(this.oLookahead.class);
            this.EatOneSpace();
            oBase = this.GetExpLiteral();
        }

        return {
            type: Struc.radical,
            index: oIndex,
            value: oBase,
            style: oRadicalStyle,
        }
    };
    CUnicodeParser.prototype.GetCubertLiteral = function ()
    {
        this.EatToken(this.oLookahead.class);

        return this.GetContentOfAnyTypeRadical({
            type: Struc.char,
            value: "3",
        });
    };
    CUnicodeParser.prototype.IsCubertLiteral = function ()
    {
        return this.oLookahead.data === "∛" && this.oLookahead.class !== Literals.operator.id;
    };
    CUnicodeParser.prototype.GetFourthrtLiteral = function ()
    {
        this.EatToken(Literals.radical.id);

        return this.GetContentOfAnyTypeRadical({
            type: Struc.char,
            value: "4",
        });
    };
    CUnicodeParser.prototype.IsFourthrtLiteral = function ()
    {
        return this.oLookahead.data === "∜" && this.oLookahead.class !== Literals.operator.id;
    };
    CUnicodeParser.prototype.GetNthrtLiteral = function ()
    {
        let oPr = this.oLookahead.style;
        this.EatToken(this.oLookahead.class);
        return this.GetContentOfAnyTypeRadical(undefined, oPr);
    };
    CUnicodeParser.prototype.IsNthrtLiteral = function ()
    {
        return this.oLookahead.data === "√" && this.oLookahead.class !== Literals.operator.id || this.oLookahead.data === "√(";
    };
    CUnicodeParser.prototype.GetContentOfAnyTypeRadical = function (index, oRadicalStyle)
    {
        let oIndex, oContent;

        if (this.IsOpOpenLiteral())
        {
            let open = this.GetOpOpenLiteral(),
				close;

			let isIndex = false;

            if (this.IsOperandLiteral())
            {
                this.SetStopToken("&");
                this.EatOneSpace();
                oIndex = this.GetExpLiteral();
                this.RemoveLastStopToken();
                this.EatOneSpace();

                if (this.oLookahead.data === "&")
                {
					isIndex = true;
                    this.EatToken(this.oLookahead.class);

                    if (this.IsOperandLiteral())
                        oContent = this.GetExpLiteral();
                }
                else
                {
                    oContent = oIndex;
                    oIndex = undefined;
                }
            }

            if (this.oLookahead.class === Literals.rBrackets.id)
                close = this.EatToken(Literals.rBrackets.id).data;

			if (open !== "(" && close !== ")" && !isIndex)
			{
				oContent = {
					type: Struc.bracket_block,
					value: [oContent],
					left: open,
					right: close,
					counter: 1,
					style: {
						startStyle : undefined,
						endStyle : undefined,
						middle: undefined,
					}
				}
			}
        }
        else if (this.IsOperandLiteral())
        {
            this.EatOneSpace();
            oContent = this.GetOperandLiteral();
            this.EatOneSpace();
        }

        return {
            type: Struc.radical,
            index: index ? index : oIndex,
            value: oContent,
            style: oRadicalStyle
        };
    };
    CUnicodeParser.prototype.IsFunctionLiteral = function ()
    {
        return this.IsRootLiteral()     ||
            this.IsCubertLiteral()      ||
            this.IsFourthrtLiteral()    ||
            this.IsNthrtLiteral()       ||
            this.IsBoxLiteral()         ||
            this.isRectLiteral()        ||
            this.IsHBracketLiteral()    ||
	        this.IsStretchArrow()       ||
            this.IsGetNameOfFunction()  ||
            this.oLookahead.class === "▁" ||
	        this.oLookahead.class === "¯";
    };
    CUnicodeParser.prototype.GetFunctionLiteral = function ()
    {
        let oFunctionContent;

        if (this.IsRootLiteral())
            oFunctionContent = this.GetRootLiteral();
        else if (this.IsCubertLiteral())
            oFunctionContent = this.GetCubertLiteral();
        else if (this.IsFourthrtLiteral())
            oFunctionContent = this.GetFourthrtLiteral();
        else if (this.IsNthrtLiteral())
            oFunctionContent = this.GetNthrtLiteral();
        else if (this.IsBoxLiteral())
            oFunctionContent = this.GetBoxLiteral();
        else if (this.isRectLiteral())
            oFunctionContent = this.GetRectLiteral();
        else if (this.IsHBracketLiteral())
            oFunctionContent = this.GetHBracketLiteral();
		else if (this.IsStretchArrow())
			oFunctionContent = this.GetStretchArrow()
        else if (this.IsGetNameOfFunction())
            oFunctionContent = this.GetNameOfFunction()
        return oFunctionContent;
    };
	CUnicodeParser.prototype.IsStretchArrow = function ()
	{
		return this.oLookahead.class === Literals.horizontal.id;
	}
	CUnicodeParser.prototype.GetStretchArrow = function ()
	{
		let oPr = this.oLookahead.style;
		let data = this.EatToken(this.oLookahead.class);
		return {
			type: Struc.horizontal,
			data: data,
		}
	}
    CUnicodeParser.prototype.IsGetNameOfFunction = function ()
    {
        return this.oLookahead.class === Literals.func.id;
    };
    CUnicodeParser.prototype.GetNameOfFunction = function ()
    {
		let oName = this.EatToken(this.oLookahead.class);
		this.EatOneSpace();

		if (this.IsApplicationFunction())
			return this.GetFunctionApplication(oName)

		return {
			type: Struc.char,
			value: oName.data,
            style: oName.style,
		}
    };
    CUnicodeParser.prototype.IsExpBracketLiteral = function ()
    {
        return (
            this.IsOpOpenerLiteral() ||
            this.oLookahead.class === Literals.lrBrackets.id ||
            this.oLookahead.data === "├"
        ) && !this.strBreakSymbol.includes(this.oLookahead.data) && this.strBreakSymbol[this.strBreakSymbol.length - 1] !== this.oLookahead.data;
    };
    CUnicodeParser.prototype.IsOpCloserLiteral = function ()
    {
        return this.oLookahead.class === Literals.rBrackets.id || this.oLookahead.class === Literals.lrBrackets.id || this.oLookahead.data === "┤"
    };
    CUnicodeParser.prototype.GetExpBracketLiteral = function ()
    {
        let strOpen,
            strClose,
            startStyle,
            endStyle,
            oExp;

        if (this.oLookahead.class === Literals.lBrackets.id || this.oLookahead.class === Literals.lrBrackets.id)
        {
            startStyle = this.oLookahead.style;
            strOpen = this.GetOpOpenLiteral();

            if (strOpen === "|" || strOpen === "‖")
            {
                this.strBreakSymbol.push(strOpen);
            }

            if (this.IsPreScriptLiteral() && strOpen === "(")
            {
                return this.GetPreScriptLiteral();
            }

            let arrContent = this.GetContentOfBracket();
            oExp = arrContent[0];
            let counter = arrContent[1];
			let middle_styles = arrContent[2];

            if (oExp.length === 0 && !this.IsOpCloserLiteral())
            {
                return {
                    type: Struc.char,
                    value: strOpen,
	                style: startStyle
                }
            }

			if (this.oLookahead.class === Literals.specialBrac.id)
			{
				this.EatToken(this.oLookahead.class);

				if (this.oLookahead.class === Literals.lrBrackets.id || this.oLookahead.class === Literals.rBrackets.id || this.oLookahead.class === Literals.lBrackets.id)
				{
					strClose = this.GetOpCloseLiteral();
				}
				else
				{
					strClose = ".";
				}
			}
			else if (this.oLookahead.class === Literals.lrBrackets.id || this.oLookahead.class === Literals.rBrackets.id)
			{
                endStyle = this.oLookahead.style;
				strClose = this.GetOpCloseLiteral();
			}
			else
			{
				strClose = ".";
			}

            if (strOpen === "〖" && strClose === "〗")
            {
                return oExp;
            }

            return {
                type: Struc.bracket_block,
                value: oExp,
                left: strOpen,
                right: strClose,
                counter: counter,
	            style: {
		            startStyle : startStyle,
		            endStyle : endStyle,
		            middle: middle_styles,
	            },
            };
        }
        else if (this.oLookahead.data === "├")
        {
            return this.EatCloseOrOpenBracket();
        }
    };
    CUnicodeParser.prototype.GetContentOfBracket = function ()
    {
        let arrContent = [];
        let intCountOfBracketBlock = 1;
		let styles = [];

        while (this.IsExpLiteral() || this.oLookahead.class === Literals.delimiter.id || this.oLookahead.data === "ⓜ")
        {
            if (this.IsExpLiteral())
            {
                let oToken = this.GetExpLiteral();
                if ((oToken && !Array.isArray(oToken)) || Array.isArray(oToken) && oToken.length > 0)
                    arrContent.push(oToken)
            }
            else
            {
				if (arrContent.length === 0)
				{
					arrContent.push({});
				}

				styles.push(this.oLookahead.style);
				this.EatToken(this.oLookahead.class);

				if (!this.IsExpLiteral())
				{
					arrContent.push({});
				}

				intCountOfBracketBlock++;
			}
		}
		return [arrContent, intCountOfBracketBlock, styles];
    }
    CUnicodeParser.prototype.GetPreScriptLiteral = function ()
    {
        let oFirstSoOperand,
            oSecondSoOperand,
            oBase;

        let strTypeOfPreScript = this.oLookahead.data;

        this.EatToken(this.oLookahead.class);

        if (strTypeOfPreScript === "_")
            oFirstSoOperand = this.GetSoOperandLiteral("preScript");
        else
            oSecondSoOperand = this.GetSoOperandLiteral("preScript");

        if (this.oLookahead.data !== strTypeOfPreScript && this.IsPreScriptLiteral())
        {
            this.EatToken(this.oLookahead.class);
            if (strTypeOfPreScript === "_")
                oSecondSoOperand = this.GetSoOperandLiteral("preScript");
            else
                oFirstSoOperand = this.GetSoOperandLiteral("preScript");
        }

        if (this.oLookahead.class === Literals.lrBrackets.id)
            this.EatToken(Literals.lrBrackets.id);
        else if (this.oLookahead.class === Literals.rBrackets.id)
            this.EatToken(Literals.rBrackets.id);

        this.EatOneSpace();
        oBase = this.GetElementLiteral();
        this.EatOneSpace();

        return {
            type: Struc.pre_script,
            value: oBase,
            down: oFirstSoOperand,
            up: oSecondSoOperand,
        }
    };
    CUnicodeParser.prototype.IsPreScriptLiteral = function ()
    {
        return (this.oLookahead.data === "_" || this.oLookahead.data === "^")
    };
    CUnicodeParser.prototype.GetScriptBaseLiteral = function ()
    {
        // if (this.oLookahead.class === oLiteralNames.anMathLiteral[0]) {
        // 	return this.GetAnMathLiteral();
        // }
        //else
        if (this.IsNumberLiteral())
        {
            return this.GetNumberLiteral();
        }
        else if (this.isOtherLiteral())
        {
            return this.GetOtherLiteral();
        }
        else if (this.IsExpBracketLiteral())
        {
            return this.GetExpBracketLiteral();
        }
            // else if (this.oLookahead.class === oLiteralNames.opBuildupLiteral[0]) {
            // 	return this.GetOpNaryLiteral();
        // }
        else if (this.IsAnOtherLiteral())
        {
            return this.GetAnOtherLiteral();
        }
        else if (this.oLookahead.class === Literals.char.id)
        {
            return this.GetCharLiteral();
        }
        else if (this.IsCubertLiteral())
        {
            return this.GetCubertLiteral();
        }
        else if (this.IsFourthrtLiteral())
        {
            return this.GetFourthrtLiteral();
        }
        else if (this.IsNthrtLiteral())
        {
            return this.GetNthrtLiteral();
        }
    };
    // CUnicodeParser.prototype.IsScriptBaseLiteral = function () {
    // 	return (
    // 		this.IsWordLiteral() ||
    // 		this.IsNumberLiteral() ||
    // 		this.isOtherLiteral() ||
    // 		this.IsExpBracketLiteral() ||
    // 		this.oLookahead.class === "anOther" ||
    // 		this.oLookahead.class === Literals.nary.id ||
    // 		this.oLookahead.class === "┬" ||
    // 		this.oLookahead.class === "┴" ||
    // 		this.oLookahead.class === oLiteralNames.charLiteral[0] ||
    // 		this.oLookahead.class === oLiteralNames.anMathLiteral[0]
    // 	);
    // };
    // CUnicodeParser.prototype.GetScriptSpecialContent = function (base) {
    // 	let oFirstSoOperand = [],
    // 		oSecondSoOperand = [];
    //
    // 	const ProceedScript = function (context) {
    // 		while (context.IsScriptSpecialContent()) {
    // 			if (context.oLookahead.class === oLiteralNames.specialScriptNumberLiteral[0]) {
    // 				let oSpecial = context.ReadTokensWhileEnd(oLiteralNames.specialScriptNumberLiteral, true);
    // 				oFirstSoOperand.push(oSpecial);
    // 			}
    // 			if (context.oLookahead.class === oLiteralNames.specialScriptCharLiteral[0]) {
    // 				let oSpecial = context.ReadTokensWhileEnd(oLiteralNames.specialScriptCharLiteral, true);
    // 				oFirstSoOperand.push(oSpecial);
    // 			}
    // 			if (context.oLookahead.class === oLiteralNames.specialScriptBracketLiteral[0]) {
    // 				let oSpecial = context.ReadTokensWhileEnd(oLiteralNames.specialScriptBracketLiteral, true)
    // 				oFirstSoOperand.push(oSpecial);
    // 			}
    // 			if (context.oLookahead.class === oLiteralNames.specialScriptOperatorLiteral[0]) {
    // 				let oSpecial = context.ReadTokensWhileEnd(oLiteralNames.specialScriptOperatorLiteral, true)
    // 				oFirstSoOperand.push(oSpecial);
    // 			}
    // 		}
    // 	};
    // 	const ProceedIndex = function (context) {
    // 		while (context.IsIndexSpecialContent()) {
    // 			if (context.oLookahead.class === oLiteralNames.specialIndexNumberLiteral[0]) {
    // 				let oSpecial = context.ReadTokensWhileEnd(oLiteralNames.specialIndexNumberLiteral, true);
    // 				oSecondSoOperand.push(oSpecial);
    // 			}
    // 			if (context.oLookahead.class === oLiteralNames.specialIndexCharLiteral[0]) {
    // 				let oSpecial = context.ReadTokensWhileEnd(oLiteralNames.specialIndexCharLiteral, true);
    // 				oSecondSoOperand.push(oSpecial);
    // 			}
    // 			if (context.oLookahead.class === oLiteralNames.specialIndexBracketLiteral[0]) {
    // 				let oSpecial = context.ReadTokensWhileEnd(oLiteralNames.specialIndexBracketLiteral, true)
    // 				oSecondSoOperand.push(oSpecial);
    // 			}
    // 			if (context.oLookahead.class === oLiteralNames.specialIndexOperatorLiteral[0]) {
    // 				let oSpecial = context.ReadTokensWhileEnd(oLiteralNames.specialIndexOperatorLiteral, true)
    // 				oSecondSoOperand.push(oSpecial);
    // 			}
    // 		}
    // 	};
    //
    // 	if (this.IsScriptSpecialContent()) {
    // 		ProceedScript(this);
    // 		if (this.IsIndexSpecialContent()) {
    // 			ProceedIndex(this);
    // 		}
    // 	} else if (this.IsIndexSpecialContent()) {
    // 		ProceedIndex(this);
    // 		if (this.IsScriptSpecialContent()) {
    // 			ProceedScript(this);
    // 		}
    // 	}
    //
    // 	return {
    // 		type: Struc.sub_sub,
    // 		value: base,
    // 		down: oSecondSoOperand,
    // 		up: oFirstSoOperand,
    // 	};
    // }
    // CUnicodeParser.prototype.IsSpecialContent = function () {
    // 	return false
    // 	// return (
    // 	// 	this.oLookahead.class === oLiteralNames.specialScriptNumberLiteral[0] ||
    // 	// 	this.oLookahead.class === oLiteralNames.specialScriptCharLiteral[0] ||
    // 	// 	this.oLookahead.class === oLiteralNames.specialScriptBracketLiteral[0] ||
    // 	// 	this.oLookahead.class === oLiteralNames.specialScriptOperatorLiteral[0] ||
    // 	//
    // 	// 	this.oLookahead.class === oLiteralNames.specialIndexNumberLiteral[0] ||
    // 	// 	this.oLookahead.class === oLiteralNames.specialIndexCharLiteral[0] ||
    // 	// 	this.oLookahead.class === oLiteralNames.specialIndexBracketLiteral[0] ||
    // 	// 	this.oLookahead.class === oLiteralNames.specialIndexOperatorLiteral[0]
    // 	//
    // 	// );
    // };
    // CUnicodeParser.prototype.IsScriptSpecialContent = function () {
    // 	return (
    // 		this.oLookahead.class === oLiteralNames.specialScriptNumberLiteral[0] ||
    // 		this.oLookahead.class === oLiteralNames.specialScriptCharLiteral[0] ||
    // 		this.oLookahead.class === oLiteralNames.specialScriptBracketLiteral[0] ||
    // 		this.oLookahead.class === oLiteralNames.specialScriptOperatorLiteral[0]
    // 	);
    // };
    // CUnicodeParser.prototype.IsIndexSpecialContent = function () {
    // 	return (
    // 		this.oLookahead.class === oLiteralNames.specialIndexNumberLiteral[0] ||
    // 		this.oLookahead.class === oLiteralNames.specialIndexCharLiteral[0] ||
    // 		this.oLookahead.class === oLiteralNames.specialIndexBracketLiteral[0] ||
    // 		this.oLookahead.class === oLiteralNames.specialIndexOperatorLiteral[0]
    // 	);
    // };
    CUnicodeParser.prototype.IsExpSubSupLiteral = function ()
    {
        return (
            this.IsScriptStandardContentLiteral() ||
            this.IsScriptBelowOrAboveContent()
            //this.IsSpecialContent()
        );
    };
    CUnicodeParser.prototype.GetExpSubSupLiteral = function (oBase)
	{
		let oThirdSoOperand,
			oContent,
            oOfStyle;

		if (undefined === oBase)
			oBase = this.GetScriptBaseLiteral();

        if (this.IsScriptStandardContentLiteral())
        {
            oContent = this.GetScriptStandardContentLiteral(oBase);
        }
        else if (this.IsScriptBelowOrAboveContent())
        {
            oContent = this.GetScriptBelowOrAboveContent(oBase);
        }

        this.EatOneSpace();

        if (oBase.type === Struc.radical || oBase.type === Struc.nary)
        {
            if (this.oLookahead.class === Literals.of.id)
            {
                oOfStyle = this.oLookahead.style;
                this.EatToken();
                oThirdSoOperand = this.GetElementLiteral();
                return {
                    type: Struc.sub_sub,
                    value: oBase,
                    down: oContent.down,
                    up: oContent.up,
                    third: oThirdSoOperand,
                    style: {
                        subStyle: oContent.style.subStyle,
                        supStyle: oContent.style.supStyle,
                        ofStyle: oOfStyle,
                    },
                };
            }
            else
            {
                return {
                    type: Struc.sub_sub,
                    value: oBase,
                    down: oContent.down,
                    up: oContent.up,
                    third: undefined,
                    style: {
                        subStyle: oContent.style.subStyle,
                        supStyle: oContent.style.supStyle,
                        oOfStyle: oOfStyle,
                    }
                };
            }
        }

        this.EatOneSpace();

        return oContent;
    };
    CUnicodeParser.prototype.EatOneSpace = function ()
    {
        if (this.oLookahead.class === Literals.space.id)
        {
            this.EatToken(this.oLookahead.class);
        }

    }
    CUnicodeParser.prototype.GetScriptStandardContentLiteral = function (oBase)
    {
        let oFirstElement,
            oSecondElement,
            oSubStyle,
            oSupStyle;

        if (this.oLookahead.data === "_")
        {
            oSubStyle = this.oLookahead.style;
            this.EatToken(this.oLookahead.class);
            this.EatOneSpace();

            if (this.IsSoOperandLiteral())
            {
                oFirstElement = (oBase && oBase.type === Struc.nary)
                    ? this.GetSoOperandLiteral("custom")
                    : this.GetSoOperandLiteral("_");
            }
            else if (this.IsExpLiteral())
            {
                oFirstElement = this.GetExpLiteral();
            }

            // Get second element
            if (this.oLookahead.data === "^")
            {
                oSupStyle = this.oLookahead.style;
                this.EatToken(this.oLookahead.class);
                this.EatOneSpace();

                if (this.IsSoOperandLiteral())
                {
                    oSecondElement = this.GetSoOperandLiteral("^");
                }
                else if (this.IsExpLiteral())
                {
                    oSecondElement = this.GetExpLiteral();
                }

                return {
                    type: Struc.sub_sub,
                    value: oBase,
                    down: oFirstElement,
                    up: oSecondElement,
                    style: {supStyle: oSupStyle, subStyle: oSubStyle},
                };
            }
            return {
                type: Struc.sub_sub,
                value: oBase,
                down: oFirstElement,
                style: {supStyle: oSupStyle, subStyle: oSubStyle},
            };
        }
        else if (this.oLookahead.data === "^")
        {
            oSupStyle = this.oLookahead.style;
            this.EatToken(this.oLookahead.class);
            this.EatOneSpace();

            if (this.IsSoOperandLiteral())
            {
                oSecondElement = (oBase && oBase.type === Struc.nary)
                    ? this.GetSoOperandLiteral("custom")
                    : this.GetSoOperandLiteral("^");
            }
            else if (this.IsExpLiteral())
            {
                oSecondElement = this.GetExpLiteral();
            }

            if (oSecondElement && (oSecondElement.value === "′" || oSecondElement.value === "′′" || oSecondElement === "‵"))
            {
                oSecondElement = oSecondElement.value;
            }

            if (this.oLookahead.data === "_")
            {
                oSubStyle = this.oLookahead.style;
                this.EatToken(this.oLookahead.class);

                if (this.IsSoOperandLiteral())
                {
                    oFirstElement = this.GetSoOperandLiteral("_");
                }
                else if (this.IsExpLiteral())
                {
                    oFirstElement = this.GetExpLiteral();
                }

                return {
                    type: Struc.sub_sub,
                    value: oBase,
                    down: oFirstElement,
                    up: oSecondElement,
                    style: {supStyle: oSupStyle, subStyle: oSubStyle},
                };
            }

            return {
                type: Struc.sub_sub,
                value: oBase,
                up: oSecondElement,
                style: {supStyle: oSupStyle, subStyle: oSubStyle},
            };
        }
    };
    CUnicodeParser.prototype.IsScriptStandardContentLiteral = function ()
    {
        return this.oLookahead.data === "_" || this.oLookahead.data === "^";
    };
    CUnicodeParser.prototype.GetScriptBelowOrAboveContent = function (base)
    {
		let oBelowAbove,
			type,
			strType = this.oLookahead.data,
			oStyle = this.oLookahead.style;

		if (strType === "┬")
			type = LIMIT_LOW;
		else if (strType === "┴")
			type = LIMIT_UP;

		this.EatToken(this.oLookahead.class);
		oBelowAbove = this.GetElementLiteral();

		if (base.type === Struc.horizontal)
		{
			if (strType === "┬")
				type = VJUST_TOP;
			else if (strType === "┴")
				type = VJUST_BOT;

			return {
				type: Struc.group_character,
				hBrack: base,
				value: oBelowAbove,
				isBelow: type,
				style: oStyle,
			}
		}

		return {
			type: Struc.limit,
			base: base,
			value: oBelowAbove,
			isBelow: type,
			style: oStyle,
		};
	};
    CUnicodeParser.prototype.IsScriptBelowOrAboveContent = function ()
    {
        return this.oLookahead.data === "┬" || this.oLookahead.data === "┴";
    };
    CUnicodeParser.prototype.GetFractionLiteral = function (oNumerator)
    {
        let oOperand,
            strOpOver;

        if (undefined === oNumerator)
        {
            oNumerator = this.GetOperandLiteral();
            this.EatOneSpace();
        }

        if (this.oLookahead.class === Literals.divide.id)
        {
            let oFracStyle = this.oLookahead.style;
            strOpOver = this.EatToken(this.oLookahead.class).data;


            if (this.IsOperandLiteral())
                oOperand = this.GetFractionLiteral();

            this.EatOneSpace();

            return {
                type: Struc.frac,
                up: oNumerator || {},
                down: oOperand || {},
                fracType: this.GetFractionType(strOpOver),
                style: oFracStyle,
            };
        }
        else
        {
            return oNumerator;
        }
    };
    CUnicodeParser.prototype.GetFractionType = function (str)
    {
        switch (str)
        {
            case "/"	:	return BAR_FRACTION;
            case "⁄"	:	return SKEWED_FRACTION;
            case "⊘"	:	return LITTLE_FRACTION;
            case "¦"	:	return NO_BAR_FRACTION;
			case "∕"	:	return LINEAR_FRACTION;
        }
    }
    CUnicodeParser.prototype.IsFractionLiteral = function ()
    {
        return this.IsOperandLiteral();
    };
    CUnicodeParser.prototype.GetOtherLiteral = function ()
    {
        return this.GetCharLiteral();
    };
    CUnicodeParser.prototype.isOtherLiteral = function ()
    {
        return this.oLookahead.class === Literals.char.id;
    };
    CUnicodeParser.prototype.GetOperatorLiteral = function ()
    {
	    let oStyle = this.oLookahead.style;
        let oOperator = this.EatToken(Literals.operator.id);
        this.EatOneSpace();
        return {
            type: Literals.operator.id,
            value: oOperator.data,
	        style: oStyle,
        };
    };
    CUnicodeParser.prototype.GetASCIILiteral = function ()
    {
        return this.ReadTokensWhileEnd(Literals.number, Struc.number)
    };
    CUnicodeParser.prototype.GetCharLiteral = function ()
    {
        return this.ReadTokensWhileEnd(Literals.char, Struc.char)
    };
    // CUnicodeParser.prototype.GetAnMathLiteral = function ()
    // {
    //     const oAnMathLiteral = this.EatToken(anMathLiteral);
    //     return {
    //         type: anMathLiteral,
    //         value: oAnMathLiteral.data,
    //     };
    // };
    // CUnicodeParser.prototype.IsAnMathLiteral = function ()
    // {
    //     return this.oLookahead.class === oLiteralNames.anMathLiteral[0];
    // };
    CUnicodeParser.prototype.GetAnOtherLiteral = function ()
    {
        if (this.oLookahead.class === Literals.other.id)
        {
            return this.ReadTokensWhileEnd(Literals.other, Struc.other)
        }
        else if (this.oLookahead.class === Literals.char.id)
        {
            return this.GetCharLiteral();
        }
        else if (this.oLookahead.class === Literals.number.id)
        {
            return this.GetNumberLiteral();
        }
        else if (this.oLookahead.data === "." || this.oLookahead.data === ",")
        {
            return {
                type: Literals.char.id,
                value: this.EatToken(this.oLookahead.class).data,
            }
        }
    };
    CUnicodeParser.prototype.IsAnOtherLiteral = function ()
    {
        return (
            this.oLookahead.class === Literals.other.id ||
            this.oLookahead.class === Literals.char.id ||
            this.oLookahead.class === Literals.number.id ||
            this.oLookahead.data === "." || this.oLookahead.data === ","
        );
    };
    CUnicodeParser.prototype.GetAnLiteral = function ()
    {
        if (this.IsAnOtherLiteral())
        {
            return this.GetAnOtherLiteral();
        }
        //return this.GetAnMathLiteral();
    };
    CUnicodeParser.prototype.IsAnLiteral = function ()
    {
        return this.IsAnOtherLiteral() //|| this.IsAnMathLiteral();
    };
    CUnicodeParser.prototype.GetDiacriticBaseLiteral = function ()
    {
        let oDiacriticBase;

        if (this.IsAnLiteral())
        {
            oDiacriticBase = this.GetAnLiteral();
            return {
                type: Struc.diacritic_base,
                value: oDiacriticBase,
                isAn: true,
            };
        }
        else if (this.oLookahead.class === "nASCII")
        {
            oDiacriticBase = this.GetASCIILiteral();
            return {
                type: Struc.diacritic_base,
                value: oDiacriticBase,
            };
        }
        else if (this.oLookahead.class === "(")
        {
            this.EatToken("(");
            oDiacriticBase = this.GetExpLiteral();
            this.EatToken(")");
            return {
                type: Struc.diacritic_base,
                value: oDiacriticBase,
            };
        }
    };
    CUnicodeParser.prototype.IsDiacriticBaseLiteral = function ()
    {
        return (
            this.IsAnLiteral() ||
            this.oLookahead.class === Literals.number.id ||
            this.oLookahead.class === "("
        );
    };
    CUnicodeParser.prototype.GetDiacriticsLiteral = function ()
    {
        const arrDiacriticList = [];

        while (this.IsDiacriticsLiteral())
        {
            arrDiacriticList.push(this.EatToken(Literals.accent.id));
        }

        return this.GetContentOfLiteral(arrDiacriticList);
    };
    CUnicodeParser.prototype.IsDiacriticsLiteral = function ()
    {
        return this.oLookahead.class === Literals.accent.id;
    };
    CUnicodeParser.prototype.GetAtomLiteral = function ()
    {
        const oAtom = this.GetDiacriticBaseLiteral();
        if (oAtom.isAn)
        {
            return oAtom.value
        }
        return oAtom;
    };
    CUnicodeParser.prototype.IsAtomLiteral = function ()
    {
        return (this.IsAnLiteral() || this.IsDiacriticBaseLiteral()) && this.IsNotStopToken(this.oLookahead.data);
    };
    CUnicodeParser.prototype.GetAtomsLiteral = function ()
    {
        const arrAtomsList = [];
        while (this.IsAtomLiteral())
        {
            let atom = this.GetAtomLiteral();

            if (this.IsPrimeLiteral())
                arrAtomsList.push(this.GetPrimeLiteral(atom))
            else
                arrAtomsList.push(atom);

        }
        return this.GetContentOfLiteral(arrAtomsList)
    };
    CUnicodeParser.prototype.IsAtomsLiteral = function ()
    {
        return this.IsAtomLiteral();
    };
    CUnicodeParser.prototype.GetTextOperandLiteral = function()
    {
        return this.ReadTokensWhileEnd(Literals.operand, Struc.char, false)
    };
    CUnicodeParser.prototype.GetEntityLiteral = function ()
    {
        if (this.IsTextLiteral())
        {
            return this.GetTextLiteral()
        }
        else if (this.IsAtomsLiteral())
        {
            return this.GetAtomsLiteral();
        }
        else if (this.IsExpBracketLiteral())
        {
            return this.GetExpBracketLiteral();
        }
        else if (this.IsNumberLiteral())
        {
            return this.GetNumberLiteral();
        }
        else if (this.IsOpNaryLiteral())
        {
            return this.GetOpNaryLiteral();
        }
        else if (this.oLookahead.class === Literals.operand.id)
        {
            return this.GetTextOperandLiteral()
        }
    };
    CUnicodeParser.prototype.IsEntityLiteral = function ()
    {
        return this.IsAtomsLiteral()
                || this.IsExpBracketLiteral()
                || this.IsNumberLiteral()
                || this.IsOpNaryLiteral()
                || this.IsTextLiteral()
                || this.oLookahead.class === Literals.operand.id;
    };
    CUnicodeParser.prototype.IsEqArrayLiteral = function ()
    {
        return this.oLookahead.data === "█"
       && this.oLookahead.class === Literals.matrix;
    };
    CUnicodeParser.prototype.GetEqArrayLiteral = function ()
    {
		let oPr = this.oLookahead.style;
        this.EatToken(this.oLookahead.class);

        if (this.oLookahead.data === "(")
        {
            this.EatToken(this.oLookahead.class);
            let oContent = [];

            while (this.IsRowLiteral() && this.IsNotStopToken())
            {
                if (this.oLookahead.class === "@")
                {
                    this.EatToken("@");

                    if (this.oLookahead.data === "&")
                        this.EatToken(this.oLookahead.class);
                }
                else
                {
                    this.SetStopToken(["&", "@"])
                    oContent.push(this.GetRowLiteral());
                }

                if (this.oLookahead.data === ")")
                {
                    this.EatToken(this.oLookahead.class);

                    return {
                        type: Struc.array,
                        value: oContent,
	                    style: oPr,
                    }
                }
            }
        }
        else
        {
            return {
                type: Struc.char,
                value: "█"
            }
        }

        return this.WriteSavedTokens();
    };
    CUnicodeParser.prototype.IsPrimeLiteral = function ()
    {
        return this.oLookahead.data === "⁗" ||
            this.oLookahead.data === "‴" ||
            this.oLookahead.data === "″" ||
            this.oLookahead.data === "′";
    };
    CUnicodeParser.prototype.GetPrimeLiteral = function (oBase)
    {
        let oSupStyle = this.oLookahead.style;
        let strPrime = this.EatToken(this.oLookahead.class).data;

        return {
            type: Struc.sub_sub,
            up: {
                type: Struc.char,
                value: strPrime,
            },
            value: oBase,
            style: {supStyle: oSupStyle, subStyle: undefined},
        }
    };
    CUnicodeParser.prototype.GetFactorLiteral = function ()
    {
        if (this.IsDiacriticsLiteral())
        {
            const oDiacritic = this.GetDiacriticsLiteral();
            return {
                type: Struc.accent,
                value: oDiacritic,
            };
        }
        else if (this.IsEntityLiteral() && !this.IsFunctionLiteral())
        {
            let oEntity = this.GetEntityLiteral();

            if (this.IsPrimeLiteral())
                return this.GetPrimeLiteral(oEntity);

            if (this.IsDiacriticsLiteral())
            {
                const oDiacritic = this.GetDiacriticsLiteral();
				if (Array.isArray(oEntity))
				{
					let str = oEntity[oEntity.length - 1].value;
					let data = str[str.length - 1];
					str = str.slice(0, str.length - 1);

					oEntity[oEntity.length - 1].value = str;

					oEntity.push({
						type: Struc.accent,
						base: {
							type: Struc.char,
							value: data,
						},
						value: oDiacritic,
					})
				}
				else if (oEntity.type === Struc.char)
				{
					let str = oEntity.value;
					let data = str[str.length - 1];
					str = str.slice(0, str.length - 1);

					oEntity.value = str;

					oEntity = [
						oEntity,
						{
							type: Struc.accent,
							base: {
								type: Struc.char,
								value: data,
							},
							value: oDiacritic,
						}
					];
				}
				else
				{
					return {
						type: Struc.accent,
						base: oEntity,
						value: oDiacritic,
					}
				}
            }

            return oEntity;
        }
        else if (this.IsFunctionLiteral())
        {
            return this.GetFunctionLiteral();
        }
        else if (this.IsExpSubSupLiteral())
        {
            return this.GetExpSubSupLiteral();
        }
        if (this.IsArrayLiteral())
        {
            return this.GetArrayLiteral();
        }
        else if (this.IsEqArrayLiteral())
        {
            return this.GetEqArrayLiteral();
        }
    };
    CUnicodeParser.prototype.IsFactorLiteral = function ()
    {
        return (this.IsEntityLiteral() || this.IsFunctionLiteral() || this.IsDiacriticsLiteral() || this.IsArrayLiteral() || this.IsEqArrayLiteral()) && this.IsNotStopToken()
    };
    CUnicodeParser.prototype.IsSpecial = function (isNoSubSup)
    {
        return this.oLookahead.data === isNoSubSup || (
            !isNoSubSup && this.IsScriptStandardContentLiteral() ||
            !isNoSubSup && this.IsScriptBelowOrAboveContent()// ||
            //!isNoSubSup && this.IsSpecialContent()
        )
    }
    CUnicodeParser.prototype.GetOperandLiteral = function (isNoSubSup)
    {
        const arrFactorList = [];

        if (undefined === isNoSubSup)
            isNoSubSup = false;

        let isBreak = false;

        while (this.IsFactorLiteral() && !this.IsExpSubSupLiteral() && !isBreak)
        {
            if (this.IsFactorLiteral() && !this.IsExpSubSupLiteral())
            {
                arrFactorList.push(this.GetFactorLiteral());

                if (arrFactorList[arrFactorList.length - 1])
                    isBreak = arrFactorList[arrFactorList.length - 1].type === 'BracketBlock';

                this.EatOneSpace()
            }

            if (this.IsSpecial(isNoSubSup) || this.IsHBracketLiteral() && arrFactorList[arrFactorList.length - 1] )
            {
                let oContent = arrFactorList[arrFactorList.length - 1];

                while (this.IsSpecial(isNoSubSup) || this.IsHBracketLiteral())
                {
                    //if next token "_" or "^" proceed as index/degree
                    if (this.oLookahead.data === isNoSubSup || !isNoSubSup && this.IsScriptStandardContentLiteral())
                    {
                        oContent = this.GetExpSubSupLiteral(oContent);
                    }
                    //if next token "┬" or "┴" proceed as below/above
                    else if (this.oLookahead.data === isNoSubSup || !isNoSubSup && this.IsScriptBelowOrAboveContent())
                    {
                        oContent = this.GetScriptBelowOrAboveContent(oContent);
                    }
                    else if (this.IsHBracketLiteral())
                    {
                        oContent = this.GetHBracketLiteral(oContent);
                    }
                    //if next token like ⁶⁷⁸⁹ or ₂₃₄ proceed as special degree/index
                    // else if (this.oLookahead.data === isNoSubSup || !isNoSubSup) //  && this.IsSpecialContent()
                    // {
                    //     oContent = this.GetScriptSpecialContent(oContent);
                    // }
                }
                arrFactorList[arrFactorList.length - 1] = oContent;
            }

            // if (this.IsApplicationFunction() && arrFactorList[arrFactorList.length - 1])
            // {
            //     let oContent = this.GetFunctionApplication(arrFactorList[arrFactorList.length - 1]);
            //     arrFactorList[arrFactorList.length - 1] = oContent;
            // }
        }

        return this.GetContentOfLiteral(arrFactorList);
    };
    CUnicodeParser.prototype.IsApplicationFunction = function()
    {
        return this.oLookahead.class === Literals.invisible.id;
    }
    CUnicodeParser.prototype.GetFunctionApplication = function(oBase)
    {
		let oPr = this.oLookahead.style;
		this.EatToken(this.oLookahead.class);

		oBase = {
			type: Struc.char,
			value: oBase.data,
			style: oBase.style,
		}

		if (this.IsExpSubSupLiteral())
			return this.GetExpSubSupLiteral(oBase);

        let oValue = this.GetOperandLiteral();

        return {
            type: Struc.func,
            value: oBase,
            third: oValue,
            style: oPr,
        }
    }
    CUnicodeParser.prototype.IsOperandLiteral = function ()
    {
        return this.IsFactorLiteral() && this.IsNotStopToken(this.oLookahead.data);
    };
    CUnicodeParser.prototype.IsRowLiteral = function ()
    {
        return this.IsExpLiteral() || this.oLookahead.data === "&";
    };
    CUnicodeParser.prototype.GetRowLiteral = function (oStyle)
    {
        let arrRow = [];
        let intLength = 0;
        let intCount = 0;
        let isAlredyGetContent = false;

        while (this.IsExpLiteral() || this.oLookahead.data === "&")
        {
            let intCopyOfLength = intLength;

            if (this.oLookahead.data !== "&" && this.IsNotStopToken())
            {
                this.RemoveLastStopTokenForce();
                this.SetStopToken(["&", "@"])
                arrRow.push(this.GetExpLiteral());
                intLength++;
                isAlredyGetContent = true;
            }
            else
            {
                this.RemoveLastStopToken();
				oStyle[intCount] = this.oLookahead.style;
                this.EatToken("&");

                if (isAlredyGetContent === false)
                {
                    arrRow.push();
                    intCount++;
                    intLength++;
                }
                else if (intCopyOfLength === intLength)
                {
                    intCount++;
                }
            }
        }

        if (intLength !== intCount + 1)
        {

            for (let j = intLength; j <= intCount; j++)
            {
                arrRow.push({});
            }
        }

        return arrRow;
    };
    CUnicodeParser.prototype.GetRowsLiteral = function (cols, rows)
    {
        let arrRows = [];
		let nRow = 0;
		let isHasContent = false;
		let innerStyles = {};

        while (this.IsRowLiteral() || this.oLookahead.data === "@")
        {
            if (this.oLookahead.data === "@")
            {
				cols[nRow] = this.oLookahead.style;
                this.EatToken("@");

				if (arrRows.length === 0 && this.oLookahead.data !== "&")
					arrRows.push([]);

				nRow++;

				isHasContent = true;
            }
            else
            {
                this.RemoveLastStopTokenForce();
                this.SetStopToken(["&", "@"])
	            rows[nRow] = {}
                arrRows.push(this.GetRowLiteral(rows[nRow]));
            }
        }

		if (innerStyles[0])
		{
			oStyles[nRow] = {head: undefined, body: innerStyles};
		}

		if (arrRows.length === 0)
		{
			for (let i = 0; i <= nRow; i++)
			{
				arrRows.push([]);
			}
		}

        return arrRows
    };
    CUnicodeParser.prototype.GetArrayLiteral = function ()
    {
		let styles = {};
		styles.head = this.oLookahead.style;
		styles.cols = {};
		styles.rows = {};

        let type = this.EatToken(this.oLookahead.class).data;

        if (this.oLookahead.data !== "(")
        {
            return {
                type: Literals.char.id,
                value: type
            }
        }
        else
        {
            this.EatToken(this.oLookahead.class);
        }

        const arrMatrixContent = this.GetRowsLiteral(styles.cols, styles.rows);

        let intMaxLengthOfMatrixRow = -Infinity;
        let intIndexOfMaxMatrixRow = -1;

        for (let i = 0; i < arrMatrixContent.length; i++)
        {
            let arrContent = arrMatrixContent[i];
            intMaxLengthOfMatrixRow = arrContent.length;
            intIndexOfMaxMatrixRow = i;
        }

        for (let i = 0; i < arrMatrixContent.length; i++)
        {

            if (i !== intIndexOfMaxMatrixRow)
            {

                let oRow = arrMatrixContent[i];

                for (let j = oRow.length; j < intMaxLengthOfMatrixRow; j++)
                {
                    oRow.push({});
                }
            }
        }

        if (this.oLookahead.data === ")")
        {
            this.EatToken(Literals.rBrackets.id);
            return {
                type: Struc.matrix,
                value: arrMatrixContent,
	            style: styles,
            };
        }
    };
    CUnicodeParser.prototype.IsArrayLiteral = function ()
    {
        return this.oLookahead.class === Literals.matrix.id
    };
    CUnicodeParser.prototype.IsElementLiteral = function ()
    {
        return (
            this.IsFractionLiteral() ||
            this.IsOperandLiteral()
            && this.IsNotStopToken(this.oLookahead.data)
        );
    };
    CUnicodeParser.prototype.GetElementLiteral = function ()
    {
        let oOperandLiteral = this.GetOperandLiteral();

        if (this.oLookahead.class === Literals.divide.id)
            oOperandLiteral = this.GetFractionLiteral(oOperandLiteral);

        return oOperandLiteral;
    };
    CUnicodeParser.prototype.IsExpLiteral = function ()
    {
        return this.IsElementLiteral()
            || this.IsFractionWithoutNumeratorLiteral()
            || this.IsSpaceLiteral()
            || this.IsSubOrSupWithoutContentLiteral()
            || this.oLookahead.class === Literals.operator.id
    };
    CUnicodeParser.prototype.GetFractionWithoutNumeratorLiteral = function()
    {
        let oPr = this.oLookahead.style;
        let strDivideSymbol = this.EatToken().data;
        let oDenominator = {};
        if (this.IsOperandLiteral())
            oDenominator = this.GetOperandLiteral();

        return {
            type: Struc.frac,
            up: {},
            down: oDenominator,
            fracType: this.GetFractionType(strDivideSymbol),
            style: oPr,
        };
    };
    CUnicodeParser.prototype.IsFractionWithoutNumeratorLiteral = function()
    {
        return this.oLookahead.class === Literals.divide.id;
    }
    CUnicodeParser.prototype.IsSubOrSupWithoutContentLiteral = function ()
    {
        return this.oLookahead.data === "_" || this.oLookahead.data === "^" || this.oLookahead.data === "┬" || this.oLookahead.data === "┴";
    }

    CUnicodeParser.prototype.GetSubOrSupWithoutContentLiteral = function()
    {
        let oSupStyle,
            oSubStyle;

        if (this.oLookahead.data === "_")
        {
            let oSubStyle = this.oLookahead.style;
            this.EatToken(this.oLookahead.class);
            return {
                type: Struc.sub_sub,
                value: undefined,
                down: this.oLookahead.data ? this.GetSoOperandLiteral("_") : {},
                up: undefined,
                third: undefined,
                style: {supStyle: oSupStyle, subStyle: oSubStyle},
            }
        }
        else if (this.oLookahead.data === "^")
        {
            let oSupStyle = this.oLookahead.style;
            this.EatToken(this.oLookahead.class);
            return {
                type: Struc.sub_sub,
                value: undefined,
                down: undefined,
				up: this.oLookahead.data ? this.GetSoOperandLiteral("^") : {},
                third: undefined,
                style: {supStyle: oSupStyle, subStyle: oSubStyle},
            }
        }
		else if (this.oLookahead.data === "┬")
		{
			let oPr = this.oLookahead.style;
			this.EatToken(this.oLookahead.class);
			return {
				type: Struc.limit,
				base: {},
				value: {},
				isBelow: LIMIT_LOW,
				style: oPr,
			};
		}
		else if (this.oLookahead.data === "┴")
		{
			let oPr = this.oLookahead.style;
			this.EatToken(this.oLookahead.class);
			return {
				type: Struc.limit,
				base: {},
				value: {},
				isBelow: LIMIT_UP,
				style: oPr,
			};
		}
    }
    CUnicodeParser.prototype.GetExpLiteral = function ()
    {
        const oExpLiteral = [];

        while (this.IsExpLiteral())
        {
            if (this.IsFractionWithoutNumeratorLiteral())
            {
                oExpLiteral.push(this.GetFractionWithoutNumeratorLiteral());
            }
            else if (this.IsSubOrSupWithoutContentLiteral())
            {
                oExpLiteral.push(this.GetSubOrSupWithoutContentLiteral())
            }
            else if (this.IsSpaceLiteral())
            {
                oExpLiteral.push(this.GetSpaceLiteral());
            }
            else if (this.IsElementLiteral())
            {
				let oEl = this.GetElementLiteral()

				if (this.IsApplicationFunction())
					oEl = this.GetFunctionApplication(oEl)
                else if (this.isOtherLiteral())
                    oEl = this.GetOtherLiteral();

				oExpLiteral.push(oEl);
            }
            else if (this.oLookahead.class === Literals.operator.id)
            {
                oExpLiteral.push(this.GetOperatorLiteral())
            }
        }

        return this.GetContentOfLiteral(oExpLiteral)
    };
    /**
     * Метод позволяет обрабатывать токены одного типа, пока они не прервутся другим типом токенов
     */
    CUnicodeParser.prototype.ReadTokensWhileEnd = function (arrTypeOfLiteral, type, isSpecial)
    {
        let arrLiterals = [];
        let strLiteral = "";
        let styles = [];

        while (this.oLookahead.class === arrTypeOfLiteral.id && this.IsNotStopToken(this.oLookahead.data))
        {
            styles.push(this.oLookahead.style);

            if (isSpecial)
                strLiteral += UnicodeSpecialScript[this.EatToken(arrTypeOfLiteral.id).data];
            else
                strLiteral += this.EatToken(arrTypeOfLiteral.id).data;
        }

        arrLiterals.push({type: type, value: strLiteral, style: styles});

        if (arrLiterals.length === 1)
            return arrLiterals[0];

        return arrLiterals
    };
    CUnicodeParser.prototype.EatToken = function (tokenType)
    {
        const token = this.oLookahead;

        if (token === null)
        {
            console.log('Unexpected end of input, expected: "' + tokenType + '"');
        }

        if (token.class !== tokenType)
        {
            console.log('Unexpected token: "' + token.class + '", expected: "' + tokenType + '"');
        }

        if (this.isSaveTokens)
            this.arrSavedTokens.push(this.oLookahead);

        this.oLookahead = this.oTokenizer.GetNextToken();

        return token;
    };
    CUnicodeParser.prototype.GetContentOfLiteral = function (oContent)
    {
        if (Array.isArray(oContent))
        {
            if (oContent.length === 1)
                return oContent[0];

            return oContent;
        }
        return oContent;
    };
    CUnicodeParser.prototype.SkipSpace = function ()
    {
        while (this.oLookahead.class === Literals.space.id)
        {
            this.EatToken(Literals.space.id);
        }
    };
    CUnicodeParser.prototype.SaveTokensWhileReturn = function ()
    {
        this.isSaveTokens = true;
        this.arrSavedTokens = [];
    };
    CUnicodeParser.prototype.WriteSavedTokens = function ()
    {
        let intSavedTokensLength = this.arrSavedTokens.length;
        let strOutput = "";
        for (let i = 0; i < intSavedTokensLength; i++)
        {
            let str = this.oTokenizer.GetTextOfToken(this.arrSavedTokens[i].index, false);

            if (str)
                strOutput += str;
            else
                strOutput += this.arrSavedTokens[i].data;
        }

        this.isSaveTokens = false;

        return {
            type: Literals.char.id,
            value: strOutput,
        };
    };

    function CUnicodeConverter(str, oContext, isGetOnlyTokens)
    {
        if (undefined === str || null === str)
            return

        const oParser = new CUnicodeParser();
        const oTokens = oParser.Parse(str);

        if (!isGetOnlyTokens)
            ConvertTokens(oTokens, oContext);
        else
            return oTokens;
    }

    //--------------------------------------------------------export----------------------------------------------------
    window["AscMath"] = window["AscMath"] || {};
    window["AscMath"].CUnicodeConverter = CUnicodeConverter;

})(window);
