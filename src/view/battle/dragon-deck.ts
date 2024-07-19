import { getElementByIdFactory, html } from "../../lib.js";
import { BattleView } from "../battle.js";
import { createCard } from "./card.js";

const template = document.createElement("template");

const discardCountId = "discard-count";
const drawCountId = "draw-count";
const handContentId = "hand-content";

template.innerHTML = html`
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    main {
      display: grid;
      column-gap: 15px;
      grid-template-columns: 1fr 4fr 1fr;
      grid-template-rows: 1fr 5fr;
    }

    .hand-content {
      display: flex;
      justify-content: space-around;
    }

    section {
      height: 100%;
    }

    section > div {
      border: dotted;
      padding: 10px;
    }

    .card {
      align-items: center;
      border-radius: 5px;
      border-style: solid;
      display: flex;
      justify-content: center;
      min-height: 150px;
      width: 100px;
    }
  </style>

  <div>
    <main>
      <h2>Draw</h2>
      <h2>Hand</h2>
      <h2>Discard</h2>

      <section class="draw">
        <div>
          <div class="card"></div>
          <p>Card Count <span id="${drawCountId}"></span></p>
        </div>
      </section>

      <section class="hand">
        <div class="hand-content" id="${handContentId}"></div>
      </section>

      <section class="discard">
        <div>
          <div class="card"></div>
          <p>Card Count <span id="${discardCountId}"></span></p>
        </div>
      </section>
    </main>
  </div>
`;

class El extends HTMLElement {
  #discardCount: HTMLElement;
  #drawCount: HTMLElement;
  #handContent: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    this.#discardCount = getElementById(discardCountId);
    this.#drawCount = getElementById(drawCountId);
    this.#handContent = getElementById(handContentId);
  }

  set discardCount(count: number) {
    this.#discardCount.textContent = count.toString();
  }

  set drawCount(count: number) {
    this.#drawCount.textContent = count.toString();
  }

  set handContent(cards: HTMLElement[]) {
    this.#handContent.replaceChildren(...cards);
  }
}

customElements.define("dragon-deck", El);

export const createDragonDeck = (): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (data) => {
    const { dragonDiscard, dragonDraw, dragonHand } = data;

    el.discardCount = dragonDiscard.length;
    el.drawCount = dragonDraw.length;
    el.handContent = dragonHand.map((card) => createCard(card));
  };

  const view: BattleView = {
    el,
    onKey: () => {},
    update,
  };

  return view;
};
