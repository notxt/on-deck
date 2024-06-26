import { BattleAction } from "../../action.js";
import { getElementByIdFactory, html } from "../../lib.js";
import { BattleView } from "../battle.js";

const template = document.createElement("template");

const countId = "count";
const drawId = "draw";

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

  <header>Draw Pile</header>
  <main>
    <p>Card Count <span id="${countId}"></span></p>
    <div id="${drawId}"></div>
  </main>
`;

class El extends HTMLElement {
  #draw: HTMLElement;
  #count: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    this.#count = getElementById(countId);
    this.#draw = getElementById(drawId);
  }

  set count(count: number) {
    this.#count.textContent = count.toString();
  }

  set draw(button: HTMLButtonElement | null) {
    if (button === null) {
      this.#draw.textContent = "";
      return;
    }

    this.#draw.replaceChildren(button);
  }
}

customElements.define("battle-draw", El);

export const createDraw = (action: BattleAction): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (battle) => {
    el.count = battle.knight.deck.draw.length;

    if (battle.phase !== "draw") {
      el.draw = null;
      return;
    }

    el.draw = createButton(action.drawCard);
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};

const createButton = (callback: () => void): HTMLButtonElement => {
  const button = document.createElement("button");
  button.textContent = "Draw";
  button.onclick = callback;

  return button;
};
