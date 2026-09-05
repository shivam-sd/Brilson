export const debounce = (func, delay = 500) => {
  let timer;

  const debouncedFunction = (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };

  debouncedFunction.cancel = () => {
    clearTimeout(timer);
  };

  return debouncedFunction;
};