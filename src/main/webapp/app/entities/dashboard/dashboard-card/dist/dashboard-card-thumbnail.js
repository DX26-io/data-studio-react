"use strict";
exports.__esModule = true;
require("./dashboard-card-thumbnail.scss");
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var placeholder_1 = require("app/shared/components/placeholder/placeholder");
var DashboardCardThumbnail = function (_a) {
    var thumbnailImagePath = _a.thumbnailImagePath, dashboardName = _a.dashboardName, dashboardId = _a.dashboardId;
    return (react_1["default"].createElement("a", { href: '/views?viewDashboard=' + dashboardId + '&page=1&sort=id,asc', className: 'thumbnail' },
        react_1["default"].createElement(react_spectrum_1.Flex, { alignItems: "center", justifyContent: "center", minHeight: "static-size-1700", maxHeight: "static-size-1700" }, thumbnailImagePath != null ? (react_1["default"].createElement(react_spectrum_1.Image, { src: thumbnailImagePath, alt: dashboardName, objectFit: "cover" })) : (react_1["default"].createElement(placeholder_1.DisplayNamePlaceholder, { displayName: dashboardName })))));
};
exports["default"] = DashboardCardThumbnail;
