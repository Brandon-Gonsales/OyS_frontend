import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ChatView from "./views/ChatView";
import ProjectInfoView from "./views/ProjectInfoView";
import { apiClient, isTokenExpired } from "./api/axios";
import { chatService } from "./api/chat-api";

function AppLogic({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [allChats, setAllChats] = React.useState([]);
  const [activeChatId, setActiveChatId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showTokenExpiredDialog, setShowTokenExpiredDialog] =
    React.useState(false);
  const hasInitialized = React.useRef(false);

  // Verify token on component mount
  React.useEffect(() => {
    const checkToken = () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo.token && isTokenExpired(userInfo.token)) {
          localStorage.removeItem("userInfo");
          if (location.pathname === "/" || location.pathname === "/login") {
            logout();
            navigate("/login", { replace: true });
          } else {
            setShowTokenExpiredDialog(true);
          }
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };
    checkToken();
  }, [location.pathname, logout, navigate]);

  // Listen for token expired event
  React.useEffect(() => {
    const handleTokenExpired = () => {
      if (location.pathname === "/" || location.pathname === "/login") {
        logout();
        navigate("/login", { replace: true });
      } else {
        setShowTokenExpiredDialog(true);
      }
    };
    window.addEventListener("token-expired", handleTokenExpired);
    return () => {
      window.removeEventListener("token-expired", handleTokenExpired);
    };
  }, [location.pathname, logout, navigate]);

  const handleTokenExpiredClose = () => {
    setShowTokenExpiredDialog(false);
    logout();
    navigate("/login", { replace: true });
  };

  const handleNewChat = React.useCallback(async () => {
    try {
      const data = await chatService.createChat();
      const agent = localStorage.getItem("selectedAgentId") || "chat";
      await chatService.updateContext(data._id, agent);
      setAllChats((prev) => [data, ...prev]);
      setActiveChatId(data._id);
      navigate(`/chat/${data._id}`);
    } catch (err) {
      if (err.tokenExpired) return;
      setError("Could not create a new chat.");
    }
  }, [navigate]);

  const fetchChatsAndRedirect = React.useCallback(async () => {
    if (!user || hasInitialized.current) {
      setLoading(false);
      return;
    }

    if (user.role === "admin") {
      navigate("/users", { replace: true });
      setLoading(false);
      return;
    }

    if (user.role === "user") {
      setLoading(true);
      setError(null);
      try {
        const agent = localStorage.getItem("selectedAgentId") || "chat";
        const data = await chatService.getHistorialChatsByContext(agent);
        setAllChats(data);
        if (data.length > 0) {
          if (location.pathname === "/" || location.pathname === "/login") {
            navigate(`/chat/${data[0]._id}`, { replace: true });
          }
        } else {
          await handleNewChat();
        }
        hasInitialized.current = true;
      } catch (err) {
        if (err.tokenExpired) return;
        setError("Could not load chats.");
      } finally {
        setLoading(false);
      }
    } else {
      logout();
      navigate("/login", { replace: true });
      setLoading(false);
    }
  }, [user, navigate, handleNewChat, logout, location.pathname]);

  React.useEffect(() => {
    fetchChatsAndRedirect();
  }, [fetchChatsAndRedirect]);

  const handleDeleteChat = React.useCallback(
    async (chatIdToDelete) => {
      const originalChats = [...allChats];
      const newChats = allChats.filter((c) => c._id !== chatIdToDelete);
      setAllChats(newChats);
      if (window.location.pathname.includes(chatIdToDelete)) {
        if (newChats.length > 0) navigate(`/chat/${newChats[0]._id}`);
        else await handleNewChat();
      }
      try {
        await apiClient.delete(`/chats/${chatIdToDelete}`);
      } catch (err) {
        if (err.tokenExpired) return;
        setAllChats(originalChats);
      }
    },
    [allChats, navigate, handleNewChat]
  );

  const handleChatUpdate = (updatedChat) => {
    setAllChats((prev) =>
      prev.map((c) => (c._id === updatedChat._id ? updatedChat : c))
    );
  };

  // While loading, or if the user is an admin who will be redirected, show a loader.
  if (loading || (user && user.role === "admin")) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Dialog open={showTokenExpiredDialog} onClose={handleTokenExpiredClose}>
        <DialogTitle>Session Expired</DialogTitle>
        <DialogContent>
          <Typography>
            Your session has expired. Please log in again to continue.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleTokenExpiredClose}
            color="primary"
            variant="contained"
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      <Routes>
        {/* User-specific routes with layout */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          {/* <Route
            element={
              <Layout
                allChats={allChats}
                handleNewChat={handleNewChat}
                handleDeleteChat={handleDeleteChat}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          > */}
          <Route
            index
            element={
              allChats.length > 0 && user.role === "user" ? (
                <Navigate to={`/chat/${allChats[0]._id}`} replace />
              ) : null
            }
          />
          <Route
            path="chat/:chatId"
            element={
              <ChatView
                onChatUpdate={handleChatUpdate}
                setActiveChatId={setActiveChatId}
              />
            }
          />
          <Route path="info" element={<ProjectInfoView />} />
          {/* </Route> */}
        </Route>
        {/* Fallback route for any other case */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppLogic;
