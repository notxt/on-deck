import { BattleAction } from "../core/action.js";
import { GameKey } from "../core/keyboard.js";
import { BattleMode } from "../core/state.js";
import { View } from "../core/view.js";
import { getElementByIdFactory, html } from "../lib.js";
import { createCombatArea } from "./battle/combat-area.js";
import { createDebugPanel } from "./battle/debug-panel.js";
import { createDragonDeck } from "./battle/dragon-deck.js";
import { createKnightDeck } from "./battle/knight-deck.js";

const template = document.createElement("template");

const debugPanelId = "debug-panel";
const dragonDeckId = "dragon-deck";
const knightDeckId = "knight-deck";
const combatAreaId = "combat-area";

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
      grid-template-rows: 1fr 2fr 4fr 2fr;
      height: 100vh;
      padding: 30px;
      width: 100vw;
    }
  </style>

  <main>
    <div class="debug" id="${debugPanelId}"></div>
    <div class="deck" id="${dragonDeckId}"></div>
    <div class="combat" id="${combatAreaId}"></div>
    <div class="deck" id="${knightDeckId}"></div>
  </main>
`;

class El extends HTMLElement {
  #combatArea: HTMLElement;
  #debugPanel: HTMLElement;
  #dragonDeck: HTMLElement;
  #knightDeck: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");
    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    this.#combatArea = getElementById(combatAreaId);
    this.#debugPanel = getElementById(debugPanelId);
    this.#dragonDeck = getElementById(dragonDeckId);
    this.#knightDeck = getElementById(knightDeckId);
  }

  set combatArea(el: HTMLElement) {
    this.#combatArea.replaceChildren(el);
  }

  set debugPanel(el: HTMLElement) {
    this.#debugPanel.replaceChildren(el);
  }

  set dragonDeck(el: HTMLElement) {
    this.#dragonDeck.replaceChildren(el);
  }

  set knightDeck(el: HTMLElement) {
    this.#knightDeck.replaceChildren(el);
  }
}

customElements.define("battle-mode", El);

export const createBattle = (action: BattleAction): View => {
  const el = new El();

  const debugPanel = createDebugPanel(action);
  const combatArea = createCombatArea();
  const dragonDeck = createDragonDeck();
  const knightDeck = createKnightDeck(action);

  el.combatArea = combatArea.el;
  el.debugPanel = debugPanel.el;
  el.dragonDeck = dragonDeck.el;
  el.knightDeck = knightDeck.el;

  const onKey: View["keyPressed"] = (key, data) => {
    if (data.mode !== "battle") return;

    debugPanel.onKey(key, data);
    knightDeck.onKey(key, data);
  };

  const update: View["update"] = (data) => {
    if (data.mode !== "battle") return;

    combatArea.update(data);
    dragonDeck.update(data);
    knightDeck.update(data);
  };

  const view: View = {
    el,
    keyPressed: onKey,
    update: update,
  };

  return view;
};

export type BattleView = {
  el: HTMLElement;
  onKey: (key: GameKey, data: BattleMode) => void;
  update: (data: BattleMode) => void;
};
