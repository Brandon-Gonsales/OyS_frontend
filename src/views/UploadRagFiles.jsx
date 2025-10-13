import { useState, useRef } from "react";
import { CalendarMonth, Description, Upload } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RAGFileManager() {
  const [files, setFiles] = useState([
    { id: 1, name: "documento-ejemplo.pdf", date: "2024-03-15T10:30:00" },
    { id: 2, name: "guia-usuario.docx", date: "2024-03-14T15:45:00" },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const filesWithMetadata = newFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      date: new Date().toISOString(),
    }));

    setFiles((prev) => [...filesWithMetadata, ...prev]);
  };

  const deleteFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const openDeleteModal = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-light-secondary dark:text-dark-secondary mb-2">
            Gestor de Archivos RAG
          </h1>
        </div>

        {/* Upload Area */}
        <div
          onClick={openFileDialog}
          className={`mb-8 border-3 border-dashed rounded-2xl p-8 md:p-12 transition-all cursor-pointer ${
            isDragging
              ? "border-light-border dark:border-dark-border scale-105"
              : "border-light-border dark:border-dark-border"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
          />

          <div className="flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragging
                  ? "bg-light-secondary dark:bg-dark-secondary"
                  : "bg-light-bg dark:bg-dark-bg"
              }`}
            >
              <Upload className="w-8 h-8 text-light-bg dark:text-dark-bg" />
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {isDragging
                ? "¡Suelta los archivos aquí!"
                : "Arrastra archivos o haz clic para subir"}
            </h3>
            <p className="text-slate-500 text-sm">
              Soporta: PDF, DOC, DOCX, TXT, CSV, XLSX
            </p>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">
              Archivos Subidos ({files.length})
            </h2>
          </div>

          {files.length === 0 ? (
            <div className="p-12 text-center">
              <Description className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No hay archivos subidos aún</p>
              <p className="text-slate-400 text-sm mt-1">
                Comienza subiendo tu primer documento
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Nombre del Archivo
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Fecha de Subida
                      </th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {files.map((file) => (
                      <tr
                        key={file.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <Description className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                            <span className="text-slate-800 font-medium truncate">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center text-slate-600">
                            <CalendarMonth className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">
                              {formatDate(file.date)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => openDeleteModal(file)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <DeleteIcon className="w-4 h-4 mr-1" />
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start flex-1 min-w-0 mr-3">
                        <Description className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-slate-800 font-medium truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center text-slate-500 text-sm mt-1">
                            <CalendarMonth className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                            <span>{formatDate(file.date)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openDeleteModal(file)}
                        className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-10 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-blue-500 border-dashed">
            <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-blue-600">
              Suelta para subir
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={closeDeleteModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <DeleteIcon className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">
              ¿Eliminar archivo?
            </h3>

            <p className="text-slate-600 mb-1">
              Estás por eliminar el archivo:
            </p>
            <p className="text-slate-800 font-medium mb-6 break-all">
              {fileToDelete?.name}
            </p>

            <p className="text-sm text-slate-500 mb-6">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteFile(fileToDelete.id)}
                className="flex-1 px-4 py-2.5 text-white font-medium bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
