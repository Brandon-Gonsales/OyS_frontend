import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Email,
  Lock,
  Close,
  Warning,
  ArrowBack,
} from "@mui/icons-material";
import userService from "../services/userService";

const UserListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    } else {
      setCurrentUser(null);
      setFormData({ name: "", email: "", password: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await userService.updateUser(currentUser.id, formData);
      } else {
        await userService.createUser(formData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await userService.deleteUser(userToDelete.id);
        fetchUsers();
        handleCloseDeleteModal();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-dark-primary mb-2 transition-colors"
            >
              <ArrowBack className="mr-1" fontSize="small" /> Volver
            </button>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Usuarios
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
              Gestiona los usuarios de la plataforma
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-xl hover:bg-light-primary_h dark:hover:bg-dark-primary_h transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Add className="mr-2" />
            Nuevo Usuario
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-light-border dark:border-dark-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-primary dark:border-dark-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-light-border dark:border-dark-border overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Usuario
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Correo Electrónico
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Estado
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-light-primary dark:text-dark-primary font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Activo
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="p-2 text-gray-500 hover:text-light-primary dark:hover:text-dark-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(user)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Delete fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No se encontraron usuarios
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-light-border dark:border-dark-border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-light-primary dark:text-dark-primary font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Activo
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4 pl-1">
                    <Email fontSize="small" className="mr-2 opacity-75" />
                    {user.email}
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Edit fontSize="small" className="mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(user)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Delete fontSize="small" className="mr-2" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentUser ? "Editar Usuario" : "Nuevo Usuario"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <Close />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <Person
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      fontSize="small"
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary text-gray-900 dark:text-white transition-colors"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Email
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      fontSize="small"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary text-gray-900 dark:text-white transition-colors"
                      placeholder="Ej: juan@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      fontSize="small"
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary text-gray-900 dark:text-white transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-xl hover:bg-light-primary_h dark:hover:bg-dark-primary_h transition-colors shadow-lg"
                  >
                    {currentUser ? "Guardar Cambios" : "Crear Usuario"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Warning className="text-red-500 dark:text-red-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ¿Eliminar usuario?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Esta acción no se puede deshacer. El usuario{" "}
                <strong>{userToDelete?.name}</strong> será eliminado
                permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;
