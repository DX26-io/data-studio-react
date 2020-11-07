"use strict";
exports.__esModule = true;
var react_1 = require("react");
var card_thumbnail_1 = require("app/shared/components/card/partials/card-thumbnail");
var react_spectrum_1 = require("@adobe/react-spectrum");
var Cards = function (props) {
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_spectrum_1.View, { borderWidth: "thin", borderColor: "default", width: "size-3600", backgroundColor: "default", borderRadius: "regular", zIndex: 10000 },
            react_1["default"].createElement(card_thumbnail_1["default"], { thumbnail: props.thumbnail }),
            props.header,
            props.footer)));
};
exports["default"] = Cards;
