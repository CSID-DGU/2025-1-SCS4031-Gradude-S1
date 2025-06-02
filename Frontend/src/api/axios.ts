import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://43.201.159.48.nip.io:443',
  // withCredentials: true,
});

export default axiosInstance;
