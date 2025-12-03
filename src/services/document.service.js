import { apiClient } from '../api/axios';

const documentService = {
  /**
   * Subir nuevos documentos
   * @param {FormData} formData - FormData con los archivos
   * @returns {Promise} - Respuesta del servidor
   */
  uploadDocuments: async (formData) => {
    try {
      const response = await apiClient.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener todos los documentos
   * @returns {Promise} - Lista de documentos
   */
  getAllDocuments: async () => {
    try {
      const response = await apiClient.get('/documents');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Eliminar un documento por ID
   * @param {string} id - ID del documento
   * @returns {Promise} - Respuesta del servidor
   */
  deleteDocument: async (id) => {
    try {
      const response = await apiClient.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default documentService;
