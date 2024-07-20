import { html, querySelectorFactory } from "../lib.js";
import { createBattle } from "../view/battle.js";
import { createTitle } from "../view/title.js";
import { GameMode } from "./action.js";
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
  update: (data: GameData) => void;
};

export const createView = () => {
  const el = new El();

  const viewMap: Record<GameMode, View> = {
    battle: createBattle(),
    title: createTitle(),
  };

  const update: View["update"] = (data) => {
    const view: View = viewMap[data.mode];

    view.update(data);

    el.content = view.el;
  };

  const view: View = {
    el,
    update,
  };

  return view;
};
