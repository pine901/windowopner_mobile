import axios from 'axios';
import Config from '@/config';


const instance = axios.create({
  baseURL: 'https://api.weatherapi.com/v1/current.json',
});

export const queryWeather = ({lat, lng}) => {
  return instance.get('', {
    params: {
      key: Config.weatherApiKey,
      q: `${lat},${lng}`
    }
  }).then(r => r.data);
}