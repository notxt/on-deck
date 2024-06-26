import { BattleAction } from "../action.js";
import { getElementByIdFactory, html } from "../lib.js";
import { BattleState } from "../state.js";
import { createDiscard } from "./battle/discard.js";
import { createDragonCombo } from "./battle/dragon-combo.js";
import { createDragonStats } from "./battle/dragon-stats.js";
import { createDraw } from "./battle/draw.js";
import { createHand } from "./battle/hand.js";
import { createKnightCombo } from "./battle/knight-combo.js";
import { createKnightStats } from "./battle/knight-stats.js";

const template = document.createElement("template");

const discardId = "discard";
const dragonComboId = "dragon-combo";
const dragonStatsId = "dragon";
const drawId = "draw";
const handId = "hand";
const knightComboId = "knight-combo";
const knightStatsId = "knight";
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

    .knight-stats {
      grid-column: 2/3;
    }

    .dragon-stats {
      grid-column: 5/6;
    }

    .combo {
      grid-column: 2/6;
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

    <div class="knight-stats" id="${knightStatsId}"></div>
    <div class="dragon-stats" id="${dragonStatsId}"></div>

    <div class="combo" id="${knightComboId}"></div>

    <div class="draw" id="${drawId}"></div>
    <div class="hand" id="${handId}"></div>
    <div class="discard" id="${discardId}"></div>

    <div class="spacer"></div>
  </main>
`;

class El extends HTMLElement {
  #discard: HTMLElement;
  #dragonCombo: HTMLElement;
  #dragonStats: HTMLElement;
  #draw: HTMLElement;
  #hand: HTMLElement;
  #knightCombo: HTMLElement;
  #knightStats: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");
    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    this.#discard = getElementById(discardId);
    this.#dragonStats = getElementById(dragonStatsId);
    this.#dragonCombo = getElementById(dragonComboId);
    this.#draw = getElementById(drawId);
    this.#hand = getElementById(handId);
    this.#knightStats = getElementById(knightStatsId);
    this.#knightCombo = getElementById(knightComboId);

    const resetGame = getElementById(resetGameId);
    if (!(resetGame instanceof HTMLButtonElement))
      throw new Error(`"#${resetGameId}" is not instanceof HTMLButton`);
    resetGame.onclick = () => {
      localStorage.clear();
      location.reload();
    };
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
}

customElements.define("battle-mode", El);

export type BattleView = {
  el: HTMLElement;
  update: (state: BattleState) => void;
};

export const createBattle = (action: BattleAction): BattleView => {
  const el = new El();

  const discard = createDiscard();
  const dragonCombo = createDragonCombo();
  const dragonStats = createDragonStats();
  const draw = createDraw(action);
  const hand = createHand(action);
  const knightCombo = createKnightCombo();
  const knightStats = createKnightStats();

  el.discard = discard.el;
  el.dragonCombo = dragonCombo.el;
  el.dragonStats = dragonStats.el;
  el.draw = draw.el;
  el.hand = hand.el;
  el.knightCombo = knightCombo.el;
  el.knightStats = knightStats.el;

  const update: BattleView["update"] = (state) => {
    discard.update(state);
    dragonCombo.update(state);
    dragonStats.update(state);
    draw.update(state);
    hand.update(state);
    knightCombo.update(state);
    knightStats.update(state);
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};
