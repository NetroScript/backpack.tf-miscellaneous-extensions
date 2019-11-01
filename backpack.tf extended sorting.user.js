// ==UserScript==
// @name         backpack.tf - Miscellaneous Extensions
// @description  Adds more options for sorting items in backpacks (currently Sorting for paints, spells, levels, scm price, classified listings) and other stuff which I would have liked (including highlighting spells, autocompleting spell names or sorting unusuals by class)
// @version      0.1.20
// @author       Netroscript
// @namespace    https://github.com/NetroScript
// @include      /^https?:\/\/backpack\.tf\/.*
// @downloadURL  https://github.com/NetroScript/backpack.tf-miscellaneous-extensions/raw/master/backpack.tf%20extended%20sorting.user.js
// @updateURL    https://github.com/NetroScript/backpack.tf-miscellaneous-extensions/raw/master/backpack.tf%20extended%20sorting.meta.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
	"use strict";

	//###############Source: https://stackoverflow.com/a/15605648
	String.prototype.fmt = function (hash) {
		var string = this,
			key;
		for (key in hash)
			string = string.replace(new RegExp("\\{" + key + "\\}", "gm"), hash[key]);
		return string;
	};
	//##############################################################

	//###############Source: https://stackoverflow.com/a/4726403
	function idealTextColor(bgColor) {

		var nThreshold = 105;
		var components = getRGBComponents(bgColor);
		var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

		return ((255 - bgDelta) < nThreshold)
			? "#000000"
			: "#ffffff";
	}

	function getRGBComponents(color) {

		var r = color.substring(1, 3);
		var g = color.substring(3, 5);
		var b = color.substring(5, 7);

		return {
			R: parseInt(r, 16),
			G: parseInt(g, 16),
			B: parseInt(b, 16)
		};
	}
	//##############################################################

	var colors = {
		"A Color Similar to Slate": {
			"cc": ["#2F4F4F"]
		},
		"A Deep Commitment to Purple": {
			"cc": ["#7D4071"]
		},
		"A Distinctive Lack of Hue": {
			"cc": ["#141414"]
		},
		"A Mann's Mint": {
			"cc": ["#BCDDB3"]
		},
		"After Eight": {
			"cc": ["#2D2D24"]
		},
		"Aged Moustache Grey": {
			"cc": ["#7E7E7E"]
		},
		"An Extraordinary Abundance of Tinge": {
			"cc": ["#E6E6E6"]
		},
		"Australium Gold": {
			"cc": ["#E7B53B"]
		},
		"Color No. 216-190-216": {
			"cc": ["#D8BED8"]
		},
		"Dark Salmon Injustice": {
			"cc": ["#E9967A"]
		},
		"Drably Olive": {
			"cc": ["#808000"]
		},
		"Indubitably Green": {
			"cc": ["#729E42"]
		},
		"Mann Co. Orange": {
			"cc": ["#CF7336"]
		},
		"Muskelmannbraun": {
			"cc": ["#A57545"]
		},
		"Noble Hatter's Violet": {
			"cc": ["#51384A"]
		},
		"Peculiarly Drab Tincture": {
			"cc": ["#C5AF91"]
		},
		"Pink as Hell": {
			"cc": ["#FF69B4"]
		},
		"Radigan Conagher Brown": {
			"cc": ["#694D3A"]
		},
		"The Bitter Taste of Defeat and Lime": {
			"cc": ["#32CD32"]
		},
		"The Color of a Gentlemann's Business Pants": {
			"cc": ["#F0E68C"]
		},
		"Ye Olde Rustic Colour": {
			"cc": ["#7C6C57"]
		},
		"Zepheniah's Greed": {
			"cc": ["#424F3B"]
		},
		"An Air of Debonair": {
			"cc": [
				"#654740", "#28394D"
			]
		},
		"Balaclavas Are Forever": {
			"cc": [
				"#3B1F23", "#18233D"
			]
		},
		"Cream Spirit": {
			"cc": [
				"#C36C2D", "#B88035"
			]
		},
		"Operator's Overalls": {
			"cc": [
				"#483838", "#384248"
			]
		},
		"Team Spirit": {
			"cc": [
				"#B8383B", "#5885A2"
			]
		},
		"The Value of Teamwork": {
			"cc": [
				"#803020", "#256D8D"
			]
		},
		"Waterlogged Lab Coat": {
			"cc": [
				"#A89A8C", "#839FA3"
			]
		}
	};

	var spells = { //Footprints
		"Halloween Spell: Team Spirit Footprints": {
			"cc": [
				"#B8383B", "#5885A2"
			]
		},
		"Halloween Spell: Gangreen Footprints": {
			"cc": ["#79c46b"]
		},
		"Halloween Spell: Corpse Gray Footprints": {
			"cc": ["#8e9f9d"]
		},
		"Halloween Spell: Violent Violet Footprints": {
			"cc": ["#f7b4fe"]
		},
		"Halloween Spell: Rotten Orange Footprints": {
			"cc": ["#CF7336"]
		},
		"Halloween Spell: Bruised Purple Footprints": {
			"cc": ["#7D4071"]
		},
		"Halloween Spell: Headless Horseshoes": {
			"cc": ["#ba76ff"]
		}, //Paint changing
		"Halloween Spell: Die Job": {
			"cc": [
				"#E7B53B", "#8586ff"
			]
		},
		"Halloween Spell: Spectral Spectrum": {
			"cc": [
				"#B8383B", "#5885A2"
			]
		},
		"Halloween Spell: Putrescent Pigmentation": {
			"cc": [
				"#79c46b", "#67B037"
			]
		},
		"Halloween Spell: Sinister Staining": {
			"cc": [
				"#F2EF46", "#808000"
			]
		},
		"Halloween Spell: Chromatic Corruption": {
			"cc": [
				"#DB42BD", "#7D4071"
			]
		}, //Voice Changing
		"Halloween Spell: Voices From Below": { //this is not the official spell name but it seems the single spell names get merged into it
			"cc": ["#D11959"]
		},
		"Halloween Spell: Scout's Spectral Snarl": {
			"cc": ["#acfd9e"]
		},
		"Halloween Spell: Soldier's Booming Bark": {
			"cc": ["#f48280"]
		},
		"Halloween Spell: Pyro's Muffled Moan": {
			"cc": ["#f8bbfe"]
		},
		"Halloween Spell: Demoman's Cadaverous Croak": {
			"cc": ["#90fdfd"]
		},
		"Halloween Spell: Heavy's Bottomless Bass": {
			"cc": ["#f57eff"]
		},
		"Halloween Spell: Engineers's Gravelly Growl": {
			"cc": ["#fcfd95"]
		},
		"Halloween Spell: Medic's Blood-curdling Bellow": {
			"cc": ["#f7b786"]
		},
		"Halloween Spell: Sniper's Deep Downunder Drawl": {
			"cc": ["#7c7cff"]
		},
		"Halloween Spell: Spy's Creepy Croon": {
			"cc": ["#e5e5e5"]
		}, // Weapon changing
		"Halloween Spell: Pumpkin Bombs": { //this is not the official spell name but it seems the single spell names get merged into it
			"cc": ["#68167d"]
		},
		"Halloween Spell: Exorcism": {
			"cc": [
				"#B8383B", "#5885A2"
			]
		},
		"Halloween Spell: Squash Rockets": {
			"cc": ["#dc93ff"]
		},
		"Halloween Spell: Spectral Flame": {
			"cc": ["#5faf53"]
		},
		"Halloween Spell: Sentry Quad-Pumpkins": {
			"cc": ["#8b8ce9"]
		},
		"Halloween Spell: Gourd Grenades": {
			"cc": ["#f8bb8c"]
		},
		"Halloween Spell: Halloween Fire": {
			"cc": ["#4ef442"]
		}
	};

	let filteri,
		sIc,
		filtersearchval,
		filterValue,
		filtertimeout,
		sIc2;

	if ((window.location.pathname.split("/effect/").length > 1 || window.location.pathname.startsWith("/unusuals")) && $("table.unusuallist-view").length == 0) {
		let misc_ids = ["938_", "361_", "30140_", "993_", "30329_", "783_", "393_", "30646_", "451_", "339_", "54_", "315_", "590_", "316_", "605_", "30095_", "110_", "337_", "380_", "48_", "30004_"];

		let items = $("li.item");
		let filtervar = "All";

		filteri = function () {

			$(items).filter(function () {
				$(items).show();
				var i = $(this).attr("data-class");
				if (filtervar == "misci") {
					return (misc_ids.indexOf($(this).attr("data-defindex") + "_") == -1);
				}
				if (typeof i == "undefined" && filtervar == "Multi")
					return false;
				if (typeof i == "undefined")
					return true;
				return (i.indexOf(filtervar) == -1);
			}).hide();

		};

		sIc = setInterval(function () {
			let e = $(".form-control[placeholder='Filter items...']");

			if (e.length == 1) {
				e = e[0];
				//Remove the old events
				let c = e.cloneNode();
				while (e.firstChild) {
					c.appendChild(e.lastChild);
				}
				e.parentNode.replaceChild(c, e);
				let classbuttonstemplate = `<div class="input-group-btn">
<button class="btn btn-default dropdown-toggle" id="classmenu1" role="button" data-toggle="dropdown" href="#">
<i class="stm stm-tf2"></i> <span id="className">Any
class</span>
</button>
<ul id="classmenu" class="dropdown-menu" role="menu" aria-labelledby="classmenu1">
<li><a data-class="All">Any
class</a></li>
<li><a data-class="Multi">Multi
class</a></li>
<li><a data-class="Scout">Scout</a></li>
<li><a data-class="Soldier">Soldier</a>
</li>
<li><a data-class="Pyro">Pyro</a></li>
<li><a data-class="Demoman">Demoman</a>
</li>
<li><a data-class="Heavy">Heavy</a></li>
<li><a data-class="Engineer">Engineer</a>
</li>
<li><a data-class="Medic">Medic</a></li>
<li><a data-class="Sniper">Sniper</a>
</li>
<li><a data-class="Spy">Spy</a>
</li>
<li><a data-class="misci">Miscs</a>
</li>
</ul>
</div>`;

				if (window.location.pathname.startsWith("/unusuals")) {
					$($("#unusual-pricelist-input-group").children()[0]).remove();
				}
				$("#unusual-pricelist-input-group").prepend(classbuttonstemplate);

				$("#classmenu a").click(function (e) {

					$("#className").text($(e.target).text());
					filtervar = $(e.target).attr("data-class");
					filterValue = $("#filterlist").val();
					$(items).show();
					if (filtervar != "All")
						filteri();
					$(items).filter(function () {
						if (filterValue.length == 0) return false;
						return ($(this).attr("data-name").toLowerCase().indexOf(filterValue.toLowerCase()) == -1);
					}).hide();

				});

				//Bind new events
				$(".form-control[placeholder='Filter items...']").on("keyup paste", function () {
					clearTimeout(filtertimeout);
					filtertimeout = setTimeout(function () {
						filterValue = $("#filterlist").val();
						$(items).show();
						if (filtervar != "All")
							filteri();

						$(items).filter(function () {
							if (filterValue.length == 0) return false;
							return ($(this).attr("data-name").toLowerCase().indexOf(filterValue.toLowerCase()) == -1);
						}).hide();

					}, 80);

				});

				clearInterval(sIc);
			}

		}, 150);

	}

	if (window.location.pathname.startsWith("/profiles/") || window.location.pathname.startsWith("/id/")) {


		//################################## Changes to Filtering ######################
		filteri = function () { };
		//Disable custom filtering if you liked the old method more, use at your own risk, I won't test anything without my filter version
		let ToggleCustomFilter = true;

		//Declaring Variables so they are accessible outside the scope
		{
			//Wait until the input is generated
			if (ToggleCustomFilter)
				sIc = setInterval(function () {
					let e = $(".form-control[placeholder='Search...']");

					if (e.length == 1) {
						e = e[0];
						//Remove the old events
						let c = e.cloneNode();
						while (e.firstChild) {
							c.appendChild(e.lastChild);
						}
						e.parentNode.replaceChild(c, e);

						//Add an attribute with information for filtering to every item
						let aitems = $("#backpack .item:not('.spacer')");
						let aitemsl = aitems.length;
						for (let i = 0; i < aitemsl; i++) {
							let d = $(aitems[i]);
							let info = (d.children().last().text() + " " + d.attr("data-spell_1") + " " + d.attr("data-spell_2") + " " + d.attr("data-custom_name") + " " + d.attr("data-part_name_3") + " " + d.attr("data-part_name_2") + " " + d.attr("data-part_name_1")).toLowerCase().replace(/ undefined/g, "");
							d.attr("data-filterinfo", info);
						}

						//Bind new events
						$(".form-control[placeholder='Search...']").on("keyup paste", function () {
							clearTimeout(filtertimeout);
							filtertimeout = setTimeout(function () {
								filteri();
							}, 200);
						});

						//New Filter function
						filteri = function () {
							if (ToggleCustomFilter) {
								filtersearchval = $(".form-control[placeholder='Search...']").val().toLowerCase();

								$(".backpack-page").show();
								let sitems = $("#backpack .item");
								sitems.parent().find(".filterhidden").show();

								if (filtersearchval === "")
									return;

								sitems.filter(function () {
									if (!this.dataset.hasOwnProperty("filterinfo"))
										return true;
									if (!(this.dataset.filterinfo.indexOf(filtersearchval) !== -1))
										return true;
									return false;
								}).hide().addClass("filterhidden");
							}

							//Hide empty backpack pages
							$(".backpack-page:has(li:visible)").addClass("dhide");
							$(".backpack-page").hide();
							$(".dhide").show().removeClass("dhide");

						};

						markSpells();

						//Execute the needed functions after the inventory is reloaded
						$("#refresh-inventory").click(function () {
							sIc2 = setInterval(function () {
								let e = $(".inventory .item");

								if (e.length > 0) {
									//Add an attribute with information for filtering to every item
									let aitems = $("#backpack .item:not('.spacer')");
									let aitemsl = aitems.length;
									for (let i = 0; i < aitemsl; i++) {
										let d = $(aitems[i]);
										let info = (d.children().last().text() + " " + d.attr("data-spell_1") + " " + d.attr("data-spell_2") + " " + d.attr("data-custom_name") + " " + d.attr("data-part_name_3") + " " + d.attr("data-part_name_2") + " " + d.attr("data-part_name_1")).toLowerCase().replace(/ undefined/g, "");
										d.attr("data-filterinfo", info);
									}

									//Hide empty backpack pages
									$(".backpack-page:has(li:visible)").addClass("dhide");
									$(".backpack-page").hide();
									$(".dhide").show().removeClass("dhide");


									markSpells();
									filteri();
									clearInterval(sIc2);
								}
							}, 150);
						});
						clearInterval(sIc);
					}
				}, 150);


		}
		//##############################################################################

		// Add a trade offer link to every profile possible

		let trade_link = $(".user-link").attr("data-offers-params");

		if(trade_link != undefined){
			$(".profile .information .buttons").append(`<a class="btn btn-primary btn-xs" href="https://steamcommunity.com/tradeoffer/new/${trade_link}" target="_blank">
			<i class="stm stm-steam"></i> Open trade offer</a>`);
		}

		//##############################################################################

		// Get the keyprice for later use
		let matched_keyprice = $("meta[name=description]").attr("content").match(/value of ([0-9,.]+) ref, ([0-9,.]+) keys/);
		let keyprice = parseFloat(matched_keyprice[1].replace(/,/g, "")) / parseFloat(matched_keyprice[2].replace(/,/g, ""));

		let pagetemplate = `<div class="backpack-page">
<div class="page-number">
<div class="page-anchor" id="page{pagenum}">
</div>
<a href="#page{pagenum}" class="label label-success" style="{pagestyle}">{pagename}</a>
<span class="btn btn-primary btn-xs pull-right select-page">Select Page</span>
</div>
<ul class="item-list">
</ul>
</div>`;

		var newSorts = [
			[
				"Group by paint", "paint", sortByPaint
			],
			[
				"Group by spell", "spell", sortBySpell
			],
			[
				"Group by level", "level", sortByLevel
			],
			[
				"Group by scm", "scm", sortBySCM
			],
			[
				"Group by classifieds", "classifieds", sortByClassifiedListing
			],
		];

		function sortByPaint() {
			let paints = colors;
			paints["Not Painted"] = {
				"cc": ["#676780"]
			};
			paints["Hidden Items"] = {
				"cc": ["#676780"]
			};

			for (let k in paints) {
				paints[k]["items"] = [];

			}

			let z = $(".backpack-page .item:not(.spacer)");

			paints["Hidden Items"]["items"] = $(".temp-page .item:not(.spacer)");

			for (let p = 0; p < z.length; p++) {
				if (paints.hasOwnProperty($(z[p]).attr("data-paint_name"))) {
					paints[$(z[p]).attr("data-paint_name")]["items"].push($(z[p])[0]);
				} else {
					paints["Not Painted"]["items"].push($(z[p])[0]);
				}
			}

			for (let k in paints) {
				paints[k]["items"] = genericItemSort("data-price", paints[k]["items"]);
			}

			genericSort(paints, "p");

		}

		function sortBySpell() {
			let s = spells;
			s["No Spell"] = {
				"cc": ["#676780"]
			};
			s["Hidden Items"] = {
				"cc": ["#676780"]
			};

			for (let k in s) {
				s[k]["items"] = [];
			}

			let z = $(".backpack-page .item:not(.spacer)");

			s["Hidden Items"]["items"] = $(".temp-page .item:not(.spacer)");

			for (let p = 0; p < z.length; p++) {
				if (s.hasOwnProperty($(z[p]).attr("data-spell_1"))) {
					s[$(z[p]).attr("data-spell_1")]["items"].push($(z[p])[0]);
				} else {
					s["No Spell"]["items"].push($(z[p])[0]);
				}
			}

			for (let k in s) {
				s[k]["items"] = genericItemSort("data-price", s[k]["items"]);
			}

			genericSort(s, "s", true);

		}

		function sortByLevel() {
			let l = {};
			l["No Level"] = {
				"cc": ["#676780"],
				"items": []
			};
			//Add Special Colors to specific levels like this
			l["Level 0"] = {
				"cc": ["#DD5522"],
				"items": []
			};
			l["Hidden Items"] = {
				"cc": ["#676780"]
			};

			let z = $(".backpack-page .item:not(.spacer)");

			l["Hidden Items"]["items"] = $(".temp-page .item:not(.spacer)");

			for (let p = 0; p < z.length; p++) {
				if ($(z[p]).attr("data-level") !== undefined) {
					let level = "Level " + $(z[p]).attr("data-level");
					if (!l.hasOwnProperty(level)) {
						l[level] = {
							"cc": ["#676780"],
							"items": []
						};
					}
					l[level]["items"].push($(z[p])[0]);
				} else {
					l["No Level"]["items"].push($(z[p])[0]);
				}
			}

			for (let k in l) {
				l[k]["items"] = genericItemSort("data-price", l[k]["items"]);
			}

			genericSort(l, "l", true, {
				"use": true,
				"funct": function (a, b) {
					return parseInt(a[0].split(" ")[1]) - parseInt(b[0].split(" ")[1]);
				}
			});

		}


		function sortByDefindex() {
			let d = {};
			d["No Defindex"] = {
				"cc": ["#676780"],
				"items": []
			};
			d["Items"] = {
				"cc": ["#676780"],
				"items": []
			};
			d["Hidden Items"] = {
				"cc": ["#676780"]
			};

			let z = $(".backpack-page .item:not(.spacer)");


			//If you want all defindexes on a single page and not a group for each defindex change the singlepage value
			let singlepage = false;

			d["Hidden Items"]["items"] = $(".temp-page .item:not(.spacer)");

			for (let p = 0; p < z.length; p++) {
				if ($(z[p]).attr("data-defindex") !== undefined) {
					let def = "Defindex: " + $(z[p]).attr("data-defindex");
					if (!singlepage) {
						if (!d.hasOwnProperty(def)) {
							d[def] = {
								"cc": ["#676780"],
								"items": []
							};
						}
						d[def]["items"].push($(z[p])[0]);
					} else {
						d["Items"]["items"].push($(z[p])[0]);
					}
				} else {
					d["No Defindex"]["items"].push($(z[p])[0]);
				}
			}

			if (!singlepage)
				for (let k in d) {
					d[k]["items"] = genericItemSort("data-price", d[k]["items"]);
				}
			else
				for (let k in d) {
					d[k]["items"] = genericItemSort("data-defindex", d[k]["items"]);
				}

			genericSort(d, "d", true, {
				"use": true,
				"funct": function (a, b) {
					return parseInt(a[0].split(" ")[1]) - parseInt(b[0].split(" ")[1]);
				}
			});


		}

		function sortBySCM() {
			let scm = {};
			scm["SCM"] = {
				"cc": ["#DD5522"],
				"items": []
			};
			
			scm["Not SCM"] = {
				"cc": ["#676780"],
				"items": []
			};
			
			scm["Hidden Items"] = {
				"cc": ["#676780"]
			};
			
			let z = $(".backpack-page .item:not(.spacer)");
			
			scm["Hidden Items"]["items"] = $(".temp-page .item:not(.spacer)");
			
			for (let p = 0; p < z.length; p++) {
				if ($(z[p]).attr("data-p_scm")) {
					scm["SCM"]["items"].push($(z[p])[0]);
				} else {
					scm["Not SCM"]["items"].push($(z[p])[0]);
				}
			
			}
			
			for (let k in scm) {
				scm[k]["items"] = genericItemSort("data-price", scm[k]["items"]);
			}
			
			genericSort(scm, "scm", true, {
				"use": true,
				"funct": function(a, b) {
					return parseInt(a[0].split(" ")[1]) - parseInt(b[0].split(" ")[1]);
				}
			});
		
		}

		function sortByClassifiedListing() {
			let c = {
				"Classified Listings": {},
				"Unlisted Items": {},
				"Hidden Items": {}
			};


			for (let k in c) {
				c[k]["items"] = [];
				c[k]["cc"] = ["#676780"];
			}

			let z = $(".backpack-page .item:not(.spacer)");

			c["Hidden Items"]["items"] = $(".temp-page .item:not(.spacer)");

			for (let p = 0; p < z.length; p++) {
				if ($(z[p]).attr("data-listing_price") != undefined) {
					c["Classified Listings"]["items"].push($(z[p])[0]);
				} else {
					c["Unlisted Items"]["items"].push($(z[p])[0]);
				}
			}

			for (let k in c) {
				if (k == "Classified Listings") {
					c[k]["items"] = c[k]["items"].sort((a, b) => {
						return listing_price_to_scrap($(b).attr("data-listing_price")) - listing_price_to_scrap($(a).attr("data-listing_price"));
					});
				} else {
					c[k]["items"] = genericItemSort("data-price", c[k]["items"]);
				}
			}

			genericSort(c, "c", true);

		}

		var lasttype = "";
		var sortType = "";
		var text = false;

		function genericItemSort(sortTyp, array, t = false) {
			sortType = sortTyp;
			text = t;

			array.sort(function (a, b) {

				// To reverse the sort, but currently no where needed so commented out
				// if(toggle && sortType == osortType){
				//   var tmp = a;
				//   a = b;
				//   b = tmp;
				// }

				if (text) {
					if ($(a).attr(sortType).toLowerCase() < $(b).attr(sortType).toLowerCase())
						return -1;
					if ($(a).attr(sortType).toLowerCase() > $(b).attr(sortType).toLowerCase())
						return 1;
					return 0;
				}
				return parseFloat($(b).attr(sortType)) - parseFloat($(a).attr(sortType));

			});
			return array;
		}

		function genericSort(o, type, hide = false, csort = {
			"use": false
		}) {
			$(".item:not(.spacer)").detach();
			$("#backpack").empty();
			let a = [];
			for (let k in o) {
				a.push([
					k, o[k]["cc"],
					o[k]["items"]
				]);
			}

			if (csort.use !== false) {

				for (let i = 0; i < a.length; i++) {
					if (a[i][2].length == 0) {
						a.splice(i, 1);
						i--;
					}
				}
				a.sort(csort.funct);
			}

			if (lasttype == type) {
				a.reverse();
				lasttype = type + "1";
			} else
				lasttype = type;

			for (let i = 0; i < a.length; i++) {
				if (!hide || a[i][2].length != 0) {
					let textcolor = "color: " + idealTextColor(a[i][1][0]) + ";";
					let bgcolor = (a[i][1].length == 1)
						? "background-color: " + a[i][1][0] + ";"
						: "background: linear-gradient( " + a[i][1][0] + " 0%, " + a[i][1][0] + " 50%, " + a[i][1][1] + " 50%," + a[i][1][1] + " 100% );";

					$("#backpack").append(pagetemplate.fmt({
						pagenum: i,
						pagestyle: textcolor + bgcolor,
						pagename: a[i][0]
					}));

					for (let r = 0; r < a[i][2].length; r++) {
						$("#page" + i).parent().parent().find(".item-list").append(a[i][2][r]);
					}
				}
			}

			filteri();
			$(".backpack-page a:contains('Hidden Items')").parent().parent().hide().addClass("temp-page");
		}


		//Adding new Sorting Methods
		for (let i = 0; i < newSorts.length; i++) {

			$(".panel-extras #inventory-sort-menu .dropdown-menu.dropdown-menu-right.pull-right").append(`
<li id="customsort` + i + "\" data-value=\"" + newSorts[i][1] + "\"><a>" + newSorts[i][0] + `</a></li>
`);
			$("#customsort" + i).click(function (e) {
				let i = parseInt($(e.target).parent().attr("id").replace(/^\D+/g, ""));
				$("#inventory-sort-menu").removeClass("open");
				$(".current-sort").text(newSorts[i][0]);
				newSorts[i][2]();
				e.preventDefault();
				e.stopPropagation();
			});

		}


		//Replace Sorting
		var replaceSorts = {
			"defindex": sortByDefindex
		};


		//Stop reverse sorting when another sort was clicked on before
		$(".dropdown-menu.dropdown-menu-right.pull-right li:not([id^='custom'])").click(function (e) {
			if (lasttype == $(this).attr("data-value")) {
				e.preventDefault();
				e.stopPropagation();
				let b = $("#backpack");
				b.children().each(function (e, p) {
					b.prepend(p);
				});
			} else if (replaceSorts.hasOwnProperty($(this).attr("data-value"))) {
				$("#inventory-sort-menu").removeClass("open");
				$(".current-sort").text($(this).text());
				replaceSorts[$(this).attr("data-value")]();
				e.preventDefault();
				e.stopPropagation();
			}
			lasttype = $(this).attr("data-value");
			filteri();
		});

		function listing_price_to_scrap(price) {
			if (price == undefined) return undefined;
			let out = 0;
			let price_parts = price.split(",");
			price_parts.forEach(part => {
				part = part.trim();
				if (part.indexOf("key") != -1) {
					out += parseFloat(part.split(" ")[0]) * keyprice;
				} else if (part.indexOf("ref") != -1) {
					out += parseFloat(part.split(" ")[0]);
				}
			});
			return out;
		}
        
		// Code to mark spells in the compare link too
		let compare_observer = undefined;
		let modal_observer = new MutationObserver(()=>{
			if($("#active-modal").find(".modal-title").text() == "Compare inventories"){
				compare_observer = new MutationObserver(()=>{
					markSpells();
				});
				compare_observer.observe($("#inventory-cmp-bins")[0], {"childList": true});
			} else {
				if(compare_observer != undefined){
					compare_observer.disconnect();
					compare_observer = undefined;
				}
			}
		});
		modal_observer.observe($("#page-content")[0], {"childList": true, "attributes": false, "characterData": false, "subtree": false});
	}

	if (window.location.pathname.startsWith("/classifieds")) {
		markSpells();
	}

	function markSpells() {
		$("[data-spell_1]").attr("style", "border-bottom: 6px dotted #10ff00!important");
		$("[data-spell_2]").attr("style", "border-bottom: 6px dotted #ff2121!important");
	}

	function genMP(element) {
		let query = "https://marketplace.tf/items/";
		let item = $(element);
		let defindex = item.attr("data-defindex");
		query += defindex + ";" + item.attr("data-quality");

		if (item.attr("data-craftable") !== "1")
			query += ";uncraftable";

		let effectid = item.attr("data-effect_id");
		if (effectid !== null && effectid !== undefined) {
			query += ";u" + effectid;
		}

		let skininfo = item.find(".item-icon");
		if (skininfo.length > 0) {
			skininfo = skininfo.css("background-image").match(/warpaint\/[(?!_)\S]+_[0-9]+_[0-9]+_[0-9]+\.png/g);
			if (skininfo !== null) {
				let skin = skininfo[0].split("_")[1];
				let wear = skininfo[0].split("_")[2];
				query += ";w" + wear + ";pk" + skin;
			}
		}

		

		if (item.attr("data-quality_elevated") == "11")
			query += ";strange";

		let kstier = item.attr("data-ks_tier");
		if (kstier !== null && kstier !== undefined) {
			query += ";kt-" + kstier;
		}

		if (item.attr("data-original-title").toLowerCase().indexOf("festivized") != -1)
			query += ";festive";

		return query;
	}

	function genWeaponSearch(element) {
		let query = "/premium/search?";
		let item = $(element);
		let name = item.attr("data-base_name");
		let quality = item.attr("data-quality");
		let elQuality = item.attr("data-quality_elevated") ? item.attr("data-quality_elevated") : "";
		let killstreak = item.attr("data-ks_tier") ? item.attr("data-ks_tier") : 0;
		let effect = item.attr("data-effect_id");
		let skin = item.attr("data-paint_kit");

		let skininfo = item.find(".item-icon").css("background-image").match(/warpaint\/[(?!_)\S]+_[0-9]+_[0-9]+_[0-9]+\.png/g);
		let wear = skininfo[0].split("_")[2];
		query += "item=" + name + "&quality=" + quality + "&texture_name=" + skin + "&wear_tier=" + wear + "&killstreak_tier=" + killstreak;
		if (effect) {
			query += "&particle=" + effect;
		}
		if (elQuality) {
			query += "&elevated=" + elQuality;
		}
		return query;
	}

	let skinnames = ["Bovine Blazemaker", "War Room", "Treadplate Tormenter", "Bogtrotter", "Earth, Sky and Fire", "Team Sprayer", "Spruce Deuce", "Hickory Hole-Puncher", "Rooftop Wrangler", "Civic Duty", "Civil Servant", "Local Hero", "Mayor", "Smalltown Bringdown", "Citizen Pain", "Tartan Torpedo", "Lumber From Down Under", "Rustic Ruiner", "Barn Burner", "Homemade Heater", "Plaid Potshotter", "Country Crusher", "Iron Wood", "Shot in the Dark", "Blasted Bombardier", "Backcountry Blaster", "Antique Annihilator", "Old Country", "American Pastoral", "Reclaimed Reanimator", "Red Rock Roscoe", "Sand Cannon", "Sudden Flurry", "Psychedelic Slugger", "Purple Range", "Night Terror", "Carpet Bomber", "Woodland Warrior", "Wrapped Reviver", "Forest Fire", "Night Owl", "Woodsy Widowmaker", "Backwoods Boomstick", "King of the Jungle", "Masked Mender", "Thunderbolt", "Liquid Asset", "Shell Shocker", "Current Event", "Pink Elephant", "Flash Fryer", "Spark of Life", "Dead Reckoner", "Black Dahlia", "Sandstone Special", "Lightning Rod", "Brick House", "Aqua Marine", "Low Profile", "Turbine Torcher", "Boneyard", "Pumpkin Patch", "Macabre Web", "Autumn", "Nutcracker", "Wildwood", "Top Shelf", "High Roller's", "Coffin Nail", "Dressed to Kill", "Rainbow", "Balloonicorn", "Sweet Dreams", "Mister Cuddles", "Blue Mew", "Shot to Hell", "Torqued to Hell", "Stabbed to Hell", "Brain Candy", "Flower Power", "Killer Bee", "Warhawk", "Red Bear", "Butcher Bird", "Airwolf", "Blitzkrieg", "Corsair", "Anodized Aloha", "Bamboo Brushed", "Croc Dusted", "Leopard Printed", "Macaw Masked", "Mannana Peeled", "Park Pigmented", "Piña Polished", "Sax Waxed", "Tiger Buffed", "Yeti Coated", "Bank Rolled", "Bloom Buffed", "Bonk Varnished", "Cardboard Boxed", "Clover Camo'd", "Dream Piped", "Fire Glazed", "Freedom Wrapped", "Kill Covered", "Merc Stained", "Pizza Polished", "Quack Canvassed", "Star Crossed", "Carpet Bomber Mk.II", "Woodland Warrior Mk.II", "Wrapped Reviver Mk.II", "Forest Fire Mk.II", "Night Owl Mk.II", "Woodsy Widowmaker Mk.II", "Autumn Mk.II", "Plaid Potshotter Mk.II", "Civic Duty Mk.II", "Civil Servant Mk.II", "Dead Reckoner Mk.II", "Bovine Blazemaker Mk.II", "Backwoods Boomstick Mk.II", "Masked Mender Mk.II", "Macabre Web Mk.II", "Iron Wood Mk.II", "Nutcracker Mk.II", "Smalltown Bringdown Mk.II", "Dragon Slayer", "Smissmas Sweater", "Miami Element", "Jazzy", "Mosaic", "Cosmic Calamity", "Hana", "Uranium", "Neo Tokyo", "Hazard Warning", "Damascus & Mahogany", "Dovetailed", "Alien Tech", "Cabin Fevered", "Polar Surprise", "Bomber Soul", "Geometrical Teams", "Horror Holiday", "Spectral Shimmered", "Haunted Ghosts", "Totally Boned", "Spirit of Halloween", "Calavera Canvas", "Skull Study", "Ghost Town", "Tumor Toasted", "Electroshocked"];
	let svariants = [];

	//Skin Name Autocomplete

	//Prevent Tab changing the focus
	$("#page-content").on("keydown", "input[placeholder='An exact texture name is required (Warhawk, Coffin Nail, Dressed to Kill, etc.)']", function (e) {
		if (e.which == 9 || e.keyCode == 9) {
			e.preventDefault();
		}
	});
	$("#page-content").on("keyup", "input[placeholder='An exact texture name is required (Warhawk, Coffin Nail, Dressed to Kill, etc.)']", function (e) {

		if (e.which == 9 || e.keyCode == 9) {
			e.preventDefault();
			$("input[placeholder='An exact texture name is required (Warhawk, Coffin Nail, Dressed to Kill, etc.)").val(svariants[0]);
			svariants.push(svariants.shift());
			$("#autocompskin").text("");
		} else {
			let template = "<div id=\"autocompskin\" style=\"color:gray;position: absolute;pointer-events: none;user-select: none;-moz-user-select: none;-khtml-user-select: none;-webkit-user-select: none;-o-user-select: none;transform: translate(13px, -25px);\"></div>";
			svariants = [];
			let int = $("input[placeholder='An exact texture name is required (Warhawk, Coffin Nail, Dressed to Kill, etc.)");
			if ($("#autocompskin").length == 0) $(template).insertAfter(int);
			let sl = skinnames.length;
			for (let i = 0; i < sl; i++) {
				if (skinnames[i].toLowerCase().startsWith(int.val().toLowerCase())) svariants.push(skinnames[i]);
			}

			if (svariants.length == sl || svariants.length == 0)
				$("#autocompskin").text("");
			else
				$("#autocompskin").text(svariants[0] + " - Press Tab to autocomplete, press again for alternative suggestions");

		}
	});

	//Modify Popover
	$("body").on("mouseover", ".item", function () {
		let self = this;
		let id = setInterval(function () {

			if ($(self).next().hasClass("popover")) {

				let popover = $(self).next().find("#popover-price-links");

				let id2 = setInterval(function () {

					let checkingmp = popover.find(".fa-spinner").length;
					if (checkingmp <= 0) {

						if (popover.find("a[href^='https://marketplace.tf']").length !== 1 && popover.find(".cmpb").length < 1) {
							popover.append("<a class=\"btn btn-default btn-xs cmpb\" href=\"" + genMP($(self)[0]) + "\" target=\"_blank\"><img src=\"/images/marketplace-small.png?v=2\" style='width: 13px;height: 13px;margin-top: -4px;'> Marketplace</a>");
						}
						if (popover.find("a[href^='/premium/search']").length !== 1 && $(self).attr("data-paint_kit")) {
							popover.append("<a class=\"btn btn-default btn-xs\" href=\"" + genWeaponSearch($(self)[0]) + "\"><i class=\"fa fa-star\"></i>Skin Search</a>");
						}

						clearInterval(id2);
					}
				}, 50);

				setTimeout(function () {
					clearInterval(id2);
				}, 1000);

				clearInterval(id);
			}
		}, 50);
		setTimeout(function () {
			clearInterval(id);
		}, 750);
	});

})();