import React, { useState, useRef, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { chatService } from "../services/chat-service";
import { alert } from "../utils/alert";

const ModalConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de que quieres realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  variant = "danger", // "danger", "warning", "info"
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isLoading]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      confirmBg:
        "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
      icon: "text-red-600 dark:text-red-400",
    },
    warning: {
      confirmBg:
        "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600",
      icon: "text-yellow-600 dark:text-yellow-400",
    },
    info: {
      confirmBg:
        "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
      icon: "text-blue-600 dark:text-blue-400",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="mx-4 w-full max-w-md rounded-lg bg-light-bg p-6 shadow-xl dark:bg-dark-bg">
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${currentVariant.icon}`}>
            {variant === "danger" && <DeleteIcon className="h-6 w-6" />}
            {variant === "warning" && <EditIcon className="h-6 w-6" />}
            {variant === "info" && <EditIcon className="h-6 w-6" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary">
              {title}
            </h3>
            <p className="mt-2 text-sm text-light-primary dark:text-dark-primary">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-light-primary bg-light-two hover:bg-light-two_d dark:bg-dark-two dark:text-dark-primary dark:hover:bg-dark-two_d transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentVariant.confirmBg}`}
          >
            {isLoading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditChatModal = ({
  isOpen,
  onClose,
  onSave,
  initialTitle = "",
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, initialTitle]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && title.trim() !== initialTitle && !isLoading) {
      onSave(title.trim());
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isValid = title.trim() && title.trim() !== initialTitle;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="mx-4 w-full max-w-md rounded-lg bg-light-bg p-6 shadow-xl dark:bg-dark-bg">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <EditIcon className="h-6 w-6 text-light-primary dark:text-dark-primary" />
            <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary">
              Editar título del chat
            </h3>
          </div>

          <div className="mb-6">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ingresa el nuevo título..."
              disabled={isLoading}
              maxLength={100}
              className="w-full rounded-lg border border-light-border bg-light-bg_h px-3 py-2 text-light-primary placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-dark-border dark:bg-dark-bg_h dark:text-dark-primary dark:placeholder-gray-400 dark:focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-light-primary dark:text-dark-primary">
              {title.length}/100 caracteres
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-light-primary bg-light-two hover:bg-light-two_d dark:bg-dark-two dark:text-dark-primary dark:hover:bg-dark-two_d transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-light-bg bg-light-secondary hover:bg-light-secondary_h dark:bg-dark-secondary dark:text-dark-primary dark:hover:bg-dark-secondary_h transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatOptionsDropdown = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  chatTitle,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-8 z-50 w-48 rounded-lg bg-light-bg shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-dark-bg dark:ring-white dark:ring-opacity-10"
    >
      <div className="py-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(e);
            onClose(e);
          }}
          className="flex w-full items-center px-4 py-2 text-sm text-light-primary hover:bg-light-bg_h dark:text-dark-primary dark:hover:bg-dark-bg_h transition-colors"
        >
          <EditIcon className="mr-3 h-4 w-4" />
          Editar título
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
            onClose(e);
          }}
          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          <DeleteIcon className="mr-3 h-4 w-4" />
          Eliminar chat
        </button>
      </div>
    </div>
  );
};

const useChatActions = (onChatUpdated, onChatDeleted, onError) => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteChat = async (chatId, chatTitle) => {
    setIsLoading(true);
    try {
      const result = await chatService.deleteChat(chatId);

      if (result.success) {
        onChatDeleted(chatId);
        return { success: true };
      } else {
        onError(result.message);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = "Error inesperado al eliminar el chat";
      onError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  const updateChatTitle = async (chatId, newTitle) => {
    setIsLoading(true);
    try {
      const result = await chatService.updateChatTitle(chatId, newTitle);

      if (result.success) {
        onChatUpdated(result.updatedChat);
        return { success: true, updatedChat: result.updatedChat };
      } else {
        onError(result.message);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = "Error inesperado al actualizar el título";
      onError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteChat,
    updateChatTitle,
    isLoading,
  };
};

const ChatItem = ({
  chat,
  isActive,
  onClick,
  onChatUpdated,
  onChatDeleted,
  onError,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { deleteChat, updateChatTitle, isLoading } = useChatActions(
    onChatUpdated,
    onChatDeleted,
    onError
  );

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const result = await deleteChat(chat._id, chat.title);
    if (result.success) {
      setShowDeleteModal(false);
      alert("success", "Chat eliminado correctamente");
    } else {
      alert("error", "Error al eliminar");
    }
  };

  const handleSaveEdit = async (newTitle) => {
    const result = await updateChatTitle(chat._id, newTitle);
    if (result.success) {
      setShowEditModal(false);
      alert("success", "Chat actualizado correctamente");
    } else {
      alert("error", "Error al actualizar");
    }
  };

  return (
    <>
      <div
        className={`group cursor-pointer transition-all duration-200 ${
          isActive ? "scale-[1.02]" : ""
        }`}
        onClick={onClick}
        role="button"
      >
        <div
          className={`rounded-lg p-2 transition-all duration-200 ${
            isActive
              ? "bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary"
              : "text-light-primary hover:bg-light-bg hover:text-light-secondary dark:text-dark-primary dark:hover:bg-dark-bg"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 truncate">
              <h3 className="truncate text-sm leading-tight font-medium">
                {chat.title}
              </h3>
            </div>
            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleOptionsClick}
                disabled={isLoading}
                className="flex items-center justify-center w-6 h-6 rounded hover:bg-light-two_d dark:hover:bg-dark-two_d transition-colors disabled:opacity-50"
                aria-label="Opciones del chat"
              >
                <MoreVertIcon className="h-4 w-4" />
              </button>

              <ChatOptionsDropdown
                isOpen={dropdownOpen}
                onClose={() => setDropdownOpen(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                chatTitle={chat.title}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalConfirm
        isOpen={showDeleteModal}
        onClose={() => !isLoading && setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar chat"
        message={`¿Estás seguro de que quieres eliminar el chat "${chat.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isLoading}
        variant="danger"
      />

      <EditChatModal
        isOpen={showEditModal}
        onClose={() => !isLoading && setShowEditModal(false)}
        onSave={handleSaveEdit}
        initialTitle={chat.title}
        isLoading={isLoading}
      />
    </>
  );
};

export {
  ModalConfirm,
  EditChatModal,
  ChatOptionsDropdown,
  ChatItem,
  useChatActions,
};
