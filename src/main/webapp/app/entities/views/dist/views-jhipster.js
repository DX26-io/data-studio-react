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
exports.Views = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var reactstrap_1 = require("reactstrap");
var react_jhipster_1 = require("react-jhipster");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var views_reducer_1 = require("./views.reducer");
var pagination_constants_1 = require("app/shared/util/pagination.constants");
var entity_utils_1 = require("app/shared/util/entity-utils");
exports.Views = function (props) {
    var _a = react_1.useState(entity_utils_1.overridePaginationStateWithQueryParams(react_jhipster_1.getSortState(props.location, pagination_constants_1.ITEMS_PER_PAGE), props.location.search)), paginationState = _a[0], setPaginationState = _a[1];
    var getAllEntities = function () {
        props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, paginationState.sort + "," + paginationState.order);
    };
    var sortEntities = function () {
        getAllEntities();
        var endURL = "?page=" + paginationState.activePage + "&sort=" + paginationState.sort + "," + paginationState.order;
        if (props.location.search !== endURL) {
            props.history.push("" + props.location.pathname + endURL);
        }
    };
    react_1.useEffect(function () {
        sortEntities();
    }, [paginationState.activePage, paginationState.order, paginationState.sort]);
    react_1.useEffect(function () {
        var params = new URLSearchParams(props.location.search);
        var page = params.get('page');
        var sort = params.get('sort');
        if (page && sort) {
            var sortSplit = sort.split(',');
            setPaginationState(__assign(__assign({}, paginationState), { activePage: +page, sort: sortSplit[0], order: sortSplit[1] }));
        }
    }, [props.location.search]);
    var sort = function (p) { return function () {
        setPaginationState(__assign(__assign({}, paginationState), { order: paginationState.order === 'asc' ? 'desc' : 'asc', sort: p }));
    }; };
    var handlePagination = function (currentPage) {
        return setPaginationState(__assign(__assign({}, paginationState), { activePage: currentPage }));
    };
    var viewsList = props.viewsList, match = props.match, loading = props.loading, totalItems = props.totalItems;
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("h2", { id: "views-heading" },
            react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.home.title" }, "Views"),
            react_1["default"].createElement(react_router_dom_1.Link, { to: match.url + "/new", className: "btn btn-primary float-right jh-create-entity", id: "jh-create-entity" },
                react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "plus" }),
                "\u00A0",
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.home.createLabel" }, "Create new Views"))),
        react_1["default"].createElement("div", { className: "table-responsive" }, viewsList && viewsList.length > 0 ? (react_1["default"].createElement(reactstrap_1.Table, { responsive: true },
            react_1["default"].createElement("thead", null,
                react_1["default"].createElement("tr", null,
                    react_1["default"].createElement("th", { className: "hand", onClick: sort('id') },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "global.field.id" }, "ID"),
                        " ",
                        react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "sort" })),
                    react_1["default"].createElement("th", { className: "hand", onClick: sort('viewName') },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.viewName" }, "View Name"),
                        " ",
                        react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "sort" })),
                    react_1["default"].createElement("th", { className: "hand", onClick: sort('description') },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.description" }, "Description"),
                        " ",
                        react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "sort" })),
                    react_1["default"].createElement("th", { className: "hand", onClick: sort('createdBy') },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.createdBy" }, "Created By"),
                        " ",
                        react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "sort" })),
                    react_1["default"].createElement("th", { className: "hand", onClick: sort('lastModifiedBy') },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.lastModifiedBy" }, "Last Modified By"),
                        " ",
                        react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "sort" })),
                    react_1["default"].createElement("th", { className: "hand", onClick: sort('published') },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.published" }, "Published"),
                        " ",
                        react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "sort" })),
                    react_1["default"].createElement("th", { className: "hand", onClick: sort('image') },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.image" }, "Image"),
                        " ",
                        react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "sort" })),
                    react_1["default"].createElement("th", { className: "hand", onClick: sort('viewDashboard') },
                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.viewDashboard" }, "View Dashboard"),
                        " ",
                        react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "sort" })),
                    react_1["default"].createElement("th", null))),
            react_1["default"].createElement("tbody", null, viewsList.map(function (views, i) { return (react_1["default"].createElement("tr", { key: "entity-" + i },
                react_1["default"].createElement("td", null,
                    react_1["default"].createElement(reactstrap_1.Button, { tag: react_router_dom_1.Link, to: match.url + "/" + views.id, color: "link", size: "sm" }, views.id)),
                react_1["default"].createElement("td", null, views.viewName),
                react_1["default"].createElement("td", null, views.description),
                react_1["default"].createElement("td", null, views.createdBy),
                react_1["default"].createElement("td", null, views.lastModifiedBy),
                react_1["default"].createElement("td", null, views.published ? 'true' : 'false'),
                react_1["default"].createElement("td", null, views.image ? (react_1["default"].createElement("div", null,
                    views.imageContentType ? (react_1["default"].createElement("a", { onClick: react_jhipster_1.openFile(views.imageContentType, views.image) },
                        react_1["default"].createElement("img", { src: "data:" + views.imageContentType + ";base64," + views.image, style: { maxHeight: '30px' } }),
                        "\u00A0")) : null,
                    react_1["default"].createElement("span", null,
                        views.imageContentType,
                        ", ",
                        react_jhipster_1.byteSize(views.image)))) : null),
                react_1["default"].createElement("td", { className: "text-right" },
                    react_1["default"].createElement("div", { className: "btn-group flex-btn-group-container" },
                        react_1["default"].createElement(reactstrap_1.Button, { tag: react_router_dom_1.Link, to: match.url + "/" + views.id, color: "info", size: "sm" },
                            react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "eye" }),
                            ' ',
                            react_1["default"].createElement("span", { className: "d-none d-md-inline" },
                                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.view" }, "View"))),
                        react_1["default"].createElement(reactstrap_1.Button, { tag: react_router_dom_1.Link, to: match.url + "/" + views.id + "/edit?page=" + paginationState.activePage + "&sort=" + paginationState.sort + "," + paginationState.order, color: "primary", size: "sm" },
                            react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "pencil-alt" }),
                            ' ',
                            react_1["default"].createElement("span", { className: "d-none d-md-inline" },
                                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.edit" }, "Edit"))),
                        react_1["default"].createElement(reactstrap_1.Button, { tag: react_router_dom_1.Link, to: match.url + "/" + views.id + "/delete?page=" + paginationState.activePage + "&sort=" + paginationState.sort + "," + paginationState.order, color: "danger", size: "sm" },
                            react_1["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "trash" }),
                            ' ',
                            react_1["default"].createElement("span", { className: "d-none d-md-inline" },
                                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "entity.action.delete" }, "Delete"))))))); })))) : (!loading && (react_1["default"].createElement("div", { className: "alert alert-warning" },
            react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "datastudioApp.views.home.notFound" }, "No Views found"))))),
        props.totalItems ? (react_1["default"].createElement("div", { className: viewsList && viewsList.length > 0 ? '' : 'd-none' },
            react_1["default"].createElement(reactstrap_1.Row, { className: "justify-content-center" },
                react_1["default"].createElement(react_jhipster_1.JhiItemCount, { page: paginationState.activePage, total: totalItems, itemsPerPage: paginationState.itemsPerPage, i18nEnabled: true })),
            react_1["default"].createElement(reactstrap_1.Row, { className: "justify-content-center" },
                react_1["default"].createElement(react_jhipster_1.JhiPagination, { activePage: paginationState.activePage, onSelect: handlePagination, maxButtons: 5, itemsPerPage: paginationState.itemsPerPage, totalItems: props.totalItems })))) : ('')));
};
var mapStateToProps = function (_a) {
    var views = _a.views;
    return ({
        viewsList: views.entities,
        loading: views.loading,
        totalItems: views.totalItems
    });
};
var mapDispatchToProps = {
    getEntities: views_reducer_1.getEntities
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(exports.Views);
