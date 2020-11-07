"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var HeaderPopover = function (props) {
    var _a = react_1.useState(false), IsContainerOpen = _a[0], setIsContainerOpen = _a[1];
    var container = react_1.useRef(null);
    var toggleContainer = function () { return setIsContainerOpen(!IsContainerOpen); };
    var handleClickOutside = function (event) {
        if (IsContainerOpen && container.current && !container.current.contains(event.target)) {
            setIsContainerOpen(false);
        }
    };
    react_1.useEffect(function () {
        if (IsContainerOpen)
            document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [IsContainerOpen]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_spectrum_1.View, { marginEnd: "size-300" },
            react_1["default"].createElement("button", { className: "header-icon", onClick: toggleContainer }, props.icon)),
        IsContainerOpen && (react_1["default"].createElement(react_spectrum_1.View, { borderRadius: "regular", borderColor: "default", borderWidth: "thin", padding: "size-200", position: "absolute", top: "size-600", right: "size-100", backgroundColor: "default", zIndex: 1000 },
            react_1["default"].createElement("div", { className: "header-popover-dropdown-container", ref: container }, props.children)))));
};
exports["default"] = HeaderPopover;
