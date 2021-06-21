let visualMetadataContainerList = [];

export const VisualMetadataContainerGetOne = (id: string) => {
  return visualMetadataContainerList.filter(function (item) {
    return item.id === id;
  })[0];
};

export const visualMetadataContainerAdd = (widget: any) => {
  if (widget.constructor === Array) {
    const widgetCont = widget.map(function (item) {
      item.visualBuildId = item.visualBuildId || item.id;
      return item;
    });

    visualMetadataContainerList = visualMetadataContainerList.concat(widgetCont);
  } else {
    const w = widget;
    w.visualBuildId = w.visualBuildId || w.id;
    visualMetadataContainerList.push(w);
  }
  return visualMetadataContainerList;
};

export const visualMetadataContainerRemove = (widget: string) => {
  const index = visualMetadataContainerList.findIndex(x => x.id === widget);
  if (index > -1) {
    visualMetadataContainerList.splice(index, 1);
  }
  return visualMetadataContainerList;
};

const addConfigs = (widgetNew: any, widgetOld: any) => {
  Object.keys(widgetNew).forEach(function (key, index) {
    if (key !== '$promise' && key !== '$resolved') {
      widgetOld[key] = widgetNew[key];
    }
  });
};

export const visualMetadataContainerUpdate = (id: string, widget: any, key: string) => {
  let index = -1;
  visualMetadataContainerList.some(function (item, i) {
    return item[key] === id ? (index = i) : false;
  });
  if (key === 'id') {
    Object.keys(widget).forEach(function (item) {
      if (visualMetadataContainerList[index][item]) {
        visualMetadataContainerList[index][item] = widget[item];
      }
    });
  } else {
    const w = widget;
    w.visualBuildId = w.visualBuildId || w.id;
    addConfigs(w, visualMetadataContainerList[index]);
  }
  return visualMetadataContainerList;
};
