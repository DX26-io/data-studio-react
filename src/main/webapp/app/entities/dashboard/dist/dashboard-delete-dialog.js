"use strict";
exports.__esModule = true;
exports.DashboardDeleteDialog = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var reactstrap_1 = require("reactstrap");
var react_jhipster_1 = require("react-jhipster");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var dashboard_reducer_1 = require("./dashboard.reducer");
exports.DashboardDeleteDialog = function (props) {
    react_1.useEffect(function () {
        props.getEntity(props.match.params.id);
    }, []);
    var handleClose = function () {
        props.history.push('/dashboard' + props.location.search);
    };
    react_1.useEffect(function () {
        if (props.updateSuccess) {
            handleClose();
        }
    }, [props.updateSuccess]);
    var confirmDelete = function () {
        props.deleteEntity(props.dashboardEntity.id);
    };
    var dashboardEntity = props.dashboardEntity;
    return (react_1["default"].createElement(reactstrap_1.Modal, { isOpen: true, toggle: handleClose },
        react_1["default"].createElement(reactstrap_1.ModalHeader, { toggle: handleClose },
            react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.delete.title" }, "Confirm delete operation")),
        react_1["default"].createElement(reactstrap_1.ModalBody, { id: "datastudioApp.dashboard.delete.question" },
            react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.dashboard.delete.question", interpolate: { id: dashboardEntity.id } }, "Are you sure you want to delete this Dashboard?")),
        react_1["default"].createElement(reactstrap_1.ModalFooter, null,
            react_1["default"].createElement(reactstrap_1.Button, { color: "secondary", onClick: handleClose },
                react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "ban" }),
                "\u00A0",
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.cancel" }, "Cancel")),
            react_1["default"].createElement(reactstrap_1.Button, { id: "jhi-confirm-delete-dashboard", color: "danger", onClick: confirmDelete },
                react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "trash" }),
                "\u00A0",
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.delete" }, "Delete")))));
};
var mapStateToProps = function (_a) {
    var dashboard = _a.dashboard;
    return ({
        dashboardEntity: dashboard.entity,
        updateSuccess: dashboard.updateSuccess
    });
};
var mapDispatchToProps = { getEntity: dashboard_reducer_1.getEntity, deleteEntity: dashboard_reducer_1.deleteEntity };
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(exports.DashboardDeleteDialog);
