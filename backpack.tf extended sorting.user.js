// ==UserScript==
// @name         backpack.tf - Miscellaneous Extensions
// @description  Adds more options for sorting items in backpacks (currently Sorting for paints, spells, levels) and other stuff which I would have liked
// @version      0.1.5
// @author       Netroscript
// @namespace    https://github.com/NetroScript
// @include      /^https?:\/\/backpack\.tf\/(?:id|profiles)\/.*/
// @include      /^https?:\/\/backpack\.tf\/effect\/.*/
// @downloadURL https://github.com/NetroScript/backpack.tf-miscellaneous-extensions/raw/master/backpack.tf%20extended%20sorting.user.js
// @updateURL   https://github.com/NetroScript/backpack.tf-miscellaneous-extensions/raw/master/backpack.tf%20extended%20sorting.meta.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  //###############Source: https://stackoverflow.com/a/15605648
  String.prototype.fmt = function(hash) {
    var string = this,
      key;
    for (key in hash)
      string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]);
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
  let Price;
  {
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
    Price = function(o, p1, p2) {
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
      jQuery('.item[data-p_bptf*="keys"]').sort(function(a, b) {
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
      var currencies = Price.stringToCurrencies(string),
        value = 0,
        k;

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
            $item.data('part_price_1'), $item.data('part_price_2'), $item.data('part_price_3')
          ],
          paint: [$item.data('paint_price')]
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
          $item.data('part_price_1'), $item.data('part_price_2'), $item.data('part_price_3')
        ],
        paint: [$item.data('paint_price')]
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
      var vals = string.split(', '),
        i,
        currency,
        match,
        reg = /([\d\.]*) (\w*)/; // currency name, amount
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
  }
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
      "cc": [
        "#654740", "#28394D"
      ],
      "price": "13 ref",
      "refprice": 14
    },
    "Balaclavas Are Forever": {
      "cc": [
        "#3B1F23", "#18233D"
      ],
      "price": "12.66 ref",
      "refprice": 12.66
    },
    "Cream Spirit": {
      "cc": [
        "#C36C2D", "#B88035"
      ],
      "price": "13 ref",
      "refprice": 14
    },
    "Operator's Overalls": {
      "cc": [
        "#483838", "#384248"
      ],
      "price": "9.44 ref",
      "refprice": 9.44
    },
    "Team Spirit": {
      "cc": [
        "#B8383B", "#5885A2"
      ],
      "price": "27 ref",
      "refprice": 28
    },
    "The Value of Teamwork": {
      "cc": [
        "#803020", "#256D8D"
      ],
      "price": "24.33–24.88 ref",
      "refprice": 24.55
    },
    "Waterlogged Lab Coat": {
      "cc": [
        "#A89A8C", "#839FA3"
      ],
      "price": "10.55 ref",
      "refprice": 10.55
    }
  };

  var spells = { //Footprints
    "Halloween Spell: Team Spirit Footprints": {
      "cc": [
        "#B8383B", "#5885A2"
      ],
      "refprice": 50
    },
    "Halloween Spell: Gangreen Footprints": {
      "cc": ["#79c46b"],
      "refprice": 49
    },
    "Halloween Spell: Corpse Gray Footprints": {
      "cc": ["#8e9f9d"],
      "refprice": 48
    },
    "Halloween Spell: Violent Violet Footprints": {
      "cc": ["#f7b4fe"],
      "refprice": 47
    },
    "Halloween Spell: Rotten Orange Footprints": {
      "cc": ["#CF7336"],
      "refprice": 46
    },
    "Halloween Spell: Bruised Purple Footprints": {
      "cc": ["#7D4071"],
      "refprice": 45
    },
    "Halloween Spell: Headless Horseshoes": {
      "cc": ["#ba76ff"],
      "refprice": 44
    }, //Paint changing
    "Halloween Spell: Die Job": {
      "cc": [
        "#E7B53B", "#8586ff"
      ],
      "refprice": 43
    },
    "Halloween Spell: Spectral Spectrum": {
      "cc": [
        "#B8383B", "#5885A2"
      ],
      "refprice": 42
    },
    "Halloween Spell: Putrescent Pigmentation": {
      "cc": [
        "#79c46b", "#67B037"
      ],
      "refprice": 41
    },
    "Halloween Spell: Sinister Staining": {
      "cc": [
        "#F2EF46", "#808000"
      ],
      "refprice": 40
    },
    "Halloween Spell: Chromatic Corruption": {
      "cc": [
        "#DB42BD", "#7D4071"
      ],
      "refprice": 39
    }, //Voice Changing
    "Halloween Spell: Voices From Below": { //this is not the official spell name but it seems the single spell names get merged into it
      "cc": ["#D11959"],
      "refprice": 37
    },
    "Halloween Spell: Scout's Spectral Snarl": {
      "cc": ["#acfd9e"],
      "refprice": 37
    },
    "Halloween Spell: Soldier's Booming Bark": {
      "cc": ["#f48280"],
      "refprice": 37
    },
    "Halloween Spell: Pyro's Muffled Moan": {
      "cc": ["#f8bbfe"],
      "refprice": 37
    },
    "Halloween Spell: Demoman's Cadaverous Croak": {
      "cc": ["#90fdfd"],
      "refprice": 36
    },
    "Halloween Spell: Heavy's Bottomless Bass": {
      "cc": ["#f57eff"],
      "refprice": 35
    },
    "Halloween Spell: Engineers's Gravelly Growl": {
      "cc": ["#fcfd95"],
      "refprice": 34
    },
    "Halloween Spell: Medic's Blood-curdling Bellow": {
      "cc": ["#f7b786"],
      "refprice": 33
    },
    "Halloween Spell: Sniper's Deep Downunder Drawl": {
      "cc": ["#7c7cff"],
      "refprice": 32
    },
    "Halloween Spell: Spy's Creepy Croon": {
      "cc": ["#e5e5e5"],
      "refprice": 31
    }, // Weapon changing
    "Halloween Spell: Pumpkin Bombs": { //this is not the official spell name but it seems the single spell names get merged into it
      "cc": ["#68167d"],
      "refprice": 37
    },
    "Halloween Spell: Exorcism": {
      "cc": [
        "#B8383B", "#5885A2"
      ],
      "refprice": 38
    },
    "Halloween Spell: Squash Rockets": {
      "cc": ["#dc93ff"],
      "refprice": 38
    },
    "Halloween Spell: Spectral Flame": {
      "cc": ["#5faf53"],
      "refprice": 38
    },
    "Halloween Spell: Sentry Quad-Pumpkins": {
      "cc": ["#8b8ce9"],
      "refprice": 38
    },
    "Halloween Spell: Gourd Grenades": {
      "cc": ["#f8bb8c"],
      "refprice": 38
    },
    "Halloween Spell: Halloween Fire": {
      "cc": ["#4ef442"],
      "refprice": 38
    }
  };

  let filteri,
    sIc,
    filtersearchval,
    filterValue,
    filtertimeout;

  if (window.location.pathname.split("/effect/").length > 1 && $("table.unusuallist-view").length == 0) {

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
</ul>
</div>`;

    $("#unusual-pricelist-input-group").prepend(classbuttonstemplate);

    let items = $("li.item");
    let filtervar = "All";

    filteri = function() {

      $(items).filter(function() {
        $(items).show();
        var i = $(this).attr('data-class');
        if (typeof i == 'undefined' && filtervar == "Multi")
          return false;
        if (typeof i == 'undefined')
          return true;
        return (i.indexOf(filtervar) == -1);
      }).hide();

    };

    $("#classmenu a").click(function(e) {

      $("#className").text($(e.target).text());
      filtervar = $(e.target).attr("data-class");
      filterValue = $('#filterlist').val();
      if (filtervar != "All")
        filteri();
      $(items).filter(function() {
        return ($(this).attr('data-name').toLowerCase().indexOf(filterValue.toLowerCase()) == -1);
      }).hide();

    });

    sIc = setInterval(function() {
      let e = $(".form-control[placeholder='Filter items...']");

      if (e.length == 1) {
        e = e[0];
        //Remove the old events
        let c = e.cloneNode();
        while (e.firstChild) {
          c.appendChild(e.lastChild);
        }
        e.parentNode.replaceChild(c, e);

        //Bind new events
        $(".form-control[placeholder='Filter items...']").on("keyup paste", function() {
          clearTimeout(filtertimeout);
          filtertimeout = setTimeout(function() {
            filterValue = $('#filterlist').val();

            if (filtervar != "All")
              filteri();

            $(items).filter(function() {
              return ($(this).attr('data-name').toLowerCase().indexOf(filterValue.toLowerCase()) == -1);
            }).hide();

          }, 80);

        });

        clearInterval(sIc);
      }

    }, 150);

  }

  if (window.location.pathname.startsWith("/profiles/") || window.location.pathname.startsWith("/id/")) {

    //################################## Changes to Filtering ######################

    //Disable custom filtering if you liked the old method more, use at your own risk, I won't test anything without my filter version
    let ToggleCustomFilter = true;

    //Declaring Variables so they are accessible outside the scope

    {
      //Wait until the input is generated
      if (ToggleCustomFilter)
        sIc = setInterval(function() {
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
            $(".form-control[placeholder='Search...']").on("keyup paste", function() {
              clearTimeout(filtertimeout);
              filtertimeout = setTimeout(function() {
                filteri();
              }, 200);

            });

            clearInterval(sIc);
          }

        }, 150);

      //New Filter function
      filteri = function() {
        if (ToggleCustomFilter) {
          filtersearchval = $(".form-control[placeholder='Search...']").val().toLowerCase();

          $(".backpack-page").show();
          let sitems = $("#backpack .item");
          sitems.parent().find(".filterhidden").show();

          if (filtersearchval === "")
            return;

          sitems.filter(function() {
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
    }
    //##############################################################################

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
        "Sort by paint", "paint", sortByPaint
      ],
      [
        "Sort by spell", "spell", sortBySpell
      ],
      ["Sort by level", "level", sortByLevel]
    ];

    function sortByPaint() {
      let paints = colors;
      paints["Not Painted"] = {
        "cc": ["#676780"],
        "price": "No Paint Price",
        "refprice": 0
      };

      paints["Hidden Items"] = {
        "cc": ["#676780"],
        "price": "No Paint Price",
        "refprice": 0
      };

      for (let k in paints) {
        paints[k]["items"] = [];

      }

      let z = $('.backpack-page .item:not(.spacer)');

      paints["Hidden Items"]["items"] = $('.temp-page .item:not(.spacer)');

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
        "cc": ["#676780"],
        "price": "No Spell Price",
        "refprice": 0
      };

      s["Hidden Items"] = {
        "cc": ["#676780"],
        "refprice": 0
      };

      for (let k in s) {
        s[k]["items"] = [];

      }

      let z = $('.backpack-page .item:not(.spacer)');

      s["Hidden Items"]["items"] = $('.temp-page .item:not(.spacer)');

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
        "refprice": 0,
        "items": []
      };
      //Add Special Colors to specific levels like this
      l["Level 0"] = {
        "cc": ["#DD5522"],
        "refprice": 0,
        "items": []
      };

      l["Hidden Items"] = {
        "cc": ["#676780"],
        "refprice": 0
      };

      let z = $('.backpack-page .item:not(.spacer)');

      l["Hidden Items"]["items"] = $('.temp-page .item:not(.spacer)');

      for (let p = 0; p < z.length; p++) {
        if ($(z[p]).attr("data-level") !== undefined) {
          let level = "Level " + $(z[p]).attr("data-level");
          if (!l.hasOwnProperty(level)) {
            l[level] = {
              "cc": ["#676780"],
              "refprice": 0,
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
        "funct": function(a, b) {
          return parseInt(a[0].split(" ")[1]) - parseInt(b[0].split(" ")[1]);
        }
      });

    }

    var lasttype = "";

    var sortType = "";
    var text = false;
    function genericItemSort(sortTyp, array, t = false) {
      sortType = sortTyp;
      text = t;

      array.sort(function(a, b) {

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

    let BPItems = $(".items:not(.spacer)");

    function genericSort(o, type, hide = false, csort = {
      "use": false
    }) {
      $(".item:not(.spacer)").detach();
      $("#backpack").empty();
      let i = 0;
      let a = [];
      for (let k in o) {

        a.push([k, o[k]["cc"], o[k]["refprice"], o[k]["items"]
        ]);

      }

      if (csort.use !== false) {

        for (let i = 0; i < a.length; i++) {
          if (a[i][3].length == 0) {
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
        if (!hide || a[i][3].length != 0) {

          let textcolor = "color: " + idealTextColor(a[i][1][0]) + ";";
          let bgcolor = (a[i][1].length == 1)
            ? "background-color: " + a[i][1][0] + ";"
            : "background: linear-gradient( " + a[i][1][0] + " 0%, " + a[i][1][0] + " 50%, " + a[i][1][1] + " 50%," + a[i][1][1] + " 100% );";

          $("#backpack").append(pagetemplate.fmt({
            pagenum: i,
            pagestyle: textcolor + bgcolor,
            pagename: a[i][0]
          }));

          for (let r = 0; r < a[i][3].length; r++) {
            $("#page" + i).parent().parent().find(".item-list").append(a[i][3][r]);
          }

        }

      }

      filteri();
      $(".backpack-page a:contains('Hidden Items')").parent().parent().hide().addClass("temp-page");
    }

    for (let i = 0; i < newSorts.length; i++) {

      $(".panel-extras .dropdown-menu.dropdown-menu-right.pull-right").append(`
<li id="customsort` + i + `" data-value="` + newSorts[i][1] + `"><a>` + newSorts[i][0] + `</a></li>
`);
      $("#customsort" + i).click(function(e) {

        let i = parseInt($(e.target).parent().attr("id").replace(/^\D+/g, ''));
        $("#inventory-sort-menu").removeClass("open");
        $(".current-sort").text(newSorts[i][0]);
        newSorts[i][2]();
        e.preventDefault();
        e.stopPropagation();
      });

    }

    function markSpells() {
      $("[data-spell_1]").attr("style", "border-bottom: 6px dotted #10ff00!important");
      $("[data-spell_2]").attr("style", "border-bottom: 6px dotted #ff2121!important");
    }

    markSpells();

    //Stop reverse sorting when another sort was clicked on before
    $(".dropdown-menu.dropdown-menu-right.pull-right li:not([id^='custom'])").click(function(e) {
      if (lasttype == $(this).attr("data-value")) {
        e.preventDefault();
        e.stopPropagation();
        let b = $('#backpack');
        b.children().each(function(e, p) {
          b.prepend(p);
        });
      }
      lasttype = $(this).attr("data-value");
      filteri();
    });
  }

})();
