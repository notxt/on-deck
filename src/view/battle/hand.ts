import { BattleAction } from "../../action.js";
import {
  getElementByIdFactory,
  html,
  querySelectorFactory,
} from "../../lib.js";
import { BattleCard, BattlePhase } from "../../state.js";
import { BattleView } from "../battle.js";
import { CardEl } from "./card.js";

const template = document.createElement("template");

const wrapperId = "wrapper";

template.innerHTML = html`
  <style>
    .active {
      color: magenta;
    }

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

  <div id="${wrapperId}">
    <header>Hand</header>
    <main></main>
  </div>
`;

class El extends HTMLElement {
  #wrapper: HTMLElement;
  #container: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);
    const querySelector = querySelectorFactory(root);

    this.#wrapper = getElementById(wrapperId);
    this.#container = querySelector("main");
  }

  set hand(cards: HTMLElement[]) {
    this.#container.replaceChildren(...cards);
  }

  set phase(phase: BattlePhase) {
    if (phase === "play") {
      this.#wrapper.classList.add("active");
      return;
    }

    this.#wrapper.classList.remove("active");
  }
}

customElements.define("battle-hand", El);

export const createHand = (action: BattleAction): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (battle) => {
    el.phase = battle.phase;

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
