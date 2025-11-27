import React from 'react';

const UserSkeleton = ({ type = 'table', count = 5 }) => {
  const renderTableRowSkeleton = () => (
    <>
      {[...Array(count)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="ml-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right">
            <div className="flex justify-end gap-2">
              <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );

  const renderCardSkeleton = () => (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="rounded-2xl shadow-lg border border-light-border dark:border-dark-border/20 p-4 animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      ))}
    </>
  );

  if (type === 'table') {
    return renderTableRowSkeleton();
  } else if (type === 'card') {
    return renderCardSkeleton();
  }
  return null;
};

export default UserSkeleton;
