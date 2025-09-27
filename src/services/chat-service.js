import apiClient from "../api/axios";

class ChatService {
  /**
   * Elimina un chat por ID
   * @param {string} chatId - ID del chat a eliminar
   * @returns {Promise<{success: boolean, message: string, data?: any}>}
   */
  async deleteChat(chatId) {
    try {
      // Validación básica del parámetro
      if (!chatId || typeof chatId !== 'string') {
        throw new Error('ID del chat es requerido y debe ser una cadena válida');
      }

      const response = await apiClient.delete(`/chats/${chatId}`);

      return {
        success: true,
        message: response.data.message || 'Chat eliminado exitosamente',
        data: response.data
      };
    } catch (error) {
      // Manejo detallado de errores
      if (error.response) {
        // Error de respuesta del servidor
        const { status, data } = error.response;
        return {
          success: false,
          message: data.message || 'Error al eliminar el chat',
          error: {
            status,
            code: data.code || 'DELETE_CHAT_ERROR',
            details: data.details || null
          }
        };
      } else if (error.request) {
        // Error de red
        return {
          success: false,
          message: 'Error de conexión. Verifica tu conexión a internet',
          error: {
            code: 'NETWORK_ERROR',
            details: 'No se pudo establecer conexión con el servidor'
          }
        };
      } else {
        // Error en la configuración de la petición o validación
        return {
          success: false,
          message: error.message || 'Error inesperado al eliminar el chat',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.message
          }
        };
      }
    }
  }

  /**
   * Actualiza el nombre/título de un chat
   * @param {string} chatId - ID del chat a actualizar
   * @param {string} newTitle - Nuevo título para el chat
   * @returns {Promise<{success: boolean, message: string, data?: any, updatedChat?: Object}>}
   */
// En: frontend/src/services/chat-service.js

async updateChatTitle(chatId, newTitle) {
  try {
    // Las validaciones de los parámetros son correctas y se mantienen.
    if (!chatId || typeof chatId !== 'string') {
      throw new Error('ID del chat es requerido y debe ser una cadena válida');
    }
    if (!newTitle || typeof newTitle !== 'string' || newTitle.trim().length === 0) {
      throw new Error('El nuevo título es requerido y debe ser una cadena no vacía');
    }

    // La llamada a la API es correcta y se mantiene.
    const response = await apiClient.put(`/chats/${chatId}/title`, {
      newTitle: newTitle.trim()
    });

    // --- LA CORRECCIÓN ---
    // En caso de éxito, devolvemos un objeto que coincide con lo que
    // el hook useChatActions espera: { success: true, updatedChat: ... }
    // Pero ahora, 'updatedChat' es la respuesta directa del backend.
    return {
      success: true,
      message: 'Título actualizado exitosamente',
      updatedChat: response.data // <-- AQUÍ ESTÁ EL CAMBIO CLAVE
    };

  } catch (error) {
    // El manejo de errores que ya tenías es muy bueno y se mantiene.
    if (error.response) {
      const { status, data } = error.response;
      return { success: false, message: data.message || 'Error al actualizar el título' };
    } else if (error.request) {
      return { success: false, message: 'Error de conexión con el servidor' };
    } else {
      return { success: false, message: error.message || 'Error inesperado' };
    }
  }
}

  /**
   * Método helper para manejar errores de manera consistente
   * @private
   */
  _handleError(error, defaultMessage, errorCode) {
    if (error.response) {
      const { status, data } = error.response;
      return {
        success: false,
        message: data.message || defaultMessage,
        error: { status, code: errorCode, details: data.details || null }
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet',
        error: { code: 'NETWORK_ERROR', details: 'Sin respuesta del servidor' }
      };
    } else {
      return {
        success: false,
        message: error.message || defaultMessage,
        error: { code: 'VALIDATION_ERROR', details: error.message }
      };
    }
  }
}

export const chatService = new ChatService();