import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { SidebarChat } from "./SidebarChat";

function Layout({
  allChats,
  handleNewChat,
  handleDeleteChat,
  darkMode,
  toggleDarkMode,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  console.log(allChats);
  return (
    <Box sx={{ display: "flex" }}>
      <SidebarChat
        allChats={allChats}
        handleNewChat={handleNewChat}
        handleDeleteChat={handleDeleteChat}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: { sm: "calc(100% - 240px)" } }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
export default Layout;
