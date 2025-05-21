import axios from 'axios'

const catamarcaApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`
})

catamarcaApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers
  }

  return config
})

export { catamarcaApi }
