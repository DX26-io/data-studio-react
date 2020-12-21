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
var views_reducer_1 = require("./views.reducer");
var react_redux_1 = require("react-redux");
var react_jhipster_1 = require("react-jhipster");
var view_util_1 = require("app/entities/views/view-util");
var react_router_dom_1 = require("react-router-dom");
var dashboard_reducer_1 = require("../dashboard/dashboard.reducer");
var ViewPropertiesModal = function (props) {
    var _a = react_1["default"].useState(false), isEdit = _a[0], setEdit = _a[1];
    var _b = react_1["default"].useState(props.viewEntity.viewName ? props.viewEntity.viewName : ''), viewName = _b[0], setViewNameText = _b[1];
    var _c = react_1["default"].useState(props.viewEntity.description ? props.viewEntity.description : ''), viewDescription = _c[0], setDescriptionText = _c[1];
    var _d = react_1["default"].useState(false), isError = _d[0], setErrorOpen = _d[1];
    var _e = react_1["default"].useState(''), errorMessage = _e[0], setErrorMessage = _e[1];
    var _f = view_util_1.getViewFromTranslations(), VIEW_LABEL = _f.VIEW_LABEL, DESCRIPTION_LABEL = _f.DESCRIPTION_LABEL;
    var _g = view_util_1.getViewErrorTranslations(), ERROR_LABEL = _g.ERROR_LABEL, ERROR_CLOSE_LABEL = _g.ERROR_CLOSE_LABEL;
    var history = react_router_dom_1.useHistory();
    var viewId = props.match.params.viewId;
    var dashboardId = props.match.params.id;
    var handleClose = function () {
        history.push('/dashboards/' + dashboardId);
    };
    var editEntity = function (values) {
        var entity = __assign(__assign({}, props.viewEntity), values);
        props.updateEntity(entity);
    };
    var updateView = function (name, description) {
        editEntity({
            viewName: name,
            description: description
        });
    };
    react_1.useEffect(function () {
        if (viewId) {
            props.getEntity(viewId);
        }
    }, []);
    react_1.useEffect(function () {
        if (props.updateSuccess) {
            handleClose();
        }
        if (props.errorMessage != null) {
            if (props.errorMessage.response.data.message === 'uniqueError') {
                setErrorMessage(react_jhipster_1.translate('views.uniqueError.update'));
            }
            else {
                setErrorMessage(react_jhipster_1.translate('views.error.content'));
            }
            setErrorOpen(true);
        }
        if (props.viewEntity.id) {
            setViewNameText(props.viewEntity.viewName);
            setDescriptionText(props.viewEntity.description);
        }
    }, [props.updateSuccess, props.errorMessage, props.viewEntity]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_spectrum_1.DialogContainer, { type: "fullscreenTakeover", onDismiss: handleClose },
            react_1["default"].createElement(react_spectrum_1.Dialog, null,
                isEdit ? react_1["default"].createElement(react_spectrum_1.Heading, null,
                    "Edit ",
                    props.viewEntity.viewName) : react_1["default"].createElement(react_spectrum_1.Heading, null, props.viewEntity.viewName),
                react_1["default"].createElement(react_spectrum_1.Divider, null),
                react_1["default"].createElement(react_spectrum_1.Content, null,
                    react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", gap: "size-100", alignItems: "center" },
                        react_1["default"].createElement(react_spectrum_1.View, { padding: "size-600" },
                            react_1["default"].createElement(react_spectrum_1.Form, { isDisabled: !isEdit, isRequired: true, necessityIndicator: "icon", minWidth: "size-4600" },
                                react_1["default"].createElement(react_spectrum_1.TextField, { label: VIEW_LABEL, maxLength: 30, validationState: (viewName === null || viewName === void 0 ? void 0 : viewName.length) < 30 ? 'valid' : 'invalid', onChange: setViewNameText, value: viewName }),
                                react_1["default"].createElement(react_spectrum_1.TextArea, { label: DESCRIPTION_LABEL, maxLength: 100, isRequired: false, value: viewDescription, validationState: (viewDescription === null || viewDescription === void 0 ? void 0 : viewDescription.length) < 100 ? 'valid' : 'invalid', onChange: setDescriptionText }))))),
                react_1["default"].createElement(react_spectrum_1.ButtonGroup, null,
                    react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: handleClose },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.cancel" }, "Cancel")),
                    !isEdit && (react_1["default"].createElement(react_spectrum_1.Button, { variant: "cta", onPress: function () {
                            setEdit(true);
                        } },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.edit" }, "Edit"))),
                    isEdit && (react_1["default"].createElement(react_spectrum_1.Button, { variant: "cta", onPress: function () { return updateView(viewName, viewDescription); }, isDisabled: viewName === '' || props.updating },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.save" }, "Save")))))),
        react_1["default"].createElement(react_spectrum_1.DialogContainer, __assign({ onDismiss: function () { return setErrorOpen(false); } }, props), isError && (react_1["default"].createElement(react_spectrum_1.AlertDialog, { title: ERROR_LABEL, variant: "destructive", primaryActionLabel: ERROR_CLOSE_LABEL }, errorMessage)))));
};
var mapStateToProps = function (storeState) { return ({
    viewEntity: storeState.views.entity,
    loading: storeState.views.loading,
    updating: storeState.views.updating,
    updateSuccess: storeState.views.updateSuccess,
    errorMessage: storeState.views.errorMessage,
    dashboardEntity: storeState.dashboard.entity
}); };
var mapDispatchToProps = {
    updateEntity: views_reducer_1.updateEntity,
    getEntity: views_reducer_1.getEntity,
    reset: views_reducer_1.reset,
    getDashboardEntity: dashboard_reducer_1.getEntity
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ViewPropertiesModal);
