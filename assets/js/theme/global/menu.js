import collapsibleFactory from '../common/collapsible';
import collapsibleGroupFactory from '../common/collapsible-group';

const PLUGIN_KEY = 'menu';

/*
 * Manage the behaviour of a menu
 * @param {jQuery} $menu
 */
class Menu {
    constructor($menu) {
        /* menu item to show hide start */
        this.menuItemToCheck = 7;
        /* menu item to show hide end */

        this.$menu = $menu;
        this.$body = $('body');
        this.hasMaxMenuDisplayDepth = this.$body.find('.navPages-list').hasClass('navPages-list-depth-max');

        // Init collapsible
        this.collapsibles = collapsibleFactory('[data-collapsible]', { $context: this.$menu });
        this.collapsibleGroups = collapsibleGroupFactory($menu);

        // Auto-bind
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);

        // Listen
        this.bindEvents();
        
        /* category menu item show hide call function start*/
        this.categoryMenuShowMore();
        /* category menu item show hide call function end*/
    }
    
    /* category menu item show hide function start */
    categoryMenuShowMore() {
        const countCategoryItems = $('.sc-navmenu .navPages-item').length;
        const showMoreTemplate = '<li class="navPages-item show-more-category" data-number-hide-items="'+this.menuItemToCheck+'"> <a class="navPages-action" href="">Show More <span class="icon"><svg><use xlink:href="#icon-category-plus" /></svg></span></a></li>';
        if(countCategoryItems > this.menuItemToCheck) {
            const hideCountMenu = this.menuItemToCheck - 1;
            $('.sc-navmenu .navPages-item:gt('+ hideCountMenu +')').hide();
            $('.sc-navmenu .navPages-list').append(showMoreTemplate);
        }
    }
    /* category menu item show hide function end*/

    collapseAll() {
        this.collapsibles.forEach(collapsible => collapsible.close());
        this.collapsibleGroups.forEach(group => group.close());
    }

    collapseNeighbors($neighbors) {
        const $collapsibles = collapsibleFactory('[data-collapsible]', { $context: $neighbors });

        $collapsibles.forEach($collapsible => $collapsible.close());
    }

    bindEvents() {
        this.$menu.on('click', this.onMenuClick);
        this.$body.on('click', this.onDocumentClick);
    }

    unbindEvents() {
        this.$menu.off('click', this.onMenuClick);
        this.$body.off('click', this.onDocumentClick);
    }

    onMenuClick(event) {
        event.stopPropagation();

        if (this.hasMaxMenuDisplayDepth) {
            const $neighbors = $(event.target).parent().siblings();

            this.collapseNeighbors($neighbors);
        }
    }

    onDocumentClick() {
        this.collapseAll();
    }
}

/*
 * Create a new Menu instance
 * @param {string} [selector]
 * @return {Menu}
 */
export default function menuFactory(selector = `[data-${PLUGIN_KEY}]`) {
    const $menu = $(selector).eq(0);
    const instanceKey = `${PLUGIN_KEY}Instance`;
    const cachedMenu = $menu.data(instanceKey);

    if (cachedMenu instanceof Menu) {
        return cachedMenu;
    }

    const menu = new Menu($menu);

    $menu.data(instanceKey, menu);

    return menu;
}

/* show more category item click function start*/
$(document).on('click','.show-more-category', function(e) {
    e.preventDefault();
    const dataNumberItemsShow = $(this).data('number-hide-items');
    const hideCountMenu = dataNumberItemsShow - 1;
    $('.sc-navmenu .navPages-item:gt('+ hideCountMenu +')').slideDown();
    $(this).find('a').html('Show Less <span class="icon"><svg><use xlink:href="#icon-category-minus" /></svg></span>');
    $(this).removeClass('show-more-category');
    $(this).addClass('show-less-category');
});
/* show more category item click function end*/


/* show less category item click function start*/
$(document).on('click','.show-less-category', function(e) {
    e.preventDefault();
    const dataNumberItemsHide = $(this).data('number-hide-items');
    const hideCountMenu = dataNumberItemsHide - 1;
    $('.sc-navmenu .navPages-item:gt('+ hideCountMenu +'):not(:last)').slideUp();
    $(this).find('a').html('Show More <span class="icon"><svg><use xlink:href="#icon-category-plus" /></svg></span>');
    $(this).removeClass('show-less-category');
    $(this).addClass('show-more-category');
});
/* show less category item click function start*/
