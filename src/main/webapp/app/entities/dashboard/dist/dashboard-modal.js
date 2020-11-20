"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var dashboard_reducer_1 = require("./dashboard.reducer");
var react_redux_1 = require("react-redux");
var DashboardModal = function (props) {
    var dialog = react_spectrum_1.useDialogContainer();
    var dashboardEntity = props.dashboardEntity, loading = props.loading, updating = props.updating;
    var _a = react_1.useState(), dashboardName = _a[0], setDashboardNameText = _a[1];
    var _b = react_1.useState(), category = _b[0], setCategoryText = _b[1];
    var _c = react_1.useState(), description = _c[0], setDescriptionText = _c[1];
    var _d = react_1.useState(), datasource = _d[0], setDatasourceText = _d[1];
    var createDashboard = function (dashboardName, category, description, datasource) {
        alert('d');
        saveEntity({
            dashboardName: dashboardName,
            category: category,
            description: description,
            dashboardDatasource: parseInt(datasource)
        });
    };
    var saveEntity = function (values) {
        var entity = __assign(__assign({}, dashboardEntity), values);
        props.createEntity(entity);
    };
    return (react_1["default"].createElement(react_spectrum_1.Dialog, null,
        react_1["default"].createElement(react_spectrum_1.Heading, null, "Create new dashboard"),
        react_1["default"].createElement(react_spectrum_1.Divider, null),
        react_1["default"].createElement(react_spectrum_1.Content, null,
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", gap: "size-100", alignItems: "center" },
                react_1["default"].createElement(react_spectrum_1.View, { padding: "size-600" },
                    react_1["default"].createElement(react_spectrum_1.Form, { isRequired: true, necessityIndicator: "icon", width: "size-4600" },
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Dashboard name", onChange: setDashboardNameText }),
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Category", onChange: setCategoryText }),
                        react_1["default"].createElement(react_spectrum_1.TextArea, { label: "Description", onChange: setDescriptionText }),
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Datasource", onChange: setDatasourceText }))))),
        react_1["default"].createElement(react_spectrum_1.ButtonGroup, null,
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: dialog.dismiss }, "Cancel"),
            react_1["default"].createElement(react_spectrum_1.Button, { onPress: function () { return createDashboard(dashboardName, category, description, datasource); }, variant: "cta" }, "Save"))));
};
var mapStateToProps = function (storeState) { return ({
    dashboardEntity: storeState.dashboard.entity,
    loading: storeState.dashboard.loading,
    updating: storeState.dashboard.updating,
    updateSuccess: storeState.dashboard.updateSuccess
}); };
var mapDispatchToProps = {
    getEntity: dashboard_reducer_1.getEntity,
    updateEntity: dashboard_reducer_1.updateEntity,
    createEntity: dashboard_reducer_1.createEntity,
    reset: dashboard_reducer_1.reset
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(DashboardModal);
