import React, {useState} from 'react';
import * as Api from '@/services/api';

let countriesCached = undefined;
const statesCached = {};
const citiesCached = {};

export const useGeoHooks = (country, state) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Cache countries on loading
  React.useEffect(() => {
    if (!countriesCached) {
      Api.getCountries().then(d => {
        countriesCached = d;
        setCountries(countriesCached);
      }).catch(console.log)
    } else {
      setCountries(countriesCached);
    }
  }, []);

  // when states changes, update the cities list
  React.useEffect(() => {
    if (country && country.id) {
      if (statesCached[country.id]) {
        setStates(statesCached[country.id]);
      } else {
        Api.getStates(country.id)
          .then(d => {
            statesCached[country.id] = d;
            setStates(d);
          })
          .catch(console.log());
      }
    } else {
      setStates([]);
    }
  }, [country]);

  // when state changes, update states list
  React.useEffect(() => {
    if (state && state.id) {
      if (citiesCached[state.id]) {
        setCities(citiesCached[state.id]);
      } else {
        Api.getCities(state.id)
          .then(d => {
            citiesCached[state.id] = d;
            setCities(d);
          })
          .catch(console.log());
      }
    } else {
      setCities([]);
    }
  }, [state]);

  return {
    countries, states, cities,
  }
}
