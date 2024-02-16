function displayFeedbackMessage(msg: string, error: Boolean = true): void {
  if (document.getElementById('feedback-msg')) {
    document.getElementById('feedback-msg').remove()
  }
  if (document.getElementById('feedback-error')) {
    document.getElementById('feedback-error').remove()
  }

  const newMsg = document.createElement('p')
  if (error) {
    newMsg.id = 'feedback-error'
  } else {
    newMsg.id = 'feedback-msg'
  }

  newMsg.textContent = msg
  document.getElementById('feedback-form-body').appendChild(newMsg)
}

export function _createFeedbackWidget(): HTMLButtonElement {
  const button = document.createElement('button')
  button.id = 'feedback-widget-button'
  button.innerText = 'Feedback'
  button.addEventListener('click', () => {
    document.getElementById('feedback-form-container').style.display = 'flex'

    const closeFormBtn = document.getElementById('close-form')
    closeFormBtn.style.cursor = 'pointer'
    closeFormBtn.addEventListener('click', () => {
      document.getElementById('feedback-form-container').style.display = 'none'
    })

    const submitFeedbackBtn = document.getElementById('feedback-submit-btn') as HTMLButtonElement
    submitFeedbackBtn.addEventListener('click', async (e: Event) => {
      e.preventDefault()
      const email = document.getElementById('feedback-email') as HTMLInputElement
      const name = document.getElementById('feedback-name') as HTMLInputElement
      const feedbackLocation = document.getElementById('feedback-location') as HTMLInputElement
      const reason = document.getElementById('feedback-reason') as HTMLSelectElement
      const message = document.getElementById('feedback-message') as HTMLTextAreaElement

      if (email.value === '' || name.value === '' || feedbackLocation.value === '' || message.value === '') {
        displayFeedbackMessage('You must fill out all fields.')
      } else {
        displayFeedbackMessage('Submitting feedback...', false)
        submitFeedbackBtn.disabled = true
        const data = {
          email: email.value,
          name: name.value,
          location: feedbackLocation.value,
          reason: reason.options[reason.selectedIndex].text,
          message: message.value
        }
        const rawResponse = await fetch('/rest/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        if (rawResponse.ok) {
          location.reload()
          displayFeedbackMessage('Your feedback was successfully submitted.', false)
          submitFeedbackBtn.disabled = false
        } else {
          console.log('Error sending feedback')
          displayFeedbackMessage('An error occurred sending feedback.')
          submitFeedbackBtn.disabled = false
        }
      }
    })
  })

  return button
}
