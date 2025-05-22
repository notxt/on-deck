import { Card } from "../../core/state.js";
import { createShadowRoot, html } from "../../lib.js";
import { BattleView } from "../battle.js";

const template = document.createElement("template");

const discardId = "discard";
const drawId = "draw";
const handId = "hand";

template.innerHTML = html`
  <style>
    * {
      margin: 0;
      padding: 0;
      list-style-type: none;
      box-sizing: border-box;
    }

    :host {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    section {
      border: 1px dotted var(--font-color);
      padding: 10px;
    }

    table {
      width: 100%;
    }

    th,
    td {
      padding: 2px;
      text-align: right;
    }
  </style>

  <h2>Knight</h2>

  <section>
    <h3>Draw</h3>
    <ul id="${drawId}"></ul>
  </section>

  <section>
    <h3>Hand</h3>
    <table>
      <thead>
        <tr>
          <th>KEY</th>
          <th>MOV</th>
          <th>DMG</th>
          <th>STP</th>
          <th>RCV-HIT</th>
          <th>RCV-BLK</th>
        </tr>
      </thead>
      <tbody id="${handId}"></tbody>
    </table>
  </section>

  <section>
    <h3>Discard</h3>
    <ul id="${discardId}"></ul>
  </section>
`;

class El extends HTMLElement {
  #discard: HTMLElement;
  #draw: HTMLElement;
  #hand: HTMLElement;

  constructor() {
    super();

    const { getElementById } = createShadowRoot(this, template);

    this.#discard = getElementById(discardId);
    this.#draw = getElementById(drawId);
    this.#hand = getElementById(handId);
  }

  set discard(cards: HTMLLIElement[]) {
    this.#discard.replaceChildren(...cards);
  }

  set draw(cards: HTMLLIElement[]) {
    this.#draw.replaceChildren(...cards);
  }

  set hand(cards: HTMLTableRowElement[]) {
    this.#hand.replaceChildren(...cards);
  }
}

customElements.define("knight-deck", El);

export const createKnightDeck = (): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (data) => {
    const {
      knight: { deck },
    } = data;

    el.draw = deck
      .filter((card) => card.position == "draw")
      .map(createCardItem);

    el.hand = deck
      .filter((card) => card.position === "hand")
      .map((card, index) => {
        const press = createCell(`[${index.toString()}]`);
        const name = createCell(card.name);
        const damage = createCell(card.damage.toString());
        const recovery = createCell(card.recovery.toString());
        const recoveryBlock = createCell(card.recoveryBlock.toString());

        const tr = document.createElement("tr");
        tr.append(press, name, damage, recovery, recoveryBlock);

        return tr;
      });

    el.discard = deck
      .filter((card) => card.position === "discard")
      .map(createCardItem);

    return;
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};

const createCardItem = (card: Card) => {
  const li = document.createElement("li");
  li.textContent = card.name;
  return li;
};

const createCell = (content: string) => {
  const td = document.createElement("td");
  td.textContent = content;
  return td;
};
