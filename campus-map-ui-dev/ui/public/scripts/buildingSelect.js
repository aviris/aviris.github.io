define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._buildingSelect = exports.closeBuildingSelectList = void 0;
    function closeBuildingSelectList() {
        var panelSide = document.getElementById('panel-side');
        var panelSideTitle = document.getElementById('panel-side-title');
        panelSideTitle.classList.add('visually-hidden');
        panelSide.style.backgroundColor = 'transparent';
        panelSide.style.zIndex = '0';
    }
    exports.closeBuildingSelectList = closeBuildingSelectList;
    function _buildingSelect(view, buildings, renderIndoor) {
        var graphics;
        var listNode = document.getElementById('listNode');
        listNode.hidden = true;
        closeBuildingSelectList();
        view.whenLayerView(buildings).then(function (lyrView) {
            function executeQuery() {
                var queryParams = buildings.createQuery();
                queryParams.returnGeometry = true;
                queryParams.returnCentroid = true;
                queryParams.orderByFields = ['Acronym', 'Name'];
                queryParams.outFields = ['*'];
                queryParams.where = 'BNUM IS NOT NULL';
                lyrView.queryFeatures(queryParams).then(function (results) {
                    var features = results.features;
                    graphics = features;
                    var fragment = document.createDocumentFragment();
                    features.forEach(function (result, index) {
                        var attributes = result.attributes;
                        var name;
                        if (attributes.Acronym != null) {
                            name = attributes.Acronym + ' - ' + attributes.Name;
                        }
                        else {
                            name = attributes.Name;
                        }
                        var li = document.createElement('li');
                        li.classList.add('panel-result');
                        li.tabIndex = 0;
                        li.setAttribute('data-result-id', index.toString());
                        li.textContent = name;
                        fragment.appendChild(li);
                    });
                    listNode.innerHTML = '';
                    listNode.appendChild(fragment);
                }, function (error) {
                    console.error('indoor query error', error);
                });
            }
            if (lyrView.updating) {
                var handle_1 = lyrView.watch('updating', function (isUpdating) {
                    if (!isUpdating) {
                        executeQuery();
                        handle_1.remove();
                    }
                });
            }
            else
                executeQuery();
        });
        function onListClickHandler(event) {
            var target = event.target;
            var resultId = target.getAttribute('data-result-id');
            var result = resultId && graphics && graphics[parseInt(resultId, 10)];
            if (result) {
                var feature = result;
                var extent_1 = feature.geometry.extent;
                var id_1 = feature.attributes['BNUM'];
                view.popup.open({
                    features: [feature],
                    updateLocationEnabled: true
                });
                setTimeout(function () { return renderIndoor(id_1, extent_1); }, 500);
                listNode.hidden = true;
                closeBuildingSelectList();
                buildings.visible = false;
            }
        }
        listNode.addEventListener('click', onListClickHandler);
        return listNode;
    }
    exports._buildingSelect = _buildingSelect;
});
//# sourceMappingURL=buildingSelect.js.map