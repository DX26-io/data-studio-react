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
exports.Dashboard = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_jhipster_1 = require("react-jhipster");
var dashboard_reducer_1 = require("./dashboard.reducer");
var pagination_constants_1 = require("app/shared/util/pagination.constants");
var entity_utils_1 = require("app/shared/util/entity-utils");
var card_1 = require("app/shared/components/card/card");
var react_spectrum_1 = require("@adobe/react-spectrum");
var dashboard_card_thumbnail_1 = require("app/entities/dashboard/dashboard-card/dashboard-card-thumbnail");
var dashboard_card_content_1 = require("app/entities/dashboard/dashboard-card/dashboard-card-content");
var TablePagination_1 = require("@material-ui/core/TablePagination");
exports.Dashboard = function (props) {
    var totalPage;
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
    var handleChangeRowsPerPage = function (event) {
        // setRowsPerPage(parseInt(event.target.value, 10));
        setPaginationState(__assign(__assign({}, paginationState), { activePage: 1, itemsPerPage: event.target.value }));
    };
    var handleChangePage = function (event, newPage) {
        setPaginationState(__assign(__assign({}, paginationState), { activePage: newPage + 1 }));
    };
    var dashboardListElement = props.dashboardList.map(function (dashboard) {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(card_1["default"], { key: dashboard.id, thumbnail: react_1["default"].createElement(react_spectrum_1.View, { height: "size-3200" },
                    react_1["default"].createElement(dashboard_card_thumbnail_1["default"], { thumbnailImagePath: dashboard.image_location, dashboardName: dashboard.dashboardName })), content: react_1["default"].createElement(dashboard_card_content_1["default"], { dashboardName: dashboard.dashboardName, dashboardDescription: dashboard.description, dashboardType: dashboard.category, dashboardId: dashboard.id }) })));
    });
    var dashboardList = props.dashboardList, match = props.match, loading = props.loading, totalItems = props.totalItems;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_spectrum_1.Flex, { direction: "row", gap: "size-175", wrap: true, margin: "size-175", alignItems: "center", justifyContent: "start" }, dashboardListElement),
        react_1["default"].createElement(react_spectrum_1.Flex, { direction: "row", margin: "size-175", alignItems: "center", justifyContent: "center" },
            react_1["default"].createElement("div", { className: dashboardList && dashboardList.length > 0 ? '' : 'd-none' },
                react_1["default"].createElement(TablePagination_1["default"], { component: "div", count: props.totalItems, page: paginationState.activePage - 1, onChangePage: handleChangePage, rowsPerPage: paginationState.itemsPerPage, onChangeRowsPerPage: handleChangeRowsPerPage })))));
};
var mapStateToProps = function (_a) {
    var dashboard = _a.dashboard;
    return ({
        dashboardList: dashboard.entities,
        loading: dashboard.loading,
        totalItems: dashboard.totalItems
    });
};
var mapDispatchToProps = {
    getEntities: dashboard_reducer_1.getEntities
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(exports.Dashboard);
