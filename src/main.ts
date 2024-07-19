import { createAction } from "./core/action.js";
import { watchKeyPressedFactory } from "./core/keyboard.js";
import { createState } from "./core/state.js";
import { createView } from "./core/view.js";

const body = document.querySelector("body");
if (body === null) throw new Error("body is null");

const state = createState();
const action = createAction(state);

const view = createView(action);
state.watchUpdated(view.update);

const watchKeyPressed = watchKeyPressedFactory(state);
watchKeyPressed(view.keyPressed);

state.update({});

body.appendChild(view.el);
