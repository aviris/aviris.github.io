import Graphic from 'esri/Graphic'
import MapView from 'esri/views/MapView'
import FeatureLayer from 'esri/layers/FeatureLayer'

export function closeBuildingSelectList(): void {
  const panelSide = document.getElementById('panel-side') as HTMLDivElement
  const panelSideTitle = document.getElementById('panel-side-title') as HTMLDivElement
  panelSideTitle.classList.add('visually-hidden')
  panelSide.style.backgroundColor = 'transparent'
  panelSide.style.zIndex = '0'
}

export function _buildingSelect(view: MapView, buildings: FeatureLayer, renderIndoor: Function): HTMLUListElement {
  let graphics: Graphic[]
  const listNode = document.getElementById('listNode') as HTMLUListElement
  listNode.hidden = true
  closeBuildingSelectList()
  view.whenLayerView(buildings).then(function (lyrView) {
    function executeQuery(): void {
      const queryParams = buildings.createQuery()
      queryParams.returnGeometry = true
      queryParams.returnCentroid = true
      queryParams.orderByFields = ['Acronym', 'Name']
      queryParams.outFields = ['*']
      queryParams.where = 'BNUM IS NOT NULL'
      lyrView.queryFeatures(queryParams).then(
        function (results) {
          const features = results.features
          graphics = features
          const fragment = document.createDocumentFragment()

          features.forEach(function (result, index) {
            const attributes = result.attributes
            let name
            if (attributes.Acronym != null) {
              name = attributes.Acronym + ' - ' + attributes.Name
            } else {
              name = attributes.Name
            }
            const li = document.createElement('li')
            li.classList.add('panel-result')
            li.tabIndex = 0
            li.setAttribute('data-result-id', index.toString())
            li.textContent = name
            fragment.appendChild(li)
          })
          // Empty the current list
          listNode.innerHTML = ''
          listNode.appendChild(fragment)
        },
        function (error) {
          console.error('indoor query error', error)
        }
      )
    }
    if (lyrView.updating) {
      const handle = lyrView.watch('updating', function (isUpdating) {
        if (!isUpdating) {
          executeQuery()
          handle.remove()
        }
      })
    } else executeQuery()
  })
  function onListClickHandler(event: Event): void {
    const target = event.target
    // @ts-ignore
    const resultId = target.getAttribute('data-result-id')
    // get the graphic corresponding to the clicked zip code
    const result = resultId && graphics && graphics[parseInt(resultId, 10)]
    if (result) {
      const feature = result
      const { extent } = feature.geometry
      const id = feature.attributes['BNUM']
      view.popup.open({
        features: [feature],
        updateLocationEnabled: true
      })
      setTimeout(() => renderIndoor(id, extent), 500)
      listNode.hidden = true
      closeBuildingSelectList()
      buildings.visible = false
    }
  }
  listNode.addEventListener('click', onListClickHandler)

  return listNode
}
