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
var react_jhipster_1 = require("react-jhipster");
var datasources_reducer_1 = require("../datasources/datasources.reducer");
var DashboardPropertiesModal = function (props) {
    var dashboardEntity = props.dashboardEntity, updating = props.updating, updateSuccess = props.updateSuccess, datasourcesList = props.datasourcesList;
    var _a = react_1["default"].useState(false), isEdit = _a[0], setEdit = _a[1];
    var _b = react_1["default"].useState(props.dashboardName ? props.dashboardName : ''), dashboarName = _b[0], setDashboardNameText = _b[1];
    var _c = react_1["default"].useState(props.category ? props.category : ''), dashboarCategory = _c[0], setCategoryText = _c[1];
    var _d = react_1["default"].useState(props.description ? props.description : ''), dashboarDescription = _d[0], setDescriptionText = _d[1];
    var _e = react_1["default"].useState(props.datasource ? props.datasource : ''), dashboarDatasources = _e[0], setDatasourceText = _e[1];
    var dialog = react_spectrum_1.useDialogContainer();
    var getDatasourceByName = function (id) {
        var _datasource = datasourcesList.filter(function (item) {
            return item.name === id;
        });
        return _datasource[0];
    };
    var editEntity = function (values) {
        var entity = __assign(__assign({}, dashboardEntity), values);
        props.updateEntity(entity);
        dialog.dismiss();
        window.location.reload();
    };
    var updateDashboard = function (dashboardName, category, description, datasource) {
        editEntity({
            dashboardName: dashboardName,
            category: category,
            description: description,
            dashboardDatasource: getDatasourceByName(datasource)
        });
    };
    var getAllDatasource = function () {
        props.getEntities();
    };
    react_1.useEffect(function () {
        getAllDatasource();
        if (props.dashboardId) {
            props.getEntity(props.dashboardId);
        }
    }, []);
    return (react_1["default"].createElement(react_spectrum_1.Dialog, null,
        isEdit ? react_1["default"].createElement(react_spectrum_1.Heading, null,
            "Edit ",
            props.dashboardName) : react_1["default"].createElement(react_spectrum_1.Heading, null, props.dashboardName),
        react_1["default"].createElement(react_spectrum_1.Divider, null),
        react_1["default"].createElement(react_spectrum_1.Content, null,
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", gap: "size-100", alignItems: "center" },
                react_1["default"].createElement(react_spectrum_1.View, { padding: "size-600" },
                    react_1["default"].createElement(react_spectrum_1.Form, { isDisabled: !isEdit, necessityIndicator: "icon", minWidth: "size-4600" },
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Dashboard name", maxLength: 30, validationState: (dashboarName === null || dashboarName === void 0 ? void 0 : dashboarName.length) < 30 ? 'valid' : 'invalid', value: dashboarName, onChange: setDashboardNameText }),
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Category", maxLength: 30, validationState: (dashboarCategory === null || dashboarCategory === void 0 ? void 0 : dashboarCategory.length) < 30 ? 'valid' : 'invalid', onChange: setCategoryText, value: dashboarCategory }),
                        react_1["default"].createElement(react_spectrum_1.TextArea, { value: dashboarDescription, label: "Description", maxLength: 100, validationState: (dashboarDescription === null || dashboarDescription === void 0 ? void 0 : dashboarDescription.length) < 100 ? 'valid' : 'invalid', onChange: setDescriptionText }),
                        react_1["default"].createElement(react_spectrum_1.Picker, { validationState: (dashboarDatasources === null || dashboarDatasources === void 0 ? void 0 : dashboarDatasources.length) !== 0 ? 'valid' : 'invalid', label: "Datasource", selectedKey: dashboarDatasources, placeholder: "Select datasource", onSelectionChange: function (selected) { return setDatasourceText(selected.toString()); } }, datasourcesList.map(function (datasources, i) { return (react_1["default"].createElement(react_spectrum_1.Item, { key: datasources.name }, datasources.name)); })))))),
        react_1["default"].createElement(react_spectrum_1.ButtonGroup, null,
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: dialog.dismiss },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.cancelLabel" }, "Cancel")),
            !isEdit && (react_1["default"].createElement(react_spectrum_1.Button, { variant: "cta", onPress: function () {
                    setEdit(true);
                } },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.editLabel" }, "Edit"))),
            isEdit && (react_1["default"].createElement(react_spectrum_1.Button, { variant: "cta", onPress: function () { return updateDashboard(dashboarName, dashboarCategory, dashboarDescription, dashboarDatasources); } },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.save" }, "Save"))))));
};
var mapStateToProps = function (storeState) { return ({
    dashboardEntity: storeState.dashboard.entity,
    updateSuccess: storeState.dashboard.updateSuccess,
    updating: storeState.dashboard.updating,
    datasourcesList: storeState.datasources.entities
}); };
var mapDispatchToProps = { getEntity: dashboard_reducer_1.getEntity, updateEntity: dashboard_reducer_1.updateEntity, getEntities: datasources_reducer_1.getEntities };
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(DashboardPropertiesModal);
