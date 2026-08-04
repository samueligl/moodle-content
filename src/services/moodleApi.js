import axios from 'axios';

const moodleUrl = import.meta.env.VITE_MOODLE_URL;
const moodleToken = import.meta.env.VITE_MOODLE_TOKEN;

const moodleApi = axios.create({
  baseURL: `${moodleUrl}/webservice/rest/server.php`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

moodleApi.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {};
  }

  // Agregamos siempre el token y formato JSON
  config.params.wstoken = moodleToken;
  config.params.moodlewsrestformat = 'json';

  return config;
}, (error) => {
  return Promise.reject(error);
});

moodleApi.interceptors.response.use((response) => {
  // Moodle a menudo devuelve 200 OK con un JSON que contiene un error (`exception`)
  if (response.data && response.data.exception) {
    console.error('Moodle API Error:', response.data.message);
    return Promise.reject(new Error(response.data.message));
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default moodleApi;
