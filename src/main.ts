import { createAction } from "./action.js";
import { createState } from "./state.js";
import { createView } from "./view.js";

const body = document.querySelector("body");
if (body === null) throw new Error("body is null");

const state = createState();

const { action, update } = createAction(state);

const view = createView(action);

view.update(state);
update((state) => view.update(state));

body.appendChild(view.el);
