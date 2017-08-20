import { compose, createStore as createReduxStore } from 'redux';
import * as UIActions from './actions.js';

const stores = {};
const globalActions = {};
const refCounter = {};
const defaultGlobalFilter = () => false;

const initialiseComponentState = (state, payload, componentKey) => {
  const { config, store } = payload;
  stores[componentKey] = store;
  refCounter[componentKey] = refCounter[componentKey] || 0;
  refCounter[componentKey]++;
  globalActions[componentKey] = config.filterGlobalActions || defaultGlobalFilter;
  const initialState = stores[componentKey].getState();
  const newComponentsState = Object.assign({}, state, {
    [componentKey]: initialState,
  });
  return newComponentsState;
};
const destroyComponentState = (state, payload, componentKey) => {
  refCounter[componentKey] = refCounter[componentKey] || 0;
  if (refCounter[componentKey] > 0) {
    refCounter[componentKey]--;
  }
  if (refCounter[componentKey]) {
    return state;
  }
  const newState = Object.assign({}, state);
  delete newState[componentKey];
  delete refCounter[componentKey];
  delete stores[componentKey];
  delete globalActions[componentKey];
  return newState;
};
const updateSingleComponent = (oldComponentState, action, componentKey) => {
  const store = stores[componentKey];
  if (store) {
    // eslint-disable-next-line
    action.meta = Object.assign({}, action.meta, {
      reduxFractalCurrentComponent: componentKey,
    });
    store.originalDispatch(action);
    return store.getState();
  }
  return oldComponentState;
};

const updateComponentState = (state, action, componentKey) => {
  const newState = Object.keys(state).reduce((stateAcc, k) => {
    const shouldUpdate =
      componentKey === k || (typeof globalActions[k] === 'function' && globalActions[k](action));
    let updatedState = state[k];
    if (shouldUpdate) {
      updatedState = updateSingleComponent(state[k], action, k);
      return Object.assign({}, stateAcc, { [k]: updatedState });
    }
    return stateAcc;
  }, {});
  return Object.assign({}, state, newState);
};

export default (state = {}, action) => {
  const componentKey = action.meta && action.meta.reduxFractalTriggerComponent;
  let nextState = null;
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
      Object.keys(state).forEach(k => {
        nextState = destroyComponentState(nextState, {}, k);
      });
      return nextState;
    default:
      return updateComponentState(state, action, componentKey);
  }
};

// Creates a proxy for the dispatcher that can be swapped out later.
// This ensures that middleware will use the globalDispatch created later.
const proxyDispatchEnhancer = createStore => (reducer, preloadedState, enhancer) => {
  const store = createStore(reducer, preloadedState, enhancer);
  const dispatch = store.dispatch;
  const proxy = {
    globalDispatch: action => store.proxy.originalDispatch(action),
  };
  store.proxy = proxy;
  store.dispatch = action => {
    if (action.meta && action.meta.reduxFractalTriggerComponent) {
      return dispatch(action);
    }
    return proxy.globalDispatch(action);
  };
  return store;
};

export const createLocalStore = (reducer, preloadedState, enhancer) =>
  createReduxStore(reducer, preloadedState, compose(enhancer, proxyDispatchEnhancer));

export const createStore = (createStoreFn, props, componentKey, existingState, context) => {
  if (!stores[componentKey]) {
    const getWrappedAction = action => {
      let wrappedAction = action;
      if (typeof action === 'object') {
        const actionMeta = Object.assign({}, action.meta, {
          reduxFractalTriggerComponent: componentKey,
        });
        wrappedAction = Object.assign({}, action, { meta: actionMeta });
      }
      return wrappedAction;
    };
    const globalDispatch = action => {
      const wrappedAction = getWrappedAction(action);
      return context.store.dispatch(wrappedAction);
    };
    const storeResult = createStoreFn(props, existingState, context);
    let storeCleanup = () => true;
    let store;
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
