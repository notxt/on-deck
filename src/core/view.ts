import { html, querySelectorFactory } from "../lib.js";
import { createBattle } from "../view/battle.js";
import { createTitle } from "../view/title.js";
import { Action, GameMode } from "./action.js";
import { KeyPressed } from "./keyboard.js";
import { GameData } from "./state.js";

const template = document.createElement("template");

template.innerHTML = html`
  <style></style>
  <main></main>
`;

class El extends HTMLElement {
  #container: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const querySelector = querySelectorFactory(root);

    this.#container = querySelector("main");
  }

  set content(content: HTMLElement) {
    this.#container.replaceChildren(content);
  }
}

customElements.define("dragon-puncher", El);

export type View = {
  el: HTMLElement;
  keyPressed: KeyPressed;
  update: (data: GameData) => void;
};

export const createView = (action: Action) => {
  const el = new El();

  const viewMap: Record<GameMode, View> = {
    battle: createBattle(action.battle),
    title: createTitle(action.title),
  };

  let active: View | undefined;

  const keyPressed: View["keyPressed"] = (key, data) => {
    if (!active) return;
    active.keyPressed(key, data);
  };

  const update: View["update"] = (data) => {
    const view: View = viewMap[data.mode];
    active = view;
    view.update(data);
    el.content = view.el;
  };

  const view: View = {
    el,
    keyPressed,
    update,
  };

  return view;
};
