import $ from 'jquery';
import clusteredverticalbar from 'flair-visualizations/js/charts/clusteredverticalbar';
import configuration from 'flair-visualizations/js/extras/configs/configuration';

export const renderVisualization = visual => {
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

  const config = configuration(visual);
  // create querydto for getting data
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
  if (config) {
    const clusteredverticalBarChartObj = clusteredverticalbar().config(config).tooltip(true).print(false).notification(false).data(data);
    clusteredverticalBarChartObj(div[0]);
  }
};
