const useDiff = () => {
  /**
   * Object difference comparator.
   * @param origin Origin object.
   * @param other Other object.
   * @return {Object} Difference object.
   */
  function objectComparator(origin: any, other: any): any {
    const objectA: any = { ...origin };
    const objectB: any = { ...other };

    // Compare difference of object.
    const keys = Object.keys(objectA);
    const result = keys.reduce((accumulated, key) => {
      const isNotSame = objectA[key] !== objectB[key];
      const isNotEmptyStringA = objectA[key] !== "";
      const isNotEmptyStringB = objectB[key] !== "";
      return {
        ...accumulated,
        ...(isNotSame &&
          isNotEmptyStringA &&
          isNotEmptyStringB && { [key]: objectB[key] || objectA[key] }),
      };
    }, {});
    return Object.keys(result).length ? result : null;
  }

  return {
    objectComparator,
  };
};

export default useDiff;
