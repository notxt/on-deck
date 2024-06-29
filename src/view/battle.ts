import { BattleAction } from "../action.js";
import { getElementByIdFactory, html } from "../lib.js";
import { BattleState } from "../state.js";
import { createComboTable } from "./battle/combo-table.js";
import { createDiscard } from "./battle/discard.js";
import { createDragonCombo } from "./battle/dragon-combo.js";
import { createDragonStats } from "./battle/dragon-stats.js";
import { createDraw } from "./battle/draw.js";
import { createHand } from "./battle/hand.js";
import { createKnightCombo } from "./battle/knight-combo.js";
import { createKnightStats } from "./battle/knight-stats.js";
import { createPhase } from "./battle/phase.js";

const template = document.createElement("template");

const comboTableId = "combo-table";
const discardId = "discard";
const dragonComboId = "dragon-combo";
const dragonStatsId = "dragon";
const drawId = "draw";
const handId = "hand";
const knightComboId = "knight-combo";
const knightStatsId = "knight";
const phaseId = "phase";
const resetGameId = "reset-game";

template.innerHTML = html`
  <style>
    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    main {
      display: grid;
      gap: 15px;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: 1fr 2fr 2fr 2fr 2fr 1fr;
      height: 100vh;
      padding: 30px;
      width: 100vw;
    }

    .spacer {
      grid-column: 1/5;
    }

    .admin {
      grid-column: 6/7;
    }

    .combo {
      grid-column: 2/6;
    }

    .phase {
      grid-column: 1/2;
    }
    .knight-stats {
      grid-column: 2/3;
    }
    .combo-table {
      grid-column: 3/5;
    }
    .dragon-stats {
      grid-column: 5/6;
    }

    .draw {
      grid-column: 1/2;
    }
    .hand {
      grid-column: 2/6;
    }
    .discard {
      grid-column: 6/7;
    }
  </style>

  <main>
    <div class="admin"><button id="${resetGameId}">reset</button></div>

    <div class="combo" id="${dragonComboId}"></div>

    <div class="phase" id="${phaseId}"></div>
    <div class="knight-stats" id="${knightStatsId}"></div>
    <div class="combo-table" id="${comboTableId}"></div>
    <div class="dragon-stats" id="${dragonStatsId}"></div>

    <div class="combo" id="${knightComboId}"></div>

    <div class="draw" id="${drawId}"></div>
    <div class="hand" id="${handId}"></div>
    <div class="discard" id="${discardId}"></div>

    <div class="spacer"></div>
  </main>
`;

class El extends HTMLElement {
  #comboTable: HTMLElement;
  #discard: HTMLElement;
  #dragonCombo: HTMLElement;
  #dragonStats: HTMLElement;
  #draw: HTMLElement;
  #hand: HTMLElement;
  #knightCombo: HTMLElement;
  #knightStats: HTMLElement;
  #phase: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");
    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    this.#comboTable = getElementById(comboTableId);
    this.#discard = getElementById(discardId);
    this.#dragonCombo = getElementById(dragonComboId);
    this.#dragonStats = getElementById(dragonStatsId);
    this.#draw = getElementById(drawId);
    this.#hand = getElementById(handId);
    this.#knightCombo = getElementById(knightComboId);
    this.#knightStats = getElementById(knightStatsId);
    this.#phase = getElementById(phaseId);

    const resetGame = getElementById(resetGameId);
    if (!(resetGame instanceof HTMLButtonElement))
      throw new Error(`"#${resetGameId}" is not instanceof HTMLButton`);
    resetGame.onclick = () => {
      localStorage.clear();
      location.reload();
    };
  }

  set comboTable(table: HTMLElement) {
    this.#comboTable.replaceChildren(table);
  }

  set discard(discard: HTMLElement) {
    this.#discard.replaceChildren(discard);
  }

  set dragonCombo(combo: HTMLElement) {
    this.#dragonCombo.replaceChildren(combo);
  }

  set dragonStats(dragon: HTMLElement) {
    this.#dragonStats.replaceChildren(dragon);
  }

  set draw(draw: HTMLElement) {
    this.#draw.replaceChildren(draw);
  }

  set hand(hand: HTMLElement) {
    this.#hand.replaceChildren(hand);
  }

  set knightStats(stats: HTMLElement) {
    this.#knightStats.replaceChildren(stats);
  }

  set knightCombo(combo: HTMLElement) {
    this.#knightCombo.replaceChildren(combo);
  }

  set phase(phase: HTMLElement) {
    this.#phase.replaceChildren(phase);
  }
}

customElements.define("battle-mode", El);

export type BattleView = {
  el: HTMLElement;
  update: (state: BattleState) => void;
};

export const createBattle = (action: BattleAction): BattleView => {
  const el = new El();

  const dragonCombo = createDragonCombo();

  const phase = createPhase();
  const knightStats = createKnightStats();
  const comboTable = createComboTable();
  const dragonStats = createDragonStats();

  const knightCombo = createKnightCombo();

  const draw = createDraw(action);
  const hand = createHand(action);
  const discard = createDiscard();

  el.comboTable = comboTable.el;
  el.discard = discard.el;
  el.dragonCombo = dragonCombo.el;
  el.dragonStats = dragonStats.el;
  el.draw = draw.el;
  el.hand = hand.el;
  el.knightCombo = knightCombo.el;
  el.knightStats = knightStats.el;
  el.phase = phase.el;

  const update: BattleView["update"] = (state) => {
    comboTable.update(state);
    discard.update(state);
    dragonCombo.update(state);
    dragonStats.update(state);
    draw.update(state);
    hand.update(state);
    knightCombo.update(state);
    knightStats.update(state);
    phase.update(state);
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};
