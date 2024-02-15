/*
 * (c) Copyright Ascensio System SIA 2010-2019
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
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
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


		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var asc = window["Asc"];
		var asc_debug   = asc.outputDebugStr;
		var asc_typeof  = asc.typeOf;
		var asc_round   = asc.round;

		function LineInfo(lm) {
			this.tw = 0;
			this.th = 0;
			this.bl = 0;
			this.a = 0;
			this.d = 0;
			this.beg = undefined;
			this.end = undefined;
			this.startX = undefined;

			this.assign(lm);
		}
		LineInfo.prototype.assign = function (lm) {
			if (lm) {
				this.th = lm.th;
				this.bl = lm.bl;
				this.a = lm.a;
				this.d = lm.d;
			}
		};

		/** @constructor */
		function lineMetrics() {
			this.th = 0;
			this.bl = 0;
			this.bl2 = 0;
			this.a = 0;
			this.d = 0;
		}
		lineMetrics.prototype.clone = function () {
			var oRes = new lineMetrics();
			oRes.th = this.th;
			oRes.bl = this.bl;
			oRes.bl2 = this.bl2;
			oRes.a = this.a;
			oRes.d = this.d;
			return oRes;
		};

		/** @constructor */
		function charProperties() {
			this.c = undefined;
			this.lm = undefined;
			this.fm = undefined;
			this.fsz = undefined;
			this.font = undefined;
			this.va = undefined;
			this.nl = undefined;
			this.hp = undefined;
			this.delta = undefined;
			this.skip = undefined;
			this.repeat = undefined;
			this.total = undefined;
			this.wrd = undefined;
		}
		charProperties.prototype.clone = function () {
			var oRes = new charProperties();
			oRes.c = (undefined !== this.c) ? this.c.clone() : undefined;
			oRes.lm = (undefined !== this.lm) ? this.lm.clone() : undefined;
			oRes.fm = (undefined !== this.fm) ? this.fm.clone() : undefined;
			oRes.fsz = (undefined !== this.fsz) ? this.fsz.clone() : undefined;
			oRes.font = (undefined !== this.font) ? this.font.clone() : undefined;
			oRes.va = this.va;
			oRes.nl = this.nl;
			oRes.hp = this.hp;
			oRes.delta = this.delta;
			oRes.skip = this.skip;
			oRes.repeat = this.repeat;
			oRes.total = this.total;
			oRes.wrd = this.wrd;
			return oRes;
		};


		/**
		 * Formatted text render
		 * -----------------------------------------------------------------------------
		 * @constructor
		 * @param {DrawingContext} drawingCtx  Context for drawing on
		 *
		 * @memberOf Asc
		 */
		function StringRender(drawingCtx) {
			this.drawingCtx = drawingCtx;

			/** @type Array */
			this.fragments = undefined;

			/** @type Object */
			this.flags = undefined;

			/** @type String */
			this.chars = [];

			this.charProps = [];
            this.angle = 0;

            this.fontNeedUpdate = false;


			this.codesNL = {0xD: 1, 0xA: 1};

			this.codesSpace = {
				0xA: 1,
				0xD: 1,
				0x2028: 1,
				0x2029: 1,
				0x9: 1,
				0xB: 1,
				0xC: 1,
				0x0020: 1,
				0x2000: 1,
				0x2001: 1,
				0x2002: 1,
				0x2003: 1,
				0x2004: 1,
				0x2005: 1,
				0x2006: 1,
				0x2008: 1,
				0x2009: 1,
				0x200A: 1,
				0x200B: 1,
				0x205F: 1,
				0x3000: 1
			};

			this.codesReplaceNL = {};

			this.codesHypNL = {
				0xA: 1, 0xD: 1, 0x2028: 1, 0x2029: 1
			};

			this.codesHypSp = {
				0x9: 1,
				0xB: 1,
				0xC: 1,
				0x0020: 1,
				0x2000: 1,
				0x2001: 1,
				0x2002: 1,
				0x2003: 1,
				0x2004: 1,
				0x2005: 1,
				0x2006: 1,
				0x2008: 1,
				0x2009: 1,
				0x200A: 1,
				0x200B: 1,
				0x205F: 1,
				0x3000: 1
			};

			this.codesHyphen = {
				0x002D: 1, 0x00AD: 1, 0x2010: 1, 0x2012: 1, 0x2013: 1, 0x2014: 1
			};


			// For replacing invisible chars while rendering
			/** @type RegExp */
			this.reNL =  /[\r\n]/;
			/** @type RegExp */
			//this.reSpace = /[\n\r\u2028\u2029\t\v\f\u0020\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2008\u2009\u200A\u200B\u205F\u3000]/;
			/** @type RegExp */
			this.reReplaceNL =  /\r?\n|\r/g;

				// For hyphenation
			/** @type RegExp */
			//this.reHypNL =  /[\n\r\u2028\u2029]/;
			/** @type RegExp */
			//this.reHypSp =  /[\t\v\f\u0020\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2008\u2009\u200A\u200B\u205F\u3000]/;
			/** @type RegExp */
			//this.reHyphen = /[\u002D\u00AD\u2010\u2012\u2013\u2014]/;

			return this;
		}

		/**
		 * Setups one or more strings to process on
		 * @param {String|Array} fragments  A simple string or array of formatted strings AscCommonExcel.Fragment
		 * @param {AscCommonExcel.CellFlags} flags  Optional.
		 * @return {StringRender}  Returns 'this' to allow chaining
		 */
		StringRender.prototype.setString = function(fragments, flags) {
			this.fragments = [];
			if ( asc_typeof(fragments) === "string" ) {
				var newFragment = new AscCommonExcel.Fragment();
				newFragment.setFragmentText(fragments);
				newFragment.format = new AscCommonExcel.Font();
				this.fragments.push(newFragment);
			} else {
				for (var i = 0; i < fragments.length; ++i) {
					this.fragments.push(fragments[i].clone());
				}
			}
			this.flags = flags;
			this._reset();
			this._setFont(this.drawingCtx, AscCommonExcel.g_oDefaultFormat.Font);
			return this;
		};

        /**
         * Применяем только трансформации поворота в области
         * @param {drawingCtx} drawingCtx
         * @param {type} angle Угол поворота в градусах
         * @param {Number} x
         * @param {Number} y
         * @param {Number} dx
         * @param {Number} dy
         * */
		StringRender.prototype.rotateAtPoint = function (drawingCtx, angle, x, y, dx, dy) {
            var m   = new asc.Matrix();   m.rotate(angle, 0);
            var mbt = new asc.Matrix();

            if (null === drawingCtx) {
                mbt.translate(x + dx, y + dy);

                this.drawingCtx.setTextTransform(m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
                this.drawingCtx.setTransform(mbt.sx, mbt.shy, mbt.shx, mbt.sy, mbt.tx, mbt.ty);
                this.drawingCtx.updateTransforms();
            } else {

                mbt.translate((x + dx) * AscCommonExcel.vector_koef, (y + dy) * AscCommonExcel.vector_koef);
                mbt.multiply(m, 0);

                drawingCtx.setTransform(mbt.sx, mbt.shy, mbt.shx, mbt.sy, mbt.tx, mbt.ty);
            }

            return this;
        };

		StringRender.prototype.resetTransform = function (drawingCtx)  {
            if (null === drawingCtx) {
                this.drawingCtx.resetTransforms();
            } else {
                var m = new asc.Matrix();
                drawingCtx.setTransform(m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
            }

            this.angle = 0;
            this.fontNeedUpdate = true;
        };

        /**
         * @param {Number} angle
         * @param {Number} w
         * @param {Number} h
         * @param {Number} textW
         * @param {String} alignHorizontal
         * @param {String} alignVertical
         * @param {Number} maxWidth
         */
        StringRender.prototype.getTransformBound = function(angle, w, h, textW, alignHorizontal, alignVertical, maxWidth) {
			var ctx = this.drawingCtx;
			
            // TODO: добавить padding по сторонам

            this.angle          =   0;  //  angle;
            this.fontNeedUpdate =   true;

            var dx = 0, dy = 0,offsetX = 0,    // смещение BB

                tm = this._doMeasure(maxWidth),

                mul = (90 - (Math.abs(angle)) ) / 90,

                angleSin = Math.sin(angle * Math.PI / 180.0),
                angleCos = Math.cos(angle * Math.PI / 180.0),

                posh = (angle === 90 || angle === -90) ? textW : Math.abs(angleSin * textW),
                posv = (angle === 90 || angle === -90) ? 0 : Math.abs(angleCos * textW),

                isHorzLeft      = (AscCommon.align_Left   === alignHorizontal),
                isHorzCenter    = (AscCommon.align_Center === alignHorizontal),
                isHorzRight     = (AscCommon.align_Right  === alignHorizontal),

                isVertBottom    = (Asc.c_oAscVAlign.Bottom === alignVertical),
                isVertCenter    = (Asc.c_oAscVAlign.Center === alignVertical || Asc.c_oAscVAlign.Dist === alignVertical || Asc.c_oAscVAlign.Just === alignVertical),
                isVertTop       = (Asc.c_oAscVAlign.Top    === alignVertical);
			

			var _height = tm.height *ctx.getZoom();
            if (isVertBottom) {
                if (angle < 0) {
                    if (isHorzLeft) {
                        dx = - (angleSin * _height);
                    }
                    else if (isHorzCenter) {
                        dx = (w - angleSin * _height - posv) / 2;
                        offsetX = - (w - posv) / 2 - angleSin * _height / 2;
                    }
                    else if (isHorzRight) {
                        dx = w - posv + 2;
                        offsetX = - (w - posv) - angleSin * _height - 2;
					}
                } else {
                    if (isHorzLeft) {

                    }
                    else if (isHorzCenter) {
                        dx = (w - angleSin * _height - posv) / 2;
                        offsetX = - (w - posv) / 2 + angleSin * _height / 2;
                    }
                    else if (isHorzRight) {
                        dx = w  - posv + 1 + 1 - _height * angleSin;
                        offsetX = - w  - posv + 1 + 1 - _height * angleSin;
					}
                }

                if (posh < h) {
                    if (angle < 0) {
                        dy = h - (posh + angleCos * _height);
                    }
                    else {
                        dy = h - angleCos * _height;
                    }
                } else {
                    if (angle > 0) {
                        dy = h - angleCos * _height;
                    } 
                }
            }
            else if (isVertCenter) {

                if (angle < 0) {
                    if (isHorzLeft) {
                        dx = - (angleSin * _height);
                    }
                    else if (isHorzCenter) {
                        dx = (w - angleSin * _height - posv) / 2;
                        offsetX = - (w - posv) / 2 - angleSin * _height / 2;
                    }
                    else if (isHorzRight) {
                        dx = w - posv + 2;
                        offsetX = - (w - posv) - angleSin * _height - 2;
                    }
                } else {
                    if (isHorzLeft) {

                    }
                    else if (isHorzCenter)  {
                        dx = (w - angleSin * _height - posv) / 2;
                        offsetX = - (w - posv) / 2 + angleSin * _height / 2;
                    }
                    else if (isHorzRight) {
                        dx = w  - posv + 1 + 1 - _height * angleSin;
                        offsetX = - w  - posv + 1 + 1 - _height * angleSin;
                    }
                }

                //

                if (posh < h) {
                    if (angle < 0) {
                        dy = (h - posh - angleCos * _height) * 0.5;
                    }
                    else {
                        dy = (h + posh - angleCos * _height) * 0.5;
                    }
                } else {
                    if (angle > 0) {
                        dy = h - angleCos * _height;
                    }
                }
            }
            else if (isVertTop) {

                if (angle < 0) {
                    if (isHorzLeft) {
                        dx = - (angleSin * _height);
                    }
                    else if (isHorzCenter) {
                        dx = (w - angleSin * _height - posv) / 2;
                        offsetX = - (w - posv) / 2 - angleSin * _height / 2;
                    }
                    else if (isHorzRight) {
                        dx = w - posv + 2;
                        offsetX = - (w - posv) - angleSin * _height - 2;
					}
                } else {
                    if (isHorzLeft) {
                    }
                    else if (isHorzCenter) {
                        dx = (w - angleSin * _height - posv) / 2;
                        offsetX = - (w - posv) / 2 + angleSin * _height / 2;
                    }
                    else if (isHorzRight) {
                        dx = w  - posv + 1 + 1 - _height * angleSin;
                        offsetX = - w  - posv + 1 + 1 - _height * angleSin;
                    }

                    dy = Math.min(h + _height * angleCos, posh);
				}
            }

            var bound = { dx: dx, dy: dy, height: 0, width: 0, offsetX: offsetX};

            if (angle === 90 || angle === -90) {
                bound.width = _height;
                bound.height = textW;
            } else {
                bound.height = Math.abs(angleSin * textW) + Math.abs(angleCos * _height);
                bound.width  = Math.abs(angleCos * textW) + Math.abs(angleSin * _height);
            }

            return bound;
        };

        /**
         * Measures string that was setup by 'setString' method
         * @param {Number} maxWidth  Optional. Text width restriction
         * @return {Asc.TextMetrics}  Returns text metrics or null. @see Asc.TextMetrics
         */
		StringRender.prototype.measure = function(maxWidth) {
			return this._doMeasure(maxWidth);
		};

		/**
		 * Draw string that was setup by methods 'setString' or 'measureString'
		 * @param {drawingCtx} drawingCtx
		 * @param {Number} x  Left of the text rect
		 * @param {Number} y  Top of the text rect
		 * @param {Number} maxWidth  Text width restriction
		 * @param {String} textColor  Default text color for formatless string
		 * @return {StringRender}  Returns 'this' to allow chaining
		 */
		StringRender.prototype.render = function(drawingCtx, x, y, maxWidth, textColor) {
			this._doRender(drawingCtx, x, y, maxWidth, textColor);
			return this;
		};

		/**
		 * Measures string
		 * @param {String|Array} fragments  A simple string or array of formatted strings AscCommonExcel.Fragment
		 * @param {AscCommonExcel.CellFlags} [flags]      Optional.
		 * @param {Number} [maxWidth]   Optional. Text width restriction
		 * @return {Asc.TextMetrics}  Returns text metrics or null. @see Asc.TextMetrics
		 */
		StringRender.prototype.measureString = function(fragments, flags, maxWidth) {
			if (fragments) {
				this.setString(fragments, flags);
			}
			return this._doMeasure(maxWidth);
		};
		// StringRender.prototype.createCachedStream = function () {
		// 	AscFormat.ExecuteNoHistory(function() {
		// 		let oParagraph = this.createParagraph();
		// 		oParagraph.Recalculate_Page(0);
		//
		// 		let oDocRenderer = new AscCommon.CDocumentRenderer();
		// 		oDocRenderer.InitPicker(AscCommon.g_oTextMeasurer.m_oManager);
		// 		oDocRenderer.VectorMemoryForPrint = new AscCommon.CMemory();
		// 		oDocRenderer.isPrintMode = false;
		// 		oDocRenderer.Memory.Seek(0);
		// 		oDocRenderer.VectorMemoryForPrint.ClearNoAttack();
		//
		//
		// 		oDocRenderer.BeginPage(100, 100);
		// 		let oGraphics;
		// 		oGraphics = oDocRenderer;
		// 		this.startMemoryPos = oDocRenderer.Memory.pos;
		// 		oGraphics.transform3(new AscCommon.CMatrix());
		// 		oParagraph.Draw(0, oGraphics);
		//
		// 		oDocRenderer.EndPage();
		//
		// 		this.endMemoryPos = oDocRenderer.Memory.pos;
		// 		this.cachedStream = oGraphics.Memory.GetData();
		// 	}, this, []);
		// };
		// StringRender.prototype.createCachedCanvas = function(width, height, textColor) {
		//
		// 	this.cachedCanvas = null;
		// 	if(!width || !height) {
		// 		return;
		// 	}
		// 	let oWB = Asc.editor.wb;
		// 	if(!oWB) {
		// 		return;
		// 	}
		//
		// 	//if(!this.cachedStream) {
		// 	//	this.createCachedStream();
		// 	//}
		//
		// 	let oCanvas = document.createElement('canvas');
		// 	let dZoom = oWB.buffers.main.getZoom();
		// 	oCanvas.width = width ;
		// 	oCanvas.height = height * dZoom >> 0;
		// 	let oGraphics;
		// 	oGraphics = new AscCommon.CGraphics();
		// 	let ppiX = oWB.buffers.main.ppiX;
		// 	let ppiY = oWB.buffers.main.ppiY;
		// 	oGraphics.init(oCanvas.getContext("2d"), oCanvas.width, oCanvas.height, 25.4 * oCanvas.width / ppiX, 25.4 * oCanvas.height / ppiY);
		// 	oGraphics.m_oFontManager = AscCommon.g_fontManager;
		// 	oGraphics.SetIntegerGrid(false);
		// 	oGraphics.transform3(new AscCommon.CMatrix());
		// 	let oParagraph = this.getParagraph();
		// 	oParagraph.Draw(0, oGraphics);
		// 	this.cachedCanvas = oCanvas;
		// 	return;
		//
		//
		// 	let oStream = new AscCommon.FT_Stream2(this.cachedStream, this.endMemoryPos);
		// 	oStream.Seek2(this.startMemoryPos);
		// 	let CT = AscCommon.CommandType;
		// 	let oPenColor = {r: 0, g: 0, b: 0, a: 255};
		// 	let oBrushColor1 = {r: 0, g: 0, b: 0, a: 255};
		// 	let oBrushColor2 = {r: 0, g: 0, b: 0, a: 255};
		// 	let oFont = {Name: "Arial", Size: 11, Style: 0};
		//
		// 	while (oStream.cur < this.endMemoryPos) {
		// 		let nCommand = oStream.GetUChar();
		// 		switch (nCommand) {
		// 			case CT.ctPenColor            : {
		// 				let nColor = oStream.GetLong();
		// 				oPenColor.r = (nColor >> 16) & 0xFF;
		// 				oPenColor.g = (nColor >> 8) & 0xFF;
		// 				oPenColor.b = nColor & 0xFF;
		// 				oGraphics.p_color(oPenColor.r, oPenColor.g, oPenColor.b, oPenColor.a);
		// 				break;
		// 			}
		// 			case CT.ctPenAlpha            : {
		// 				oPenColor.a = oStream.GetUChar();
		// 				oGraphics.p_color(oPenColor.r, oPenColor.g, oPenColor.b, oPenColor.a);
		// 				break;
		// 			}
		// 			case CT.ctPenSize             : {
		// 				let dWidth = oStream.GetDouble();
		// 				let nWidth = dWidth * 1000 >> 0;
		// 				oGraphics.p_width(nWidth);
		// 				break;
		// 			}
		// 			case CT.ctPenDashStyle        : {
		// 				let nIsDashParam = oStream.GetUChar();
		// 				let aDash = [];
		// 				if(nIsDashParam === 0) {
		// 					oGraphics.p_dash(aDash);
		// 				}
		// 				else {
		// 					let nCount = oStream.GetLong();
		// 					for(let nDash = 0; nDash < nCount; ++nDash) {
		// 						aDash.push(oStream.GetDouble());
		// 					}
		// 					oGraphics.p_dash(aDash);
		// 				}
		// 				break;
		// 			}
		// 			case CT.ctPenLineJoin         : {
		// 				let nJoin = oStream.GetUChar();
		// 				oGraphics.put_PenLineJoin(nJoin);
		// 				break;
		// 			}
		//
		// 			// brush
		// 			case CT.ctBrushType            : {
		// 				let nType = oStream.GetLong();
		// 				break;
		// 			}
		// 			case CT.ctBrushColor1          : {
		// 				let nColor = oStream.GetLong();
		// 				oBrushColor1.r = (nColor >> 16) & 0xFF;
		// 				oBrushColor1.g = (nColor >> 8) & 0xFF;
		// 				oBrushColor1.b = nColor & 0xFF;
		// 				oGraphics.b_color1(oBrushColor1.r, oBrushColor1.g, oBrushColor1.b, oBrushColor1.a);
		// 				break;
		// 			}
		// 			case CT.ctBrushColor2          : {
		// 				let nColor = oStream.GetLong();
		// 				oBrushColor2.r = (nColor >> 16) & 0xFF;
		// 				oBrushColor2.g = (nColor >> 8) & 0xFF;
		// 				oBrushColor2.b = nColor & 0xFF;
		// 				oGraphics.b_color2(oBrushColor2.r, oBrushColor2.g, oBrushColor2.b, oBrushColor2.a);
		// 				break;
		// 			}
		// 			case CT.ctBrushAlpha1          : {
		// 				oBrushColor1.a = oStream.GetUChar();
		// 				oGraphics.b_color1(oBrushColor1.r, oBrushColor1.g, oBrushColor1.b, oBrushColor1.a);
		// 				break;
		// 			}
		// 			case CT.ctBrushAlpha2          : {
		// 				oBrushColor2.a = oStream.GetUChar();
		// 				oGraphics.b_color2(oBrushColor2.r, oBrushColor2.g, oBrushColor2.b, oBrushColor2.a);
		// 				break;
		// 			}
		// 			case CT.ctBrushTextureAlpha    : {
		// 				oStream.GetUChar();
		// 				break;
		// 			}
		// 			case CT.ctBrushTextureMode     : {
		// 				oStream.GetUChar();
		// 				break;
		// 			}
		// 			case CT.ctBrushRectable        : {
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				break;
		// 			}
		// 			case CT.ctBrushRectableEnabled : {
		// 				oStream.GetBool();
		// 				break;
		// 			}
		// 			case CT.ctBrushGradient        : {
		// 				oStream.GetUChar();
		// 				let nType = oStream.GetUChar();
		// 				if(nType === 0) {
		// 					oStream.GetLong()
		// 					oStream.GetBool();
		// 					oStream.GetDouble();
		// 					oStream.GetDouble();
		// 					oStream.GetDouble();
		// 					oStream.GetDouble();
		// 				}
		// 				else {
		// 					oStream.GetUChar()
		// 					oStream.GetUChar()
		//
		// 					oStream.GetDouble();
		// 					oStream.GetDouble();
		// 					oStream.GetDouble();
		// 					oStream.GetDouble();
		// 					oStream.GetDouble();
		// 					oStream.GetDouble();
		// 				}
		// 				oStream.GetUChar();
		// 				let nLength = oStream.GetLong();
		//
		// 				for(let nIdx = 0; nIdx < nLength; ++nIdx) {
		// 					oStream.GetLong();
		// 					oStream.GetUChar();
		// 					oStream.GetUChar();
		// 					oStream.GetUChar();
		// 					oStream.GetUChar();
		// 				}
		//
		// 				oStream.GetUChar();
		// 				break;
		// 			}
		// 			case CT.ctBrushTexturePath     : {
		//
		// 				oStream.GetString2LE(2*oStream.GetUShortLE());
		// 				oStream.GetUChar();
		// 				oStream.GetUChar();
		// 				break;
		// 			}
		//
		// 			// font
		// 			case CT.ctFontName      : {
		// 				oFont.Name = oStream.GetString2LE(2*oStream.GetUShortLE());
		// 				oGraphics.SetFontInternal(oFont.Name, oFont.Size, oFont.Style);
		// 				break;
		// 			}
		// 			case CT.ctFontSize      : {
		// 				oFont.Size = oStream.GetDouble();
		// 				oGraphics.SetFontInternal(oFont.Name, oFont.Size, oFont.Style);
		// 				break;
		// 			}
		// 			case CT.ctFontStyle     : {
		// 				oFont.Style = oStream.GetLong();
		// 				oGraphics.SetFontInternal(oFont.Name, oFont.Size, oFont.Style);
		// 				break;
		// 			}
		//
		//
		// 			// text
		// 			case CT.ctDrawText        : {
		// 				let sText = oStream.GetString2LE(2*oStream.GetUShortLE());
		// 				let dX = oStream.GetDouble();
		// 				let dY = oStream.GetDouble();
		// 				oGraphics.FillText(dX, dY, sText);
		// 				break;
		// 			}
		// 			case CT.ctDrawTextCodeGid : {
		// 				let nGid = oStream.GetLong();
		// 				let dX = oStream.GetDouble();
		// 				let dY = oStream.GetDouble();
		// 				let nPointsCount = oStream.GetLong();
		// 				let aCodePoints = [];
		// 				for(let nCode = 0; nCode < nPointsCount; ++nCode) {
		// 					aCodePoints.push(oStream.GetLong());
		// 				}
		// 				oGraphics.tg(nGid, dX, dY, aCodePoints);
		// 				break;
		// 			}
		//
		// 			// pathcommands
		// 			case CT.ctPathCommandMoveTo   : {
		// 				let dX = oStream.GetDouble();
		// 				let dY = oStream.GetDouble();
		// 				oGraphics._m(dX, dY);
		// 				break;
		// 			}
		// 			case CT.ctPathCommandLineTo   : {
		// 				let dX = oStream.GetDouble();
		// 				let dY = oStream.GetDouble();
		// 				oGraphics._l(dX, dY);
		// 				break;
		// 			}
		// 			case CT.ctPathCommandCurveTo  : {
		// 				let dX1 = oStream.GetDouble();
		// 				let dY1 = oStream.GetDouble();
		// 				let dX2 = oStream.GetDouble();
		// 				let dY2 = oStream.GetDouble();
		// 				let dX3 = oStream.GetDouble();
		// 				let dY3 = oStream.GetDouble();
		// 				oGraphics._c(dX1, dY1, dX2, dY2, dX3, dY3);
		// 				break;
		// 			}
		// 			case CT.ctPathCommandClose    : {
		// 				oGraphics._z();
		// 				break;
		// 			}
		// 			case CT.ctPathCommandEnd      : {
		// 				oGraphics._e();
		// 				break;
		// 			}
		// 			case CT.ctDrawPath            : {
		// 				let nType = oStream.GetLong();
		// 				if(nType === 256) {
		// 					oGraphics.df();
		// 				}
		// 				else {
		// 					oGraphics.ds();
		// 				}
		// 				break;
		// 			}
		// 			case CT.ctPathCommandStart    : {
		// 				oGraphics._s();
		// 				break;
		// 			}
		//
		//
		//
		// 			case CT.ctBeginCommand : {
		// 				oGraphics.GetLong();
		// 				break;
		// 			}
		// 			case CT.ctEndCommand   : {
		// 				oGraphics.GetLong();
		// 				break;
		// 			}
		//
		// 			case CT.ctSetTransform   : {
		//
		// 				let sx = oStream.GetDouble();
		// 				let shy = oStream.GetDouble();
		// 				let shx = oStream.GetDouble();
		// 				let sy = oStream.GetDouble();
		// 				let tx = oStream.GetDouble();
		// 				let ty = oStream.GetDouble();
		// 				oGraphics.transform(sx, shy, shx, sy, tx, ty);
		// 				break;
		// 			}
		//
		//
		// 			case CT.ctHyperlink : {
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetString2LE(2*oStream.GetUShortLE());
		// 				oStream.GetString2LE(2*oStream.GetUShortLE());
		// 				break;
		// 			}
		// 			case CT.ctLink      : {
		//
		//
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetDouble();
		// 				oStream.GetLong();
		// 				break;
		// 			}
		// 			case CT.ctFormField : {
		// 				break;
		// 			}
		//
		// 			case CT.ctPageWidth  : {
		// 				oStream.GetDouble();
		// 				break;
		// 			}
		// 			case CT.ctPageHeight : {
		// 				oStream.GetDouble();
		// 				break;
		// 			}
		//
		// 			case CT.ctPageStart : {
		// 				break;
		// 			}
		// 			case CT.ctPageEnd   : {
		// 				oStream.Seek(this.endMemoryPos);
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	this.cachedCanvas = oCanvas;
		// };

		StringRender.prototype.forEachRunText = function(fCallback) {
			let oParagraph = this.getCalculatedParagraph();
			let aContent = oParagraph.Content;
			let nChar = 0;
			for(let nIdx = 0; nIdx < aContent.length; ++nIdx) {
				let oRun = aContent[nIdx];
				let aRunContent = oRun.Content;
				if(aRunContent.length === 0) {
					continue;
				}
				for(let nTxt = 0; nTxt < aRunContent.length; ++nTxt) {
					let oTxt = aRunContent[nTxt];
					fCallback(oTxt);
				}
			}
		};

		/**
		 * Returns the width of the widest char in the string has been measured
		 */
		StringRender.prototype.getWidestCharWidth = function () {
			let dMaxWidth = 0;
			this.forEachRunText(function (oTxt){
				let dWidth = oTxt.GetWidth();
				if(dWidth > dMaxWidth) {
					dMaxWidth = dWidth;
				}
			});
			return this.mmToPixels(dMaxWidth);
		};

		StringRender.prototype._reset = function() {
			this.chars = [];
			this.charProps = [];
		};

		/**
		 * @param {String} fragment
		 * @param {Boolean} wrap
		 * @return {String}  Returns filtered fragment
		 */
		StringRender.prototype._filterText = function(fragment, wrap) {
			var s = fragment;
			if (s.search(this.reNL) >= 0) {s = s.replace(this.reReplaceNL, wrap ? "\n" : "");}
			return s;
		};

		StringRender.prototype._filterChars = function(chars, wrap) {
			var res = [];
			if (chars) {
				for (var i = 0; i < chars.length; i++) {
					if (0xD === chars[i] && 0xA === chars[i + 1]) {
						//\r\n
						if (wrap) {
							res.push(0xA);
						}
						i++;
					} else if (0xA === chars[i]) {
						//\r
						if (wrap) {
							res.push(0xA);
						}
					} else {
						res.push(chars[i]);
					}
				}
			}
			return res;
		};

		StringRender.prototype.mmToPixels = function(dMMValue) {
			let dZoom = this.drawingCtx.getZoom();
			let nPPIX = this.drawingCtx.ppiX;
			return Asc.round(dMMValue / 25.4 * nPPIX * dZoom);
		};
		StringRender.prototype.pixelsToMM = function(nPixValue) {
			let dZoom = this.drawingCtx.getZoom();
			let nPPIX = this.drawingCtx.ppiX;
			return nPixValue * 25.4 / nPPIX / dZoom;
		};

		/**
		 * @param {Number} startCh
		 * @param {Number} endCh
		 * @return {Number}
		 */
		StringRender.prototype._calcCharsWidth = function(startCh, endCh) {
			let dW = 0;
			let nIdx = 0;
			this.forEachRunText(function(oTxt) {
				if(nIdx >= startCh && nIdx <= endCh) {
					dW += oTxt.GetWidth();
				}
				++nIdx;
			});
			return this.mmToPixels(dW);
		};
		StringRender.prototype.getCharWidth = function(nIndex) {
			let dW = 0;
			let nIdx = 0;
			this.forEachRunText(function(oTxt) {
				if(nIdx === nIndex) {
					dW = oTxt.GetWidth();
				}
				++nIdx;
			});
			return this.mmToPixels(dW);
		};

		StringRender.prototype.getLineDescender = function(nLineIdx) {
			return this.mmToPixels(this.getLines()[nLineIdx].Metrics.Descent);
		};


		StringRender.prototype.getLinesCount = function () {
			return this.getLines().length;
		};

		StringRender.prototype.getLines = function () {
			let oParagraph = this.getCalculatedParagraph();
			return oParagraph.Lines;
		};

		StringRender.prototype.getLineInfo = function (index) {
			return null;
		};
		/**
		 * @param {Number} startPos
		 * @param {Number} endPos
		 * @return {Number}
		 */
		StringRender.prototype._calcLineWidth = function (startPos, endPos) {
			var wrap = this.flags && (this.flags.wrapText || this.flags.wrapOnlyNL || this.flags.wrapOnlyCE);
			var isAtEnd, j, chProp, tw;

			if (endPos === undefined || endPos < 0) {
				// search for end of line
				for (j = startPos + 1; j < this.chars.length; ++j) {
					chProp = this.charProps[j];
					if (chProp && (chProp.nl || chProp.hp)) {break;}
				}
				endPos = j - 1;
			}

			for (j = endPos, tw = 0, isAtEnd = true; j >= startPos; --j) {
				if (isAtEnd) {
					// skip space char at end of line
					if ( (wrap) && this.codesSpace[this.chars[j]] ) {continue;}
					isAtEnd = false;
				}
				tw += this.getCharWidth(j);
			}

			return tw;
		};

		StringRender.prototype._calcLineMetrics = function (f, va, fm) {
			var l = new lineMetrics();

			if (!va) {
				var _a = Math.max(0, asc.ceil(fm.nat_y1 * f / fm.nat_scale));
				var _d = Math.max(0, asc.ceil(-fm.nat_y2 * f / fm.nat_scale)) + 1; // 1 px for border

				l.th = _a + _d;
				l.bl = _a;
				l.a = _a;
				l.d = _d;
			} else {
				var ppi = 96;
				var hpt = f * 1.275;
				var fpx = f * ppi / 72;
				var topt = 72 / ppi;

				var h;
				var a = asc_round(fpx) * topt;
				var d;

				var a_2 = asc_round(fpx / 2) * topt;

				var h_2_3;
				var a_2_3 = asc_round(fpx * 2/3) * topt;
				var d_2_3;

				var x = a_2 + a_2_3;

				if (va === AscCommon.vertalign_SuperScript) {
					h = hpt;
					d = h - a;

					l.th = x + d;
					l.bl = x;
					l.bl2 = a_2_3;
					l.a = fm.ascender + a_2;         // >0
					l.d = fm.descender - a_2;        // <0
				} else if (va === AscCommon.vertalign_SubScript) {
					h_2_3 = hpt * 2/3;
					d_2_3 = h_2_3 - a_2_3;
					l.th = x + d_2_3;
					l.bl = a;
					l.bl2 = x;
					l.a = fm.ascender + a - x;       // >0
					l.d = fm.descender + x - a;      // >0
				}
			}

			return l;
		};
		StringRender.prototype._calcLineMetrics2 = function (f, va, fm) {
			var l = new lineMetrics();

			var a = Math.max(0, asc.ceil(fm.nat_y1 * f / fm.nat_scale));
			var d = Math.max(0, asc.ceil(-fm.nat_y2 * f / fm.nat_scale)) + 1; // 1 px for border

			/*
			// ToDo
			if (va) {
				var k = (AscCommon.vertalign_SuperScript === va) ? AscCommon.vaKSuper : AscCommon.vaKSub;
				d += asc.ceil((a + d) * k);
				f = asc.ceil(f * 2 / 3 / 0.5) * 0.5; // Round 0.5
				a = Math.max(0, asc.ceil(fm.nat_y1 * f / fm.nat_scale));
			}
			*/

			l.th = a + d;
			l.bl = a;
			l.a = a;
			l.d = d;

			return l;
		};

		StringRender.prototype.calcDelta = function (vnew, vold) {
			return vnew > vold ? vnew - vold : 0;
		};

		/**
		 * @param {Boolean} [dontCalcRepeatChars]
		 * @return {Asc.TextMetrics}
		 */
		StringRender.prototype._calcTextMetrics = function (dontCalcRepeatChars) {
			let TW = 0, TH = 0, BL = 0;
			let oWB = Asc.editor.wb;
			if(oWB) {
				let oParagraph = this.getCalculatedParagraph();
				let oResult = oParagraph.Parent.RecalculateMinMaxContentWidth(false);
				TW = this.mmToPixels(oResult.Max);
				TH = this.mmToPixels(oParagraph.Parent.GetSummaryHeight()) + 1;
			}
			return new asc.TextMetrics(TW, TH, 0, BL, 0, 0);
		};

		StringRender.prototype._getRepeatCharPos = function () {
			var charProp;
			for (var i = 0; i < this.chars.length; ++i) {
				charProp = this.charProps[i];
				if (charProp && charProp.repeat)
					return i;
			}
			return -1;
		};

		/**
		 * @param {Number} maxWidth
		 */
		StringRender.prototype._insertRepeatChars = function (maxWidth) {
		};

		StringRender.prototype._getCharPropAt = function (index) {
			var prop = this.charProps[index];
			if (!prop) {prop = this.charProps[index] = new charProperties();}
			return prop;
		};

		StringRender.prototype.createRun = function(aChars, oFont) {
			return AscFormat.ExecuteNoHistory(function(){
				let oRun = new AscWord.CRun();
				for(let nChar = 0; nChar < aChars.length; ++nChar) {
					let nUnicode = aChars[nChar];
					if (AscCommon.IsSpace(nUnicode)) {
						oRun.AddToContentToEnd(new AscWord.CRunSpace(nUnicode));
					}
					else if (0x0D === nUnicode) {
						if (nChar + 1 < aChars.length && 0x0A === aChars[nChar + 1]) {
							nChar++;
						}
						oRun.AddToContentToEnd(new AscWord.CRunSpace());
					}
					else if (0x09 === nUnicode) {
						oRun.AddToContentToEnd(new AscWord.CRunTab());
					}
					else {
						oRun.AddToContentToEnd(new AscWord.CRunText(nUnicode));
					}
				}
				let oPr = new AscWord.CTextPr();
				oPr.SetFromFontObject(oFont);
				oRun.SetPr(oPr);
				return oRun;
			}, this, []);
		};
		StringRender.prototype.createTextPr = function(oFont) {
			return AscFormat.ExecuteNoHistory(function(){
				let oPr = new AscWord.CTextPr();
				oPr.SetFromFontObject(oFont);
				return oPr;}, this, []);
		};
		StringRender.prototype.createParagraph = function() {
			let oParagraph = AscFormat.ExecuteNoHistory(function() {
				let bWrap = this.flags && (this.flags.wrapText || this.flags.wrapOnlyCE) && !this.flags.isNumberFormat;
				let bWrapNL = this.flags && this.flags.wrapOnlyNL;
				let bVerticalText = this.flags && this.flags.verticalText;
				let aFragments = this.fragments;

				let oShape = new AscFormat.CShape();
				oShape.setTxBody(AscFormat.CreateTextBodyFromString("", this, oShape));
				let oContent = oShape.txBody.content;
				let oParagraph = oContent.Content[0];
				let nAlign = AscCommon.align_Left;
				//if(this.flags && AscFormat.isRealNumber(this.flags.textAlign)) {
				//	nAlign = this.flags.textAlign;
				//}
				oParagraph.SetParagraphAlign(nAlign)
				for(let nFgm = 0; nFgm < aFragments.length; ++nFgm) {
					let oFgm = aFragments[nFgm];
					if (oFgm.isInitCharCodes()) {
						oFgm.initText();
					}
					let aChars = this._filterChars(oFgm.getCharCodes(), bWrap || bWrapNL);
					if(aChars.length === 0) {
						continue;
					}
					let oRun = this.createRun(aChars, oFgm.format);
					oParagraph.AddToContentToEnd(oRun);
				}
				return oParagraph;
			}, this, []);
			return oParagraph;
		};

		StringRender.prototype.getCellTextMeasurer = function() {
			return AscCommon.g_oTextMeasurer;
		};

		StringRender.prototype.getCalculatedParagraph = function(maxWidth) {
			let oParagraph = this.createParagraph();
			let oContent = oParagraph.GetParent();
			let nMaxLimit = 20000;
			let nXLimit = AscFormat.isRealNumber(maxWidth) ? this.pixelsToMM(maxWidth) : nMaxLimit;
			let nYLimit = nMaxLimit;
			oContent.Reset(0, 0, 20000, nYLimit);
			oContent.Recalculate_Page(0, true);
			return oParagraph;
		};

		/**
		 * @param {Number} maxWidth
		 * @return {Asc.TextMetrics}
		 */
		StringRender.prototype._measureChars = function (maxWidth) {
			this._reset();
            return this._calcTextMetrics();
        };

        /**
		 * @param {Number} maxWidth
		 * @return {Asc.TextMetrics}
		 */
		StringRender.prototype._doMeasure = function(maxWidth) {
			var ratio, format, size, canReduce = true, minSize = 2.5;
			var tm = this._measureChars(maxWidth);
			while (this.flags && this.flags.shrinkToFit && tm.width > maxWidth && canReduce) {
				canReduce = false;
				ratio = maxWidth / tm.width;
				for (var i = 0; i < this.fragments.length; ++i) {
					format = this.fragments[i].format;
					size = Math.max(minSize, Math.floor(format.getSize() * ratio * 2) / 2);
					format.setSize(size);
					if (minSize < size) {
						canReduce = true;
					}
				}
				tm = this._measureChars(maxWidth);
			}
			return tm;
		};

		/**
		 * @param {DrawingContext} drawingCtx
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} maxWidth
		 * @param {String} textColor
		 */
		StringRender.prototype._doRender = function(drawingCtx, x, y, maxWidth, textColor) {

			let oWB = Asc.editor.wb;
			if(!oWB) {
				return;
			}
			let oParagraph = this.getCalculatedParagraph(maxWidth);

			let oContext = oWB.buffers.main.ctx;
			let oCanvas = oWB.buffers.main.canvas;
			let oGraphics;
			oGraphics = new AscCommon.CGraphics();
			let ppiX = oWB.buffers.main.ppiX;
			let ppiY = oWB.buffers.main.ppiY;

			oGraphics.init(oWB.buffers.main.ctx, oCanvas.width, oCanvas.height, 25.4 * oCanvas.width / ppiX, 25.4 * oCanvas.height / ppiY);
			oGraphics.m_oFontManager = AscCommon.g_fontManager;
			oGraphics.SaveGrState();
			oGraphics.SetIntegerGrid(false);
			oGraphics.m_oCoordTransform.tx = x;
			oGraphics.m_oCoordTransform.ty = y;
			oGraphics.transform3(new AscCommon.CMatrix());
			oParagraph.Draw(0, oGraphics);
			oGraphics.RestoreGrState();
		};

		StringRender.prototype.getInternalState = function () {
            return {
                /** @type Object */
                flags       : this.flags,

                chars       : this.chars,
                charProps   : this.charProps,
				fragments   : [].concat(this.fragments)
            };
        };

		StringRender.prototype.restoreInternalState = function (state) {
			this.flags       = state.flags;
			this.chars       = state.chars;
			this.charProps   = state.charProps;
			this.fragments   = state.fragments;
			return this;
		};

		StringRender.prototype._setFont = function (ctx, font) {
			if (!font.isEqual(ctx.font) || this.fontNeedUpdate) {
				ctx.setFont(font, this.angle);
				this.fontNeedUpdate = false;
				return true;
			}
			return false;
		};


		//------------------------------------------------------------export---------------------------------------------------
		window['AscCommonExcel'] = window['AscCommonExcel'] || {};
		window["AscCommonExcel"].StringRender = StringRender;
	}
)(window);
