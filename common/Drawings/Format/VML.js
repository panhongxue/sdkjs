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


		/* Constants */
		const EExt = {
			extBackwardCompatible: 0,
			extEdit: 1,
			extView: 2,
		};

		const EVmlClientDataObjectType = {
			vmlclientdataobjecttypeButton: 0,
			vmlclientdataobjecttypeCheckbox: 1,
			vmlclientdataobjecttypeDialog: 2,
			vmlclientdataobjecttypeDrop: 3,
			vmlclientdataobjecttypeEdit: 4,
			vmlclientdataobjecttypeGBox: 5,
			vmlclientdataobjecttypeGroup: 6,
			vmlclientdataobjecttypeLabel: 7,
			vmlclientdataobjecttypeLineA: 8,
			vmlclientdataobjecttypeList: 9,
			vmlclientdataobjecttypeMovie: 10,
			vmlclientdataobjecttypeNote: 11,
			vmlclientdataobjecttypePict: 12,
			vmlclientdataobjecttypeRadio: 13,
			vmlclientdataobjecttypeRect: 14,
			vmlclientdataobjecttypeRectA: 15,
			vmlclientdataobjecttypeScroll: 16,
			vmlclientdataobjecttypeShape: 17,
			vmlclientdataobjecttypeSpin: 18,
		};

		const EStrokeJoinStyle = {
			strokejoinstyleBevel: 0,
			strokejoinstyleMiter: 1,
			strokejoinstyleRound: 2,
		};

		const EConnectType = {
			connecttypeCustom: 0,
			connecttypeNone: 1,
			connecttypeRect: 2,
			connecttypeSegments: 3,
		};

		const EInsetMode = {
			insetmodeAuto: 0,
			insetmodeCustom: 1,
		};

		const EColorType = {
			colortypeNone: 0,
			colortypeRGB: 1,
			colortypeAqua: 2,
			colortypeBlack: 3,
			colortypeBlue: 4,
			colortypeFuchsia: 5,
			colortypeGray: 6,
			colortypeGreen: 7,
			colortypeLime: 8,
			colortypeMaroon: 9,
			colortypeNavy: 10,
			colortypeOlive: 11,
			colortypePurple: 12,
			colortypeRed: 13,
			colortypeSilver: 14,
			colortypeTeal: 15,
			colortypeWhite: 16,
			colortypeYellow: 17,
		};

		const ECssPropertyType = {
			cssptUnknown: 0,
			cssptFlip: 1000,
			cssptHeight: 1001,
			cssptLeft: 1002,
			cssptMarginBottom: 1003,
			cssptMarginLeft: 1004,
			cssptMarginRight: 1005,
			cssptMarginTop: 1006,
			cssptMsoPositionHorizontal: 1007,
			cssptMsoPositionHorizontalRelative: 1008,
			cssptMsoPositionVertical: 1009,
			cssptMsoPositionVerticalRelative: 1010,
			cssptMsoWrapDistanceBottom: 1011,
			cssptMsoWrapDistanceLeft: 1012,
			cssptMsoWrapDistanceRight: 1013,
			cssptMsoWrapDistanceTop: 1014,
			cssptMsoWrapEdited: 1015,
			cssptMsoWrapStyle: 1016,
			cssptPosition: 1017,
			cssptRotation: 1018,
			cssptTop: 1019,
			cssptVisibility: 1020,
			cssptWidth: 1021,
			cssptZIndex: 1022,
			csspctMsoWidthPercent: 1023,
			csspctMsoHeightPercent: 1024,

			cssptDirection: 1100,
			cssptLayoutFlow: 1101,
			cssptMsoDirectionAlt: 1102,
			cssptMsoFitShapeToText: 1103,
			cssptMsoFitTextToShape: 1104,
			cssptMsoLayoutFlowAlt: 1105,
			cssptMsoNextTextbox: 1106,
			cssptMsoRotate: 1107,
			cssptMsoTextScale: 1108,
			cssptVTextAnchor: 1109,

			cssptFont: 1200,
			cssptFontFamily: 1201,
			cssptFontSize: 1202,
			cssptFontStyle: 1203,
			cssptFontVariant: 1204,
			cssptFontWeight: 1205,
			cssptMsoTextShadow: 1206,
			cssptTextDecoration: 1207,
			cssptVRotateLetters: 1208,
			cssptVSameLetterHeights: 1209,
			cssptVTextAlign: 1210,
			cssptVTextKern: 1211,
			cssptVTextReverse: 1212,
			cssptVTextSpacingMode: 1213,
			cssptVTextSpacing: 1214,
			cssptHTextAlign: 1215,
		};

		const ECssFlip = {
			cssflipX: 0,
			cssflipY: 1,
			cssflipXY: 2,
			cssflipYX: 3,
		};

		const ECssUnitsType = {
			cssunitstypeAuto: 0,
			cssunitstypeUnits: 1,
			cssunitstypePerc: 2,
			cssunitstypeAbsolute: 3,
		};

		const ECssMsoPosHorRel = {
			cssmsoposhorrelMargin: 0,
			cssmsoposhorrelPage: 1,
			cssmsoposhorrelText: 2,
			cssmsoposhorrelChar: 3,
			cssmsoposhorrelLeftMargin: 4,
			cssmsoposhorrelRightMargin: 5,
		};

		const ECssMsoPosHor = {
			cssmsoposhorAbsolute: 0,
			cssmsoposhorLeft: 1,
			cssmsoposhorCenter: 2,
			cssmsoposhorRight: 3,
			cssmsoposhorInside: 4,
			cssmsoposhorOutside: 5,
		};

		const ECssMsoPosVer = {
			cssmsoposverAbsolute: 0,
			cssmsoposverTop: 1,
			cssmsoposverCenter: 2,
			cssmsoposverBottom: 3,
			cssmsoposverInside: 4,
			cssmsoposverOutside: 5,
		};

		const ECssMsoPosVerRel = {
			cssmsoposverrelMargin: 0,
			cssmsoposverrelPage: 1,
			cssmsoposverrelText: 2,
			cssmsoposverrelLine: 3,
			cssmsoposverrelTopMargin: 4,
			cssmsoposverrelBottomMargin: 5,
		};

		const ECssMsoWrapStyle = {
			cssmsowrapstyleSqaure: 0,
			cssmsowrapstyleNone: 1,
		};

		const ECssPosition = {
			csspositionStatic: 0,
			csspositionAbsolute: 1,
			csspositionRelative: 2,
		};

		const ECssVisibility = {
			cssvisibilityHidden: 0,
			cssvisibilityInherit: 1,
		};

		const ECssZIndexType = {
			csszindextypeAuto: 0,
			csszindextypeOrder: 1,
		};

		const ECssDirection = {
			cssdirectionLTR: 0,
			cssdirectionRTL: 1,
		};

		const ECssLayoutFlow = {
			csslayoutflowHorizontal: 0,
			csslayoutflowVertical: 1,
			csslayoutflowVerticalIdeographic: 2,
			csslayoutflowHorizontalIdeographic: 3,
		};

		const ECssDirectionAlt = {
			cssdirectionaltContext: 0,
		};

		const ECssLayoutFlowAlt = {
			csslayoutflowaltBottomToTop: 0,
		};

		const ECssMsoRotate = {
			cssmsorotate0: 0,
			cssmsorotate90: 90,
			cssmsorotate180: 180,
			cssmsorotate270: -90,
		};

		const ECssVTextAnchor = {
			cssvtextanchorTop: 0,
			cssvtextanchorMiddle: 1,
			cssvtextanchorBottom: 2,
			cssvtextanchorTopCenter: 3,
			cssvtextanchorMiddleCenter: 4,
			cssvtextanchorBottomCenter: 5,
			cssvtextanchorTopBaseline: 6,
			cssvtextanchorBottomBaseline: 7,
			cssvtextanchorTopCenterBaseline: 8,
			cssvtextanchorBottomCenterBaseline: 9,
		};

		const ECssFontStyle = {
			cssfontstyleNormal: 0,
			cssfontstyleItalic: 1,
			cssfontstyleOblique: 2,
		};

		const ECssFontVarian = {
			cssfontvariantNormal: 0,
			cssfontvariantSmallCaps: 1,
		};

		const ECssFontWeight = {
			cssfontweightNormal: 0,
			cssfontweightLighter: 1,
			cssfontweight100: 100,
			cssfontweight200: 200,
			cssfontweight300: 300,
			cssfontweight400: 400,
			cssfontweightBold: 550,
			cssfontweightBolder: 750,
			cssfontweight500: 500,
			cssfontweight600: 600,
			cssfontweight700: 700,
			cssfontweight800: 800,
			cssfontweight900: 900,
		};

		const ECssTextDecoration = {
			csstextdecorationNone: 0,
			csstextdecorationUnderline: 1,
			csstextdecorationOverline: 2,
			csstextdecorationLineThrough: 3,
			csstextdecorationBlink: 4,
		};

		const ECssVTextAlign = {
			cssvtextalignLeft: 0,
			cssvtextalignRight: 1,
			cssvtextalignCenter: 2,
			cssvtextalignJustify: 3,
			cssvtextalignLetterJustify: 4,
			cssvtextalignStretchJustify: 5,
		};

		const ECssVTextSpacingMode = {
			cssvtextspacingmodeTightening: 0,
			cssvtextspacingmodeTracking: 1,
		};

		const EHorizontalAlignment = {
			horizontalalignmentCenter: 0,
			horizontalalignmentContinuous: 1,
			horizontalalignmentDistributed: 2,
			horizontalalignmentFill: 3,
			horizontalalignmentGeneral: 4,
			horizontalalignmentJustify: 5,
			horizontalalignmentLeft: 6,
			horizontalalignmentRight: 7,
			horizontalalignmentCenterContinuous: 8,
		};

		const EVerticalAlignment = {
			verticalalignmentBottom: 0,
			verticalalignmentCenter: 1,
			verticalalignmentDistributed: 2,
			verticalalignmentJustify: 3,
			verticalalignmentTop: 4,
		};


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

		function CorrectXmlString2(strText) {
			strText = strText.replace(new RegExp("&apos;", 'g'), "'");
			strText = strText.replace(new RegExp("&lt;", 'g'), "<");
			strText = strText.replace(new RegExp("&gt;", 'g'), ">");
			strText = strText.replace(new RegExp("&quot;", 'g'), "\"");
			strText = strText.replace(new RegExp("&amp;", 'g'), "&");
			return strText;
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
			this.testString = 'testString';

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
		CVMLDrawing.prototype.configureVmlDrawingFor = function (formControlType) {
			if (formControlType === 'button') {
				const shapeLayout = createShapeLayout();
				const shapeType = createShapeType();
				const shape = createShape();

				this.items.push(shapeLayout, shapeType, shape);

				function createShapeLayout() {
					const shapeLayout = new CShapeLayout();
					shapeLayout.m_oExt = EExt.extEdit;

					const idMap = new CIdMap();
					idMap.m_oExt = EExt.extEdit;
					idMap.m_sData = '1';

					shapeLayout.m_oIdMap = idMap;
					return shapeLayout;
				}

				function createShapeType() {
					const shapeType = new CShapeType();
					shapeType.m_sId = '_x0000_t201';
					shapeType.m_oCoordSize = new CVmlVector2D('21600,21600');
					shapeType.m_oSpt = 201;
					shapeType.m_oPath = 'm,l,21600r21600,l21600,xe';

					const stroke = new CStroke();
					stroke.m_oJoinStyle = EStrokeJoinStyle.strokejoinstyleMiter;

					const path = new CPath();
					path.m_oShadowOk = false;
					path.m_oExtrusionOk = false;
					path.m_oStrokeOk = false;
					path.m_oFillOk = false;
					path.m_oConnectType = EConnectType.connecttypeRect;

					const lock = new CLock();
					lock.m_oExt = EExt.extEdit;
					lock.m_oShapeType = true;

					shapeType.items.push(stroke, path, lock);
					return shapeType;
				}

				function createShape() {
					const shape = new CShape();
					shape.m_sId = '_x0000_s1025';
					shape.m_sType = '#_x0000_t201';
					const styleString = calculateStyleString();
					shape.m_oStyle = new CCssStyle(styleString);
					shape.m_oButton = true;
					shape.m_oFillColor = new CColor('#f0f0f0');
					shape.m_oStrokeColor = new CColor('black');
					shape.m_oInsetMode = EInsetMode.insetmodeAuto;

					const fill = new CFillVml();
					fill.m_oColor2 = new CColor('#f0f0f0');
					fill.m_oDetectMouseClick = true;

					const lock = new CLock();
					lock.m_oExt = EExt.extEdit;
					lock.m_oRotation = true;

					const textBox = createTextBox();

					const clientData = new CClientData();
					clientData.m_oObjectType = EVmlClientDataObjectType.vmlclientdataobjecttypeButton;
					clientData.m_oAnchor = calculateAnchorString();
					clientData.m_oPrintObject = false; 			// <x:PrintObject>False</x:PrintObject>
					clientData.m_oAutoFill = false; 			// <x:AutoFill>False</x:AutoFill>
					clientData.m_oTextHAlign = EHorizontalAlignment.horizontalalignmentCenter;
					clientData.m_oTextVAlign = EVerticalAlignment.verticalalignmentCenter;
					clientData.m_oFmlaMacro = getCorrespondingMacroName();

					shape.items.push(fill, lock, textBox, clientData);
					return shape;

					function calculateStyleString() {
						// TODO: Расчитать стили на основании размеров шейпа
						return 'position:absolute' +
							';margin-left:0' +
							';margin-top:0' +
							';width:100.1pt' +
							';height:100.1pt' +
							';z-index:1' +
							';mso-wrap-style:tight';
					}

					function calculateAnchorString() {
						// TODO: Вычислить значения по шейпу
						const from = { col: 0, colOff: 0, row: 0, rowOff: 0 };
						const to = { col: 1, colOff: 0, row: 1, rowOff: 0 };
						const anchorArray = [
							from.col, from.colOff, from.row, from.rowOff,
							to.col, to.colOff, to.row, to.rowOff
						];
						return anchorArray.join(' ');
					}

					function getCorrespondingMacroName() {
						// TODO: Получить название макроса (или переделать на ссылку)
						return null;
					}
				}

				function createTextBox() {
					const textBox = new CTextbox();
					textBox.m_oStyle = new CCssStyle('mso-direction-alt:auto');
					textBox.m_oSingleClick = false;

					const div = new CDiv();
					div.m_oStyle = new CCssStyle('text-align:center');

					const font = new CFont();
					font.m_sFace = 'Calibri';
					font.m_nSize = 200;
					font.m_oColor = new CColor('black');
					font.m_sText = calculateButtonText();

					textBox.items.push(div);
					div.items.push(font);
					return textBox;

					function calculateButtonText() {
						// TODO: Получить из шейпа надпись на кнопке
						return 'Button';
					}
				}
			}
		};
		CVMLDrawing.prototype.Write_ToBinary = function (writer) {
			AscFormat.writeString(writer, this.testString);

			// AscFormat.writeLong();
			// AscFormat.writeDouble();
			// AscFormat.writeBool();
			// AscFormat.writeString();
			// AscFormat.writeObject();
		};
		CVMLDrawing.prototype.Read_FromBinary = function (reader) {
			this.testString = AscFormat.readString(reader);

			// AscFormat.readLong();
			// AscFormat.readDouble();
			// AscFormat.readBool();
			// AscFormat.readString();
			// AscFormat.readObject();
		};

		AscDFH.drawingsConstructorsMap[AscDFH.historyitem_ShapeSetVmlDrawing] = CVMLDrawing;

		function CShapeLayout() {
			CBaseNoId.call(this);

			// Attributes
			this.m_oExt = null;

			// Children
			this.m_oIdMap = null;
			this.m_oRegroupTable = null;
			this.m_oRules = null;
		}

		IC(CShapeLayout, CBaseNoId, 0);

		function CShapeType() {
			CVmlCommonElements.call(this);

			// Attributes
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

			// Attributes
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
			// Объявлены как объект, но являются boolean:
			// m_oArrowOk, m_oExtrusionOk, m_oFillOk, m_oGradientShapeOk,
			// m_oInsetPenOk, m_oShadowOk, m_oStrokeOk m_oTextPathOk

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

			this.items = []

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

		function CDiv() {
			CBaseNoId.call(this);

			this.items = [];

			this.m_oStyle = null;
		}

		IC(CDiv, CBaseNoId, 0);

		function CFont() {
			CBaseNoId.call(this);

			// Attributes
			this.m_sFace = null;
			this.m_nSize = null;
			this.m_oColor = null;

			// Child
			this.m_sText = null;
		}

		IC(CFont, CBaseNoId, 0);

		function CFillVml() {
			CBaseNoId.call(this);

			// Attributes
			this.m_oAlignShape = null;
			this.m_sAltHref = null;
			this.m_oAngle = null;
			this.m_oAspect = null;
			this.m_oColor = null;
			this.m_oColor2 = null;
			this.m_arrColors = null;
			this.m_oDetectMouseClick = null;
			this.m_oFocus = null;
			this.m_oFocusPosition = null;
			this.m_oFocusSize = null;
			this.m_sHref = null;
			this.m_rId = null;
			this.m_sId = null;
			this.m_oMethod = null;
			this.m_oOn = null;
			this.m_oOpacity = null;
			this.m_oOpacity2 = null;
			this.m_oOrigin = null;
			this.m_oPosition = null;
			this.m_oRecolor = null;
			this.m_oRelId = null;
			this.m_oRotate = null;
			this.m_oSize = null;
			this.m_sSrc = null;
			this.m_sTitle = null;
			this.m_oType = null;

			// Children
			this.m_oFill = null;
		}

		IC(CFillVml, CBaseNoId, 0);

		CFillVml.prototype.isGradient = function () {
			return (this.m_oType === EFillType.filltypeGradient || this.m_oType === EFillType.filltypeGradientRadial);
		};
		CFillVml.prototype.getOOXMLFill = function (oContext, oFirstColor) {
			let oFill = null;
			if (this.isGradient()) {
				oFill = new AscFormat.CUniFill();
				let oGradFill = new AscFormat.CGradFill();
				oFill.fill = oGradFill;
				let oGs;
				let oStartColor = this.m_oColor || oFirstColor;
				if (oStartColor) {
					oGs = new AscFormat.CGs();
					oGs.setColor(oStartColor.getOOXMLColor());
					oGradFill.addColor(oGs);
				}
				if (this.m_oColor2) {

					oGs = new AscFormat.CGs();
					oGs.pos = 100000;
					oGs.setColor(this.m_oColor2.getOOXMLColor());
					oGradFill.addColor(oGs);
				}
				if (oGradFill.getColorsCount() === 1) {//Sindicatum.docx

					let oGs_ = new AscFormat.CGs();
					oGs_.setColor(AscFormat.CreateUniColorRGB(0xFF, 0xFF, 0xFF));
					if (oGs.pos === 0) {
						oGs_.pos = 100 * 1000;
					}
					oGradFill.addColor(oGs_);
				}
				if (this.m_oRotate === true) {
					oGradFill.rotateWithShape = true;
				}
				let nAngle = 90;
				let nFocus = 0;
				if (this.m_oAngle !== null) {
					nAngle = (-1) * this.m_oAngle + 90;
				}
				if (this.m_oFocus && this.m_oFocus.m_dValue) {
					nFocus = parseInt(this.m_oFocus / 100);
				}
				let oGradLin = new AscFormat.GradLin();
				oGradLin.angle = (nAngle * 60000 + 0.5) >> 0;
				oGradFill.lin = oGradLin;
			}
			else if (typeof this.m_rId === "string" && this.m_rId.length > 0) {
				oFill = new AscFormat.CreateBlipFillUniFillFromUrl("");

				AscFormat.fReadXmlRasterImageId(oContext.reader, this.m_rId, oFill.fill);
				if (EFillType.filltypeTile === this.m_oType || EFillType.filltypePattern) {
					oFill.fill.tile = new AscFormat.CBlipFillTile();
				}
				else {
					oFill.fill.stretch = true;
				}
			}
			else if (this.m_oColor) {
				return this.m_oColor.getOOXMLFill();
			}
			if (!oFill) {
				oFill = AscFormat.CreateSolidFillRGB(0xFF, 0xFF, 0xFF);
			}
			if (this.m_oOpacity !== null) {
				oFill.addAlpha(this.m_oOpacity);
			}
			return oFill;
		};

		function CVmlVector2D(sVal) {
			this.x = 0;
			this.y = 0;

			if (sVal) {
				this.fromString(sVal);
			}
		}

		CVmlVector2D.prototype.fromString = function (sValue) {
			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nPos = sValue.indexOf(",");
			let strX, strY;
			if (-1 === nPos) {//only x coord
				strX = sValue;
			} else {
				strX = sValue.substring(0, nPos);
				strY = sValue.substring(nPos + 1);
			}
			strY.replace("@", "");
			strX.replace("@", "");
			this.x = strX.length === 0 ? 0 : parseInt(strX);
			this.y = strY.length === 0 ? 0 : parseInt(strY);
			return 0;
		};
		CVmlVector2D.prototype.ToString = function () {
			return "" + this.x + "," + this.y;
		};

		function CColor(sVal) {
			this.type = EColorType.colortypeRGB;
			this.val = sVal;
			this.r = 0;
			this.g = 0;
			this.b = 0;
			if (sVal) {
				this.fromString(sVal);
			}
		}

		CColor.prototype.fromString = function (sVal) {
			this.val = sVal;
			if (sVal.charAt(0) === '#') {
				this.byHexColor(sVal)
			} else {
				this.byColorName(sVal);
			}
		};
		CColor.prototype.toString = function () {
			return this.val;
		};
		CColor.prototype.Get_R = function () {
			return this.r;
		};
		CColor.prototype.Get_G = function () {
			return this.g;
		};
		CColor.prototype.Get_B = function () {
			return this.b;
		};
		CColor.prototype.setRGB = function () {

			if (this.type === EColorType.colortypeRGB) return;

			switch (this.type) {
				case EColorType.colortypeAqua: {
					this.r = 0x00;
					this.g = 0xff;
					this.b = 0xff;
				}
					break;
				case EColorType.colortypeBlack: {
					this.r = 0x00;
					this.g = 0x00;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeBlue: {
					this.r = 0x00;
					this.g = 0x00;
					this.b = 0xff;
				}
					break;
				case EColorType.colortypeFuchsia: {
					this.r = 0xff;
					this.g = 0x00;
					this.b = 0xff;
				}
					break;
				case EColorType.colortypeGray: {
					this.r = 0x80;
					this.g = 0x80;
					this.b = 0x80;
				}
					break;
				case EColorType.colortypeGreen: {
					this.r = 0x00;
					this.g = 0x80;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeLime: {
					this.r = 0x00;
					this.g = 0xff;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeMaroon: {
					this.r = 0x80;
					this.g = 0x00;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeNavy: {
					this.r = 0x00;
					this.g = 0x00;
					this.b = 0x80;
				}
					break;
				case EColorType.colortypeOlive: {
					this.r = 0x80;
					this.g = 0x80;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypePurple: {
					this.r = 0x80;
					this.g = 0x00;
					this.b = 0x80;
				}
					break;
				case EColorType.colortypeRed: {
					this.r = 0xff;
					this.g = 0x00;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeSilver: {
					this.r = 0xc0;
					this.g = 0xc0;
					this.b = 0xc0;
				}
					break;
				case EColorType.colortypeTeal: {
					this.r = 0x00;
					this.g = 0x80;
					this.b = 0x80;
				}
					break;
				case EColorType.colortypeWhite: {
					this.r = 0xff;
					this.g = 0xff;
					this.b = 0xff;
				}
					break;
				case EColorType.colortypeYellow: {
					this.r = 0xff;
					this.g = 0xff;
					this.b = 0;
				}
					break;
				case EColorType.colortypeNone:
				default: {
					this.r = 0;
					this.g = 0;
					this.b = 0;
				}
					break;
			}
		};
		CColor.prototype.byHexColor = function (sVal) {
			this.type = EColorType.colortypeRGB;
			let oRGBA = AscCommon.RgbaHexToRGBA(sVal);
			this.r = oRGBA.R;
			this.g = oRGBA.G;
			this.b = oRGBA.B;
		};
		CColor.prototype.byColorName = function (sVal) {
			this.type = EColorType.colortypeNone;

			if (sVal.indexOf("aqua") > -1) this.type = EColorType.colortypeAqua;
			else if (sVal.indexOf("black") > -1) this.type = EColorType.colortypeBlack;
			else if (sVal.indexOf("blue") > -1) this.type = EColorType.colortypeBlue;
			else if (sVal.indexOf("fuchsia") > -1) this.type = EColorType.colortypeFuchsia;
			else if (sVal.indexOf("gray") > -1) this.type = EColorType.colortypeGray;
			else if (sVal.indexOf("green") > -1) this.type = EColorType.colortypeGreen;
			else if (sVal.indexOf("lime") > -1) this.type = EColorType.colortypeLime;
			else if (sVal.indexOf("maroon") > -1) this.type = EColorType.colortypeMaroon;
			else if (sVal.indexOf("navy") > -1) this.type = EColorType.colortypeNavy;
			else if (sVal.indexOf("olive") > -1) this.type = EColorType.colortypeOlive;
			else if (sVal.indexOf("purple") > -1) this.type = EColorType.colortypePurple;
			else if (sVal.indexOf("red") > -1) this.type = EColorType.colortypeRed;
			else if (sVal.indexOf("silver") > -1) this.type = EColorType.colortypeSilver;
			else if (sVal.indexOf("teal") > -1) this.type = EColorType.colortypeTeal;
			else if (sVal.indexOf("white") > -1) this.type = EColorType.colortypeWhite;
			else if (sVal.indexOf("yellow") > -1) this.type = EColorType.colortypeYellow;
			else if (sVal.indexOf("fill") > -1) {
				this.type = EColorType.colortypeRGB;

				let sColorEffect = sVal;
				let sColor = sVal;
				if (sColorEffect.length > 5)
					sColorEffect = sColorEffect.substring(5);

				let resR, resG, resB;

				resR = this.r;
				resG = this.g;
				resB = this.b;

				let param = 0;
				let pos1 = sColor.indexOf('(');
				let pos2 = sColor.indexOf(')');
				if (pos1 === -1 || pos2 === -1)
					return;
				if (pos2 < (pos1 + 2))
					return;

				let s = sColor.substring(pos1 + 1, pos2);
				param = parseInt(s);
				let isEffect = false;

				if (0 === sColorEffect.indexOf("darken")) {
					resR = (this.r * param / 255);
					resG = (this.g * param / 255);
					resB = (this.b * param / 255);
					isEffect = true;
				}
				else if (0 === sColorEffect.indexOf("lighten")) {
					resR = 255 - ((255 - this.r) * param / 255);
					resG = 255 - ((255 - this.g) * param / 255);
					resB = 255 - ((255 - this.b) * param / 255);
					isEffect = true;
				}
				else if (0 === sColorEffect.indexOf("add")) {
					resR = this.r + param;
					resG = this.g + param;
					resB = this.b + param;
					isEffect = true;
				}
				else if (0 === sColorEffect.indexOf("subtract")) {
					resR = this.r - param;
					resG = this.g - param;
					resB = this.b - param;
					isEffect = true;
				}
				else if (0 === sColorEffect.indexOf("reversesubtract")) {
					resR = param - this.r;
					resG = param - this.g;
					resB = param - this.b;
					isEffect = true;
				}
				else if (0 === sColorEffect.indexOf("blackwhite")) {
					resR = (this.r < param) ? 0 : 255;
					resG = (this.g < param) ? 0 : 255;
					resB = (this.b < param) ? 0 : 255;
					isEffect = true;
				}

				if (isEffect) {
					resR = (resR < 0) ? 0 : resR;
					resR = (resR > 255) ? 255 : resR;

					resG = (resG < 0) ? 0 : resG;
					resG = (resG > 255) ? 255 : resG;

					resB = (resB < 0) ? 0 : resB;
					resB = (resB > 255) ? 255 : resB;
				}
				this.r = resR;
				this.g = resG;
				this.b = resB;
			}
			else if (sVal.indexOf("[") > -1 && sVal.indexOf("]") > -1) {
				let p1 = sVal.indexOf("[");
				let p2 = sVal.indexOf("]");
				let sIndex = p2 > p1 ? sVal.substring(p1 + 1, p2) : "";

				if (sIndex.length > 0) {
					let index = parseInt(sIndex);
					let nRGB = 0;
					if (index < 64) {
						nRGB = shemeDefaultColor[index];
					} else if (index > 64 && index < 92) {
						nRGB = controlPanelColors1[index - 65];
					}
					this.r = ((nRGB >> 16) & 0xff);
					this.g = ((nRGB >> 8) & 0xff);
					this.b = (nRGB & 0xff);
					this.type = EColorType.colortypeRGB;
				}
			}
			this.setRGB();
		};
		CColor.prototype.getOOXMLColor = function () {
			return AscFormat.CreateUniColorRGB(this.r, this.g, this.b);
			//todo: fill
			// if (sColor2->find("fill") != -1)
			// {
			// 	std::wstring sColorEffect = *sColor2;
			// 	if (sColorEffect.length() > 5)
			// 		sColorEffect = sColorEffect.substr(5);
			//
			// 	int resR, resG, resB;
			// 	GetColorWithEffect(sColorEffect, R, G, B, resR, resG, resB);
			//
			// 	Gs_.color.Color->SetRGB(resR, resG, resB);
		};
		CColor.prototype.getOOXMLFill = function () {
			return AscFormat.CreateUniFillByUniColor(this.getOOXMLColor());
		};

		function CCssStyle(sValue) {
			this.m_arrProperties = [];
			this.m_sCss = null;
			if (sValue) {
				this.FromString(sValue);
			}
		}

		CCssStyle.prototype.Clear = function () {
			this.m_arrProperties.length = 0;
		}
		CCssStyle.prototype.FromString = function (sValue) {
			this.Clear();

			let sValue_ = CorrectXmlString2(sValue);
			this.m_sCss = sValue_;
			this.ParseProperties();

			return this.m_sCss;
		};
		CCssStyle.prototype.ToString = function () {
			return this.m_sCss;
		};
		CCssStyle.prototype.ParseProperties = function () {
			let sTemp = this.m_sCss;
			while (sTemp.length > 0) {
				let nPos = sTemp.indexOf(';');
				if (-1 === nPos) {
					let oProperty = new CCssProperty(sTemp);
					this.m_arrProperties.push(oProperty);
					sTemp = "";
				} else {
					let oProperty = new CCssProperty(sTemp.substring(0, nPos));
					this.m_arrProperties.push(oProperty);
					sTemp = sTemp.substring(nPos + 1);
				}
			}
			return true;
		};
		CCssStyle.prototype.GetProperty = function (nType) {
			for (let nPr = 0; nPr < this.m_arrProperties.length; ++nPr) {
				if (this.m_arrProperties[nPr].m_eType === nType) {
					return this.m_arrProperties[nPr];
				}
			}
			return null;
		};
		CCssStyle.prototype.GetPropertyByStringType = function (sType) {
			for (let nPr = 0; nPr < this.m_arrProperties.length; ++nPr) {
				if (this.m_arrProperties[nPr].m_sType === sType) {
					return this.m_arrProperties[nPr];
				}
			}
			return null;
		};
		CCssStyle.prototype.GetPropertyValueString = function (sType) {
			let oPr = this.GetPropertyByStringType(sType);
			if (oPr) {
				return oPr.m_sValue;
			}
			return null;
		};
		CCssStyle.prototype.GetZIndex = function () {
			let oPr = this.GetProperty(ECssPropertyType.cssptZIndex);
			if (oPr === null) {
				return null;
			}

			let oZIndex = oPr && oPr.m_oValue && oPr.m_oValue.oZIndex;
			if (oZIndex && oZIndex && AscFormat.isRealNumber(oZIndex.nOrder)) {
				return oZIndex.nOrder;
			}
		};
		CCssStyle.prototype.GetNumberValueInMM = function (nType) {
			let dNumVal = this.GetNumberValue(nType)
			if (AscFormat.isRealNumber(dNumVal)) {
				return Pt_To_Mm(dNumVal / 36000);
			}
			return null;
		};
		CCssStyle.prototype.GetNumberValue = function (nType) {
			let oPr = this.GetProperty(nType);
			if (oPr === null) {
				return null;
			}
			let oValue = oPr && oPr.m_oValue && oPr.m_oValue.oValue;
			if (oValue && AscFormat.isRealNumber(oValue.dValue)) {
				return oValue.dValue;
			}
			return null;
		};
		CCssStyle.prototype.GetStringValue = function (nType) {
			let oPr = this.GetProperty(nType);
			if (oPr === null) {
				return null;
			}
			let oValue = oPr && oPr.m_oValue;
			if (oValue && oValue.wsValue) {
				return oValue.wsValue;
			}
			return null;
		};
		CCssStyle.prototype.GetMarginLeftInMM = function () {
			return this.GetNumberValueInMM(ECssPropertyType.cssptMarginLeft);
		};
		CCssStyle.prototype.GetMarginTopInMM = function () {
			return this.GetNumberValueInMM(ECssPropertyType.cssptMarginTop);
		};
		CCssStyle.prototype.GetMarginRightInMM = function () {
			return this.GetNumberValueInMM(ECssPropertyType.cssptMarginRight);
		};
		CCssStyle.prototype.GetMarginBottomInMM = function () {
			return this.GetNumberValueInMM(ECssPropertyType.cssptMarginBottom);
		};
		CCssStyle.prototype.GetLeftInMM = function () {
			return this.GetNumberValueInMM(ECssPropertyType.cssptLeft);
		};
		CCssStyle.prototype.GetTopInMM = function () {
			return this.GetNumberValueInMM(ECssPropertyType.cssptTop);
		};
		CCssStyle.prototype.GetWidthInMM = function () {
			return this.GetNumberValueInMM(ECssPropertyType.cssptWidth);
		};
		CCssStyle.prototype.GetHeightInMM = function () {
			return this.GetNumberValueInMM(ECssPropertyType.cssptHeight);
		};
		CCssStyle.prototype.GetFontStyle = function () {
			return this.GetStringValue(ECssPropertyType.cssptFont);
		};

		function CCssProperty(sBuffer) {
			this.m_eType = ECssPropertyType.cssptUnknown;
			this.m_oValue = new UCssValue();
			this.m_sType = "unknown";
			this.m_sValue = "";
			if (sBuffer) {
				this.Parse(sBuffer);
			}
		}

		CCssProperty.prototype.get_Value = function () {
			return this.m_oValue;
		}
		CCssProperty.prototype.get_Type = function () {
			return this.m_eType;
		}
		CCssProperty.prototype.Parse = function (sBuffer) {
			let nPos = sBuffer.indexOf(':');
			let sValue;

			if (-1 === nPos) {
				this.m_eType = ECssPropertyType.cssptUnknown;
			} else {
				let sProperty = sBuffer.substring(0, nPos);
				sValue = sBuffer.substring(nPos + 1);

				sProperty = sProperty.replace(/\s/g, "");

				if (sProperty.length <= 2) {
					this.m_eType = ECssPropertyType.cssptUnknown;
					return;
				}
				this.m_sType = sProperty;
				this.m_sValue = sValue;

				if ("direction" === sProperty) this.m_eType = ECssPropertyType.cssptDirection;
				else if ("flip" === sProperty) this.m_eType = ECssPropertyType.cssptFlip;
				else if ("font" === sProperty) this.m_eType = ECssPropertyType.cssptFont;
				else if ("font-family" === sProperty) this.m_eType = ECssPropertyType.cssptFontFamily;
				else if ("font-size" === sProperty) this.m_eType = ECssPropertyType.cssptFontSize;
				else if ("font-style" === sProperty) this.m_eType = ECssPropertyType.cssptFontStyle;
				else if ("font-variant" === sProperty) this.m_eType = ECssPropertyType.cssptFontVariant;
				else if ("font-weight" === sProperty) this.m_eType = ECssPropertyType.cssptFontWeight;
				else if ("height" === sProperty) this.m_eType = ECssPropertyType.cssptHeight;
				else if ("layout-flow" === sProperty) this.m_eType = ECssPropertyType.cssptLayoutFlow;
				else if ("left" === sProperty) this.m_eType = ECssPropertyType.cssptLeft;
				else if ("margin-bottom" === sProperty) this.m_eType = ECssPropertyType.cssptMarginBottom;
				else if ("margin-left" === sProperty) this.m_eType = ECssPropertyType.cssptMarginLeft;
				else if ("margin-right" === sProperty) this.m_eType = ECssPropertyType.cssptMarginRight;
				else if ("margin-top" === sProperty) this.m_eType = ECssPropertyType.cssptMarginTop;
				else if ("mso-direction-alt" === sProperty) this.m_eType = ECssPropertyType.cssptMsoDirectionAlt;
				else if ("mso-fit-shape-to-text" === sProperty) this.m_eType = ECssPropertyType.cssptMsoFitShapeToText;
				else if ("mso-fit-text-to-shape" === sProperty) this.m_eType = ECssPropertyType.cssptMsoFitTextToShape;
				else if ("mso-layout-flow-alt" === sProperty) this.m_eType = ECssPropertyType.cssptMsoLayoutFlowAlt;
				else if ("mso-next-textbox" === sProperty) this.m_eType = ECssPropertyType.cssptMsoNextTextbox;
				else if ("mso-position-horizontal" === sProperty) this.m_eType = ECssPropertyType.cssptMsoPositionHorizontal;
				else if ("mso-position-horizontal-relative" === sProperty) this.m_eType = ECssPropertyType.cssptMsoPositionHorizontalRelative;
				else if ("mso-position-vertical" === sProperty) this.m_eType = ECssPropertyType.cssptMsoPositionVertical;
				else if ("mso-position-vertical-relative" === sProperty) this.m_eType = ECssPropertyType.cssptMsoPositionVerticalRelative;
				else if ("mso-rotate" === sProperty) this.m_eType = ECssPropertyType.cssptMsoRotate;
				else if ("mso-text-scale" === sProperty) this.m_eType = ECssPropertyType.cssptMsoTextScale;
				else if ("mso-text-shadow" === sProperty) this.m_eType = ECssPropertyType.cssptMsoTextShadow;
				else if ("mso-wrap-distance-bottom" === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapDistanceBottom;
				else if ("mso-wrap-distance-left" === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapDistanceLeft;
				else if ("mso-wrap-distance-right" === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapDistanceRight;
				else if ("mso-wrap-distance-top" === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapDistanceTop;
				else if ("mso-wrap-edited" === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapEdited;
				else if ("mso-wrap-style" === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapStyle;
				else if ("mso-height-percent" === sProperty) this.m_eType = ECssPropertyType.csspctMsoHeightPercent;
				else if ("mso-width-percent" === sProperty) this.m_eType = ECssPropertyType.csspctMsoWidthPercent;
				else if ("position" === sProperty) this.m_eType = ECssPropertyType.cssptPosition;
				else if ("rotation" === sProperty) this.m_eType = ECssPropertyType.cssptRotation;
				else if ("text-decoration" === sProperty) this.m_eType = ECssPropertyType.cssptTextDecoration;
				else if ("top" === sProperty) this.m_eType = ECssPropertyType.cssptTop;
				else if ("text-align" === sProperty) this.m_eType = ECssPropertyType.cssptHTextAlign;
				else if ("visibility" === sProperty) this.m_eType = ECssPropertyType.cssptVisibility;
				else if ("v-rotate-letters" === sProperty) this.m_eType = ECssPropertyType.cssptVRotateLetters;
				else if ("v-same-letter-heights" === sProperty) this.m_eType = ECssPropertyType.cssptVSameLetterHeights;
				else if ("v-text-align" === sProperty) this.m_eType = ECssPropertyType.cssptVTextAlign;
				else if ("v-text-anchor" === sProperty) this.m_eType = ECssPropertyType.cssptVTextAnchor;
				else if ("v-text-kern" === sProperty) this.m_eType = ECssPropertyType.cssptVTextKern;
				else if ("v-text-reverse" === sProperty) this.m_eType = ECssPropertyType.cssptVTextReverse;
				else if ("v-text-spacing-mode" === sProperty) this.m_eType = ECssPropertyType.cssptVTextSpacingMode;
				else if ("v-text-spacing" === sProperty) this.m_eType = ECssPropertyType.cssptVTextSpacing;
				else if ("width" === sProperty) this.m_eType = ECssPropertyType.cssptWidth;
				else if ("z-index" === sProperty) this.m_eType = ECssPropertyType.cssptZIndex;

				switch (this.m_eType) {
					case ECssPropertyType.cssptUnknown:
						this.ReadValue_Unknown(sValue);
						break;
					case ECssPropertyType.cssptFlip:
						this.ReadValue_Flip(sValue);
						break;
					case ECssPropertyType.cssptHeight:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptLeft:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptMarginBottom:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptMarginLeft:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptMarginRight:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptMarginTop:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptMsoPositionHorizontal:
						this.ReadValue_MsoPosHor(sValue);
						break;
					case ECssPropertyType.cssptMsoPositionHorizontalRelative:
						this.ReadValue_MsoPosHorRel(sValue);
						break;
					case ECssPropertyType.cssptMsoPositionVertical:
						this.ReadValue_MsoPosVer(sValue);
						break;
					case ECssPropertyType.cssptMsoPositionVerticalRelative:
						this.ReadValue_MsoPosVerRel(sValue);
						break;
					case ECssPropertyType.cssptMsoWrapDistanceBottom:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptMsoWrapDistanceLeft:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptMsoWrapDistanceRight:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptMsoWrapDistanceTop:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptMsoWrapEdited:
						this.ReadValue_Boolean(sValue);
						break;
					case ECssPropertyType.cssptMsoWrapStyle:
						this.ReadValue_MsoWrapStyle(sValue);
						break;
					case ECssPropertyType.cssptPosition:
						this.ReadValue_Position(sValue);
						break;
					case ECssPropertyType.cssptRotation:
						this.ReadValue_Rotation(sValue);
						break;
					case ECssPropertyType.cssptTop:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptVisibility:
						this.ReadValue_Visibility(sValue);
						break;
					case ECssPropertyType.cssptWidth:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptZIndex:
						this.ReadValue_ZIndex(sValue);
						break;

					case ECssPropertyType.cssptDirection:
						this.ReadValue_Direction(sValue);
						break;
					case ECssPropertyType.cssptLayoutFlow:
						this.ReadValue_LayoutFlow(sValue);
						break;
					case ECssPropertyType.cssptMsoDirectionAlt:
						this.ReadValue_DirectionAlt(sValue);
						break;
					case ECssPropertyType.cssptMsoFitShapeToText:
						this.ReadValue_Boolean(sValue);
						break;
					case ECssPropertyType.cssptMsoFitTextToShape:
						this.ReadValue_Boolean(sValue);
						break;
					case ECssPropertyType.cssptMsoLayoutFlowAlt:
						this.ReadValue_LayoutFlowAlt(sValue);
						break;
					case ECssPropertyType.cssptMsoNextTextbox:
						this.ReadValue_String(sValue);
						break;
					case ECssPropertyType.cssptMsoRotate:
						this.ReadValue_MsoRotate(sValue);
						break;
					case ECssPropertyType.cssptMsoTextScale:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptVTextAnchor:
						this.ReadValue_VTextAnchor(sValue);
						break;

					case ECssPropertyType.cssptFont:
						this.ReadValue_String(sValue);
						break;
					case ECssPropertyType.cssptFontFamily:
						this.ReadValue_String(sValue);
						break;
					case ECssPropertyType.cssptFontSize:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptFontStyle:
						this.ReadValue_FontStyle(sValue);
						break;
					case ECssPropertyType.cssptFontVariant:
						this.ReadValue_FontVariant(sValue);
						break;
					case ECssPropertyType.cssptFontWeight:
						this.ReadValue_FontWeight(sValue);
						break;
					case ECssPropertyType.cssptMsoTextShadow:
						this.ReadValue_Boolean(sValue);
						break;
					case ECssPropertyType.cssptTextDecoration:
						this.ReadValue_TextDecoration(sValue);
						break;
					case ECssPropertyType.cssptVRotateLetters:
						this.ReadValue_Boolean(sValue);
						break;
					case ECssPropertyType.cssptVSameLetterHeights:
						this.ReadValue_Boolean(sValue);
						break;
					case ECssPropertyType.cssptVTextAlign:
						this.ReadValue_VTextAlign(sValue);
						break;
					case ECssPropertyType.cssptVTextKern:
						this.ReadValue_Boolean(sValue);
						break;
					case ECssPropertyType.cssptVTextReverse:
						this.ReadValue_Boolean(sValue);
						break;
					case ECssPropertyType.cssptVTextSpacingMode:
						this.ReadValue_VTextSpacingMode(sValue);
						break;
					case ECssPropertyType.cssptVTextSpacing:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.csspctMsoWidthPercent:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.csspctMsoHeightPercent:
						this.ReadValue_Units(sValue);
						break;
					case ECssPropertyType.cssptHTextAlign:
						this.ReadValue_VTextAlign(sValue);
						break;
				}
			}
		};
		CCssProperty.prototype.ReadValue_Unknown = function (sValue) {

		};
		CCssProperty.prototype.ReadValue_Flip = function (sValue) {
			if ("x" === sValue) this.m_oValue.eFlip = ECssFlip.cssflipX;
			else if ("y" === sValue) this.m_oValue.eFlip = ECssFlip.cssflipY;
			else if ("xy" === sValue) this.m_oValue.eFlip = ECssFlip.cssflipXY;
			else if ("yx" === sValue) this.m_oValue.eFlip = ECssFlip.cssflipYX;
			else
				this.m_eType = ECssPropertyType.cssptUnknown;
		};
		CCssProperty.prototype.ReadValue_Units = function (sValue) {
			let nPos;
			if (-1 !== (nPos = sValue.indexOf("auto"))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeAuto;
			} else if (-1 !== (nPos = sValue.indexOf("in"))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substring(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = Inch_To_Pt(dValue);
			} else if (-1 !== (nPos = sValue.indexOf("cm"))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substring(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = Cm_To_Pt(dValue);
			} else if (-1 !== (nPos = sValue.indexOf("mm"))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substring(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = Mm_To_Pt(dValue);
			} else if (-1 !== (nPos = sValue.indexOf("em"))) {
			} else if (-1 !== (nPos = sValue.indexOf("ex"))) {
			} else if (-1 !== (nPos = sValue.indexOf("pt"))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substring(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = dValue;
			} else if (-1 !== (nPos = sValue.indexOf("pc"))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substring(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = dValue * 12;
			} else if (-1 !== (nPos = sValue.indexOf("%"))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypePerc;

				let strValue = sValue.substring(0, nPos);
				this.m_oValue.oValue.dValue = strValue.length === 0 ? 0 : parseFloat(strValue);
			} else if (-1 !== (nPos = sValue.indexOf("px"))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substring(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = Px_To_Pt(dValue);
			} else {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeAbsolute;
				this.m_oValue.oValue.dValue = parseFloat(sValue);
			}
		};
		CCssProperty.prototype.ReadValue_MsoPosHor = function (sValue) {
			if ("absolute" === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorAbsolute;
			else if ("left" === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorLeft;
			else if ("center" === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorCenter;
			else if ("right" === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorRight;
			else if ("inside" === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorInside;
			else if ("outside" === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorOutside;
			else
				this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorAbsolute;
		};
		CCssProperty.prototype.ReadValue_MsoPosHorRel = function (sValue) {
			if ("left-margin-area" === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelLeftMargin;
			else if ("right-margin-area" === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelRightMargin;
			else if ("margin" === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelMargin;
			else if ("page" === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelPage;
			else if ("text" === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelText;
			else if ("char" === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelChar;
			else
				this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelText;
		};
		CCssProperty.prototype.ReadValue_MsoPosVer = function (sValue) {
			if ("absolute" === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverAbsolute;
			else if ("top" === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverTop;
			else if ("center" === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverCenter;
			else if ("bottom" === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverBottom;
			else if ("inside" === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverInside;
			else if ("outside" === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverOutside;
			else
				this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverAbsolute;
		};
		CCssProperty.prototype.ReadValue_MsoPosVerRel = function (sValue) {
			if ("bottom-margin-area" === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelBottomMargin;
			else if ("top-margin-area" === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelTopMargin;
			else if ("margin" === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelMargin;
			else if ("page" === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelPage;
			else if ("text" === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelText;
			else if ("line" === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelLine;
			else
				this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelText;
		};
		CCssProperty.prototype.ReadValue_Rotation = function (sValue) {
			this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeAbsolute;
			this.m_oValue.oValue.dValue = sValue.length === 0 ? 0 : parseFloat(sValue);

			if (sValue.indexOf("fd") !== -1) {
				this.m_oValue.oValue.dValue /= 6000.;
			} else if (sValue.endsWith("f")) {
				this.m_oValue.oValue.dValue /= 65536.;
			}
		};
		CCssProperty.prototype.ReadValue_Boolean = function (sValue) {
			if ("true" === sValue || "t" === sValue || "1" === sValue)
				this.m_oValue.bValue = true;
			else
				this.m_oValue.bValue = false;
		};
		CCssProperty.prototype.ReadValue_MsoWrapStyle = function (sValue) {
			if ("square" === sValue) this.m_oValue.eMsoWrapStyle = ECssMsoWrapStyle.cssmsowrapstyleSqaure;
			else if ("none" === sValue) this.m_oValue.eMsoWrapStyle = ECssMsoWrapStyle.cssmsowrapstyleNone;
			else
				this.m_oValue.eMsoWrapStyle = ECssMsoWrapStyle.cssmsowrapstyleSqaure;
		};
		CCssProperty.prototype.ReadValue_Position = function (sValue) {
			if ("static" === sValue) this.m_oValue.ePosition = ECssPosition.csspositionStatic;
			else if ("absolute" === sValue) this.m_oValue.ePosition = ECssPosition.csspositionAbsolute;
			else if ("relative" === sValue) this.m_oValue.ePosition = ECssPosition.csspositionRelative;
			else
				this.m_oValue.ePosition = ECssPosition.csspositionAbsolute;
		};
		CCssProperty.prototype.ReadValue_Visibility = function (sValue) {
			if ("hidden" === sValue) this.m_oValue.eVisibility = ECssVisibility.cssvisibilityHidden;
			else if ("inherit" === sValue) this.m_oValue.eVisibility = ECssVisibility.cssvisibilityInherit;
			else
				this.m_oValue.eVisibility = ECssVisibility.cssvisibilityInherit;
		};
		CCssProperty.prototype.ReadValue_ZIndex = function (sValue) {
			if ("auto" === sValue) this.m_oValue.oZIndex.m_eType = ECssZIndexType.csszindextypeAuto;
			else {
				this.m_oValue.oZIndex.m_eType = ECssZIndexType.csszindextypeOrder;
				this.m_oValue.oZIndex.nOrder = parseInt(sValue);

			}
		};
		CCssProperty.prototype.ReadValue_Direction = function (sValue) {
			if ("ltr" === sValue) this.m_oValue.eDirection = ECssDirection.cssdirectionLTR;
			else if ("rtl" === sValue) this.m_oValue.eDirection = ECssDirection.cssdirectionRTL;
			else
				this.m_oValue.eDirection = ECssDirection.cssdirectionLTR;
		};
		CCssProperty.prototype.ReadValue_LayoutFlow = function (sValue) {
			if ("horizontal" === sValue) this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowHorizontal;
			else if ("vertical" === sValue) this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowVertical;
			else if ("vertical-ideographic" === sValue) this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowVerticalIdeographic;
			else if ("horizontal-ideographic" === sValue) this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowHorizontalIdeographic;
			else
				this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowHorizontal;
		};
		CCssProperty.prototype.ReadValue_DirectionAlt = function (sValue) {
			this.m_oValue.eDirectionAlt = ECssDirectionAlt.cssdirectionaltContext;
		};
		CCssProperty.prototype.ReadValue_LayoutFlowAlt = function (sValue) {
			this.m_oValue.eLayoutFlowAlt = ECssLayoutFlowAlt.csslayoutflowaltBottomToTop;
		};
		CCssProperty.prototype.ReadValue_String = function (sValue) {
			this.m_oValue.wsValue = sValue;
		};
		CCssProperty.prototype.ReadValue_MsoRotate = function (sValue) {
			if ("0" === sValue) this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate0;
			else if ("90" === sValue) this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate90;
			else if ("180" === sValue) this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate180;
			else if ("-90" === sValue) this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate270;
			else
				this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate0;
		};
		CCssProperty.prototype.ReadValue_VTextAnchor = function (sValue) {
			if ("top" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTop;
			else if ("middle" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorMiddle;
			else if ("bottom" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorBottom;
			else if ("top-center" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTopCenter;
			else if ("middle-center" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorMiddleCenter;
			else if ("bottom-center" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorBottomCenter;
			else if ("top-baseline" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTopBaseline;
			else if ("bottom-baseline" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorBottomBaseline;
			else if ("top-center-baseline" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTopCenterBaseline;
			else if ("bottom-center-baseline" === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorBottomCenterBaseline;
			else
				this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTop;
		};
		CCssProperty.prototype.ReadValue_FontStyle = function (sValue) {
			if ("normal" === sValue) this.m_oValue.eFontStyle = ECssFontStyle.cssfontstyleNormal;
			else if ("italic" === sValue) this.m_oValue.eFontStyle = ECssFontStyle.cssfontstyleItalic;
			else if ("oblique" === sValue) this.m_oValue.eFontStyle = ECssFontStyle.cssfontstyleOblique;
			else
				this.m_oValue.eFontStyle = ECssFontStyle.cssfontstyleNormal;
		};
		CCssProperty.prototype.ReadValue_FontVariant = function (sValue) {
			if ("normal" === sValue) this.m_oValue.eFontVariant = ECssFontVarian.cssfontvariantNormal;
			else if ("small-caps" === sValue) this.m_oValue.eFontVariant = ECssFontVarian.cssfontvariantSmallCaps;
			else
				this.m_oValue.eFontVariant = ECssFontVarian.cssfontvariantNormal;
		};
		CCssProperty.prototype.ReadValue_FontWeight = function (sValue) {
			if ("normal" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightNormal;
			else if ("lighter" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightLighter;
			else if ("100" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight100;
			else if ("200" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight200;
			else if ("300" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight300;
			else if ("400" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight400;
			else if ("bold" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightBold;
			else if ("bolder" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightBolder;
			else if ("500" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight500;
			else if ("600" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight600;
			else if ("700" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight700;
			else if ("800" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight800;
			else if ("900" === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight900;
			else
				this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightNormal;
		};
		CCssProperty.prototype.ReadValue_TextDecoration = function (sValue) {
			if ("none" === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationNone;
			else if ("underline" === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationUnderline;
			else if ("overline" === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationOverline;
			else if ("line-through" === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationLineThrough;
			else if ("blink" === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationBlink;
			else
				this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationNone;
		};
		CCssProperty.prototype.ReadValue_VTextAlign = function (sValue) {
			if ("left" === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignLeft;
			else if ("right" === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignRight;
			else if ("center" === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignCenter;
			else if ("justify" === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignJustify;
			else if ("letter-justify" === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignLetterJustify;
			else if ("stretch-justify" === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignStretchJustify;
			else
				this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignLeft;
		};
		CCssProperty.prototype.ReadValue_VTextSpacingMode = function (sValue) {
			if ("tightening" === sValue) this.m_oValue.eVTextSpacingMode = ECssVTextSpacingMode.cssvtextspacingmodeTightening;
			else if ("tracking" === sValue) this.m_oValue.eVTextSpacingMode = ECssVTextSpacingMode.cssvtextspacingmodeTracking;
			else
				this.m_oValue.eVTextSpacingMode = ECssVTextSpacingMode.cssvtextspacingmodeTightening;
		};

		function UCssValue() {
			this.eFlip = null;
			this.oValue = new TCssUnitsValue();
			this.eMsoPosHor = null;
			this.eMsoPosHorRel = null;
			this.eMsoPosVer = null;
			this.eMsoPosVerRel = null;
			this.bValue = null;
			this.eMsoWrapStyle = null;
			this.ePosition = null;
			this.eVisibility = null;
			this.oZIndex = new TCssZIndexValue();
			this.eDirection = null;
			this.eLayoutFlow = null;
			this.eDirectionAlt = null;
			this.eLayoutFlowAlt = null;
			this.wsValue = null;
			this.eRotate = null;
			this.eVTextAnchor = null;
			this.eFontStyle = null;
			this.eFontVariant = null;
			this.eFontWeight = null;
			this.eTextDecoration = null;
			this.eVTextAlign = null;
			this.eVTextSpacingMode = null;
			this.eHTextAlign = null;
		}

		function TCssUnitsValue() {
			this.eType = null;
			this.dValue = null;
		}

		function TCssZIndexValue() {
			this.eType = null;
			this.nOrder = null;
		}


		/* Exports */
		window['AscFormat'].CVMLDrawing = CVMLDrawing;
		window['AscFormat'].CVMLClientData = CClientData;
	}
)(window);
