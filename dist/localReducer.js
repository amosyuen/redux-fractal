'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = exports.createLocalStore = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _redux = require('redux');

var _actions = require('./actions.js');

var UIActions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stores = {};
var globalActions = {};
var refCounter = {};
var defaultGlobalFilter = function defaultGlobalFilter() {
  return false;
};

var initialiseComponentState = function initialiseComponentState(state, payload, componentKey) {
  var config = payload.config,
      store = payload.store;

  stores[componentKey] = store;
  refCounter[componentKey] = refCounter[componentKey] || 0;
  refCounter[componentKey]++;
  globalActions[componentKey] = config.filterGlobalActions || defaultGlobalFilter;
  var initialState = stores[componentKey].getState();
  var newComponentsState = (0, _assign2.default)({}, state, (0, _defineProperty3.default)({}, componentKey, initialState));
  return newComponentsState;
};
var destroyComponentState = function destroyComponentState(state, payload, componentKey) {
  refCounter[componentKey] = refCounter[componentKey] || 0;
  if (refCounter[componentKey] > 0) {
    refCounter[componentKey]--;
  }
  if (refCounter[componentKey]) {
    return state;
  }
  var newState = (0, _assign2.default)({}, state);
  delete newState[componentKey];
  delete refCounter[componentKey];
  delete stores[componentKey];
  delete globalActions[componentKey];
  return newState;
};
var updateSingleComponent = function updateSingleComponent(oldComponentState, action, componentKey) {
  var store = stores[componentKey];
  if (store) {
    // eslint-disable-next-line
    action.meta = (0, _assign2.default)({}, action.meta, {
      reduxFractalCurrentComponent: componentKey
    });
    store.originalDispatch(action);
    return store.getState();
  }
  return oldComponentState;
};

var updateComponentState = function updateComponentState(state, action, componentKey) {
  var newState = (0, _keys2.default)(state).reduce(function (stateAcc, k) {
    var shouldUpdate = componentKey === k || typeof globalActions[k] === 'function' && globalActions[k](action);
    var updatedState = state[k];
    if (shouldUpdate) {
      updatedState = updateSingleComponent(state[k], action, k);
      return (0, _assign2.default)({}, stateAcc, (0, _defineProperty3.default)({}, k, updatedState));
    }
    return stateAcc;
  }, {});
  return (0, _assign2.default)({}, state, newState);
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  var componentKey = action.meta && action.meta.reduxFractalTriggerComponent;
  var nextState = null;
  switch (action.type) {
    case UIActions.CREATE_COMPONENT_STATE:
      return initialiseComponentState(state, action.payload, componentKey);
    case UIActions.DESTROY_COMPONENT_STATE:
      if (!action.payload.persist && stores[componentKey]) {
        return destroyComponentState(state, action.payload, componentKey);
      }
      return state;
    case UIActions.DESTROY_ALL_COMPONENTS_STATE:
      nextState = state;
      (0, _keys2.default)(state).forEach(function (k) {
        nextState = destroyComponentState(nextState, {}, k);
      });
      return nextState;
    default:
      return updateComponentState(state, action, componentKey);
  }
};

// Creates a proxy for the dispatcher that can be swapped out later.
// This ensures that middleware will use the globalDispatch created later.


var proxyDispatchEnhancer = function proxyDispatchEnhancer(createStore) {
  return function (reducer, preloadedState, enhancer) {
    var store = createStore(reducer, preloadedState, enhancer);
    var dispatch = store.dispatch;
    var proxy = {
      globalDispatch: function globalDispatch(action) {
        return store.proxy.originalDispatch(action);
      }
    };
    store.proxy = proxy;
    store.dispatch = function (action) {
      if (action.meta && action.meta.reduxFractalTriggerComponent) {
        return dispatch(action);
      }
      return proxy.globalDispatch(action);
    };
    return store;
  };
};

var createLocalStore = exports.createLocalStore = function createLocalStore(reducer, preloadedState, enhancer) {
  return (0, _redux.createStore)(reducer, preloadedState, (0, _redux.compose)(enhancer, proxyDispatchEnhancer));
};

