export const getDefaultColorset = () => {
  return []; //colorset;
};

export const getNames = arr => {
  arr = arr.sort(function (a, b) {
    return a.order - b.order;
  });
  return arr.map(function (item) {
    if (item.feature.name) return item.feature.name;
    else return item.feature.definition;
  });
};

export const getTypes = arr => {
  return arr.map(function (item) {
    return item.feature.type;
  });
};
