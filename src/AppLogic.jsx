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
  Alert,
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

  // Verificar token al montar el componente
  React.useEffect(() => {
    const checkToken = () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (userInfo && userInfo.token) {
          if (isTokenExpired(userInfo.token)) {
            localStorage.removeItem("userInfo");

            // Si está en la ruta base, redirigir sin aviso
            if (location.pathname === "/" || location.pathname === "/login") {
              logout();
              navigate("/login", { replace: true });
            } else {
              // En otras rutas, mostrar popup
              setShowTokenExpiredDialog(true);
            }
          }
        }
      } catch (error) {
        console.error("Error al verificar token:", error);
      }
    };

    checkToken();
  }, [location.pathname, logout, navigate]);

  // Escuchar evento de token expirado
  React.useEffect(() => {
    const handleTokenExpired = () => {
      // Si está en la ruta base, redirigir sin aviso
      if (location.pathname === "/" || location.pathname === "/login") {
        logout();
        navigate("/login", { replace: true });
      } else {
        // En otras rutas, mostrar popup
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
      const { data } = await apiClient.post("/chats");
      setAllChats((prev) => [data, ...prev]);
      setActiveChatId(data._id);
      navigate(`/chat/${data._id}`);
    } catch (err) {
      if (err.tokenExpired) return;
      setError("No se pudo crear un nuevo chat.");
    }
  }, [navigate]);

  const fetchChats = React.useCallback(async () => {
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
      if (err.tokenExpired) return;
      setError("No se pudieron cargar los chats.");
    } finally {
      setLoading(false);
    }
  }, [user, navigate, handleNewChat]);

  React.useEffect(() => {
    fetchChats();
  }, [fetchChats]);

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

  return (
    <>
      {/* Dialog para token expirado */}
      <Dialog
        open={showTokenExpiredDialog}
        onClose={handleTokenExpiredClose}
        aria-labelledby="token-expired-dialog"
      >
        <DialogTitle id="token-expired-dialog">Sesión Expirada</DialogTitle>
        <DialogContent>
          <Typography>
            Tu sesión ha expirado. Por favor, inicia sesión nuevamente para
            continuar.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleTokenExpiredClose}
            color="primary"
            variant="contained"
          >
            Ir al Login
          </Button>
        </DialogActions>
      </Dialog>

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            index
            element={
              allChats.length > 0 && (
                <Navigate to={`/chat/${allChats[0]._id}`} replace />
              )
            }
          />
          <Route path="chat/:chatId" element={<ChatView />} />
        </Route>
        <Route path="info" element={<ProjectInfoView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppLogic;
// import React from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { Box, CircularProgress, Alert, Typography } from "@mui/material";
// import { useAuth } from "./context/AuthContext";

// import ProtectedRoute from "./components/ProtectedRoute";
// import Layout from "./components/Layout";
// import ChatView from "./views/ChatView";
// import ProjectInfoView from "./views/ProjectInfoView";
// import { apiClient } from "./api/axios";

// function AppLogic({ darkMode, toggleDarkMode }) {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [allChats, setAllChats] = React.useState([]);
//   const [activeChatId, setActiveChatId] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   const handleNewChat = React.useCallback(async () => {
//     try {
//       const { data } = await apiClient.post("/chats");
//       setAllChats((prev) => [data, ...prev]);
//       setActiveChatId(data._id);
//       navigate(`/chat/${data._id}`);
//     } catch (err) {
//       setError("No se pudo crear un nuevo chat.");
//     }
//   }, [navigate]);

//   const fetchChats = React.useCallback(async () => {
//     if (!user) {
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await apiClient.get("/chats");
//       setAllChats(data);
//       if (data.length > 0) {
//         if (
//           window.location.pathname === "/" ||
//           window.location.pathname === "/login"
//         ) {
//           navigate(`/chat/${data[0]._id}`, { replace: true });
//         }
//       } else {
//         await handleNewChat();
//       }
//     } catch (err) {
//       setError("No se pudieron cargar los chats.");
//     } finally {
//       setLoading(false);
//     }
//   }, [user, navigate, handleNewChat]);

//   React.useEffect(() => {
//     fetchChats();
//   }, [fetchChats]);

//   const handleDeleteChat = React.useCallback(
//     async (chatIdToDelete) => {
//       const originalChats = [...allChats];
//       const newChats = allChats.filter((c) => c._id !== chatIdToDelete);
//       setAllChats(newChats);
//       if (window.location.pathname.includes(chatIdToDelete)) {
//         if (newChats.length > 0) navigate(`/chat/${newChats[0]._id}`);
//         else await handleNewChat();
//       }
//       try {
//         await apiClient.delete(`/chats/${chatIdToDelete}`);
//       } catch {
//         setAllChats(originalChats);
//       }
//     },
//     [allChats, navigate, handleNewChat]
//   );

//   const handleChatUpdate = (updatedChat) => {
//     setAllChats((prev) =>
//       prev.map((c) => (c._id === updatedChat._id ? updatedChat : c))
//     );
//   };

//   return (
//     <Routes>
//       <Route element={<ProtectedRoute />}>
//         {/* <Route
//           path="/"
//           element={
//             <Layout
//               allChats={allChats}
//               activeChatId={activeChatId}
//               setActiveChatId={setActiveChatId}
//               handleNewChat={handleNewChat}
//               handleDeleteChat={handleDeleteChat}
//               darkMode={darkMode}
//               toggleDarkMode={toggleDarkMode}
//             />
//           }
//         > */}
//         <Route
//           index
//           element={
//             allChats.length > 0 && (
//               <Navigate to={`/chat/${allChats[0]._id}`} replace />
//             )
//           }
//         />
//         <Route path="chat/:chatId" element={<ChatView />} />
//       </Route>
//       <Route path="info" element={<ProjectInfoView />} />
//       <Route path="*" element={<Navigate to="/" replace />} />
//       {/* </Route> */}
//     </Routes>
//   );
// }
// export default AppLogic;
