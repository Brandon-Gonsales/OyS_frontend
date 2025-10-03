import React, { useState, useRef, useEffect } from "react";
import AssistantIcon from "@mui/icons-material/Assistant";

export const AgentSelector = ({
  collapsed = false,
  selectedAgentId = "compatibilizacionFacultades",
  onAgentChange = () => {},
  agents = [
    { id: "compatibilizacionFacultades", name: "Chat", disabled: false },
    { id: "compatibilizacion", name: "Compatibilizacion", disabled: false },
    { id: "MOF", name: "MOF", disabled: true },
    { id: "normativas", name: "Normativas", disabled: true },
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectAgent = (agentId) => {
    onAgentChange(agentId);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      <div className="relative md:hidden" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center rounded-lg bg-light-bg_h p-1 text-light-primary shadow-md transition-all hover:shadow-lg dark:bg-dark-bg_h dark:text-dark-primary hover:scale-[1.02]"
          aria-label="Seleccionar agente"
        >
          <AssistantIcon
            className={`h-6 w-6 transition-transform duration-200 ${
              isOpen ? "rotate-12" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute top-full z-50 mt-1 w-48 overflow-hidden rounded-lg bg-light-bg_h dark:bg-dark-bg_h shadow-lg ring-1 ring-light-border ring-opacity-5 dark:ring-dark-border dark:ring-opacity-10 ${
              collapsed ? "left-0" : "left-0"
            }`}
          >
            <div className="px-2 py-2 text-xs font-medium text-light-primary dark:text-dark-primary">
              Agentes
            </div>
            <div className="py-1">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => selectAgent(agent.id)}
                  className={`flex w-full items-center px-3 py-2 text-sm transition-all duration-150 text-light-primary dark:text-dark-primary ${
                    selectedAgentId === agent.id
                      ? "font-bold"
                      : "font-normal hover:font-bold"
                  }`}
                >
                  <span className="truncate">{agent.name}</span>
                  {selectedAgentId === agent.id && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-current"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:block space-y-1">
        <div className="flex items-center h-6 p-1">
          {agents.map((agent) => (
            <button
              disabled={agent.disabled}
              key={agent.id}
              onClick={() => selectAgent(agent.id)}
              className={`flex w-full items-center px-3 py-2 text-base rounded-lg transition-colors duration-150 text-light-primary dark:text-dark-primary ${
                agent.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span
                className={`truncate ${
                  selectedAgentId === agent.id
                    ? "font-bold"
                    : "font-normal text-inherit"
                }`}
              >
                {agent.name}
              </span>
              {selectedAgentId === agent.id && (
                <div className="ml-1 h-2 w-2 rounded-full bg-current"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
