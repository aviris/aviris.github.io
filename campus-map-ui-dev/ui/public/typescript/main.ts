import Basemap from 'esri/Basemap'
import Expand from 'esri/widgets/Expand'
import Extent from 'esri/geometry/Extent'
import FeatureLayer from 'esri/layers/FeatureLayer'
import GeoJSONLayer from 'esri/layers/GeoJSONLayer'
import Geometry from 'esri/geometry/Geometry'
import GroupLayer from 'esri/layers/GroupLayer'
import Home from 'esri/widgets/Home'
import Layer from 'esri/layers/Layer'
import LayerList from 'esri/widgets/LayerList'
import LayerSearchSource from 'esri/widgets/Search/LayerSearchSource'
import Legend from 'esri/widgets/Legend'
import Locate from 'esri/widgets/Locate'
import Map from 'esri/Map'
import MapView from 'esri/views/MapView'
import PictureMarkerSymbol from 'esri/symbols/PictureMarkerSymbol'
import SimpleRenderer from 'esri/renderers/SimpleRenderer'
import Search from 'esri/widgets/Search'
import VectorTileLayer from 'esri/layers/VectorTileLayer'

import { _createFeedbackWidget } from './suggestion'
import { _relativeFloorSelect } from './relativeFloorSelect'
import { defineActions, _showIndoorDisclaimer } from './disclaimer'
import { _buildingSelect, closeBuildingSelectList } from './buildingSelect'
import FeatureLayerView from 'esri/views/layers/FeatureLayerView'
import FeatureFilter from 'esri/views/layers/support/FeatureFilter'

let indoorFloorSingleBuilding: FeatureLayer = null
let accRestroomsSingleBuilding: FeatureLayer = null
// TODO: Uncomment when acc single water fountains is working
// let accFountainsSingleBuilding: FeatureLayer = null
let relativeFloorSelect: HTMLElement = null

const resources = {
  baseBackdrop: '7092e11ebd75439fa84cbab1e4c1f9ec',
  base: 'a8a1059aae8943db9e009878a2960f06',
  campusBuildings:
    'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BYU_Campus_Buildings/FeatureServer/0',
  Athletics: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Athletics/FeatureServer/0',
  Services: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Services/FeatureServer/0',
  StudentServices: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/StudentServices/FeatureServer/0',
  entertainmentMuseums:
    'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Entertainment_Museums/FeatureServer/0',
  printService:
    'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
  transportation:
    'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Transportation_Merge/FeatureServer/0',
  dining: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Dining/FeatureServer/0',
  computers: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/ComputerLabs_Merge/FeatureServer/0',
  webcams: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Web_Cams/FeatureServer/0',
  emergencyPhones: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Emergency_Phones/FeatureServer/0',
  accessibilityLayer:
    'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Accessible_Features/FeatureServer',
  accParking:
    'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/_BYU_Campus_Accessible_Parking/FeatureServer/0',
  accRoutes: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Routes/FeatureServer',
  accDoors: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Doors/FeatureServer',
  accFountains:
    'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Accessible_Drinking_Fountains/FeatureServer',
  accRestrooms: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Accessible_Restrooms/FeatureServer',
  parking: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BYU_Campus_Parking/FeatureServer/0',
  motorcycleParking:
    'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BYU_Motorcycle_Parking/FeatureServer/0',
  drinkingFountains:
    'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BYU_Drinking_Fountains/FeatureServer/0',
  // TODO switch back to our shim once Mendix can support old ciphers or WSO2 can have public APIs
  aeds: 'https://aed.byu.edu/rest/aed/v1/get-locations',
  indoorFloors: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/Floorplans_V/FeatureServer/0',
  athleticLines: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/0',
  tennisInner: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/1',
  tennisOuter: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/2',
  athleticBuildings: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/3',
  athleticGrass: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/4',
  athleticTracks: 'https://services.arcgis.com/FvF9MZKp3JWPrSkg/ArcGIS/rest/services/Athletics/FeatureServer/5'
}
const BYUBase = new Basemap({
  baseLayers: [
    new VectorTileLayer({
      portalItem: {
        id: resources.baseBackdrop
      }
    }),
    new VectorTileLayer({
      portalItem: {
        id: resources.base
      }
    })
  ]
})

