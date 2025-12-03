import React, { useState, useEffect, useCallback } from "react";
import {
  UploadFile,
  Delete,
  Description,
  CloudDownload,
  InsertDriveFile,
  Image,
  PictureAsPdf,
  ArrowLeft,
} from "@mui/icons-material";
import documentService from "../services/document.service";
import { ModalConfirm } from "../components/Modals";
import { alert } from "../utils/alert"; // Assuming this exists based on Modals.jsx usage
import { useNavigate } from "react-router-dom";
import DocumentSkeleton from "../components/skeletons/DocumentSkeleton";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import useAppTheme from "../hooks/useAppTheme";

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, darkMode, toggleDarkMode } = useAppTheme();

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const docs = await documentService.getAllDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("error", "Error al cargar los documentos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      "application/msword", // doc
      "text/csv",
      "application/vnd.ms-powerpoint", // ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
    ];

    const maxSize = 100 * 1024 * 1024; // 100MB

    let hasValidFiles = false;

    Array.from(files).forEach((file) => {
      // Basic validation
      if (file.size > maxSize) {
        alert("error", `El archivo ${file.name} excede el límite de 100MB.`);
        return;
      }

      // Validate file type
      if (!validTypes.includes(file.type) && file.type !== "") {
        // Check extension as fallback
        const ext = "." + file.name.split(".").pop().toLowerCase();
        const validExtensions = [
          ".pdf",
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".xlsx",
          ".xls",
          ".docx",
          ".doc",
          ".csv",
          ".ppt",
          ".pptx",
        ];
        if (!validExtensions.includes(ext)) {
          alert("error", `El archivo ${file.name} no tiene un formato válido.`);
          return;
        }
      }

      formData.append("documents", file);
      hasValidFiles = true;
    });

    if (!hasValidFiles) return;

    try {
      setUploading(true);
      await documentService.uploadDocuments(formData);
      alert("success", "Archivos subidos correctamente");
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert("error", error.message || "Error al subir los archivos");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const confirmDelete = (doc) => {
    setDocToDelete(doc);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!docToDelete) return;

    try {
      setDeleting(true);
      await documentService.deleteDocument(docToDelete._id);
      alert("success", "Documento eliminado correctamente");
      setDocuments((prev) => prev.filter((d) => d._id !== docToDelete._id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("error", "Error al eliminar el documento");
    } finally {
      setDeleteModalOpen(false);
      setDocToDelete(null);
      setDeleting(false);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(ext))
      return <Image className="w-8 h-8 text-light-accent" />;
    if (ext === "pdf")
      return <PictureAsPdf className="w-8 h-8 text-light-danger" />;
    if (["xls", "xlsx", "csv"].includes(ext))
      return <Description className="w-8 h-8 text-light-success" />;
    if (["doc", "docx"].includes(ext))
      return <Description className="w-8 h-8 text-light-secondary" />;
    return <InsertDriveFile className="w-8 h-8 text-light-primary" />;
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-dvh bg-light-bg dark:bg-dark-bg  p-8 transition-colors duration-300">
      <div className="flex flex-col items-center fixed top-5 right-5 z-50">
        <UserProfile
          userName={user?.name}
          onLogout={handleLogout}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={darkMode}
          dropdownPosition="bottom-left"
        />
      </div>
      <div className="max-w-6xl mx-auto">
        <div className=" p-8 transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
              Gestor de Documentos
            </h1>
            <button
              onClick={() => navigate("/users")}
              className="flex items-center justify-center gap-2 px-6 py-3  text-light-primary dark:text-dark-primary rounded-xl border border-light-secondary dark:border-dark-secondary transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft />
              <span className="font-medium">Volver a usuarios</span>
            </button>
          </div>
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 mb-8 transition-all duration-300 ${
              dragActive
                ? "border-light-accent bg-light-bg_h dark:bg-dark-bg_h"
                : "border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx"
            />

            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <UploadFile
                className={`w-16 h-16 mb-4 ${
                  dragActive
                    ? "text-light-accent"
                    : "text-light-secondary dark:text-dark-secondary"
                }`}
              />
              <p className="text-xl font-semibold text-light-primary dark:text-dark-primary mb-2">
                {uploading
                  ? "Subiendo archivos..."
                  : "Arrastra archivos aquí o haz clic para seleccionar"}
              </p>
              <p className="text-sm text-light-primary_h dark:text-dark-primary_h">
                PDF, Imágenes, Excel, Word, CSV, PowerPoint (Máx. 100MB)
              </p>
            </label>
          </div>

          {/* Documents Table */}
          {isLoading || documents.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
                  Documentos ({documents.length})
                </h2>
              </div>

              <div className="overflow-x-auto rounded-lg border border-light-border dark:border-dark-border">
                <table className="w-full">
                  <thead className="bg-light-bg_h dark:bg-dark-bg_h">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-light-primary_h dark:text-dark-primary_h uppercase tracking-wider">
                        Archivo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-light-primary_h dark:text-dark-primary_h uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-light-primary_h dark:text-dark-primary_h uppercase tracking-wider">
                        Tamaño
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-light-primary_h dark:text-dark-primary_h uppercase tracking-wider">
                        Subido por
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-light-primary_h dark:text-dark-primary_h uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-light-primary_h dark:text-dark-primary_h uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-light-bg dark:bg-dark-bg divide-y divide-light-border dark:divide-dark-border">
                    {isLoading ? (
                      <DocumentSkeleton count={5} />
                    ) : (
                      documents.map((doc) => (
                        <tr
                          key={doc._id}
                          className="hover:bg-light-bg_h dark:hover:bg-dark-bg_h transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getFileIcon(doc.originalName)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-light-primary dark:text-dark-primary break-all">
                              {doc.originalName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-light-primary_h dark:text-dark-primary_h">
                              {doc.size ? formatSize(doc.size) : "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-light-primary_h dark:text-dark-primary_h">
                              {doc.uploadedBy?.name || "Desconocido"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-light-primary_h dark:text-dark-primary_h">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {doc.cloudinaryUrl && (
                                <a
                                  href={doc.cloudinaryUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-light-secondary hover:bg-light-bg_h rounded-lg transition-colors"
                                  title="Descargar/Ver"
                                >
                                  <CloudDownload className="w-5 h-5" />
                                </a>
                              )}
                              <button
                                onClick={() => confirmDelete(doc)}
                                className="p-2 text-light-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Eliminar documento"
                              >
                                <Delete className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Description className="w-16 h-16 text-light-border dark:text-dark-border mx-auto mb-4" />
              <p className="text-light-primary_h dark:text-dark-primary_h text-lg">
                No hay documentos subidos aún
              </p>
              <p className="text-light-primary_h dark:text-dark-primary_h text-sm mt-2">
                Sube tus primeros documentos usando el área de arriba
              </p>
            </div>
          )}
        </div>
      </div>

      <ModalConfirm
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar documento"
        message={`¿Estás seguro de que quieres eliminar el documento "${docToDelete?.originalName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
