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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.reset = exports.setBlob = exports.deleteEntity = exports.updateEntity = exports.createEntity = exports.getEntity = exports.getEntities = exports.ACTION_TYPES = void 0;
var axios_1 = require("axios");
var entity_utils_1 = require("app/shared/util/entity-utils");
var action_type_util_1 = require("app/shared/reducers/action-type.util");
var views_model_1 = require("app/shared/model/views.model");
var pagination_constants_1 = require("app/shared/util/dist/pagination.constants");
var params = new URLSearchParams(window.location.search);
var viewDashboard = Number(params.get('viewDashboard'));
var page = Number(params.get('page')) - 1;
var sort = params.get('sort');
exports.ACTION_TYPES = {
    FETCH_VIEWS_LIST: 'views/FETCH_VIEWS_LIST',
    FETCH_VIEWS: 'views/FETCH_VIEWS',
    CREATE_VIEWS: 'views/CREATE_VIEWS',
    UPDATE_VIEWS: 'views/UPDATE_VIEWS',
    DELETE_VIEWS: 'views/DELETE_VIEWS',
    SET_BLOB: 'views/SET_BLOB',
    RESET: 'views/RESET'
};
var initialState = {
    loading: false,
    errorMessage: null,
    entities: [],
    entity: views_model_1.defaultValue,
    updating: false,
    totalItems: 0,
    updateSuccess: false
};
// Reducer
exports["default"] = (function (state, action) {
    var _a;
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case action_type_util_1.REQUEST(exports.ACTION_TYPES.FETCH_VIEWS_LIST):
        case action_type_util_1.REQUEST(exports.ACTION_TYPES.FETCH_VIEWS):
            return __assign(__assign({}, state), { errorMessage: null, updateSuccess: false, loading: true });
        case action_type_util_1.REQUEST(exports.ACTION_TYPES.CREATE_VIEWS):
        case action_type_util_1.REQUEST(exports.ACTION_TYPES.UPDATE_VIEWS):
        case action_type_util_1.REQUEST(exports.ACTION_TYPES.DELETE_VIEWS):
            return __assign(__assign({}, state), { errorMessage: null, updateSuccess: false, updating: true });
        case action_type_util_1.FAILURE(exports.ACTION_TYPES.FETCH_VIEWS_LIST):
        case action_type_util_1.FAILURE(exports.ACTION_TYPES.FETCH_VIEWS):
        case action_type_util_1.FAILURE(exports.ACTION_TYPES.CREATE_VIEWS):
        case action_type_util_1.FAILURE(exports.ACTION_TYPES.UPDATE_VIEWS):
        case action_type_util_1.FAILURE(exports.ACTION_TYPES.DELETE_VIEWS):
            return __assign(__assign({}, state), { loading: false, updating: false, updateSuccess: false, errorMessage: action.payload });
        case action_type_util_1.SUCCESS(exports.ACTION_TYPES.FETCH_VIEWS_LIST):
            return __assign(__assign({}, state), { loading: false, entities: action.payload.data, totalItems: parseInt(action.payload.headers['x-total-count'], 10) });
        case action_type_util_1.SUCCESS(exports.ACTION_TYPES.FETCH_VIEWS):
            return __assign(__assign({}, state), { loading: false, entity: action.payload.data });
        case action_type_util_1.SUCCESS(exports.ACTION_TYPES.CREATE_VIEWS):
        case action_type_util_1.SUCCESS(exports.ACTION_TYPES.UPDATE_VIEWS):
            return __assign(__assign({}, state), { updating: false, updateSuccess: true, entity: action.payload.data });
        case action_type_util_1.SUCCESS(exports.ACTION_TYPES.DELETE_VIEWS):
            return __assign(__assign({}, state), { updating: false, updateSuccess: true, entity: {} });
        case exports.ACTION_TYPES.SET_BLOB: {
            var _b = action.payload, name = _b.name, data = _b.data, contentType = _b.contentType;
            return __assign(__assign({}, state), { entity: __assign(__assign({}, state.entity), (_a = {}, _a[name] = data, _a[name + 'ContentType'] = contentType, _a)) });
        }
        case exports.ACTION_TYPES.RESET:
            return __assign({}, initialState);
        default:
            return state;
    }
});
var apiUrl = 'api/views';
// Actions
exports.getEntities = function (dashboardId, page, size, sort) {
    var requestUrl = "" + apiUrl + (sort ? "?page=" + page + "&size=" + size + "&sort=" + sort : '') + "&viewDashboard=" + dashboardId + "&paginate=true";
    return {
        type: exports.ACTION_TYPES.FETCH_VIEWS_LIST,
        payload: axios_1["default"].get("" + requestUrl + (sort ? '&' : '?') + "cacheBuster=" + new Date().getTime())
    };
};
exports.getEntity = function (id) {
    var requestUrl = apiUrl + "/" + id;
    return {
        type: exports.ACTION_TYPES.FETCH_VIEWS,
        payload: axios_1["default"].get(requestUrl)
    };
};
exports.createEntity = function (entity) { return function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dispatch({
                    type: exports.ACTION_TYPES.CREATE_VIEWS,
                    payload: axios_1["default"].post(apiUrl, entity_utils_1.cleanEntity(entity))
                })];
            case 1:
                result = _a.sent();
                dispatch(exports.getEntities(viewDashboard, page, pagination_constants_1.ITEMS_PER_PAGE, sort));
                return [2 /*return*/, result];
        }
    });
}); }; };
exports.updateEntity = function (entity) { return function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dispatch({
                    type: exports.ACTION_TYPES.UPDATE_VIEWS,
                    payload: axios_1["default"].put(apiUrl, entity_utils_1.cleanEntity(entity))
                })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); }; };
exports.deleteEntity = function (id) { return function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
    var requestUrl, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestUrl = apiUrl + "/" + id;
                return [4 /*yield*/, dispatch({
                        type: exports.ACTION_TYPES.DELETE_VIEWS,
                        payload: axios_1["default"]["delete"](requestUrl)
                    })];
            case 1:
                result = _a.sent();
                dispatch(exports.getEntities(viewDashboard, page, pagination_constants_1.ITEMS_PER_PAGE, sort));
                return [2 /*return*/, result];
        }
    });
}); }; };
exports.setBlob = function (name, data, contentType) { return ({
    type: exports.ACTION_TYPES.SET_BLOB,
    payload: {
        name: name,
        data: data,
        contentType: contentType
    }
}); };
exports.reset = function () { return ({
    type: exports.ACTION_TYPES.RESET
}); };
