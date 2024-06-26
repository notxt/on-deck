import { BattleAction } from "../../action.js";
import { html, querySelectorFactory } from "../../lib.js";
import { BattleCard } from "../../state.js";
import { BattleView } from "../battle.js";
import { CardEl } from "./card.js";

const template = document.createElement("template");

template.innerHTML = html`
  <style>
    main {
      border: dotted;
      display: flex;
      gap: 20px;
      padding: 20px;
      justify-content: space-evenly;
    }

    .slot {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  </style>
  <header>Hand</header>
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

  set hand(cards: HTMLElement[]) {
    this.#container.replaceChildren(...cards);
  }
}

customElements.define("battle-hand", El);

export const createHand = (action: BattleAction): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (battle) => {
    if (battle.phase !== "play") {
      const cards = battle.knight.deck.hand.map((card) => new CardEl(card));
      el.hand = cards;
      return;
    }

    const createSlot = createCardFactory(action.playCard);
    const cards = battle.knight.deck.hand.map((card) => createSlot(card));
    el.hand = cards;
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};

const createCardFactory =
  (playCard: BattleAction["playCard"]) =>
  (card: BattleCard): HTMLElement => {
    const cardEl = new CardEl(card);

    const button = document.createElement("button");
    button.textContent = "Play";
    button.onclick = () => playCard(card);

    const div = document.createElement("div");
    div.classList.add("slot");
    div.append(cardEl, button);

    return div;
  };
