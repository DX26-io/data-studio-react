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
var ViewPropertiesModal = function (props) {
    var _a = react_1["default"].useState(false), isEdit = _a[0], setEdit = _a[1];
    var _b = react_1["default"].useState(props.viewName), viewName = _b[0], setViewNameText = _b[1];
    var _c = react_1["default"].useState(props.description), viewDescription = _c[0], setDescriptionText = _c[1];
    var dialog = react_spectrum_1.useDialogContainer();
    var editEntity = function (values) {
        var entity = __assign(__assign({}, props.viewEntity), values);
        new Promise(function (resolve) {
            resolve(props.updateEntity(entity));
        })
            .then(function (data) {
            if (data['value'].status === 200) {
                dialog.dismiss();
            }
        })["catch"](function (error) {
            debugger;
        });
    };
    var updateView = function (name, description) {
        editEntity({
            viewName: name,
            description: description,
            viewDashboard: props.viewDashboard
        });
    };
    react_1.useEffect(function () {
        if (props.viewId) {
            props.getEntity(props.viewId);
        }
    }, []);
    return (react_1["default"].createElement(react_spectrum_1.Dialog, null,
        isEdit ? react_1["default"].createElement(react_spectrum_1.Heading, null,
            "Edit ",
            props.viewName) : react_1["default"].createElement(react_spectrum_1.Heading, null, props.viewName),
        react_1["default"].createElement(react_spectrum_1.Divider, null),
        react_1["default"].createElement(react_spectrum_1.Content, null,
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", gap: "size-100", alignItems: "center" },
                react_1["default"].createElement(react_spectrum_1.View, { padding: "size-600" },
                    react_1["default"].createElement(react_spectrum_1.Form, { isDisabled: !isEdit, isRequired: true, necessityIndicator: "icon", minWidth: "size-4600" },
                        react_1["default"].createElement(react_spectrum_1.TextField, { label: "View name", maxLength: 30, validationState: (viewName === null || viewName === void 0 ? void 0 : viewName.length) < 30 ? 'valid' : 'invalid', onChange: setViewNameText, value: viewName }),
                        react_1["default"].createElement(react_spectrum_1.TextArea, { label: "Description", maxLength: 100, isRequired: false, value: viewDescription, validationState: (viewDescription === null || viewDescription === void 0 ? void 0 : viewDescription.length) < 100 ? 'valid' : 'invalid', onChange: setDescriptionText }))))),
        react_1["default"].createElement(react_spectrum_1.ButtonGroup, null,
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary", onPress: dialog.dismiss },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.cancelLabel" }, "Cancel")),
            !isEdit && (react_1["default"].createElement(react_spectrum_1.Button, { variant: "cta", onPress: function () {
                    setEdit(true);
                } },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.editLabel" }, "Edit"))),
            isEdit && (react_1["default"].createElement(react_spectrum_1.Button, { variant: "cta", onPress: function () { return updateView(viewName, viewDescription); } },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.home.save" }, "Save"))))));
};
var mapStateToProps = function (storeState) { return ({
    viewEntity: storeState.views.entity,
    loading: storeState.views.loading,
    updating: storeState.views.updating,
    updateSuccess: storeState.views.updateSuccess
}); };
var mapDispatchToProps = {
    updateEntity: views_reducer_1.updateEntity,
    getEntity: views_reducer_1.getEntity
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ViewPropertiesModal);
