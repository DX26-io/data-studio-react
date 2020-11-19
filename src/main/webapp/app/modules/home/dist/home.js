"use strict";
exports.__esModule = true;
exports.Home = void 0;
require("./home.scss");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_spectrum_1 = require("@adobe/react-spectrum");
var Card_1 = require("@material-ui/core/Card");
var CardContent_1 = require("@material-ui/core/CardContent");
var Typography_1 = require("@material-ui/core/Typography");
var secondary_header_1 = require("app/shared/layout/secondary-header/secondary-header");
// TODO: Test Cases
exports.Home = function (props) {
    var account = props.account;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(secondary_header_1["default"], { breadcrumbItems: [
                { key: 'home', label: 'Home', route: '/' },
                { key: 'dash', label: 'Dashboards', route: '/dashboards' },
                { key: 'd12367', label: 'Inventory Dashboard', route: '/dashboards/d12367' },
            ], title: 'Home' },
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "primary", marginX: "size-150" }, "Edit"),
            react_1["default"].createElement(react_spectrum_1.Button, { variant: "secondary" }, "Save")),
        react_1["default"].createElement(react_spectrum_1.View, { padding: 'size-150' },
            react_1["default"].createElement(react_spectrum_1.Flex, { justifyContent: 'center', alignItems: 'center', direction: 'column' },
                account && account.login ? (react_1["default"].createElement(react_spectrum_1.View, null,
                    react_1["default"].createElement(react_spectrum_1.Heading, { level: 2 },
                        "You are logged in as \"",
                        react_1["default"].createElement("span", { className: "username" }, account.login),
                        "\""))) : (react_1["default"].createElement(react_spectrum_1.View, null,
                    react_1["default"].createElement(react_spectrum_1.Heading, null, "You are not currently logged in!"))),
                react_1["default"].createElement(Card_1["default"], { className: "root", variant: "outlined" },
                    react_1["default"].createElement(CardContent_1["default"], null,
                        react_1["default"].createElement(Typography_1["default"], { className: "title", color: 'textSecondary', gutterBottom: true }, "// TODO"),
                        react_1["default"].createElement(Typography_1["default"], { variant: "h5", component: 'h2' }, "Home Screen"),
                        react_1["default"].createElement(Typography_1["default"], { className: "pos", color: 'textSecondary' }, "Status: Design stage"),
                        react_1["default"].createElement(Typography_1["default"], { variant: "body2", component: 'p' }, "Work related to the UI will start once the UI design is done!")))))));
};
var mapStateToProps = function (storeState) { return ({
    account: storeState.authentication.account,
    isAuthenticated: storeState.authentication.isAuthenticated
}); };
exports["default"] = react_redux_1.connect(mapStateToProps)(exports.Home);
