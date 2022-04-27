const useLength = () => {
  const getStringLength = (str: string): number => {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      if (escape(str.charAt(i)).length == 6) {
        len++;
      }
      len++;
    }
    return len;
  };

  return {
    getStringLength,
  };
};

export default useLength;
