"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_spectrum_1 = require("@adobe/react-spectrum");
var MoreSmallListVert_1 = require("@spectrum-icons/workflow/MoreSmallListVert");
var InfoOutline_1 = require("@spectrum-icons/workflow/InfoOutline");
var react_jhipster_1 = require("react-jhipster");
var dashboard_delete_modal_1 = require("../dashboard-delete-modal");
var DashboardCardContent = function (props) {
    var dashboardName = props.dashboardName, dashboardType = props.dashboardType, dashboardDescription = props.dashboardDescription, dashboardId = props.dashboardId;
    var _a = react_1["default"].useState(), dialog = _a[0], setDialog = _a[1];
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_spectrum_1.View, { padding: "size-200" },
            react_1["default"].createElement(react_spectrum_1.Flex, { direction: "row", justifyContent: "space-between" },
                react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column", gap: "size-50", justifyContent: "space-around" },
                    react_1["default"].createElement("span", { className: "spectrum-Detail spectrum-Detail--S" },
                        react_1["default"].createElement("span", { className: "spectrum-Detail--light" }, dashboardType)),
                    react_1["default"].createElement("span", { className: "spectrum-Heading--XS" }, dashboardName)),
                react_1["default"].createElement(react_spectrum_1.Flex, { direction: "column" },
                    react_1["default"].createElement(react_spectrum_1.MenuTrigger, null,
                        react_1["default"].createElement(react_spectrum_1.ActionButton, { isQuiet: true, "aria-label": "more options" },
                            react_1["default"].createElement(MoreSmallListVert_1["default"], { size: "S", "aria-label": "Default Alert" })),
                        react_1["default"].createElement(react_spectrum_1.Menu, { onAction: setDialog },
                            react_1["default"].createElement(react_spectrum_1.Section, { title: react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.dashboard_card.options.more_options" }, "More options") },
                                react_1["default"].createElement(react_spectrum_1.Item, { key: "properties" },
                                    react_1["default"].createElement(react_spectrum_1.Text, null,
                                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.dashboard_card.options.properties" }, "Properties"))),
                                react_1["default"].createElement(react_spectrum_1.Item, { key: "release" },
                                    react_1["default"].createElement(react_spectrum_1.Text, null,
                                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.dashboard_card.options.release" }, "Release")))),
                            react_1["default"].createElement(react_spectrum_1.Section, { title: react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.dashboard_card.options.danger" }, "Danger") },
                                react_1["default"].createElement(react_spectrum_1.Item, { key: "delete" },
                                    react_1["default"].createElement(react_spectrum_1.Text, null,
                                        react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.dashboard_card.options.delete" }, "Delete")))))),
                    react_1["default"].createElement(react_spectrum_1.DialogContainer, { onDismiss: function () { return setDialog(null); } }, dialog === 'delete' && react_1["default"].createElement(dashboard_delete_modal_1["default"], { dashboardName: dashboardName, dashboardId: dashboardId })),
                    react_1["default"].createElement(react_spectrum_1.TooltipTrigger, { delay: 0, placement: "end" },
                        react_1["default"].createElement(react_spectrum_1.ActionButton, { isQuiet: true },
                            react_1["default"].createElement(InfoOutline_1["default"], null)),
                        react_1["default"].createElement(react_spectrum_1.Tooltip, null, dashboardDescription ? (dashboardDescription) : (react_1["default"].createElement(react_jhipster_1.Translate, { contentKey: "dashboard.dashboard_card.no_description" }, " no description")))))))));
};
exports["default"] = DashboardCardContent;
