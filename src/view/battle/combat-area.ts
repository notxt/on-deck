import { Card, Frame } from "../../core/state.js";
import { createShadowRoot, html } from "../../lib.js";
import { BattleView } from "../battle.js";

const template = document.createElement("template");

const dragonCardId = "dragon-card";
const framesId = "frames";
const knightCardId = "knight-card";

template.innerHTML = html`
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    :host {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border: 1px dotted var(--font-color);
      padding: 10px;
    }

    table {
      width: 100%;
    }

    th,
    td {
      padding: 2px;
      text-align: center;
    }
  </style>

  <h2>Combat</h2>

  <section>
    <table>
      <caption>
        Knight Play
      </caption>
      <tbody id="${knightCardId}"></tbody>
    </table>

    <table>
      <caption>
        Frames
      </caption>
      <thead>
        <tr>
          <th>Frame</th>
          <th>Knight</th>
          <th>Dragon</th>
        </tr>
      </thead>
      <tbody id="${framesId}"></tbody>
    </table>

    <table>
      <caption>
        Dragon Play
      </caption>
      <tbody id="${dragonCardId}"></tbody>
    </table>
  </section>
`;

class El extends HTMLElement {
  #dragonCard: HTMLElement;
  #frames: HTMLElement;
  #knightCard: HTMLElement;

  constructor() {
    super();

    const { getElementById } = createShadowRoot(this, template);

    this.#dragonCard = getElementById(dragonCardId);
    this.#frames = getElementById(framesId);
    this.#knightCard = getElementById(knightCardId);
  }

  set frames(rows: HTMLTableRowElement[]) {
    this.#frames.replaceChildren(...rows);
  }

  set dragonCard(card: Card | undefined) {
    if (typeof card === "undefined") {
      this.#dragonCard.textContent = "";
      return;
    }

    this.#dragonCard.replaceChildren(...createCardRows(card));
  }

  set knightCard(card: Card | undefined) {
    if (typeof card === "undefined") {
      this.#knightCard.textContent = "";
      return;
    }

    this.#knightCard.replaceChildren(...createCardRows(card));
  }
}

customElements.define("combat-area", El);

export const createCombatArea = (): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (data) => {
    const { currentFrame, knight, dragon, frames } = data;

    el.knightCard = knight.deck.find((card) => card.position === "play");
    el.dragonCard = dragon.deck.find((card) => card.position === "play");
    el.frames = createFrameRows(frames, currentFrame);
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};

const createMovRow = (card: Card): HTMLTableRowElement => {
  const header = document.createElement("th");
  header.textContent = "MOV";

  const value = document.createElement("td");
  value.textContent = card.name;

  const row = document.createElement("tr");
  row.append(header, value);

  return row;
};
const createDmgRow = (card: Card): HTMLTableRowElement => {
  const header = document.createElement("th");
  header.textContent = "DMG";

  const value = document.createElement("td");
  value.textContent = card.damage.toString();

  const row = document.createElement("tr");
  row.append(header, value);

  return row;
};
const createSpdRow = (card: Card): HTMLTableRowElement => {
  const header = document.createElement("th");
  header.textContent = "SPD";

  const value = document.createElement("td");
  value.textContent = card.startup.toString();

  const row = document.createElement("tr");
  row.append(header, value);

  return row;
};

const createCardRows = (
  card: Card
): [HTMLTableRowElement, HTMLTableRowElement, HTMLTableRowElement] => {
  return [createMovRow(card), createDmgRow(card), createSpdRow(card)];
};

const createFrameRows = (
  frames: Frame[],
  currentFrame: number
): HTMLTableRowElement[] => {
  const rows: HTMLTableRowElement[] = [];

  for (let index = 0; index <= currentFrame; index++) {
    const tr = document.createElement("tr");
    rows.push(tr);

    const indexCell = document.createElement("td");
    indexCell.textContent = index.toString();
    if (index === currentFrame) indexCell.textContent = `> ${index} <`;
    tr.appendChild(indexCell);

    const frame = frames[index];
    if (typeof frame === "undefined") {
      const td = document.createElement("td");
      td.colSpan = 2;
      td.textContent = "Press [Tab] to run frame";
      tr.appendChild(td);
      break;
    }

    const knightCell = document.createElement("td");
    knightCell.textContent = frame.knight.card;

    const dragonCell = document.createElement("td");
    dragonCell.textContent = frame.dragon.card;

    tr.append(knightCell, dragonCell);
  }

  return rows;
};
