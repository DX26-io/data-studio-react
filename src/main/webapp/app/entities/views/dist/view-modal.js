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
var ViewModal = function (props) {
    var dialog = react_spectrum_1.useDialogContainer();
    var viewEntity = props.viewEntity, loading = props.loading, updating = props.updating;
    var _a = react_1["default"].useState(false), isOpen = _a[0], setOpen = _a[1];
    var _b = react_1["default"].useState(false), isError = _b[0], setErrorOpen = _b[1];
    var _c = react_1["default"].useState(''), errorMessage = _c[0], setErrorMessage = _c[1];
    var _d = react_1["default"].useState(''), viewName = _d[0], setViewNameText = _d[1];
    var _e = react_1["default"].useState(''), viewDescription = _e[0], setDescriptionText = _e[1];
    var saveEntity = function (values) {
        var entity = __assign(__assign({}, viewEntity), values);
        new Promise(function (resolve) {
            resolve(props.createEntity(entity));
        })
            .then(function (data) {
            if (data['value'].status === 201) {
                setOpen(true);
            }
        })["catch"](function (error) {
            if (error.response.data.message == 'uniqueError') {
                setErrorMessage(react_jhipster_1.translate('datastudioApp.views.uniqueError'));
            }
            else {
                setErrorMessage(react_jhipster_1.translate('datastudioApp.views.errorSaving'));
            }
            setErrorOpen(true);
        });
    };
    var createView = function (name, description) {
        saveEntity({
            viewName: name,
            description: description,
            viewDashboard: props.viewDashboard
        });
    };
    var alertClose = function () {
        setOpen(false);
        dialog.dismiss();
    };
    var alertOpen = function () {
        setOpen(false);
        dialog.dismiss();
        //TODO
        //redirect to build page
    };
    react_1.useEffect(function () { }, []);
    return (react_1["default"].createElement(react_spectrum_1.Dialog, null,
        react_1["default"].createElement(react_spectrum_1.Heading, null,
            react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.home.createNewView" }, "Create new view")),
        react_1["default"].createElement(react_spectrum_1.Divider, null),
        react_1["default"].createElement(react_spectrum_1.Content, null,
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", gap: "size-100", alignItems: "center" },
                react_1["default"].createElement(react_spectrum_1.DialogContainer, __assign({ onDismiss: function () { return setOpen(false); } }, props), isOpen && (react_1["default"].createElement(react_spectrum_1.AlertDialog, { title: "Success", onPrimaryAction: alertOpen, onCancel: alertClose, variant: "confirmation", cancelLabel: "Close", primaryActionLabel: "Open" }, "Created view successfully"))),
                react_1["default"].createElement(react_spectrum_1.DialogContainer, __assign({ onDismiss: function () { return setErrorOpen(false); } }, props), isError && (react_1["default"].createElement(react_spectrum_1.AlertDialog, { title: "Error", onPrimaryAction: alertOpen, onCancel: alertClose, variant: "destructive", cancelLabel: "Close", primaryActionLabel: "Open" }, errorMessage))),
                react_1["default"].createElement(react_spectrum_1.View, { padding: "size-600" },
                    react_1["default"].createElement(react_spectrum_1.Form, { isRequired: true, necessityIndicator: "icon", minWidth: "size-4600" },
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "View name", maxLength: 30, validationState: (viewName === null || viewName === void 0 ? void 0 : viewName.length) < 30 ? 'valid' : 'invalid', onChange: setViewNameText }),
                        react_1["default"].createElement(react_spectrum_1.TextArea, { label: "Description", maxLength: 100, isRequired: false, validationState: (viewDescription === null || viewDescription === void 0 ? void 0 : viewDescription.length) < 100 ? 'valid' : 'invalid', onChange: setDescriptionText }))))),
        react_1["default"].createElement(react_spectrum_1.ButtonGroup, null,
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: dialog.dismiss },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.home.cancelLabel" }, "Cancel")),
            react_1["default"].createElement(react_spectrum_1.Button, { onPress: function () { return createView(viewName, viewDescription); }, variant: "cta" },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.home.save" }, "Save")))));
};
var mapStateToProps = function (storeState) { return ({
    viewEntity: storeState.views.entity,
    loading: storeState.views.loading,
    updating: storeState.views.updating,
    updateSuccess: storeState.views.updateSuccess,
    datasourcesList: storeState.views.entities
}); };
var mapDispatchToProps = {
    createEntity: views_reducer_1.createEntity,
    reset: views_reducer_1.reset
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ViewModal);
