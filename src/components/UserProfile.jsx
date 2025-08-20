import React, { useState, useRef, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const UserProfile = ({ userName, onLogout, toggleDarkMode, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleCloseDropdown);
    return () => {
      document.removeEventListener('mousedown', handleCloseDropdown);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userInitials = getInitials(userName);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={handleToggleDropdown}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-light-accent text-light-bg font-bold transition-all duration-200 hover:bg-light-accent_h focus:outline-none focus:ring-2 focus:ring-light-accent_h focus:ring-offset-2"
          id="profile-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {userInitials}
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute bottom-14 w-56 origin-top-right divide-y divide-light-border dark:divide-dark-border rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="profile-menu-button"
        >
          <div className="" role="none">
            {/* User Info Section */}
            <div className="px-4 py-2 text-sm text-light-primary dark:text-dark-primary flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-light-secondary dark:bg-dark-secondary text-light-bg dark:text-dark-bg flex items-center justify-center font-bold">
                {userInitials}
              </div>
              <span className="font-semibold">{userName}</span>
            </div>
            
            <hr className="my-1 border-light-border dark:border-dark-border" />

            {/* Dropdown Options */}
            <button
              onClick={toggleDarkMode}
              className="group flex w-full items-center px-4 py-2 text-sm transition-colors duration-200 hover:bg-light-border hover:dar:bg-dark-border"
              role="menuitem"
            >
              {isDarkMode ? (
                <>
                  <LightModeIcon className="mr-2 h-5 w-5 text-dark-primary group-hover:text-dark-primary" />
                  Modo Claro
                </>
              ) : (
                <>
                  <DarkModeIcon className="mr-2 h-5 w-5 text-light-primary group-hover:text-light-primary_h" />
                  Modo Oscuro
                </>
              )}
            </button>
            <button
              onClick={onLogout}
              className="group flex w-full items-center px-4 py-2 text-sm text-light-primary group-hover:text-light-primary_h transition-colors duration-200 hover:bg-gray-100"
              role="menuitem"
            >
              <LogoutIcon className="mr-2 h-5 w-5" />
              Salir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;