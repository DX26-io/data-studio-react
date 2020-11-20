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
exports.DashboardUpdate = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var reactstrap_1 = require("reactstrap");
var availity_reactstrap_validation_1 = require("availity-reactstrap-validation");
var react_jhipster_1 = require("react-jhipster");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var dashboard_reducer_1 = require("./dashboard.reducer");
exports.DashboardUpdate = function (props) {
    var _a = react_1.useState(!props.match.params || !props.match.params.id), isNew = _a[0], setIsNew = _a[1];
    var dashboardEntity = props.dashboardEntity, loading = props.loading, updating = props.updating;
    var handleClose = function () {
        props.history.push('/dashboard' + props.location.search);
    };
    react_1.useEffect(function () {
        if (isNew) {
            props.reset();
        }
        else {
            props.getEntity(props.match.params.id);
        }
    }, []);
    react_1.useEffect(function () {
        if (props.updateSuccess) {
            handleClose();
        }
    }, [props.updateSuccess]);
    var saveEntity = function (event, errors, values) {
        if (errors.length === 0) {
            var entity = __assign(__assign({}, dashboardEntity), values);
            if (isNew) {
                props.createEntity(entity);
            }
            else {
                props.updateEntity(entity);
            }
        }
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(reactstrap_1.Row, { className: "justify-content-center" },
            react_1["default"].createElement(reactstrap_1.Col, { md: "8" },
                react_1["default"].createElement("h2", { id: "datastudioApp.dashboard.home.createOrEditLabel" },
                    react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.home.createOrEditLabel" }, "Create or edit a Dashboard")))),
        react_1["default"].createElement(reactstrap_1.Row, { className: "justify-content-center" },
            react_1["default"].createElement(reactstrap_1.Col, { md: "8" }, loading ? (react_1["default"].createElement("p", null, "Loading...")) : (react_1["default"].createElement(availity_reactstrap_validation_1.AvForm, { model: isNew ? {} : dashboardEntity, onSubmit: saveEntity },
                !isNew ? (react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { "for": "dashboard-id" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "global.field.id" }, "ID")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvInput, { id: "dashboard-id", type: "text", className: "form-control", name: "id", required: true, readOnly: true }))) : null,
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "dashboard_nameLabel", "for": "dashboard-dashboard_name" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.dashboard_name" }, "Dashboard Name")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-dashboard_name", type: "text", name: "dashboard_name", validate: {
                            required: { value: true, errorMessage: react_jhipster_1.translate('entity.validation.required') },
                            maxLength: { value: 30, errorMessage: react_jhipster_1.translate('entity.validation.maxlength', { max: 30 }) }
                        } })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "categoryLabel", "for": "dashboard-category" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.category" }, "Category")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-category", type: "text", name: "category", validate: {
                            required: { value: true, errorMessage: react_jhipster_1.translate('entity.validation.required') }
                        } })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "descriptionLabel", "for": "dashboard-description" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.description" }, "Description")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-description", type: "text", name: "description", validate: {
                            required: { value: true, errorMessage: react_jhipster_1.translate('entity.validation.required') },
                            maxLength: { value: 100, errorMessage: react_jhipster_1.translate('entity.validation.maxlength', { max: 100 }) }
                        } })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, { check: true },
                    react_1["default"].createElement(reactstrap_1.Label, { id: "publishedLabel" },
                        react_1["default"].createElement(availity_reactstrap_validation_1.AvInput, { id: "dashboard-published", type: "checkbox", className: "form-check-input", name: "published" }),
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.published" }, "Published"))),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "image_locationLabel", "for": "dashboard-image_location" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.image_location" }, "Image Location")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-image_location", type: "text", name: "image_location" })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "image_content_typeLabel", "for": "dashboard-image_content_type" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.image_content_type" }, "Image Content Type")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-image_content_type", type: "text", name: "image_content_type" })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "dashboard_datasource_idLabel", "for": "dashboard-dashboard_datasource_id" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.dashboard_datasource_id" }, "Dashboard Datasource Id")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-dashboard_datasource_id", type: "string", className: "form-control", name: "dashboard_datasource_id" })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "created_byLabel", "for": "dashboard-created_by" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.created_by" }, "Created By")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-created_by", type: "text", name: "created_by" })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "created_dateLabel", "for": "dashboard-created_date" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.created_date" }, "Created Date")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-created_date", type: "date", className: "form-control", name: "created_date" })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "last_modified_byLabel", "for": "dashboard-last_modified_by" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.last_modified_by" }, "Last Modified By")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-last_modified_by", type: "text", name: "last_modified_by" })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "last_modified_dateLabel", "for": "dashboard-last_modified_date" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.last_modified_date" }, "Last Modified Date")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-last_modified_date", type: "date", className: "form-control", name: "last_modified_date" })),
                react_1["default"].createElement(availity_reactstrap_validation_1.AvGroup, null,
                    react_1["default"].createElement(reactstrap_1.Label, { id: "current_release_idLabel", "for": "dashboard-current_release_id" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.current_release_id" }, "Current Release Id")),
                    react_1["default"].createElement(availity_reactstrap_validation_1.AvField, { id: "dashboard-current_release_id", type: "string", className: "form-control", name: "current_release_id" })),
                react_1["default"].createElement(reactstrap_1.Button, { tag: react_router_dom_1.Link, id: "cancel-save", to: "/dashboard", replace: true, color: "info" },
                    react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "arrow-left" }),
                    "\u00A0",
                    react_1["default"].createElement("span", { className: "d-none d-md-inline" },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.back" }, "Back"))),
                "\u00A0",
                react_1["default"].createElement(reactstrap_1.Button, { color: "primary", id: "save-entity", type: "submit", disabled: updating },
                    react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "save" }),
                    "\u00A0",
                    react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.save" }, "Save"))))))));
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
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(exports.DashboardUpdate);
