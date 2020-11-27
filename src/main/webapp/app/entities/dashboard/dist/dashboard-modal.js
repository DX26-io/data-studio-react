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
var datasources_reducer_1 = require("../datasources/datasources.reducer");
var react_redux_1 = require("react-redux");
var react_jhipster_1 = require("react-jhipster");
var react_router_dom_1 = require("react-router-dom");
var DashboardModal = function (props) {
    var dialog = react_spectrum_1.useDialogContainer();
    var dashboardEntity = props.dashboardEntity, loading = props.loading, updating = props.updating, datasourcesList = props.datasourcesList;
    var _a = react_1["default"].useState(false), isOpen = _a[0], setOpen = _a[1];
    var _b = react_1["default"].useState(''), dashboardId = _b[0], setDashboardId = _b[1];
    var _c = react_1["default"].useState(''), dashboarName = _c[0], setDashboardNameText = _c[1];
    var _d = react_1["default"].useState(''), dashboarCategory = _d[0], setCategoryText = _d[1];
    var _e = react_1["default"].useState(''), dashboarDescription = _e[0], setDescriptionText = _e[1];
    var _f = react_1["default"].useState(''), dashboarDatasources = _f[0], setDatasourceText = _f[1];
    var _g = react_1["default"].useState(false), isError = _g[0], setErrorOpen = _g[1];
    var _h = react_1["default"].useState(''), errorMessage = _h[0], setErrorMessage = _h[1];
    var history = react_router_dom_1.useHistory();
    var getDatasourceByName = function (id) {
        var _datasource = datasourcesList.filter(function (item) {
            return item.name === id;
        });
        return _datasource[0];
    };
    var saveEntity = function (values) {
        var entity = __assign(__assign({}, dashboardEntity), values);
        new Promise(function (resolve) {
            resolve(props.createEntity(entity));
        })
            .then(function (data) {
            if (data['value'].status === 201) {
                setDashboardId(data['value'].data.id);
                setOpen(true);
            }
        })["catch"](function (error) {
            if (error.response.data.message === 'uniqueError') {
                setErrorMessage(react_jhipster_1.translate('dashboard.uniqueError'));
            }
            else {
                setErrorMessage(react_jhipster_1.translate('dashboard.errorSaving'));
            }
            setErrorOpen(true);
        });
    };
    var createDashboard = function (dashboardName, category, description, datasource) {
        saveEntity({
            dashboardName: dashboardName,
            category: category,
            description: description,
            dashboardDatasource: getDatasourceByName(datasource)
        });
    };
    var getAllDatasource = function () {
        props.getEntities();
    };
    var alertClose = function () {
        setOpen(false);
        dialog.dismiss();
    };
    var alertOpen = function () {
        setOpen(false);
        dialog.dismiss();
        history.push('/views?viewDashboard=' + dashboardId);
    };
    react_1.useEffect(function () {
        getAllDatasource();
    }, []);
    return (react_1["default"].createElement(react_spectrum_1.Dialog, null,
        react_1["default"].createElement(react_spectrum_1.Heading, null,
            react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.createNewDashboard" }, "Create new dashboard")),
        react_1["default"].createElement(react_spectrum_1.Divider, null),
        react_1["default"].createElement(react_spectrum_1.Content, null,
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", gap: "size-100", alignItems: "center" },
                react_1["default"].createElement(react_spectrum_1.DialogContainer, __assign({ onDismiss: function () { return setOpen(false); } }, props), isOpen && (react_1["default"].createElement(react_spectrum_1.AlertDialog, { title: "Success", onPrimaryAction: alertOpen, onCancel: alertClose, variant: "confirmation", cancelLabel: "Close", primaryActionLabel: "Open" }, "Created view successfully"))),
                react_1["default"].createElement(react_spectrum_1.DialogContainer, __assign({ onDismiss: function () { return setErrorOpen(false); } }, props), isError && (react_1["default"].createElement(react_spectrum_1.AlertDialog, { title: "Error", variant: "destructive", primaryActionLabel: "Close" }, errorMessage))),
                react_1["default"].createElement(react_spectrum_1.View, { padding: "size-600" },
                    react_1["default"].createElement(react_spectrum_1.Form, { isRequired: true, necessityIndicator: "icon", minWidth: "size-4600" },
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Dashboard name", maxLength: 30, validationState: (dashboarName === null || dashboarName === void 0 ? void 0 : dashboarName.length) < 30 ? 'valid' : 'invalid', onChange: setDashboardNameText }),
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "Category", maxLength: 30, validationState: (dashboarCategory === null || dashboarCategory === void 0 ? void 0 : dashboarCategory.length) < 30 ? 'valid' : 'invalid', onChange: setCategoryText }),
                        react_1["default"].createElement(react_spectrum_1.TextArea, { label: "Description", maxLength: 100, validationState: (dashboarDescription === null || dashboarDescription === void 0 ? void 0 : dashboarDescription.length) < 100 ? 'valid' : 'invalid', onChange: setDescriptionText }),
                        react_1["default"].createElement(react_spectrum_1.Picker, { validationState: (dashboarDatasources === null || dashboarDatasources === void 0 ? void 0 : dashboarDatasources.length) !== 0 ? 'valid' : 'invalid', label: "Datasource", placeholder: "Select datasource", onSelectionChange: function (selected) { return setDatasourceText(selected.toString()); } }, datasourcesList.map(function (datasources, i) { return (react_1["default"].createElement(react_spectrum_1.Item, { key: datasources.name }, datasources.name)); })))))),
        react_1["default"].createElement(react_spectrum_1.ButtonGroup, null,
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: dialog.dismiss },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.cancelLabel" }, "Cancel")),
            react_1["default"].createElement(react_spectrum_1.Button, { onPress: function () { return createDashboard(dashboarName, dashboarCategory, dashboarDescription, dashboarDatasources); }, variant: "cta" },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.save" }, "Save")))));
};
var mapStateToProps = function (storeState) { return ({
    dashboardEntity: storeState.dashboard.entity,
    loading: storeState.dashboard.loading,
    updating: storeState.dashboard.updating,
    updateSuccess: storeState.dashboard.updateSuccess,
    datasourcesList: storeState.datasources.entities
}); };
var mapDispatchToProps = {
    getEntity: dashboard_reducer_1.getEntity,
    updateEntity: dashboard_reducer_1.updateEntity,
    createEntity: dashboard_reducer_1.createEntity,
    reset: dashboard_reducer_1.reset,
    getEntities: datasources_reducer_1.getEntities
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(DashboardModal);
