import React from "react";

export const ChatSkeleton = ({
  messagesCount = 4,
  showAccordion = true,
  animated = true,
}) => {
  // Patrones de mensajes
  const messagePatterns = [
    { isUser: false, lines: 3, hasAccordion: false },
    { isUser: true, lines: 1, hasAccordion: false },
    { isUser: false, lines: 2, hasAccordion: false },
    { isUser: false, lines: 4, hasAccordion: showAccordion },
    { isUser: true, lines: 2, hasAccordion: false },
    { isUser: false, lines: 3, hasAccordion: false },
  ];

  const selectedPatterns = messagePatterns.slice(0, messagesCount);

  return (
    <div className="flex flex-col gap-6 text-light-two">
      {selectedPatterns.map((pattern, index) => (
        <React.Fragment key={index}>
          {/* Mensaje normal */}
          <div
            className={`flex w-full items-start gap-1 sm:gap-3 ${
              pattern.isUser ? "justify-end" : "justify-start"
            }`}
          >
            {!pattern.isUser && (
              <div className="hidden flex-shrink-0 items-center justify-center sm:flex">
                <div
                  className={`h-8 w-8 rounded-full bg-light-one_d dark:bg-dark-one_d ${
                    animated ? "animate-pulse" : ""
                  }`}
                />
              </div>
            )}

            <div className="relative w-full">
              <div
                className={`relative w-full rounded-xl p-3 md:p-4 ${
                  pattern.isUser
                    ? "w-fit rounded-tr-none bg-light-one_d dark:bg-dark-one_d"
                    : "rounded-tl-none bg-light-one_d dark:bg-dark-one_d"
                }`}
              >
                {/* Cola del mensaje */}
                {pattern.isUser ? (
                  <div className="absolute top-0 -right-3 h-0 w-0 rounded-tr-md border-b-[15px] border-l-[0px] border-t-transparent border-b-transparent border-l-light-one_d sm:border-l-[15px] dark:border-l-dark-one_d" />
                ) : (
                  <div className="absolute top-0 -left-3 h-0 w-0 rounded-tl-md border-r-[0px] border-b-[15px] border-t-transparent border-r-light-one_d border-b-transparent sm:border-r-[15px] dark:border-r-dark-one_d" />
                )}

                {/* Contenido skeleton */}
                <div className="space-y-2">
                  {Array.from({ length: pattern.lines }).map((_, lineIndex) => {
                    const widths = [
                      "w-full",
                      "w-3/4",
                      "w-1/2",
                      "w-5/6",
                      "w-2/3",
                    ];
                    const randomWidth =
                      widths[Math.floor(Math.random() * widths.length)];
                    return (
                      <div
                        key={lineIndex}
                        className={`h-4 rounded bg-light-one_d dark:bg-dark-one_d ${randomWidth} ${
                          animated ? "animate-pulse" : ""
                        }`}
                        style={{
                          animationDelay: `${index * 0.1 + lineIndex * 0.05}s`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {pattern.isUser && (
              <div className="hidden flex-shrink-0 items-center justify-center sm:flex">
                <div
                  className={`h-8 w-8 rounded-full bg-light-one_d dark:bg-dark-one_d ${
                    animated ? "animate-pulse" : ""
                  }`}
                />
              </div>
            )}
          </div>

          {/* Accordion skeleton */}
          {pattern.hasAccordion && (
            <div className="flex items-start justify-start gap-1 sm:gap-3">
              <div className="hidden flex-shrink-0 items-center justify-center sm:flex">
                <div
                  className={`h-8 w-8 rounded-full bg-light-one_d dark:bg-dark-one_d ${
                    animated ? "animate-pulse" : ""
                  }`}
                />
              </div>
              <div className="relative min-w-0 flex-grow">
                <div className="rounded-xl bg-light-one_d p-4 dark:bg-dark-one_d">
                  {/* Header accordion */}
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`h-5 w-24 rounded bg-light-one_d dark:bg-dark-one_d ${
                        animated ? "animate-pulse" : ""
                      }`}
                    />
                    <div
                      className={`h-4 w-4 rounded bg-light-one_d dark:bg-dark-one_d ${
                        animated ? "animate-pulse" : ""
                      }`}
                    />
                  </div>

                  {/* Contenido del accordion */}
                  <div className="space-y-4">
                    {/* Función skeleton */}
                    <div className="overflow-hidden rounded-lg border border-light-one bg-light-one_d dark:border-dark-one dark:bg-dark-one_d">
                      <div className="border-b border-light-one px-4 py-2 dark:border-dark-one">
                        <div
                          className={`h-4 w-32 rounded bg-light-one_d dark:bg-dark-one_d ${
                            animated ? "animate-pulse" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-4 p-4">
                        {/* Function Call */}
                        <div>
                          <div
                            className={`mb-2 h-3 w-16 rounded bg-light-one_d dark:bg-dark-one_d ${
                              animated ? "animate-pulse" : ""
                            }`}
                          />
                          <div className="space-y-2 rounded bg-light-one_d p-3 dark:bg-dark-one_d">
                            <div
                              className={`h-3 w-full rounded bg-light-one_d dark:bg-dark-one_d ${
                                animated ? "animate-pulse" : ""
                              }`}
                            />
                            <div
                              className={`h-3 w-3/4 rounded bg-light-one_d dark:bg-dark-one_d ${
                                animated ? "animate-pulse" : ""
                              }`}
                            />
                            <div
                              className={`h-3 w-1/2 rounded bg-light-one_d dark:bg-dark-one_d ${
                                animated ? "animate-pulse" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {/* Function Response */}
                        <div>
                          <div
                            className={`mb-2 h-3 w-20 rounded bg-light-one_d dark:bg-dark-one_d ${
                              animated ? "animate-pulse" : ""
                            }`}
                          />
                          <div className="space-y-2 rounded bg-light-one_d p-3 dark:bg-dark-one_d">
                            <div
                              className={`h-3 w-full rounded bg-light-one_d dark:bg-dark-one_d ${
                                animated ? "animate-pulse" : ""
                              }`}
                            />
                            <div
                              className={`h-3 w-5/6 rounded bg-light-one_d dark:bg-dark-one_d ${
                                animated ? "animate-pulse" : ""
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
