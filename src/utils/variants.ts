export const buttonVariants = {
  primary: {
    base: 'text-white bg-blue-600 hover:bg-blue-700',
    disabled: 'bg-blue-600 text-white opacity-50 cursor-not-allowed pointer-events-none',
  },
  secondary: {
    base: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    disabled:
      'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white opacity-50 cursor-not-allowed pointer-events-none',
  },
  danger: {
    base: 'text-white bg-red-600 hover:bg-red-700',
    disabled: 'bg-red-600 text-white opacity-50 cursor-not-allowed pointer-events-none',
  },
  outline: {
    base: 'border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800',
    disabled:
      'border border-blue-400 text-blue-400 opacity-50 cursor-not-allowed pointer-events-none',
  },
  ghost: {
    base: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800',
    disabled: 'text-blue-400 opacity-50 cursor-not-allowed pointer-events-none',
  },
};
