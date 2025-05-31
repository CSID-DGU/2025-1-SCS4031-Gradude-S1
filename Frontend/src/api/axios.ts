import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://43.201.159.48:8080/',
  // withCredentials: true,
});

export default axiosInstance;
