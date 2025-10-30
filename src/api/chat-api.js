import { apiClient } from "./axios";

class ChatService {

  async createChat(initialContext) {
    try {
      const response = await apiClient.post(`/chats`, {
        initialContext,
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error al crear el chat:", error);
      throw (
        error.response?.data ||
        new Error("Error desconocido al crear el chat.")
      );
    }
  }
  /**
   * Actualiza el contexto de un chat específico.
   * @param {string} chatId - ID del chat actual.
   * @param {string} newContext - Nombre del nuevo contexto seleccionado.
   * @returns {Promise<object>} - Respuesta del servidor.
   */
  async updateContext(chatId, newContext) {
    try {
      const response = await apiClient.post(`/chats/${chatId}/context`, {
        newContext,
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar el contexto:", error);
      throw (
        error.response?.data ||
        new Error("Error desconocido al actualizar el contexto.")
      );
    }
  }

  /**
   * Obtiene el historial de chats por nombre de contexto.
   * @param {string} contextName - Nombre del contexto a buscar.
   * @returns {Promise<object>} - Respuesta del servidor con el historial.
   */
  async getHistorialChatsByContext(contextName) {
    try {
      const response = await apiClient.get(`/chats/context/${contextName}`);
      // console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener historial de chats:", error);
      throw (
        error.response?.data ||
        new Error("Error desconocido al obtener el historial de chats.")
      );
    }
  }


}

export const chatService = new ChatService();
