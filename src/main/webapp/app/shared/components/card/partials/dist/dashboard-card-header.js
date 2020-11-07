"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var MoreSmallListVert_1 = require("@spectrum-icons/workflow/MoreSmallListVert");
var Delete_1 = require("@spectrum-icons/workflow/Delete");
var Settings_1 = require("@spectrum-icons/workflow/Settings");
var AnchorSelect_1 = require("@spectrum-icons/workflow/AnchorSelect");
var CardHeader = function (props) {
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_spectrum_1.View, { paddingX: "size-250", paddingY: "size-100", height: "size-1200" },
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "row", gap: "size-100", justifyContent: "space-between" },
                react_1["default"].createElement(react_spectrum_1.Flex, { alignItems: "center" },
                    react_1["default"].createElement("span", { className: "spectrum-Heading spectrum-Heading--sizeXXS card-header" },
                        react_1["default"].createElement(react_spectrum_1.Text, null, props.title))),
                react_1["default"].createElement(react_spectrum_1.Flex, { alignItems: "center" },
                    react_1["default"].createElement(react_spectrum_1.MenuTrigger, null,
                        react_1["default"].createElement(react_spectrum_1.ActionButton, { marginEnd: "-15px", isQuiet: true, "aria-label": "Icon only" },
                            react_1["default"].createElement(MoreSmallListVert_1["default"], { size: "S", "aria-label": "Default Alert" })),
                        react_1["default"].createElement(react_spectrum_1.Menu, null,
                            react_1["default"].createElement(react_spectrum_1.Item, { key: "Delete", textValue: "Delete" },
                                react_1["default"].createElement(Delete_1["default"], { size: "M" }),
                                react_1["default"].createElement(react_spectrum_1.Text, null, "Delete")),
                            react_1["default"].createElement(react_spectrum_1.Item, { key: "Edit", textValue: "Edit" },
                                react_1["default"].createElement(Settings_1["default"], { size: "M" }),
                                react_1["default"].createElement(react_spectrum_1.Text, null, "Edit")),
                            react_1["default"].createElement(react_spectrum_1.Item, { key: "Release", textValue: "Release" },
                                react_1["default"].createElement(AnchorSelect_1["default"], { size: "M" }),
                                react_1["default"].createElement(react_spectrum_1.Text, null, "Release")))))),
            react_1["default"].createElement(react_spectrum_1.Flex, { alignItems: "center" },
                react_1["default"].createElement("span", { className: "pectrum-Body spectrum-Body--sizeXS card-header" },
                    react_1["default"].createElement(react_spectrum_1.Text, null, props.description))))));
};
exports["default"] = CardHeader;
