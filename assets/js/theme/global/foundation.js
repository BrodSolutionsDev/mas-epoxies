import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import 'foundation-sites/js/foundation/foundation.reveal';
import 'foundation-sites/js/foundation/foundation.tab';
import 'foundation-sites/js/foundation/foundation.accordion';
import 'foundation-sites/js/foundation/foundation.equalizer';
import modalFactory from './modal';
import revealCloseFactory from './reveal-close';

export default function ($element) {
    $element.foundation({
        dropdown: {
            // specify the class used for active dropdowns
            active_class: 'is-open',
        },
        reveal: {
            bg_class: 'modal-background',
            dismiss_modal_class: 'modal-close',
            close_on_background_click: true,
        },
        tab: {
            active_class: 'is-active',
        },
        accordion: {
            active_class: 'is-active',
        },
        equalizer: {
        // Specify if Equalizer should make elements equal height once they become stacked.
            equalize_on_stack: true,
        },
    });

    modalFactory('[data-reveal]', { $context: $element });
    revealCloseFactory('[data-reveal-close]', { $context: $element });
}
