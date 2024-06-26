import { getElementByIdFactory, html } from "../../lib.js";
import { BattleView } from "../battle.js";

const template = document.createElement("template");

const countId = "count";

template.innerHTML = html`
  <style>
    * {
      margin: 0;
      box-sizing: border-box;
    }

    main {
      align-items: center;
      border-style: solid;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px;
    }
  </style>

  <header>Discard Pile</header>
  <main>
    <p>Card Count <span id="${countId}"></span></p>
  </main>
`;

class El extends HTMLElement {
  #count: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    this.#count = getElementById(countId);
  }

  set count(count: number) {
    this.#count.textContent = count.toString();
  }
}

customElements.define("battle-discard", El);

export const createDiscard = (): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (battle) => {
    el.count = battle.knight.deck.discard.length;
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};
