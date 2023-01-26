import _, { debounce } from 'lodash';
import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

// largeImageURL - link do dużego obrazka.

const getData = async output => {
  const res = await axios.get(
    `https://pixabay.com/api/?key=33147490-9fc73efc70912b9906c0b3bde&q=${output}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  return res.data;
};

form.addEventListener('submit', eventHandler);

function eventHandler(event) {
  event.preventDefault();
  const name = event.target[0].value;
  getData(name).then(res => {
    renderGallery(res);
  });
}

function renderGallery(res) {
  const imgCard = res.hits
    .map(el => {
      return `<div class="photo-card">
    <img src=${el.webformatURL} alt="${el.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${el.likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${el.views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${el.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${el.downloads}</b>
      </p>
    </div>
    </div>
    `;
    })
    .join('');
  gallery.innerHTML = imgCard;
}
