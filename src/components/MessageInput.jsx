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
import DescriptionIcon from "@mui/icons-material/Description";
import { Check, Upload } from "@mui/icons-material";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";

function MessageInput(
  {
    onSendMessage,
    loading,
    error,
    disableGlobalDrop,
    selectedAgentId,
    selectedForm,
    onChangeSelectedForm,
    onChangeCompatibilizar,
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
  const showCompatibilizar = selectedAgentId === "consolidadoFacultades";
  const showFormSelector =
    selectedAgentId === "consolidadoFacultades" && files.length > 0;
  const formOptions = [
    { value: "form1", label: "Formulario 1" },
    { value: "form2", label: "Formulario 2" },
    { value: "form3", label: "Formulario 3" },
    { value: "extra", label: "Extra" },
  ];

  const handleCompatibilizar = () => {
    onChangeCompatibilizar();
  };

  return (
    <div className="space-y-4 flex flex-col w-full mx-auto max-w-4xl">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {files.map((fileObj) => (
            <div
              key={fileObj.id}
              className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
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

                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <CloseIcon />
                </button>
              </div>

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
      {showFormSelector && (
        <div className="bg-light-bg_h dark:bg-dark-bg_h rounded-lg border border-light-border dark:border-dark-border/30 p-4 w-fit">
          <div className="flex items-center gap-2 text-xs text-light-primary dark:text-dark-primary mb-2">
            <DescriptionIcon size={12} />
            <span>Seleccionar Formulario:</span>
          </div>
          <div className="flex gap-1 md:gap-2">
            {formOptions.map((option) => (
              <button
                key={option.value + "_mini"}
                onClick={() => onChangeSelectedForm(option.value)}
                className={`px-2 py-1 text-xs rounded-md border transition-all ${
                  selectedForm === option.value
                    ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary text-light-bg dark:text-dark-primary"
                    : "border-light-border_h dark:border-dark-border_h text-light-primary_h dark:text-dark-primary_h hover:border-light-border_h dark:hover:border-dark-border_h"
                }`}
              >
                {selectedForm === option.value && (
                  <Check size={10} className="inline mr-1" strokeWidth={3} />
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
            <div className="relative" ref={optionsRef}>
              <button
                onClick={() => setShowOptions(!showOptions)}
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

              {showOptions && (
                <div className="absolute bottom-full left-0 mb-4 bg-light-bg_h dark:bg-dark-bg_h rounded-lg shadow-lg border border-light-border dark:border-dark-border overflow-hidden min-w-[200px] z-30">
                  <button
                    onClick={handleFileSelect}
                    className="w-full px-3 py-2.5 text-left hover:bg-light-bg dark:hover:bg-dark-bg flex items-center gap-2.5 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                      <Upload
                        size={14}
                        className="text-light-primary dark:text-dark-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-light-primary dark:text-dark-primary">
                        Subir archivo
                      </p>
                    </div>
                  </button>

                  {showCompatibilizar && (
                    <button
                      onClick={handleCompatibilizar}
                      type="button"
                      disabled={loading}
                      className="w-full px-3 py-2.5 text-left hover:bg-light-bg dark:hover:bg-dark-bg flex items-center gap-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                        <OfflineBoltIcon
                          size={14}
                          className="text-light-primary dark:text-dark-primary"
                        />
                      </div>
                      <div className="flex-1 flex flex-row min-w-0">
                        <p className="text-sm font-medium text-light-primary dark:text-dark-primary">
                          Compatibilizar
                        </p>
                        {loading && (
                          <div className="animate-spin rounded-full h-5 w-5 ml-3 border-b-2 border-current"></div>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

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
