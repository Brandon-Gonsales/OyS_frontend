import { useRef, useEffect } from "react";

// Componente skeleton para un mensaje individual
const MessageSkeleton = ({ isUser }) => {
  return (
    <div
      className={`flex items-start gap-1 sm:gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="relative min-w-0">
        <div
          className={`relative rounded-xl p-3 md:p-4 ${
            isUser
              ? "w-fit rounded-tr-none bg-light-bg_h dark:bg-dark-bg_h"
              : "rounded-tl-none"
          }`}
        >
          <div
            className={`leading-relaxed animate-pulse ${
              isUser
                ? "text-light-bg_h dark:text-dark-bg_h"
                : "text-light-primary dark:text-dark-primary"
            }`}
          >
            {isUser ? (
              // Skeleton para mensaje de usuario
              <div className="text-base sm:text-lg">
                <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded w-32 sm:w-48 mb-1"></div>
                {Math.random() > 0.5 && (
                  <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded w-20 sm:w-32"></div>
                )}
              </div>
            ) : (
              // Skeleton para mensaje del bot
              <div>
                <div className="space-y-3 w-[200px]">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full max-w-md"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 max-w-sm"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5 max-w-lg"></div>

                  {/* Simular párrafos adicionales ocasionalmente */}
                  {Math.random() > 0.4 && (
                    <div className="space-y-2 mt-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 max-w-xs"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 max-w-sm"></div>
                      {Math.random() > 0.7 && (
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 max-w-xs"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del skeleton de chat
export const ChatSkeleton = ({ messageCount = 6 }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Generar array de mensajes alternando usuario/bot
  const generateMessages = (count) => {
    const messages = [];
    for (let i = 0; i < count; i++) {
      // Empezar con usuario (índice par = usuario, impar = bot)
      messages.push({
        id: i,
        isUser: i % 2 === 0,
      });
    }
    return messages;
  };

  const skeletonMessages = generateMessages(messageCount);

  return (
    <div className="flex flex-col gap-6 text-light-two">
      {skeletonMessages.map((msg) => (
        <MessageSkeleton key={msg.id} isUser={msg.isUser} />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};
