"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var dashboard_reducer_1 = require("./dashboard.reducer");
var react_redux_1 = require("react-redux");
var DashboardPropertiesModal = function (props) {
    var confirmDelete = function () {
        props.deleteEntity(props.dashboardId);
    };
    var dialog = react_spectrum_1.useDialogContainer();
    return (react_1["default"].createElement(react_spectrum_1.Dialog, null,
        react_1["default"].createElement(react_spectrum_1.Heading, null, props.dashboardName),
        react_1["default"].createElement(react_spectrum_1.Divider, null),
        react_1["default"].createElement(react_spectrum_1.Content, null,
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", gap: "size-100", alignItems: "center" },
                react_1["default"].createElement(react_spectrum_1.View, { padding: "size-600" },
                    react_1["default"].createElement(react_spectrum_1.Form, { isReadOnly: true, isRequired: true, necessityIndicator: "icon", width: "size-4600" },
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Dashboard name", defaultValue: props.dashboardName }),
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Category", defaultValue: props.category }),
                        react_1["default"].createElement(react_spectrum_1.TextArea, { label: "Description", defaultValue: props.description }),
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Datasource", defaultValue: props.datasource }))))),
        react_1["default"].createElement(react_spectrum_1.ButtonGroup, null,
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: dialog.dismiss }, "Cancel"),
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "cta", onPress: confirmDelete }, "Edit"))));
};
var mapStateToProps = function (_a) {
    var dashboard = _a.dashboard;
    return ({
        dashboardEntity: dashboard.entity,
        updateSuccess: dashboard.updateSuccess
    });
};
var mapDispatchToProps = { getEntity: dashboard_reducer_1.getEntity, deleteEntity: dashboard_reducer_1.deleteEntity };
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(DashboardPropertiesModal);
