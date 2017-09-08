// ==UserScript==
// @name         backpack.tf - Miscellaneous Extensions
// @description  Adds more options for sorting items in backpacks (currently Sorting for paints)
// @version      0.1
// @author       Netroscript
// @namespace    https://github.com/NetroScript
// @include      /^https?:\/\/backpack\.tf\/(?:id|profiles)\/.*/
// @grant        none
// @run-at       document-end
// ==/UserScript==


(function() {
    'use strict';
	

	//###############Source: https://stackoverflow.com/a/15605648
	String.prototype.fmt = function (hash) {
		var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string;
	};
	//##############################################################


	//###############Source: https://stackoverflow.com/a/4726403
	function idealTextColor(bgColor) {

		var nThreshold = 105;
		var components = getRGBComponents(bgColor);
		var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

		return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";   
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
	
	
	
	/*
	To update go to https://backpack.tf/pricelist/c/paints
	and execute 
	
for(var c in colors){

colors[c].price = $('.name:contains("'+c+'")').parent().find(".dropdown-toggle span").text()
}

and copy paste result back

then in an inventory to convert prices:

for(var c in colors){
refval = new Price(colors[c].price).getRefinedValue().toFixed(2).split(".")
refval[1] = parseFloat(refval[1]);
if(refval[1] > 0 && refval[1] <= 5) refval[1] = "00"; else
if(refval[1] > 5 && refval[1] <= 15) refval[1] = "11"; else
if(refval[1] > 15 && refval[1] <= 26) refval[1] = "22"; else
if(refval[1] > 26 && refval[1] <= 37) refval[1] = "33"; else
if(refval[1] > 37 && refval[1] <= 49) refval[1] = "44"; else
if(refval[1] > 49 && refval[1] <= 61) refval[1] = "55"; else
if(refval[1] > 61 && refval[1] <= 70) refval[1] = "66"; else
if(refval[1] > 70 && refval[1] <= 82) refval[1] = "77"; else
if(refval[1] > 82 && refval[1] <= 93) refval[1] = "88";
else {
refval[1] = "00";
refval[0] = ""+(parseFloat(refval[0])+1)
}


colors[c].refprice = parseFloat(refval.join("."))
}




	
	*/
	
	
	
	
	//###############Source: https://gist.github.com/juliarose/4ed4b5bfa606b53c00ed876ad3400e02/a427834d12ba85fc5391a0a9a5bb135b0f5ce039/
	/*

For use on backpack.tf inventory pages only.

Used for converting any type of value (string, jQuery object, number)
to an easy to use interface for working with prices.

Usage:
    
    Instance:
        1. new Price('1 key'); // value = 1, currency = 'keys'
        2. new Price($item); // convert jQuery item which has data-p_bptf attribute
        3. new Price(5, 6, 'keys'); // 5-6 keys
        4. new Price({ value: 2, value_high: 3, currency: metal }) // 2-3 ref
    
    Instance Getters:
        average:
            Description:
                Produces an average of value and value_high.
            
            Usage: 
                new Price(3,4).avereage // 3.5
    
    Instance Methods:
        getRefinedValue:
            Description:
                Gets the value in refined. Bases conversion on average
                by default. Pass a parameter to use a different value.
                Returns 0 if no number can be converted.
            
            Usage: 
                1. price.getRefinedValue();
                2. price.getRefinedValue(price.value);
        
        parseJQuery:
            Description:
                Parses jQuery item object for assigning values.
                
            Usage:
                price.parseJQuery($item);
        
        parseUSD:
            Description:
                Parses USD value.
                
            Usage:
                price.parseUSD('$12.44');
        
        parseString:
            Description:
                Parses a price string for assigning values.
                
            Usage:
                price.parseString('2-3 ref');
    
    Class Methods:
        setup:
            Description:
                Call when document is ready to set core attributes.
            
            Usage:
                $(document).ready(function() {
                    Price.setup(); // get key price
                });
        
        stringToRefinedPrice:
            Description:
                Converts a string to a value in refined metal.
                
            Usage:
                Price.stringToRefinedPrice('1 key, 5 ref'); // 25 (when keys are 20 refined)
        
        stringToCurrencies:
            Description:
                Converts a string to an object of currencies.
                
            Usage:
                Price.stringToCurrencies('1 key, 5 ref'); // { keys: 1, metal: 5 }
        
        modifyBonusValue:
            Description:
                Modifies value gained from paint or strange parts. This method
                accepts a 2nd parameter to modify seperate values for each type
                of bonus (paint, or strangePart)
                
            Usage:
                1. Price.modifyBonusValue($item, { paint: 0.5, strangePart: 0 }); // 50% added value from paints, 0% from strange parts
                2. Price.modifyBonusValue($item); // values from bonuses
        
        roundRefinedValue:
            Description:
                Rounds a refined value to the nearest 1/36 in two decimals.
                
            Usage:
                Price.roundRefinedValue(3.3333); // 3.33
    
    Class Properites:
        keyPrice:
            The price of keys in refined metal.
            
        instanceAttributes:
            Array of attributes used by price instance.
            
        RefinedCurrencyValue:
            Value in refined metal of each currency.
        
        CurrencyName:
            Global name for currency string e.g. 'ref' = 'metal'


*/

// p1 and p2 are optional
var Price = function(o, p1, p2) {
    var self = this;
    
    switch (typeof o) {
        case 'string':
            this.parseString(o);
            break;
        case 'object':
            if (o instanceof jQuery) {
                this.parseJQuery(o, p1, p2);
            } else {
                // basic price object
                // { value: 1, value_high: 2, currency: 'metal' }
                for (var k, i = 0; i < Price.instanceAttributes.length; i++) {
                    k = Price.instanceAttributes[i];
                    
                    if (o[k] !== undefined) {
                        this[k] = o[k]; // attach properties
                    }
                }
            }
            break;
        case 'number':
            this.value = o;
            this.value_high = !isNaN(p1) && p1;
            this.currency = Price.CurrencyName[p2 || p1] || 'metal'; // presumed metal if no currency
            break;
    }
    
    this.__defineGetter__('average', function() {
        if (self.value_high && self.value) {
            return (self.value + self.value_high) / 2;
        } else {
            return self.value || 0;
        }
    });
};

Price.prototype.parseJQuery = function($item, scm) {
    if ($item.data('p_bptf')) {
        this.parseString($item.data('p_bptf'));
    } else if ($item.data('p_scm_all') && scm) { // p1 must be set to use scm price as value
        this.parseString($item.data('p_scm_all')); // the scm value is only the base scm value, and does not included value for additions
    }
    
    if ($item.data('p_bptf_all')) {
        this.parseUSD($item.data('p_bptf_all'));
    }
        
    // if there is no value that could be found, but there is a price...
    if (!this.value && $item.data('price')) {
        this.value = $item.data('price');
        this.currency = 'metal';
    }
};

Price.prototype.parseString = function(string) {
    var match = string.match(/^([\d\.]*)[\––]?([\d\.]*)? (\w*)/); // "1-1.2 keys"
    
    if (match) {
        this.value = parseFloat(match[1]);
        this.currency = Price.CurrencyName[match[3] || match[2]]; // if it's not in the 3rd group, it's in the 2nd
        
        // if there are 3 match groups, there is a range
        if (match[3]) {
            this.value_high = parseFloat(match[2]); 
        }
    }
};

Price.prototype.parseUSD = function(string) {
    var match = string.match(/\$(\d{1,}\.\d{2})/); // 290.00 ref, $33.35
    
    if (match) {
        this.usd = parseFloat(match[1]);
    }
};

Price.prototype.getRefinedValue = function(value) {
    var currencyValue = Price.RefinedCurrencyValue[this.currency];
    
    if (currencyValue) {
        return (value || this.average) * currencyValue;
    } else {
        return 0;
    }
};

Price.RefinedCurrencyValue = {
    'metal': 1,
    'keys': 1
};

Price.CurrencyName = {
    'keys': 'keys',
    'key': 'keys',
    'ref': 'metal',
    '$': 'usd'
};

// get the value of keys in metal
Price.getKeyPrice = function() {
    // get key price only if a key price doesn't already exist, or the force value is truthy
    // this process is slow (for larger inventories) and mostly only needs to be called once (should take 1-100ms)
    if (Price.keyPrice) {
        return;
    }
    
    var rawValue = Session.rawCurrency.value;
    
    Price.RefinedCurrencyValue['usd'] = 1 / rawValue; // set value of usd
    
    // find items priced in keys
    // then sort items by price (the higher the price, the more accurate key value we can get)
    jQuery('.item[data-p_bptf*="keys"]').sort(function(a,b) {
        var ax = parseFloat($(a).attr('data-price')) || 0;
        var bx = parseFloat($(b).attr('data-price')) || 0;
        var val = 0;
        
        if (ax > bx) {
          return -1;
        } else if (ax < bx) {
          return 1;
        }
        
        return 0;
    }).each(function() {
        // loop through items until we find an item priced in keys
        var price = new Price(jQuery(this));
        
        if (price.currency === 'keys' && price.value && price.usd) {
            // to get the value of keys in metal...
            // value of items is 2 keys, or $4.32
            // keys = 2
            // usd = 4.32
            // 4.32 / 2 = 2.16 (the value of 1 key)
            // 2.16 / 0.12 (rawValue) = 18 (refined metal)
            Price.setKeyPrice((price.usd / price.average) / rawValue);
            
            return false; // we found what we're looking for, break the loop
        }
    });
    
    if (!Price.keyPrice) {
        // set value using the value of a key, if no items in inventory are priced in keys
        var key = $('.item[data-name="Mann Co. Supply Crate Key"]:first');
        var price = key && key.length && new Price(key);
        
        if (price && price.value) {
            Price.setKeyPrice(price.average);
        }
    }
    
};

Price.setKeyPrice = function(value) {
    Price.keyPrice = value;
    Price.RefinedCurrencyValue['keys'] = value;
    
    console.log('key price is: ' + value);
};

Price.instanceAttributes = ['value', 'value_high', 'usd', 'currency'];

// convert a string to a value in refined metal
// when keys are 20 refined, 1 key, 5 ref -> 25
Price.stringToRefinedPrice = function(string) {
    var currencies = Price.stringToCurrencies(string), value = 0, k;
    
    for (k in currencies) {
        if (Price.RefinedCurrencyValue[k]) {
            value += Price.RefinedCurrencyValue[k] * currencies[k]; // multiply amount of currency by value of currency in metal
        }
    }
    
    return Price.roundRefinedValue(value);
};

// round down to nearest 1/36 of a ref
Price.roundRefinedValue = function(value) {
    return value && Math.floor(Math.round(value * 36) / 36 * 100) / 100;
};

// modify an item's bonus values
// values is an object:
// { strangePart: 0.2, paint: 0.5 }
// to value strange parts as 20% value and paint as 50% value
Price.modifyBonusValue = function($item, multipliers) {
    var bonusValue = 0;
    var rawBonusValue = 0;
    var baseValue = 0;
    var isUnusual = $item.data('quality') == 5;
    
    // does not apply to unusuals
    if (multipliers && !isUnusual) {
        var basePrice = $item.data('price') && new Price($item, true);
        baseValue = (basePrice && basePrice.getRefinedValue()) || 0; // modify based on price attribute
        
        var bonusValues = {
            strangePart: [
                $item.data('part_price_1'),
                $item.data('part_price_2'),
                $item.data('part_price_3')
            ],
            paint: [
                $item.data('paint_price')
            ]
        };
        
        for (var k in bonusValues) {
            // loop through values
            for (var i = 0; i < bonusValues[k].length; i++) {
                if (bonusValues[k][i]) {
                    var bonusPrice = new Price(bonusValues[k][i]);
                    var bonusPriceRefinedValue = bonusPrice.getRefinedValue();
                    
                    bonusValue += bonusPriceRefinedValue * (multipliers[k] || 0); // create price from attribute and multiply its average by multiplier
                    rawBonusValue += bonusPriceRefinedValue;
                }
            }
        }
    } else {
        baseValue = new Price($item).getRefinedValue();
    }
    
    return baseValue + bonusValue;
};

Price.hasBonuses = function($item) {
    var bonusValues = {
        strangePart: [
            $item.data('part_price_1'),
            $item.data('part_price_2'),
            $item.data('part_price_3')
        ],
        paint: [
            $item.data('paint_price')
        ]
    };
    
    for (var k in bonusValues) {
        for (var i = 0; i < bonusValues[k].length; i++) {
            if (bonusValues[k][i]) {
                return true;
            }
        }
    }
    
    return false;
};

// convert string of currencies to object of currencies
// 5 keys, 5 ref -> { keys: 5, metal: 5 }
Price.stringToCurrencies = function(string) {
    var vals = string.split(', '), i, currency, match, reg = /([\d\.]*) (\w*)/; // currency name, amount
    var currencies = {};
    
    for (i = 0; i < vals.length; i++) {
        match = vals[i].match(reg);
        currency = match && Price.CurrencyName[match[2]];
        
        if (currency) {
            currencies[currency] = parseFloat(match[1]);
        }
    }
    
    return currencies;
};

Price.setup = function() {
    Price.getKeyPrice(); // get key price
};
		//##############################################################################################################################################################
	
	 var colors = {
    "A Color Similar to Slate": {
        "cc": ["#2F4F4F"],
        "price": "12.11 ref",
        "refprice": 12.11
    },
    "A Deep Commitment to Purple": {
        "cc": ["#7D4071"],
        "price": "13.44–14 ref",
        "refprice": 13.77
    },
    "A Distinctive Lack of Hue": {
        "cc": ["#141414"],
        "price": "1.75 keys",
        "refprice": 51.44
    },
    "A Mann's Mint": {
        "cc": ["#BCDDB3"],
        "price": "19 ref",
        "refprice": 20
    },
    "After Eight": {
        "cc": ["#2D2D24"],
        "price": "22 ref",
        "refprice": 23
    },
    "Aged Moustache Grey": {
        "cc": ["#7E7E7E"],
        "price": "7.55 ref",
        "refprice": 7.55
    },
    "An Extraordinary Abundance of Tinge": {
        "cc": ["#E6E6E6"],
        "price": "1.85 keys",
        "refprice": 54.33
    },
    "Australium Gold": {
        "cc": ["#E7B53B"],
        "price": "14.33–15 ref",
        "refprice": 14.66
    },
    "Color No. 216-190-216": {
        "cc": ["#D8BED8"],
        "price": "8.66 ref",
        "refprice": 8.66
    },
    "Dark Salmon Injustice": {
        "cc": ["#E9967A"],
        "price": "10.55 ref",
        "refprice": 10.55
    },
    "Drably Olive": {
        "cc": ["#808000"],
        "price": "8.33 ref",
        "refprice": 8.33
    },
    "Indubitably Green": {
        "cc": ["#729E42"],
        "price": "11.11–13.55 ref",
        "refprice": 12.33
    },
    "Mann Co. Orange": {
        "cc": ["#CF7336"],
        "price": "9.33 ref",
        "refprice": 9.33
    },
    "Muskelmannbraun": {
        "cc": ["#A57545"],
        "price": "2.55 ref",
        "refprice": 2.55
    },
    "Noble Hatter's Violet": {
        "cc": ["#51384A"],
        "price": "7.55 ref",
        "refprice": 7.55
    },
    "Peculiarly Drab Tincture": {
        "cc": ["#C5AF91"],
        "price": "3.88 ref",
        "refprice": 3.88
    },
    "Pink as Hell": {
        "cc": ["#FF69B4"],
        "price": "1.5 keys",
        "refprice": 44.11
    },
    "Radigan Conagher Brown": {
        "cc": ["#694D3A"],
        "price": "4.55 ref",
        "refprice": 4.55
    },
    "The Bitter Taste of Defeat and Lime": {
        "cc": ["#32CD32"],
        "price": "1.05–1.4 keys",
        "refprice": 37
    },
    "The Color of a Gentlemann's Business Pants": {
        "cc": ["#F0E68C"],
        "price": "9.66–10.33 ref",
        "refprice": 11
    },
    "Ye Olde Rustic Colour": {
        "cc": ["#7C6C57"],
        "price": "2.22–2.44 ref",
        "refprice": 2.33
    },
    "Zepheniah's Greed": {
        "cc": ["#424F3B"],
        "price": "5.66–6.33 ref",
        "refprice": 7
    },
    "An Air of Debonair": {
        "cc": ["#654740", "#28394D"],
        "price": "13 ref",
        "refprice": 14
    },
    "Balaclavas Are Forever": {
        "cc": ["#3B1F23", "#18233D"],
        "price": "12.66 ref",
        "refprice": 12.66
    },
    "Cream Spirit": {
        "cc": ["#C36C2D", "#B88035"],
        "price": "13 ref",
        "refprice": 14
    },
    "Operator's Overalls": {
        "cc": ["#483838", "#384248"],
        "price": "9.44 ref",
        "refprice": 9.44
    },
    "Team Spirit": {
        "cc": ["#B8383B", "#5885A2"],
        "price": "27 ref",
        "refprice": 28
    },
    "The Value of Teamwork": {
        "cc": ["#803020", "#256D8D"],
        "price": "24.33–24.88 ref",
        "refprice": 24.55
    },
    "Waterlogged Lab Coat": {
        "cc": ["#A89A8C", "#839FA3"],
        "price": "10.55 ref",
        "refprice": 10.55
    }
};

	
	let pagetemplate = 
`<div class="backpack-page">
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
		["Sort by paint", "paint", sortByPaint]
	];


	function	sortByPaint(){
		let paints = colors;
		paints["Not Painted"] = {
			"cc": ["#676780"],
			"price": "No Paint Price",
			"refprice": 0
		};

		for(let k in paints){
			paints[k]["items"] = [];

		}

		let z = $('.item');

		for(let p = 0; p < z.length;p++){
			if(paints.hasOwnProperty($(z[p]).attr("data-paint_name"))){
				paints[$(z[p]).attr("data-paint_name")]["items"].push($(z[p])[0]);
			}else{
				paints["Not Painted"]["items"].push($(z[p])[0]);
			}

			$(z[p]).detach();
		}

		$("#backpack").empty();
		let i = 0;
		for(let k in paints){

			
			let textcolor="color: "+idealTextColor(paints[k]["cc"][0])+";";
			let bgcolor = (paints[k]["cc"].length == 1) ? "background-color: "+paints[k]["cc"][0]+";" : "background: linear-gradient( "+paints[k]["cc"][0]+" 0%, "+paints[k]["cc"][0]+" 50%, "+paints[k]["cc"][1]+" 50%,"+paints[k]["cc"][1]+" 100% );";
			
			$("#backpack").append(pagetemplate.fmt({pagenum: i, pagestyle: textcolor+bgcolor, pagename: k}));

			for(let r = 0; r < paints[k].items.length;r++){
				$("#page"+i).parent().parent().find(".item-list").append( paints[k].items[r]);
			}

			i++;
		}


		console.log(paints);
	}



	for(let i = 0; i < newSorts.length; i++){

		$(".panel-extras .dropdown-menu.dropdown-menu-right.pull-right").append(`
<li id="customsort`+ i +`" data-value="`+ newSorts[i][1] +`"><a>`+ newSorts[i][0] +`</a></li>
`);
		$("#customsort"+i).click(function(e){


			let i = parseInt($(e.target).parent().attr("id").replace( /^\D+/g, ''));
			$("#inventory-sort-menu").removeClass("open");
			$(".current-sort").text(newSorts[i][0]);
			newSorts[i][2]();	
			e.preventDefault();
			e.stopPropagation();		
		});


	


	}


})();