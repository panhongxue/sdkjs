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

(function (window) {

	let type = false;
	let Paragraph = null;
	let wordStyle = [];

	// List of MathFont
	const GetMathFontChar = {
		'A': { 0: '𝐀', 1: '𝐴', 2: '𝑨', 3: '𝖠', 4: '𝗔', 5: '𝘈', 6: '𝘼', 7: '𝒜', 8: '𝓐', 9: '𝔄', 10: '𝕬', 11: '𝙰', 12: '𝔸'},
		'B': { 0: '𝐁', 1: '𝐵', 2: '𝑩', 3: '𝖡', 4: '𝗕', 5: '𝘉', 6: '𝘽', 7: 'ℬ', 8: '𝓑', 9: '𝔅', 10: '𝕭', 11: '𝙱', 12: '𝔹'},
		'C': { 0: '𝐂', 1: '𝐶', 2: '𝑪', 3: '𝖢', 4: '𝗖', 5: '𝘊', 6: '𝘾', 7: '𝒞', 8: '𝓒', 9: 'ℭ', 10: '𝕮', 11: '𝙲', 12: 'ℂ'},
		'D': { 0: '𝐃', 1: '𝐷', 2: '𝑫', 3: '𝖣', 4: '𝗗', 5: '𝘋', 6: '𝘿', 7: '𝒟', 8: '𝓓', 9: '𝔇', 10: '𝕯', 11: '𝙳', 12: '𝔻'},
		'E': { 0: '𝐄', 1: '𝐸', 2: '𝑬', 3: '𝖤', 4: '𝗘', 5: '𝘌', 6: '𝙀', 7: 'ℰ', 8: '𝓔', 9: '𝔈', 10: '𝕰', 11: '𝙴', 12: '𝔼'},
		'F': { 0: '𝐅', 1: '𝐹', 2: '𝑭', 3: '𝖥', 4: '𝗙', 5: '𝘍', 6: '𝙁', 7: 'ℱ', 8: '𝓕', 9: '𝔉', 10: '𝕱', 11: '𝙵', 12: '𝔽'},
		'G': { 0: '𝐆', 1: '𝐺', 2: '𝑮', 3: '𝖦', 4: '𝗚', 5: '𝘎', 6: '𝙂', 7: '𝒢', 8: '𝓖', 9: '𝔊', 10: '𝕲', 11: '𝙶', 12: '𝔾'},
		'H': { 0: '𝐇', 1: '𝐻', 2: '𝑯', 3: '𝖧', 4: '𝗛', 5: '𝘏', 6: '𝙃', 7: 'ℋ', 8: '𝓗', 9: 'ℌ', 10: '𝕳', 11: '𝙷', 12: 'ℍ'},
		'I': { 0: '𝐈', 1: '𝐼', 2: '𝑰', 3: '𝖨', 4: '𝗜', 5: '𝘐', 6: '𝙄', 7: 'ℐ', 8: '𝓘', 9: 'ℑ', 10: '𝕴', 11: '𝙸', 12: '𝕀'},
		'J': { 0: '𝐉', 1: '𝐽', 2: '𝑱', 3: '𝖩', 4: '𝗝', 5: '𝘑', 6: '𝙅', 7: '𝒥', 8: '𝓙', 9: '𝔍', 10: '𝕵', 11: '𝙹', 12: '𝕁'},
		'K': { 0: '𝐊', 1: '𝐾', 2: '𝑲', 3: '𝖪', 4: '𝗞', 5: '𝘒', 6: '𝙆', 7: '𝒦', 8: '𝓚', 9: '𝔎', 10: '𝕶', 11: '𝙺', 12: '𝕂'},
		'L': { 0: '𝐋', 1: '𝐿', 2: '𝑳', 3: '𝖫', 4: '𝗟', 5: '𝘓', 6: '𝙇', 7: 'ℒ', 8: '𝓛', 9: '𝔏', 10: '𝕷', 11: '𝙻', 12: '𝕃'},
		'M': { 0: '𝐌', 1: '𝑀', 2: '𝑴', 3: '𝖬', 4: '𝗠', 5: '𝘔', 6: '𝙈', 7: 'ℳ', 8: '𝓜', 9: '𝔐', 10: '𝕸', 11: '𝙼', 12: '𝕄'},
		'N': { 0: '𝐍', 1: '𝑁', 2: '𝑵', 3: '𝖭', 4: '𝗡', 5: '𝘕', 6: '𝙉', 7: '𝒩', 8: '𝓝', 9: '𝔑', 10: '𝕹', 11: '𝙽', 12: 'ℕ'},
		'O': { 0: '𝐎', 1: '𝑂', 2: '𝑶', 3: '𝖮', 4: '𝗢', 5: '𝘖', 6: '𝙊', 7: '𝒪', 8: '𝓞', 9: '𝔒', 10: '𝕺', 11: '𝙾', 12: '𝕆'},
		'P': { 0: '𝐏', 1: '𝑃', 2: '𝑷', 3: '𝖯', 4: '𝗣', 5: '𝘗', 6: '𝙋', 7: '𝒫', 8: '𝓟', 9: '𝔓', 10: '𝕻', 11: '𝙿', 12: 'ℙ'},
		'Q': { 0: '𝐐', 1: '𝑄', 2: '𝑸', 3: '𝖰', 4: '𝗤', 5: '𝘘', 6: '𝙌', 7: '𝒬', 8: '𝓠', 9: '𝔔', 10: '𝕼', 11: '𝚀', 12: 'ℚ'},
		'R': { 0: '𝐑', 1: '𝑅', 2: '𝑹', 3: '𝖱', 4: '𝗥', 5: '𝘙', 6: '𝙍', 7: 'ℛ', 8: '𝓡', 9: 'ℜ', 10: '𝕽', 11: '𝚁', 12: 'ℝ'},
		'S': { 0: '𝐒', 1: '𝑆', 2: '𝑺', 3: '𝖲', 4: '𝗦', 5: '𝘚', 6: '𝙎', 7: '𝒮', 8: '𝓢', 9: '𝔖', 10: '𝕾', 11: '𝚂', 12: '𝕊'},
		'T': { 0: '𝐓', 1: '𝑇', 2: '𝑻', 3: '𝖳', 4: '𝗧', 5: '𝘛', 6: '𝙏', 7: '𝒯', 8: '𝓣', 9: '𝔗', 10: '𝕿', 11: '𝚃', 12: '𝕋'},
		'U': { 0: '𝐔', 1: '𝑈', 2: '𝑼', 3: '𝖴', 4: '𝗨', 5: '𝘜', 6: '𝙐', 7: '𝒰', 8: '𝓤', 9: '𝔘', 10: '𝖀', 11: '𝚄', 12: '𝕌'},
		'V': { 0: '𝐕', 1: '𝑉', 2: '𝑽', 3: '𝖵', 4: '𝗩', 5: '𝘝', 6: '𝙑', 7: '𝒱', 8: '𝓥', 9: '𝔙', 10: '𝖁', 11: '𝚅', 12: '𝕍'},
		'W': { 0: '𝐖', 1: '𝑊', 2: '𝑾', 3: '𝖶', 4: '𝗪', 5: '𝘞', 6: '𝙒', 7: '𝒲', 8: '𝓦', 9: '𝔚', 10: '𝖂', 11: '𝚆', 12: '𝕎'},
		'X': { 0: '𝐗', 1: '𝑋', 2: '𝑿', 3: '𝖷', 4: '𝗫', 5: '𝘟', 6: '𝙓', 7: '𝒳', 8: '𝓧', 9: '𝔛', 10: '𝖃', 11: '𝚇', 12: '𝕏'},
		'Y': { 0: '𝐘', 1: '𝑌', 2: '𝒀', 3: '𝖸', 4: '𝗬', 5: '𝘠', 6: '𝙔', 7: '𝒴', 8: '𝓨', 9: '𝔜', 10: '𝖄', 11: '𝚈', 12: '𝕐'},
		'Z': { 0: '𝐙', 1: '𝑍', 2: '𝒁', 3: '𝖹', 4: '𝗭', 5: '𝘡', 6: '𝙕', 7: '𝒵', 8: '𝓩', 9: 'ℨ', 10: '𝖅', 11: '𝚉', 12: 'ℤ'},
		'a': { 0: '𝐚', 1: '𝑎', 2: '𝒂', 3: '𝖺', 4: '𝗮', 5: '𝘢', 6: '𝙖', 7: '𝒶', 8: '𝓪', 9: '𝔞', 10: '𝖆', 11: '𝚊', 12: '𝕒'},
		'b': { 0: '𝐛', 1: '𝑏', 2: '𝒃', 3: '𝖻', 4: '𝗯', 5: '𝘣', 6: '𝙗', 7: '𝒷', 8: '𝓫', 9: '𝔟', 10: '𝖇', 11: '𝚋', 12: '𝕓'},
		'c': { 0: '𝐜', 1: '𝑐', 2: '𝒄', 3: '𝖼', 4: '𝗰', 5: '𝘤', 6: '𝙘', 7: '𝒸', 8: '𝓬', 9: '𝔠', 10: '𝖈', 11: '𝚌', 12: '𝕔'},
		'd': { 0: '𝐝', 1: '𝑑', 2: '𝒅', 3: '𝖽', 4: '𝗱', 5: '𝘥', 6: '𝙙', 7: '𝒹', 8: '𝓭', 9: '𝔡', 10: '𝖉', 11: '𝚍', 12: '𝕕'},
		'e': { 0: '𝐞', 1: '𝑒', 2: '𝒆', 3: '𝖾', 4: '𝗲', 5: '𝘦', 6: '𝙚', 7: 'ℯ', 8: '𝓮', 9: '𝔢', 10: '𝖊', 11: '𝚎', 12: '𝕖'},
		'f': { 0: '𝐟', 1: '𝑓', 2: '𝒇', 3: '𝖿', 4: '𝗳', 5: '𝘧', 6: '𝙛', 7: '𝒻', 8: '𝓯', 9: '𝔣', 10: '𝖋', 11: '𝚏', 12: '𝕗'},
		'g': { 0: '𝐠', 1: '𝑔', 2: '𝒈', 3: '𝗀', 4: '𝗴', 5: '𝘨', 6: '𝙜', 7: 'ℊ', 8: '𝓰', 9: '𝔤', 10: '𝖌', 11: '𝚐', 12: '𝕘'},
		'h': { 0: '𝐡', 1: 'ℎ', 2: '𝒉', 3: '𝗁', 4: '𝗵', 5: '𝘩', 6: '𝙝', 7: '𝒽', 8: '𝓱', 9: '𝔥', 10: '𝖍', 11: '𝚑', 12: '𝕙'},
		'i': { 0: '𝐢', 1: '𝑖', 2: '𝒊', 3: '𝗂', 4: '𝗶', 5: '𝘪', 6: '𝙞', 7: '𝒾', 8: '𝓲', 9: '𝔦', 10: '𝖎', 11: '𝚒', 12: '𝕚'},
		'j': { 0: '𝐣', 1: '𝑗', 2: '𝒋', 3: '𝗃', 4: '𝗷', 5: '𝘫', 6: '𝙟', 7: '𝒿', 8: '𝓳', 9: '𝔧', 10: '𝖏', 11: '𝚓', 12: '𝕛'},
		'k': { 0: '𝐤', 1: '𝑘', 2: '𝒌', 3: '𝗄', 4: '𝗸', 5: '𝘬', 6: '𝙠', 7: '𝓀', 8: '𝓴', 9: '𝔨', 10: '𝖐', 11: '𝚔', 12: '𝕜'},
		'l': { 0: '𝐥', 1: '𝑙', 2: '𝒍', 3: '𝗅', 4: '𝗹', 5: '𝘭', 6: '𝙡', 7: '𝓁', 8: '𝓵', 9: '𝔩', 10: '𝖑', 11: '𝚕', 12: '𝕝'},
		'm': { 0: '𝐦', 1: '𝑚', 2: '𝒎', 3: '𝗆', 4: '𝗺', 5: '𝘮', 6: '𝙢', 7: '𝓂', 8: '𝓶', 9: '𝔪', 10: '𝖒', 11: '𝚖', 12: '𝕞'},
		'n': { 0: '𝐧', 1: '𝑛', 2: '𝒏', 3: '𝗇', 4: '𝗻', 5: '𝘯', 6: '𝙣', 7: '𝓃', 8: '𝓷', 9: '𝔫', 10: '𝖓', 11: '𝚗', 12: '𝕟'},
		'o': { 0: '𝐨', 1: '𝑜', 2: '𝒐', 3: '𝗈', 4: '𝗼', 5: '𝘰', 6: '𝙤', 7: 'ℴ', 8: '𝓸', 9: '𝔬', 10: '𝖔', 11: '𝚘', 12: '𝕠'},
		'p': {0: '𝐩',1: '𝑝',2: '𝒑',3: '𝗉',4: '𝗽',5: '𝘱',6: '𝙥',7: '𝓅',8: '𝓹',9: '𝔭',10: '𝖕',11: '𝚙',12: '𝕡'},
		'q': { 0: '𝐪', 1: '𝑞', 2: '𝒒', 3: '𝗊', 4: '𝗾', 5: '𝘲', 6: '𝙦', 7: '𝓆', 8: '𝓺', 9: '𝔮', 10: '𝖖', 11: '𝚚', 12: '𝕢'},
		'r': { 0: '𝐫', 1: '𝑟', 2: '𝒓', 3: '𝗋', 4: '𝗿', 5: '𝘳', 6: '𝙧', 7: '𝓇', 8: '𝓻', 9: '𝔯', 10: '𝖗', 11: '𝚛', 12: '𝕣'},
		's': { 0: '𝐬', 1: '𝑠', 2: '𝒔', 3: '𝗌', 4: '𝘀', 5: '𝘴', 6: '𝙨', 7: '𝓈', 8: '𝓼', 9: '𝔰', 10: '𝖘', 11: '𝚜', 12: '𝕤'},
		't': { 0: '𝐭', 1: '𝑡', 2: '𝒕', 3: '𝗍', 4: '𝘁', 5: '𝘵', 6: '𝙩', 7: '𝓉', 8: '𝓽', 9: '𝔱', 10: '𝖙', 11: '𝚝', 12: '𝕥'},
		'u': { 0: '𝐮', 1: '𝑢', 2: '𝒖', 3: '𝗎', 4: '𝘂', 5: '𝘶', 6: '𝙪', 7: '𝓊', 8: '𝓾', 9: '𝔲', 10: '𝖚', 11: '𝚞', 12: '𝕦'},
		'v': { 0: '𝐯', 1: '𝑣', 2: '𝒗', 3: '𝗏', 4: '𝘃', 5: '𝘷', 6: '𝙫', 7: '𝓋', 8: '𝓿', 9: '𝔳', 10: '𝖛', 11: '𝚟', 12: '𝕧'},
		'w': { 0: '𝐰', 1: '𝑤', 2: '𝒘', 3: '𝗐', 4: '𝘄', 5: '𝘸', 6: '𝙬', 7: '𝓌', 8: '𝔀', 9: '𝔴', 10: '𝖜', 11: '𝚠', 12: '𝕨'},
		'x': { 0: '𝐱', 1: '𝑥', 2: '𝒙', 3: '𝗑', 4: '𝘅', 5: '𝘹', 6: '𝙭', 7: '𝓍', 8: '𝔁', 9: '𝔵', 10: '𝖝', 11: '𝚡', 12: '𝕩'},
		'y': { 0: '𝐲', 1: '𝑦', 2: '𝒚', 3: '𝗒', 4: '𝘆', 5: '𝘺', 6: '𝙮', 7: '𝓎', 8: '𝔂', 9: '𝔶', 10: '𝖞', 11: '𝚢', 12: '𝕪'},
		'z': { 0: '𝐳', 1: '𝑧', 2: '𝒛', 3: '𝗓', 4: '𝘇', 5: '𝘻', 6: '𝙯', 7: '𝓏', 8: '𝔃', 9: '𝔷', 10: '𝖟', 11: '𝚣', 12: '𝕫'},
		'ı': {mathit: '𝚤'},
		'ȷ': {mathit: '𝚥'},
		'Α': {0: '𝚨', 1: '𝛢', 2: '𝜜', 4: '𝝖', 6: '𝞐'},
		'Β': {0: '𝚩', 1: '𝛣', 2: '𝜝', 4: '𝝗', 6: '𝞑'},
		'Γ': {0: '𝚪', 1: '𝛤', 2: '𝜞', 4: '𝝘', 6: '𝞒'},
		'Δ': {0: '𝚫', 1: '𝛥', 2: '𝜟', 4: '𝝙', 6: '𝞓'},
		'Ε': {0: '𝚬', 1: '𝛦', 2: '𝜠', 4: '𝝚', 6: '𝞔'},
		'Ζ': {0: '𝚭', 1: '𝛧', 2: '𝜡', 4: '𝝛', 6: '𝞕'},
		'Η': {0: '𝚮', 1: '𝛨', 2: '𝜢', 4: '𝝜', 6: '𝞖'},
		'Θ': {0: '𝚯', 1: '𝛩', 2: '𝜣', 4: '𝝝', 6: '𝞗'},
		'Ι': {0: '𝚰', 1: '𝛪', 2: '𝜤', 4: '𝝞', 6: '𝞘'},
		'Κ': {0: '𝚱', 1: '𝛫', 2: '𝜥', 4: '𝝟', 6: '𝞙'},
		'Λ': {0: '𝚲', 1: '𝛬', 2: '𝜦', 4: '𝝠', 6: '𝞚'},
		'Μ': {0: '𝚳', 1: '𝛭', 2: '𝜧', 4: '𝝡', 6: '𝞛'},
		'Ν': {0: '𝚴', 1: '𝛮', 2: '𝜨', 4: '𝝢', 6: '𝞜'},
		'Ξ': {0: '𝚵', 1: '𝛯', 2: '𝜩', 4: '𝝣', 6: '𝞝'},
		'Ο': {0: '𝚶', 1: '𝛰', 2: '𝜪', 4: '𝝤', 6: '𝞞'},
		'Π': {0: '𝚷', 1: '𝛱', 2: '𝜫', 4: '𝝥', 6: '𝞟'},
		'Ρ': {0: '𝚸', 1: '𝛲', 2: '𝜬', 4: '𝝦', 6: '𝞠'},
		'ϴ': {0: '𝚹', 1: '𝛳', 2: '𝜭', 4: '𝝧', 6: '𝞡'},
		'Σ': {0: '𝚺', 1: '𝛴', 2: '𝜮', 4: '𝝨', 6: '𝞢'},
		'Τ': {0: '𝚻', 1: '𝛵', 2: '𝜯', 4: '𝝩', 6: '𝞣'},
		'Υ': {0: '𝚼', 1: '𝛶', 2: '𝜰', 4: '𝝪', 6: '𝞤'},
		'Φ': {0: '𝚽', 1: '𝛷', 2: '𝜱', 4: '𝝫', 6: '𝞥'},
		'Χ': {0: '𝚾', 1: '𝛸', 2: '𝜲', 4: '𝝬', 6: '𝞦'},
		'Ψ': {0: '𝚿', 1: '𝛹', 2: '𝜳', 4: '𝝭', 6: '𝞧'},
		'Ω': {0: '𝛀', 1: '𝛺', 2: '𝜴', 4: '𝝮', 6: '𝞨'},
		'∇': {0: '𝛁', 1: '𝛻', 2: '𝜵', 4: '𝝯', 6: '𝞩'},
		'α': {0: '𝛂', 1: '𝛼', 2: '𝜶', 4: '𝝰', 6: '𝞪'},
		'β': {0: '𝛃', 1: '𝛽', 2: '𝜷', 4: '𝝱', 6: '𝞫'},
		'γ': {0: '𝛄', 1: '𝛾', 2: '𝜸', 4: '𝝲', 6: '𝞬'},
		'δ': {0: '𝛅', 1: '𝛿', 2: '𝜹', 4: '𝝳', 6: '𝞭'},
		'ε': {0: '𝛆', 1: '𝜀', 2: '𝜺', 4: '𝝴', 6: '𝞮'},
		'ζ': {0: '𝛇', 1: '𝜁', 2: '𝜻', 4: '𝝵', 6: '𝞯'},
		'η': {0: '𝛈', 1: '𝜂', 2: '𝜼', 4: '𝝶', 6: '𝞰'},
		'θ': {0: '𝛉', 1: '𝜃', 2: '𝜽', 4: '𝝷', 6: '𝞱'},
		'ι': {0: '𝛊', 1: '𝜄', 2: '𝜾', 4: '𝝸', 6: '𝞲'},
		'κ': {0: '𝛋', 1: '𝜅', 2: '𝜿', 4: '𝝹', 6: '𝞳'},
		'λ': {0: '𝛌', 1: '𝜆', 2: '𝝀', 4: '𝝺', 6: '𝞴'},
		'μ': {0: '𝛍', 1: '𝜇', 2: '𝝁', 4: '𝝻', 6: '𝞵'},
		'ν': {0: '𝛎', 1: '𝜈', 2: '𝝂', 4: '𝝼', 6: '𝞶'},
		'ξ': {0: '𝛏', 1: '𝜉', 2: '𝝃', 4: '𝝽', 6: '𝞷'},
		'ο': {0: '𝛐', 1: '𝜊', 2: '𝝄', 4: '𝝾', 6: '𝞸'},
		'π': {0: '𝛑', 1: '𝜋', 2: '𝝅', 4: '𝝿', 6: '𝞹'},
		'ρ': {0: '𝛒', 1: '𝜌', 2: '𝝆', 4: '𝞀', 6: '𝞺'},
		'ς': {0: '𝛓', 1: '𝜍', 2: '𝝇', 4: '𝞁', 6: '𝞻'},
		'σ': {0: '𝛔', 1: '𝜎', 2: '𝝈', 4: '𝞂', 6: '𝞼'},
		'τ': {0: '𝛕', 1: '𝜏', 2: '𝝉', 4: '𝞃', 6: '𝞽'},
		'υ': {0: '𝛖', 1: '𝜐', 2: '𝝊', 4: '𝞄', 6: '𝞾'},
		'φ': {0: '𝛗', 1: '𝜑', 2: '𝝋', 4: '𝞅', 6: '𝞿'},
		'χ': {0: '𝛘', 1: '𝜒', 2: '𝝌', 4: '𝞆', 6: '𝟀'},
		'ψ': {0: '𝛙', 1: '𝜓', 2: '𝝍', 4: '𝞇', 6: '𝟁'},
		'ω': {0: '𝛚', 1: '𝜔', 2: '𝝎', 4: '𝞈', 6: '𝟂'},
		'∂': {0: '𝛛', 1: '𝜕', 2: '𝝏', 4: '𝞉', 6: '𝟃'},
		'ϵ': {0: '𝛜', 1: '𝜖', 2: '𝝐', 4: '𝞊', 6: '𝟄'},
		'ϑ': {0: '𝛝', 1: '𝜗', 2: '𝝑', 4: '𝞋', 6: '𝟅'},
		'ϰ': {0: '𝛞', 1: '𝜘', 2: '𝝒', 4: '𝞌', 6: '𝟆'},
		'ϕ': {0: '𝛟', 1: '𝜙', 2: '𝝓', 4: '𝞍', 6: '𝟇'},
		'ϱ': {0: '𝛠', 1: '𝜚', 2: '𝝔', 4: '𝞎', 6: '𝟈'},
		'ϖ': {0: '𝛡', 1: '𝜛', 2: '𝝕', 4: '𝞏', 6: '𝟉'},
		'Ϝ': {0: '𝟊'},
		'ϝ': {0: '𝟋'},
		'0': {0: '𝟎', 12: '𝟘', 3: '𝟢', 4: '𝟬', 11: '𝟶'},
		'1': {0: '𝟏', 12: '𝟙', 3: '𝟣', 4: '𝟭', 11: '𝟷'},
		'2': {0: '𝟐', 12: '𝟚', 3: '𝟤', 4: '𝟮', 11: '𝟸'},
		'3': {0: '𝟑', 12: '𝟛', 3: '𝟥', 4: '𝟯', 11: '𝟹'},
		'4': {0: '𝟒', 12: '𝟜', 3: '𝟦', 4: '𝟰', 11: '𝟺'},
		'5': {0: '𝟓', 12: '𝟝', 3: '𝟧', 4: '𝟱', 11: '𝟻'},
		'6': {0: '𝟔', 12: '𝟞', 3: '𝟨', 4: '𝟲', 11: '𝟼'},
		'7': {0: '𝟕', 12: '𝟟', 3: '𝟩', 4: '𝟳', 11: '𝟽'},
		'8': {0: '𝟖', 12: '𝟠', 3: '𝟪', 4: '𝟴', 11: '𝟾'},
		'9': {0: '𝟗', 12: '𝟡', 3: '𝟫', 4: '𝟵', 11: '𝟿'},
	};

	function LexerLiterals()
	{
		this.Unicode = {};
		this.LaTeX = {};

		this.Init();
	}
	LexerLiterals.prototype.Init = function ()
	{
		let names = Object.keys(this.LaTeX);

		if (names.length < 1)
			return false;

		for (let i = 0; i < names.length; i++)
		{
			let name = names[i];
			let data = this.LaTeX[name];
			this.SetUnicodeFromLaTeX(data, name);
		}

		return true;
	};
	LexerLiterals.prototype.IsLaTeXInclude = function (name)
	{
		if (!this.LaTeX)
			return false;

		return this.LaTeX[name] !== undefined;
	};
	LexerLiterals.prototype.IsUnicodeInclude = function (name)
	{
		if (!this.Unicode)
			return false;
		return this.Unicode[name] !== undefined;
	};
	LexerLiterals.prototype.AddToLaTeX = function (name, data)
	{
		if (!this.IsLaTeXInclude(name))
			this.private_AddToLaTeX(name, data);
	};
	LexerLiterals.prototype.AddToUnicode = function (name, data)
	{
		if (!this.IsUnicodeInclude(name))
			this.private_AddToUnicode(name, data);
	};
	LexerLiterals.prototype.private_AddToLaTeX = function (name, data)
	{
		this.LaTeX[name] = data;
		this.SetUnicodeFromLaTeX(data, name);
	};
	LexerLiterals.prototype.private_AddToUnicode = function (name, data)
	{
		this.Unicode[name] = data;
		this.SetLaTeXFromUnicode(data, name);
	};
	LexerLiterals.prototype.private_GetLaTeXWord = function (arrStr)
	{
		if (!arrStr || !arrStr[0] || arrStr[0] !== "\\")
			return;

		let strFunc = "\\";

		// remove regexp
		for (let index = 1; arrStr[index] && /[a-zA-Z]/.test(arrStr[index]); index++)
			strFunc += arrStr[index];

		return strFunc;
	};
	LexerLiterals.prototype.SetUnicodeFromLaTeX= function (name, data)
	{
		this.Unicode[name] = data;
	};
	LexerLiterals.prototype.SetLaTeXFromUnicode = function (name, data)
	{
		this.LaTeX[name] = data;
	};
	LexerLiterals.prototype.GetToken = function (type, str)
	{
		if (this.GetByOneRule)
			return this.GetByOneRule(str);

		if (!type)
			return this.GetUnicodeToken(str);
		else
			return this.GetLaTeXToken(str);
	};
	LexerLiterals.prototype.GetUnicodeToken = function (str)
	{
		if (this.IsUnicodeInclude(str[0]))
			return str[0];
	};
	LexerLiterals.prototype.GetLaTeXToken = function (str)
	{
		let word = this.private_GetLaTeXWord(str);

		if (this.IsLaTeXInclude[word])
			return word;
	};
	// Search in Unicode group of tokens
	LexerLiterals.prototype.SearchU = function (str)
	{
		return this.IsUnicodeInclude(str);
	};
	// Search in LaTeX group of tokens
	LexerLiterals.prototype.SearchL = function (str)
	{
		return this.IsLaTeXInclude(str);
	};

	function TokenChars()
	{
		this.id = 0;
	}
	TokenChars.prototype = Object.create(LexerLiterals.prototype);
	TokenChars.prototype.constructor = TokenChars;
	TokenChars.prototype.GetByOneRule = function(arrStr)
	{
		if (arrStr[0])
			return arrStr[0];
	};

	function TokenNumbers()
	{
		this.id = 1;
	}
	TokenNumbers.prototype = Object.create(LexerLiterals.prototype);
	TokenNumbers.prototype.constructor = TokenNumbers;
	TokenNumbers.prototype.GetByOneRule = function (arrStr)
	{
		if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(arrStr[0]))
			return arrStr[0];
	};

	function TokenOperators()
	{
		this.id = 2;
		this.LaTeX = {
			"\\angle" : "∠",
			"\\approx" : "≈",
			"\\ast" : "∗",
			"\\asymp" : "≍",
			"\\because" : "∵",
			"\\bot" : "⊥",
			"\\bowtie" : "⋈",
			"\\bullet" : "∙",
			"\\cap" : "∩",
			"\\cdot" : "⋅",
			"\\cdots" : "⋯",
			"\\circ" : "∘",
			"\\clubsuit" : "♣",
			"\\cong" : "≅",
			"\\cup" : "∪",
			"\\ddots" : "⋱",
			"\\diamond" : "⋄",
			"\\diamondsuit" : "♢",
			"\\div" : "÷",
			"\\doteq" : "≐",
			"\\dots" : "…",
			"\\Downarrow" : "⇓",
			"\\downarrow" : "↓",
			"\\equiv" : "≡",
			"\\exists" : "∃",
			"\\forall" : "∀",
			"\\ge" : "≥",
			"\\geq" : "≥",
			"\\gg" : "≫",
			"\\heartsuit" : "♡",
			"\\in" : "∈",
			"\\ldots" : "…",
			"\\le" : "≤",
			"\\leq" : "≤",
			"\\ll" : "≪",
			"\\Longleftarrow" : "⟸",
			"\\longleftarrow" : "⟵",
			"\\Longleftrightarrow" : "⟺",
			"\\longleftrightarrow" : "⟷",
			"\\Longrightarrow" : "⟹",
			"\\longrightarrow" : "⟶",
			"\\naryand" : "▒",
			"\\ne" : "≠",
			"\\nearrow" : "↗",
			"\\neg" : "¬",
			"\\neq" : "≠",
			"\\ni" : "∋",
			"\\nwarrow" : "↖",
			"\\odot" : "⊙",
			"\\of" : "▒",
			"\\ominus" : "⊖",
			"\\oplus" : "⊕",
			"\\oslash" : "⊘",
			"\\otimes" : "⊗",
			"\\parallel" : "∥",
			"\\prcue" : "≼",
			"\\prec" : "≺",
			"\\preceq" : "⪯",
			"\\preccurlyeq" : "≼",
			"\\propto" : "∝",
			"\\ratio" : "∶",
			"\\rddots" : "⋰",
			"\\searrow" : "↙",
			"\\setminus" : "∖",
			"\\sim" : "∼",
			"\\simeq" : "≃",
			"\\sqcap" : "⊓",
			"\\sqcup" : "⊔",
			"\\sqsubseteq" : "⊑",
			"\\sqsuperseteq" : "⊒",
			"\\star" : "⋆",
			"\\subset" : "⊂",
			"\\subseteq" : "⊆",
			"\\succ" : "≻",
			"\\succeq" : "≽",
			"\\superset" : "⊃",
			"\\superseteq" : "⊇",
			"\\swarrow" : "↘",
			"\\therefore" : "∴",
			"\\times" : "×",
			"\\top" : "⊤",
			"\\Uparrow" : "⇑",
			"\\uparrow" : "↑",
			"\\Updownarrow" : "⇕",
			"\\updownarrow" : "↕",
			"\\uplus" : "⊎",
			"\\vdots" : "⋮",
			"\\vee" : "∨",
			"\\wedge" : "∧",
			"\\wr" : "≀",
			"\\boxdot" : "⊡",
			"\\boxminus" : "⊟",
			"\\boxplus" : "⊞",
			"\\defeq" : "≝",
			"\\degc" : "℃",
			"\\degf" : "℉",
			"\\Deltaeq": "≜",
			"\\frown": "⌑",
			"\\mp" : "∓",
			"\\notcontain" : "∌",
			"\\notelement" : "∉",
			"\\notin" : "∉",
		};
		this.Unicode = {
			"⁣" : 1,
			"⁤" : 1,
			"⨯" : 1,
			"⨝" : 1,
			"⟕" : 1,
			"⟖" : 1,
			"⟗" : 1,
			"⋉" : 1,
			"⋊" : 1,
			"▷" : 1,
			"+" : 1,
			"-" : 1,
			"*" : 1,
			"=" : 1,
			"≶" : 1,
			"≷" : 1,
		};
		this.Init();
	}
	TokenOperators.prototype = Object.create(LexerLiterals.prototype);
	TokenOperators.prototype.constructor = TokenOperators;

	function TokenOperand()
	{
		this.id = 3;
		this.LaTeX = {
			"\\aleph" : "ℵ",
			"\\alpha" : "α",
			"\\Alpha" : "Α",
			"\\beta" : "β",
			"\\beth" : "ℶ",
			"\\bet" : "ℶ",
			"\\chi" : "χ",
			"\\daleth" : "ℸ",
			"\\Dd" : "ⅅ",
			"\\dd" : "ⅆ",
			"\\degree" : "°",
			"\\Delta" : "Δ",
			"\\delta" : "δ",
			"\\ee" : "ⅇ",
			"\\ell" : "ℓ",
			"\\emptyset" : "∅",
			"\\epsilon" : "ϵ",
			"\\eta" : "η",
			"\\Gamma" : "Γ",
			"\\G" : "Γ",
			"\\gamma" : "γ",
			"\\gimel" : "ℷ",
			"\\hbar" : "ℏ",
			"\\ii" : "ⅈ",
			"\\Im" : "ℑ",
			"\\imath" : "ı",
			"\\inc" : "∆",
			"\\infty" : "∞",
			"\\iota" : "ι",
			"\\jj" : "ⅉ",
			"\\jmath" : "ȷ",
			"\\kappa" : "κ",
			"\\Lambda" : "Λ",
			"\\lambda" : "λ",
			"\\mu" : "μ",
			"\\nabla" : "∇",
			"\\nu" : "ν",
			"\\Omega" : "Ω",
			"\\omega" : "ω",
			"\\partial" : "∂",
			"\\Phi" : "Φ",
			"\\phi" : "π",
			"\\Psi" : "Ψ",
			"\\psi" : "ψ",
			"\\Re" : "ℜ",
			"\\rho" : "ρ",
			"\\Sigma" : "Σ",
			"\\sigma" : "σ",
			"\\tau" : "τ",
			"\\Theta" : "Θ",
			"\\theta" : "θ",
			"\\Upsilon" : "Υ",
			"\\upsilon" : "υ",
			"\\varepsilon" : "ε",
			"\\varphi" : "φ",
			"\\varpi" : "ϖ",
			"\\varrho" : "ϱ",
			"\\varsigma" : "ς",
			"\\vartheta" : "ϑ",
			"\\wp" : "℘",
			"\\Xi" : "Ξ",
			"\\xi" : "ξ",
			"\\zeta" : "ζ",
			"\\Beta"		:	"Β",
			"\\Epsilon"		:	"Ε",
			"\\Zeta"		:	"Ζ",
			"\\Eta"			: 	"Η",
			"\\Iota"		:	"Ι",
			"\\Kappa"		:	"Κ",
			"\\Mu"			:	"Μ",
			"\\Nu"			:	"Ν",
			"\\O"			: 	"Ο",
			"\\o"			:	"ο",
			"\\pi"			:	"π",
			"\\Pi"			:	"Π",
			"\\Rho"			:	"Ρ",
			"\\Tau"			:	"Τ",
			"\\Chi"			:	"Χ",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenOperand.prototype = Object.create(LexerLiterals.prototype);
	TokenOperand.prototype.constructor = TokenOperand;

	function TokenOpenBrackets()
	{
		this.id = 4;
		this.Unicode = {
			"(" : 1,
		};
		this.LaTeX = {
			"\\begin" : "〖",
			"\\bra" : "⟨",
			"\\langle" : "⟨",
			"\\lbrace" : "{",
			"\\lbrack" : "[",
			"\\lceil" : "⌈",
			"\\lfloor" : "⌊",
			"\\open" : "├",
			"\\lbbrack" : "⟦",
			"\\lmoust" : "⎰",

		};
		this.Init();
	}
	TokenOpenBrackets.prototype = Object.create(LexerLiterals.prototype);
	TokenOpenBrackets.prototype.constructor = TokenOpenBrackets;

	function TokenCloseBrackets()
	{
		this.id = 5;
		this.Unicode = {
			")" : 1,
			"⟫" : 1,
			"⟧" : 1,
		};
		this.LaTeX = {
			"\\close" : "┤",
			"\\end" : "〗",
			"\\ket" : "⟩",
			"\\rangle" : "⟩",
			"\\rbrace" : "}",
			"\\rbrack" : "]",
			"\\rceil" : "⌉",
			"\\rfloor" : "⌋",
		};
		this.Init();
	}
	TokenCloseBrackets.prototype = Object.create(LexerLiterals.prototype);
	TokenCloseBrackets.prototype.constructor = TokenCloseBrackets;

	function TokenOpenCloseBrackets()
	{
		this.id = 6;
		this.Unicode = {};
		this.LaTeX = {
			"\\norm" : "‖",
			"\\Vert" : "‖",
			"\\vert" : "|",
		};
		this.Init();
	}
	TokenOpenCloseBrackets.prototype = Object.create(LexerLiterals.prototype);
	TokenOpenCloseBrackets.prototype.constructor = TokenOpenCloseBrackets;

	function TokenPhantom()
	{
		this.id = 7;
		this.LaTeX = {
			"\\asmash" : "⬆",
			"\\dsmash" : "⬇",
			"\\hphantom" : "⬄",
			"\\hsmash" : "⬌",
			"\\phantom" : "⟡",
			"\\smash" : "⬍",
			"\\vphantom" : "⇳",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenPhantom.prototype = Object.create(LexerLiterals.prototype);
	TokenPhantom.prototype.constructor = TokenPhantom;

	function TokenHorizontalStretch()
	{
		this.id = 8;
		this.LaTeX = {
			"\\dashv" : "⊣",
			"\\gets" : "←",
			"\\hookleftarrow" : "↩",
			"\\hookrightarrow" : "↪",
			"\\Leftarrow" : "⇐",
			"\\leftarrow" : "←",
			"\\leftharpoondown" : "↽",
			"\\leftharpoonup" : "↼",
			"\\Leftrightarrow" : "⇔",
			"\\leftrightarrow" : "↔",
			"\\mapsto" : "↦",
			"\\models" : "⊨",
			"\\Rightarrow" : "⇒",
			"\\rightarrow" : "→",
			"\\rightharpoondown" : "⇁",
			"\\rightharpoonup" : "⇀",
			"\\to" : "→",
			"\\vdash" : "⊢",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenHorizontalStretch.prototype = Object.create(LexerLiterals.prototype);
	TokenHorizontalStretch.prototype.constructor = TokenHorizontalStretch;

	function TokenOverbar()
	{
		this.id = 9;
		this.LaTeX = {
			"\\overbar" : "¯",
			"\\overbrace" : "⏞",
			"\\overparen" : "⏜",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenOverbar.prototype = Object.create(LexerLiterals.prototype);
	TokenOverbar.prototype.constructor = TokenOverbar;

	function TokenUnderbar()
	{
		this.id = 10;
		this.LaTeX = {
			"\\underbar" : "▁",
			"\\underbrace" : "⏟",
			"\\underparen" : "⏝",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenUnderbar.prototype = Object.create(LexerLiterals.prototype);
	TokenUnderbar.prototype.constructor = TokenUnderbar;

	function TokenDivide()
	{
		this.id = 11;
		this.LaTeX = {
			"\\atop" : "¦",
			"\\ndiv" : "⊘",
			"\\over" : "/",
			"\\sdiv" : "⁄",
			"\\ldiv" : "∕",
			"\\ldivide" : "∕",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenDivide.prototype = Object.create(LexerLiterals.prototype);
	TokenDivide.prototype.constructor = TokenDivide;

	function TokenEqArray()
	{
		this.id = 12;
		this.LaTeX = {
			"\\eqarray" : "■",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenEqArray.prototype = Object.create(LexerLiterals.prototype);
	TokenEqArray.prototype.constructor = TokenEqArray;

	function TokenMarker()
	{
		this.id = 13;
		this.LaTeX = {
			"\\eqno" : "#",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenMarker.prototype = Object.create(LexerLiterals.prototype);
	TokenMarker.prototype.constructor = TokenMarker;

	function TokenSubSup()
	{
		this.id = 14;
		this.LaTeX = {
			"\\above" : "┴",
			"\\below" : "┬",
			"\\pppprime" : "⁗",
			"\\ppprime" : "‴",
			"\\pprime" : "″",
			"\\prime" : "′",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenSubSup.prototype = Object.create(LexerLiterals.prototype);
	TokenSubSup.prototype.constructor = TokenSubSup;

	function TokenNary()
	{
		this.id = 15;
		this.Unicode = {
			"⅀" : null,
			"⨊" : null,
			"⨋" : null,
			"∱" : null,
			"⨑" : null,
			"⨍" : null,
			"⨎" : null,
			"⨏" : null,
			"⨕" : null,
			"⨖" : null,
			"⨗" : null,
			"⨘" : null,
			"⨙" : null,
			"⨚" : null,
			"⨛" : null,
			"⨜" : null,
			"⨒" : null,
			"⨓" : null,
			"⨔" : null,
			"⨃" : null,
			"⨅" : null,
			"⨉" : null,
			"⫿" : null,
		};
		this.LaTeX = {
			"\\amalg" : "∐",
			"\\aoint": "∳",
			"\\bigcap" : "⋂",
			"\\bigcup" : "⋃",
			"\\bigodot" : "⨀",
			"\\bigoplus" : "⨁",
			"\\bigotimes" : "⨂",
			"\\bigsqcup" : "⨆",
			"\\biguplus" : "⨄",
			"\\bigvee" : "⋁",
			"\\bigwedge" : "⋀",
			"\\coint" : "∲",
			"\\iiiint" : "⨌",
			"\\iiint" : "∭",
			"\\iint" : "∬",
			"\\int" : "∫",
			"\\oiiint" : "∰",
			"\\oiint" : "∯",
			"\\oint" : "∮",
			"\\prod" : "∏",
			"\\sum" : "∑",
		};
		this.Init();
	}
	TokenNary.prototype = Object.create(LexerLiterals.prototype);
	TokenNary.prototype.constructor = TokenNary;

	function TokenRadical()
	{
		this.id = 16;
		this.Unicode = {};
		this.LaTeX = {
			"\\cbrt" : "∛",
			"\\qdrt" : "∜",
			"\\sqrt" : "√",
		};
		this.Init();
	}
	TokenRadical.prototype = Object.create(LexerLiterals.prototype);
	TokenRadical.prototype.constructor = TokenRadical;

	function TokenRrect()
	{
		this.id = 17;
		this.Unicode = {};
		this.LaTeX = {
			"\\rrect" : "▢",
		};
		this.Init();
	}
	TokenRrect.prototype = Object.create(LexerLiterals.prototype);
	TokenRrect.prototype.constructor = TokenRrect;

	function TokenDelimiter()
	{
		this.id = 18;
		this.Unicode = {};
		this.LaTeX = {
			"\\mid" : "∣",
			"\\vbar" : "│",

		};
		this.Init();
	}
	TokenDelimiter.prototype = Object.create(LexerLiterals.prototype);
	TokenDelimiter.prototype.constructor = TokenDelimiter;

	function TokenAccent()
	{
		this.id = 19;
		this.name = "AccentLiterals";
		this.LaTeX = {
			"\\hat": "̂",
			"\\widehat": "̂",
			"\\check": "̌",
			"\\tilde": "̃",
			"\\widetilde": "～",
			"\\acute": "́",
			"\\grave": "̀",
			"\\dot": "̇",
			"\\ddddot" : "⃜",
			"\\ddot": "̈",
			"\\dddot": "⃛",
			"\\breve": "̆",
			"\\bar": "̅",
			"\\Bar": "̿",
			"\\vec": "⃗",
			"\\lhvec" : "⃐",
			"\\hvec" : "⃑",
			"\\tvec" : "⃡",
			"\\lvec" : "⃖",

		};
		this.Unicode = {};

		this.Init();
	}
	TokenAccent.prototype = Object.create(LexerLiterals.prototype);
	TokenAccent.prototype.IsUnicodeToken = function (str)
	{
		if (!str || !str[0])
			return;

		let strFirstSymbol = str[0];

		let code = strFirstSymbol.charCodeAt(0);
		const isFirstBlocks = function (code) {
			return code >= 768 && code <= 879
		}
		const isSecondBlocks = function (code) {
			return code >= 8400 && code <= 8447
		}

		if (isFirstBlocks(code) || isSecondBlocks(code))
			return strFirstSymbol;
	};

	function TokenBox()
	{
		this.id = 20;
		this.Unicode = {};
		this.LaTeX = {
			"\\box" : "□"
		};
		this.Init();
	}
	TokenBox.prototype = Object.create(LexerLiterals.prototype);
	TokenBox.prototype.constructor = TokenBox;

	function TokenMatrix()
	{
		this.id = 21;
		this.data = ["⒩", "■"];
		this.Unicode = {};
		this.LaTeX = {
			"\\matrix" : "■",

		};
		this.Init();
	}
	TokenMatrix.prototype = Object.create(LexerLiterals.prototype);
	TokenMatrix.prototype.constructor = TokenMatrix;

	function TokenRect()
	{
		this.id = 22;
		this.Unicode = {};
		this.LaTeX = {
			"\\rect" : "▭",
		};
		this.Init();
	}
	TokenRect.prototype = Object.create(LexerLiterals.prototype);
	TokenRect.prototype.constructor = TokenRect;

	function TokenSpace()
	{
		this.id = 23;
		this.Unicode = {
			"  " 	: 	1,			// 2/18em space  very thin math space
			"  "	:	1,			// 7/18em space  very very thick math space
			" "			:	1,
			"\t"		:	1,
			"\n"		:	1,
			" "		:	1,
			"‌"		:	1,
		};
		this.LaTeX = {
			"\\nbsp"	:	" ",		// space width && no-break space
			"\\numsp"	:	" ",		// digit width
			"\\emsp"	:	" ",		// 18/18 em
			"\\ensp"	:	" ",		// 9/18 em
			"\\vthicksp":	" ",	// 6/18 em verythickmathspace
			"\\thicksp"	:	" ",	// 5/18 em thickmathspace
			"\\medsp"	:	" ",		// 4/18 em mediummathspace
			"\\thinsp"	:	" ",		// 3/18 em thinmathspace
			"\\hairsp"	:	" ",		// 3/18 em veryverythinmathspace
			"\\zwsp"	: 	"​",
			"\\zwnj"	: 	"‌",
		};
		this.Init();
	}
	TokenSpace.prototype = Object.create(LexerLiterals.prototype);
	TokenSpace.prototype.constructor = TokenSpace;

	function TokenLaTeXWords()
	{
		this.id = 24;
		this.isClassEqalData = true;
	}
	TokenLaTeXWords.prototype = Object.create(LexerLiterals.prototype);
	TokenLaTeXWords.prototype.constructor = TokenLaTeXWords;
	TokenLaTeXWords.prototype.SearchForLaTeXToken = function (arrStr)
	{
		return this.private_GetLaTeXWord(arrStr);
	};

	function TokenFunctionLiteral()
	{
		this.id = 25;
	}
	TokenFunctionLiteral.prototype = Object.create(LexerLiterals.prototype);
	TokenFunctionLiteral.prototype.constructor = TokenFunctionLiteral;
	TokenFunctionLiteral.prototype.IsLaTeX = function (str)
	{
		if (MathAutoCorrectionFuncNames.includes(str.slice(1)) || limitFunctions.includes(str.slice(1)))
			return str;
	};

	function TokenSpecialLiteral()
	{
		this.id = 26;
		this.isClassEqalData = true;
		this.Unicode = {
			"_" : 1,
			"^": 1,
			"┬" : 1,
			"┴" : 1,
			"&" : 1,
			"@" : 1,
		};
		this.LaTeX = {
			"\\cases" : "Ⓒ",
			"\\j" : "Jay",
		}

	}
	TokenSpecialLiteral.prototype = Object.create(LexerLiterals.prototype);
	TokenSpecialLiteral.prototype.constructor = TokenSpecialLiteral;

	function TokenOther()
	{
		this.id = 27;
		this.Unicode = {};
		this.LaTeX = {};
		this.Init();
	}
	TokenOther.prototype = Object.create(LexerLiterals.prototype);
	TokenOther.prototype.constructor = TokenOther;
	TokenOther.prototype.GetUnicodeToken = function(arrStr)
	{
		let intCode = GetFixedCharCodeAt(arrStr[0]);
		if (intCode >= 0x1D400 && intCode <= 0x1D7FF)
			return arrStr[0];
	};

	function TokenHorizontalBrackets()
	{
		this.id = 28;
		this.LaTeX = {
			"\\overparen": "⏜",
			"\\underparen": "⏝",
			"\\overbrace": "⏞",
			"\\overline": "¯",
			"\\underbrace": "⏟",
			"\\overshell": "⏠",
			"\\undershell": "⏡",
			"\\overbracket": "⎴",
			"\\underbracket": "⎵",
		};
		this.Unicode = {};
		this.Init();
	}
	TokenHorizontalBrackets.prototype = Object.create(LexerLiterals.prototype);
	TokenHorizontalBrackets.prototype.constructor = TokenHorizontalBrackets;

	function TokenInvisibleOperators()
	{
		this.id = 29;
		this.Unicode = {};
		this.LaTeX = {
			"\\funcapply" : "⁡",  // Invisible function application
			"\\itimes" : "⁢",
		};
		this.Init();
	}
	TokenInvisibleOperators.prototype = Object.create(LexerLiterals.prototype);
	TokenInvisibleOperators.prototype.constructor = TokenInvisibleOperators;

	function TokenAlphanumeric()
	{
		this.id = 30;
		this.Unicode = {};
		this.LaTeX = {};
		this.Init();
	}
	TokenAlphanumeric.prototype = Object.create(LexerLiterals.prototype);
	TokenAlphanumeric.prototype.constructor = TokenAlphanumeric;
	TokenAlphanumeric.prototype.GetUnicodeToken = function(arrStr)
	{
		let intCode = GetFixedCharCodeAt(arrStr[0]);
		if (intCode >= 0x1D400 && intCode <= 0x1D7FF || intCode >= 0x2102 && intCode <= 0x2134)
			return arrStr[0];
	};

	function TokenFont()
	{
		this.id = 31;
		this.Unicode = {};
		this.LaTeX = {};
		this.Init();
	}
	TokenFont.prototype = Object.create(LexerLiterals.prototype);
	TokenFont.prototype.constructor = TokenFont;
	TokenFont.prototype.GetTypes = function ()
	{
		return {
			"\\sf": 3,
			"\\script": 7,
			"\\scr": 7,
			"\\rm": -1,
			"\\oldstyle": 7,
			"\\mathtt": 11,
			"\\mathsfit": 5,
			"\\mathsfbfit": 6,
			"\\mathsfbf": 4,
			"\\mathsf": 3,
			"\\mathrm": -1,
			"\\mathit": 1,
			"\\mathfrak": 9,
			"\\mathcal": 7,
			"\\mathbfit": 2,
			"\\mathbffrak": 10,
			"\\mathbfcal": 8,
			"\\mathbf": 0,
			"\\mathbb": 12,
			"\\it": 1,
			"\\fraktur": 9,
			"\\frak": 9,
			"\\double": 12,
		}
	};

	//---------------------------------------Initialize data for Tokenizer----------------------------------------------
	// List of tokens types for parsers processing
	const MathLiterals = {
		lBrackets: 		new TokenOpenBrackets(),
		rBrackets: 		new TokenCloseBrackets(),
		lrBrackets: 	new TokenOpenCloseBrackets(),
		operator:		new TokenOperators(),
		operand:		new TokenOperand(),
		nary: 			new TokenNary(),
		accent: 		new TokenAccent(),
		radical: 		new TokenRadical(),
		divide: 		new TokenDivide(),
		box: 			new TokenBox(),
		rect:			new TokenRect(),
		matrix: 		new TokenMatrix(),
		space: 			new TokenSpace(),
		char:			new TokenChars(),
		number:			new TokenNumbers(),
		LaTeX:			new TokenLaTeXWords(),
		func:			new TokenFunctionLiteral(),
		subSup:			new TokenSubSup(),
		special:		new TokenSpecialLiteral(),
		overbar:		new TokenOverbar(),
		underbar:		new TokenUnderbar(),
		other:			new TokenOther(),
		invisible:		new TokenInvisibleOperators(),
		alphanumeric:	new TokenAlphanumeric(),
		font:			new TokenFont(),
		//horizontal: 	new TokenHorizontalStretch()
	};

	// The array defines the sequence in which the tokens are checked by the lexer
	// the higher an element is, the lower its priority
	const arrTokensCheckerList = [
		MathLiterals.char,
		MathLiterals.special,
		MathLiterals.number,
		MathLiterals.accent,
		MathLiterals.space,
		MathLiterals.operator,
		MathLiterals.operand,
		MathLiterals.lBrackets,
		MathLiterals.rBrackets,
		MathLiterals.lrBrackets,
		MathLiterals.underbar,
		MathLiterals.divide,
		MathLiterals.invisible,
		MathLiterals.radical,
		MathLiterals.other,
		MathLiterals.alphanumeric,
		MathLiterals.LaTeX,
		MathLiterals.func,
	];

	//-------------------------------------Generating AutoCorrection Rules----------------------------------------------

	// Special autocorrection elements (doesn't start with //)
	const SpecialAutoCorrection = {
		"!!" : "‼",
		"...": "…",
		"::" : "∷",
		":=" : "≔",

		"~=" : "≅",
		"+-" : "±",
		"-+" : "∓",
		"<<" : "≪",
		"<=" : "≤",
		"->" : "→",
		">=" : "≥",
		">>" : "≫",
		"/<" : "≮",
		"/=" : "≠",
	};
	const MathAutoCorrectionLong = {
		"\\binomial" : "(a+b)^n=∑_(k=0)^n ▒(n¦k)a^k b^(n-k)",
		"\\integral": "1/2π ∫_0^2π ▒ⅆθ/(a+b sin θ)=1/√(a^2-b^2)",
		"\\identitymatrix": "(■(1&0&0@0&1&0@0&0&1))",
		"\\break": "⤶",
		"\\limit" : "lim_(n→∞)⁡〖(1+1/n)^n〗=e",
	}

	// Generate autocorrection rules
	function MathAutoCorrectionList()
	{
		this.arrRuleList = [];
		this.oGeneralRules = {};
		this.oSpecialList = {};
		this.GenerateTokens();

		return this;
	}
	MathAutoCorrectionList.prototype.AddObjectToGeneral = function (oObj)
	{
		this.oGeneralRules = Object.assign(this.oGeneralRules, oObj);
	}
	MathAutoCorrectionList.prototype.AddData = function (name, data)
	{
		this.oGeneralRules[name] = data;
	}
	MathAutoCorrectionList.prototype.GenerateTokens = function ()
	{
		this.GenerateAutoCorrectionList();
		this.GenerateTokensByFont();
		this.GenerateSpecialRules();
		this.GenerateCustomRules();

		const CheckSort = function (a,b)
		{
			if (a[0] < b[0])
			{
				return -1;
			}
			else if (a[0] > b[0])
			{
				return 1;
			}

			return 0;
		};
		const IsSpecialRule = function(rule)
		{
			return rule[0][0] !== "\\";
		}

		for (let i = 0; i < this.arrRuleList.length; i++)
		{
			let arrCurrentRule = this.arrRuleList[i];
			if (IsSpecialRule(arrCurrentRule))
			{
				let strName = arrCurrentRule[0];
				let oData 	= arrCurrentRule[1];
				this.oSpecialList[strName] = oData;
			}
		}

		console.log(this.oSpecialList);

		this.arrRuleList.sort(CheckSort);
	};
	MathAutoCorrectionList.prototype.GenerateTokensByFont = function ()
	{
		let arr_Literals = [
			'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
		];

		let oFontTypes = MathLiterals.font.GetTypes();
		let name = Object.keys(oFontTypes);

		for (let j = 0; j < name.length; j++)
		{
			let indexOfFont = oFontTypes[name[j]];
			for (let i = 0; i < arr_Literals.length; i++)
			{
				let Current = GetMathFontChar[arr_Literals[i]];
				if (Current[indexOfFont])
				{
					let strName = name[j] + arr_Literals[i];
					let intData = Current[indexOfFont].codePointsArray([]);
					let arrCorrectionRule = [strName, intData];
					this.AddData(strName, intData);
					this.arrRuleList.push(arrCorrectionRule);
				}
			}
		}
	};
	MathAutoCorrectionList.prototype.GenerateSpecialRules = function ()
	{
		let name = Object.keys(MathAutoCorrectionLong);

		for (let j = 0; j < name.length; j++)
		{
			let strName = name[j];
			let strData = AscCommon.convertUTF16toUnicode(MathAutoCorrectionLong[strName]);
			let arrAutoCorrectionRule = [strName, strData];

			this.arrRuleList.push(arrAutoCorrectionRule);
		}
	};
	MathAutoCorrectionList.prototype.GenerateAutoCorrectionList = function ()
	{
		let names = Object.keys(MathLiterals);

		for (let i = 0; i < names.length; i++)
		{
			let name = names[i];
			let oData = MathLiterals[name].LaTeX;

			if (oData)
			{
				let innerNames = Object.keys(oData);
				for (let i = 0; i < innerNames.length; i++)
				{
					let strName = innerNames[i];
					let strData = AscCommon.convertUTF16toUnicode(oData[strName]);

					if (strData)
					{
						let arrRule = [strName, strData]
						this.AddData(strName, strData);
						this.arrRuleList.push(arrRule);
					}
				}
			}
		}
	};
	MathAutoCorrectionList.prototype.GenerateCustomRules = function ()
	{
		let name = Object.keys(SpecialAutoCorrection);

		for (let j = 0; j < name.length; j++)
		{
			let strName = name[j];
			let strData = AscCommon.convertUTF16toUnicode(SpecialAutoCorrection[strName]);
			let arrAutoCorrectionRule = [strName, strData];

			this.AddData(strName, strData);
			this.arrRuleList.push(arrAutoCorrectionRule);
		}
	};

	// Array defining which words cannot be corrected during LaTeX processing
	const arrDoNotConvertWordsForLaTeX = [
		"\\left", "\\right",
		"\\array",
		"\\begin", "\\end",
		"\\matrix",
		"\\below", "\\above",
		"\\box", "\\fbox", "\\rect",

		"\\sum", "\\prod", "\\amalg", "\\coprod", "\\bigwedge",
		"\\bigvee", "\\bigcup", "\\bigcap", "\\bigsqcup", "\\biguplus",
		"\\bigodot", "\\bigoplus", "\\bigotimes",
		"\\int", "\\iint", "\\iiint", "\\iiiint", "\\oint", "\\oiint",
		"\\oiiint", "\\coint", "\\aouint",
	];

	let oMathAutoCorrection = new MathAutoCorrectionList();

	// Default list of autocorrection elements
	let AutoCorrectionList = oMathAutoCorrection.arrRuleList;

	// Array with function names for autocorrection
	const MathAutoCorrectionFuncNames = [
		'arcsin', 'asin', 'sin', 'arcsinh', 'asinh', 'sinh',
		'arcsec', 'sec', 'asec', 'arcsech', 'asech','sech',
		'arccos', 'acos', 'cos', 'arccosh','acosh', 'cosh',
		'arccsc', 'acsc', 'csc', 'arccsch', 'acsch', 'csch',
		'arctan', 'atan', 'tan', 'arctanh', 'atanh', 'tanh',
		'arccot', 'acot', 'cot', 'arccoth', 'acoth', 'coth',
		'arg', 'det', 'exp', 'inf', 'lim', 'min',
		'def', 'dim', 'gcd', 'ker', 'log', 'Pr',
		'deg', 'erf', 'hom', 'lg', 'ln', 'max', 'sup', "ker",
		'hom', 'sgn',
	];

	// List of structures types that generate parsers
	const MathStructures = {
		char:	0,
		space:	1,
		number: 2,
		other:	3,
		frac: 	5,
		bracket_block: 6,
		minus: 	7,
		plain: 	8,
		bar:	9,
		nary:	10,
		box:	11,
		rect:	12,
		radical:13,
		func: 	14,
		pre_script: 15,
		sub_sub: 16,
		func_lim: 18,
		below_above: 19,
		diacritic_base: 20,
		matrix: 21,
		accent: 22,
		horizontal_bracket: 23,
	};

	const limitFunctions = [];

	const UnicodeSpecialScript = {
		"⁰": "0",
		"¹": "1",
		"²": "2",
		"³": "3",
		"⁴": "4",
		"⁵": "5",
		"⁶": "6",
		"⁷": "7",
		"⁸": "8",
		"⁹": "9",
		"ⁱ": "i",
		"ⁿ": "n",
		"⁺": "+",
		"⁻": "-",
		"⁼": "=",
		"⁽": "(",
		"⁾": ")",

		"₀": "0",
		"₁": "1",
		"₂": "2",
		"₃": "3",
		"₄": "4",
		"₅": "5",
		"₆": "6",
		"₇": "7",
		"₈": "8",
		"₉": "9",
		"₊": "+",
		"₋": "-",
		"₌": "=",
		"₍": "(",
		"₎": ")",
	};

	const oNamesOfLiterals = {
		fractionLiteral: 			[0, "FractionLiteral"],
		spaceLiteral: 				[1, "SpaceLiteral", MathLiterals.space],
		charLiteral: 				[2, "CharLiteral"],
		operatorLiteral: 			[5, "OperatorLiteral"],
		binomLiteral: 				[6, "BinomLiteral"],
		bracketBlockLiteral: 		[7, "BracketBlock"],
		functionLiteral: 			[8, "FunctionLiteral"],
		subSupLiteral: 				[9, "SubSupLiteral"],
		sqrtLiteral: 				[10, "SqrtLiteral"],
		numberLiteral: 				[11, "NumberLiteral"],
		mathOperatorLiteral: 		[12, "MathOperatorLiteral"],
		rectLiteral: 				[13, "RectLiteral"],
		boxLiteral: 				[14, "BoxLiteral"],
		borderBoxLiteral:			[58, "BorderBoxLiteral"],
		preScriptLiteral: 			[15, "PreScriptLiteral"],
		mathFontLiteral: 			[16, "MathFontLiteral"],
		overLiteral: 				[17, "OverLiteral"],
		diacriticLiteral: 			[18, "DiacriticLiteral"],
		diacriticBaseLiteral: 		[19, "DiacriticBaseLiteral"],
		otherLiteral: 				[20, "OtherLiteral"],
		anMathLiteral: 				[21, "AnMathLiteral"],
		opBuildupLiteral: 			[22, "opBuildUpLiteral"],
		opOpenBracket: 				[23, "opOpenLiteral"],
		opCloseBracket: 			[24, "opCLoseLiteral"],
		opOpenCloseBracket: 		[25, "opCloseLiteral"],
		hBracketLiteral: 			[28, "hBracketLiteral"],
		opNaryLiteral: 				[29, "opNaryLiteral"],
		asciiLiteral: 				[30, "asciiLiteral"],
		opArrayLiteral: 			[31, "opArrayLiteral"],
		opDecimal: 					[32, "opDecimal"],

		specialScriptNumberLiteral: [33, "specialScriptLiteral"],
		specialScriptCharLiteral: 	[34, "specialScriptLiteral"],
		specialScriptBracketLiteral: [35, "specialScriptBracketLiteral"],
		specialScriptOperatorLiteral: [36, "specialScriptBracketLiteral"],

		specialIndexNumberLiteral: 	[37, "specialScriptLiteral"],
		specialIndexCharLiteral: 	[38, "specialScriptLiteral"],
		specialIndexBracketLiteral: [39, "specialScriptBracketLiteral"],
		specialIndexOperatorLiteral: [40, "specialScriptBracketLiteral"],

		textPlainLiteral: 				[41, "textPlainLiteral"],
		nthrtLiteral: 				[42, "nthrtLiteral"],
		fourthrtLiteral: 			[43, "fourthrtLiteral"],
		cubertLiteral: 				[44, "cubertLiteral"],
		overBarLiteral: 			[45, "overBarLiteral"],

		factorialLiteral: 			[46, "factorialLiteral"],
		rowLiteral: 				[47, "rowLiteral"],
		rowsLiteral: 				[48, "rowsLiteral"],

		minusLiteral: 				[49, "minusLiteral"],
		LaTeXLiteral: 				[50, "LaTeXLiteral"],

		functionWithLimitLiteral: 	[51, "functionWithLimitLiteral"],
		functionNameLiteral: 		[52, "functionNameLiteral"],
		matrixLiteral: 				[53, "matrixLiteral"],
		arrayLiteral: 				[53, "arrayLiteral"],

		skewedFractionLiteral: 		[54, "skewedFractionLiteral"],
		EqArrayliteral: 			[55, "EqArrayliteral"],

		groupLiteral:				[56, "GroupLiteral"],
		belowAboveLiteral:			[57, "BelowAboveLiteral"],

	};

	function AddFunctionAutoCorrection(str)
	{
		if (undefined === str || null === str)
			return;

		MathAutoCorrectionFuncNames.push(str);
	};
	function SearchFunctionName(str)
	{
		if (undefined === str || null === str)
			return false;

		return MathAutoCorrectionFuncNames.includes(str);
	};

	//---------------------------------------------Tokenizer section----------------------------------------------------
	function Tokenizer(isLaTeX)
	{
		this._string = [];
		this._styles = [];
		this._cursor = 0;

		this.state = [];
		this.isLaTeX = isLaTeX;
	}
	Tokenizer.prototype.Init = function (string)
	{
		if (Array.isArray(string))
		{

			let arr = ContentWithStylesIterator(string);
			ContentWithStylesToText(string, this, function (obj, arr)
			{
				let oCurrentElement = arr[i];
				let oStyleCopy = oCurrentElement.GetStyle();

				if (oCurrentElement instanceof MathText)
					this._styles.push(oStyleCopy);
				else
					this._styles.push(null);

				if (oCurrentElement instanceof MathText)
					oCurrentElement = oCurrentElement.GetText();

				let arrNewTextContent = this.GetSymbols(oCurrentElement);

				this._string = this._string.concat(arrNewTextContent);

				if (arrNewTextContent.length > 1)
				{
					for (let j = 0; j < arrNewTextContent.length; j++) {
						this._styles.push(oStyleCopy);
					}
				}
			})

			for (let i = 0; i < arr.length; i++)
			{

			}
		}
		else
		{
			let arrContent = this.GetSymbols(string);
			this._string = arrContent;
		}
	};
	Tokenizer.prototype.GetSymbols = function (str)
	{
		let output = [];
		for (let oIter = str.getUnicodeIterator(); oIter.check(); oIter.next()) 
		{
			output.push(String.fromCodePoint(oIter.value()));
		}
		return output;
	};
	Tokenizer.prototype.GetStringLength = function (str)
	{
		let intLen = 0;
		for (let oIter = str.getUnicodeIterator(); oIter.check(); oIter.next()) {
			intLen++;
		}
		return intLen;
	};
	Tokenizer.prototype.IsHasMoreTokens = function ()
	{
		return this._cursor < this._string.length;
	};
	Tokenizer.prototype.GetTextOfToken = function (intIndex, isLaTeX)
	{
		let arrToken = arrTokensCheckerList[intIndex];

		if (typeof arrToken[0] !== "function")
		{
			if (isLaTeX && arrToken[1] !== undefined)
			{
				return arrToken[0];
			}
			else if (!isLaTeX && arrToken[1] !== undefined)
			{
				return arrToken[1];
			}
		}
	};
	Tokenizer.prototype.GetNextToken = function ()
	{
		if (!this.IsHasMoreTokens())
			return {
				class: undefined,
				data: undefined,
			};

		let autoCorrectRule,
			tokenValue,
			tokenClass,
			string = this._string.slice(this._cursor);

		for (let i = arrTokensCheckerList.length - 1; i >= 0; i--)
		{
			autoCorrectRule = arrTokensCheckerList[i];
			tokenValue = this.MatchToken(autoCorrectRule, string);

			if (tokenValue === null)
				continue;

			else if (!Array.isArray(autoCorrectRule))
			{
				tokenClass = (autoCorrectRule.isClassEqalData)
					? tokenValue
					: autoCorrectRule.id;
			}
			else if (autoCorrectRule.length === 1)
			{
				tokenClass = MathLiterals.char.id;
			}
			else if (autoCorrectRule.length === 2)
			{
				tokenClass = (autoCorrectRule[1] === true)
					? autoCorrectRule[0]
					: autoCorrectRule[1];
			}

			return {
				class: tokenClass,
				data: tokenValue,
				style: this._styles[this._cursor],
			}
		}
	};
	Tokenizer.prototype.ProcessString = function (str, char)
	{
		let intLenOfRule = 0;

		while (intLenOfRule <= char.length - 1)
		{
			if (char[intLenOfRule] === str[intLenOfRule])
				intLenOfRule++;
			else
				return;
		}
		return char;
	};
	Tokenizer.prototype.MatchToken = function (fMathCheck, arrStr)
	{
		if (undefined === fMathCheck)
			return null;

		let oMatched = fMathCheck.GetToken(this.isLaTeX, arrStr);

		if (oMatched === null || oMatched === undefined)
			return null;

		this._cursor += this.GetStringLength(oMatched);

		if (fMathCheck.IsNeedReturnCorrected_Unicode === true && !this.isLaTeX)
			oMatched = fMathCheck.LaTeX[oMatched];

		return oMatched;
	};
	Tokenizer.prototype.SaveState = function (oLookahead)
	{
		let strClass = oLookahead.class;
		let data = oLookahead.data;

		this.state.push({
			_string: this._string,
			_cursor: this._cursor,
			oLookahead: { class: strClass, data: data},
		})
	};
	Tokenizer.prototype.RestoreState = function ()
	{
		if (this.state.length > 0) {
			let oState = this.state.shift();
			this._cursor = oState._cursor;
			this._string = oState._string;
			return oState.oLookahead;
		}
	};
	Tokenizer.prototype.IsTextContent = function(intClass, intTokenClass)
	{
		return (intClass !== intTokenClass) ||
			(
				intTokenClass !== 0
			&& intTokenClass !== 1
			&& intTokenClass !== 3
			)
	};
	Tokenizer.prototype.IsContentOfOneType = function()
	{
		let intTokenClass = null;
		while (this.IsHasMoreTokens())
		{
			let intClass = this.GetNextToken().class;

			if (intTokenClass === null)
				intTokenClass = intClass;
			else if (intClass === undefined)
				return true;
			else if (this.IsTextContent(intClass, intTokenClass))
				return false;
		}
		return true;
	};

	//-----------------------Functions for convert tokens array in inner math format------------------------------------
	function GetPrForFunction(oIndex)
	{
		let isHide = true;
		if (oIndex)
			isHide = false;

		return {
			degHide: isHide,
		}
	};
	// Convert tokens to math objects
	function ConvertTokens(oTokens, oContext)
	{
		Paragraph = oContext.Paragraph;

		if (typeof oTokens === "object")
		{
			if (oTokens.type === "LaTeXEquation" || oTokens.type === "UnicodeEquation")
			{
				type = oTokens.type === "LaTeXEquation" ? 1 : 0;
				oTokens = oTokens.body;
			}

			if (Array.isArray(oTokens))
			{
				for (let i = 0; i < oTokens.length; i++)
				{
					if (Array.isArray(oTokens[i]))
					{
						let oToken = oTokens[i];

						for (let j = 0; j < oTokens[i].length; j++)
						{
							SelectObject(oToken[j], oContext);
						}
					}
					else
					{
						SelectObject(oTokens[i], oContext);
					}
				}
			}
			else
			{
				SelectObject(oTokens, oContext)
			}
		}
		else
		{
			oContext.Add_Text(oTokens);
		}
	};
	// Find token in all types for convert
	function SelectObject (oTokens, oContext)
	{
		let num = 1; // needs for debugging

		if (oTokens)
		{
			switch (oTokens.type)
			{
				case undefined:
					for (let i = 0; i < oTokens.length; i++) {
						ConvertTokens(
							oTokens[i],
							oContext,
						);
					}
					break;
				case MathStructures.other:
					let intCharCode = oTokens.value.codePointAt()
					oContext.Add_Symbol(intCharCode);
					break;
				case oNamesOfLiterals.functionNameLiteral[num]:
				case oNamesOfLiterals.specialScriptNumberLiteral[num]:
				case oNamesOfLiterals.specialScriptCharLiteral[num]:
				case oNamesOfLiterals.specialScriptBracketLiteral[num]:
				case oNamesOfLiterals.specialScriptOperatorLiteral[num]:
				case oNamesOfLiterals.specialIndexNumberLiteral[num]:
				case oNamesOfLiterals.specialIndexCharLiteral[num]:
				case oNamesOfLiterals.specialIndexBracketLiteral[num]:
				case oNamesOfLiterals.specialIndexOperatorLiteral[num]:
				case oNamesOfLiterals.opDecimal[num]:
				case MathStructures.char:
				case MathStructures.space:
				case oNamesOfLiterals.mathOperatorLiteral[num]:
				case MathStructures.number:
					if (oTokens.decimal)
					{
						ConvertTokens(
							oTokens.left,
							oContext,
						);
						oContext.Add_Text(oTokens.decimal)
						ConvertTokens(
							oTokens.right,
							oContext,
						);
					}
					else
					{
						oContext.Add_TextInLastParaRun(oTokens.value);
					}
					break;
				case oNamesOfLiterals.textPlainLiteral[num]:
					oContext.Add_Text(oTokens.value, Paragraph, STY_PLAIN);
					break
				case MathStructures.nary:
					let lPr = {
						chr: oTokens.value.charCodeAt(0),
						subHide: true,
						supHide: true,
					}

					let oNary = oContext.Add_NAry(lPr, null, null, null);
					if (oTokens.third) {
						UnicodeArgument(
							oTokens.third,
							MathStructures.bracket_block,
							oNary.getBase(),
						)
					}
					break;
				case oNamesOfLiterals.preScriptLiteral[num]:
					let oPreSubSup = oContext.Add_Script(
						oTokens.up && oTokens.down,
						{ctrPrp: new CTextPr(), type: DEGREE_PreSubSup},
						null,
						null,
						null
					);
					ConvertTokens(
						oTokens.value,
						oPreSubSup.getBase()
					);
					UnicodeArgument(
						oTokens.up,
						MathStructures.bracket_block,
						oPreSubSup.getUpperIterator()
					)
					UnicodeArgument(
						oTokens.down,
						MathStructures.bracket_block,
						oPreSubSup.getLowerIterator()
					)
					break;
				case MathStructures.accent:
					let oAccent = oContext.Add_Accent(
						new CTextPr(),
						GetFixedCharCodeAt(oTokens.value),
						null
					);
					UnicodeArgument(
						oTokens.base,
						MathStructures.bracket_block,
						oAccent.getBase()
					)
					break;
				case oNamesOfLiterals.skewedFractionLiteral[num]:
				case MathStructures.frac:
					let oFraction = oContext.Add_Fraction(
						{ctrPrp: new CTextPr(), type: oTokens.fracType},
						null,
						null
					);

					UnicodeArgument(
						oTokens.up,
						MathStructures.bracket_block,
						oFraction.getNumeratorMathContent()
					);
					UnicodeArgument(
						oTokens.down,
						MathStructures.bracket_block,
						oFraction.getDenominatorMathContent()
					);
					break;
				case MathStructures.sub_sub:
					if (oTokens.value && oTokens.value.type === oNamesOfLiterals.functionLiteral[num])
					{
						let oFunc = oContext.Add_Function({}, null, null);
						let oFuncName = oFunc.getFName();

						let Pr = (oTokens.up && oTokens.down)
							? {}
							: (oTokens.up)
								? {type: DEGREE_SUPERSCRIPT}
								: {type: DEGREE_SUBSCRIPT}

						let SubSup = oFuncName.Add_Script(
							oTokens.up && oTokens.down,
							Pr,
							null,
							null,
							null
						);
						SubSup.getBase().Add_Text(oTokens.value.value, Paragraph, STY_PLAIN)

						if (oTokens.up) {
							UnicodeArgument(
								oTokens.up,
								MathStructures.bracket_block,
								SubSup.getUpperIterator()
							)
						}
						if (oTokens.down) {
							UnicodeArgument(
								oTokens.down,
								MathStructures.bracket_block,
								SubSup.getLowerIterator()
							)
						}

						if (oTokens.third) {
							let oFuncArgument = oFunc.getArgument();
							UnicodeArgument(
								oTokens.third,
								MathStructures.bracket_block,
								oFuncArgument
							)
						}
					}
					else if (oTokens.value && oTokens.value.type === oNamesOfLiterals.functionWithLimitLiteral[num])
					{
						let oFuncWithLimit = oContext.Add_FunctionWithTypeLimit(
							{},
							null,
							null,
							null,
							oTokens.up ? LIMIT_UP : LIMIT_LOW
						);
						oFuncWithLimit
							.getFName()
							.Content[0]
							.getFName()
							.Add_Text(oTokens.value.value, Paragraph, STY_PLAIN);

						let oLimitIterator = oFuncWithLimit
							.getFName()
							.Content[0]
							.getIterator();

						if (oTokens.up || oTokens.down) {
							UnicodeArgument(
								oTokens.up === undefined ? oTokens.down : oTokens.up,
								MathStructures.bracket_block,
								oLimitIterator
							)
						}
						UnicodeArgument(
							oTokens.third,
							MathStructures.bracket_block,
							oFuncWithLimit.getArgument()
						)
					}
					else if (oTokens.value && oTokens.value.type === oNamesOfLiterals.opNaryLiteral[num])
					{
						let Pr = {
							chr: oTokens.value.value.charCodeAt(0),
							subHide: oTokens.down === undefined,
							supHide: oTokens.up === undefined,
						}

						let oNary = oContext.Add_NAry(Pr, null, null, null);
						ConvertTokens(
							oTokens.third,
							oNary.getBase(),
						);
						UnicodeArgument(
							oTokens.up,
							MathStructures.bracket_block,
							oNary.getSupMathContent()
						)
						UnicodeArgument(
							oTokens.down,
							MathStructures.bracket_block,
							oNary.getSubMathContent()
						)
					}
					else
					{
						let isSubSup = ((Array.isArray(oTokens.up) && oTokens.up.length > 0) || (!Array.isArray(oTokens.up) && oTokens.up !== undefined)) &&
							((Array.isArray(oTokens.down) && oTokens.down.length > 0) || (!Array.isArray(oTokens.down) && oTokens.down !== undefined))

						let Pr = {ctrPrp: new CTextPr()};
						if (!isSubSup) {
							if (oTokens.up)
								Pr.type = DEGREE_SUPERSCRIPT;
							else if (oTokens.down)
								Pr.type = DEGREE_SUBSCRIPT;
						}

						let SubSup = oContext.Add_Script(
							isSubSup,
							Pr,
							null,
							null,
							null
						);


						ConvertTokens(
							oTokens.value,
							SubSup.getBase(),
						)
						UnicodeArgument(
							oTokens.up,
							MathStructures.bracket_block,
							SubSup.getUpperIterator()
						)
						UnicodeArgument(
							oTokens.down,
							MathStructures.bracket_block,
							SubSup.getLowerIterator()
						)
					}
					break;
				case MathStructures.func_lim:
					let MathFunc = new CMathFunc({});
					oContext.Add_Element(MathFunc);

					let FuncName = MathFunc.getFName();

					let Limit = new CLimit({ctrPrp : new CTextPr(), type : oTokens.down !== undefined ? LIMIT_LOW : LIMIT_UP});
					FuncName.Add_Element(Limit);

					let LimitName = Limit.getFName();
					LimitName.Add_Text(oTokens.value, Paragraph, STY_PLAIN);

					if (oTokens.up || oTokens.down) {
						UnicodeArgument(
							oTokens.up === undefined ? oTokens.down : oTokens.up,
							MathStructures.bracket_block,
							Limit.getIterator()
						)
					}

					if (oTokens.third)
					{
						ConvertTokens(
							oTokens.third,
							MathFunc.getArgument(),
						)
					}

					break;
				case MathStructures.horizontal_bracket:
					let intBracketPos = GetHBracket(oTokens.hBrack);
					let intIndexPos = oTokens.up === undefined ? LIMIT_LOW : LIMIT_UP;

					if (!(oTokens.up || oTokens.down))
					{
						let Pr = {
							ctrPrp: new CTextPr(),
							chr: oTokens.hBrack.charCodeAt(0),
							pos: intBracketPos,
							vertJc: 1
						};

						let oGroup = oContext.Add_GroupCharacter(Pr, null);

						UnicodeArgument(
							oTokens.value,
							MathStructures.bracket_block,
							oGroup.getBase()
						);
					}
					else
					{
						let Limit = oContext.Add_Limit({ctrPrp: new CTextPr(), type: intIndexPos}, null, null);
						let MathContent = Limit.getFName();
						let oGroup = MathContent.Add_GroupCharacter({
							ctrPrp: new CTextPr(),
							chr: oTokens.hBrack.charCodeAt(0),
							vertJc: 1,
							pos: intBracketPos
						}, null);

						UnicodeArgument(
							oTokens.value,
							MathStructures.bracket_block,
							oGroup.getBase()
						)

						if (oTokens.down || oTokens.up)
						{
							UnicodeArgument(
								oTokens.up === undefined ? oTokens.down : oTokens.up,
								MathStructures.bracket_block,
								Limit.getIterator()
							)
						}
					}
					break;
				case MathStructures.bracket_block:

					let arr = [null]
					if (oTokens.counter > 1 && oTokens.value.length < oTokens.counter)
					{
						for (let i = 0; i < oTokens.counter - 1; i++)
						{
							arr.push(null);
						}
					}
					let oBracket = oContext.Add_DelimiterEx(
						new CTextPr(),
						oTokens.value.length ? oTokens.value.length : oTokens.counter || 1,
						arr,
						GetBracketCode(oTokens.left),
						GetBracketCode(oTokens.right),
					);
					if (oTokens.value.length) {
						for (let intCount = 0; intCount < oTokens.value.length; intCount++) {
							ConvertTokens(
								oTokens.value[intCount],
								oBracket.getElementMathContent(intCount)
							);
						}
					}
					else {
						ConvertTokens(
							oTokens.value,
							oBracket.getElementMathContent(0)
						);
					}

					break;
				case MathStructures.radical:
					let Pr = GetPrForFunction(oTokens.index);
					let oRadical = oContext.Add_Radical(
						Pr,
						null,
						null
					);
					UnicodeArgument(
						oTokens.value,
						MathStructures.bracket_block,
						oRadical.getBase()
					)
					ConvertTokens(
						oTokens.index,
						oRadical.getDegree()
					);
					break;
				case MathStructures.func:
					let oFunc = oContext.Add_Function({}, null, null);

					//oFunc.getFName().Add_Text(oTokens.value, Paragraph, STY_PLAIN);

					ConvertTokens(
						oTokens.value,
						oFunc.getFName(),
					)
					UnicodeArgument(
						oTokens.third,
						MathStructures.bracket_block,
						oFunc.getArgument()
					)
					break;
				case oNamesOfLiterals.mathFontLiteral[num]:
					ConvertTokens(
						oTokens.value,
						oContext,
					);
					break;
				case MathStructures.matrix:
					let strStartBracket, strEndBracket;
					if (oTokens.strMatrixType) {
						if (oTokens.strMatrixType.length === 2) {
							strStartBracket = oTokens.strMatrixType[0].charCodeAt(0)
							strEndBracket = oTokens.strMatrixType[1].charCodeAt(0)
						}
						else {
							strEndBracket = strStartBracket = oTokens.strMatrixType[0].charCodeAt(0)
						}
					}
					let rows = oTokens.value.length;
					let cols = oTokens.value[0].length;
					if (strEndBracket && strStartBracket) {
						let Delimiter = oContext.Add_DelimiterEx(new CTextPr(), 1, [null], strStartBracket, strEndBracket);
						oContext = Delimiter.getElementMathContent(0);
					}
					let oMatrix = oContext.Add_Matrix(new CTextPr(), rows, cols, false, []);

					for (let intRow = 0; intRow < rows; intRow++) {
						for (let intCol = 0; intCol < cols; intCol++) {
							let oContent = oMatrix.getContentElement(intRow, intCol);
							ConvertTokens(
								oTokens.value[intRow][intCol],
								oContent,
							);
						}
					}
					break;
				case oNamesOfLiterals.arrayLiteral[num]:
					let intCountOfRows = oTokens.value.length
					let oEqArray = oContext.Add_EqArray({
						ctrPrp: new CTextPr(),
						row: intCountOfRows
					}, null, null);
					for (let i = 0; i < oTokens.value.length; i++) {
						let oMathContent = oEqArray.getElementMathContent(i);
						ConvertTokens(
							oTokens.value[i],
							oMathContent,
						);
					}
					break;
				case MathStructures.box:
					let oBox = oContext.Add_Box({ctrPrp: new CTextPr(), opEmu : 1}, null);
					if (oTokens.argSize)
					{
						let BoxMathContent = oBox.getBase();
						BoxMathContent.SetArgSize(oTokens.argSize);
					}
					UnicodeArgument(
						oTokens.value,
						MathStructures.bracket_block,
						oBox.getBase(),
					)
					break;

					let BorderBox = oContext.Add_BorderBox({}, null);
					UnicodeArgument(
						oTokens.value,
						MathStructures.bracket_block,
						BorderBox.getBase(),
					)
					break;
				case oNamesOfLiterals.rectLiteral[num]:
					let oBorderBox = oContext.Add_BorderBox({}, null);
					UnicodeArgument(
						oTokens.value,
						MathStructures.bracket_block,
						oBorderBox.getBase(),
					)
					break;
				// case MathStructures.bar:
				// 	let intLocation = oTokens.overUnder === "▁" ? LOCATION_BOT : LOCATION_TOP;
				// 	let oBar = oContext.Add_Bar({ctrPrp: new CTextPr(), pos: intLocation}, null);
				// 	UnicodeArgument(
				// 		oTokens.value,
				// 		MathStructures.bracket_block,
				// 		oBar.getBase(),
				// 	);
				// 	break;
				case MathStructures.below_above:
					let LIMIT_TYPE = (oTokens.isBelow === false) ? VJUST_BOT : VJUST_TOP;

					if (oTokens.base.type === MathStructures.char && oTokens.base.value.length === 1)
					{
						let Pr = (LIMIT_TYPE == VJUST_TOP)
							? {ctrPrp : new CTextPr(), pos :LIMIT_TYPE, chr : oTokens.base.value.charCodeAt(0)}
							: {ctrPrp : new CTextPr(), vertJc : LIMIT_TYPE, chr : oTokens.base.value.charCodeAt(0)};

						let Group = new CGroupCharacter(Pr);
						oContext.Add_Element(Group);

						UnicodeArgument(
							oTokens.value,
							MathStructures.bracket_block,
							Group.getBase(),
						);
					}
					else
					{
						let oLimit = oContext.Add_Limit({ctrPrp: new CTextPr(), type: LIMIT_TYPE});
						UnicodeArgument(
							oTokens.base,
							MathStructures.bracket_block,
							oLimit.getFName(),
						);
						UnicodeArgument(
							oTokens.value,
							MathStructures.bracket_block,
							oLimit.getIterator(),
						);
					}

					break;
			}
		}
	};
	// Trow content and may skip bracket block
	function UnicodeArgument (oInput, oComparison, oContext)
	{
		if (oInput && type === 0 && oInput.type === oComparison && oInput.left === "(" && oInput.right === ")")
		{
			ConvertTokens(
				oInput.value,
				oContext,
			)
		}
		else if (oInput)
		{
			ConvertTokens(
				oInput,
				oContext,
			)
		}
	};

	//--------------------------------------Helper functions for lexer and converter------------------------------------
	function GetBracketCode(code)
	{
		const oBrackets = {
			".": -1,
			"\\{": "{".charCodeAt(0),
			"\\}": "}".charCodeAt(0),
			"\\|": "‖".charCodeAt(0),
			"|": 124,
			"〖": -1,
			"〗": -1,
			"⟨" : 10216,
			"⟩": 10217,
			"├": -1,
			"┤": -1,

		}
		if (code) {
			let strBracket = oBrackets[code];
			if (strBracket) {
				return strBracket
			}
			return code.charCodeAt(0)
		}
	};
	function GetHBracket(code)
	{
		switch (code) {
			case "⏜": return VJUST_TOP;
			case "⏝": return VJUST_BOT;
			case "⏞": return VJUST_TOP;
			case "⏟": return VJUST_BOT;
			case "⏠": return VJUST_TOP;
			case "⏡": return VJUST_BOT;
			case "⎴": return VJUST_BOT;
			case "⎵": return VJUST_TOP;
		}
	};
	//https://www.cs.bgu.ac.il/~khitron/Equation%20Editor.pdf
	function GetUnicodeAutoCorrectionToken(str, context)
	{
		if (str[0] !== "\\") {
			return;
		}

		const isLiteral = (str[0] === "\\" && str[1] === "\\");
		const strLocal = isLiteral
			? str.slice(2)
			: str.slice(1);

		const SegmentForSearch = isLiteral ? AutoCorrect[str[2]] : AutoCorrect[str[1]];
		if (SegmentForSearch) {
			for (let i = 0; i < SegmentForSearch.length; i++) {
				let token = SegmentForSearch[i];
				let result = ProcessString(strLocal, token[0]);
				if (undefined === result) {
					continue
				}

				let strData = typeof token[1] === "string"
					? token[1]
					: String.fromCharCode(token[1]);

				context._cursor += isLiteral ? result + 2 : result;
				if (isLiteral) {
					return {
						class: oNamesOfLiterals.operatorLiteral[0],
						data: strData,
					}
				}
				str = isLiteral
					? str.slice(result + 2)
					: str.slice(result + 1);

				str.splice(0, 0, strData)
				return str
			}
		}
	};
	function ProcessString(str, char)
	{
		let intLenOfRule = 0;
		while (intLenOfRule <= char.length - 1)
		{
			if (char[intLenOfRule] === str[intLenOfRule])
				intLenOfRule++;
			else
				return;
		}
		return intLenOfRule;
	};
	function GetFixedCharCodeAt(str)
	{
		let code = str.charCodeAt(0);
		let hi, low;

		if (0xd800 <= code && code <= 0xdbff) {
			hi = code;
			low = str.charCodeAt(1);
			if (isNaN(low)) {
				return null;
			}
			return (hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000;
		}
		if (0xdc00 <= code && code <= 0xdfff) {
			return false;
		}
		return code;
	};

	//--------------------------------------Helper functions for autocorrection-----------------------------------------
	function IsCorrect(token)
	{
		return MathLiterals.operator.SearchU(token)
			|| MathLiterals.space.SearchU(token)
			|| MathLiterals.lBrackets.SearchU(token)
			|| MathLiterals.rBrackets.SearchU(token)
			|| MathLiterals.lrBrackets.SearchU(token);
	}
	function AutoCorrectOnCursor(token, oCMathContent, isLaTeX)
	{
		if (IsCorrect(token))
		{
			if (CorrectSpecialWordOnCursor(oCMathContent, isLaTeX))
				return true;
			else if (CorrectWordOnCursor(oCMathContent, isLaTeX))
				return true;
		}
		return false;
	};
	function CorrectSpecialWordOnCursor(oCMathContent, isLaTeX)
	{
		return CheckAutoCorrection(
			oCMathContent,
			oMathAutoCorrection.oSpecialList,
			false,
			false,
			true
		);
	};
	function CorrectWordOnCursor(oCMathContent, isLaTeX)
	{
		return CheckAutoCorrection(
			oCMathContent,
			oMathAutoCorrection.oGeneralRules,
			true,
			false,
			true
		);
	};
	function CorrectAll(oCMathContent, isLaTeX)
	{
		CorrectAllWords(oCMathContent, isLaTeX);
		CorrectAllSpecialWords(oCMathContent, isLaTeX);
	};
	function CorrectAllWords (oCMathContent, isLaTeX)
	{
		return CheckAutoCorrection(
			oCMathContent,
			oMathAutoCorrection.oGeneralRules,
			true,
			true,
			true
		);
	};
	function CorrectAllSpecialWords(oCMathContent, isLaTeX)
	{
		return CheckAutoCorrection(
			oCMathContent,
			oMathAutoCorrection.oSpecialList,
			true,
			true,
			true
		);
	};

	//TODO implement
	function IsNotConvertedLaTeXWords(str)
	{
		if (arrDoNotConvertWordsForLaTeX.includes(str))
			return true;

		return false;
	};
	function IsStartAutoCorrection(nInputType, intCode)
	{
		if (nInputType === 0) // Unicode
		{
			return !(
				(intCode >= 97 && intCode <= 122) || //a-zA-Z
				(intCode >= 65 && intCode <= 90) || //a-zA-Z
				(intCode >= 48 && intCode <= 57) || // 0-9
				intCode === 92 ||			// "\\"
				intCode === 95 ||			// _
				intCode === 94 ||			// ^
				MathLiterals.lBrackets.SearchU(String.fromCodePoint(intCode)) ||
				MathLiterals.rBrackets.SearchU(String.fromCodePoint(intCode)) ||
				intCode === 40 ||			// (
				intCode === 41 ||			// )
				intCode === 47 ||			// /
				intCode === 46 ||			// .
				intCode === 44 ||				// ,
				intCode > 65533
			)

		}
		else if (nInputType === 1) //LaTeX
		{
			return !(
				(intCode >= 97 && intCode <= 122) || //a-zA-Z
				(intCode >= 65 && intCode <= 90) || // a-zA-Z
				(intCode >= 48 && intCode <= 57) || // 0-9
				intCode === 92||					// "\\"
				intCode === 123 ||					// {
				intCode === 125 ||					// }
				MathLiterals.lBrackets.SearchU(String.fromCodePoint(intCode)) ||
				MathLiterals.rBrackets.SearchU(String.fromCodePoint(intCode)) ||
				intCode === 95 ||					// _
				intCode === 94 ||					// ^
				intCode === 91 ||					// [
				intCode === 93 ||					// ]
				intCode === 46 ||					// .
				intCode === 44						// ,
			)
		}
	};
	function GetConvertContent(nInputType, strConversionData, oContext)
	{
		oContext.CurPos++;
		nInputType === Asc.c_oAscMathInputType.Unicode
			? AscMath.CUnicodeConverter(strConversionData, oContext)
			: AscMath.ConvertLaTeXToTokensList(strConversionData, oContext);
	};

	function PositionIsCMathContent(MathPos, RunPos, type, ref)
	{
		this.position = [ MathPos, RunPos ];
		this.type = type;
		this.ref = ref;

		this.GetMathPos = function () { return this.position[0] };
		this.GetPosition = function () { return this.position[1] };
		this.GetType = function () { return this.type };
		this.GetWordLength = function () { return this.ref.length - (this.position[1] + 1) };
		this.AddOnePosition = function () { this.position[1]++ };
		this.IsBetween = function (oStartPos, oEndPos)
		{
			if (!oStartPos || !oEndPos)
				return false;

			let MathPos = this.GetMathPos();
			let ParaPos = this.GetPosition();

			let StartMathPos = oStartPos.GetMathPos();
			let StartParaPos = oStartPos.GetPosition();

			if (MathPos >= StartMathPos && ParaPos > StartParaPos)
			{
				let EndMathPos = oEndPos.GetMathPos();
				let EndParaPos = oEndPos.GetPosition();

				if (MathPos < EndMathPos || (MathPos === EndMathPos && ParaPos < EndParaPos))
					return true
			}

			return false;
		};
	};

	function ParaRunIterator(ParaRun)
	{
		this.Content = ParaRun.Content;
		this.Cursor = ParaRun.Content.length - 1;
	}
	ParaRunIterator.prototype.GetNext = function()
	{
		if (!this.IsHasContent())
			return false;

		const oContent = this.Content[this.Cursor];
		this.Cursor--;

		return String.fromCharCode(oContent.value);
	};
	ParaRunIterator.prototype.IsHasContent = function()
	{
		return this.Cursor >= 0;
	};
	function CMathContentIterator(oCMathContent)
	{
		this._paraRun = null;
		this._index = 0;
		this._content = oCMathContent.Content;

		this.counter = 0;
	}
	CMathContentIterator.prototype.Count = function ()
	{
		this.counter++;
	};
	CMathContentIterator.prototype.Next = function()
	{
		if (!this.IsHasContent())
			return false;

		if (this._paraRun)
		{
			if (this._paraRun.IsHasContent())
			{
				this.Count();
				return this._paraRun.GetNext();
			}
			else
			{
				this._paraRun = null;
				this._index++;
				return this.Next();
			}
		}
		else
		{
			let intCurrentIndex = this._content.length - 1 - this._index;
			let oCurrentContent = this._content[intCurrentIndex];

			if (oCurrentContent.Type !== 49)
			{
				this._index++;
				this.Count();
				return oCurrentContent;
			}
			else
			{
				this._paraRun = new ParaRunIterator(oCurrentContent)
				return this.Next();
			}
		}
	};
	CMathContentIterator.prototype.IsHasContent = function ()
	{
		return ( this._content && this._index < this._content.length);
	};

	function IsNeedSkipSpecial(oContentIterator, isSkipSpecial, currentContent)
	{
		return isSkipSpecial
				&& oContentIterator.counter === 1
				&& (
					currentContent === " "
					|| MathLiterals.operator.SearchU(currentContent)
				);
	};

	/**
	 * Correct math words by specific rules.
	 * @param {CMathContent} oContent - Content that will search for mathematical words.
	 * @param {Object} oContentToSearch - List of specific rules.
	 * @param {boolean} isSkipSpecial - Determines whether to skip a space or an operator in the first position.
	 * @param {boolean} isAllWords - Is need to convert all words or just the first one.
	 * @param {boolean} isCorrectPos - Is move the cursor to the end of CMathContent
	 */
	function CheckAutoCorrection(oContent, oContentToSearch, isSkipSpecial, isAllWords, isCorrectPos)
	{
		let oContentIterator = new CMathContentIterator(oContent);
		let isConvert = false;
		let strWord = "";
		let strOperator = "";

		while (oContentIterator.IsHasContent())
		{
			let currentContent = oContentIterator.Next();

			// Recursively proceed all CMathContent's
			if (typeof currentContent  === "object" && currentContent.Content.length > 0)
			{
				let arrContentOfCurrent = currentContent.Content;

				for (let i = 0; i < arrContentOfCurrent.length; i++)
				{
					let oInnerContent = arrContentOfCurrent[i];
					if (oInnerContent instanceof CMathContent)
						CheckAutoCorrection(oInnerContent, oContentToSearch, isSkipSpecial, isAllWords, false);
				}
				continue;
			}
			// if set flag isSkipSpecial and first symbol is space or operator - skip this symbol
			// used when it is necessary to process one word before the cursor
			else if (IsNeedSkipSpecial(oContentIterator, isSkipSpecial, currentContent))
			{
				strOperator = currentContent;
				continue;
			}
			else if (isAllWords && currentContent === " ")
			{
				strWord = "";
				continue;
			}

			strWord = currentContent + strWord;
			let intCurrentSymbol = oContentToSearch[strWord];

			if (oContentToSearch[strWord])
			{
				let intRootIndex = oContent.Content.length - oContentIterator._index - 1;
				let intChildIndex = oContentIterator._paraRun.Cursor + 1;
				let oDelMark = new PositionIsCMathContent(intRootIndex, intChildIndex);

				CutContentFromEnd(oContent, oDelMark, strWord.length);

				let strRule = ConvertRuleDataToText(intCurrentSymbol);
				strRule += strOperator;
				AddTextByPos(oContent, oDelMark, strRule);
				
				isConvert = true;
				strWord = "";

				if (isAllWords)
					continue;

				break;
			}
		}

		if (isCorrectPos && isAllWords)
			oContent.MoveCursorToEndPos(true);

		return isConvert;
	};
	/**
	 * Deletes letters at the given position
	 * @param {CMathContent} oContent - Content that will proceed.
	 * @param {PositionIsCMathContent} oDelMark - Deleting start position.
	 * @param {number} intWordLength - The length of the word to be removed.
	 */
	function CutContentFromEnd(oContent, oDelMark, intWordLength)
	{
		let intMathContent = oDelMark.GetMathPos();
		let intRunContent = oDelMark.GetPosition();
		let CurrentRun = oContent.Content[intMathContent];
		let str = "";

		for (let j = intWordLength + intRunContent; j >= intRunContent; j--) {
			str = String.fromCharCode(CurrentRun.Content[j].value) + str;
			CurrentRun.Remove_FromContent(j, 1, true);
		}

		return str;
	};
	/**
	 * Paste text at the given position
	 * @param {CMathContent} oContent - Content that will proceed.
	 * @param {PositionIsCMathContent} oPastePos - Paste position.
	 * @param {string} strText - Text to insert.
	 */
	function AddTextByPos(oContent, oPastePos, strText)
	{
		let intMathContent = oPastePos.GetMathPos();
		let intRunContent = oPastePos.GetPosition();
		let CurrentContent = oContent.Content[intMathContent];

		for (let nCharPos = 0, nTextLen = strText.length; nCharPos < nTextLen; nCharPos++)
		{
			let oText = new CMathText(false);
			oText.addTxt(strText[nCharPos]);

			CurrentContent.private_AddItemToRun(intRunContent, oText);
			intRunContent++;
		}
	};
	function ConvertRuleDataToText(rule)
	{
		if (Array.isArray(rule))
		{
			let strRule = "";
			for (let nCount = 0; nCount < rule.length; nCount++)
			{
				strRule += String.fromCharCode(rule[nCount]);
			}

			return strRule;
		}
		else
		{
			return String.fromCharCode(rule)
		}
	};

	function MathText(str, style)
	{
		this.text = str;
		this.style = style;
	}
	MathText.prototype.GetText = function ()
	{
		return this.text;
	}
	MathText.prototype.GetStyle = function()
	{
		return this.style;
	}
	MathText.prototype.Check = function (func)
	{
		return func(this.text);
	}
	MathText.prototype.Wrap = function (strFirst, strSecond)
	{
		this.text = strFirst + this.text + strSecond;
	}

	function GetTokenType(strToken, arrTypes)
	{
		for (let nCount = 0; nCount < arrTypes.length; nCount++)
		{
			let oCurrentType = arrTypes[nCount];
			if (oCurrentType.SearchU(strToken))
				return oCurrentType.id;
		}

		return false;
	}
	function GetInfoAboutCMathContent(oCMathContent, arrTypesForSearch)
	{
		const arrInfo = [];
		const oContent = oCMathContent.Content;

		for (let i = 0; i < oContent.length; i++)
		{
			if (oContent[i].Type === 49 && oContent[i].Content.length > 0)
				arrInfo[i] = GetInfoFromParaRun(i, oContent[i], arrTypesForSearch);
		}

		return arrInfo;
	}
	function GetInfoFromParaRun(nCount, oRun, arrTypesForSearch)
	{
		const arrBracketsInfo = [];
		const oContent = oRun.Content;

		for (let intCounter = 0; intCounter < oContent.length; intCounter++)
		{
			let CurrentElement = oContent[intCounter].value;
			let strContent = String.fromCharCode(CurrentElement);
			let intType = null;

			intType = AscMath.GetTokenType(strContent, arrTypesForSearch);

			if (false !== intType)
			{
				let pos = new PositionIsCMathContent(nCount, intCounter, intType, oRun.Content);
				arrBracketsInfo.push(pos);
			}
		};

		return arrBracketsInfo;
	};

	function ProcessingBrackets (arrData, Context)
	{
		this.BracketsPair 	= [];
		this.BacketNoPair 	= [];
		this.obj 			= {};
		this.intCounter 	= 0;

		this.AddBracket	= function (oStart, oEnd)
		{
			this.BracketsPair.push([oStart, oEnd]);
		};
		this.AddNoPair = function (oPos)
		{
			this.BacketNoPair.push(oPos);
		};
		this.Shift = function ()
		{
			this.obj[this.intCounter] = undefined;
		};
		this.Add = function (oContent)
		{
			if (this.obj[this.intCounter] === undefined)
				this.obj[this.intCounter] = oContent;
		};
		this.Get = function ()
		{
			let intCounter = this.intCounter - 1;
			while (intCounter >= 0)
			{
				if (this.obj[intCounter] === undefined)
					intCounter--;
				else
				{
					let type = this.obj[intCounter];
					if (!(type instanceof PositionIsCMathContent))
						break;
					return type;
				}
			}
			return new PositionIsCMathContent(undefined, undefined, undefined);
		};
		this.Check = function (oContent)
		{
			let oPrevContent	= this.Get();

			let intPrevType  	= oPrevContent.GetType();
			let intCurrentType 	= oContent.GetType();

			// если открывающая скобка:  ) ] } ...
			if (intCurrentType === MathLiterals.rBrackets.id)
			{
				this.Add(oContent);
				this.intCounter++;
			}
			// если закрывающая скобка ( [ { ...
			else if (intCurrentType === MathLiterals.lBrackets.id)
			{
				if (intPrevType === MathLiterals.rBrackets.id)
				{
					// нашли скобку
					this.AddBracket(oPrevContent, oContent);
					this.intCounter--;
					this.Shift();
				}
				else
				{
					this.AddNoPair(oContent);
				}
			}
			else if (intCurrentType === MathLiterals.lrBrackets.id)
			{
				if (this.intCounter > 0)
				{

				}
				else
				{

				}
			}
		};

		for (let i = arrData.length - 1; i >= 0; i--)
		{
			const CurrentContent = arrData[i];

			if (CurrentContent === undefined || (Array.isArray(CurrentContent) && CurrentContent.length === 0))
				continue;

			for (let j = CurrentContent.length - 1; j >= 0; j--)
			{
				Context.AddContent(CurrentContent.type, CurrentContent);
				this.Check(CurrentContent[j]);
			}
		};

		return {
			Pairs: this.BracketsPair,
			NoPair: this.BacketNoPair,
		};
	};

	function ProceedTokens(arrData, oCMathContent)
	{
		this.Processing = function (arrData)
		{
			for (let i = arrData.length - 1; i >= 0; i--)
			{
				const CurrentContent = arrData[i];

				if (CurrentContent === undefined || (Array.isArray(CurrentContent) && CurrentContent.length === 0))
					continue;

				for (let j = CurrentContent.length - 1; j >= 0; j--)
				{
					let oCurrent = CurrentContent[j];
					let intCurrentType = oCurrent.GetType();

					if (intCurrentType === MathLiterals.operator.id)
						this.AddContent("Operators", oCurrent);

					else if (intCurrentType === MathLiterals.space.id)
						this.AddContent("Space", oCurrent);

					else if (intCurrentType === MathLiterals.underbar.id)
						this.AddContent("Underbar", oCurrent);

					else if (intCurrentType === MathLiterals.nary.id)
						this.AddContent("Nary", oCurrent);

					else if (intCurrentType === MathLiterals.accent.id)
						this.AddContent("Accent", oCurrent);

					else if (intCurrentType === MathLiterals.box.id)
						this.AddContent("Box", oCurrent);

					else if (intCurrentType === MathLiterals.divide.id)
						this.AddContent("Divide", oCurrent);

					else if (intCurrentType === MathLiterals.func.id)
						this.AddContent("Func", oCurrent);

					else if (intCurrentType === MathLiterals.matrix.id)
						this.AddContent("Matrix", oCurrent);

					else if (intCurrentType === MathLiterals.overbar.id)
						this.AddContent("Overbar", oCurrent);

					else if (intCurrentType === MathLiterals.radical.id)
						this.AddContent("Radical", oCurrent);

					else if (intCurrentType === MathLiterals.rect.id)
						this.AddContent("Rect", oCurrent);

					else if (intCurrentType === MathLiterals.special.id)
						this.AddContent("Special", oCurrent);

					else if (intCurrentType === MathLiterals.subSup.id)
						this.AddContent("Subsup", oCurrent);
				}
			};
		};
		this.AddContent = function (name, oContent)
		{
			this.All.push({
				data: oContent,
				link: name,
				pos: this[name].length,
			});

			this[name].push(oContent);
		};
		this.GetLast = function()
		{
			return this.All[this.All.length - 1];
		}
		this.AutoCorrection = function ()
		{
			let oLast = this.GetLast();
			console.log(oLast);


			this.ProcessingNormalFunc(oLast);

		}
		this.ProcessingNormalFunc = function(oLast)
		{
			// 		func + content
			// 		|| func
			//
			// 	sin 10  -> sin block with 10 inner
			//  cos -> cos block

			// По элементу находим, что после него.
			// Если контента после нет конвертируем только саму функцию

		}

		// 		func + content
		// 		|| func
		this.Box		= [];
		this.Nary		= [];
		this.Radical	= [];
		this.Rect		= [];
		this.Func		= [];
		this.Matrix		= [];
		this.Overbar	= [];
		this.Underbar	= [];

		//		content + func
		this.Accent		= [];

		// 		content + func + content
		//		|| func + content
		//		|| content +  func
		this.Divide		= [];
		this.Subsup		= [];
		this.Special	= []; // remove & and @ form MathLiterals.special

		// triggers
		this.Space		= [];
		this.Operators 	= []; // triggers

		this.All		= [];


		this.Brackets 	= new ProcessingBrackets(arrData, this);

		debugger
		this.Processing(oCMathContent.GetOtherOperatorInfo(false));

		IsInBracket(this.Brackets.Pairs[this.Brackets.Pairs.length - 1], this.Special[0]);

		this.AutoCorrection();

		//ConvertBracketContent(this, oCMathContent);
		//ConvertBracket(this, oCMathContent, false);
	};
	function ConvertBracketContent(oTokens, oCMathContent)
	{
		return ConvertBracket(oTokens, oCMathContent, true);
	};
	function ConvertBracket(oTokens, oCMathContent, isOnlyContent)
	{
		let arrBrackets = oTokens.Brackets.Pairs;

		if (arrBrackets.length === 0 || oTokens.Brackets.NoPair.length > 0)
			return false;

		let oLastBracketBlock = arrBrackets[arrBrackets.length - 1];
		let pos = oLastBracketBlock[1];

		// we don't need to convert the parenthesis block itself, only the content inside
		if (isOnlyContent)
			pos.AddOnePosition();

		let intWordLength = pos.GetWordLength();
		let strConvertContent = CutContentFromEnd(oCMathContent, pos, intWordLength);

		if (strConvertContent === "")
			return false;

		GetConvertContent(0, strConvertContent, oCMathContent);
		return true;
	};

	function IsInBracket(oBracketPositions, oTokenPositions)
	{
		oTokenPositions.IsBetween(oBracketPositions[1], oBracketPositions[0]);
	};

	function ContentWithStylesIterator(arr)
	{
		let oArr = [];
		for (let i = 0; i < arr.length; i++)
		{
			let CurrentElement = arr[i];

			if (Array.isArray(CurrentElement))
			{
				let strTemp = ContentWithStylesIterator(CurrentElement);
				oArr = oArr.concat(strTemp);
			}
			else if (CurrentElement instanceof MathText)
			{
				oArr.push(CurrentElement)
			}
			else
			{
				oArr.push(CurrentElement)
			}
		}
		return oArr;
	};
	function ContentWithStylesToText(arr)
	{
		let arrInput = ContentWithStylesIterator(arr);
		let str = "";

		for (let i = 0; i < arrInput.length; i++)
		{
			let oCurrentElement = arrInput[i];
			str += oCurrentElement.GetText();
		}

		return str;
	};
	function ConvertMathTextToText(arr)
	{
		if (arr.length === 0)
			return "";

		let strContent = "";

		for (let nCount = 0; nCount < arr.length; nCount++)
		{
			let CurrentElement = arr[nCount];

			if (Array.isArray(CurrentElement))
			{
				let strTemp = ConvertMathTextToText(CurrentElement);
				if (strTemp)
				{
					strContent += strTemp;
				}
			}
			else if (CurrentElement instanceof MathText)
			{
				strContent += CurrentElement.GetText();
			}
			else
			{
				strContent += CurrentElement;
			}
		}

		return strContent;
	};
	function GetOnlyText(oContent, nInputType)
	{
		let one = oContent.GetTextOfElement(nInputType);

		return ConvertMathTextToText(one);
	};
	function AddTextWithStyles()
	{

	};

	//--------------------------------------------------------export----------------------------------------------------
	window["AscMath"] = window["AscMath"] || {};
	window["AscMath"].oNamesOfLiterals = oNamesOfLiterals;
	window["AscMath"].GetUnicodeAutoCorrectionToken = GetUnicodeAutoCorrectionToken;
	window["AscMath"].ConvertTokens = ConvertTokens;
	window["AscMath"].Tokenizer = Tokenizer;
	window["AscMath"].UnicodeSpecialScript = UnicodeSpecialScript;
	window["AscMath"].LimitFunctions = limitFunctions;
	window["AscMath"].MathAutoCorrectionFuncNames = MathAutoCorrectionFuncNames;
	window["AscMath"].GetTypeFont = MathLiterals.font.GetTypes();
	window["AscMath"].GetMathFontChar = GetMathFontChar;
	window["AscMath"].AutoCorrection = AutoCorrectionList;
	window["AscMath"].CorrectWordOnCursor = CorrectWordOnCursor;
	window["AscMath"].CorrectAllWords = CorrectAllWords;
	window["AscMath"].CorrectAllSpecialWords = CorrectAllSpecialWords;
	window["AscMath"].CorrectSpecialWordOnCursor = CorrectSpecialWordOnCursor;
	window["AscMath"].IsStartAutoCorrection = IsStartAutoCorrection;
	window["AscMath"].GetConvertContent = GetConvertContent;
	window["AscMath"].MathLiterals = MathLiterals;
	window["AscMath"].MathStructures = MathStructures;
	window["AscMath"].MathText = MathText;
	window["AscMath"].ConvertMathTextToText = ConvertMathTextToText;
	window["AscMath"].GetOnlyText = GetOnlyText;
	window["AscMath"].ContentWithStylesIterator = ContentWithStylesIterator;
	window["AscMath"].AutoCorrectOnCursor = AutoCorrectOnCursor;
	window["AscMath"].GetTokenType = GetTokenType;
	window["AscMath"].GetInfoAboutCMathContent = GetInfoAboutCMathContent;
	window["AscMath"].ProceedTokens = ProceedTokens;


})(window);
