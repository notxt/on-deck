import { createAction } from "./core/action.js";
import { listenForKeyPress } from "./core/keyboard.js";
import { createState } from "./core/state.js";
import { createView } from "./core/view.js";

const body = document.querySelector("body");
if (body === null) throw new Error("body is null");

const state = createState();
const action = createAction(state);
listenForKeyPress(state, action);

const view = createView();
state.watchUpdated(view.update);

state.update({});

body.appendChild(view.el);
