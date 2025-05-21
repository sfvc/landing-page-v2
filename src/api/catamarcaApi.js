import axios from 'axios'

const catamarcaApi = axios.create({
  // baseURL: `${import.meta.env.VITE_API_URL}`
  baseURL: `https://apis.v1.cc.gob.ar/directus`
})

catamarcaApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers
  }

  return config
})

export { catamarcaApi }
