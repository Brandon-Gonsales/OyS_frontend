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
export const SidebarChat = ({
  allChats,
  handleNewChat,
  handleDeleteChat,
  sidebarChatCollapsed,
  toggleChatSidebar,
  activeChatId,
  setActiveChatId,
  logo,
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
    navigate(`/chat/${chatIdParam}`);
  };

  const handleDeleteClick = (e, chatIdParam) => {
    e.stopPropagation();
    handleDeleteChat(chatIdParam);
  };
  return (
    <div
      className={`group relative z-30 bg-light-bg_h transition-all duration-300 ease-out dark:bg-dark-bg_h
			${sidebarChatCollapsed ? "w-0 lg:w-16" : "w-72 lg:w-72"} 
			${sidebarChatCollapsed ? "hidden lg:block" : "block"} 
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
                className="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-secondary shadow-md transition-all duration-200 hover:bg-light-bg hover:shadow-lg dark:bg-dark-two dark:text-dark-secondary dark:hover:text-dark-bg dark:hover:bg-dark-two_d"
                aria-label="Nuevo chat"
              >
                <EditIcon className="h-7 w-7" />
              </button>
              <button
                onClick={toggleChatSidebar}
                className="flex items-center rounded-lg bg-light-two p-1 text-sm text-light-secondary shadow-md transition-all duration-200 hover:bg-light-bg hover:shadow-lg dark:bg-dark-two dark:text-dark-secondary dark:hover:text-dark-bg dark:hover:bg-dark-two_d"
              >
                <MenuIcon className="size-7" />
              </button>
            </div>
          </div>
          <div className="px-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-light-primary dark:text-dark-bg" />
              </div>
              <input
                type="text"
                placeholder="Buscar chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent text-gray-900 dark:text-dark-bg placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto p-3">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group cursor-pointer transition-all duration-200 ${
                    chatId === chat._id ? "scale-[1.02]" : "hover:scale-[1.01]"
                  }`}
                  onClick={() => {
                    chatId !== chat._id && handleChatClick(chat._id);
                  }}
                  role="button"
                >
                  <div
                    className={`rounded-lg p-3 transition-all duration-200 ${
                      chatId === chat._id
                        ? "bg-light-bg dark:bg-dark-bg text-light-secondary shadow-md dark:text-dark-secondary"
                        : "text-light-primary hover:bg-light-bg hover:text-light-secondary dark:text-dark-primary dark:hover:bg-dark-bg"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 truncate">
                        <h3 className="truncate text-sm leading-tight font-medium">
                          {chat.title} hola ahahah hahah  hahha ahhahah
                        </h3>
                      </div>
                    </div>
                  </div>
                  {/* <button
                    onClick={(e) => handleDeleteClick(e, chat._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-light-secondary dark:text-dark-secondary hover:text-light-danger dark:hover:text-dark-danger transition-all duration-200 ml-2"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button> */}
                </div>
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
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-light-two text-sm text-light-secondary shadow-md transition-all duration-300 hover:shadow-lg dark:bg-dark-two dark:text-dark-secondary 
                hover:bg-light-bg dark:hover:text-dark-bg dark:hover:bg-dark-two_d"
              >
                <MenuIcon className="h-7 w-7" />
              </button>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-secondary shadow-md transition-all duration-200 hover:bg-light-two_d hover:shadow-lg dark:bg-dark-two dark:text-dark-secondary dark:hover:bg-dark-two_d hover:bg-light-bg dark:hover:text-dark-bg dark:hover:bg-dark-two_d"
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
