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
	window['AscDFH'].historyitem_Permissions_PermId   = window['AscDFH'].historyitem_type_Permissions | 1;
	window['AscDFH'].historyitem_Permissions_Ed       = window['AscDFH'].historyitem_type_Permissions | 2;
	window['AscDFH'].historyitem_Permissions_EdGrp    = window['AscDFH'].historyitem_type_Permissions | 3;
	window['AscDFH'].historyitem_Permissions_ColFirst = window['AscDFH'].historyitem_type_Permissions | 4;
	window['AscDFH'].historyitem_Permissions_ColLast  = window['AscDFH'].historyitem_type_Permissions | 5;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesPermissionsPermId(Class, oldAuthor, newAuthor)
	{
		let oldId = oldAuthor ? oldAuthor.GetId() : undefined;
		let newId = newAuthor ? newAuthor.GetId() : undefined;
		
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, oldId, newId);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesPermissionsPermId,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_Document_Author,
		function(value)
		{
			this.Class.PermId = value;
		},
		false
	);
	window['AscDFH'].CChangesOFormDocumentAuthor = CChangesOFormDocumentAuthor;
	
})(window);

