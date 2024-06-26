import { Action } from "./action.js";
import { html, querySelectorFactory } from "./lib.js";
import { State } from "./state.js";
import { createBattle } from "./view/battle.js";
import { createTitleView } from "./view/title.js";

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

export type GameView = {
  el: HTMLElement;
  update: (game: State) => void;
};

export const createView = (action: Action) => {
  const el = new El();

  const battle = createBattle(action.battle);
  el.content = createTitleView(action.title);

  const update: GameView["update"] = (state) => {
    if (state.mode === "title") {
      return el;
    }

    if (state.mode === "battle") {
      if (state.battle === null)
        throw new Error("cannot render battle mode when state.battle is null");

      battle.update(state.battle);

      el.content = battle.el;

      return el;
    }

    console.error(state);
    throw new Error(`no match for game mode`);
  };

  const view: GameView = {
    el,
    update,
  };

  return view;
};
