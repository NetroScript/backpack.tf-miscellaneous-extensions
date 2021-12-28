const currentItem = new itemData(document.querySelector(".item"));
    let itemId = currentItem.getItemId();
    let killstreakTier = currentItem.getKillstreakTier();
    let currentPath = window.location.pathname;

    $(".stats-header-controls").append(`
     <br>
     <div class="btn-group btn-group-sm stats-killstreak-list" style="margin: 0 0 12px"></div>
     `);

    switch(currentItem.getItemSlot()){

        case 0:
            break;

        case -1: {

            let weaponName = trimSpaces(document.querySelector(".stats-breadcrumbs").children[1].innerHTML);
            let weaponDefIndex = window.location.pathname.match(/\d+$/g);

            $(".stats-killstreak-list").append(`
          <a class="btn btn-variety q-440-text-4" href="https://backpack.tf/stats/Unique/Killstreak%20Kit/Tradable/Non-Craftable/1-${weaponDefIndex}"> Basic </a>
     <a class="btn btn-variety q-440-text-7" href="https://backpack.tf/stats/Unique/Killstreak%20Kit/Tradable/Non-Craftable/2-${weaponDefIndex}"> Specialized </a>
     <a class="btn btn-variety q-440-text-11" href="https://backpack.tf/stats/Unique/Killstreak%20Kit/Tradable/Non-Craftable/3-${weaponDefIndex}"> Professional </a>
     `);
            document.querySelector(".stats-killstreak-list").children[killstreakTier-1].classList.add("active");
            if(killstreakTier > 1){
                $(".stats-header-controls").append(`
     <a class="btn btn-default" href="https://backpack.tf/stats/Unique/Fabricator/Tradable/Craftable/${6520 + 3 * (killstreakTier - 1)}-6-${weaponDefIndex}" style="margin: 0px 0px 12px;">
     <i class="fa fa-bar-chart"></i>
     Fabricator Stats
     </div>
     `);
            }

            $(".stats-header-controls").append(`
     <br>
     <div class="temp-weaponlist-div" style="margin: 0 0 12px">Loading applicable weapons...</div>
     `);
            $(".temp-weaponlist-div").load(`https://backpack.tf/overview/${weaponName} .overview-quality-list`,function(){
                for(let button of this.firstChild.children){
                    button.href = appendKSToPath(killstreakTier, button.getAttribute("href"), 0);
                }
                this.firstChild.classList.remove("overview-quality-list");
                this.firstChild.classList.remove("expanded");
                $(this.firstChild).append(`<a class="btn btn-variety" id="btn-expand-list">
                                          <i class="fa fa-ellipsis-h"></i>
                                          </a>`);
                this.outerHTML = this.innerHTML;
                $("#page-content").append(`<script>
    $('#btn-expand-list').click(function () {
        var $parent = $(this).parent();

        if ($parent.hasClass('expanded')) {
            $parent.removeClass('expanded');
        } else {
            $parent.addClass('expanded');
        }
    });
</script>`);
            });
            break;
        }

        case -2: {
            let weaponDefIndex = window.location.pathname.match(/\d+$/g);

            $(".stats-killstreak-list").append(`
     <a class="btn btn-variety q-440-text-7" href="https://backpack.tf/stats/Unique/Fabricator/Tradable/Craftable/6523-6-${weaponDefIndex}"> Specialized </a>
     <a class="btn btn-variety q-440-text-11" href="https://backpack.tf/stats/Unique/Fabricator/Tradable/Craftable/6526-6-${weaponDefIndex}"> Professional </a>
     `);
            document.querySelector(".stats-killstreak-list").children[killstreakTier-2].classList.add("active");
            $(".stats-header-controls").append(`
     <a class="btn btn-default" href="https://backpack.tf/stats/Unique/Killstreak%20Kit/Tradable/Non-Craftable/${killstreakTier}-${weaponDefIndex}" style="margin: 0px 0px 12px;">
     <i class="fa fa-bar-chart"></i>
     Kit Stats
     </div>
     `);
         break;
        }

        case 1: {

            $(".stats-killstreak-list").append(`
     <a class="btn btn-variety q-440-text-1" href="https://backpack.tf${appendKSToPath(0, currentPath, killstreakTier)}"> No Kit </a>
     <a class="btn btn-variety q-440-text-4" href="https://backpack.tf${appendKSToPath(1, currentPath, killstreakTier)}"> Basic </a>
     <a class="btn btn-variety q-440-text-7" href="https://backpack.tf${appendKSToPath(2, currentPath, killstreakTier)}"> Specialized </a>
     <a class="btn btn-variety q-440-text-11" href="https://backpack.tf${appendKSToPath(3, currentPath, killstreakTier)}"> Professional </a>
     `);
            document.querySelector(".stats-killstreak-list").children[killstreakTier].classList.add("active");
            if(killstreakTier > 0){
                $(".stats-header-controls").append(`
     <a class="btn btn-default" href="https://backpack.tf/stats/Unique/Killstreak%20Kit/Tradable/Non-Craftable/${killstreakTier}-${itemId}" style="margin: 0px 0px 12px;">
     <i class="fa fa-bar-chart"></i>
     Kit Stats
     </div>
     `);
            }
        }
    }
