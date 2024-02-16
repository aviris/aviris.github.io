import MapView from 'esri/views/MapView'
import FeatureLayer from 'esri/layers/FeatureLayer'
import FeatureLayerView from 'esri/views/layers/FeatureLayerView'
import FeatureFilter from 'esri/views/layers/support/FeatureFilter'

export function _relativeFloorSelect(
  view: MapView,
  indoorFloors: FeatureLayer,
  accRestrooms: FeatureLayer,
  minFloor: number,
  maxFloor: number
): HTMLElement {
  const relativeFloorSelect = document.createElement('div')
  relativeFloorSelect.className = 'RFSContainer'
  const icon = new Image()
  icon.src = './images/Stairs.png'
  icon.className = 'stairIcon'
  relativeFloorSelect.appendChild(icon)
  relativeFloorSelect.appendChild(icon)
  const ul = document.createElement('ul')
  ul.className = 'relativeFloorSelect'
  relativeFloorSelect.appendChild(ul)

  function setFloor(floor: number): void {
    ul.getElementsByClassName('active')[0].className = ''
    const floorIndex = minFloor < 1 ? floor : floor - 1
    ul.children[floorIndex].className = 'active'
    view.whenLayerView(indoorFloors).then(function (featureLayerView: FeatureLayerView): void {
      featureLayerView.filter = new FeatureFilter({
        where: 'BLDG_LEVEL = ' + floor.toString()
      })
    })
    view.whenLayerView(accRestrooms).then(function (featureLayerView: FeatureLayerView): void {
      featureLayerView.filter = new FeatureFilter({
        where: 'CMPS_Flo_4 = ' + floor.toString()
      })
    })
  }

  for (let i = minFloor; i <= maxFloor; i++) {
    const li = document.createElement('li')
    if (i == minFloor) li.className = 'active'
    li.textContent = i.toString()
    li.addEventListener('click', () => setFloor(i))
    ul.appendChild(li)
  }

  return relativeFloorSelect
}
