var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._createFeedbackWidget = void 0;
    function displayFeedbackMessage(msg, error) {
        if (error === void 0) { error = true; }
        if (document.getElementById('feedback-msg')) {
            document.getElementById('feedback-msg').remove();
        }
        if (document.getElementById('feedback-error')) {
            document.getElementById('feedback-error').remove();
        }
        var newMsg = document.createElement('p');
        if (error) {
            newMsg.id = 'feedback-error';
        }
        else {
            newMsg.id = 'feedback-msg';
        }
        newMsg.textContent = msg;
        document.getElementById('feedback-form-body').appendChild(newMsg);
    }
    function _createFeedbackWidget() {
        var _this = this;
        var button = document.createElement('button');
        button.id = 'feedback-widget-button';
        button.innerText = 'Feedback';
        button.addEventListener('click', function () {
            document.getElementById('feedback-form-container').style.display = 'flex';
            var closeFormBtn = document.getElementById('close-form');
            closeFormBtn.style.cursor = 'pointer';
            closeFormBtn.addEventListener('click', function () {
                document.getElementById('feedback-form-container').style.display = 'none';
            });
            var submitFeedbackBtn = document.getElementById('feedback-submit-btn');
            submitFeedbackBtn.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                var email, name, feedbackLocation, reason, message, data, rawResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e.preventDefault();
                            email = document.getElementById('feedback-email');
                            name = document.getElementById('feedback-name');
                            feedbackLocation = document.getElementById('feedback-location');
                            reason = document.getElementById('feedback-reason');
                            message = document.getElementById('feedback-message');
                            if (!(email.value === '' || name.value === '' || feedbackLocation.value === '' || message.value === '')) return [3, 1];
                            displayFeedbackMessage('You must fill out all fields.');
                            return [3, 3];
                        case 1:
                            displayFeedbackMessage('Submitting feedback...', false);
                            submitFeedbackBtn.disabled = true;
                            data = {
                                email: email.value,
                                name: name.value,
                                location: feedbackLocation.value,
                                reason: reason.options[reason.selectedIndex].text,
                                message: message.value
                            };
                            return [4, fetch('/rest/sendEmail', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(data)
                                })];
                        case 2:
                            rawResponse = _a.sent();
                            if (rawResponse.ok) {
                                location.reload();
                                displayFeedbackMessage('Your feedback was successfully submitted.', false);
                                submitFeedbackBtn.disabled = false;
                            }
                            else {
                                console.log('Error sending feedback');
                                displayFeedbackMessage('An error occurred sending feedback.');
                                submitFeedbackBtn.disabled = false;
                            }
                            _a.label = 3;
                        case 3: return [2];
                    }
                });
            }); });
        });
        return button;
    }
    exports._createFeedbackWidget = _createFeedbackWidget;
});
//# sourceMappingURL=suggestion.js.map