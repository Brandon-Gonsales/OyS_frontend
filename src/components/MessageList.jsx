import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useEffect } from "react";
export const MessageList = ({ conversation, loading, onCopy }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);
  const SmartToyIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-1.5 2.5H9c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1z" />
    </svg>
  );

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
            {/* {!isUser && (
              <div className="hidden flex-shrink-0 items-center justify-center sm:flex">
                <SmartToyIcon className="w-8 h-8" />
              </div>
            )} */}

            <div className="relative min-w-0">
              <div
                className={`relative rounded-xl p-3 md:p-4 ${
                  isUser
                    ? "w-fit rounded-tr-none bg-light-secondary dark:bg-dark-secondary"
                    : "rounded-tl-none"
                }`}
              >
                {/* {isUser ? (
                  <div className="absolute top-0 -right-3 h-0 w-0 rounded-tr-md border-b-[15px] border-l-[0px] border-t-transparent border-b-transparent border-l-light-two sm:border-l-[15px] dark:border-l-dark-two"></div>
                ) : (
                  <div className="absolute top-0 -left-3 h-0 w-0 rounded-tl-md border-r-[0px] border-b-[15px] border-t-transparent border-r-light-one_d border-b-transparent sm:border-r-[15px] dark:border-r-dark-one_d"></div>
                )} */}

                <div
                  className={`leading-relaxed ${
                    isUser
                      ? "text-light-bg dark:text-dark-bg"
                      : "text-light-primary dark:text-dark-primary"
                  }`}
                >
                  {isUser ? (
                    <div className="text-base sm:text-lg">{msg.text}</div>
                  ) : (
                    <div>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* {isUser && (
              <div className="hidden flex-shrink-0 items-center justify-center sm:flex">
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <img
                    src="/images/avatars/panda.webp"
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )} */}
          </div>
        );
      })}
    </div>
  );
};
