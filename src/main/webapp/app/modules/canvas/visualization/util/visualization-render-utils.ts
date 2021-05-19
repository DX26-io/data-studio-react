import $ from 'jquery';
import flairVisualizations from 'flair-visualizations/js/main';
import Configuration from 'flair-visualizations/js/extras/configs/configuration';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { VisualWrap } from './visualmetadata-wrapper';
import { FilterParameterService } from '../../filter/filter-parameters-service';
import { REQUIRED_FIELDS } from 'app/shared/util/visualization.constants';

const configuration = Configuration();

export const ValidateFields = fields => {
  let isValid = true;
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
    const queryDTO = visualMetadata.getQueryParameters(visual, filter, FilterParameterService.getConditionExpression(filter), 0);
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

export const renderVisualization = (visual, metaData, element = 'widget') => {
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

      drawVisualization[visual.metadataVisual.name].drawChart(visual, metaData, div);
    }
  }
};

export const buildQueryDTO = (visualMetaData, filter) => {
  const viz = VisualWrap(visualMetaData);
  return viz.getQueryParameters(visualMetaData, filter, FilterParameterService.getConditionExpression([]));
};

const drawVisualization = {
  'Clustered Vertical Bar Chart': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetVerticalBarChartConfig(visual);
      const clusteredverticalBarChartObj = flairVisualizations
        .clusteredverticalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .data(metaData);
      clusteredverticalBarChartObj(div[0]);
    },
  },
  'Clustered Horizontal Bar Chart': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetHorizontalBarChartConfig(visual);
      const clusteredhorizontalBarChartObj = flairVisualizations
        .clusteredhorizontalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .data(metaData);
      clusteredhorizontalBarChartObj(div[0]);
    },
  },
  'Stacked Vertical Bar Chart': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetVerticalBarChartConfig(visual);
      const stackedverticalBarChartObj = flairVisualizations
        .stackedverticalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .data(metaData);
      stackedverticalBarChartObj(div[0]);
    },
  },
  'Stacked Horizontal Bar Chart': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetHorizontalBarChartConfig(visual);
      const stackedhorizontalBarChartObj = flairVisualizations
        .stackedhorizontalbar()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .data(metaData);
      stackedhorizontalBarChartObj(div[0]);
    },
  },
  'Line Chart': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetLineChartConfig(visual);
      const lineChartObj = flairVisualizations.line().config(config).tooltip(true).print(false).notification(false).data(metaData);
      lineChartObj(div[0]);
    },
  },
  'Combo Chart': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetComboChartConfig(visual);
      const comboChartObj = flairVisualizations.combo().config(config).tooltip(true).print(false).notification(false).data(metaData);
      comboChartObj(div[0]);
    },
  },
  'Pie Chart': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetPieChartConfig(visual);
      const pieChartObj = flairVisualizations.pie().config(config).tooltip(true).print(false).notification(false).data(metaData);
      pieChartObj(div[0]);
    },
  },
  'Doughnut Chart': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetDoughnutChartConfig(visual);
      const doughnutChartObj = flairVisualizations.doughnut().config(config).tooltip(true).print(false).notification(false).data(metaData);
      doughnutChartObj(div[0]);
    },
  },
  'Pie Grid': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetPieGridChartConfig(visual);
      const pieGridChartObj = flairVisualizations.piegrid().config(config).tooltip(true).print(false).notification(false).data(metaData);
      pieGridChartObj(div[0]);
    },
  },
  'Number Grid': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetNumberGridChartConfig(visual);
      const numberGridChartObj = flairVisualizations
        .numbergrid()
        .config(config)
        .tooltip(true)
        .print(false)
        .notification(false)
        .data(metaData);
      numberGridChartObj(div[0]);
    },
  },
  'Bullet Chart': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetBulletChartConfig(visual);
      const bulletChartObj = flairVisualizations.bullet().config(config).tooltip(true).print(false).notification(false).data(metaData);
      bulletChartObj(div[0]);
    },
  },
  Table: {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetTableChartConfig(visual);
      const tableChartObj = flairVisualizations.table().config(config).print(false).notification(false).data(metaData);
      tableChartObj(div[0]);
    },
  },
  'Pivot Table': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetPivotTableChartConfig(visual);
      const pivotTableChartObj = flairVisualizations.pivot().config(config).print(false).notification(false).data(metaData);
      pivotTableChartObj(div[0]);
    },
  },
  Sankey: {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetSankeyChartConfig(visual);
      const sankeyChartObj = flairVisualizations.sankey().config(config).tooltip(true).print(false).notification(false).data(metaData);
      sankeyChartObj(div[0]);
    },
  },
  'Heat Map': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetHeatmapChartConfig(visual);
      const heatmapChartObj = flairVisualizations.heatmap().config(config).tooltip(true).print(false).notification(false).data(metaData);
      heatmapChartObj(div[0]);
    },
  },
  'Tree Map': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetTreemapChartConfig(visual);
      const treemapChartObj = flairVisualizations.treemap().config(config).tooltip(true).print(false).notification(false).data(metaData);
      treemapChartObj(div[0]);
    },
  },
  'Scatter plot': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetScatterPlotConfig(visual);
      const scatterChartObj = flairVisualizations.scatter().config(config).tooltip(true).print(false).notification(false).data(metaData);
      scatterChartObj(div[0]);
    },
  },
  KPI: {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetKPIConfig(visual);
      const kpiChartObj = flairVisualizations.kpi().config(config).print(false).notification(false).data(metaData);
      kpiChartObj(div[0]);
    },
  },
  'Chord Diagram': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetChordDiagramConfig(visual);
      const chorddiagramChartObj = flairVisualizations
        .chorddiagram()
        .tooltip(true)
        .config(config)
        .print(false)
        .notification(false)
        .data(metaData);
      chorddiagramChartObj(div[0]);
    },
  },
  'Info-graphic': {
    drawChart: function (visual, metaData, div) {
      const config = configuration.GetInfoGraphicConfig(visual);
      const infographicChartObj = flairVisualizations
        .infographics()
        .tooltip(true)
        .config(config)
        .print(false)
        .notification(false)
        .data(metaData);
      infographicChartObj(div[0]);
    },
  },
};
