"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var error_boundary_route_1 = require("app/shared/error/error-boundary-route");
var visualizations_1 = require("./visualizations");
var Routes = function (_a) {
    var match = _a.match;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_router_dom_1.Switch, null,
            react_1["default"].createElement(error_boundary_route_1["default"], { path: match.url, component: visualizations_1["default"] }))));
};
exports["default"] = Routes;
