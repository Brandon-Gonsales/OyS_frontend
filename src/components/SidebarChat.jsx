import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useParams } from "react-router-dom";
import UserProfile from "./UserProfile";
import { useAuth } from "../context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import useAppTheme from "../hooks/useAppTheme";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { ChatItem } from "./Modals";
export const SidebarChat = ({
  allChats,
  handleNewChat,
  handleDeleteChat,
  sidebarChatCollapsed,
  toggleChatSidebar,
  activeChatId,
  setActiveChatId,
  logo,
  onChatUpdated,
  onError,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { theme, darkMode, toggleDarkMode } = useAppTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredChats = allChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleChatClick = (chatIdParam) => {
    console.log("chatIdParam: ", chatIdParam);
    navigate(`/chat/${chatIdParam}`);
  };

  const handleDeleteClick = (e, chatIdParam) => {
    e.stopPropagation();
    handleDeleteChat(chatIdParam);
  };

  const handleChatDeleted = (deletedChatId) => {
    // Llamar a la función original del padre
    handleDeleteChat(deletedChatId);
  };

  const handleChatUpdated = (updatedChat) => {
    onChatUpdated(updatedChat);
  };

  return (
    <div
      className={`relative z-30 bg-light-bg_h transition-all duration-300 ease-out dark:bg-dark-bg_h
			${sidebarChatCollapsed ? "w-0 md:w-16" : "w-72 md:w-72"} 
			${sidebarChatCollapsed ? "hidden md:block" : "block"} 
			flex-shrink-0`}
    >
      {!sidebarChatCollapsed ? (
        <div className="flex h-full w-full flex-col bg-light-bg_h dark:bg-dark-bg_h">
          <div className="flex w-full items-center justify-between p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center">
                {logo && <AccountBalanceIcon className="w-9 h-9" />}
                <span
                  className={`${
                    logo && "ml-2"
                  } font-semibold text-light-primary dark:text-dark-primary`}
                >
                  Asistente OyS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                className="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-primary transition-all duration-200 hover:bg-light-two_d dark:bg-dark-two dark:text-dark-primary dark:hover:bg-dark-two_d hover:bg-light-bg dark:hover:text-dark-bg dark:hover:bg-dark-two_d"
                aria-label="Nuevo chat"
              >
                <EditIcon className="h-7 w-7" />
              </button>
              <button
                onClick={toggleChatSidebar}
                className="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-primary transition-all duration-200 hover:bg-light-two_d dark:bg-dark-two dark:text-dark-primary dark:hover:bg-dark-two_d hover:bg-light-bg dark:hover:text-dark-bg dark:hover:bg-dark-two_d"
              >
                <MenuIcon className="size-7" />
              </button>
            </div>
          </div>
          <div className="px-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-light-primary dark:text-dark-primary" />
              </div>
              <input
                type="text"
                placeholder="Buscar chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full dark:bg-dark-secondary pl-10 pr-4 py-3 border border-light-border shadow-md dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-border dark:focus:ring-dark-border focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 transition-colors text-light-primary dark:text-dark-primary"
              />
            </div>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto p-3">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <ChatItem
                  key={chat._id}
                  chat={chat}
                  isActive={chatId === chat._id}
                  onClick={() => {
                    chatId !== chat._id && handleChatClick(chat._id);
                  }}
                  onChatUpdated={onChatUpdated}
                  onChatDeleted={handleChatDeleted}
                  onError={onError}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-light-primary dark:text-dark-primary">
                  No hay chats aún
                </p>
              </div>
            )}
          </div>

          <div className="p-4 pt-0">
            <UserProfile
              userName={user.name}
              onLogout={handleLogout}
              toggleDarkMode={toggleDarkMode}
              isDarkMode={darkMode}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-between gap-3 p-3">
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center">
              {logo && (
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                  <AccountBalanceIcon className="w-9 h-9" />
                </div>
              )}
              <button
                onClick={toggleChatSidebar}
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-light-two text-sm text-light-primary shadow-md transition-all duration-300 hover:shadow-lg dark:bg-dark-two dark:text-dark-primary 
                hover:bg-light-bg dark:hover:text-dark-bg dark:hover:bg-dark-two_d"
              >
                <MenuIcon className="h-7 w-7" />
              </button>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-primary shadow-md transition-all duration-200 hover:bg-light-two_d hover:shadow-lg dark:bg-dark-two dark:text-dark-primary dark:hover:bg-dark-two_d hover:bg-light-bg dark:hover:text-dark-bg dark:hover:bg-dark-two_d"
              aria-label="Nuevo chat"
            >
              <EditIcon className="h-7 w-7" />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <UserProfile
              userName={user.name}
              onLogout={handleLogout}
              toggleDarkMode={toggleDarkMode}
              isDarkMode={darkMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};
