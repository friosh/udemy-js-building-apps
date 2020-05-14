const fetchData = async searchTerm => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '68e4614c',
      s: searchTerm
    }
  })

  if (response.data.Error) {
    return []
  }

  return response.data.Search
}

const root = document.querySelector('.autocomplete')
root.innerHTML = `
  <div class="field">
    <div class="control">
      <label><b>Search For a Movie</b></label>
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
const input = document.querySelector('input')
const dropdown = document.querySelector('.dropdown')
const resultWrapper = document.querySelector('.results')

const onInput = async event => {
  const movies = await fetchData(event.target.value)

  if (!movies.length) {
    dropdown.classList.remove('is-active')
    return
  }

  resultWrapper.innerHTML = ''
  dropdown.classList.add('is-active')

  for (let movie of movies) {
    const option = document.createElement('a')
    option.classList.add('dropdown-item')
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster

    option.innerHTML= `
        <img src="${imgSrc}" />
        ${movie.Title}
    `

    option.addEventListener('click', () => {
      dropdown.classList.remove('is-active')
      input.value = movie.Title
      onMovieSelect(movie)
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

const onMovieSelect = async movie => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '68e4614c',
      i: movie.imdbID
    }
  })

  document.querySelector('#summary').innerHTML = movieTemplate(response.data)
}

const movieTemplate = (movieDetail) => {
  return `
    <article class="media">
      <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" alt="">
      </p>
    </figure>  
    <div class="media-contetnt">
      <div class="content">
      <h1>${movieDetail.Title}</h1>
      <h4>${movieDetail.Genre}</h4>
      <p>${movieDetail.Plot}</p>
    </div>
  </div>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box office</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMBD Rating</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMBD Votes</p>
  </article>
  `
}
