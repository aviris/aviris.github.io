define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineActions = exports._showIndoorDisclaimer = void 0;
    var uniqueParentItems = [], modal = document.querySelector('.modal'), closeBtn = document.querySelector('.close-btn'), modalText = document.getElementById('modal-text'), modalTitle = document.getElementById('modal-title');
    var showAccDisclaimer = true, showIndoorDisclaimer = true;
    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };
    function _showIndoorDisclaimer() {
        if (showIndoorDisclaimer) {
            showIndoorDisclaimer = false;
            modal.style.display = 'block';
            modalTitle.textContent = 'Indoor Disclaimer:';
            modalText.textContent =
                'This feature is currently under development, and may not be an accurate representation of indoors. If you would like to submit feedback, click the "Feedback" button in the lower left-hand corner';
            showAccDisclaimer = false;
        }
    }
    exports._showIndoorDisclaimer = _showIndoorDisclaimer;
    function defineActions(event) {
        var item = event.item;
        if (!item.parent) {
            if (!uniqueParentItems.includes(item.title)) {
                uniqueParentItems.push(item.title);
                item.watch('visible', function (visible) {
                    visible ? (item.open = true) : (item.open = false);
                    if (item.title === 'Accessibility' && showAccDisclaimer) {
                        modal.style.display = 'block';
                        modalTitle.textContent = 'Accessibility Disclaimer:';
                        modalText.textContent =
                            'This feature is currently under development, and may not be an accurate representation of accessible routes. If you would like to submit feedback, click the "Feedback" button in the lower left-hand corner';
                        showAccDisclaimer = false;
                    }
                });
            }
        }
    }
    exports.defineActions = defineActions;
});
//# sourceMappingURL=disclaimer.js.map