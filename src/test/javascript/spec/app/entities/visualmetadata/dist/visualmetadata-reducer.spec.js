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
var axios_1 = require("axios");
var redux_mock_store_1 = require("redux-mock-store");
var redux_promise_middleware_1 = require("redux-promise-middleware");
var redux_thunk_1 = require("redux-thunk");
var sinon_1 = require("sinon");
var visualmetadata_reducer_1 = require("app/entities/visualmetadata/visualmetadata.reducer");
var action_type_util_1 = require("app/shared/reducers/action-type.util");
describe('Entities reducer tests', function () {
    function isEmpty(element) {
        if (element instanceof Array) {
            return element.length === 0;
        }
        else {
            return Object.keys(element).length === 0;
        }
    }
    var initialState = {
        loading: false,
        errorMessage: null,
        entities: [],
        entity: defaultValue,
        updating: false,
        updateSuccess: false
    };
    function testInitialState(state) {
        expect(state).toMatchObject({
            loading: false,
            errorMessage: null,
            updating: false,
            updateSuccess: false
        });
        expect(isEmpty(state.entities));
        expect(isEmpty(state.entity));
    }
    function testMultipleTypes(types, payload, testFunction) {
        types.forEach(function (e) {
            testFunction(visualmetadata_reducer_1["default"](undefined, { type: e, payload: payload }));
        });
    }
    describe('Common', function () {
        it('should return the initial state', function () {
            testInitialState(visualmetadata_reducer_1["default"](undefined, {}));
        });
    });
    describe('Requests', function () {
        it('should set state to loading', function () {
            testMultipleTypes([action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA_LIST), action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA)], {}, function (state) {
                expect(state).toMatchObject({
                    errorMessage: null,
                    updateSuccess: false,
                    loading: true
                });
            });
        });
        it('should set state to updating', function () {
            testMultipleTypes([
                action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.CREATE_VISUALMETADATA),
                action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.UPDATE_VISUALMETADATA),
                action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.DELETE_VISUALMETADATA),
            ], {}, function (state) {
                expect(state).toMatchObject({
                    errorMessage: null,
                    updateSuccess: false,
                    updating: true
                });
            });
        });
        it('should reset the state', function () {
            expect(visualmetadata_reducer_1["default"](__assign(__assign({}, initialState), { loading: true }), {
                type: visualmetadata_reducer_1.ACTION_TYPES.RESET
            })).toEqual(__assign({}, initialState));
        });
    });
    describe('Failures', function () {
        it('should set a message in errorMessage', function () {
            testMultipleTypes([
                action_type_util_1.FAILURE(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA_LIST),
                action_type_util_1.FAILURE(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA),
                action_type_util_1.FAILURE(visualmetadata_reducer_1.ACTION_TYPES.CREATE_VISUALMETADATA),
                action_type_util_1.FAILURE(visualmetadata_reducer_1.ACTION_TYPES.UPDATE_VISUALMETADATA),
                action_type_util_1.FAILURE(visualmetadata_reducer_1.ACTION_TYPES.DELETE_VISUALMETADATA),
            ], 'error message', function (state) {
                expect(state).toMatchObject({
                    errorMessage: 'error message',
                    updateSuccess: false,
                    updating: false
                });
            });
        });
    });
    describe('Successes', function () {
        it('should fetch all entities', function () {
            var payload = { data: [{ 1: 'fake1' }, { 2: 'fake2' }] };
            expect(visualmetadata_reducer_1["default"](undefined, {
                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA_LIST),
                payload: payload
            })).toEqual(__assign(__assign({}, initialState), { loading: false, entities: payload.data }));
        });
        it('should fetch a single entity', function () {
            var payload = { data: { 1: 'fake1' } };
            expect(visualmetadata_reducer_1["default"](undefined, {
                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA),
                payload: payload
            })).toEqual(__assign(__assign({}, initialState), { loading: false, entity: payload.data }));
        });
        it('should create/update entity', function () {
            var payload = { data: 'fake payload' };
            expect(visualmetadata_reducer_1["default"](undefined, {
                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.CREATE_VISUALMETADATA),
                payload: payload
            })).toEqual(__assign(__assign({}, initialState), { updating: false, updateSuccess: true, entity: payload.data }));
        });
        it('should delete entity', function () {
            var payload = 'fake payload';
            var toTest = visualmetadata_reducer_1["default"](undefined, {
                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.DELETE_VISUALMETADATA),
                payload: payload
            });
            expect(toTest).toMatchObject({
                updating: false,
                updateSuccess: true
            });
        });
    });
    describe('Actions', function () {
        var store;
        var resolvedObject = { value: 'whatever' };
        beforeEach(function () {
            var mockStore = redux_mock_store_1["default"]([redux_thunk_1["default"], redux_promise_middleware_1["default"]]);
            store = mockStore({});
            axios_1["default"].get = sinon_1["default"].stub().returns(Promise.resolve(resolvedObject));
            axios_1["default"].post = sinon_1["default"].stub().returns(Promise.resolve(resolvedObject));
            axios_1["default"].put = sinon_1["default"].stub().returns(Promise.resolve(resolvedObject));
            axios_1["default"]["delete"] = sinon_1["default"].stub().returns(Promise.resolve(resolvedObject));
        });
        it('dispatches ACTION_TYPES.FETCH_VISUALMETADATA_LIST actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedActions = [
                            {
                                type: action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA_LIST)
                            },
                            {
                                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA_LIST),
                                payload: resolvedObject
                            },
                        ];
                        return [4 /*yield*/, store.dispatch(visualmetadata_reducer_1.getEntities()).then(function () { return expect(store.getActions()).toEqual(expectedActions); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dispatches ACTION_TYPES.FETCH_VISUALMETADATA actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedActions = [
                            {
                                type: action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA)
                            },
                            {
                                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA),
                                payload: resolvedObject
                            },
                        ];
                        return [4 /*yield*/, store.dispatch(visualmetadata_reducer_1.getEntity(42666)).then(function () { return expect(store.getActions()).toEqual(expectedActions); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dispatches ACTION_TYPES.CREATE_VISUALMETADATA actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedActions = [
                            {
                                type: action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.CREATE_VISUALMETADATA)
                            },
                            {
                                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.CREATE_VISUALMETADATA),
                                payload: resolvedObject
                            },
                            {
                                type: action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA_LIST)
                            },
                            {
                                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA_LIST),
                                payload: resolvedObject
                            },
                        ];
                        return [4 /*yield*/, store.dispatch(visualmetadata_reducer_1.createEntity({ id: 1 })).then(function () { return expect(store.getActions()).toEqual(expectedActions); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dispatches ACTION_TYPES.UPDATE_VISUALMETADATA actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedActions = [
                            {
                                type: action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.UPDATE_VISUALMETADATA)
                            },
                            {
                                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.UPDATE_VISUALMETADATA),
                                payload: resolvedObject
                            },
                        ];
                        return [4 /*yield*/, store.dispatch(visualmetadata_reducer_1.updateEntity({ id: 1 })).then(function () { return expect(store.getActions()).toEqual(expectedActions); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dispatches ACTION_TYPES.DELETE_VISUALMETADATA actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedActions = [
                            {
                                type: action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.DELETE_VISUALMETADATA)
                            },
                            {
                                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.DELETE_VISUALMETADATA),
                                payload: resolvedObject
                            },
                            {
                                type: action_type_util_1.REQUEST(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA_LIST)
                            },
                            {
                                type: action_type_util_1.SUCCESS(visualmetadata_reducer_1.ACTION_TYPES.FETCH_VISUALMETADATA_LIST),
                                payload: resolvedObject
                            },
                        ];
                        return [4 /*yield*/, store.dispatch(visualmetadata_reducer_1.deleteEntity(42666)).then(function () { return expect(store.getActions()).toEqual(expectedActions); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dispatches ACTION_TYPES.RESET actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedActions = [
                            {
                                type: visualmetadata_reducer_1.ACTION_TYPES.RESET
                            },
                        ];
                        return [4 /*yield*/, store.dispatch(visualmetadata_reducer_1.reset())];
                    case 1:
                        _a.sent();
                        expect(store.getActions()).toEqual(expectedActions);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
