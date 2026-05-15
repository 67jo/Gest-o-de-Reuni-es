// SEM CHAVES, pois é export default
import api from "../api/axios"

export const criarSessao = async (dados: any) => {
  try {
    // Lembre-se do 'await' para esperar a resposta do Fastify
    const response = await api.post("/sessions", dados)
    return response.data
  } catch (error) {
    console.error("Erro ao criar sessão:", error)
    throw error
  }
}