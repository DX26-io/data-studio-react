"use strict";
exports.__esModule = true;
exports.Home = void 0;
require("./home.scss");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_spectrum_1 = require("@adobe/react-spectrum");
var ViewGrid_1 = require("@spectrum-icons/workflow/ViewGrid");
var secondary_header_1 = require("app/shared/layout/secondary-header/secondary-header");
var react_router_dom_1 = require("react-router-dom");
var view_1 = require("@react-spectrum/view");
var text_1 = require("@react-spectrum/text");
var tabs_1 = require("@react-spectrum/tabs");
// TODO: Test Cases
exports.Home = function (props) {
    var history = react_router_dom_1.useHistory();
    var tabs = [
        {
            id: 1,
            name: 'Founding of Rome',
            children: 'Arma virumque cano, Troiae qui primus ab oris.'
        },
        {
            id: 2,
            name: 'Monarchy and Republic',
            children: 'Senatus Populusque Romanus.'
        },
        { id: 3, name: 'Empire', children: 'Alea jacta est.' }
    ];
    var _a = react_1["default"].useState(1), tabId = _a[0], setTabId = _a[1];
    var account = props.account;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(secondary_header_1["default"], { breadcrumbItems: [{ label: 'Home', route: '/' }], title: 'Home' }),
        react_1["default"].createElement(react_spectrum_1.View, { padding: 'size-150' },
            react_1["default"].createElement(react_spectrum_1.Flex, { justifyContent: 'center', alignItems: 'center', direction: 'column' },
                react_1["default"].createElement(react_spectrum_1.View, null,
                    react_1["default"].createElement(react_spectrum_1.Heading, { level: 2 },
                        "You are logged in as \"",
                        react_1["default"].createElement("span", { className: "username" }, account.login),
                        "\""),
                    react_1["default"].createElement(tabs_1.Tabs, { "aria-label": "History of Ancient Rome", items: tabs, onSelectionChange: setTabId }, function (item) { return (react_1["default"].createElement(tabs_1.Item, { title: item.name },
                        react_1["default"].createElement(view_1.Content, { marginTop: "size-250", marginStart: "size-125" },
                            react_1["default"].createElement(text_1.Text, null, item.children)))); })),
                react_1["default"].createElement(react_spectrum_1.ActionButton, { onPress: function () { return history.push('/dashboards'); } },
                    react_1["default"].createElement(ViewGrid_1["default"], null),
                    react_1["default"].createElement(text_1.Text, null, "Dashboards"))))));
};
var mapStateToProps = function (storeState) { return ({
    account: storeState.authentication.account,
    isAuthenticated: storeState.authentication.isAuthenticated
}); };
exports["default"] = react_redux_1.connect(mapStateToProps)(exports.Home);
