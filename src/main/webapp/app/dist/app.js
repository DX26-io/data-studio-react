"use strict";
exports.__esModule = true;
exports.App = void 0;
require("react-toastify/dist/ReactToastify.css");
require("../content/scss/main.scss");
require("@spectrum-css/typography/dist/index-vars.css");
require("flair-visualizations/dist/main.bundle.js");
require("react-grid-layout/css/styles.css");
require("react-resizable/css/styles.css");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var react_toastify_1 = require("react-toastify");
var react_hot_loader_1 = require("react-hot-loader");
var react_spectrum_1 = require("@adobe/react-spectrum");
var authentication_1 = require("app/shared/reducers/authentication");
var application_profile_1 = require("app/shared/reducers/application-profile");
var locale_1 = require("app/shared/reducers/locale");
var header_1 = require("app/shared/layout/header/header");
var footer_1 = require("app/shared/layout/footer/footer");
var private_route_1 = require("app/shared/auth/private-route");
var error_boundary_1 = require("app/shared/error/error-boundary");
var constants_1 = require("app/config/constants");
var routes_1 = require("app/routes");
var baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
// TODO: Test Cases
exports.App = function (props) {
    react_1.useEffect(function () {
        props.getSession();
        props.getProfile();
    }, []);
    return props.isAuthenticated ? (react_1["default"].createElement(react_router_dom_1.BrowserRouter, { basename: baseHref },
        react_1["default"].createElement(react_toastify_1.ToastContainer, { position: react_toastify_1.toast.POSITION.TOP_LEFT, className: "toastify-container", toastClassName: "toastify-toast" }),
        react_1["default"].createElement(react_spectrum_1.Grid, { areas: ['header', 'content', 'footer'], columns: ['1fr'], rows: ['size-700', 'auto', 'size-400'], minHeight: window.innerHeight },
            react_1["default"].createElement(react_spectrum_1.View, { gridArea: "header" },
                react_1["default"].createElement(error_boundary_1["default"], null,
                    react_1["default"].createElement(header_1["default"], { isAuthenticated: props.isAuthenticated, isAdmin: props.isAdmin, currentLocale: props.currentLocale, onLocaleChange: props.setLocale, ribbonEnv: props.ribbonEnv, isInProduction: props.isInProduction, isSwaggerEnabled: props.isSwaggerEnabled }))),
            react_1["default"].createElement(react_spectrum_1.View, { gridArea: "content", flex: true, alignSelf: 'stretch', backgroundColor: "default" },
                react_1["default"].createElement(error_boundary_1["default"], null,
                    react_1["default"].createElement(routes_1["default"], null))),
            react_1["default"].createElement(react_spectrum_1.View, { gridArea: "footer", backgroundColor: "default" },
                react_1["default"].createElement(footer_1["default"], null))))) : (react_1["default"].createElement(react_router_dom_1.BrowserRouter, { basename: baseHref },
        react_1["default"].createElement(error_boundary_1["default"], null,
            react_1["default"].createElement(routes_1["default"], null))));
};
var mapStateToProps = function (_a) {
    var authentication = _a.authentication, applicationProfile = _a.applicationProfile, locale = _a.locale;
    return ({
        currentLocale: locale.currentLocale,
        isAuthenticated: authentication.isAuthenticated,
        isAdmin: private_route_1.hasAnyAuthority(authentication.account.userGroups, [constants_1.AUTHORITIES.ADMIN]),
        ribbonEnv: applicationProfile.ribbonEnv,
        isInProduction: applicationProfile.inProduction,
        isSwaggerEnabled: applicationProfile.isSwaggerEnabled
    });
};
var mapDispatchToProps = { setLocale: locale_1.setLocale, getSession: authentication_1.getSession, getProfile: application_profile_1.getProfile };
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(react_hot_loader_1.hot(module)(exports.App));
