import axios from 'axios';
import { store } from '../../state/store';
const api = axios.create({
  baseURL: 'https://api.houtalik.com/api/custom', // Replace with your API base URL
});

// Request interceptor
api.interceptors.request.use(
    config => {
      let token = '';
      const persistValue = store.getState().authentication.user;
      if(persistValue != null && persistValue.token != null){
        token = persistValue.token;
      }
      config.headers['Accept'] ='application/json'; // Replace with your authorization logic
      config.headers['Content-Type'] ='application/json'; // Replace with your authorization logic
      config.headers.Authorization = token; // Replace with your authorization logic
      return config;
    },
    error => {
      // Handle request error
      return Promise.reject(error);
    }
  );
export default api;