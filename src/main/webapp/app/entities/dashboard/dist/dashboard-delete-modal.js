"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var dashboard_reducer_1 = require("./dashboard.reducer");
var react_redux_1 = require("react-redux");
var react_jhipster_1 = require("react-jhipster");
var DashboardDeleteModal = function (props) {
    var confirmDelete = function () {
        props.deleteEntity(props.dashboardId);
    };
    var dialog = react_spectrum_1.useDialogContainer();
    return (react_1["default"].createElement(react_spectrum_1.Dialog, null,
        react_1["default"].createElement(react_spectrum_1.Heading, null,
            react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.deleteDashboard" }, "Delete Dashboard")),
        react_1["default"].createElement(react_spectrum_1.Divider, null),
        react_1["default"].createElement(react_spectrum_1.Content, null,
            react_1["default"].createElement("span", null, "This will permanently delete the selected "),
            react_1["default"].createElement("span", { className: "spectrum-Heading--XS" },
                props.dashboardName,
                " "),
            react_1["default"].createElement("span", null, "dashboard. continue? ")),
        react_1["default"].createElement(react_spectrum_1.ButtonGroup, null,
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: dialog.dismiss },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.cancelLabel" }, "Cancel")),
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "negative", onPress: confirmDelete },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.delete" }, "Delete")))));
};
var mapStateToProps = function (_a) {
    var dashboard = _a.dashboard;
    return ({
        dashboardEntity: dashboard.entity,
        updateSuccess: dashboard.updateSuccess
    });
};
var mapDispatchToProps = { getEntity: dashboard_reducer_1.getEntity, deleteEntity: dashboard_reducer_1.deleteEntity };
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(DashboardDeleteModal);