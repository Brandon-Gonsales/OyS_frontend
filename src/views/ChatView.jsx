import { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "../components/Loader";
import MessageInput from "../components/MessageInput";
import { SidebarChat } from "../components/SidebarChat";
import apiClient from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import { ChatSkeleton } from "../components/skeletons/chatSkeleton";
import { MessageList } from "../components/MessageList";
import { AgentSelector } from "../components/AgentSelector";
import { alert } from "../utils/alert";
import { useDropzone } from "react-dropzone";
import AttachFileIcon from "@mui/icons-material/AttachFile";

function ChatView() {
  const { chatId } = useParams();
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);
  const [error, setError] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  //let chatEndRef = useRef(null);
  const [sidebarChatCollapsed, setSidebarChatCollapsed] = useState(false);
  const [allChats, setAllChats] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAgentId, setSelectedAgentId] = useState(
    "compatibilizacionFacultades"
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isDragOverGlobal, setIsDragOverGlobal] = useState(false);
  const [globalFiles, setGlobalFiles] = useState([]);
  const messageInputRef = useRef(null);
  const [selectedForm, setSelectedForm] = useState("form1");

  const fetchChat = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get(`/chats/${chatId}`);
      setCurrentChat(data);
    } catch (err) {
      setError("No se pudo cargar la conversación.");
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  const handleChatUpdate = (updatedChat) => {
    setAllChats((prev) =>
      prev.map((c) => (c._id === updatedChat._id ? updatedChat : c))
    );
  };

  const handleSendMessage = async (userText, files) => {
    if (!currentChat || (!userText.trim() && (!files || files.length === 0)))
      return;
    setLoadingSendMessage(true);
    setError(null);
    // console.log("allChats", allChats);
    // console.log("current chat", currentChat);
    const userMessage = {
      sender: "user",
      text: userText,
      timestamp: new Date().toISOString(),
      error: false,
      tempId: Date.now(), // ID temporal para identificar el mensaje
    };
    let aiMessage = null;
    if (userText.trim()) {
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
      };
      setCurrentChat(updatedChat);
    }

    try {
      let chatAfterFileUpload = currentChat;
      if (files && files.length > 0) {
        if (!currentChat.activeContext) {
          throw new Error(
            "El contexto activo del chat no está definido. No se puede subir el archivo."
          );
        }
        if (selectedForm && selectedAgentId === "consolidadoFacultades") {
          const formData = new FormData();
          for (const file of files) {
            formData.append("files", file);
          }
          formData.append("chatId", currentChat._id);
          formData.append("documentType", currentChat.activeContext);
          formData.append("formType", selectedForm);
          const { data: fileResponse } = await apiClient.post(
            "/extract-json",
            formData
          );
          //console.log("fileResponse extract-sjon", fileResponse);
          chatAfterFileUpload = fileResponse.updatedChat;
          setCurrentChat(chatAfterFileUpload);
          handleChatUpdate(chatAfterFileUpload);
        } else {
          const formData = new FormData();
          for (const file of files) {
            formData.append("files", file);
          }
          formData.append("chatId", currentChat._id);
          formData.append("documentType", currentChat.activeContext);
          const { data: fileResponse } = await apiClient.post(
            "/process-document",
            formData
          );
          //console.log("fileResponse chat normal", fileResponse);
          chatAfterFileUpload = fileResponse.updatedChat;
          setCurrentChat(chatAfterFileUpload);
          handleChatUpdate(chatAfterFileUpload);
        }
      }
      if (userText.trim()) {
        // console.log("userText", userText);
        const historyForApi = [
          ...chatAfterFileUpload.messages,
          { sender: "user", text: userText },
        ].map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

        const { data } = await apiClient.post("/chat", {
          conversationHistory: historyForApi,
          documentId: chatAfterFileUpload.documentId,
          chatId: chatAfterFileUpload._id,
        });
        //console.log("data", data);
        setCurrentChat(data.updatedChat);
        handleChatUpdate(data.updatedChat);
      }
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
      alert("error", "ocurrio un error inesperado, intente de nuevo");
    } finally {
      setLoadingSendMessage(false);
    }
  };

  const toggleChatSidebar = () => {
    setSidebarChatCollapsed(!sidebarChatCollapsed);
  };

  const handleNewChat = useCallback(async () => {
    try {
      const { data } = await apiClient.post("/chats");
      setAllChats((prev) => [data, ...prev]);
      setActiveChatId(data._id);
      navigate(`/chat/${data._id}`);
    } catch (err) {
      setError("No se pudo crear un nuevo chat.");
    }
  }, [navigate]);

  const fetchChats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get("/chats");
      setAllChats(data);
      if (data.length > 0) {
        if (
          window.location.pathname === "/" ||
          window.location.pathname === "/login"
        ) {
          navigate(`/chat/${data[0]._id}`, { replace: true });
        }
      } else {
        await handleNewChat();
      }
    } catch (err) {
      setError("No se pudieron cargar los chats.");
    } finally {
      setLoading(false);
    }
  }, [user, navigate, handleNewChat]);

  const handleAgentChange = (agentId) => {
    setSelectedAgentId(agentId);
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleDeleteChat = useCallback(
    (chatIdToDelete) => {
      // Eliminar el chat de la lista allChats
      const newChats = allChats.filter((c) => c._id !== chatIdToDelete);
      setAllChats(newChats);

      // Si estamos en el chat que se está eliminando, navegar a otro
      if (window.location.pathname.includes(chatIdToDelete)) {
        handleNewChat();
      }
    },
    [allChats, navigate, handleNewChat]
  );

  const handleChatUpdated = useCallback(
    (updatedChat) => {
      // Actualizar el chat en la lista allChats
      setAllChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        )
      );

      // Si es el chat actual, actualizarlo también
      if (currentChat && currentChat._id === updatedChat._id) {
        setCurrentChat(updatedChat);
      }
    },
    [currentChat]
  );

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  //functions para cargar archivos
  const onGlobalDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      }));

      // Pasar los archivos al MessageInput
      if (messageInputRef.current) {
        messageInputRef.current.addFilesFromGlobal(newFiles);
      }
    }
  }, []);

  // Configurar dropzone global
  const {
    getRootProps: getGlobalRootProps,
    getInputProps: getGlobalInputProps,
    isDragActive: isGlobalDragActive,
  } = useDropzone({
    onDrop: onGlobalDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setIsDragOverGlobal(true),
    onDragLeave: (e) => {
      // Solo ocultar si realmente salimos del área completa
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsDragOverGlobal(false);
      }
    },
    onDropAccepted: () => setIsDragOverGlobal(false),
    onDropRejected: () => setIsDragOverGlobal(false),
  });
  //console.log("currentChat", currentChat._id);
  const onChangeSelectedForm = (typeForm) => {
    setSelectedForm(typeForm);
  };

  const handleCompatibilizar = async () => {
    try {
      //window.alert("compatibilizar");
      console.log("currentChat en handleCompatibilizar:", currentChat);
      setLoadingSendMessage(true);
      const { data: generateReportResponse } = await apiClient.post(
        "/generate-report",
        {
          chatId: currentChat._id,
        }
      );
      //console.log("generateReportResponse", generateReportResponse);
      setCurrentChat(generateReportResponse.updatedChat);
      handleChatUpdate(generateReportResponse.updatedChat);
    } catch (err) {
      setError(`Error: ${err}`);
      alert("error", "ocurrio un error inesperado, intente de nuevo");
    } finally {
      setLoadingSendMessage(false);
    }
  };
  // Error state

  return (
    <div
      {...getGlobalRootProps()}
      className="h-screen w-full overflow-hidden bg-light-bg dark:bg-dark-bg relative"
    >
      <input {...getGlobalInputProps()} />

      {/* Overlay global de drag & drop */}
      {(isGlobalDragActive || isDragOverGlobal) && (
        <div className="fixed inset-0 bg-blue-500/20 backdrop-blur-sm border-4 border-dashed border-blue-500 flex items-center justify-center z-50">
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <AttachFileIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Suelta los archivos aquí
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Los archivos se agregarán al mensaje
            </p>
          </div>
        </div>
      )}
      <div className="relative flex h-full w-full">
        {/* overlaysideabr */}
        {!sidebarChatCollapsed && (
          <div
            className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={toggleChatSidebar}
          ></div>
        )}

        <SidebarChat
          allChats={allChats}
          handleNewChat={handleNewChat}
          handleDeleteChat={handleDeleteChat}
          toggleChatSidebar={toggleChatSidebar}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          sidebarChatCollapsed={sidebarChatCollapsed}
          logo={null}
          onChatUpdated={handleChatUpdated}
          onError={handleError}
        />
        <div className="relative flex h-full flex-1 overflow-hidden">
          {/* Chat Section */}
          <div className="relative h-full flex-1 overflow-hidden">
            <div className="flex h-full w-full flex-col">
              {/* Header chat mobile */}
              <div className="flex w-full items-center justify-between bg-light-bg px-4 py-3 dark:bg-dark-bg">
                <div className="flex items-center gap-2">
                  <AgentSelector
                    selectedAgentId={selectedAgentId}
                    onAgentChange={handleAgentChange}
                  />
                  <button
                    onClick={handleNewChat}
                    className="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-primary transition-all duration-200 hover:bg-light-two_d dark:bg-dark-two dark:text-dark-primary dark:hover:bg-dark-two_d hover:bg-light-bg dark:hover:text-dark-bg dark:hover:bg-dark-two_d md:hidden"
                    aria-label="Nuevo chat"
                  >
                    <EditIcon className="h-6 w-6" />
                  </button>
                </div>

                <button
                  onClick={toggleChatSidebar}
                  className="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-primary transition-all duration-200 hover:bg-light-two_d dark:bg-dark-two dark:text-dark-primary dark:hover:bg-dark-two_d hover:bg-light-bg dark:hover:text-dark-bg dark:hover:bg-dark-two_d md:hidden"
                >
                  <MenuIcon className="h-6 w-6 " />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-6 scroll-smooth">
                <div className="mx-auto max-w-4xl space-y-6">
                  {currentChat?.messages.length === 0 && (
                    <div className="flex flex-col items-center py-12 text-center md:py-20">
                      <h3 className="mb-3 text-xl font-bold text-light-two md:text-2xl dark:text-dark-primary">
                        ¡Hola! ¿En qué puedo ayudarte?
                      </h3>
                      <p className="max-w-md text-base text-light-two md:text-lg dark:text-dark-primary">
                        Vamos! Inicia una conversación
                      </p>
                    </div>
                  )}

                  {!currentChat || (allChats.length === 0 && loading) ? (
                    <ChatSkeleton messagesCount={4} />
                  ) : (
                    <MessageList
                      conversation={currentChat?.messages}
                      loading={loading}
                      onCopy={() => setSnackbarOpen(true)}
                    />
                  )}

                  {loadingSendMessage && (
                    <div className="flex items-start justify-start">
                      <div className="relative min-w-0">
                        <div className="relative rounded-xl rounded-tl-none ">
                          <Loader />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="w-full px-1 pb-2 md:px-6 lg:mb-0">
                <MessageInput
                  // onSendMessage={handleSendMessage}
                  // loading={loadingSendMessage}
                  // error={error}
                  ref={messageInputRef}
                  onSendMessage={handleSendMessage}
                  loading={loadingSendMessage}
                  error={error}
                  disableGlobalDrop={isGlobalDragActive || isDragOverGlobal}
                  selectedAgentId={selectedAgentId}
                  selectedForm={selectedForm}
                  onChangeSelectedForm={onChangeSelectedForm}
                  onChangeCompatibilizar={handleCompatibilizar}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
