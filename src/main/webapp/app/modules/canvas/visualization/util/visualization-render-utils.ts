import $ from 'jquery';
import flairVisualizations from 'flair-visualizations/js/main';
import Configuration from 'flair-visualizations/js/extras/configs/configuration';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { VisualWrap } from './visualmetadata-wrapper';
import { REQUIRED_FIELDS } from 'app/shared/util/visualization.constants';
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
export const getVisualizationData = (visual, view, filter) => {
  if (visual.fields && ValidateFields(visual.fields)) {
    const visualMetadata = VisualWrap(visual);
    const queryDTO = visualMetadata.getQueryParameters(visual, filter, getConditionExpression(filter), 0);
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

export const buildQueryDTO = (visualMetaData, filter) => {
  const viz = VisualWrap(visualMetaData);
  return viz.getQueryParameters(visualMetaData, filter, getConditionExpression([]));
};

const drawVisualization = {
  'Clustered Vertical Bar Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetVerticalBarChartConfig(visual);
      const clusteredverticalBarChartObj = flairVisualizations
        .clusteredverticalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      clusteredverticalBarChartObj(div[0]);
    },
  },
  'Clustered Horizontal Bar Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetHorizontalBarChartConfig(visual);
      const clusteredhorizontalBarChartObj = flairVisualizations
        .clusteredhorizontalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      clusteredhorizontalBarChartObj(div[0]);
    },
  },
  'Stacked Vertical Bar Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetVerticalBarChartConfig(visual);
      const stackedverticalBarChartObj = flairVisualizations
        .stackedverticalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      stackedverticalBarChartObj(div[0]);
    },
  },
  'Stacked Horizontal Bar Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetHorizontalBarChartConfig(visual);
      const stackedhorizontalBarChartObj = flairVisualizations
        .stackedhorizontalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      stackedhorizontalBarChartObj(div[0]);
    },
  },
  'Line Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetLineChartConfig(visual);
      const lineChartObj = flairVisualizations
        .line()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      lineChartObj(div[0]);
    },
  },
  'Combo Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetComboChartConfig(visual);
      const comboChartObj = flairVisualizations
        .combo()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      comboChartObj(div[0]);
    },
  },
  'Pie Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetPieChartConfig(visual);
      const pieChartObj = flairVisualizations
        .pie()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      pieChartObj(div[0]);
    },
  },
  'Doughnut Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetDoughnutChartConfig(visual);
      const doughnutChartObj = flairVisualizations
        .doughnut()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      doughnutChartObj(div[0]);
    },
  },
  'Pie Grid': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetPieGridChartConfig(visual);
      const pieGridChartObj = flairVisualizations
        .piegrid()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      pieGridChartObj(div[0]);
    },
  },
  'Number Grid': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetNumberGridChartConfig(visual);
      const numberGridChartObj = flairVisualizations
        .numbergrid()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      numberGridChartObj(div[0]);
    },
  },
  'Bullet Chart': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetBulletChartConfig(visual);
      const bulletChartObj = flairVisualizations
        .bullet()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      bulletChartObj(div[0]);
    },
  },
  Table: {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetTableChartConfig(visual);
      const tableChartObj = flairVisualizations.table().config(config).print(false).notification(false).broadcast(broadcast).data(metaData);
      tableChartObj(div[0]);
    },
  },
  'Pivot Table': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetPivotTableChartConfig(visual);
      const pivotTableChartObj = flairVisualizations
        .pivot()
        .config(config)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      pivotTableChartObj(div[0]);
    },
  },
  Sankey: {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetSankeyChartConfig(visual);
      const sankeyChartObj = flairVisualizations
        .sankey()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      sankeyChartObj(div[0]);
    },
  },
  'Heat Map': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetHeatmapChartConfig(visual);
      const heatmapChartObj = flairVisualizations
        .heatmap()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      heatmapChartObj(div[0]);
    },
  },
  'Tree Map': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetTreemapChartConfig(visual);
      const treemapChartObj = flairVisualizations
        .treemap()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      treemapChartObj(div[0]);
    },
  },
  'Scatter plot': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetScatterPlotConfig(visual);
      const scatterChartObj = flairVisualizations
        .scatter()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      scatterChartObj(div[0]);
    },
  },
  KPI: {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetKPIConfig(visual);
      const kpiChartObj = flairVisualizations.kpi().config(config).print(false).notification(false).broadcast(broadcast).data(metaData);
      kpiChartObj(div[0]);
    },
  },
  'Chord Diagram': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetChordDiagramConfig(visual);
      const chorddiagramChartObj = flairVisualizations
        .chorddiagram()
        .tooltip(true)
        .config(config)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      chorddiagramChartObj(div[0]);
    },
  },
  'Info-graphic': {
    drawChart(visual, metaData, div, broadcast) {
      const config = configuration.GetInfoGraphicConfig(visual);
      const infographicChartObj = flairVisualizations
        .infographics()
        .tooltip(true)
        .config(config)
        .print(false)
        .notification(false)
        .broadcast(broadcast)
        .data(metaData);
      infographicChartObj(div[0]);
    },
  },
};

export const renderVisualization = (visual, metaData, element = 'widget', props = null) => {
  if (visual.fields && ValidateFields(visual.fields)) {
    const widget = $(`#${element}-${visual.id}`);
    if (widget.length > 0) {
      let height = widget[0].clientHeight;
      const width = widget[0].clientWidth;
      const chartId = `chart-${element}-${visual.id}`;

      $('#' + chartId).remove('');
      if (element === 'widget') {
        height = height - 30;
        $('#visualization-' + visual.id).append(
          '<div id="' +
            chartId +
            '" height="' +
            height +
            '" width="' +
            width +
            '" style="width:' +
            width +
            'px; height:' +
            height +
            'px;overflow:hidden;position:relative" ></div>'
        );
      } else {
        $('#visualization-edit-' + visual.id).append(
          '<div id="' +
            chartId +
            '" height="' +
            height +
            '" width="' +
            width +
            '" style="width:' +
            width +
            'px; height:' +
            height +
            'px;overflow:hidden;position:relative" ></div>'
        );
      }

      const div = $('#' + chartId);

      drawVisualization[visual.metadataVisual.name]?.drawChart(visual, metaData, div, props);
    }
  }
};