const map = new Map({
  basemap: BYUBase
})

const view = new MapView({
  container: 'viewDiv',
  map,
  center: [-111.649278, 40.249251],
  zoom: 15
})
view.constraints = {
  minScale: 100000,
  rotationEnabled: false
}

const homeWidget = new Home({
  view
})
const locate = new Locate({
  view,
  goToLocationEnabled: true
})
const indoorToggle = document.createElement('button')

// Layers
const template = {
  title: '{Name}',
  content:
    "<img src='{ImageUrl}' alt='{ImageUrl}' ><div class='popupText'>{Description}</div>   <a target='_blank' href={url}>{url}</a>"
}
const aedTemplate = {
  title: 'AED #{ObjectID}',
  content:
    "<img src='{picture}' height='320' width='240' alt='aed'/><div class='popupText'>{building} room {room}  {location} </div>"
}

const layerList = new LayerList({
  container: document.createElement('div'),
  view,
  listItemCreatedFunction: defineActions
})

function isMobileDevice(): boolean {
  return /Mobi|iPhone|Android/i.test(navigator.userAgent)
}

const layerListExpand = new Expand({
  expandIconClass: 'esri-icon-layer-list',
  view,
  expanded: !isMobileDevice(),
  content: layerList.container
})

const legend = new Legend({
  view: view
})
legend.watch('activeLayerInfos.length', function (newValue) {
  if (newValue === 0) {
    view.ui.remove(legendExpand)
  } else {
    let legendNeeded = true
    legend.activeLayerInfos.forEach((activeLayerInfo) => {
      if (activeLayerInfo.layer.type === 'group') {
        const groupLayer = activeLayerInfo.layer as GroupLayer
        groupLayer.layers.forEach((layer: FeatureLayer) => {
          if (layer.visible) legendNeeded = layer.legendEnabled
        })
      }
    })
    if (legendNeeded) view.ui.add(legendExpand, 'bottom-left')
  }
})

const legendExpand = new Expand({
  expandIconClass: 'esri-icon-description',
  view,
  expanded: !isMobileDevice(),
  content: legend,
  mode: 'floating'
})

const restroomPopupTemplate = {
  title: '{CMPS_Flo_6}',
  content: '{RoomFile_4}'
}

function hideUneededParentLayer(): void {
  let visibleParentLayerNeeded = false
  legend.activeLayerInfos.forEach((activeLayerInfo) => {
    if (activeLayerInfo.layer.type === 'group') {
      const groupLayer = activeLayerInfo.layer as GroupLayer
      groupLayer.layers.forEach((layer) => {
        if (layer.visible) visibleParentLayerNeeded = true
      })
      groupLayer.visible = visibleParentLayerNeeded
    }
  })
}

function renderAbout(): void {
  const { ImageUrl, Description } = view.popup.selectedFeature.attributes
  const node: HTMLElement = document.getElementById('popupContent')
  if (ImageUrl != null && !isMobileDevice()) node.children[0].setAttribute('src', ImageUrl)
  node.getElementsByClassName('popupText')[0].textContent = Description
  document.getElementById('about-button').className = 'popupButton active'
  document.getElementById('indoor-button').className = 'popupButton'
}

function clearIndoor(): void {
  buildings.popupEnabled = true
  map.remove(indoorFloorSingleBuilding)
  indoorFloorSingleBuilding = null
  map.remove(accRestroomsSingleBuilding)
  accRestroomsSingleBuilding = null
  view.ui.remove(relativeFloorSelect)
  relativeFloorSelect = null
  view.popup.close()
  if (!isMobileDevice()) view.popup.dockEnabled = false
  view.ui.add(legendExpand, 'bottom-left')
}

function renderMobileLegend(): void {
  const legendNode = document.getElementsByClassName('esri-legend')[0].cloneNode(true)
  const popupBody = document.getElementById('popupText')
  popupBody.appendChild(legendNode)
  view.ui.remove(legendExpand)
}

