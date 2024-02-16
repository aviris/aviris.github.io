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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Basemap", "esri/widgets/Expand", "esri/layers/FeatureLayer", "esri/layers/GeoJSONLayer", "esri/layers/GroupLayer", "esri/widgets/Home", "esri/widgets/LayerList", "esri/widgets/Search/LayerSearchSource", "esri/widgets/Legend", "esri/widgets/Locate", "esri/Map", "esri/views/MapView", "esri/symbols/PictureMarkerSymbol", "esri/renderers/SimpleRenderer", "esri/widgets/Search", "esri/layers/VectorTileLayer", "./suggestion", "./relativeFloorSelect", "./disclaimer", "./buildingSelect", "esri/views/layers/support/FeatureFilter"], function (require, exports, Basemap_1, Expand_1, FeatureLayer_1, GeoJSONLayer_1, GroupLayer_1, Home_1, LayerList_1, LayerSearchSource_1, Legend_1, Locate_1, Map_1, MapView_1, PictureMarkerSymbol_1, SimpleRenderer_1, Search_1, VectorTileLayer_1, suggestion_1, relativeFloorSelect_1, disclaimer_1, buildingSelect_1, FeatureFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Basemap_1 = __importDefault(Basemap_1);
    Expand_1 = __importDefault(Expand_1);
    FeatureLayer_1 = __importDefault(FeatureLayer_1);
    GeoJSONLayer_1 = __importDefault(GeoJSONLayer_1);
    GroupLayer_1 = __importDefault(GroupLayer_1);
    Home_1 = __importDefault(Home_1);
    LayerList_1 = __importDefault(LayerList_1);
    LayerSearchSource_1 = __importDefault(LayerSearchSource_1);
    Legend_1 = __importDefault(Legend_1);
    Locate_1 = __importDefault(Locate_1);
    Map_1 = __importDefault(Map_1);
    MapView_1 = __importDefault(MapView_1);
    PictureMarkerSymbol_1 = __importDefault(PictureMarkerSymbol_1);
    SimpleRenderer_1 = __importDefault(SimpleRenderer_1);
    Search_1 = __importDefault(Search_1);
    VectorTileLayer_1 = __importDefault(VectorTileLayer_1);
    FeatureFilter_1 = __importDefault(FeatureFilter_1);
    var indoorFloorSingleBuilding = null;
    var accRestroomsSingleBuilding = null;
    var relativeFloorSelect = null;
    var resources = {
        baseBackdrop: '',
    //# basehighcontrast: 'd6e5bfbe9e0b4ad0bd200262bef745b0',
        base: 'f886634ab3f349f18199bf554bf75ee3',
        campusBuildings: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BYU_Campus_Buildings/FeatureServer/0',
        Athletics: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Athletics/FeatureServer/0',
        Services: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Services/FeatureServer/0',
        StudentServices: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/StudentServices/FeatureServer/0',
        entertainmentMuseums: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Entertainment_Museums/FeatureServer/0',
        printService: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
        transportation: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Transportation_Merge/FeatureServer/0',
        dining: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Dining/FeatureServer/0',
        computers: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/ComputerLabs_Merge/FeatureServer/0',
        webcams: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Web_Cams/FeatureServer/0',
        emergencyPhones: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Emergency_Phones/FeatureServer/0',
        accessibilityLayer: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Accessible_Features/FeatureServer',
        accParking: 'https://pfgis.byu.edu/arcgis/rest/services/Traffic/ADAAccessibleStalls_Collab/FeatureServer',
        accRoutes: 'https://pfgis.byu.edu/arcgis/rest/services/Traffic/Routes_Collab/FeatureServer',
        accDoors: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Doors/FeatureServer',
        accFountains: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Accessible_Drinking_Fountains/FeatureServer',
        accRestrooms: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Accessible_Restrooms/FeatureServer',
        parking: 'https://pfgis.byu.edu/arcgis/rest/services/Traffic/ParkingLots_Collab/FeatureServer',
        motorcycleParking: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BYU_Motorcycle_Parking/FeatureServer/0',
        drinkingFountains: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BYU_Drinking_Fountains/FeatureServer/0',
        aeds: 'https://aed.byu.edu/rest/aed/v1/get-locations',
        indoorFloors: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Floorplans_V/FeatureServer/0',
        athleticLines: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/0',
        tennisInner: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/1',
        tennisOuter: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/2',
        athleticBuildings: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/3',
        athleticGrass: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/4',
        athleticTracks: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/5'
    };
    var BYUBase = new Basemap_1.default({
        baseLayers: [
            new VectorTileLayer_1.default({
                portalItem: {
                    id: resources.baseBackdrop
                }
            }),
            new VectorTileLayer_1.default({
                portalItem: {
                    id: resources.base
                }
            })
        ]
    });
    var map = new Map_1.default({
        basemap: BYUBase
    });
    var view = new MapView_1.default({
        container: 'viewDiv',
        map: map,
        center: [-111.649278, 40.249251],
        zoom: 17,
    });
    view.constraints = {
        minScale: 20000,
        rotationEnabled: false
    };
    var homeWidget = new Home_1.default({
        view: view
    });
    var locate = new Locate_1.default({
        view: view,
        goToLocationEnabled: true
    });
    var indoorToggle = document.createElement('button');
    var template = {
        title: '{Name}',
        content: "<img src='{ImageUrl}' alt='{ImageUrl}' ><div class='popupText'>{Description}</div>   <a target='_blank' href={url}>{url}</a>"
    };
    var aedTemplate = {
        title: 'AED #{ObjectID}',
        content: "<img src='{picture}' height='320' width='240' alt='aed'/><div class='popupText'>{building} room {room}  {location} </div>"
    };
    var layerList = new LayerList_1.default({
        container: document.createElement('div'),
        view: view,
        listItemCreatedFunction: disclaimer_1.defineActions
    });
    function isMobileDevice() {
        return /Mobi|iPhone|Android/i.test(navigator.userAgent);
    }
    var layerListExpand = new Expand_1.default({
        expandIconClass: 'esri-icon-collection',
        view: view,
        expanded: !isMobileDevice(),
        content: layerList.container
    });
    var legend = new Legend_1.default({
        view: view
    });
    legend.watch('activeLayerInfos.length', function (newValue) {
        if (newValue === 0) {
            view.ui.remove(legendExpand);
        }
        else {
            var legendNeeded_1 = true;
            legend.activeLayerInfos.forEach(function (activeLayerInfo) {
                if (activeLayerInfo.layer.type === 'group') {
                    var groupLayer = activeLayerInfo.layer;
                    groupLayer.layers.forEach(function (layer) {
                        if (layer.visible)
                            legendNeeded_1 = layer.legendEnabled;
                    });
                }
            });
            if (legendNeeded_1)
                view.ui.add(legendExpand, 'bottom-left');
        }
    });
    var legendExpand = new Expand_1.default({
        expandIconClass: 'esri-icon-description',
        view: view,
        expanded: !isMobileDevice(),
        content: legend,
        mode: 'floating'
    });
    var restroomPopupTemplate = {
        title: '{CMPS_Flo_6}',
        content: '{RoomFile_4}'
    };
    function hideUneededParentLayer() {
        var visibleParentLayerNeeded = false;
        legend.activeLayerInfos.forEach(function (activeLayerInfo) {
            if (activeLayerInfo.layer.type === 'group') {
                var groupLayer = activeLayerInfo.layer;
                groupLayer.layers.forEach(function (layer) {
                    if (layer.visible)
                        visibleParentLayerNeeded = true;
                });
                groupLayer.visible = visibleParentLayerNeeded;
            }
        });
    }
    function renderAbout() {
        var _a = view.popup.selectedFeature.attributes, ImageUrl = _a.ImageUrl, Description = _a.Description;
        var node = document.getElementById('popupContent');
        if (ImageUrl != null && !isMobileDevice())
            node.children[0].setAttribute('src', ImageUrl);
        node.getElementsByClassName('popupText')[0].textContent = Description;
        document.getElementById('about-button').className = 'popupButton active';
        document.getElementById('indoor-button').className = 'popupButton';
    }
    function clearIndoor() {
        buildings.popupEnabled = true;
        map.remove(indoorFloorSingleBuilding);
        indoorFloorSingleBuilding = null;
        map.remove(accRestroomsSingleBuilding);
        accRestroomsSingleBuilding = null;
        view.ui.remove(relativeFloorSelect);
        relativeFloorSelect = null;
        view.popup.close();
        if (!isMobileDevice())
            view.popup.dockEnabled = false;
        view.ui.add(legendExpand, 'bottom-left');
    }
    function renderMobileLegend() {
        var legendNode = document.getElementsByClassName('esri-legend')[0].cloneNode(true);
        var popupBody = document.getElementById('popupText');
        popupBody.appendChild(legendNode);
        view.ui.remove(legendExpand);
    }
    function renderIndoor(id, extent) {
        if (indoorFloorSingleBuilding)
            clearIndoor();
        layerListExpand.collapse();
        legendExpand.collapse();
        indoorFloorSingleBuilding = new FeatureLayer_1.default({
            url: resources.indoorFloors,
            definitionExpression: "FACILITY_ID = '" + id + "'",
            outFields: ['BLDG_LEVEL'],
            title: 'Building Floors'
        });
        accRestroomsSingleBuilding = new FeatureLayer_1.default({
            url: resources.accRestrooms,
            definitionExpression: "CMPS_Flo_1 = '" + id + "'",
            legendEnabled: false,
            popupTemplate: restroomPopupTemplate,
            outFields: ['RoomFile_4', 'CMPS_Flo_4', 'CMPS_Flo_6'],
            title: 'Building Accessible Restrooms'
        });
        view.popup.dockEnabled = true;
        view.popup.visible = true;
        map.add(indoorFloorSingleBuilding, 2);
        map.add(accRestroomsSingleBuilding, 3);
        view
            .whenLayerView(indoorFloorSingleBuilding)
            .then(function (featureLayerView) {
            return __awaiter(this, void 0, void 0, function () {
                var query, minFloor, maxFloor;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            query = indoorFloorSingleBuilding.createQuery();
                            minFloor = {
                                onStatisticField: 'BLDG_LEVEL',
                                outStatisticFieldName: 'min_floor',
                                statisticType: 'min'
                            };
                            maxFloor = {
                                onStatisticField: 'BLDG_LEVEL',
                                outStatisticFieldName: 'max_floor',
                                statisticType: 'max'
                            };
                            query.outStatistics = [minFloor, maxFloor];
                            indoorFloorSingleBuilding
                                .queryFeatures(query)
                                .then(function (results) {
                                var minFloor = results.features[0].attributes.min_floor;
                                var maxFloor = results.features[0].attributes.max_floor;
                                featureLayerView.filter = {
                                    where: 'BLDG_LEVEL = ' + minFloor.toString()
                                };
                                relativeFloorSelect = relativeFloorSelect_1._relativeFloorSelect(view, indoorFloorSingleBuilding, accRestroomsSingleBuilding, minFloor, maxFloor);
                                view.whenLayerView(accRestroomsSingleBuilding).then(function (featureLayerView) {
                                    featureLayerView.filter = new FeatureFilter_1.default({
                                        where: 'CMPS_Flo_4 = ' + minFloor.toString()
                                    });
                                });
                                view.ui.add(relativeFloorSelect, 'top-left');
                                document.getElementById('popupText').textContent = '';
                                document.getElementById('popupImage').setAttribute('src', '');
                                document.getElementById('about-button').className = 'popupButton';
                                document.getElementById('indoor-button').className = 'popupButton active';
                                setTimeout(renderMobileLegend, 500);
                            })
                                .catch(function (e) { return console.error('query error ', e); });
                            return [4, view.goTo(extent)];
                        case 1:
                            _a.sent();
                            indoorToggle.textContent = 'Outdoor';
                            return [2];
                    }
                });
            });
        })
            .catch(function (e) { return console.error('featurelayerview error ', e); });
    }
    function setBuildingsPopupContent(feature) {
        view.popup.collapsed = false;
        if (indoorFloorSingleBuilding)
            clearIndoor();
        var _a = feature.graphic.attributes, ImageUrl = _a.ImageUrl, Description = _a.Description, BNUM = _a.BNUM;
        var extent = feature.graphic.geometry.extent;
        var node = document.getElementById('popupContent').cloneNode(true);
        node.setAttribute('style', 'display: block');
        if (ImageUrl != null && !isMobileDevice())
            node.children[0].setAttribute('src', ImageUrl);
        node.getElementsByClassName('popupText')[0].textContent = Description;
        node.getElementsByClassName('popupButton')[1].addEventListener('click', function () { return renderIndoor(BNUM, extent); });
        node.getElementsByClassName('popupButton')[0].addEventListener('click', function () { return renderAbout(); });
        buildings.popupEnabled = false;
        return node;
    }
    function makeParentLayerVisible(layer) {
        !layer.visible ? (layer.visible = true) : layer.visible;
    }
    var buildingsPopupTemplate = {
        title: '{Name}',
        content: setBuildingsPopupContent
    };
    var buildings = new FeatureLayer_1.default({
        url: resources.campusBuildings,
        outFields: ['*'],
        definitionExpression: "Name <> ''",
        popupTemplate: buildingsPopupTemplate,
        legendEnabled: false,
        title: 'Buildings'
    });
    var parking = new FeatureLayer_1.default({
        url: resources.parking,
        popupTemplate: {
            title: 'Lot {Lot_Type} - {Map_Catego}',
            content: '{Descriptio}'
        },
        visible: false,
        title: 'Parking'
    });
    var accParking = new FeatureLayer_1.default({
        url: resources.accParking,
        visible: false,
        title: 'Accessible Parking'
    });
    accParking.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(accessibility);
        hideUneededParentLayer();
    });
    var accDoors = new FeatureLayer_1.default({
        url: resources.accDoors,
        visible: false,
        title: 'Accessible Doors',
        legendEnabled: false
    });
    accDoors.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(accessibility);
        hideUneededParentLayer();
    });
    var accFountains = new FeatureLayer_1.default({
        url: resources.accFountains,
        visible: false,
        title: 'Accessible Water Fountains',
        legendEnabled: false
    });
    accFountains.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(accessibility);
        hideUneededParentLayer();
    });
    var accRestrooms = new FeatureLayer_1.default({
        url: resources.accRestrooms,
        visible: false,
        title: 'Accessible Restrooms',
        legendEnabled: false,
        popupTemplate: restroomPopupTemplate
    });
    accRestrooms.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(accessibility);
        hideUneededParentLayer();
    });
    var accRoutes = new FeatureLayer_1.default({
        url: resources.accRoutes,
        visible: false,
        title: 'Accessible Routes'
    });
    accRoutes.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(accessibility);
        hideUneededParentLayer();
    });
    var accessibility = new GroupLayer_1.default({
        layers: [accDoors, accFountains, accParking, accRestrooms, accRoutes],
        title: 'Accessibility Access',
        visible: false
    });
    accessibility.watch('visible', function (newValue) {
        if (!newValue) {
            this.layers.forEach(function (layer) { return (layer.visible = false); });
        }
        else {
            var routes = this.layers.items.find(function (el) { return el.title === accRoutes.title; });
            routes.visible = true;
        }
    });
    var transportation = new FeatureLayer_1.default({
        url: resources.transportation,
        visible: false,
        title: 'Transportation'
    });
    var dining = new FeatureLayer_1.default({
        url: resources.dining,
        visible: false,
        popupTemplate: template,
        title: 'Dining'
    });
    var athleticLines = new FeatureLayer_1.default({
        url: resources.athleticLines,
        visible: false,
        popupTemplate: template,
        title: 'Athletic Field Lines'
    });
    athleticLines.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(sports);
        hideUneededParentLayer();
    });
    var tennisInner = new FeatureLayer_1.default({
        url: resources.tennisInner,
        visible: false,
        popupTemplate: template,
        title: 'Indoor Tennis Courts'
    });
    tennisInner.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(sports);
        hideUneededParentLayer();
    });
    var tennisOuter = new FeatureLayer_1.default({
        url: resources.tennisOuter,
        visible: false,
        popupTemplate: template,
        title: 'Outdoor Tennis Courts'
    });
    tennisOuter.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(sports);
        hideUneededParentLayer();
    });
    var athleticBuildings = new FeatureLayer_1.default({
        url: resources.athleticBuildings,
        visible: false,
        popupTemplate: template,
        title: 'Athletic Buildings'
    });
    athleticBuildings.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(sports);
        hideUneededParentLayer();
    });
    var athleticGrass = new FeatureLayer_1.default({
        url: resources.athleticGrass,
        visible: false,
        popupTemplate: template,
        title: 'Athletic Grass'
    });
    athleticGrass.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(sports);
        hideUneededParentLayer();
    });
    var athleticTracks = new FeatureLayer_1.default({
        url: resources.athleticTracks,
        visible: false,
        popupTemplate: template,
        title: 'Athletic Tacks'
    });
    athleticTracks.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(sports);
        hideUneededParentLayer();
    });
    var sports = new GroupLayer_1.default({
        layers: [tennisInner, tennisOuter, athleticBuildings, athleticGrass, athleticTracks, athleticLines],
        title: 'Sports',
        visible: false
    });
    sports.watch('visible', function (newValue) {
        if (!newValue) {
            this.layers.forEach(function (layer) { return (layer.visible = false); });
        }
        else {
            var sportsSubLayer = this.layers.items.find(function (el) { return el.title === athleticLines.title; });
            sportsSubLayer.visible = true;
        }
    });
    var services = new FeatureLayer_1.default({
        url: resources.Services,
        popupTemplate: template,
        visible: false,
        title: 'Campus Services'
    });
    services.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(serviceGroupLayer);
        hideUneededParentLayer();
    });
    var studentServices = new FeatureLayer_1.default({
        url: resources.StudentServices,
        popupTemplate: template,
        visible: false,
        title: 'Student Services'
    });
    studentServices.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(serviceGroupLayer);
        hideUneededParentLayer();
    });
    var computersAndPrinters = new FeatureLayer_1.default({
        url: resources.computers,
        visible: false,
        title: 'Computers and Printers'
    });
    computersAndPrinters.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(serviceGroupLayer);
        hideUneededParentLayer();
    });
    var webcams = new FeatureLayer_1.default({
        url: resources.webcams,
        visible: false,
        title: 'Web Cameras'
    });
    webcams.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(serviceGroupLayer);
        hideUneededParentLayer();
    });
    var emergencyPhones = new FeatureLayer_1.default({
        url: resources.emergencyPhones,
        visible: false,
        title: 'Emergency Phones',
        legendEnabled: false
    });
    emergencyPhones.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(serviceGroupLayer);
        hideUneededParentLayer();
    });
    var aeds = new GeoJSONLayer_1.default({
        title: "AED's",
        url: resources.aeds,
        renderer: new SimpleRenderer_1.default({
            symbol: new PictureMarkerSymbol_1.default({
                url: 'aed.png',
                width: '30px',
                height: '56px'
            })
        }),
        spatialReference: {
            wkid: 4326
        },
        popupTemplate: aedTemplate,
        geometryType: 'point',
        visible: false,
        legendEnabled: false
    });
    aeds.watch('visible', function (newValue) {
        if (newValue)
            makeParentLayerVisible(serviceGroupLayer);
        hideUneededParentLayer();
    });
    var serviceGroupLayer = new GroupLayer_1.default({
        layers: [emergencyPhones, aeds],
        title: 'Services',
        visible: false
    });
    serviceGroupLayer.watch('visible', function (newValue) {
        if (!newValue) {
            this.layers.forEach(function (layer) { return (layer.visible = false); });
        }
        else {
            var aedsSubLayer = this.layers.items.find(function (el) { return el.title === aeds.title; });
            aedsSubLayer.visible = true;
        }
    });
    map.addMany([buildings, parking, serviceGroupLayer, accessibility]);
    var listNode = buildingSelect_1._buildingSelect(view, buildings, renderIndoor);
    var panelSide = document.getElementById('panel-side');
    var panelSideTitle = document.getElementById('panel-side-title');
    indoorToggle.textContent = 'Indoor';
    indoorToggle.id = 'indoor-toggle-btn';
    panelSideTitle.onclick = function () {
        buildingSelect_1.closeBuildingSelectList();
        listNode.hidden = true;
        indoorToggle.textContent = 'Indoor';
    };
    indoorToggle.onclick = function () {
        if (indoorToggle.textContent === 'Indoor') {
            if (indoorFloorSingleBuilding)
                clearIndoor();
            panelSide.style.backgroundColor = '#E6E6E6';
            panelSide.style.zIndex = '1';
            panelSideTitle.classList.remove('visually-hidden');
            disclaimer_1._showIndoorDisclaimer();
            indoorToggle.textContent = 'Outdoor';
            listNode.hidden = false;
            layerListExpand.collapse();
            view.ui.remove(layerListExpand);
        }
        else {
            clearIndoor();
            indoorToggle.textContent = 'Indoor';
            listNode.hidden = true;
            homeWidget.go();
            buildings.visible = true;
            view.ui.add(layerListExpand, 'top-right');
            layerListExpand.expand();
        }
    };
    view
        .when(function () {
        var search = new Search_1.default({
            view: view,
            allPlaceholder: 'Enter Name or Acronym',
            includeDefaultSources: false,
            sources: [
                new LayerSearchSource_1.default({
                    layer: buildings,
                    searchFields: ['Name', 'Acronym'],
                    suggestionTemplate: '{Name} ({Acronym})',
                    displayField: 'Name',
                    exactMatch: false,
                    outFields: ['*'],
                    name: 'Buildings',
                    placeholder: 'example: JSB'
                }),
                new LayerSearchSource_1.default({
                    layer: parking,
                    searchFields: ['Lot_Type', 'Map_Catego'],
                    suggestionTemplate: '{Lot_Type} - {Map_Catego}',
                    exactMatch: false,
                    outFields: ['*'],
                    name: 'Parking Lots',
                    placeholder: 'example: 40G'
                })
            ]
        });
        var feedbackBtn = suggestion_1._createFeedbackWidget();
        view.ui.add(search, { position: 'top-left', index: 0 });
        view.ui.add(homeWidget, 'top-left');
        view.ui.add(locate, 'top-left');
        view.ui.add(layerListExpand, 'top-right');
        view.ui.add(feedbackBtn, 'bottom-right');
// #        view.ui.add(indoorToggle, { position: 'top-right', index: 0 });
    })
        .catch(function (e) {
        console.error('Error loading map.', e);
    });
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    if (urlParams.has('layer')) {
        var layer = urlParams.get('layer').toLowerCase();
        switch (layer) {
            case 'parking':
                parking.visible = true;
                buildings.visible = false;
                break;
            case 'dining':
                dining.visible = true;
                buildings.visible = false;
                break;
            case 'sports':
                sports.visible = true;
                buildings.visible = false;
                break;
            case 'aed':
                aeds.visible = true;
                buildings.visible = false;
                break;
        }
    }
    if (urlParams.has('building')) {
        var building_1 = urlParams.get('building').toUpperCase();
        view.whenLayerView(buildings).then(function (featureLayerView) {
            var query = buildings.createQuery();
            query.where = "Acronym ='" + building_1 + "'";
            query.returnGeometry = true;
            query.outFields = ['*'];
            function executeQuery() {
                featureLayerView
                    .queryFeatures(query)
                    .then(function (result) {
                    var feature = result.features[0];
                    var extent = feature.geometry.extent;
                    var id = feature.attributes['BNUM'];
                    view.popup.open({
                        features: [feature],
                        updateLocationEnabled: true
                    });
                    setTimeout(function () { return renderIndoor(id, extent); }, 500);
                })
                    .catch(function (e) { return console.error(e); });
            }
            if (featureLayerView.updating) {
                var handle_1 = featureLayerView.watch('updating', function (isUpdating) {
                    if (!isUpdating) {
                        executeQuery();
                        handle_1.remove();
                    }
                });
            }
            else
                executeQuery();
        });
    }
});
//# sourceMappingURL=main.js.map