var createStore = exports.createStore = function createStore(createStoreFn, props, componentKey, existingState, context) {
  if (!stores[componentKey]) {
    var getWrappedAction = function getWrappedAction(action) {
      var wrappedAction = action;
      if ((typeof action === 'undefined' ? 'undefined' : (0, _typeof3.default)(action)) === 'object') {
        var actionMeta = (0, _assign2.default)({}, action.meta, {
          reduxFractalTriggerComponent: componentKey
        });
        wrappedAction = (0, _assign2.default)({}, action, { meta: actionMeta });
      }
      return wrappedAction;
    };
    var globalDispatch = function globalDispatch(action) {
      var wrappedAction = getWrappedAction(action);
      return context.store.dispatch(wrappedAction);
    };
    var storeResult = createStoreFn(props, existingState, context);
    var storeCleanup = function storeCleanup() {
      return true;
    };
    var store = void 0;
    if (storeResult.cleanup) {
      storeCleanup = storeResult.cleanup;
    }
    if (storeResult.store) {
      store = storeResult.store;
    }
    if (storeResult.dispatch && storeResult.getState) {
      store = storeResult;
    }
    if (store.proxy.globalDispatch) {
      store.proxy.globalDispatch = globalDispatch;
      store.proxy = undefined;
    }
    store.originalDispatch = store.dispatch;
    store.dispatch = globalDispatch;
    stores[componentKey] = store;
    return { store: stores[componentKey], cleanup: storeCleanup };
  }
  return { store: stores[componentKey] };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2NhbFJlZHVjZXIuanMiXSwibmFtZXMiOlsiVUlBY3Rpb25zIiwic3RvcmVzIiwiZ2xvYmFsQWN0aW9ucyIsInJlZkNvdW50ZXIiLCJkZWZhdWx0R2xvYmFsRmlsdGVyIiwiaW5pdGlhbGlzZUNvbXBvbmVudFN0YXRlIiwic3RhdGUiLCJwYXlsb2FkIiwiY29tcG9uZW50S2V5IiwiY29uZmlnIiwic3RvcmUiLCJmaWx0ZXJHbG9iYWxBY3Rpb25zIiwiaW5pdGlhbFN0YXRlIiwiZ2V0U3RhdGUiLCJuZXdDb21wb25lbnRzU3RhdGUiLCJkZXN0cm95Q29tcG9uZW50U3RhdGUiLCJuZXdTdGF0ZSIsInVwZGF0ZVNpbmdsZUNvbXBvbmVudCIsIm9sZENvbXBvbmVudFN0YXRlIiwiYWN0aW9uIiwibWV0YSIsInJlZHV4RnJhY3RhbEN1cnJlbnRDb21wb25lbnQiLCJvcmlnaW5hbERpc3BhdGNoIiwidXBkYXRlQ29tcG9uZW50U3RhdGUiLCJyZWR1Y2UiLCJzdGF0ZUFjYyIsImsiLCJzaG91bGRVcGRhdGUiLCJ1cGRhdGVkU3RhdGUiLCJyZWR1eEZyYWN0YWxUcmlnZ2VyQ29tcG9uZW50IiwibmV4dFN0YXRlIiwidHlwZSIsIkNSRUFURV9DT01QT05FTlRfU1RBVEUiLCJERVNUUk9ZX0NPTVBPTkVOVF9TVEFURSIsInBlcnNpc3QiLCJERVNUUk9ZX0FMTF9DT01QT05FTlRTX1NUQVRFIiwiZm9yRWFjaCIsInByb3h5RGlzcGF0Y2hFbmhhbmNlciIsInJlZHVjZXIiLCJwcmVsb2FkZWRTdGF0ZSIsImVuaGFuY2VyIiwiY3JlYXRlU3RvcmUiLCJkaXNwYXRjaCIsInByb3h5IiwiZ2xvYmFsRGlzcGF0Y2giLCJjcmVhdGVMb2NhbFN0b3JlIiwiY3JlYXRlU3RvcmVGbiIsInByb3BzIiwiZXhpc3RpbmdTdGF0ZSIsImNvbnRleHQiLCJnZXRXcmFwcGVkQWN0aW9uIiwid3JhcHBlZEFjdGlvbiIsImFjdGlvbk1ldGEiLCJzdG9yZVJlc3VsdCIsInN0b3Jl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VCxPQUFPTyxZQUFQLENBQVQsRUFBK0IrQyxTQUFTRCxZQUF4QyxFQUFQO0FBQ0Q7QUFDRCxTQUFPLEVBQUU1QyxPQUFPVCxPQUFPTyxZQUFQLENBQVQsRUFBUDtBQUNELENBdENNIiwiZmlsZSI6ImxvY2FsUmVkdWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbXBvc2UsIGNyZWF0ZVN0b3JlIGFzIGNyZWF0ZVJlZHV4U3RvcmUgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgKiBhcyBVSUFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zLmpzJztcblxuY29uc3Qgc3RvcmVzID0ge307XG5jb25zdCBnbG9iYWxBY3Rpb25zID0ge307XG5jb25zdCByZWZDb3VudGVyID0ge307XG5jb25zdCBkZWZhdWx0R2xvYmFsRmlsdGVyID0gKCkgPT4gZmFsc2U7XG5cbmNvbnN0IGluaXRpYWxpc2VDb21wb25lbnRTdGF0ZSA9IChzdGF0ZSwgcGF5bG9hZCwgY29tcG9uZW50S2V5KSA9PiB7XG4gIGNvbnN0IHsgY29uZmlnLCBzdG9yZSB9ID0gcGF5bG9hZDtcbiAgc3RvcmVzW2NvbXBvbmVudEtleV0gPSBzdG9yZTtcbiAgcmVmQ291bnRlcltjb21wb25lbnRLZXldID0gcmVmQ291bnRlcltjb21wb25lbnRLZXldIHx8IDA7XG4gIHJlZkNvdW50ZXJbY29tcG9uZW50S2V5XSsrO1xuICBnbG9iYWxBY3Rpb25zW2NvbXBvbmVudEtleV0gPSBjb25maWcuZmlsdGVyR2xvYmFsQWN0aW9ucyB8fCBkZWZhdWx0R2xvYmFsRmlsdGVyO1xuICBjb25zdCBpbml0aWFsU3RhdGUgPSBzdG9yZXNbY29tcG9uZW50S2V5XS5nZXRTdGF0ZSgpO1xuICBjb25zdCBuZXdDb21wb25lbnRzU3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgIFtjb21wb25lbnRLZXldOiBpbml0aWFsU3RhdGUsXG4gIH0pO1xuICByZXR1cm4gbmV3Q29tcG9uZW50c1N0YXRlO1xufTtcbmNvbnN0IGRlc3Ryb3lDb21wb25lbnRTdGF0ZSA9IChzdGF0ZSwgcGF5bG9hZCwgY29tcG9uZW50S2V5KSA9PiB7XG4gIHJlZkNvdW50ZXJbY29tcG9uZW50S2V5XSA9IHJlZkNvdW50ZXJbY29tcG9uZW50S2V5XSB8fCAwO1xuICBpZiAocmVmQ291bnRlcltjb21wb25lbnRLZXldID4gMCkge1xuICAgIHJlZkNvdW50ZXJbY29tcG9uZW50S2V5XS0tO1xuICB9XG4gIGlmIChyZWZDb3VudGVyW2NvbXBvbmVudEtleV0pIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3QgbmV3U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSk7XG4gIGRlbGV0ZSBuZXdTdGF0ZVtjb21wb25lbnRLZXldO1xuICBkZWxldGUgcmVmQ291bnRlcltjb21wb25lbnRLZXldO1xuICBkZWxldGUgc3RvcmVzW2NvbXBvbmVudEtleV07XG4gIGRlbGV0ZSBnbG9iYWxBY3Rpb25zW2NvbXBvbmVudEtleV07XG4gIHJldHVybiBuZXdTdGF0ZTtcbn07XG5jb25zdCB1cGRhdGVTaW5nbGVDb21wb25lbnQgPSAob2xkQ29tcG9uZW50U3RhdGUsIGFjdGlvbiwgY29tcG9uZW50S2V5KSA9PiB7XG4gIGNvbnN0IHN0b3JlID0gc3RvcmVzW2NvbXBvbmVudEtleV07XG4gIGlmIChzdG9yZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIGFjdGlvbi5tZXRhID0gT2JqZWN0LmFzc2lnbih7fSwgYWN0aW9uLm1ldGEsIHtcbiAgICAgIHJlZHV4RnJhY3RhbEN1cnJlbnRDb21wb25lbnQ6IGNvbXBvbmVudEtleSxcbiAgICB9KTtcbiAgICBzdG9yZS5vcmlnaW5hbERpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHN0b3JlLmdldFN0YXRlKCk7XG4gIH1cbiAgcmV0dXJuIG9sZENvbXBvbmVudFN0YXRlO1xufTtcblxuY29uc3QgdXBkYXRlQ29tcG9uZW50U3RhdGUgPSAoc3RhdGUsIGFjdGlvbiwgY29tcG9uZW50S2V5KSA9PiB7XG4gIGNvbnN0IG5ld1N0YXRlID0gT2JqZWN0LmtleXMoc3RhdGUpLnJlZHVjZSgoc3RhdGVBY2MsIGspID0+IHtcbiAgICBjb25zdCBzaG91bGRVcGRhdGUgPVxuICAgICAgY29tcG9uZW50S2V5ID09PSBrIHx8ICh0eXBlb2YgZ2xvYmFsQWN0aW9uc1trXSA9PT0gJ2Z1bmN0aW9uJyAmJiBnbG9iYWxBY3Rpb25zW2tdKGFjdGlvbikpO1xuICAgIGxldCB1cGRhdGVkU3RhdGUgPSBzdGF0ZVtrXTtcbiAgICBpZiAoc2hvdWxkVXBkYXRlKSB7XG4gICAgICB1cGRhdGVkU3RhdGUgPSB1cGRhdGVTaW5nbGVDb21wb25lbnQoc3RhdGVba10sIGFjdGlvbiwgayk7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGVBY2MsIHsgW2tdOiB1cGRhdGVkU3RhdGUgfSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZUFjYztcbiAgfSwge30pO1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIG5ld1N0YXRlKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSA9IHt9LCBhY3Rpb24pID0+IHtcbiAgY29uc3QgY29tcG9uZW50S2V5ID0gYWN0aW9uLm1ldGEgJiYgYWN0aW9uLm1ldGEucmVkdXhGcmFjdGFsVHJpZ2dlckNvbXBvbmVudDtcbiAgbGV0IG5leHRTdGF0ZSA9IG51bGw7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIFVJQWN0aW9ucy5DUkVBVEVfQ09NUE9ORU5UX1NUQVRFOlxuICAgICAgcmV0dXJuIGluaXRpYWxpc2VDb21wb25lbnRTdGF0ZShzdGF0ZSwgYWN0aW9uLnBheWxvYWQsIGNvbXBvbmVudEtleSk7XG4gICAgY2FzZSBVSUFjdGlvbnMuREVTVFJPWV9DT01QT05FTlRfU1RBVEU6XG4gICAgICBpZiAoIWFjdGlvbi5wYXlsb2FkLnBlcnNpc3QgJiYgc3RvcmVzW2NvbXBvbmVudEtleV0pIHtcbiAgICAgICAgcmV0dXJuIGRlc3Ryb3lDb21wb25lbnRTdGF0ZShzdGF0ZSwgYWN0aW9uLnBheWxvYWQsIGNvbXBvbmVudEtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgY2FzZSBVSUFjdGlvbnMuREVTVFJPWV9BTExfQ09NUE9ORU5UU19TVEFURTpcbiAgICAgIG5leHRTdGF0ZSA9IHN0YXRlO1xuICAgICAgT2JqZWN0LmtleXMoc3RhdGUpLmZvckVhY2goayA9PiB7XG4gICAgICAgIG5leHRTdGF0ZSA9IGRlc3Ryb3lDb21wb25lbnRTdGF0ZShuZXh0U3RhdGUsIHt9LCBrKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVwZGF0ZUNvbXBvbmVudFN0YXRlKHN0YXRlLCBhY3Rpb24sIGNvbXBvbmVudEtleSk7XG4gIH1cbn07XG5cbi8vIENyZWF0ZXMgYSBwcm94eSBmb3IgdGhlIGRpc3BhdGNoZXIgdGhhdCBjYW4gYmUgc3dhcHBlZCBvdXQgbGF0ZXIuXG4vLyBUaGlzIGVuc3VyZXMgdGhhdCBtaWRkbGV3YXJlIHdpbGwgdXNlIHRoZSBnbG9iYWxEaXNwYXRjaCBjcmVhdGVkIGxhdGVyLlxuY29uc3QgcHJveHlEaXNwYXRjaEVuaGFuY2VyID0gY3JlYXRlU3RvcmUgPT4gKHJlZHVjZXIsIHByZWxvYWRlZFN0YXRlLCBlbmhhbmNlcikgPT4ge1xuICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIHByZWxvYWRlZFN0YXRlLCBlbmhhbmNlcik7XG4gIGNvbnN0IGRpc3BhdGNoID0gc3RvcmUuZGlzcGF0Y2g7XG4gIGNvbnN0IHByb3h5ID0ge1xuICAgIGdsb2JhbERpc3BhdGNoOiBhY3Rpb24gPT4gc3RvcmUucHJveHkub3JpZ2luYWxEaXNwYXRjaChhY3Rpb24pLFxuICB9O1xuICBzdG9yZS5wcm94eSA9IHByb3h5O1xuICBzdG9yZS5kaXNwYXRjaCA9IGFjdGlvbiA9PiB7XG4gICAgaWYgKGFjdGlvbi5tZXRhICYmIGFjdGlvbi5tZXRhLnJlZHV4RnJhY3RhbFRyaWdnZXJDb21wb25lbnQpIHtcbiAgICAgIHJldHVybiBkaXNwYXRjaChhY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gcHJveHkuZ2xvYmFsRGlzcGF0Y2goYWN0aW9uKTtcbiAgfTtcbiAgcmV0dXJuIHN0b3JlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxvY2FsU3RvcmUgPSAocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUsIGVuaGFuY2VyKSA9PlxuICBjcmVhdGVSZWR1eFN0b3JlKHJlZHVjZXIsIHByZWxvYWRlZFN0YXRlLCBjb21wb3NlKGVuaGFuY2VyLCBwcm94eURpc3BhdGNoRW5oYW5jZXIpKTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVN0b3JlID0gKGNyZWF0ZVN0b3JlRm4sIHByb3BzLCBjb21wb25lbnRLZXksIGV4aXN0aW5nU3RhdGUsIGNvbnRleHQpID0+IHtcbiAgaWYgKCFzdG9yZXNbY29tcG9uZW50S2V5XSkge1xuICAgIGNvbnN0IGdldFdyYXBwZWRBY3Rpb24gPSBhY3Rpb24gPT4ge1xuICAgICAgbGV0IHdyYXBwZWRBY3Rpb24gPSBhY3Rpb247XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3QgYWN0aW9uTWV0YSA9IE9iamVjdC5hc3NpZ24oe30sIGFjdGlvbi5tZXRhLCB7XG4gICAgICAgICAgcmVkdXhGcmFjdGFsVHJpZ2dlckNvbXBvbmVudDogY29tcG9uZW50S2V5LFxuICAgICAgICB9KTtcbiAgICAgICAgd3JhcHBlZEFjdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIGFjdGlvbiwgeyBtZXRhOiBhY3Rpb25NZXRhIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHdyYXBwZWRBY3Rpb247XG4gICAgfTtcbiAgICBjb25zdCBnbG9iYWxEaXNwYXRjaCA9IGFjdGlvbiA9PiB7XG4gICAgICBjb25zdCB3cmFwcGVkQWN0aW9uID0gZ2V0V3JhcHBlZEFjdGlvbihhY3Rpb24pO1xuICAgICAgcmV0dXJuIGNvbnRleHQuc3RvcmUuZGlzcGF0Y2god3JhcHBlZEFjdGlvbik7XG4gICAgfTtcbiAgICBjb25zdCBzdG9yZVJlc3VsdCA9IGNyZWF0ZVN0b3JlRm4ocHJvcHMsIGV4aXN0aW5nU3RhdGUsIGNvbnRleHQpO1xuICAgIGxldCBzdG9yZUNsZWFudXAgPSAoKSA9PiB0cnVlO1xuICAgIGxldCBzdG9yZTtcbiAgICBpZiAoc3RvcmVSZXN1bHQuY2xlYW51cCkge1xuICAgICAgc3RvcmVDbGVhbnVwID0gc3RvcmVSZXN1bHQuY2xlYW51cDtcbiAgICB9XG4gICAgaWYgKHN0b3JlUmVzdWx0LnN0b3JlKSB7XG4gICAgICBzdG9yZSA9IHN0b3JlUmVzdWx0LnN0b3JlO1xuICAgIH1cbiAgICBpZiAoc3RvcmVSZXN1bHQuZGlzcGF0Y2ggJiYgc3RvcmVSZXN1bHQuZ2V0U3RhdGUpIHtcbiAgICAgIHN0b3JlID0gc3RvcmVSZXN1bHQ7XG4gICAgfVxuICAgIGlmIChzdG9yZS5wcm94eS5nbG9iYWxEaXNwYXRjaCkge1xuICAgICAgc3RvcmUucHJveHkuZ2xvYmFsRGlzcGF0Y2ggPSBnbG9iYWxEaXNwYXRjaDtcbiAgICAgIHN0b3JlLnByb3h5ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzdG9yZS5vcmlnaW5hbERpc3BhdGNoID0gc3RvcmUuZGlzcGF0Y2g7XG4gICAgc3RvcmUuZGlzcGF0Y2ggPSBnbG9iYWxEaXNwYXRjaDtcbiAgICBzdG9yZXNbY29tcG9uZW50S2V5XSA9IHN0b3JlO1xuICAgIHJldHVybiB7IHN0b3JlOiBzdG9yZXNbY29tcG9uZW50S2V5XSwgY2xlYW51cDogc3RvcmVDbGVhbnVwIH07XG4gIH1cbiAgcmV0dXJuIHsgc3RvcmU6IHN0b3Jlc1tjb21wb25lbnRLZXldIH07XG59O1xuIl19