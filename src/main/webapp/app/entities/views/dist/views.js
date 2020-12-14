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
var react_jhipster_1 = require("react-jhipster");
var views_reducer_1 = require("./views.reducer");
var pagination_constants_1 = require("app/shared/util/pagination.constants");
var entity_utils_1 = require("app/shared/util/entity-utils");
var secondary_header_1 = require("app/shared/layout/secondary-header/secondary-header");
var react_spectrum_1 = require("@adobe/react-spectrum");
var card_1 = require("app/shared/components/card/card");
var view_card_thumbnail_1 = require("./view-card/view-card-thumbnail");
var view_card_content_1 = require("./view-card/view-card-content");
var Pagination_1 = require("@material-ui/lab/Pagination");
var dashboard_reducer_1 = require("../dashboard/dashboard.reducer");
var placeholder_1 = require("app/shared/components/placeholder/placeholder");
exports.Views = function (props) {
    var params = new URLSearchParams(props.location.search);
    var _a = react_1.useState(entity_utils_1.overridePaginationStateWithQueryParams(react_jhipster_1.getSortState(props.location, pagination_constants_1.ITEMS_PER_PAGE), props.location.search)), paginationState = _a[0], setPaginationState = _a[1];
    var viewsList = props.viewsList, totalItems = props.totalItems, dashboardEntity = props.dashboardEntity;
    var getAllEntities = function () {
        var dashboardId = props.match.params['id'];
        props.getDashboardViewEntities(dashboardId, paginationState.activePage - 1, paginationState.itemsPerPage, paginationState.sort + "," + paginationState.order);
    };
    var sortEntities = function () {
        getAllEntities();
        var endURL = "?page=" + paginationState.activePage + "&sort=" + paginationState.sort + "," + paginationState.order;
        if (props.location.search !== endURL) {
            props.history.push("" + props.location.pathname + endURL);
        }
    };
    react_1.useEffect(function () {
        props.getDashboardEntity(Number(props.match.params['id']));
        sortEntities();
    }, [paginationState.activePage, paginationState.order, paginationState.sort]);
    react_1.useEffect(function () {
        var page = params.get('page');
        var sort = params.get('sort');
        if (page && sort) {
            var sortSplit = sort.split(',');
            setPaginationState(__assign(__assign({}, paginationState), { activePage: +page, sort: sortSplit[0], order: sortSplit[1] }));
        }
    }, [props.location.search]);
    var handleChangePage = function (event, newPage) {
        setPaginationState(__assign(__assign({}, paginationState), { activePage: newPage }));
    };
    var viewsListElement = props.viewsList.map(function (view) {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(card_1["default"], { key: view.id, thumbnail: react_1["default"].createElement(react_spectrum_1.View, { height: "size-3200" },
                    react_1["default"].createElement(view_card_thumbnail_1["default"], { url: props.match.url + "/" + view.id + "/build", thumbnailImagePath: view.imageLocation, viewName: view.viewName })), content: react_1["default"].createElement(view_card_content_1["default"], { viewDashboard: view.viewDashboard, description: view.description, viewName: view.viewName, viewId: view.id }) })));
    });
    return (!props.loading && (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(secondary_header_1["default"], { breadcrumbItems: [
                { label: 'Home', route: '/' },
                { label: 'Dashboards', route: '/dashboards' },
                { label: 'Views', route: '/views' },
            ], title: dashboardEntity.dashboardName },
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "cta", onPress: function () { return props.history.push(props.match.url + "/create"); } },
                react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "views.home.createLabel" }, "Create View"))),
        viewsList && viewsList.length > 0 ? (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "row", gap: "size-250", wrap: true, marginX: "5%", marginY: "size-450", alignItems: "center", justifyContent: "start" }, viewsListElement),
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "row", margin: "size-175", alignItems: "center", justifyContent: "center" },
                react_1["default"].createElement(Pagination_1["default"], { defaultPage: paginationState.activePage, onChange: handleChangePage, count: Math.ceil(totalItems / paginationState.itemsPerPage) })))) : (react_1["default"].createElement(placeholder_1.NoItemsFoundPlaceHolder, { headerTranslationKey: "views.home.notFound.heading", contentTranslationKey: "views.home.notFound.content" })))));
};
var mapStateToProps = function (storeState) { return ({
    viewsList: storeState.views.entities,
    loading: storeState.views.loading,
    totalItems: storeState.views.totalItems,
    dashboardEntity: storeState.dashboard.entity
}); };
var mapDispatchToProps = {
    getDashboardViewEntities: views_reducer_1.getDashboardViewEntities,
    getDashboardEntity: dashboard_reducer_1.getEntity
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(exports.Views);
