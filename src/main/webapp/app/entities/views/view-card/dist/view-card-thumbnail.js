"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var placeholder_1 = require("app/shared/components/placeholder/placeholder");
var ViewCardThumbnail = function (_a) {
    var thumbnailImagePath = _a.thumbnailImagePath, viewName = _a.viewName;
    return (react_1["default"].createElement(react_spectrum_1.Flex, { alignItems: "center", justifyContent: "center", minHeight: "static-size-1700", maxHeight: "static-size-1700" }, thumbnailImagePath != null ? (react_1["default"].createElement(react_spectrum_1.Image, { src: thumbnailImagePath, alt: viewName, objectFit: "cover" })) : (react_1["default"].createElement(placeholder_1.DisplayNamePlaceholder, { displayName: viewName }))));
};
exports["default"] = ViewCardThumbnail;
