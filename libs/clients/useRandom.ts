const useRandom = () => {
  const createRandomString = () => {
    return `${Math.floor(Math.random() * 1000000000000000)}${Math.floor(
      Math.random() * 1000000000000000
    )}`;
  };

  return {
    createRandomString,
  };
};

export default useRandom;