function renderIndoor(id: string, extent: Extent): void {
  if (indoorFloorSingleBuilding) clearIndoor()
  layerListExpand.collapse()
  legendExpand.collapse()
  indoorFloorSingleBuilding = new FeatureLayer({
    url: resources.indoorFloors,
    definitionExpression: "FACILITY_ID = '" + id + "'",
    outFields: ['BLDG_LEVEL'],
    title: 'Building Floors'
  })
  accRestroomsSingleBuilding = new FeatureLayer({
    url: resources.accRestrooms,
    definitionExpression: "CMPS_Flo_1 = '" + id + "'",
    legendEnabled: false,
    popupTemplate: restroomPopupTemplate,
    outFields: ['RoomFile_4', 'CMPS_Flo_4', 'CMPS_Flo_6'],
    title: 'Building Accessible Restrooms'
  })
  // TODO: Get data returned similar to restrooms
  // accFountainsSingleBuilding = new FeatureLayer({
  //   url: resources.accFountains,
  //   definitionExpression: "CMPS_Flo_1 = '" + id + "'",
  //   legendEnabled: false,
  //   outFields: ['CMPS_Flo_4'],
  //   title: 'Building Accessible Water Fountains'
  // })
  // @ts-ignore
  view.popup.dockEnabled = true
  view.popup.visible = true

  map.add(indoorFloorSingleBuilding, 2)
  map.add(accRestroomsSingleBuilding, 3)
  // TODO: Uncomment when single acc water fountain layer is fixed
  // map.add(accFountainsSingleBuilding, 4)
  view
    .whenLayerView(indoorFloorSingleBuilding)
    .then(async function (featureLayerView: object) {
      const query = indoorFloorSingleBuilding.createQuery()
      // query min floor
      const minFloor = {
        onStatisticField: 'BLDG_LEVEL',
        outStatisticFieldName: 'min_floor',
        statisticType: 'min'
      }
      // query max floor
      const maxFloor = {
        onStatisticField: 'BLDG_LEVEL',
        outStatisticFieldName: 'max_floor',
        statisticType: 'max'
      }
      // @ts-ignore
      query.outStatistics = [minFloor, maxFloor]
      indoorFloorSingleBuilding
        .queryFeatures(query)
        .then(function (results) {
          const minFloor = results.features[0].attributes.min_floor
          const maxFloor = results.features[0].attributes.max_floor
          // @ts-ignore
          featureLayerView.filter = {
            where: 'BLDG_LEVEL = ' + minFloor.toString()
          }
          relativeFloorSelect = _relativeFloorSelect(
            view,
            indoorFloorSingleBuilding,
            accRestroomsSingleBuilding,
            minFloor,
            maxFloor
          )
          view.whenLayerView(accRestroomsSingleBuilding).then(function (featureLayerView: FeatureLayerView): void {
            featureLayerView.filter = new FeatureFilter({
              where: 'CMPS_Flo_4 = ' + minFloor.toString()
            })
          })
          view.ui.add(relativeFloorSelect, 'top-left')

          document.getElementById('popupText').textContent = ''
          document.getElementById('popupImage').setAttribute('src', '')
          document.getElementById('about-button').className = 'popupButton'
          document.getElementById('indoor-button').className = 'popupButton active'
          //move legend to popupText area
          setTimeout(renderMobileLegend, 500)
        })
        .catch((e) => console.error('query error ', e))
      await view.goTo(extent)
      indoorToggle.textContent = 'Outdoor'
    })
    .catch((e) => console.error('featurelayerview error ', e))
}

function setBuildingsPopupContent(feature: {
  graphic: {
    attributes: { ImageUrl: string; Description: string; BNUM: string }
    geometry: Geometry
  }
}): HTMLElement {
  view.popup.collapsed = false
  if (indoorFloorSingleBuilding) clearIndoor()
  const { ImageUrl, Description, BNUM } = feature.graphic.attributes
  const extent = feature.graphic.geometry.extent
  // @ts-ignore
  const node: HTMLDivElement = document.getElementById('popupContent').cloneNode(true)
  node.setAttribute('style', 'display: block')
  if (ImageUrl != null && !isMobileDevice()) node.children[0].setAttribute('src', ImageUrl)
  node.getElementsByClassName('popupText')[0].textContent = Description
  node.getElementsByClassName('popupButton')[1].addEventListener('click', () => renderIndoor(BNUM, extent))
  node.getElementsByClassName('popupButton')[0].addEventListener('click', () => renderAbout())
  buildings.popupEnabled = false
  return node
}

