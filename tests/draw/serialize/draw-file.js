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
+function ($) {
	"use strict";

	window.editor = new AscCommon.baseEditorsApi({});
	let api = new Asc.asc_docs_api({
		'id-view'  : 'editor_sdk'
	});
	window.editor = api;
	//todo
	window.editor = {
		'WordControl': {
			'm_oLogicDocument': {
				'DrawingDocument': null,
				"IsTrackRevisions": function () {
					return false
				}
			}
		}
	};
	var holder = document.getElementById("editor_sdk");
	holder.ondragover = holderOnDradOver;
	holder.ondrop = holderOnDrop;
	window.onload = windowOnLoad;

	// enable native scrolls
	var id_main_view = document.getElementById("id_main_view");
	id_main_view.style.overflow = "auto";

	let pageScale = 1;

	// Cross browser support unchecked!
	// May slow down scrolling! Because handler will wait until its job is finished and will fire mouse wheel only
	// after it (because it now can call prevent default - prevent scroll during handlers
	// work because of { passive: false })
	window.addEventListener('mousewheel', onWindowMouseWheel, { passive: false });

	function onWindowMouseWheel(e) {
		if (e.ctrlKey === true)
		{
			e.preventDefault(); // case described above
			if (e.deltaY > 0) {
				// console.log('Down');
				pageScale = pageScale / 1.1;
			} else {
				// console.log('Up');
				pageScale = pageScale * 1.1;
			}
			let droppedTestFileArrayBuffer = AscCommon.Base64.decode(localStorage.droppedTestFile);
			drawFile(droppedTestFileArrayBuffer);
			console.log('draw using scale ', pageScale);
		}
	}


	function drawFile(data){
		api.asc_CloseFile();
		api.OpenDocumentFromZip(data);
		api.Document.draw(pageScale);
	}

	function holderOnDradOver(e)
	{
		var isFile = false;
		if (e.dataTransfer.types)
		{
			for (var i = 0, length = e.dataTransfer.types.length; i < length; ++i)
			{
				var type = e.dataTransfer.types[i].toLowerCase();
				if (type == "files" && e.dataTransfer.items && e.dataTransfer.items.length == 1)
				{
					var item = e.dataTransfer.items[0];
					if (item.kind && "file" == item.kind.toLowerCase())
					{
						isFile = true;
						break;
					}
				}
			}
		}
		e.dataTransfer.dropEffect = isFile ? "copy" : "none";
		e.preventDefault();
		return false;
	};

	function holderOnDrop(e)
	{
		var file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
		if (!file)
		{
			e.preventDefault();
			return false;
		}

		var reader = new FileReader();
		reader.onload = function(e) {
			drawFile(e.target.result);

			let arrayBuffer = e.target.result;
			let uInt8Array = new Uint8Array(arrayBuffer);
			console.log('saving file for testing');
			localStorage.droppedTestFile = AscCommon.Base64.encode(uInt8Array);
		};
		reader.readAsArrayBuffer(file);

		return false;
	}

	function windowOnLoad() {
		setTimeout(function (){
			let testFileRectangle = AscCommon.Base64.decode(Asc.rectangle);
			let testFileTriangle = AscCommon.Base64.decode(Asc.triangle);
			let testFileLineShapes = AscCommon.Base64.decode(Asc.lineShapes);
			let testFileCircle = AscCommon.Base64.decode(Asc.circle);
			let rectAndCircle = AscCommon.Base64.decode(Asc.rectAndCircle);
			let basicShapesBstart = AscCommon.Base64.decode(Asc.basic_ShapesB_start);
			let rotatedEllipticalArc = AscCommon.Base64.decode(Asc.rotatedEllipticalArc);
			let rotatedEllipticalArc30 = AscCommon.Base64.decode(Asc.rotatedEllipticalArc30);
			let rotatedEllipticalArc30NoBBCross = AscCommon.Base64.decode(Asc.rotatedEllipticalArc30NoBBCross);
			let antiClockwiseEllipticalArc = AscCommon.Base64.decode(Asc.antiClockwiseEllipticalArc);
			let rotatedEllipticalArc2_45 = AscCommon.Base64.decode(Asc.rotatedEllipticalArc2_45);
			let rotatedEllipticalArcMod = AscCommon.Base64.decode(Asc.rotatedEllipticalArcMod);
			let basic_ShapesC_start = AscCommon.Base64.decode(Asc.basic_ShapesC_start);
			let sizeAndPositionStart = AscCommon.Base64.decode(Asc.sizeAndPositionStart);

			if (localStorage.droppedTestFile) {
				console.log('There is saved test file in local storage');
			}
			let droppedTestFileArrayBuffer = AscCommon.Base64.decode(localStorage.droppedTestFile);
			drawFile(droppedTestFileArrayBuffer);
		}, 3000);
	}
}();