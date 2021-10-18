# backpack.tf * Miscellaneous Extensions

This is an userscript to add miscellaneous functionality to backpack.tf (which I would have liked for myself).
Currently included is:

* In inventories add a Group by paint
* In inventories add a Group by spell (including grouping and displaying double spelled items)
* In inventories add a Group by level
* In inventories add a Group by scm price
* In inventories add a Group by Classifieds (shows you all the listed items)
* In inventories add a Group by Craft numbers (cases and crates have their own category)
* Allow the reversion of the groups from a sort
* Filter by class on backpack.tf/effect/<effect>
* For unusuals you can not only filter for class but now also filter for miscs (manually curated list, if you want more open an issue)
* Improve classifieds / premium search
  * Autocomplete skin names
  * Filter unusual effects
* Marketplace link for any item
* Premium search for decorated weapons
* Spells are highlighted in inventories (green dotted lower border for 1 spell, red for multiple spells)
* If possible a trade offer link will be added to the profile links, so you can offer a trade even when the user has no listed item

## Installation

_____________________________________________

Use an extension which can execute userscripts (F.e. [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) for [Chrome](https://www.google.com/chrome/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)  for [Firefox](https://www.mozilla.org/firefox))
and then install using this link: [backpack.tf extended sorting.user.js](https://github.com/NetroScript/backpack.tf-miscellaneous-extensions/raw/master/backpack.tf%20extended%20sorting.user.js).

(Or paste / install it manually for your plugin)

## Changelog

_____________________________________________

#### 0.1.25

Improved:

* All skin / war paint names for the auto complete which were added to the game since the Winter 2019 Collection (up to Scream Fortress XIII Collection)
* Tradeoffer links are (when available) now correctly displayed on all user pages (Profile and Friends), instead of only the Backpack page.

#### 0.1.24

Added:

* Grouping by craft number

#### 0.1.23

Fixed:

* Spell sorting

#### 0.1.22

Added:

* Double spell grouping
* Choosing group by spells groups by colors then by footprints. Group by spell again to inverse. 

Fixed:

* Voices from Below sorting

#### 0.1.21

Added:

* Added particle search in classifieds search

#### 0.1.20

Improved:

* Generation of Marketplace.tf Links
* Now using an ESLint config

#### 0.1.19

Added:

* Added trade offer link to every profile (where the trade offer link is known)

Improved:

* Cleared up the code a tiny bit

#### 0.1.18

Added:

* Added a premium search button on the item hover popup for decorated weapons. This will display correct results when trying to search for skins with premium

#### 0.1.17

Added:

* Added sorting by scm price in inventory

#### 0.1.16

Improved:

* Highlighting spells works now in more places (added: classifieds and compare links)

#### 0.1.15

Added:

* Group by Classifieds

Improved:

* Formatting (and changed to tab indentation)

#### 0.1.14

Added:

* Added Halloween war paints to the Autocomplete

Improved:

* Now when using the refresh button spells will still be marked
* After a backpack update changed the name from "Sort by" to "Group by" it was also changed in this userscript
* Replaced the default Group by item index (because that grouped only per page). By default this will now add 1 group for every defindex, if you want all items in a single page ordered instead of per defindex there is a variable singlepage in the code which you can set to true

#### 0.1.13

Added:

* When entering a Texture Name in Texture & Wear you can now autocomplete with tab (Press tab again to cycle between alternative suggestions)

#### 0.1.12

Fixed:

* Wrong URL syntax for skins when generating a marketplace.tf link

#### 0.1.11

Fixed:

* Function to access Popover now works on Items which are loaded after page load

#### 0.1.10

Fixed:

* Spells not being display with the inventory load now after page loaded
* When searching in the effect or unusuals the unusuals didn't reappear but stayed hidden (in some cases) when removing parts of the search term

#### 0.1.9 (After the new Inventory Update (Inventories load after the page loaded))

Fixed:

* fixed custom sorts being on a wrong drop down
* custom sorts break when using them before the inventory loaded

Removed:

* Price Module (wasn't used anyways, and should it be needed again I will make an own implementation)

#### 0.1.8

Added:

* In the class menus on the effect / unusual pricing pages add Miscs as class (meaning unusuals which you can equip over other unusuals) (Should I miss some there feel free to send me a message)

#### 0.1.7

Fixed:

* Marketplace link appearing multiple times when hovering multiple times
* Marketplace link now only appears if no price is known

#### 0.1.6

Added:

* In the popover of an item, show a link to the marketplace item (So you have a link even when there are no sales)

#### 0.1.5

Added:

* Like with my custom sorting methods you can now reverse the groups of the already implemented sorting methods (so you can switch f.e. between old to new and new to old when sorting by time)

#### 0.1.4

Added:

* On the pricelist page of unusual effects you now can filter them by class like the unusual by item page

#### 0.1.3

Fixed:

* added missing spell (Halloween Fire)
* reset last sort when non custom sort was used
* fixed filtering for items with custom sorts (meaning added complete new filtering which additionally searches for f.e. strange parts, spells, custom name)

Added:

* Sort by level
* Possibility to write code to change the order of the backpack pages

#### 0.1.2

Added:

* generic sort can now ignore empty pages
* spells are visually marked (green for 1 spell, red for multi-spell)
* added sorting using spells

#### 0.1.1

Fixed:

* generalized Sorting functions
* removed empty item containers which were used for spacing the normal inventory pages

Added:

* sorting the single pages (f.e. sorting Paints by price)
* meta data to automatically update the script

### 0.1

* Released with additional sort by paint

## Planned features

_____________________________________________

* Sort by Effect
* Sort by Lowcraft
* Sort by Killstreak
* Sort by Tier (and wear secondary)
* Sort by discount

## Preview

_____________________________________________

Paint sorting:
![Preview](https://raw.githubusercontent.com/NetroScript/backpack.tf-miscellaneous-extensions/master/preview1.png)

Spell sorting (green dots mean a single spell, red dots mean multi spell):
![Preview](https://raw.githubusercontent.com/NetroScript/backpack.tf-miscellaneous-extensions/master/preview2.png)

Level sorting:
![Preview](https://raw.githubusercontent.com/NetroScript/backpack.tf-miscellaneous-extensions/master/preview3.png)

SCM sorting:
![Preview](https://raw.githubusercontent.com/NetroScript/backpack.tf-miscellaneous-extensions/master/preview5.png)

Filter the unusual hats by class on the unusual effects pricelist page :
![Preview](https://raw.githubusercontent.com/NetroScript/backpack.tf-miscellaneous-extensions/master/preview4.png)
