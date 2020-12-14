"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var tabs_1 = require("@react-spectrum/tabs");
var react_redux_1 = require("react-redux");
var Dx26Modal = function (props) {
    var handleClose = function () { };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_spectrum_1.DialogContainer, { type: "fullscreenTakeover", onDismiss: handleClose },
            react_1["default"].createElement(react_spectrum_1.Dialog, null,
                react_1["default"].createElement(react_spectrum_1.Heading, null, "Profile"),
                react_1["default"].createElement(react_spectrum_1.Divider, null),
                react_1["default"].createElement(react_spectrum_1.ButtonGroup, null,
                    react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: close }, "Cancel"),
                    react_1["default"].createElement(react_spectrum_1.Button, { autoFocus: true, variant: "cta", onPress: close }, "Save")),
                react_1["default"].createElement(react_spectrum_1.Content, null,
                    react_1["default"].createElement(react_spectrum_1.Form, null,
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Name" })),
                    react_1["default"].createElement(tabs_1.Tabs, { "aria-label": "History of Ancient Rome" },
                        react_1["default"].createElement(tabs_1.Item, { title: "Founding of Rome", key: "FoR" },
                            react_1["default"].createElement(react_spectrum_1.Content, { marginTop: "size-250", marginStart: "size-125" },
                                react_1["default"].createElement(react_spectrum_1.Text, null, "Arma virumque cano, Troiae qui primus ab oris."))),
                        react_1["default"].createElement(tabs_1.Item, { title: "Monarchy and Republic", key: "MaR" },
                            react_1["default"].createElement(react_spectrum_1.Content, { marginTop: "size-250", marginStart: "size-125" },
                                react_1["default"].createElement(react_spectrum_1.Text, null, "Senatus Populusque Romanus."))),
                        react_1["default"].createElement(tabs_1.Item, { title: "Empire", key: "Emp" },
                            react_1["default"].createElement(react_spectrum_1.Content, { marginTop: "size-250", marginStart: "size-125" },
                                react_1["default"].createElement(react_spectrum_1.Text, null, "Alea jacta est.")))))))));
};
var mapStateToProps = function (storeState) { return ({}); };
var mapDispatchToProps = {};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Dx26Modal);
