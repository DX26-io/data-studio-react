import $ from 'jquery';
import flairVisualizations from 'flair-visualizations/js/main';
import Configuration from 'flair-visualizations/js/extras/configs/configuration';
import { forwardCall } from 'app/modules/canvas/visualization/util/proxy-grpc-service';
//const configuration = Configuration();

export const renderVisualization = (visual, view) => {
  const widget = $('#widget-' + visual.id);
  const height = widget[0].clientHeight - 30;
  const width = widget[0].clientWidth;

  $('#chart-' + visual.id).remove('');

  $('#widget-' + visual.id).append(
    '<div id="chart-' +
      visual.id +
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
  const div = $('#chart-' + visual.id);
  //create querydto for getting data
  const queryDTO = visual.getQueryParameters(visual, null, null, null);

  // pass static data for now testing purpose
  const data = [
    { order_status: 'COMPLETE', order_item_subtotal: 56740, order_item_product_price: 56740 },
    { order_status: 'PENDING_PAYMENT', order_item_subtotal: 38031, order_item_product_price: 38031 },
    { order_status: 'PROCESSING', order_item_subtotal: 20901, order_item_product_price: 20901 },
    { order_status: 'PENDING', order_item_subtotal: 19291, order_item_product_price: 19291 },
    { order_status: 'CLOSED', order_item_subtotal: 18668, order_item_product_price: 18668 },
    { order_status: 'ON_HOLD', order_item_subtotal: 9373, order_item_product_price: 9373 },
    { order_status: 'SUSPECTED_FRAUD', order_item_subtotal: 3878, order_item_product_price: 3878 },
    { order_status: 'CANCELED', order_item_subtotal: 3519, order_item_product_price: 3519 },
    { order_status: 'PAYMENT_REVIEW', order_item_subtotal: 1797, order_item_product_price: 1797 },
  ];
  const _data = [
    {
      order_status: 'COMPLETE',
      product_name: 'Perfect Fitness Perfect Rip Deck',
      order_item_product_price: 8071,
      order_item_subtotal: 8071,
    },
    {
      order_status: 'COMPLETE',
      product_name: "Nike Men's CJ Elite 2 TD Football Cleat",
      order_item_product_price: 7369,
      order_item_subtotal: 7369,
    },
    {
      order_status: 'COMPLETE',
      product_name: "Nike Men's Dri-FIT Victory Golf Polo",
      order_item_product_price: 7036,
      order_item_subtotal: 7036,
    },
    {
      order_status: 'COMPLETE',
      product_name: "O'Brien Men's Neoprene Life Vest",
      order_item_product_price: 6348,
      order_item_subtotal: 6348,
    },
    {
      order_status: 'COMPLETE',
      product_name: 'Field & Stream Sportsman 16 Gun Fire Safe',
      order_item_product_price: 5645,
      order_item_subtotal: 5645,
    },
    {
      order_status: 'PENDING_PAYMENT',
      product_name: 'Perfect Fitness Perfect Rip Deck',
      order_item_product_price: 5393,
      order_item_subtotal: 5393,
    },
    { order_status: 'COMPLETE', product_name: 'Pelican Sunstream 100 Kayak', order_item_product_price: 4988, order_item_subtotal: 4988 },
    {
      order_status: 'PENDING_PAYMENT',
      product_name: "Nike Men's CJ Elite 2 TD Football Cleat",
      order_item_product_price: 4841,
      order_item_subtotal: 4841,
    },
    {
      order_status: 'PENDING_PAYMENT',
      product_name: "Nike Men's Dri-FIT Victory Golf Polo",
      order_item_product_price: 4643,
      order_item_subtotal: 4643,
    },
    {
      order_status: 'COMPLETE',
      product_name: "Diamondback Women's Serene Classic Comfort Bi",
      order_item_product_price: 4517,
      order_item_subtotal: 4517,
    },
    {
      order_status: 'PENDING_PAYMENT',
      product_name: "O'Brien Men's Neoprene Life Vest",
      order_item_product_price: 4238,
      order_item_subtotal: 4238,
    },
    {
      order_status: 'COMPLETE',
      product_name: "Nike Men's Free 5.0+ Running Shoe",
      order_item_product_price: 4004,
      order_item_subtotal: 4004,
    },
    {
      order_status: 'PENDING_PAYMENT',
      product_name: 'Field & Stream Sportsman 16 Gun Fire Safe',
      order_item_product_price: 3883,
      order_item_subtotal: 3883,
    },
    {
      order_status: 'COMPLETE',
      product_name: "Under Armour Girls' Toddler Spine Surge Runni",
      order_item_product_price: 3529,
      order_item_subtotal: 3529,
    },
    {
      order_status: 'PENDING_PAYMENT',
      product_name: 'Pelican Sunstream 100 Kayak',
      order_item_product_price: 3518,
      order_item_subtotal: 3518,
    },
    {
      order_status: 'PROCESSING',
      product_name: 'Perfect Fitness Perfect Rip Deck',
      order_item_product_price: 3014,
      order_item_subtotal: 3014,
    },
    {
      order_status: 'PENDING_PAYMENT',
      product_name: "Diamondback Women's Serene Classic Comfort Bi",
      order_item_product_price: 3011,
      order_item_subtotal: 3011,
    },
    {
      order_status: 'PENDING',
      product_name: 'Perfect Fitness Perfect Rip Deck',
      order_item_product_price: 2768,
      order_item_subtotal: 2768,
    },
    {
      order_status: 'PENDING_PAYMENT',
      product_name: "Nike Men's Free 5.0+ Running Shoe",
      order_item_product_price: 2634,
      order_item_subtotal: 2634,
    },
    {
      order_status: 'PROCESSING',
      product_name: "Nike Men's CJ Elite 2 TD Football Cleat",
      order_item_product_price: 2630,
      order_item_subtotal: 2630,
    },
  ];
  const body = {
    queryDTO: queryDTO,
    visualMetadata: visual,
    validationType: 'REQUIRED_FIELDS',
    actionType: null,
    type: visual.viewId ? null : 'share-link',
  };

  forwardCall(view?.viewDashboard?.dashboardDatasource?.id, body, view.id);

  // if (visual.field) {
  //   if (visual.metadataVisual.name === 'Clustered Vertical Bar Chart') {
  //     const config = configuration.GetVerticalBarChartConfig(visual);
  //     const clusteredverticalBarChartObj = flairVisualizations
  //       .clusteredverticalbar()
  //       .config(config)
  //       .tooltip(true)
  //       .print(false)
  //       .notification(false)
  //       .data(data);
  //     clusteredverticalBarChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Clustered Horizontal Bar Chart') {
  //     const config = configuration.GetHorizontalBarChartConfig(visual);
  //     const clusteredhorizontalBarChartObj = flairVisualizations
  //       .clusteredhorizontalbar()
  //       .config(config)
  //       .tooltip(true)
  //       .print(false)
  //       .notification(false)
  //       .data(data);
  //     clusteredhorizontalBarChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Stacked Vertical Bar Chart') {
  //     const config = configuration.GetVerticalBarChartConfig(visual);
  //     const stackedverticalBarChartObj = flairVisualizations
  //       .stackedverticalbar()
  //       .config(config)
  //       .tooltip(true)
  //       .print(false)
  //       .notification(false)
  //       .data(data);
  //     stackedverticalBarChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Stacked Horizontal Bar Chart') {
  //     const config = configuration.GetHorizontalBarChartConfig(visual);
  //     const stackedhorizontalBarChartObj = flairVisualizations
  //       .stackedhorizontalbar()
  //       .config(config)
  //       .tooltip(true)
  //       .print(false)
  //       .notification(false)
  //       .data(data);
  //     stackedhorizontalBarChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Line Chart') {
  //     const config = configuration.GetLineChartConfig(visual);
  //     const lineChartObj = flairVisualizations.line().config(config).tooltip(true).print(false).notification(false).data(data);
  //     lineChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Combo Chart') {
  //     const config = configuration.GetComboChartConfig(visual);
  //     const comboChartObj = flairVisualizations.combo().config(config).tooltip(true).print(false).notification(false).data(data);
  //     comboChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Pie Chart') {
  //     const config = configuration.GetPieChartConfig(visual);
  //     const pieChartObj = flairVisualizations.pie().config(config).tooltip(true).print(false).notification(false).data(data);
  //     pieChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Doughnut Chart') {
  //     const config = configuration.GetDoughnutChartConfig(visual);
  //     const doughnutChartObj = flairVisualizations.doughnut().config(config).tooltip(true).print(false).notification(false).data(data);
  //     doughnutChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Pie Grid') {
  //     const config = configuration.GetPieGridChartConfig(visual);
  //     const pieGridChartObj = flairVisualizations.piegrid().config(config).tooltip(true).print(false).notification(false).data(data);
  //     pieGridChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Number Grid') {
  //     const config = configuration.GetNumberGridChartConfig(visual);
  //     const numberGridChartObj = flairVisualizations.numbergrid().config(config).tooltip(true).print(false).notification(false).data(data);
  //     numberGridChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Bullet Chart') {
  //     const config = configuration.GetBulletChartConfig(visual);
  //     const bulletChartObj = flairVisualizations.bullet().config(config).tooltip(true).print(false).notification(false).data(data);
  //     bulletChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Table') {
  //     const config = configuration.GetTableChartConfig(visual);
  //     const tableChartObj = flairVisualizations.table().config(config).print(false).notification(false).data(_data);
  //     tableChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Pivot Table') {
  //     const config = configuration.GetPivotTableChartConfig(visual);
  //     const pivotTableChartObj = flairVisualizations.pivot().config(config).print(false).notification(false).data(_data);
  //     pivotTableChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Sankey') {
  //     const config = configuration.GetSankeyChartConfig(visual);
  //     const sankeyChartObj = flairVisualizations.sankey().config(config).tooltip(true).print(false).notification(false).data(data);
  //     sankeyChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Heat Map') {
  //     const config = configuration.GetHeatmapChartConfig(visual);
  //     const heatmapChartObj = flairVisualizations.heatmap().config(config).tooltip(true).print(false).notification(false).data(data);
  //     heatmapChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Tree Map') {
  //     const config = configuration.GetTreemapChartConfig(visual);
  //     const treemapChartObj = flairVisualizations.treemap().config(config).tooltip(true).print(false).notification(false).data(data);
  //     treemapChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Scatter plot') {
  //     const config = configuration.GetScatterPlotConfig(visual);
  //     const scatterChartObj = flairVisualizations.scatter().config(config).tooltip(true).print(false).notification(false).data(data);
  //     scatterChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'KPI') {
  //     const config = configuration.GetKPIConfig(visual);
  //     const kpiChartObj = flairVisualizations.kpi().config(config).print(false).notification(false).data(data);
  //     kpiChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Chord Diagram') {
  //     const config = configuration.GetChordDiagramConfig(visual);
  //     const chorddiagramChartObj = flairVisualizations
  //       .chorddiagram()
  //       .tooltip(true)
  //       .config(config)
  //       .print(false)
  //       .notification(false)
  //       .data(data);
  //     chorddiagramChartObj(div[0]);
  //   } else if (visual.metadataVisual.name === 'Info-graphic') {
  //     const config = configuration.GetInfoGraphicConfig(visual);
  //     const infographicChartObj = flairVisualizations
  //       .infographics()
  //       .tooltip(true)
  //       .config(config)
  //       .print(false)
  //       .notification(false)
  //       .data(data);
  //     infographicChartObj(div[0]);
  //   }
  // }
};
