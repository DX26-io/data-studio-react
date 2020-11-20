"use strict";
exports.__esModule = true;
require("./secondary-header.scss");
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var react_router_dom_1 = require("react-router-dom");
var SecondaryHeader = function (props) {
    return (react_1["default"].createElement(react_spectrum_1.View, { paddingX: "size-150", paddingY: "size-100", backgroundColor: "default", borderBottomWidth: 'thin', borderBottomColor: 'default' },
        react_1["default"].createElement(react_spectrum_1.Grid, { areas: ['breadcrumbs title options'], columns: ['1fr', '1fr', '1fr'], maxHeight: 'size-600' },
            react_1["default"].createElement(react_spectrum_1.Flex, { gridArea: "breadcrumbs", justifyContent: "start", alignItems: "center" },
                react_1["default"].createElement(react_spectrum_1.Breadcrumbs, { size: "M" }, props.breadcrumbItems.map(function (item) { return (react_1["default"].createElement(react_spectrum_1.Item, { key: item.key },
                    react_1["default"].createElement(react_router_dom_1.Link, { to: item.route }, item.label))); }))),
            react_1["default"].createElement(react_spectrum_1.Flex, { gridArea: "title", justifyContent: "center", alignItems: "center" },
                react_1["default"].createElement(react_spectrum_1.Heading, { level: 3, marginY: "size-0" }, props.title)),
            react_1["default"].createElement(react_spectrum_1.Flex, { gridArea: "options", justifyContent: "end", alignItems: "center" }, props.children))));
};
exports["default"] = SecondaryHeader;
