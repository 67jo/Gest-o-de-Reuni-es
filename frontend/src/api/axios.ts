import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials:true // URL do seu Fastify
})

export default api