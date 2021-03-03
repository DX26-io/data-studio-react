import $ from 'jquery';
import flairVisualizations from 'flair-visualizations/js/main';
import Configuration from 'flair-visualizations/js/extras/configs/configuration';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { VisualWrap } from './visualmetadata-wrapper';
const configuration = Configuration();

export const ValidateFields = fields => {
  let isValid = true;
  fields.forEach(field => {
    if (field.feature === null || undefined) {
      isValid = false;
      return isValid;
    }
  });
  return isValid;
};

export const getVisualizationData = (visual, view) => {
  if (visual.fields && ValidateFields(visual.fields)) {
    const visualMetadata = VisualWrap(visual);
    const queryDTO = visualMetadata.getQueryParameters(visual, null, null, null);
    const body = {
      queryDTO,
      visualMetadata,
      validationType: 'REQUIRED_FIELDS',
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

      if (visual.metadataVisual.name === 'Clustered Vertical Bar Chart') {
        const config = configuration.GetVerticalBarChartConfig(visual);
        const clusteredverticalBarChartObj = flairVisualizations
          .clusteredverticalbar()
          .config(config)
          .tooltip(true)
          .print(false)
          .notification(false)
          .data(metaData);
        clusteredverticalBarChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Clustered Horizontal Bar Chart') {
        const config = configuration.GetHorizontalBarChartConfig(visual);
        const clusteredhorizontalBarChartObj = flairVisualizations
          .clusteredhorizontalbar()
          .config(config)
          .tooltip(true)
          .print(false)
          .notification(false)
          .data(metaData);
        clusteredhorizontalBarChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Stacked Vertical Bar Chart') {
        const config = configuration.GetVerticalBarChartConfig(visual);
        const stackedverticalBarChartObj = flairVisualizations
          .stackedverticalbar()
          .config(config)
          .tooltip(true)
          .print(false)
          .notification(false)
          .data(metaData);
        stackedverticalBarChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Stacked Horizontal Bar Chart') {
        const config = configuration.GetHorizontalBarChartConfig(visual);
        const stackedhorizontalBarChartObj = flairVisualizations
          .stackedhorizontalbar()
          .config(config)
          .tooltip(true)
          .print(false)
          .notification(false)
          .data(metaData);
        stackedhorizontalBarChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Line Chart') {
        const config = configuration.GetLineChartConfig(visual);
        const lineChartObj = flairVisualizations.line().config(config).tooltip(true).print(false).notification(false).data(metaData);
        lineChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Combo Chart') {
        const config = configuration.GetComboChartConfig(visual);
        const comboChartObj = flairVisualizations.combo().config(config).tooltip(true).print(false).notification(false).data(metaData);
        comboChartObj(div[0]);
      }
      if (visual.metadataVisual.name === 'Pie Chart') {
        const config = configuration.GetPieChartConfig(visual);
        const pieChartObj = flairVisualizations.pie().config(config).tooltip(true).print(false).notification(false).data(metaData);
        pieChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Doughnut Chart') {
        const config = configuration.GetDoughnutChartConfig(visual);
        const doughnutChartObj = flairVisualizations
          .doughnut()
          .config(config)
          .tooltip(true)
          .print(false)
          .notification(false)
          .data(metaData);
        doughnutChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Pie Grid') {
        const config = configuration.GetPieGridChartConfig(visual);
        const pieGridChartObj = flairVisualizations.piegrid().config(config).tooltip(true).print(false).notification(false).data(metaData);
        pieGridChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Number Grid') {
        const config = configuration.GetNumberGridChartConfig(visual);
        const numberGridChartObj = flairVisualizations
          .numbergrid()
          .config(config)
          .tooltip(true)
          .print(false)
          .notification(false)
          .data(metaData);
        numberGridChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Bullet Chart') {
        const config = configuration.GetBulletChartConfig(visual);
        const bulletChartObj = flairVisualizations.bullet().config(config).tooltip(true).print(false).notification(false).data(metaData);
        bulletChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Table') {
        const config = configuration.GetTableChartConfig(visual);
        const tableChartObj = flairVisualizations.table().config(config).print(false).notification(false).data(metaData);
        tableChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Pivot Table') {
        const config = configuration.GetPivotTableChartConfig(visual);
        const pivotTableChartObj = flairVisualizations.pivot().config(config).print(false).notification(false).data(metaData);
        pivotTableChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Sankey') {
        const config = configuration.GetSankeyChartConfig(visual);
        const sankeyChartObj = flairVisualizations.sankey().config(config).tooltip(true).print(false).notification(false).data(metaData);
        sankeyChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Heat Map') {
        const config = configuration.GetHeatmapChartConfig(visual);
        const heatmapChartObj = flairVisualizations.heatmap().config(config).tooltip(true).print(false).notification(false).data(metaData);
        heatmapChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Tree Map') {
        const config = configuration.GetTreemapChartConfig(visual);
        const treemapChartObj = flairVisualizations.treemap().config(config).tooltip(true).print(false).notification(false).data(metaData);
        treemapChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Scatter plot') {
        const config = configuration.GetScatterPlotConfig(visual);
        const scatterChartObj = flairVisualizations.scatter().config(config).tooltip(true).print(false).notification(false).data(metaData);
        scatterChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'KPI') {
        const config = configuration.GetKPIConfig(visual);
        const kpiChartObj = flairVisualizations.kpi().config(config).print(false).notification(false).data(metaData);
        kpiChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Chord Diagram') {
        const config = configuration.GetChordDiagramConfig(visual);
        const chorddiagramChartObj = flairVisualizations
          .chorddiagram()
          .tooltip(true)
          .config(config)
          .print(false)
          .notification(false)
          .data(metaData);
        chorddiagramChartObj(div[0]);
      } else if (visual.metadataVisual.name === 'Info-graphic') {
        const config = configuration.GetInfoGraphicConfig(visual);
        const infographicChartObj = flairVisualizations
          .infographics()
          .tooltip(true)
          .config(config)
          .print(false)
          .notification(false)
          .data(metaData);
        infographicChartObj(div[0]);
      }
    }
  }
};
