import $ from 'jquery';
import flairVisualisations from 'flair-Visualisations/js/main';
import Configuration from 'flair-Visualisations/js/extras/configs/configuration';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { VisualWrap } from './visualmetadata-wrapper';
import { REQUIRED_FIELDS, VisualisationType } from 'app/shared/util/visualisation.constants';
import { getConditionExpression } from '../../filter/filter-util';

const configuration = Configuration();

export const ValidateFields = fields => {
  let isValid = true;
  fields &&
    fields.forEach(field => {
      if (!field || !field.feature) {
        isValid = false;
        return isValid;
      }
    });
  return isValid;
};
export const getVisualisationData = (visual, view, filter, offset = 0) => {
  if (visual.fields && ValidateFields(visual.fields)) {
    const visualMetadata = VisualWrap(visual);
    const queryDTO = visualMetadata.getQueryParameters(visual, filter, getConditionExpression(filter), offset);
    const body = {
      queryDTO,
      visualMetadata,
      validationType: REQUIRED_FIELDS,
      actionType: null,
      type: null,
    };
    forwardCall(view?.viewDashboard?.dashboardDatasource?.id, body, view.id);
  }
};

export const getVisualisationShareData = (visual, view, filter) => {
  if (visual.fields && ValidateFields(visual.fields)) {
    const visualMetadata = VisualWrap(visual);
    const queryDTO = visualMetadata.getQueryParameters(visual, filter, getConditionExpression(filter), 0);
    const body = {
      queryDTO,
      visualMetadata,
      validationType: REQUIRED_FIELDS,
      actionType: null,
      type: 'share-link',
    };
    forwardCall(view?.viewDashboard?.dashboardDatasource?.id, body, view.id);
  }
};

export const buildQueryDTO = (visualMetaData, filter) => {
  const viz = VisualWrap(visualMetaData);
  return viz.getQueryParameters(visualMetaData, filter, getConditionExpression([]));
};

const drawVisualisation = {
  'Clustered Vertical Bar Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetVerticalBarChartConfig(visual);
      const clusteredverticalBarChartObj = flairVisualisations
        .clusteredverticalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      clusteredverticalBarChartObj(div);
    },
  },
  'Clustered Horizontal Bar Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetHorizontalBarChartConfig(visual);
      const clusteredhorizontalBarChartObj = flairVisualisations
        .clusteredhorizontalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      clusteredhorizontalBarChartObj(div);
    },
  },
  'Stacked Vertical Bar Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetVerticalBarChartConfig(visual);
      const stackedverticalBarChartObj = flairVisualisations
        .stackedverticalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      stackedverticalBarChartObj(div);
    },
  },
  'Stacked Horizontal Bar Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetHorizontalBarChartConfig(visual);
      const stackedhorizontalBarChartObj = flairVisualisations
        .stackedhorizontalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      stackedhorizontalBarChartObj(div);
    },
  },
  'Line Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetLineChartConfig(visual);
      const lineChartObj = flairVisualisations
        .line()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      lineChartObj(div);
    },
  },
  'Combo Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetComboChartConfig(visual);
      const comboChartObj = flairVisualisations
        .combo()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      comboChartObj(div);
    },
  },
  'Pie Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetPieChartConfig(visual);
      const pieChartObj = flairVisualisations
        .pie()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      pieChartObj(div);
    },
  },
  'Doughnut Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetDoughnutChartConfig(visual);
      const doughnutChartObj = flairVisualisations
        .doughnut()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      doughnutChartObj(div);
    },
  },
  'Pie Grid': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetPieGridChartConfig(visual);
      const pieGridChartObj = flairVisualisations
        .piegrid()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      pieGridChartObj(div);
    },
  },
  'Number Grid': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetNumberGridChartConfig(visual);
      const numberGridChartObj = flairVisualisations
        .numbergrid()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      numberGridChartObj(div);
    },
  },
  'Bullet Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetBulletChartConfig(visual);
      const bulletChartObj = flairVisualisations
        .bullet()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      bulletChartObj(div);
    },
  },
  Table: {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetTableChartConfig(visual);
      const tableChartObj = flairVisualisations.table().config(config).print(false).notification(false).broadcast(broadcast).data(metaData);
      tableChartObj(div);
    },
  },
  'Pivot Table': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetPivotTableChartConfig(visual);
      const pivotTableChartObj = flairVisualisations
        .pivot()
        .config(config)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      pivotTableChartObj(div);
    },
  },
  Sankey: {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetSankeyChartConfig(visual);
      const sankeyChartObj = flairVisualisations
        .sankey()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      sankeyChartObj(div);
    },
  },
  'Heat Map': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetHeatmapChartConfig(visual);
      const heatmapChartObj = flairVisualisations
        .heatmap()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      heatmapChartObj(div);
    },
  },
  'Tree Map': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetTreemapChartConfig(visual);
      const treemapChartObj = flairVisualisations
        .treemap()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      treemapChartObj(div);
    },
  },
  'Scatter plot': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetScatterPlotConfig(visual);
      const scatterChartObj = flairVisualisations
        .scatter()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      scatterChartObj(div);
    },
  },
  KPI: {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetKPIConfig(visual);
      const kpiChartObj = flairVisualisations.kpi().config(config).print(false).notification(false).broadcast(broadcast).data(metaData);
      kpiChartObj(div);
    },
  },
  'Chord Diagram': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetChordDiagramConfig(visual);
      const chorddiagramChartObj = flairVisualisations
        .chorddiagram()
        .tooltip(true)
        .config(config)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      chorddiagramChartObj(div);
    },
  },
  'Info-graphic': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetInfoGraphicConfig(visual);
      const infographicChartObj = flairVisualisations
        .infographics()
        .tooltip(true)
        .config(config)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      infographicChartObj(div);
    },
  },
};

export const renderIframe = (item, height, widget) => {
  const iframeLink = item.properties[0].value;

  document.getElementById(`iframe-${item.id}`).setAttribute('width', (widget - 30).toString());
  document.getElementById(`iframe-${item.id}`).setAttribute('height', (height - 30).toString());
  document.getElementById(`iframe-${item.id}`).setAttribute('src', iframeLink);
};

export const renderVisualisation = (visual, metaData, element = 'widget', props = null) => {
  const widget = document.getElementById(`${element}-${visual.id}`);
  let height = widget?.clientHeight;
  const width = widget?.clientWidth;
  if (widget) {
    if (visual.metadataVisual?.name === VisualisationType.Iframe) {
      renderIframe(visual, height, width);
    } else {
      if (visual.fields && ValidateFields(visual.fields)) {
        const chartId = `chart-${element}-${visual.id}`;

        if (document.getElementById(chartId)) {
          document.getElementById(chartId).remove();
        }

        const divElement = document.createElement('div');
        if (element === 'widget') {
          height = height - 30;

          divElement.setAttribute('id', chartId);
          divElement.setAttribute('vizId', visual.id);
          divElement.setAttribute('height', height.toString());
          divElement.setAttribute('width', width.toString());
          document.getElementById(`visualisation-${visual.id}`).appendChild(divElement);
        } else {
          divElement.setAttribute('id', chartId);
          divElement.setAttribute('vizId', visual.id);
          divElement.setAttribute('height', height.toString());
          divElement.setAttribute('width', width.toString());
          document.getElementById(`visualisation-edit-${visual.id}`).appendChild(divElement);
        }

        const div = document.getElementById(chartId);

        drawVisualisation[visual.metadataVisual.name]?.drawChart(visual, metaData, div, props);
      }
    }
  }
};
