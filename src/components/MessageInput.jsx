import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { useDropzone } from "react-dropzone";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";

function MessageInput(
  {
    onSendMessage,
    loading,
    error,
    disableGlobalDrop,
    selectedAgentId,
    selectedForm,
    onChangeSelectedForm,
  },
  ref
) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const optionsRef = useRef(null);
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    addFilesFromGlobal: (newFiles) => {
      setFiles((prev) => [...prev, ...newFiles]);
    },
  }));
  // Resetear el form seleccionado cuando cambien las condiciones
  useEffect(() => {
    if (selectedAgentId !== "consolidadoFacultades" || files.length === 0) {
      onChangeSelectedForm("form1");
    }
  }, [selectedAgentId, files.length, onChangeSelectedForm]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  useEffect(() => {
    return () => {
      files.forEach((fileObj) => {
        if (fileObj.preview) URL.revokeObjectURL(fileObj.preview);
      });
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    onDropAccepted: () => setIsDragOver(false),
    onDropRejected: () => setIsDragOver(false),
    disabled: disableGlobalDrop,
  });

  const handleSend = () => {
    if (!message.trim() && files.length === 0) return;
    const filesToSend = files.map((fileObj) => fileObj.file);

    onSendMessage(message.trim(), filesToSend);

    setMessage("");
    setFiles([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const removeFile = (fileId) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
    setShowOptions(false);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const newFiles = selectedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return <ImageIcon />;
    return <InsertDriveFileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };
  // Determinar si mostrar el selector de formularios
  const showFormSelector =
    selectedAgentId === "consolidadoFacultades" && files.length > 0;
  const formOptions = [
    { value: "form1", label: "Formulario 1" },
    { value: "form2", label: "Formulario 2" },
    { value: "form3", label: "Formulario 3" },
  ];

  return (
    <div className="space-y-4 flex flex-col w-full mx-auto max-w-4xl">
      {/* Archivos cargados - Estilo Claude */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {files.map((fileObj) => (
            <div
              key={fileObj.id}
              className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Vista previa del archivo */}
              <div className="w-24 h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative">
                {fileObj.preview ? (
                  <img
                    src={fileObj.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    {getFileIcon(fileObj.file.type)}
                  </div>
                )}

                {/* Botón de eliminar */}
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Información del archivo */}
              <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                <p
                  className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate"
                  title={fileObj.file.name}
                >
                  {fileObj.file.name.length > 15
                    ? fileObj.file.name.substring(0, 12) +
                      "..." +
                      fileObj.file.name.split(".").pop()
                    : fileObj.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(fileObj.file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Selector de formularios - Solo visible cuando es necesario */}
      {showFormSelector && (
        <div className="bg-light-secondary w-fit dark:bg-dark-secondary border border-light-border dark:border-dark-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-light-bg dark:bg-dark-bg rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-light-accent dark:text-dark-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-light-primary dark:text-dark-primary">
                Selecciona el tipo de formulario
              </h3>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            {formOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-2 rounded border cursor-pointer transition-colors ${
                  selectedForm === option.value
                    ? "border-light-primary dark:border-dark-primary bg-light-secondary dark:bg-dark-secondary"
                    : "border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary"
                }`}
              >
                <input
                  type="radio"
                  name="formType"
                  value={option.value}
                  checked={selectedForm === option.value}
                  onChange={(e) => onChangeSelectedForm(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedForm === option.value
                      ? "border-light-primary dark:border-dark-primary bg-light-primary dark:bg-dark-primary"
                      : "border-light-border dark:border-dark-border"
                  }`}
                >
                  {selectedForm === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Input principal con drag & drop */}
      <div className="relative">
        <div
          {...getRootProps()}
          className={`relative border rounded-2xl transition-all duration-200 ${
            isDragActive || isDragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
              : "border-gray-300 dark:border-gray-600 bg-light-bg dark:bg-dark-bg"
          }`}
        >
          <input {...getInputProps()} />

          {/* Overlay de drag & drop */}
          {(isDragActive || isDragOver) && (
            <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-2xl flex items-center justify-center z-20">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <AttachFileIcon />
                </div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Suelta los archivos aquí
                </p>
              </div>
            </div>
          )}

          <div className="flex items-end p-3 gap-3">
            {/* Botón de opciones */}
            <div className="relative" ref={optionsRef}>
              <button
                onClick={() => setShowOptions(!showOptions)}
                disabled={loading}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  showOptions
                    ? "bg-light-secondary text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div
                  className={`transform transition-transform duration-200 ${
                    showOptions ? "rotate-45" : ""
                  }`}
                >
                  <AddIcon />
                </div>
              </button>

              {/* Menú de opciones */}
              {showOptions && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[180px] z-30">
                  <button
                    onClick={handleFileSelect}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AttachFileIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Subir archivo
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Arrastra o selecciona
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Campo de texto */}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent border-none resize-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 leading-relaxed"
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setTimeout(adjustTextareaHeight, 0);
                }}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows="1"
                style={{ minHeight: "24px", maxHeight: "120px" }}
              />
            </div>

            {/* Botón de envío */}
            <button
              onClick={handleSend}
              disabled={loading || (!message.trim() && files.length === 0)}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                (message.trim() || files.length > 0) && !loading
                  ? "bg-light-secondary hover:bg-light-secondary_h text-white shadow-md hover:shadow-lg transform hover:scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              ) : (
                <SendIcon />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        accept="*/*"
      />
    </div>
  );
}

export default MessageInput;
// // --- START OF FILE frontend/src/components/MessageInput.jsx (VERSIÓN CON IMPORTACIÓN CORREGIDA) ---

// import React, { useState, useCallback, useEffect } from 'react'; // <-- ¡LÍNEA CORREGIDA!
// import { useDropzone } from 'react-dropzone';
// import { Box, Button, IconButton, Typography, Paper, TextField } from '@mui/material';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import CloseIcon from '@mui/icons-material/Close';

// function MessageInput({ onSendMessage, loading }) {
//   const [message, setMessage] = useState('');
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);

//   const onDrop = useCallback(acceptedFiles => {
//     if (acceptedFiles.length > 0) {
//       const selectedFile = acceptedFiles[0];
//       setFile(selectedFile);
//       if (selectedFile.type.startsWith('image/')) {
//         setFilePreview(URL.createObjectURL(selectedFile));
//       } else {
//         setFilePreview(null);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (filePreview) URL.revokeObjectURL(filePreview);
//     };
//   }, [filePreview]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

//   const handleSend = () => {
//     if (!message.trim() && !file) return;
//     onSendMessage(message.trim(), file);
//     setMessage('');
//     setFile(null);
//     setFilePreview(null);
//   };

//   const removeFile = () => {
//     setFile(null);
//     setFilePreview(null);
//   };

//   return (
//     <Box>
//       {file && (
//         <Paper elevation={1} sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', bgcolor: 'action.hover' }}>
//           {filePreview ? <img src={filePreview} alt="Preview" style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }} />
//                        : <AttachFileIcon sx={{ mr: 1 }} />}
//           <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>{file.name}</Typography>
//           <IconButton size="small" onClick={removeFile}><CloseIcon fontSize="small" /></IconButton>
//         </Paper>
//       )}
//       <Box {...getRootProps()} sx={{ border: '2px dashed', borderColor: isDragActive ? 'primary.main' : 'divider', borderRadius: 2, p: 2, textAlign: 'center', cursor: 'pointer', mb: 2 }}>
//         <input {...getInputProps()} />
//         <Typography variant="body2" color="text.secondary">Arrastra un archivo o haz clic para seleccionar</Typography>
//       </Box>
//       <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
//         <TextField
//           fullWidth
//           multiline
//           maxRows={5}
//           variant="outlined"
//           placeholder="Escribe tu mensaje..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !loading) { e.preventDefault(); handleSend(); } }}
//           disabled={loading}
//           sx={{
//             '& .MuiOutlinedInput-root': {
//               borderRadius: '25px',
//               padding: '10px 14px',
//             },
//           }}
//         />
//         <Button variant="contained" onClick={handleSend} disabled={loading || (!message.trim() && !file)} sx={{ borderRadius: '25px', px: 3, height: 'fit-content', py: 1.5 }}>
//           {loading ? 'Enviando...' : 'Enviar'}
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// export default MessageInput;
// // --- END OF FILE frontend/src/components/MessageInput.jsx ---