function makeParentLayerVisible(layer: Layer): void {
  !layer.visible ? (layer.visible = true) : layer.visible
}

const buildingsPopupTemplate = {
  title: '{Name}',
  content: setBuildingsPopupContent
}

const buildings = new FeatureLayer({
  url: resources.campusBuildings,
  outFields: ['*'],
  definitionExpression: "Name <> ''",
  popupTemplate: buildingsPopupTemplate,
  legendEnabled: false,
  title: 'Buildings'
})

// const entertainmentMuseums = new FeatureLayer({
//   url: resources.entertainmentMuseums,
//   popupTemplate: template,
//   visible: false,
//   title: 'Entertainment & Museums'
// })
const parking = new FeatureLayer({
  url: resources.parking,
  popupTemplate: {
    title: 'Lot {Lot_Type} - {Map_Catego}',
    content: '{Descriptio}'
  },
  visible: false,
  title: 'Parking'
})

const accParking = new FeatureLayer({
  url: resources.accParking,
  visible: false,
  title: 'Accessible Parking'
})
accParking.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(accessibility)
  hideUneededParentLayer()
})
const accDoors = new FeatureLayer({
  url: resources.accDoors,
  visible: false,
  title: 'Accessible Doors',
  legendEnabled: false
})
accDoors.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(accessibility)
  hideUneededParentLayer()
})
const accFountains = new FeatureLayer({
  url: resources.accFountains,
  visible: false,
  title: 'Accessible Water Fountains',
  legendEnabled: false
})
accFountains.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(accessibility)
  hideUneededParentLayer()
})
const accRestrooms = new FeatureLayer({
  url: resources.accRestrooms,
  visible: false,
  title: 'Accessible Restrooms',
  legendEnabled: false,
  popupTemplate: restroomPopupTemplate
})
accRestrooms.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(accessibility)
  hideUneededParentLayer()
})
const accRoutes = new FeatureLayer({
  url: resources.accRoutes,
  visible: false,
  title: 'Accessible Routes'
})
accRoutes.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(accessibility)
  hideUneededParentLayer()
})
const accessibility = new GroupLayer({
  layers: [accDoors, accFountains, accParking, accRestrooms, accRoutes],
  title: 'Accessibility Access',
  visible: false
})
accessibility.watch('visible', function (newValue) {
  if (!newValue) {
    this.layers.forEach((layer: Layer) => (layer.visible = false))
  } else {
    const routes: Layer = this.layers.items.find((el: Layer) => el.title === accRoutes.title)
    routes.visible = true
  }
})

// Disable until layer is complete
// eslint-disable-next-line
const transportation = new FeatureLayer({
  url: resources.transportation,
  visible: false,
  title: 'Transportation'
})
const dining = new FeatureLayer({
  url: resources.dining,
  visible: false,
  popupTemplate: template,
  title: 'Dining'
})

const athleticLines = new FeatureLayer({
  url: resources.athleticLines,
  visible: false,
  popupTemplate: template,
  title: 'Athletic Field Lines'
})
athleticLines.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(sports)
  hideUneededParentLayer()
})
const tennisInner = new FeatureLayer({
  url: resources.tennisInner,
  visible: false,
  popupTemplate: template,
  title: 'Indoor Tennis Courts'
})
tennisInner.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(sports)
  hideUneededParentLayer()
})
const tennisOuter = new FeatureLayer({
  url: resources.tennisOuter,
  visible: false,
  popupTemplate: template,
  title: 'Outdoor Tennis Courts'
})
tennisOuter.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(sports)
  hideUneededParentLayer()
})
const athleticBuildings = new FeatureLayer({
  url: resources.athleticBuildings,
  visible: false,
  popupTemplate: template,
  title: 'Athletic Buildings'
})
athleticBuildings.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(sports)
  hideUneededParentLayer()
})
const athleticGrass = new FeatureLayer({
  url: resources.athleticGrass,
  visible: false,
  popupTemplate: template,
  title: 'Athletic Grass'
})
athleticGrass.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(sports)
  hideUneededParentLayer()
})
const athleticTracks = new FeatureLayer({
  url: resources.athleticTracks,
  visible: false,
  popupTemplate: template,
  title: 'Athletic Tacks'
})
athleticTracks.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(sports)
  hideUneededParentLayer()
})
const sports = new GroupLayer({
  layers: [tennisInner, tennisOuter, athleticBuildings, athleticGrass, athleticTracks, athleticLines],
  title: 'Sports',
  visible: false
})
sports.watch('visible', function (newValue) {
  if (!newValue) {
    this.layers.forEach((layer: Layer) => (layer.visible = false))
  } else {
    const sportsSubLayer: Layer = this.layers.items.find((el: Layer) => el.title === athleticLines.title)
    sportsSubLayer.visible = true
  }
})

