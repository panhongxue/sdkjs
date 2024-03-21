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

(
	/**
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function (window, undefined) {
		/* Imports */
		const CBaseId = AscFormat.CBaseFormatObject;
		const CBaseNoId = AscFormat.CBaseNoIdObject;
		const IC = AscFormat.InitClass;


		/* Functions */
		function parseShapeType(sValue) {
			if (!(typeof sValue === "string" && sValue.length > 0)) {
				return null;
			}
			let sWorkingValue;
			if (sValue.indexOf("#") === 0) {
				sWorkingValue = sValue.substring(1);
			}
			else {
				sWorkingValue = sValue;
			}
			let aVals = sWorkingValue.split("_");
			for (let nVal = 0; nVal < aVals.length; ++nVal) {
				let sVal = aVals[nVal];
				if (sVal.charAt(0) === 't') {
					let nParsedVal = parseInt(sVal.substring(1));
					if (!isNaN(nParsedVal) && nParsedVal > ShapeType.sptMin && nParsedVal < ShapeType.sptMax) {
						return nParsedVal;
					}
				}
			}
			return null;
		}


		/* Classes */
		function CVmlCommonElements() {
			CBaseNoId.call(this);

			this.items = [];

			// 1 AG_AllCoreAttributes
			// 1.1 AG_CoreAttributes
			this.m_sId = null;
			this.m_oStyle = null;
			this.m_sHref = null;
			this.m_sTarget = null;
			this.m_sClass = null;
			this.m_sTitle = null;
			this.m_sAlt = null;
			this.m_oCoordSize = null;
			this.m_oCoordOrigin = null;
			this.m_oWrapCoords = null;
			this.m_oPrlet = null;
			// 1.2 AG_OfficeCoreAttributes
			this.m_sSpId = null;
			this.m_oOned = null;
			this.m_oRegroupId = null;
			this.m_oDoubleClickNotify = null;
			this.m_oButton = null;
			this.m_oUserHidden = null;
			this.m_oBullet = null;
			this.m_oHr = null;
			this.m_oHrStd = null;
			this.m_oHrNoShade = null;
			this.m_oHrPct = null;
			this.m_oHrAlign = null;
			this.m_oAllowInCell = null;
			this.m_oAllowOverlap = null;
			this.m_oUserDrawn = null;
			this.m_oBorderTopColor = null;
			this.m_oBorderLeftColor = null;
			this.m_oBorderBottomColor = null;
			this.m_oBorderRightColor = null;
			this.m_oDgmLayout = null;
			this.m_oDgmNodeKind = null;
			this.m_oDgmLayoutMru = null;
			this.m_oInsetMode = null;
			// 2 AG_AllShapeAttributes
			// 2.1 AG_ShapeAttributes
			this.m_oChromaKey = null;
			this.m_oFilled = null;
			this.m_oFillColor = null;
			this.m_oOpacity = null;
			this.m_oStroked = null;
			this.m_oStrokeColor = null;
			this.m_oStrokeWeight = null;
			this.m_oInsetPen = null;
			// 2.2 AG_OfficeShapeAttributes
			this.m_oSpt = null;
			this.m_oConnectorType = null;
			this.m_oBwMode = null;
			this.m_oBwPure = null;
			this.m_oBwNormal = null;
			this.m_oForceDash = null;
			this.m_oOleIcon = null;
			this.m_oOle = null;
			this.m_oPreferRelative = null;
			this.m_oClipToWrap = null;
			this.m_oClip = null;

			this.m_bComment = null;
		}

		IC(CVmlCommonElements, CBaseNoId, 0);

		CVmlCommonElements.prototype.getShapeType = function () {
			return null;
		};
		CVmlCommonElements.prototype.findItemByConstructor = function (fConstructor) {
			for (let nItem = 0; nItem < this.items.length; ++nItem) {
				let oItem = this.items[nItem];
				if (oItem instanceof fConstructor) {
					return oItem;
				}
			}
			return null;
		};
		CVmlCommonElements.prototype.getShadow = function () {
			return this.findItemByConstructor(CShadow);
		};
		CVmlCommonElements.prototype.getWrap = function () {
			return this.findItemByConstructor(CWrap);
		};
		CVmlCommonElements.prototype.getImageData = function () {
			return this.findItemByConstructor(CImageData);
		};
		CVmlCommonElements.prototype.getFill = function () {
			return this.findItemByConstructor(CFillVml);
		};
		CVmlCommonElements.prototype.isSignatureLine = function () {
			if (this instanceof CShape) {
				let oSL = this.getSignatureLine();
				if (oSL && oSL.m_oIsSignatureLine === true) {
					return true;
				}
			}
			return false;
		};
		CVmlCommonElements.prototype.getSignatureLine = function () {
			return this.findItemByConstructor(CSignatureLine);
		};
		CVmlCommonElements.prototype.getStroke = function () {
			return this.findItemByConstructor(CStroke);
		};
		CVmlCommonElements.prototype.getTextbox = function () {
			return this.findItemByConstructor(CTextbox);
		};
		CVmlCommonElements.prototype.getTextPath = function () {
			return this.findItemByConstructor(CTextPath);
		};
		CVmlCommonElements.prototype.getClientData = function () {
			return this.findItemByConstructor(CClientData);
		};
		CVmlCommonElements.prototype.getLeftBorder = function () {
			for (let nItem = 0; nItem < this.items.length; ++nItem) {
				let oItem = this.items[nItem];
				if (oItem instanceof CBorder && oItem.m_sType === "borderleft") {
					return oItem;
				}
			}
			return null;
		};
		CVmlCommonElements.prototype.correctFillOpacity = function (oFill) {
			if (this.m_oOpacity !== null) {
				oFill.addAlpha(this.m_oOpacity);
			}
			else {
				let oVMLFill = this.getFill();
				if (oVMLFill && oVMLFill.m_oOpacity !== null) {
					oFill.addAlpha(oVMLFill.m_oOpacity);
				}
			}
		};
		CVmlCommonElements.prototype.getOOXMLFill = function (oContext) {
			if (this.m_oFilled === false) {
				return AscFormat.CreateNoFillUniFill();
			}

			let oFill = null;
			//imagedata
			let oImageData = this.getImageData();
			if (oImageData) {
				oFill = oImageData.getOOXMLFill(oContext);
				if (oFill) {
					this.correctFillOpacity(oFill);
					return oFill;
				}
			}
			if (this.m_oFillColor) {
				oFill = this.m_oFillColor.getOOXMLFill(oContext);
				let oFillVML = this.getFill();
				if (oFillVML) {
					if (oFillVML.isGradient()) {
						oFill = oFillVML.getOOXMLFill(oContext, this.m_oFillColor)
					}
				}
				this.correctFillOpacity(oFill);
				return oFill;
			}
			let oFillVML = this.getFill();
			if (oFillVML) {
				return oFillVML.getOOXMLFill(oContext);
			}
			return AscFormat.CreateSolidFillRGB(0xFF, 0xFF, 0xFF);
		};
		CVmlCommonElements.prototype.getOOXMLStroke = function () {
			let oStroke = null;
			let oVMLStroke = this.getStroke();
			if (oVMLStroke) {
				oStroke = oVMLStroke.getOOXMLStroke();
				if (this.m_oStrokeWeight !== null) {
					oStroke.w = Pt_To_Emu(this.m_oStrokeWeight);
				}
				if (oVMLStroke.m_oColor === null) {
					if (this.m_oStrokeColor !== null) {
						oStroke.Fill = this.m_oStrokeColor.getOOXMLFill();
					}
					else {
						oStroke.Fill = AscFormat.CreateSolidFillRGB(0, 0, 0);
					}
				}
			}
			else {
				if (this.m_oStroked === false) {
					oStroke = AscFormat.CreateNoFillLine();
					if (this.m_oStrokeWeight !== null) {
						oStroke.w = Pt_To_Emu(this.m_oStrokeWeight);
					}
				}
				else {
					if (this.m_oStrokeWeight !== null || this.m_oStrokeColor !== null) {
						oStroke = new AscFormat.CLn();
						if (this.m_oStrokeColor !== null) {
							oStroke.Fill = this.m_oStrokeColor.getOOXMLFill();
						}
						else {
							oStroke.Fill = AscFormat.CreateSolidFillRGB(0, 0, 0);
						}
						if (this.m_oStrokeWeight !== null) {
							oStroke.w = Pt_To_Emu(this.m_oStrokeWeight);
						}
					}
				}
			}
			if (!oStroke || !oStroke.isVisible()) {
				//take line from left border
				let oLeftBorder = this.getLeftBorder();
				if (oLeftBorder) {
					if (oLeftBorder.m_oType !== EBorderType.bordertypeNone) {
						oStroke = new AscFormat.CLn();
						if (oLeftBorder.m_oWidth !== null) {
							oStroke.w = Pt_To_Emu(oLeftBorder.m_oWidth);
						}
						switch (oLeftBorder.m_oType) {
							case EBorderType.bordertypeDash: oStroke.prstDash = 3; break;
							case EBorderType.bordertypeDashDotDot: oStroke.prstDash = 5; break;
							case EBorderType.bordertypeDashDotStroked: oStroke.prstDash = 1; break;
							case EBorderType.bordertypeDashedSmall: oStroke.prstDash = 0; break;
							case EBorderType.bordertypeDot: oStroke.prstDash = 2; break;
							case EBorderType.bordertypeDotDash: oStroke.prstDash = 1; break;
						}
						let oLeftBorderColor = this.m_oBorderLeftColor;
						if (oLeftBorderColor) {
							oStroke.Fill = oLeftBorderColor.getOOXMLFill();
						}
					}
				}
			}
			if (!oStroke) {
				oStroke = new AscFormat.CLn();
				oStroke.setFill(AscFormat.CreateSolidFillRGB(0, 0, 0));
			}
			// if(!oStroke.isVisible()) {
			// 	return null;
			// }
			return oStroke;
		};
		CVmlCommonElements.prototype.createSpPrIfNoPresent = function (oSpPr) {
			let oWorkSpPr = oSpPr;
			if (!oWorkSpPr) {
				oWorkSpPr = new AscFormat.CSpPr();
			}
			return oWorkSpPr;
		};
		CVmlCommonElements.prototype.convertFillToOOXML = function (oSpPr, oContext) {
			let oWorkSpPr = this.createSpPrIfNoPresent(oSpPr);
			oWorkSpPr.setFill(this.getOOXMLFill(oContext));
			return oWorkSpPr;
		};
		CVmlCommonElements.prototype.convertStrokeToOOXML = function (oSpPr) {
			let oWorkSpPr = this.createSpPrIfNoPresent(oSpPr);
			oWorkSpPr.setLn(this.getOOXMLStroke());
			return oWorkSpPr;
		};
		CVmlCommonElements.prototype.convertFillStrokeToOOXML = function (oSpPr, oContext) {
			return this.convertFillToOOXML(this.convertStrokeToOOXML(oSpPr), oContext);
		};
		CVmlCommonElements.prototype.convertFlipRot = function (oXfrm) {

			if (this.m_oStyle) {
				let sFlip = this.m_oStyle.GetPropertyValueString("flip");
				if (sFlip !== null) {
					if (sFlip === "x") {
						oXfrm.setFlipH(true);
					}
					else if (sFlip === "y") {
						oXfrm.setFlipV(true);
					}
					else if ((sFlip === "xy") || (sFlip === "yx") || (sFlip === "x y") || (sFlip === "y x")
						|| (sFlip === "y,x") || (sFlip === "x,y")) {
						oXfrm.setFlipH(true);
						oXfrm.setFlipV(true);
					}
				}
				let sRot = this.m_oStyle.GetPropertyValueString("rotation");
				if (sRot) {
					oXfrm.setRot(getRotateAngle(sRot, oXfrm.flipH, oXfrm.flipV));
				}
			}
		};
		CVmlCommonElements.prototype.getMainProperties = function (oContext) {
			let oProps = { IsTop: oContext.bIsTopDrawing };
			let oOldItem = oContext.sourceItem;
			oContext.sourceItem = this;
			CLegacyDrawing.prototype.GetDrawingMainProps(null, oContext, oProps);
			oContext.sourceItem = oOldItem;
			return oProps;
		};
		CVmlCommonElements.prototype.convertToOOXML = function (aOtherElements, oOOXMLGroup, oContext) {
			let oShapeType = CLegacyDrawing.prototype.static_GetShapeTypeForShape(this, aOtherElements);
			let oSpPr = new AscFormat.CSpPr();
			this.convertFillToOOXML(oSpPr, oContext);
			this.convertStrokeToOOXML(oSpPr);


			let bIsTop = oContext.bIsTopDrawing;

			let sStyleAdvanced = null;
			let oGeometryData = new CVmlGeometryData();
			let nType = this.getFinalShapeType(aOtherElements);
			oGeometryData.fillByType(nType);
			let sAdj = this.m_sAdj || oShapeType && oShapeType.m_sAdj;
			if (sAdj) {
				let aAdj = sAdj.split(",");
				for (let nAdj = 0; nAdj < aAdj.length; ++nAdj) {
					let nAdjVal = parseInt(aAdj[nAdj]);
					if (AscFormat.isRealNumber(nAdjVal)) {
						oGeometryData.adjustments[nAdj] = nAdjVal;
					}
				}
			}
			if (this instanceof CRoundRect) {
				if (this.m_oArcSize && AscFormat.isRealNumber(this.m_oArcSize.m_dValue)) {
					oGeometryData.adjustments[0] = (this.m_oArcSize.m_dValue * 65536 / 10.0 + 0.5) >> 0;
				}
			}
			let sPath = this.m_oPath || oShapeType && oShapeType.m_oPath;
			let bNeeLoadCoordSize = true;
			if (this instanceof CLine) {
				if (this.m_oFrom && this.m_oTo) {
					let x1, y1, x2, y2;
					x1 = this.m_oFrom.m_dX;
					y1 = this.m_oFrom.m_dY;
					x2 = this.m_oTo.m_dX;
					y2 = this.m_oTo.m_dY;
					if (x1 > x2) {
						let tmp = x1;
						x1 = x2;
						x2 = tmp;
					}
					if (y1 > y2) {
						let tmp = y1;
						y1 = y2;
						y2 = tmp;
					}
					sStyleAdvanced = ";left:" + x1
						+ ";top:" + y1
						+ ";width:" + (x2 - x1)
						+ ";height:" + (y2 - y1)
						+ ";";
				}
			}
			if (this instanceof CPolyLine) {
				bNeeLoadCoordSize = false;
				if (this.m_oPoints) {
					let oPath = this.m_oPoints.ToSVGPath();
					if (oPath) {
						sPath = oPath.path;
						let oBounds = oPath.bounds;
						sStyleAdvanced += ";margin-left:" + oBounds.l + ";margin-top:" + oBounds.t
							+ ";width:" + (oBounds.r - oBounds.l) + ";height:" + (oBounds.b - oBounds.t) + ";polyline_correct:true;";
					}
				}
			}
			if (sPath) {
				oGeometryData.loadPath(sPath);
			}
			if (bNeeLoadCoordSize) {
				oGeometryData.loadCoordSize(this.m_oCoordSize);
			}
			oSpPr.setGeometry(oGeometryData.convertToOOXML());

			let oOldCSS = this.m_oStyle;
			if (sStyleAdvanced) {
				let sNewCSS = sStyleAdvanced + (this.m_oStyle && this.m_oStyle.m_sCss || "");
				this.m_oStyle = new CCssStyle(sNewCSS);
			}
			let oProps = this.getMainProperties(oContext);
			let oXfrm = new AscFormat.CXfrm();
			if (bIsTop) {
				oXfrm.setOffX(0);
				oXfrm.setOffY(0);
			}
			else {
				oXfrm.setOffX(oProps.X);
				oXfrm.setOffY(oProps.Y);
			}

			oXfrm.setExtX(oProps.Width);
			oXfrm.setExtY(oProps.Height);
			this.convertFlipRot(oXfrm);
			oSpPr.setXfrm(oXfrm);

			//this.m_oStyle = oOldCSS;


			let oOOXMLDrawing;
			let oSignatureLine = this.getSignatureLine();
			let bIsPicture = false;
			if (nType === ShapeType.sptCFrame && !oSignatureLine) {
				oOOXMLDrawing = new AscFormat.CImageShape();
				bIsPicture = true;
				if (oSpPr.Fill && oSpPr.Fill.isBlipFill()) {
					oOOXMLDrawing.setBlipFill(oSpPr.Fill.fill);
					oSpPr.setFill(null);
					oSpPr.setLn(null);
				}
				else {
					return null;
				}
			}
			else {
				oOOXMLDrawing = new AscFormat.CShape();
				oOOXMLDrawing.setWordShape(true);
				if (oSignatureLine && oSignatureLine.m_oIsSignatureLine) {
					let oOOXMLSignatureLine = new AscFormat.CSignatureLine();
					oOOXMLSignatureLine.id = oSignatureLine.m_oId;
					oOOXMLSignatureLine.signer = oSignatureLine.m_sSuggestedSigner;
					oOOXMLSignatureLine.signer2 = oSignatureLine.m_sSuggestedSigner2;
					oOOXMLSignatureLine.email = oSignatureLine.m_sSuggestedSignerEmail;
					oOOXMLSignatureLine.showDate = oSignatureLine.m_oShowSignDate;
					oOOXMLSignatureLine.instructions = oSignatureLine.m_sSigningInstructions;
					oOOXMLDrawing.setSignature(oOOXMLSignatureLine);
				}
			}
			let oNvPr = new AscFormat.UniNvPr();
			oOOXMLDrawing.setNvSpPr(oNvPr);
			oOOXMLDrawing.setSpPr(oSpPr);
			if (!bIsPicture) {
				let bIsWordArt = this.isWordArt(oContext.aOtherElements);
				let oDocContent = null;
				let oCSSStyle = null;
				let sFontName = "Arial";
				let bBold = false;
				let bItalic = false;
				let nFontSize = 11;
				let sText = "";
				let oTextFill, oTextStroke;
				let oBodyPr = new AscFormat.CBodyPr();
				if (bIsWordArt) {
					let eTextShapeType;
					let oTextPath = this.getTextPath();
					switch (nType) {
						case ShapeType.sptCTextPlain: eTextShapeType = "textPlain"; break;
						case ShapeType.sptCTextArchUp: eTextShapeType = "textArchUp"; break;
						case ShapeType.sptCTextArchDown: eTextShapeType = "textArchDown"; break;
						case ShapeType.sptCTextButton: eTextShapeType = "textButton"; break;
						case ShapeType.sptCTextCurveUp: eTextShapeType = "textCurveUp"; break;
						case ShapeType.sptCTextCurveDown: eTextShapeType = "textCurveDown"; break;
						case ShapeType.sptCTextCanUp: eTextShapeType = "textCanUp"; break;
						case ShapeType.sptCTextCanDown: eTextShapeType = "textCanDown"; break;
						case ShapeType.sptCTextWave1: eTextShapeType = "textWave1"; break;
						case ShapeType.sptCTextWave2: eTextShapeType = "textWave2"; break;
						case ShapeType.sptCTextWave3: eTextShapeType = "textDoubleWave1"; break;
						case ShapeType.sptCTextWave4: eTextShapeType = "textWave4"; break;
						case ShapeType.sptCTextInflate: eTextShapeType = "textInflate"; break;
						case ShapeType.sptCTextDeflate: eTextShapeType = "textDeflate"; break;
						case ShapeType.sptCTextInflateBottom: eTextShapeType = "textInflateBottom"; break;
						case ShapeType.sptCTextDeflateBottom: eTextShapeType = "textDeflateBottom"; break;
						case ShapeType.sptCTextInflateTop: eTextShapeType = "textInflateTop"; break;
						case ShapeType.sptCTextDeflateTop: eTextShapeType = "textDeflateTop"; break;
						case ShapeType.sptCTextDeflateInflate: eTextShapeType = "textDeflateInflate"; break;
						case ShapeType.sptCTextDeflateInflateDeflate: eTextShapeType = "textDeflateInflateDeflate"; break;
						case ShapeType.sptCTextFadeRight: eTextShapeType = "textFadeRight"; break;
						case ShapeType.sptCTextFadeLeft: eTextShapeType = "textFadeLeft"; break;
						case ShapeType.sptCTextFadeUp: eTextShapeType = "textFadeUp"; break;
						case ShapeType.sptCTextFadeDown: eTextShapeType = "textFadeDown"; break;
						case ShapeType.sptCTextSlantUp: eTextShapeType = "textSlantUp"; break;
						case ShapeType.sptCTextSlantDown: eTextShapeType = "textSlantDown"; break;
						case ShapeType.sptCTextCascadeUp: eTextShapeType = "textCascadeUp"; break;
						case ShapeType.sptCTextCascadeDown: eTextShapeType = "textCascadeDown"; break;
						case ShapeType.sptCTextButtonPour: eTextShapeType = "textButtonPour"; break;
						case ShapeType.sptCTextStop: eTextShapeType = "textStop"; break;
						case ShapeType.sptCTextTriangle: eTextShapeType = "textTriangle"; break;
						case ShapeType.sptCTextTriangleInverted: eTextShapeType = "textTriangleInverted"; break;
						case ShapeType.sptCTextChevron: eTextShapeType = "textChevron"; break;
						case ShapeType.sptCTextChevronInverted: eTextShapeType = "textChevronInverted"; break;
						case ShapeType.sptCTextRingInside: eTextShapeType = "textRingInside"; break;
						case ShapeType.sptCTextRingOutside: eTextShapeType = "textRingOutside"; break;
						case ShapeType.sptCTextCirclePour: eTextShapeType = "textCirclePour"; break;
						case ShapeType.sptCTextArchUpPour: eTextShapeType = "textArchUpPour"; break;
						case ShapeType.sptCTextArchDownPour: eTextShapeType = "textArchDownPour"; break;
						default: eTextShapeType = "textNoShape"; break;
					}
					oBodyPr.prstTxWarp = AscFormat.CreatePrstTxWarpGeometry(eTextShapeType);
					oTextFill = this.getOOXMLFill(oContext);
					oTextStroke = this.getOOXMLStroke();
					oSpPr.setGeometry(AscFormat.CreateGeometry("rect"));
					oSpPr.setFill(AscFormat.CreateNoFillUniFill());
					oSpPr.setLn(null);
					oBodyPr.lIns = 0;
					oBodyPr.tIns = 0;
					oBodyPr.rIns = 0;
					oBodyPr.bIns = 0;


					if (oTextPath) {
						sText = oTextPath.m_sString || "";
						oCSSStyle = oTextPath.m_oStyle;

					}


					if (oTextPath && (oTextPath.m_oFitShape || oTextPath.m_oFitPath)) {
						oBodyPr.textFit = new AscFormat.CTextFit();
						oBodyPr.textFit.type = AscFormat.text_fit_NormAuto;
					}
					oBodyPr.wrap = AscFormat.nTWTSquare;
					oBodyPr.fromWordArt = true;
					oOOXMLDrawing.setBodyPr(oBodyPr);
					oDocContent = new CDocumentContent(oOOXMLDrawing, oContext.DrawingDocument, 0, 0, 0, 0, false, false, false)
					oDocContent.MoveCursorToStartPos(false);
					oDocContent.AddText(sText);
					oOOXMLDrawing.setTextBoxContent(oDocContent);
				}
				else {
					oBodyPr.wrap = AscFormat.nTWTSquare;
					oBodyPr.upright = true;
					let oTextbox = this.getTextbox();
					if (oTextbox) {
						if (oTextbox.m_oTxtbxContent) {
							//oBodyPr.setAnchor(1);
							let oInset = oTextbox.m_oInset;
							if (oInset) {
								if (oInset.m_dLeft !== null) {
									oBodyPr.lIns = Pt_To_Mm(oInset.m_dLeft);
								}
								if (oInset.m_dTop !== null) {
									oBodyPr.tIns = Pt_To_Mm(oInset.m_dTop);
								}
								if (oInset.m_dRight !== null) {
									oBodyPr.rIns = Pt_To_Mm(oInset.m_dRight);
								}
								if (oInset.m_dBottom !== null) {
									oBodyPr.bIns = Pt_To_Mm(oInset.m_dBottom);
								}
							}

							let oCssStyle = oTextbox.m_oStyle;
							if (oCssStyle) {
								let oProperty = oCssStyle.GetProperty(ECssPropertyType.cssptLayoutFlow);
								if (oProperty) {
									if (oProperty.m_oValue.eLayoutFlow === ECssLayoutFlow.csslayoutflowVertical) {
										oBodyPr.vert = AscFormat.nVertTTvert;
									}
								}
								oProperty = oCssStyle.GetProperty(ECssPropertyType.cssptMsoLayoutFlowAlt);
								if (oProperty) {
									if (oProperty.m_oValue.eLayoutFlowAlt === ECssLayoutFlowAlt.csslayoutflowaltBottomToTop) {
										oBodyPr.vert = AscFormat.nVertTTvert270;
									}
								}
								oProperty = oCssStyle.GetProperty(ECssPropertyType.cssptMsoRotate);
								if (oProperty) {
									let val = 0;
									switch (oProperty.m_oValue.eRotate) {
										case ECssMsoRotate.cssmsorotate90: val = 90; break;
										case ECssMsoRotate.cssmsorotate180: val = 180; break;
										case ECssMsoRotate.cssmsorotate270: val = 270; break;
									}
									oBodyPr.rot = val * 60000;
								}
								oProperty = oCssStyle.GetProperty(ECssPropertyType.cssptMsoFitShapeToText);
								if (oProperty) {
									if (oProperty.m_oValue.bValue) {
										oBodyPr.textFit = new AscFormat.CTextFit(AscFormat.text_fit_Auto);
									}
								}
								oProperty = oCssStyle.GetProperty(ECssPropertyType.cssptMsoFitTextToShape);
								if (oProperty) {
									if (oProperty.m_oValue.bValue) {
										oBodyPr.textFit = new AscFormat.CTextFit(AscFormat.text_fit_No);
									}
								}
								oProperty = oCssStyle.GetProperty(ECssPropertyType.cssptMsoTextScale);
								if (oProperty) {
									if (oProperty.m_oValue.oValue.eType === ECssUnitsType.cssunitstypeUnits) {
										oBodyPr.textFit = new AscFormat.CTextFit(AscFormat.text_fit_NormAuto);
										oBodyPr.textFit.fontScale = (100 * oProperty.m_oValue.oValue.dValue + 0.5) >> 0;
									}
								}
							}
							oOOXMLDrawing.setBodyPr(oBodyPr);
							oOOXMLDrawing.setTextBoxContent(oTextbox.m_oTxtbxContent);
							oTextbox.m_oTxtbxContent.SetParent(oOOXMLDrawing);
						}
						else if (oTextbox.m_oText) {
							//oBodyPr.setAnchor(1);
							oOOXMLDrawing.setBodyPr(oBodyPr);
							oDocContent = new CDocumentContent(oOOXMLDrawing, oContext.DrawingDocument, 0, 0, 0, 0, false, false, false)
							oDocContent.MoveCursorToStartPos(false);
							oDocContent.AddText(oTextbox.m_oText);
							oOOXMLDrawing.setTextBoxContent(oDocContent);
							if (oTextbox.m_oTextStyle) {
								oCSSStyle = oTextbox.m_oTextStyle;
							}
						}
					}
				}

				if (this.m_oStyle) {
					let sCSSAnchor = this.m_oStyle.GetPropertyValueString("v-text-anchor");
					if (sCSSAnchor) {
						if (sCSSAnchor === "middle") oBodyPr.setAnchor(oBodyPr.GetAnchorCode("ctr"));
						if (sCSSAnchor === "bottom") oBodyPr.setAnchor(oBodyPr.GetAnchorCode("b"));
						if (sCSSAnchor === "top-center") oBodyPr.setAnchor(oBodyPr.GetAnchorCode("t"));
						if (sCSSAnchor === "middle-center") oBodyPr.setAnchor(oBodyPr.GetAnchorCode("ctr"));
						if (sCSSAnchor === "bottom-center") oBodyPr.setAnchor(oBodyPr.GetAnchorCode("b"));
						if (sCSSAnchor === "top-baseline") oBodyPr.setAnchor(oBodyPr.GetAnchorCode("t"));
						if (sCSSAnchor === "bottom-baseline") oBodyPr.setAnchor(oBodyPr.GetAnchorCode("b"));
						if (sCSSAnchor === "top-center-baseline") oBodyPr.setAnchor(oBodyPr.GetAnchorCode("t"));
						if (sCSSAnchor === "bottom-center-baseline") oBodyPr.setAnchor(oBodyPr.GetAnchorCode("b"));
					}
				}
				if (oDocContent) {
					if (oCSSStyle) {
						let sCSSFont = oCSSStyle.GetStringValue(ECssPropertyType.cssptFontFamily);
						if (typeof sCSSFont === "string" && sCSSFont.length > 0) {
							sFontName = sCSSFont.replace(new RegExp("\"", 'g'), "");
						}
						let nCSSFontSize = oCSSStyle.GetNumberValue(ECssPropertyType.cssptFontSize);
						if (nCSSFontSize !== null) {
							nFontSize = nCSSFontSize;
						}
						let oFontStylePr = oCSSStyle.GetProperty(ECssPropertyType.cssptFontStyle);
						if (oFontStylePr) {
							let oValue = oFontStylePr.m_oValue;
							if (oValue.eFontStyle === ECssFontStyle.cssfontstyleItalic) {
								bItalic = true;
							}
						}
						let oFontWeightPr = oCSSStyle.GetProperty(ECssPropertyType.cssptFontWeight);
						if (oFontWeightPr) {
							let oValue = oFontWeightPr.m_oValue;
							if (oValue.eFontWeight >= ECssFontWeight.cssfontweight400) {
								bBold = true;
							}
						}
					}
					let oParaPr = new AscCommonWord.CParaPr();
					let oTextPr = new AscCommonWord.CTextPr();
					oParaPr.Jc = AscCommon.align_Center;
					oTextPr.RFonts.Ascii = { Name: sFontName, Index: -1 };
					oTextPr.RFonts.HAnsi = { Name: sFontName, Index: -1 };
					if (bBold) {
						oTextPr.Bold = bBold;
					}
					if (bItalic) {
						oTextPr.Italic = bItalic;
					}
					oTextPr.TextFill = oTextFill;
					oTextPr.TextOutline = oTextStroke;
					oTextPr.FontSize = nFontSize;
					oDocContent.SetApplyToAll(true);
					oDocContent.SetParagraphPr(oParaPr);
					oDocContent.AddToParagraph(new AscCommonWord.ParaTextPr(oTextPr));
					oDocContent.SetApplyToAll(false);
				}
			}
			oOOXMLDrawing.setBDeleted(false);
			return oOOXMLDrawing;
		};
		CVmlCommonElements.prototype.getFinalShapeType = function (aOtherElements) {
			let oShapeType = null;
			if (this instanceof CShape) {
				oShapeType = CLegacyDrawing.prototype.static_GetShapeTypeForShape(this, aOtherElements);
			}
			let nShapeType = null;

			if (this instanceof CBackground) {
				nShapeType = ShapeType.sptCRect;
			}
			if (this instanceof CRect) {
				nShapeType = ShapeType.sptCRect;
			}
			if (this instanceof CRoundRect) {
				nShapeType = ShapeType.sptCRoundRect;
				//TODO: adjustment
			}
			if (this instanceof COval) {
				nShapeType = ShapeType.sptCEllipse;
			}
			if (this instanceof CImage) {
				nShapeType = ShapeType.sptCFrame;
			}
			if (this instanceof CLine) {
				nShapeType = ShapeType.sptCLine;
				//TODO: creates advanced css style with coordinates
			}
			if (this instanceof CPolyLine) {
				nShapeType = ShapeType.sptCustom;
				//TODO: creates advanced css style with coordinates
			}
			if (this instanceof CShape) {
				if (oShapeType) {
					//TODO: copy properties from shapetype
					nShapeType = oShapeType.getShapeType();
				}
				else {
					nShapeType = this.getShapeType();
				}
			}
			if (nShapeType === null) {
				let sConnectorType = this.m_oConnectorType;
				if (sConnectorType === "elbow") nShapeType = ShapeType.sptCBentConnector2;
				else if (sConnectorType === "straight") nShapeType = ShapeType.sptCStraightConnector1;
				else if (sConnectorType === "curved") nShapeType = ShapeType.sptCCurvedConnector2;
			}
			return nShapeType;
		};
		CVmlCommonElements.prototype.isWordArt = function (aOtherElements) {
			let nType = this.getFinalShapeType(aOtherElements);
			if (nType >= ShapeType.sptCTextPlain && nType <= ShapeType.sptCTextCanDown) {
				return true;
			}
			let oTextPath = this.getTextPath();
			if (oTextPath) {
				return true;
			}
			return false;
		};

		function CVMLDrawing() {
			CBaseNoId.call(this);

			this.items = [];

			this.m_oReadPath = null;
			this.m_mapShapes = {};
			this.m_arrShapeTypes = [];

			// Writing
			this.m_mapComments = {};
			this.m_arObjectXml = [];
			this.m_arControlXml = [];

			this.m_lObjectIdVML = null;
		}

		IC(CVMLDrawing, CBaseNoId, 0);

		CVMLDrawing.prototype.getShape = function (nId) {
			const sId = "_x0000_s" + nId;
			return this.getShapeById(sId);
		};
		CVMLDrawing.prototype.getShapeById = function (sId) {
			for (let nItem = 0; nItem < this.items.length; ++nItem) {
				const oItem = this.items[nItem];
				if (oItem instanceof CShape && oItem.m_sId === sId) {
					return oItem;
				}
			}
			return null;
		};
		CVMLDrawing.prototype.getShapeBySpId = function (sId) {
			for (let nItem = 0; nItem < this.items.length; ++nItem) {
				const oItem = this.items[nItem];
				if (oItem instanceof CShape && oItem.m_sSpId === sId) {
					return oItem;
				}
			}
			return null;
		};
		CVMLDrawing.prototype.getXmlString = function () {
			if ((!this.m_mapComments || isEmptyObject(this.m_mapComments)) && isEmptyObject(this.m_arObjectXml) && isEmptyObject(this.m_arControlXml))
				return "";

			let sXml = "";

			for (let i = 0; i < this.m_arObjectXml.length; ++i) {
				sXml += (this.m_arObjectXml[i]);
			}

			if (false === isEmptyObject(this.m_arControlXml) || ((null !== this.m_mapComments) && (false === isEmptyObject(this.m_mapComments)))) {
				sXml += ("<o:shapelayout v:ext=\"edit\"><o:idmap v:ext=\"edit\" data=\"1\"/></o:shapelayout>");
			}

			if (this.m_arControlXml.length > 0) {

				sXml += ("<v:shapetype id=\"_x0000_t201\" coordsize=\"21600,21600\" o:spt=\"201\"");
				sXml += (" path=\"m,l,21600r21600,l21600,xe\"><v:stroke joinstyle=\"miter\"/>");
				sXml += ("<v:path shadowok=\"f\" o:extrusionok=\"f\" strokeok=\"f\" fillok=\"f\" o:connecttype=\"rect\"/>");
				sXml += ("<o:lock v:ext=\"edit\" shapetype=\"t\"/></v:shapetype>");

				for (let i = 0; i < this.m_arControlXml.length; ++i) {
					sXml += (this.m_arControlXml[i]);
				}
			}

			let nIndex = this.m_lObjectIdVML + 1;
			if ((null !== this.m_mapComments) && (false === isEmptyObject(this.m_mapComments))) {
				sXml += ("<v:shapetype id=\"_x0000_t202\" coordsize=\"21600,21600\" o:spt=\"202\"");
				sXml += (" path=\"m,l,21600r21600,l21600,xe\">");
				sXml += ("<v:stroke joinstyle=\"miter\"/><v:path gradientshapeok=\"t\" o:connecttype=\"rect\"/></v:shapetype>");

				for (let sKey in this.m_mapComments) {
					let comment = this.m_mapComments[sKey];
					let oCoords = comment.coords;
					let sStyle = "";
					if (oCoords.dLeftMM !== null) {
						let oPoint = new CPoint(""); oPoint.FromMm(oCoords.dLeftMM);
						sStyle += "margin-left:" + oPoint.ToPoints() + "pt;";
					}
					if (oCoords.dTopMM !== null) {
						let oPoint = new CPoint(""); oPoint.FromMm(oCoords.dTopMM);
						sStyle += "margin-top:" + oPoint.ToPoints() + "pt;";
					}
					if (oCoords.dWidthMM !== null) {
						let oPoint = new CPoint(""); oPoint.FromMm(oCoords.dWidthMM);
						sStyle += "width:" + oPoint.ToPoints() + "pt;";
					}
					if (oCoords.dHeightMM !== null) {
						let oPoint = new CPoint(""); oPoint.FromMm(oCoords.dHeightMM);
						sStyle += "height:" + oPoint.ToPoints() + "pt;";
					}
					let sClientData = "<x:ClientData ObjectType=\"Note\">";

					if (oCoords.bMoveWithCells !== null && true === oCoords.bMoveWithCells)
						sClientData += "<x:MoveWithCells/>";

					if (oCoords.bSizeWithCells !== null && true === oCoords.bSizeWithCells)
						sClientData += "<x:SizeWithCells/>";

					if (oCoords.nLeft !== null && oCoords.nLeftOffset !== null &&
						oCoords.nTop !== null && oCoords.nTopOffset !== null &&
						oCoords.nRight !== null && oCoords.nRightOffset !== null &&
						oCoords.nBottom !== null && oCoords.nBottomOffset !== null) {
						sClientData += "<x:Anchor>";
						sClientData += (oCoords.nLeft) + ",";
						sClientData += (oCoords.nLeftOffset) + ",";
						sClientData += (oCoords.nTop) + ",";
						sClientData += (oCoords.nTopOffset) + ",";
						sClientData += (oCoords.nRight) + ",";
						sClientData += (oCoords.nRightOffset) + ",";
						sClientData += (oCoords.nBottom) + ",";
						sClientData += (oCoords.nBottomOffset);
						sClientData += "</x:Anchor>";
					}
					sClientData += "<x:AutoFill>False</x:AutoFill>";

					if (oCoords.nRow !== null)
						sClientData += "<x:Row>" + (oCoords.nRow) + "</x:Row>";

					if (oCoords.nCol !== null)
						sClientData += "<x:Column>" + (oCoords.nCol) + "</x:Column>";

					sClientData += "</x:ClientData>";

					let sGfxdata = "";
					if (comment.m_sGfxdata !== null)
						sGfxdata = "o:gfxdata=\"" + comment.m_sGfxdata + "\"";

					let sShape = "";
					sShape += "<v:shape id=\"_x0000_s" + (nIndex++) + " \" type=\"#_x0000_t202\" style='position:absolute;";
					sShape += sStyle;
					sShape += "z-index:4;visibility:hidden' ";
					sShape += sGfxdata;
					sShape += " fillcolor=\"#ffffe1\" o:insetmode=\"auto\"><v:fill color2=\"#ffffe1\"/><v:shadow on=\"t\" color=\"black\" obscured=\"t\"/><v:path o:connecttype=\"none\"/><v:textbox style='mso-direction-alt:auto'><div style='text-align:left'></div></v:textbox>";
					sShape += sClientData;
					sShape += "</v:shape>";

					sXml += (sShape);
				}
			}
			sXml += ("</xml>");
			return sXml;
		};
		CVMLDrawing.prototype.getSignatureLines = function () {
			let aSL = [];
			for (let nItem = 0; nItem < this.items.length; ++nItem) {
				let oItem = this.items[nItem];
				if (oItem.isSignatureLine()) {
					aSL.push(oItem);
				}
			}
			return aSL;
		};
		CVMLDrawing.prototype.convertSignatureLines = function (oContext) {
			let aSL = this.getSignatureLines();
			let aOOXMLSl = [];
			for (let nSL = 0; nSL < aSL.length; ++nSL) {
				let oSL = aSL[nSL];
				let oOOXMLSL = oSL.convertToOOXML(this.items, null, oContext);
				aOOXMLSl.push(oOOXMLSL);
			}
			return aOOXMLSl;
		};
		CVMLDrawing.prototype.configureVmlDrawingFor = function (sFormControlType) {
			if ('button' === sFormControlType) {
				const shapeLayout = new CShapeLayout();
				const shapeType = new CShapeType();
				const shape = new CShape();
				
				// for shapeLayout
				shapeLayout.m_oIdMap = new CIdMap();
				
				// for shapeType
				const stroke = new CStroke();
				const path = new CPath();
				const shapeType_lock = new CLock();
				shapeType.items.push(stroke, path, shapeType_lock);
				
				// for shape
				const fill = new CFill();
				const shape_lock = new CLock();
				const textBox = new CTextbox();
				const clientData = new CClientData();
				shape.items.push(stroke, path, shape_lock);

				this.items.push(shapeLayout, shapeType, shape);
			}
		}

		function CShapeLayout() {
			CBaseNoId.call(this);

			this.m_oExt = null;

			// Children
			this.m_oIdMap = null;
			this.m_oRegroupTable = null;
			this.m_oRules = null;
		}

		IC(CShapeLayout, CBaseNoId, 0);

		function CShapeType() {
			CVmlCommonElements.call(this);

			this.m_sAdj = null;
			this.m_oPath = null;
			this.m_oMaster = null;
		}

		IC(CShapeType, CVmlCommonElements, AscDFH.historyitem_type_VMLShapeType);

		CShapeType.prototype.getShapeType = function () {
			return this.m_oSpt;
		};

		function CShape() {
			CVmlCommonElements.call(this);

			this.m_sType = null;
			this.m_sAdj = null;
			this.m_oPath = null;
			this.m_sGfxData = null;
			this.m_sEquationXML = null;
		}

		IC(CShape, CVmlCommonElements, AscDFH.historyitem_type_VMLShape);

		CShape.prototype.getShapeType = function () {
			return parseShapeType(this.m_sType);
		};

		function CIdMap() {
			CBaseNoId.call(this);

			this.m_sData = null;
			this.m_oExt = null;
		}

		IC(CIdMap, CBaseNoId, 0);

		function CStroke() {
			CBaseNoId.call(this);

			this.m_oId = null;
			this.m_sAltHref = null;
			this.m_oColor = null;
			this.m_oColor2 = null;
			this.m_oDahsStyle = null;
			this.m_oEndArrow = null;
			this.m_oEndArrowLength = null;
			this.m_oEndArrowWidth = null;
			this.m_oEndCap = null;
			this.m_oFillType = null;
			this.m_oForceDash = null;
			this.m_sHref = null;
			this.m_rId = null;
			this.m_oImageAlignShape = null;
			this.m_oImageAspect = null;
			this.m_oImageSize = null;
			this.m_oInsetPen = null;
			this.m_oJoinStyle = null;
			this.m_oLineStyle = null;
			this.m_oMiterLimit = null;
			this.m_oOn = null;
			this.m_oOpacity = null;
			this.m_oRelId = null;
			this.m_sSrc = null;
			this.m_oStartArrow = null;
			this.m_oStartArrowLength = null;
			this.m_oStartArrowWidth = null;
			this.m_sTitle = null;
			this.m_oWeight = null;

			// Childs
			this.m_oLeft = null;
			this.m_oTop = null;
			this.m_oRight = null;
			this.m_oBottom = null;
			this.m_oColumn = null;
		}

		IC(CStroke, CBaseNoId, 0);

		CStroke.prototype.getOOXMLArrow = function (nArrowType, nArrowLen, nArrowWidth) {
			if (nArrowType !== null || nArrowLen !== null || nArrowWidth !== null) {
				let oArrow = new AscFormat.EndArrow();

				if (nArrowType === EStrokeArrowType.strokearrowtypeBlock) oArrow.type = oArrow.GetTypeCode("triangle");
				else if (nArrowType === EStrokeArrowType.strokearrowtypeClassic) oArrow.type = oArrow.GetTypeCode("stealth");
				else if ("none" === EStrokeArrowType.strokearrowtypeNone) oArrow.type = oArrow.GetTypeCode("none");
				else if ("open" === EStrokeArrowType.strokearrowtypeOpen) oArrow.type = oArrow.GetTypeCode("arrow");
				else if ("oval" === EStrokeArrowType.strokearrowtypeOval) oArrow.type = oArrow.GetTypeCode("oval");
				else oArrow.type = oArrow.GetTypeCode("none");

				if (nArrowLen === EStrokeArrowLength.strokearrowlengthLong) oArrow.len = oArrow.GetSizeCode("lg");
				else if (nArrowLen === EStrokeArrowLength.strokearrowlengthMedium) oArrow.len = oArrow.GetSizeCode("med");
				else if (nArrowLen === EStrokeArrowLength.strokearrowlengthShort) oArrow.len = oArrow.GetSizeCode("sm");
				else oArrow.len = oArrow.GetSizeCode("med");


				if (nArrowWidth === EStrokeArrowWidth.strokearrowwidthMedium) oArrow.w = oArrow.GetSizeCode("med");
				else if (nArrowWidth === EStrokeArrowWidth.strokearrowwidthNarrow) oArrow.w = oArrow.GetSizeCode("sm");
				else if (nArrowWidth === EStrokeArrowWidth.strokearrowwidthWide) oArrow.w = oArrow.GetSizeCode("lg");
				else oArrow.w = oArrow.GetSizeCode("med");
				return oArrow;
			}
			else {
				return null;
			}
		};
		CStroke.prototype.getOOXMLStroke = function () {
			if (this.m_oOn === false) {
				return AscFormat.CreateNoFillLine();
			}
			let oStroke = null;
			if (this.m_oColor !== null ||
				this.m_oDahsStyle !== null ||
				this.m_oEndArrow !== null || this.m_oEndArrowLength !== null || this.m_oEndArrowWidth !== null ||
				this.m_oStartArrow !== null || this.m_oStartArrowLength !== null || this.m_oStartArrowWidth !== null ||
				this.m_oEndCap !== null ||
				this.m_oJoinStyle !== null) {
				oStroke = new AscFormat.CLn();
				if (this.m_oColor) {
					oStroke.Fill = this.m_oColor.getOOXMLFill();
				}
				else {
					oStroke.Fill = AscFormat.CreateSolidFillRGB(0, 0, 0);
				}
				if (this.m_oDahsStyle !== null) {
					switch (this.m_oDahsStyle) {
						case EVmlDashStyle.vmldashstyleSolid: { oStroke.prstDash = oStroke.GetDashCode("solid"); break; }
						case EVmlDashStyle.vmldashstyleShortDash: { oStroke.prstDash = oStroke.GetDashCode("sysDash"); break; }
						case EVmlDashStyle.vmldashstyleShortDot: { oStroke.prstDash = oStroke.GetDashCode("sysDot"); break; }
						case EVmlDashStyle.vmldashstyleShortDashDot: { oStroke.prstDash = oStroke.GetDashCode("sysDashDot"); break; }
						case EVmlDashStyle.vmldashstyleShortDashDotDot: { oStroke.prstDash = oStroke.GetDashCode("sysDashDotDot"); break; }
						case EVmlDashStyle.vmldashstyleDot: { oStroke.prstDash = oStroke.GetDashCode("dot"); break; }
						case EVmlDashStyle.vmldashstyleDash: { oStroke.prstDash = oStroke.GetDashCode("dash"); break; }
						case EVmlDashStyle.vmldashstyleDashDot: { oStroke.prstDash = oStroke.GetDashCode("lgDash"); break; }
						case EVmlDashStyle.vmldashstyleLongDash: { oStroke.prstDash = oStroke.GetDashCode("dashDot"); break; }
						case EVmlDashStyle.vmldashstyleLongDashDot: { oStroke.prstDash = oStroke.GetDashCode("lgDashDot"); break; }
						case EVmlDashStyle.vmldashstyleLongDashDotDot: { oStroke.prstDash = oStroke.GetDashCode("lgDashDotDot"); break; }
						default: { oStroke.prstDash = oStroke.GetDashCode("solid"); break; }
					}
				}
				oStroke.tailEnd = this.getOOXMLArrow(this.m_oEndArrow, this.m_oEndArrowLength, this.m_oEndArrowWidth);
				oStroke.headEnd = this.getOOXMLArrow(this.m_oStartArrow, this.m_oStartArrowLength, this.m_oStartArrowWidth);
				if (this.m_oEndCap !== null) {
					switch (this.m_oEndCap) {
						case EStrokeEndCap.strokeendcapFlat: { oStroke.cap = oStroke.GetCapCode("flat"); break; }
						case EStrokeEndCap.strokeendcapRound: { oStroke.cap = oStroke.GetCapCode("rnd"); break; }
						case EStrokeEndCap.strokeendcapSqaure: { oStroke.cap = oStroke.GetCapCode("sq"); break; }
					}
				}
				if (this.m_oJoinStyle !== null) {
					oStroke.Join = new AscFormat.LineJoin();
					switch (this.m_oJoinStyle) {
						case EStrokeJoinStyle.strokejoinstyleRound: { oStroke.Join.type = AscFormat.LineJoinType.Round; }
						case EStrokeJoinStyle.strokejoinstyleMiter: { oStroke.Join.type = AscFormat.LineJoinType.Miter; }
						case EStrokeJoinStyle.strokejoinstyleBevel: { oStroke.Join.type = AscFormat.LineJoinType.Bevel; }
						default: { oStroke.Join.type = AscFormat.LineJoinType.Round; }
					}
				}
			}
			else {
				oStroke = AscFormat.CreateNoFillLine();
			}
			return oStroke;
		};

		function CPath() {
			CBaseNoId.call(this);
			this.m_oArrowOk = null;
			this.m_oConnectAngles = null;
			this.m_oConnectLocs = null;
			this.m_oConnectType = null;
			this.m_oExtrusionOk = null;
			this.m_oFillOk = null;
			this.m_oGradientShapeOk = null;
			this.m_oId = null;
			this.m_oInsetPenOk = null;
			this.m_oLimo = null;
			this.m_oShadowOk = null;
			this.m_oStrokeOk = null;
			this.m_oTextBoxRect = null;
			this.m_oTextPathOk = null;
			this.m_oV = null;
		}

		IC(CPath, CBaseNoId, 0);

		function CLock() {
			CBaseNoId.call(this);

			this.m_oAdjustHandles = null;
			this.m_oAspectRatio = null;
			this.m_oCropping = null;
			this.m_oExt = null;
			this.m_oGrouping = null;
			this.m_oPosition = null;
			this.m_oRotation = null;
			this.m_oSelection = null;
			this.m_oShapeType = null;
			this.m_oText = null;
			this.m_oUnGrouping = null;
			this.m_oVerticies = null;
		}

		IC(CLock, CBaseNoId, 0);

		function CFill() {
			CBaseNoId.call(this);

			this.m_oExt = null;
			this.m_oType = null;
		}

		IC(CFill, CBaseNoId, 0);

		function CTextbox() {
			CBaseNoId.call(this);

			this.m_oId = null;
			this.m_oStyle = null;
			this.m_oInset = null;
			this.m_oSingleClick = null;
			this.m_oInsetMode = null;

			this.m_oTxtbxContent = null;
			this.m_oText = null;
			this.m_oTextStyle = null;
		}

		IC(CTextbox, CBaseNoId, 0);

		function CClientData() {
			CBaseNoId.call(this);

			this.m_oObjectType = null;

			this.m_oMoveWithCells = null;
			this.m_oSizeWithCells = null;
			this.m_oAnchor = null;
			this.m_oRow = null;
			this.m_oColumn = null;
			this.m_oMin = null;
			this.m_oMax = null;
			this.m_oInc = null;
			this.m_oDx = null;
			this.m_oPage = null;
			this.m_oDropLines = null;
			this.m_oSel = null;
			this.m_oWidthMin = null;
			this.m_oDropStyle = null;
			this.m_oFirstButton = null;
			this.m_oDefaultSize = null;
			this.m_oAutoFill = null;
			this.m_oAutoScale = null;
			this.m_oAutoLine = null;
			this.m_oHoriz = null;
			this.m_oVScroll = null;
			this.m_oAutoPict = null;
			this.m_oColored = null;
			this.m_oMultiLine = null;
			this.m_oNoThreeD = null;
			this.m_oNoThreeD2 = null;
			this.m_oLockText = null;
			this.m_oJustLastX = null;
			this.m_oSecretEdit = null;
			this.m_oFmlaLink = null;
			this.m_oFmlaRange = null;
			this.m_oFmlaMacro = null;
			this.m_oFmlaTxbx = null;
			this.m_oFmlaGroup = null;
			this.m_oCf = null;
			this.m_oChecked = null;
			this.m_oMultiSel = null;
			this.m_oSelType = null;
			this.m_oVal = null;
			this.m_oTextHAlign = null;
			this.m_oTextVAlign = null;
			this.m_oVisible = null;
			this.m_oPrintObject = null;
		}

		IC(CClientData, CBaseNoId, AscDFH.historyitem_type_VMLClientData);

		CClientData.prototype.getAnchorArray = function (aAnchor) {
			aAnchor.length = 0;
			if (this.m_oAnchor) {
				let arSplit = this.m_oAnchor.split(",");
				for (let i = 0; i < arSplit.length; i++) {
					aAnchor.push(parseInt(arSplit[i]));
				}
			}
		};
		CClientData.prototype.toCellAnchor = function () {
			//TODO: implement
			throw new Error('CClientData.prototype.toCellAnchor not implemented');
		};
		CClientData.prototype.toFormControlPr = function () {
			//TODO: implement
			throw new Error('CClientData.prototype.toFormControlPr not implemented');
		};


		/* Exports */
		window['AscFormat'].CVMLDrawing = CVMLDrawing;
		window['AscFormat'].CVMLClientData = CClientData;
	}
)(window);
