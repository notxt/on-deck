import { getElementByIdFactory, html } from "../../lib.js";
import { BattleView } from "../battle.js";
import { CardEl } from "./card.js";

const template = document.createElement("template");

const cardsId = "cards";

template.innerHTML = html`
  <style>
    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    main {
      border: dotted;
      padding: 20px;
    }

    .cards {
      display: flex;
      gap: 20px;
      justify-content: space-evenly;
    }
  </style>

  <div class="wrapper">
    <header>Knight Combo</header>
    <main>
      <div class="cards" id="cards"></div>
    </main>
  </div>
`;

class El extends HTMLElement {
  #cards: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");
    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    this.#cards = getElementById(cardsId);
  }

  set cards(cards: HTMLElement[]) {
    this.#cards.replaceChildren(...cards);
  }
}

customElements.define("knight-combo", El);

export const createKnightCombo = (): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (battle) => {
    el.cards = battle.knight.deck.play.map((card) => new CardEl(card));
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};
