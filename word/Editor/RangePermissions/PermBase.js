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
	/**
	 * Base class for range permissions
	 * @constructor
	 */
	function PermBase()
	{
		this.PermId       = undefined;
		this.PermEd       = undefined;
		this.PermEdGrp    = undefined;
		this.PermColFirst = undefined;
		this.PermColLast  = undefined;
	}
	PermBase.prototype.GetPermId = function()
	{
		return this.PermId;
	};
	PermBase.prototype.SetPermId = function(id)
	{
		if (this.PermId === id)
			return;
		
		AscCommon.ApplyChange(new AscDFH.CChangesPermissionsPermId(this, this.PermId, id));
	};
	PermBase.prototype.GetPermEd = function()
	{
		return this.PermEd;
	};
	PermBase.prototype.SetPermEd = function(value)
	{
		if (value === this.PermEd)
			return;
		
		AscCommon.ApplyChange(new AscDFH.CChangesPermissionsEd(this, this.PermEd, value));
	};
	PermBase.prototype.GetPermEdGrp = function()
	{
		return this.PermEdGrp;
	};
	PermBase.prototype.SetPermEdGrp = function(value)
	{
		if (value === this.PermEdGrp)
			return;
		
		AscCommon.ApplyChange(new AscDFH.CChangesPermissionsEdGrp(this, this.PermEdGrp, value));
	};
	PermBase.prototype.GetPermColFirst = function()
	{
		return this.PermColFirst;
	};
	PermBase.prototype.SetPermColFirst = function(value)
	{
		if (value === this.PermColFirst)
			return;
		
		AscCommon.ApplyChange(new AscDFH.CChangesPermissionsColFirst(this, this.PermColFirst, value));
	};
	PermBase.prototype.GetPermColLast = function()
	{
		return this.PermColLast;
	};
	PermBase.prototype.SetGermColLast = function(value)
	{
		if (value === this.PermColLast)
			return;
		
		AscCommon.ApplyChange(new AscDFH.CChangesPermissionsColLast(this, this.PermColLast, value));
	};
	//--------------------------------------------------------export----------------------------------------------------
	window['AscWord'].PermBase = PermBase;
	
})(window);

