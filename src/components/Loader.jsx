export const Loader = ({ className = "" }) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <div className="h-4 w-4 animate-bounce rounded-full bg-light-secondary dark:bg-dark-two"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-light-secondary delay-200 dark:bg-dark-two"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-light-secondary delay-400 dark:bg-dark-two"></div>
    </div>
  );
};
