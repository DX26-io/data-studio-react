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
var dashboard_card_header_1 = require("app/shared/components/card/partials/dashboard-card-header");
var dashboard_card_footer_1 = require("app/shared/components/card/partials/dashboard-card-footer");
var react_spectrum_1 = require("@adobe/react-spectrum");
var moment_1 = require("moment");
exports.Dashboard = function (props) {
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
    var dashboardList = props.dashboardList, match = props.match, loading = props.loading, totalItems = props.totalItems;
    return (react_1["default"].createElement(react_spectrum_1.Flex, { direction: "row", gap: "size-175", wrap: true, margin: "size-175", alignItems: "center", justifyContent: "start" }, dashboardList.map(function (dashboard) { return (react_1["default"].createElement(react_spectrum_1.View, null,
        react_1["default"].createElement(card_1["default"], { thumbnail: "https://i.imgur.com/Z7AzH2c.png", header: react_1["default"].createElement(dashboard_card_header_1["default"], { title: dashboard.dashboardName, description: dashboard.description }), footer: react_1["default"].createElement(dashboard_card_footer_1["default"], { modifyDate: moment_1["default"](dashboard.lastModifiedDate).format('MMM DD,YYYY'), status: dashboard.published }) }))); })));
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
