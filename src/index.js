import _, { debounce } from 'lodash';
import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(eventHandler, DEBOUNCE_DELAY));
input.addEventListener('keydown', debounce(clear, DEBOUNCE_DELAY));

function eventHandler() {
  const name = input.value;
  fetchCountries(name.trim())
    .then(countries => {
      if (countries.length === 1) {
        clearHTML();
        renderCountry(countries);
      } else if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
      } else if (countries.length !== 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearHTML();
      }
    })

    .catch(error => console.log('Mam błąd', error));
}

//funkcja do wyświetlania

function renderCountry(countries) {
  const countriesInfo = countries
    .map(countries => {
      const language = Object.values(countries.languages[0]);
      return `
        <div>
          <img src="${countries.flags['svg']}" alt="${countries.name}" > 
          <p>${countries.name}</p> 
        </div>
          <p><b>Capital</b>: ${countries.capital}</p>
          <p><b>Population</b>: ${countries.population}</p>
          <p><b>Languages</b>: ${language}</p>
    `;
    })
    .join('');
  countryInfo.innerHTML = countriesInfo;
}

function renderCountryList(countries) {
  const countriesList = countries
    .map(countries => {
      return `
          <li><img src="${countries.flags['svg']}" alt="${countries.name}"> ${countries.name}
          </li>
      `;
    })
    .join('');
  countryList.innerHTML = countriesList;
}

//funkcja czyszcząca

function clear(event) {
  const key = event.key;
  if (key === 'Backspace' || key === 'Delete') {
    return clearHTML();
  }
}

function clearHTML() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
