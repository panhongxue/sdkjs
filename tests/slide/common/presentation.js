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

(function(window)
{
  let logicDocument = null;

	function CreateLogicDocument()
	{
		if (logicDocument)
			return logicDocument;

		logicDocument = new AscCommonSlide.CPresentation(AscTest.DrawingDocument, true);
		logicDocument.Api = AscTest.Editor;

		AscTest.DrawingDocument.m_oLogicDocument = logicDocument;
		logicDocument.createNecessaryObjectsIfNoPresent();
		return logicDocument;
	}

  function GetParagraphText(paragraph)
  {
    return paragraph.GetText({ParaEndToSpace : false});
  }

	function TurnOnRecalculate()
	{
		logicDocument.Recalculate = AscCommonSlide.CPresentation.prototype.Recalculate.bind(logicDocument);
		logicDocument.Recalculate2 = AscCommonSlide.CPresentation.prototype.Recalculate2.bind(logicDocument);
	}

	function TurnOffRecalculate()
	{
		logicDocument.Recalculate = function () {};
		logicDocument.Recalculate2 = function () {};
	}

	function AddShape(x, y, height, width)
	{
		AscCommon.History.Create_NewPoint();
		const shapeTrack = new AscFormat.NewShapeTrack('rect', x, y, AscFormat.GetDefaultTheme(), null, null, null, 0);
		shapeTrack.track({}, x+ width, y + height);
		const shape = shapeTrack.getShape(false, AscTest.DrawingDocument, null);
		shape.setBDeleted(false);
		shape.setParent(logicDocument.Slides[0]);
		shape.addToDrawingObjects();
		shape.select(GetDrawingObjects(), 0);
		return shape;
	}

	function ClearShapeAndAddParagraph(sText)
	{
		const textShape = AddShape(0, 0, 100, 100);
		const txBody = AscFormat.CreateTextBodyFromString(sText, editor.WordControl.m_oDrawingDocument, textShape)
		textShape.setTxBody(txBody);
		textShape.setPaddings({Left: 0, Top: 0, Right: 0, Bottom: 0});
		const content = txBody.content;
		content.SetThisElementCurrent();
		content.MoveCursorToStartPos();
		textShape.recalculate();
		return {shape: textShape, paragraph: content.Content[0]};
	}

	function AddTextArt()
	{
		const textArt = logicDocument.AddTextArt(0);
		const paragraph = textArt.txBody.content.GetAllParagraphs()[0];
		return {textArt, paragraph};
	}

	function EnterText(text)
	{
		if (!logicDocument)
			return;

		logicDocument.EnterText(text);
	}

	function CorrectEnterText(oldText, newText)
	{
		if (!logicDocument)
			return;

		logicDocument.CorrectEnterText(oldText, newText);
	}
	function BeginCompositeInput()
	{
		if (!logicDocument)
			return;

		logicDocument.getCompositeInput().begin();
	}
	function ReplaceCompositeInput(text)
	{
		if (!logicDocument)
			return;

		logicDocument.getCompositeInput().replace(text);
	}
	function EndCompositeInput()
	{
		if (!logicDocument)
			return;

		logicDocument.getCompositeInput().end();
	}

	function EnterTextCompositeInput(text)
	{
		BeginCompositeInput();
		ReplaceCompositeInput(text);
		EndCompositeInput();
	}

	function StartCollaboration(bFast)
	{
		logicDocument.Set_FastCollaborativeEditing(bFast);
		AscCommon.CollaborativeEditing.Start_CollaborationEditing();
		SyncCollaboration();
	}
	function SyncCollaboration()
	{
		AscCommon.CollaborativeEditing.Send_Changes();

	}
	function EndCollaboration()
	{
		AscCommon.CollaborativeEditing.End_CollaborationEditing();
	}

	function GetDrawingObjects()
	{
		return editor.getGraphicController();
	}

	function SelectDrawings(arrDrawings)
	{
		const drawingController = GetDrawingObjects();
		drawingController.resetSelection()
		for (let i = 0; i < arrDrawings.length; i += 1)
		{
			arrDrawings[i].select(drawingController, 0);
		}
	}


  //--------------------------------------------------------export----------------------------------------------------
  AscTest.CreateLogicDocument       = CreateLogicDocument;
  AscTest.GetParagraphText          = GetParagraphText;
  AscTest.EnterText                 = EnterText;
  AscTest.CorrectEnterText          = CorrectEnterText;
  AscTest.BeginCompositeInput       = BeginCompositeInput;
  AscTest.ReplaceCompositeInput     = ReplaceCompositeInput;
  AscTest.EndCompositeInput         = EndCompositeInput;
  AscTest.EnterTextCompositeInput   = EnterTextCompositeInput;
  AscTest.TurnOnRecalculate         = TurnOnRecalculate;
  AscTest.TurnOffRecalculate        = TurnOffRecalculate;
  AscTest.AddShape                  = AddShape;
  AscTest.ClearShapeAndAddParagraph = ClearShapeAndAddParagraph;
  AscTest.StartCollaboration        = StartCollaboration;
  AscTest.SyncCollaboration         = SyncCollaboration;
  AscTest.EndCollaboration          = EndCollaboration;
  AscTest.GetDrawingObjects         = GetDrawingObjects;
  AscTest.AddTextArt                = AddTextArt;
  AscTest.SelectDrawings            = SelectDrawings;


})(window);

