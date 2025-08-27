import { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "../components/Loader";
import MessageInput from "../components/MessageInput";
import { SidebarChat } from "../components/SidebarChat";
import apiClient from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import { ChatSkeleton } from "../components/skeletons/chatSkeleton";
import { MessageList } from "../components/MessageList";
import { AgentSelector } from "../components/AgentSelector";
import chatService from "../services/chat-service";

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
  const [selectedAgentId, setSelectedAgentId] = useState("2");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

    try {
      let chatAfterFileUpload = currentChat;

      if (files && files.length > 0) {
        if (!currentChat.activeContext) {
          throw new Error(
            "El contexto activo del chat no está definido. No se puede subir el archivo."
          );
        }

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
        console.log("fileResponse", fileResponse);
        chatAfterFileUpload = fileResponse.updatedChat;
        setCurrentChat(chatAfterFileUpload);
        handleChatUpdate(chatAfterFileUpload);
      }

      if (userText.trim()) {
        console.log("userText", userText);
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
        console.log("data", data);
        setCurrentChat(data.updatedChat);
        handleChatUpdate(data.updatedChat);
      }
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
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

  // Error state

  return (
    <div className="h-screen w-full overflow-hidden bg-light-bg dark:bg-dark-bg">
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
          <div className="relative h-full flex-1 overflow-hidden" >
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

                  {/* <div ref={chatEndRef}></div> */}
                </div>
              </div>

              {/* Input Area */}
              <div className="w-full px-1 pb-2 md:px-6 lg:mb-0">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  loading={loadingSendMessage}
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
