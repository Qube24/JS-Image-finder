//funkcja
const fetchCountryFields = 'name,capital,population,flags,languages';
export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v2/name/${name}?fields=${fetchCountryFields}`
  )
    .then(res => res.json())
    .catch(err => console.log('error', err));
}