const services = new FeatureLayer({
  url: resources.Services,
  popupTemplate: template,
  visible: false,
  title: 'Campus Services'
})
services.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(serviceGroupLayer)
  hideUneededParentLayer()
})
const studentServices = new FeatureLayer({
  url: resources.StudentServices,
  popupTemplate: template,
  visible: false,
  title: 'Student Services'
})
studentServices.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(serviceGroupLayer)
  hideUneededParentLayer()
})
const computersAndPrinters = new FeatureLayer({
  url: resources.computers,
  visible: false,
  title: 'Computers and Printers'
})
computersAndPrinters.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(serviceGroupLayer)
  hideUneededParentLayer()
})
const webcams = new FeatureLayer({
  url: resources.webcams,
  visible: false,
  title: 'Web Cameras'
})
webcams.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(serviceGroupLayer)
  hideUneededParentLayer()
})
const emergencyPhones = new FeatureLayer({
  url: resources.emergencyPhones,
  visible: false,
  title: 'Emergency Phones',
  legendEnabled: false
})
emergencyPhones.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(serviceGroupLayer)
  hideUneededParentLayer()
})
const aeds = new GeoJSONLayer({
  title: "AED's",
  url: resources.aeds,
  renderer: new SimpleRenderer({
    symbol: new PictureMarkerSymbol({
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
})
aeds.watch('visible', function (newValue) {
  if (newValue) makeParentLayerVisible(serviceGroupLayer)
  hideUneededParentLayer()
})
const serviceGroupLayer = new GroupLayer({
  // Define layers here
  layers: [emergencyPhones, aeds],
  title: 'Services',
  visible: false
})
serviceGroupLayer.watch('visible', function (newValue) {
  if (!newValue) {
    this.layers.forEach((layer: Layer) => (layer.visible = false))
  } else {
    const aedsSubLayer: Layer = this.layers.items.find((el: Layer) => el.title === aeds.title)
    aedsSubLayer.visible = true
  }
})

// Define layers here
map.addMany([buildings, parking, serviceGroupLayer, accessibility])

const listNode = _buildingSelect(view, buildings, renderIndoor)
const panelSide = document.getElementById('panel-side') as HTMLDivElement
const panelSideTitle = document.getElementById('panel-side-title') as HTMLDivElement
indoorToggle.textContent = 'Indoor'
indoorToggle.id = 'indoor-toggle-btn'
panelSideTitle.onclick = function (): void {
  closeBuildingSelectList()
  listNode.hidden = true
  indoorToggle.textContent = 'Indoor'
}
indoorToggle.onclick = function (): void {
  if (indoorToggle.textContent === 'Indoor') {
    if (indoorFloorSingleBuilding) clearIndoor()
    panelSide.style.backgroundColor = '#E6E6E6'
    panelSide.style.zIndex = '1'
    panelSideTitle.classList.remove('visually-hidden')
    _showIndoorDisclaimer()
    indoorToggle.textContent = 'Outdoor'
    listNode.hidden = false
    layerListExpand.collapse()
    view.ui.remove(layerListExpand)
  } else {
    clearIndoor()
    indoorToggle.textContent = 'Indoor'
    listNode.hidden = true
    homeWidget.go()
    buildings.visible = true
    view.ui.add(layerListExpand, 'top-right')
    layerListExpand.expand()
  }
}

// Widgets
view
  .when(function () {
    const search = new Search({
      view,
      allPlaceholder: 'Enter Name or Acronym',
      includeDefaultSources: false,
      sources: [
        new LayerSearchSource({
          layer: buildings,
          searchFields: ['Name', 'Acronym'],
          suggestionTemplate: '{Name} ({Acronym})',
          displayField: 'Name',
          exactMatch: false,
          outFields: ['*'],
          name: 'Buildings',
          placeholder: 'example: JSB'
        }),
        new LayerSearchSource({
          layer: parking,
          searchFields: ['Lot_Type', 'Map_Catego'],
          suggestionTemplate: '{Lot_Type} - {Map_Catego}',
          exactMatch: false,
          outFields: ['*'],
          name: 'Parking Lots',
          placeholder: 'example: 40G'
        })
        // new LayerSearchSource({
        //   layer: sports,
        //   searchFields: ['Name', 'BLDG_ABBR'],
        //   suggestionTemplate: '{Name}',
        //   exactMatch: false,
        //   outFields: ['*'],
        //   name: 'Sports',
        //   placeholder: 'example: Marriott Center'
        // }),
        // new LayerSearchSource({
        //   layer: services,
        //   searchFields: ['Name'],
        //   suggestionTemplate: '{Name}',
        //   exactMatch: false,
        //   outFields: ['*'],
        //   name: 'Services',
        //   placeholder: 'example: AEDs'
        // }),
        // new LayerSearchSource({
        //   layer: studentServices,
        //   searchFields: ['Name'],
        //   suggestionTemplate: '{Name}',
        //   exactMatch: false,
        //   outFields: ['*'],
        //   name: 'Student Services',
        //   placeholder: 'example: Title IX'
        // }),
        // new LayerSearchSource({
        //   layer: entertainmentMuseums,
        //   searchFields: ['Name'],
        //   suggestionTemplate: '{Name}',
        //   exactMatch: false,
        //   outFields: ['*'],
        //   name: 'Entertainment and Museums',
        //   placeholder: 'example: Planetarium'
        // })
      ]
    })

    // Feedback widget
    const feedbackBtn = _createFeedbackWidget()

    // Put widgets on the view
    view.ui.add(search, { position: 'top-left', index: 0 })
    view.ui.add(homeWidget, 'top-left')
    view.ui.add(locate, 'top-left')
    view.ui.add(layerListExpand, 'top-right')
    view.ui.add(feedbackBtn, 'bottom-right')
    view.ui.add(indoorToggle, { position: 'top-right', index: 0 })
  })
  .catch((e) => {
    console.error('Error loading map.', e)
  })

//handle url params
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
if (urlParams.has('layer')) {
  const layer = urlParams.get('layer').toLowerCase()
  switch (layer) {
    case 'parking':
      parking.visible = true
      buildings.visible = false
      break
    case 'dining':
      dining.visible = true
      buildings.visible = false
      break
    case 'sports':
      sports.visible = true
      buildings.visible = false
      break
    case 'aed':
      aeds.visible = true
      buildings.visible = false
      break
  }
}
if (urlParams.has('building')) {
  const building = urlParams.get('building').toUpperCase()
  view.whenLayerView(buildings).then((featureLayerView) => {
    const query = buildings.createQuery()
    query.where = `Acronym ='${building}'`
    query.returnGeometry = true
    query.outFields = ['*']

    function executeQuery(): void {
      featureLayerView
        .queryFeatures(query)
        .then((result) => {
          const feature = result.features[0]
          const { extent } = feature.geometry
          const id = feature.attributes['BNUM']
          view.popup.open({
            features: [feature],
            updateLocationEnabled: true
          })
          setTimeout(() => renderIndoor(id, extent), 500)
        })
        .catch((e) => console.error(e))
    }

    if (featureLayerView.updating) {
      const handle = featureLayerView.watch('updating', function (isUpdating) {
        if (!isUpdating) {
          executeQuery()
          handle.remove()
        }
      })
    } else executeQuery()
  })
}
