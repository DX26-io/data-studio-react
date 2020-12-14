"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_spectrum_1 = require("@adobe/react-spectrum");
var react_grid_layout_1 = require("react-grid-layout");
require("./grid.css");
var ViewedMarkAs_1 = require("@spectrum-icons/workflow/ViewedMarkAs");
var views_reducer_1 = require("../../entities/views/views.reducer");
var Settings_1 = require("@spectrum-icons/workflow/Settings");
var Export_1 = require("@spectrum-icons/workflow/Export");
var ShareAndroid_1 = require("@spectrum-icons/workflow/ShareAndroid");
var Delete_1 = require("@spectrum-icons/workflow/Delete");
var Edit_1 = require("@spectrum-icons/workflow/Edit");
var Table_1 = require("@spectrum-icons/workflow/Table");
var MoreSmallListVert_1 = require("@spectrum-icons/workflow/MoreSmallListVert");
var secondary_header_1 = require("app/shared/layout/secondary-header/secondary-header");
var clusteredverticalbar_1 = require("flair-visualizations/js/charts/clusteredverticalbar");
var dx26_modal_1 = require("./dx26-modal");
var jquery_1 = require("jquery");
var ReactGridLayout = react_grid_layout_1.WidthProvider(react_grid_layout_1["default"]);
var visualmetadata = [
    { i: '1', x: 0, y: 0, w: 1, h: 2, minH: 2, maxH: Infinity, isBounded: true },
    { i: '2', x: 1, y: 0, w: 1, h: 2, minH: 2, maxH: Infinity, isBounded: true },
    { i: '3', x: 2, y: 0, w: 1, h: 2, minH: 2, maxH: Infinity, isBounded: true },
];
var Dx26 = function (props) {
    var _a;
    var _b = react_1["default"].useState(visualmetadata), visualmetaList = _b[0], setvisualmetadata = _b[1];
    var _c = react_1["default"].useState(''), redirect = _c[0], setRedirect = _c[1];
    var config = {
        alternateDimension: null,
        axisScaleLabel: 'Formated',
        borderColor: ['#439dd3'],
        dimension: ['order_status'],
        dimensionType: ['String'],
        displayColor: ['#439dd3'],
        displayColorExpression: [null],
        displayName: 'order_status',
        displayNameForMeasure: ['order_item_product_price'],
        fontSize: [15],
        fontStyle: ['Normal'],
        fontWeight: ['normal'],
        isFilterGrid: false,
        legendPosition: 'top',
        maxMes: 1,
        measure: ['order_item_product_price'],
        numberFormat: ['Actual'],
        showGrid: true,
        showLegend: true,
        showSorting: true,
        showValues: [false],
        showXaxis: true,
        showXaxisLabel: true,
        showYaxis: true,
        showYaxisLabel: true,
        textColor: ['#FFFFFF'],
        textColorExpression: [null],
        xAxisColor: '#676a6c',
        yAxisColor: '#676a6c'
    };
    var data = [
        { order_status: 'COMPLETE', order_item_product_price: 56740 },
        { order_status: 'PENDING_PAYMENT', order_item_product_price: 38031 },
        { order_status: 'PROCESSING', order_item_product_price: 20901 },
        { order_status: 'PENDING', order_item_product_price: 19291 },
        { order_status: 'CLOSED', order_item_product_price: 18668 },
        { order_status: 'ON_HOLD', order_item_product_price: 9373 },
        { order_status: 'SUSPECTED_FRAUD', order_item_product_price: 3878 },
        { order_status: 'CANCELED', order_item_product_price: 3519 },
        { order_status: 'PAYMENT_REVIEW', order_item_product_price: 1797 },
    ];
    var onLayoutChange = function (_visualmetaList, all) {
        var widget = jquery_1["default"]('#widget-0');
        var height = widget[0].clientHeight - 30;
        var width = widget[0].clientWidth;
        jquery_1["default"]('#chart').remove('');
        jquery_1["default"]('#widget-0').append('<div id="chart" height="' +
            height +
            '" width="' +
            width +
            '" style="width:' +
            width +
            'px; height:' +
            height +
            'px;overflow:hidden;position:relative" ></div>');
        var div = jquery_1["default"]('#chart');
        var clusteredverticalBarChartObj = clusteredverticalbar_1["default"]().config(config).tooltip(true).print(false).notification(false).data(data);
        setvisualmetadata(_visualmetaList);
        clusteredverticalBarChartObj(div[0]);
    };
    var onResize = function (_visualmetaList) {
        setvisualmetadata(_visualmetaList);
    };
    var addWidget = function () {
        visualmetadata.push({
            i: (visualmetadata.length + 1).toString(),
            x: 0,
            y: Infinity,
            w: 1,
            h: 2,
            minH: 2,
            maxH: Infinity,
            isBounded: true
        });
        setvisualmetadata(visualmetadata);
    };
    var onResizeStop = function (layout, oldItem, newItem, placeholder, e, element) {
        debugger;
    };
    react_1.useEffect(function () {
        if (props.match.params.viewId) {
            props.getViewEntity(props.match.params.viewId);
        }
    }, []);
    var generateWidge = function () {
        return visualmetadata.map(function (l, i) {
            return (react_1["default"].createElement("div", { className: "item widget", id: "widget-" + i, key: l.i },
                react_1["default"].createElement("div", { className: "header" },
                    react_1["default"].createElement(react_spectrum_1.View, null,
                        react_1["default"].createElement(react_spectrum_1.Flex, { direction: "row", justifyContent: "space-between", alignContent: "center" },
                            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", alignItems: "center", justifyContent: "space-around" },
                                react_1["default"].createElement("span", null, "clustered vertical bar chart")),
                            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", justifyContent: "space-around" },
                                react_1["default"].createElement(react_spectrum_1.MenuTrigger, null,
                                    react_1["default"].createElement(react_spectrum_1.ActionButton, { isQuiet: true, height: "size-300" },
                                        react_1["default"].createElement(Settings_1["default"], { size: 'XS', "aria-label": "Default Alert" })),
                                    react_1["default"].createElement(react_spectrum_1.Menu, { onAction: function (key) { return setRedirect(key); } },
                                        react_1["default"].createElement(react_spectrum_1.Item, { key: "Edit", textValue: "Edit" },
                                            react_1["default"].createElement(Edit_1["default"], { size: "M" }),
                                            react_1["default"].createElement(react_spectrum_1.Text, null, "Edit")),
                                        react_1["default"].createElement(react_spectrum_1.Item, { key: "Share", textValue: "Share" },
                                            react_1["default"].createElement(ShareAndroid_1["default"], { size: "M" }),
                                            react_1["default"].createElement(react_spectrum_1.Text, null, "Share")),
                                        react_1["default"].createElement(react_spectrum_1.Item, { key: "Export", textValue: "Export" },
                                            react_1["default"].createElement(Export_1["default"], { size: "M" }),
                                            react_1["default"].createElement(react_spectrum_1.Text, null, "Export")),
                                        react_1["default"].createElement(react_spectrum_1.Item, { key: "View", textValue: "View" },
                                            react_1["default"].createElement(ViewedMarkAs_1["default"], { size: "M" }),
                                            react_1["default"].createElement(react_spectrum_1.Text, null, "View")),
                                        react_1["default"].createElement(react_spectrum_1.Item, { key: "data", textValue: "data" },
                                            react_1["default"].createElement(Table_1["default"], { size: "M" }),
                                            react_1["default"].createElement(react_spectrum_1.Text, null, "Data")),
                                        react_1["default"].createElement(react_spectrum_1.Item, { key: "More", textValue: "More" },
                                            react_1["default"].createElement(MoreSmallListVert_1["default"], { size: "M" }),
                                            react_1["default"].createElement(react_spectrum_1.Text, null, "More")),
                                        react_1["default"].createElement(react_spectrum_1.Item, { key: "Delete", textValue: "Delete" },
                                            react_1["default"].createElement(Delete_1["default"], { size: "M" }),
                                            react_1["default"].createElement(react_spectrum_1.Text, null, "Delete")))),
                                redirect === 'Edit' && (react_1["default"].createElement(dx26_modal_1["default"], null)))))),
                react_1["default"].createElement("div", { id: "demo-" + i })));
        });
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(secondary_header_1["default"], { breadcrumbItems: [
                { label: 'Home', route: '/' },
                { label: 'Dashboards', route: '/dashboards' },
                { label: 'Inventory Dashboard', route: '/dashboards/d12367' },
            ], title: ((_a = props.view.viewDashboard) === null || _a === void 0 ? void 0 : _a.dashboardName) + ' ' + props.view.viewName },
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "primary", marginX: "size-150" }, "Edit"),
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: addWidget }, "Add New visualization")),
        react_1["default"].createElement(react_spectrum_1.View, null,
            react_1["default"].createElement(ReactGridLayout, { rowHeight: 120, cols: 2, onResize: onResize, layout: visualmetaList, margin: [15, 15], verticalCompact: true, onLayoutChange: onLayoutChange, onResizeStop: onResizeStop, draggableHandle: ".header", draggableCancel: ".WidgetDragCancel" }, generateWidge()))));
};
var mapStateToProps = function (storeState) { return ({
    view: storeState.views.entity,
    account: storeState.authentication.account,
    isAuthenticated: storeState.authentication.isAuthenticated
}); };
var mapDispatchToProps = { getViewEntity: views_reducer_1.getEntity };
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Dx26);
