var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/views/layers/support/FeatureFilter"], function (require, exports, FeatureFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._relativeFloorSelect = void 0;
    FeatureFilter_1 = __importDefault(FeatureFilter_1);
    function _relativeFloorSelect(view, indoorFloors, accRestrooms, minFloor, maxFloor) {
        var relativeFloorSelect = document.createElement('div');
        relativeFloorSelect.className = 'RFSContainer';
        var icon = new Image();
        icon.src = './images/Stairs.png';
        icon.className = 'stairIcon';
        relativeFloorSelect.appendChild(icon);
        relativeFloorSelect.appendChild(icon);
        var ul = document.createElement('ul');
        ul.className = 'relativeFloorSelect';
        relativeFloorSelect.appendChild(ul);
        function setFloor(floor) {
            ul.getElementsByClassName('active')[0].className = '';
            var floorIndex = minFloor < 1 ? floor : floor - 1;
            ul.children[floorIndex].className = 'active';
            view.whenLayerView(indoorFloors).then(function (featureLayerView) {
                featureLayerView.filter = new FeatureFilter_1.default({
                    where: 'BLDG_LEVEL = ' + floor.toString()
                });
            });
            view.whenLayerView(accRestrooms).then(function (featureLayerView) {
                featureLayerView.filter = new FeatureFilter_1.default({
                    where: 'CMPS_Flo_4 = ' + floor.toString()
                });
            });
        }
        var _loop_1 = function (i) {
            var li = document.createElement('li');
            if (i == minFloor)
                li.className = 'active';
            li.textContent = i.toString();
            li.addEventListener('click', function () { return setFloor(i); });
            ul.appendChild(li);
        };
        for (var i = minFloor; i <= maxFloor; i++) {
            _loop_1(i);
        }
        return relativeFloorSelect;
    }
    exports._relativeFloorSelect = _relativeFloorSelect;
});
//# sourceMappingURL=relativeFloorSelect.js.map