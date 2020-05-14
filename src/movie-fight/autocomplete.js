const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
  root.innerHTML = `
  <div class="field">
    <div class="control">
      <label><b>Search</b></label>
      <input type="text" class="input">
    </div>
  </div>
  <div class="field">
    <div class="control">
      <div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results"></div>
        </div>
      </div>
    </div>
  </div>
  `

  const input = root.querySelector('input')
  const dropdown = root.querySelector('.dropdown')
  const resultWrapper = root.querySelector('.results')

  const onInput = async event => {
    const items = await fetchData(event.target.value)

    if (!items.length) {
      dropdown.classList.remove('is-active')
      return
    }

    resultWrapper.innerHTML = ''
    dropdown.classList.add('is-active')

    for (let item of items) {
      const option = document.createElement('a')
      option.classList.add('dropdown-item')

      option.innerHTML= renderOption(item)

      option.addEventListener('click', () => {
        dropdown.classList.remove('is-active')
        input.value = inputValue(item)
        onOptionSelect(item)
      })

      resultWrapper.appendChild(option)
    }
  }

  input.addEventListener('input', debounce(onInput, 500))
  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active')
    }
  })
}
