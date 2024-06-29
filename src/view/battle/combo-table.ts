import { html, querySelectorFactory } from "../../lib.js";
import { BattleView } from "../battle.js";

const template = document.createElement("template");

template.innerHTML = html`
  <style>
    th {
      text-align: left;
    }
    td {
      text-align: right;
    }
  </style>
  <table>
    <tbody></tbody>
  </table>
`;

class El extends HTMLElement {
  #rows: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const querySelector = querySelectorFactory(root);

    this.#rows = querySelector("tbody");
  }

  set rows(rows: HTMLTableRowElement[]) {
    this.#rows.replaceChildren(...rows);
  }
}

customElements.define("combo-table", El);

export const createComboTable = (): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (battle) => {
    const dragonRow = createRow("Dragon");
    const knightRow = createRow("Knight");

    battle.rounds.forEach((exchange) => {
      const { dragon, knight } = exchange;

      dragonRow.appendChild(createCell(dragon.type));
      knightRow.appendChild(createCell(knight.type));
    });

    el.rows = [dragonRow, knightRow];
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};

const createRow = (text: string): HTMLTableRowElement => {
  const th = document.createElement("th");
  th.textContent = text;

  const tr = document.createElement("tr");
  tr.appendChild(th);

  return tr;
};

const createCell = (text: string): HTMLTableCellElement => {
  const td = document.createElement("td");
  td.textContent = text;

  return td;
};
