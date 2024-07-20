import { Frame, PlayerFrame } from "../../core/state.js";
import { createShadowRoot, html } from "../../lib.js";
import { BattleView } from "../battle.js";

const template = document.createElement("template");

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

  <h2>Combat</h2>

  <section>
    <table>
      <thead>
        <tr>
          <th colspan="3">Knight</th>
          <th>Frame</th>
          <th colspan="3">Dragon</th>
        </tr>
        <tr>
          <th>MOV</th>
          <th>PHS</th>
          <th>CNT</th>
          <th></th>
          <th>MOV</th>
          <th>PHS</th>
          <th>CNT</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </section>
`;

class El extends HTMLElement {
  #tbody: HTMLTableSectionElement;

  constructor() {
    super();

    const { querySelector } = createShadowRoot(this, template);

    this.#tbody = querySelector("tbody");
  }

  set rows(rows: HTMLTableRowElement[]) {
    this.#tbody.replaceChildren(...rows);
  }
}

customElements.define("combat-area", El);

export const createCombatArea = (): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (data) => {
    const { frameIndex, frames } = data;

    const createRow = createRowFactory(frameIndex);

    el.rows = frames.map(createRow);
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};

const createPlayerCells = (
  frame: PlayerFrame
): [HTMLTableCellElement, HTMLTableCellElement, HTMLTableCellElement] => {
  const move = document.createElement("td");
  move.textContent = frame.move;

  const moveIndex = document.createElement("td");
  moveIndex.textContent = frame.moveIndex.toString();

  const movePhase = document.createElement("td");
  movePhase.textContent = frame.movePhase;

  return [move, movePhase, moveIndex];
};

const blankPlayerCell = (): HTMLTableCellElement => {
  const td = document.createElement("td");
  td.colSpan = 3;
  return td;
};

const createRowFactory =
  (currentIndex: number) =>
  (frame: Frame, index: number): HTMLTableRowElement => {
    const { knight, dragon } = frame;

    const frameCell = document.createElement("td");
    frameCell.textContent = index.toString();
    if (index === currentIndex) frameCell.textContent = `> ${index} <`;

    const knightCells =
      knight === null ? [blankPlayerCell()] : createPlayerCells(knight);
    const dragonCells =
      dragon === null ? [blankPlayerCell()] : createPlayerCells(dragon);

    const tr = document.createElement("tr");
    tr.append(...knightCells, frameCell, ...dragonCells);

    return tr;
  };
