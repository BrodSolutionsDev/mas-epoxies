import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';

export default class Brand extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    onReady() {
        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.brandProductsPerPage;
        const requestOptions = {
            template: {
                productListing: 'brand/product-listing',
                sidebar: 'brand/sidebar',
            },
            config: {
                shop_by_brand: true,
                brand: {
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            showMore: 'brand/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            /* Product page grid list cookie set */
            var cookieName = getCookie("product_view");
            $('.products-switcher a').removeClass('switcher-active');
            if(cookieName == 'switcher-grid') {
               $('.products-switcher .switcher-grid').addClass('switcher-active');
               $('ul.productGrid').removeClass('productList');
            }
            if(cookieName == 'switcher-list') {
               $('.products-switcher .switcher-list').addClass('switcher-active');
               $('ul.productGrid').addClass('productList');
            }
            /* Product page grid list cookie set*/

            $('body').triggerHandler('compareReset');
            $(document).foundation('equalizer', 'reflow');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
            }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }
}

/* function on ready for set cookie by name*/
$(function() {
    $('.products-switcher a').removeClass('switcher-active');
    
    var cookieName = getCookie("product_view");
    if(typeof cookieName === "undefined"){
        document.cookie='product_view=switcher-grid';
        var cookieName = getCookie("product_view");
    }
    
    if(cookieName == 'switcher-grid') {
       $('.products-switcher .switcher-grid').addClass('switcher-active');
       $('ul.productGrid').removeClass('productList');
    } 
    if(cookieName == 'switcher-list') {
       $('.products-switcher .switcher-list').addClass('switcher-active');
       $('ul.productGrid').addClass('productList');
    }   
});

/* function on ready for set cookie by name*/



/* function on click for set cookie by name*/
$(document).on('click','.products-switcher a', function(){
    if($(this).hasClass('switcher-active')) {
        return false;
    }
    $('.products-switcher a').removeClass('switcher-active');
    $(this).addClass('switcher-active');
    $('ul.productGrid').toggleClass('productList');
    if($(this).hasClass('switcher-grid')) {
        document.cookie='product_view=switcher-grid';   
    } else {
        document.cookie='product_view=switcher-list';
    }
    $(document).foundation('equalizer', 'reflow');
});
/* function on click for set cookie by name*/

/* function for get cookie by name*/
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
/* function for get cookie by name*/
