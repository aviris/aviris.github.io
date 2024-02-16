import ListItem from 'esri/widgets/LayerList/ListItem'

const uniqueParentItems: string[] = [],
  modal: HTMLElement = document.querySelector('.modal'),
  closeBtn: HTMLButtonElement = document.querySelector('.close-btn'),
  modalText = document.getElementById('modal-text'),
  modalTitle = document.getElementById('modal-title')
let showAccDisclaimer = true,
  showIndoorDisclaimer = true

closeBtn.onclick = function (): void {
  modal.style.display = 'none'
}

export function _showIndoorDisclaimer(): void {
  if (showIndoorDisclaimer) {
    showIndoorDisclaimer = false
    modal.style.display = 'block'
    modalTitle.textContent = 'Indoor Disclaimer:'
    modalText.textContent =
      'This feature is currently under development, and may not be an accurate representation of indoors. If you would like to submit feedback, click the "Feedback" button in the lower left-hand corner'
    showAccDisclaimer = false
  }
}

// @ts-ignore
export function defineActions(event: { item: ListItem }): void {
  const item = event.item
  if (!item.parent) {
    //only add the item if it has not been added before
    if (!uniqueParentItems.includes(item.title)) {
      uniqueParentItems.push(item.title)
      // @ts-ignore this function works, but their types are wrong.
      item.watch('visible', function (visible: boolean) {
        visible ? (item.open = true) : (item.open = false)
        if (item.title === 'Accessibility' && showAccDisclaimer) {
          modal.style.display = 'block'
          modalTitle.textContent = 'Accessibility Disclaimer:'
          modalText.textContent =
            'This feature is currently under development, and may not be an accurate representation of accessible routes. If you would like to submit feedback, click the "Feedback" button in the lower left-hand corner'
          showAccDisclaimer = false
        }
      })
    }
  }
}
