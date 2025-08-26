import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useEffect } from "react";
export const MessageList = ({ conversation, loading, onCopy }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);

  return (
    <div className="flex flex-col gap-6 text-light-two">
      {conversation.map((msg, index) => {
        const isUser = msg.sender === "user";

        return (
          <div
            key={index}
            className={`flex items-start gap-1 sm:gap-3 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div className="relative min-w-0">
              <div
                className={`relative rounded-xl p-3 md:p-4 ${
                  isUser
                    ? "w-fit rounded-tr-none bg-light-secondary dark:bg-dark-secondary"
                    : "rounded-tl-none"
                }`}
              >
                <div
                  className={`leading-relaxed ${
                    isUser
                      ? "text-light-bg"
                      : "text-light-primary dark:text-dark-primary"
                  }`}
                >
                  {isUser ? (
                    <div className="text-base sm:text-lg">{msg.text}</div>
                  ) : (
                    <div className=" overflow-hidden">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
