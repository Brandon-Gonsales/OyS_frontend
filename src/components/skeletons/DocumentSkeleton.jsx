import React from "react";

const DocumentSkeleton = ({ count = 5 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <tr
          key={index}
          className="animate-pulse border-b border-light-border dark:border-dark-border last:border-0"
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default DocumentSkeleton;
