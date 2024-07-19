import { getElementByIdFactory, html } from "../../lib.js";
import { BattleView } from "../battle.js";
import { createCardStats } from "./card-stats.js";
import { createCard } from "./card.js";
import { createPhase } from "./combat-phase.js";
import { createPlayerStats } from "./player-stats.js";

const template = document.createElement("template");

const phaseId = "phase";

const dragonStatsId = "dragon-stats";
const dragonCardId = "dragon-card";
const dragonCardStatsId = "dragon-card-stats";
const dragonResultId = "dragon-result";

const knightStatsId = "knight-stats";
const knightCardId = "knight-card";
const knightCardStatsId = "knight-card-stats";
const knightResultId = "knight-result";

template.innerHTML = html`
  <style>
    main {
      align-items: center;
      display: grid;
      gap: 15px;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(2, 1fr);
      justify-items: center;
    }

    .phase {
      grid-row: 1/3;
    }

    .stats {
      grid-column: 2/3;
    }
    .card {
      grid-column: 3/4;
    }
    .card-stats {
      grid-column: 4/5;
    }
    .result {
      grid-column: 5/6;
      height: 100%;
      width: 100%;
      border: solid;
    }
  </style>
  <main>
    <div class="phase" id="${phaseId}"></div>

    <div class="stats" id="${dragonStatsId}"></div>
    <div class="card" id="${dragonCardId}"></div>
    <div class="card-stats" id="${dragonCardStatsId}"></div>
    <div class="result" id="${dragonResultId}"></div>

    <div class="stats" id="${knightStatsId}"></div>
    <div class="card" id="${knightCardId}"></div>
    <div class="card-stats" id="${knightCardStatsId}"></div>
    <div class="result" id="${knightResultId}"></div>
  </main>
`;

class El extends HTMLElement {
  #dragonCard: HTMLElement;
  #dragonCardStats: HTMLElement;
  #dragonStats: HTMLElement;
  #dragonResult: HTMLElement;

  #knightCard: HTMLElement;
  #knightCardStats: HTMLElement;
  #knightStats: HTMLElement;
  #knightResult: HTMLElement;

  #phase: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    this.#dragonCard = getElementById(dragonCardId);
    this.#dragonCardStats = getElementById(dragonCardStatsId);
    this.#dragonStats = getElementById(dragonStatsId);
    this.#dragonResult = getElementById(dragonResultId);

    this.#knightStats = getElementById(knightStatsId);
    this.#knightCard = getElementById(knightCardId);
    this.#knightCardStats = getElementById(knightCardStatsId);
    this.#knightResult = getElementById(knightResultId);

    this.#phase = getElementById(phaseId);
  }

  set dragonCard(content: Node) {
    this.#dragonCard.replaceChildren(content);
  }

  set dragonCardStats(content: Node) {
    this.#dragonCardStats.replaceChildren(content);
  }

  set dragonStats(dragon: HTMLElement) {
    this.#dragonStats.replaceChildren(dragon);
  }

  set dragonResult(result: HTMLElement) {
    this.#dragonResult.replaceChildren(result);
  }

  set knightCard(card: Node) {
    this.#knightCard.replaceChildren(card);
  }

  set knightCardStats(content: Node) {
    this.#knightCardStats.replaceChildren(content);
  }

  set knightStats(stats: HTMLElement) {
    this.#knightStats.replaceChildren(stats);
  }

  set knightResult(result: HTMLElement) {
    this.#knightResult.replaceChildren(result);
  }

  set phase(phase: HTMLElement) {
    this.#phase.replaceChildren(phase);
  }
}

customElements.define("combat-area", El);

export const createCombatArea = (): BattleView => {
  const el = new El();

  const dragonStats = createPlayerStats("Dragon");
  const knightStats = createPlayerStats("Knight");
  const phase = createPhase();

  el.dragonStats = dragonStats.el;
  el.knightStats = knightStats.el;
  el.phase = phase.el;

  const update: BattleView["update"] = (data) => {
    const { dragonPlay, knightPlay } = data;

    el.dragonCard = new Text();
    el.dragonCardStats = new Text();
    if (dragonPlay) {
      el.dragonCard = createCard(dragonPlay);
      el.dragonCardStats = createCardStats(dragonPlay);
    }

    el.knightCard = new Text();
    el.knightCardStats = new Text();
    if (knightPlay) {
      el.knightCard = createCard(knightPlay);
      el.knightCardStats = createCardStats(knightPlay);
    }

    dragonStats.update({ hp: data.dragonHp, stun: data.dragonStun });
    knightStats.update({ hp: data.knightHp, stun: data.knightStun });
    phase.update(data);
  };

  const view: BattleView = {
    el,
    onKey: () => {},
    update,
  };

  return view;
};
