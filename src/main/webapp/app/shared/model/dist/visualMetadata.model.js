"use strict";
exports.__esModule = true;
exports.defaultValue = exports.PropertyType = exports.Color = exports.DataTypeEnum = exports.FeatureType = exports.Constraint = void 0;
var Constraint;
(function (Constraint) {
    Constraint["Optional"] = "OPTIONAL";
    Constraint["Required"] = "REQUIRED";
})(Constraint = exports.Constraint || (exports.Constraint = {}));
var FeatureType;
(function (FeatureType) {
    FeatureType["Dimension"] = "DIMENSION";
    FeatureType["Measure"] = "MEASURE";
})(FeatureType = exports.FeatureType || (exports.FeatureType = {}));
var DataTypeEnum;
(function (DataTypeEnum) {
    DataTypeEnum["String"] = "STRING";
})(DataTypeEnum = exports.DataTypeEnum || (exports.DataTypeEnum = {}));
var Color;
(function (Color) {
    Color["Ffffff"] = "#FFFFFF";
    Color["The617C8C"] = "#617c8c";
    Color["The676A6C"] = "#676a6c";
})(Color = exports.Color || (exports.Color = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["Checkbox"] = "CHECKBOX";
    PropertyType["ColorPicker"] = "COLOR_PICKER";
    PropertyType["Number"] = "NUMBER";
    PropertyType["Select"] = "SELECT";
    PropertyType["Text"] = "TEXT";
})(PropertyType = exports.PropertyType || (exports.PropertyType = {}));
exports.defaultValue = {};
