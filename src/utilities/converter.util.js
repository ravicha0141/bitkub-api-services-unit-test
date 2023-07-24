module.exports = {
  getArraySize: async (list, key) => {
    let newArray = [];
    list.forEach((element) => {
      newArray.push(element[`${key}`]);
    });
    return newArray;
  },
};
