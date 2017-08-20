import local from "./local.js";
import localReducer, { createLocalStore } from "./localReducer.js";
import { destroyComponentState, destroyAllComponentsState } from "./actions.js";

export { local };
export { createLocalStore, localReducer };
export { destroyComponentState, destroyAllComponentsState };
