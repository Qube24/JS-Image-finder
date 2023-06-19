import _, { debounce } from 'lodash';
import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// zmienne

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

let page = 1;
const perPage = 40;
let value = '';
let totalPages;

// lightbox

let lightbox = new SimpleLightbox('.bigPhoto', {
  captionsData: 'alt',
  captionDelay: 250,
});

// event listeners

form.addEventListener('submit', eventHandler);
loadBtn.addEventListener('click', eventLoader);
form.addEventListener('keydown', clear);
loadBtn.style.display = 'none';

// funkcja fetch API

async function fetchImg() {
  try {
    const res = await axios.get(
      `https://pixabay.com/api/?key=33147490-9fc73efc70912b9906c0b3bde&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return res;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Something went wrong');
  }
}

// funkcje event handlery

async function eventHandler(event) {
  loadBtn.style.display = 'none';
  event.preventDefault();
  gallery.innerHTML = '';
  value = input.value;
  fetchImg(value).then(res => {
    if (value === '') {
      return Notiflix.Notify.warning(
        `Pleas fill search field with your request.`
      );
    }
    totalPages = Math.ceil(res.data.totalHits / perPage);
    if (res.data.totalHits > 0) {
      renderGallery(res);
      loadBtn.style.display = 'block';
      page += 1;
      return Notiflix.Notify.info(
        `Hooray! We found ${res.data.totalHits} images.`
      );
    }
    if (res.data.totalHits === 0) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }
  });
}

function eventLoader() {
  fetchImg()
    .then(res => {
      renderGallery(res);
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Something went wrong');
    });
  page += 1;
  if (page > totalPages) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

// funkcja render

function renderGallery(res) {
  const imgCard = res.data.hits
    .map(el => {
      return `<div class="photo-card">
      <a class="bigPhoto" href=${el.largeImageURL}><img src=${el.webformatURL} alt="${el.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes<span class=center> ${el.likes}</span></b>
      </p>
      <p class="info-item">
        <b>Views<span class=center> ${el.views}</span></b>
      </p>
      <p class="info-item">
        <b>Comments <span class=center>${el.comments}</span></b>
      </p>
      <p class="info-item">
        <b>Downloads <span class=center>${el.downloads}</span></b>
      </p>
    </div>
    </div>
    `;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', imgCard);
  lightbox.refresh();
}

//funkcje czyszcząca

function clearHTML() {
  gallery.innerHTML = '';
}

function clear(event) {
  const key = event.key;
  if (key === 'Backspace' || key === 'Delete') {
    loadBtn.style.display = 'none';
    return clearHTML();
  }
}
