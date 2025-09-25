import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Iconos de Material-UI
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import UserProfile from "./UserProfile";
import { useAuth } from "../context/AuthContext";

function Sidebar({
  allChats,
  handleNewChat,
  handleDeleteChat,
  activeChatId,
  setActiveChatId,
  toggleDarkMode,
  darkMode,
}) {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const { user, logout } = useAuth();

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredChats = allChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chatIdParam) => {
    navigate(`/chat/${chatIdParam}`);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleDeleteClick = (e, chatIdParam) => {
    e.stopPropagation();
    handleDeleteChat(chatIdParam);
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div
        className={`
        fixed md:static inset-y-0 left-0 z-50 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        transition-transform duration-300 ease-in-out
        w-80 bg-light-bg dark:bg-dark-bg border-r border-light-border dark:border-dark-border
        flex flex-col h-screen
      `}
      >
        <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-gray-700">
          <h1 className="text-lg font-semibold text-light-primary dark:text-dark-primary truncate">
            Modelo de Asistencia OyS
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-light-secondary_h dark:hover:bg-dark-secondary_h transition-colors group"
          >
            <MenuIcon className="w-5 h-5 text-light-secondary dark:text-dark-secondary group-hover:text-light-bg group-hover:dark:text-dark-bg" />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex justify-center items-center gap-3 px-4 py-3 bg-light-secondary hover:bg-light-secondary_h text-light-bg rounded-xl transition-all duration-200 hover:shadow-md group"
          >
            <AddIcon className="w-5 h-5" />
            <span className="font-medium">Nuevo Chat</span>
          </button>
        </div>

        <div className="px-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-light-border" />
            </div>
            <input
              type="text"
              placeholder="Buscar chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat._id}
                className={`group relative flex items-center justify-between py-1 px-3 rounded-md cursor-pointer transition-all duration-200 ${
                  chatId === chat._id
                    ? "bg-light-border"
                    : "hover:shadow-sm hover:bg-light-border"
                }`}
                onClick={() => handleChatClick(chat._id)}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      chatId === chat._id
                        ? "text-light-primary dark:text-dark-primary"
                        : "text-light-primary dark:text-dark-primar"
                    }`}
                  >
                    {chat.title}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDeleteClick(e, chat._id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-light-secondary dark:text-dark-secondary hover:text-light-danger dark:hover:text-dark-danger transition-all duration-200 ml-2"
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {searchTerm
                  ? "No se encontraron chats"
                  : "No hay chats disponibles"}
              </p>
            </div>
          )}
        </div>

        <div className="p-4">
          <UserProfile
            userName={"Jose"}
            onLogout={handleLogout}
            toggleDarkMode={toggleDarkMode}
            isDarkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
