import { getElementByIdFactory, html } from "../../lib.js";
import { BattlePhase } from "../../state.js";
import { BattleView } from "../battle.js";

const template = document.createElement("template");

const drawId = "draw";
const playId = "play";
const fightId = "fight";

template.innerHTML = html`
  <style>
    .active {
      color: magenta;
    }
  </style>
  <ol>
    <li id="${drawId}">Draw</li>
    <li id="${playId}">Play</li>
    <li id="${fightId}">Fight</li>
  </ol>
`;

class El extends HTMLElement {
  #items: HTMLElement[];
  #map: Record<BattlePhase, HTMLElement>;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    const draw = getElementById(drawId);
    const play = getElementById(playId);
    const fight = getElementById(fightId);

    this.#map = {
      draw,
      play,
      fight,
    };
    this.#items = [draw, play, fight];
  }

  set phase(phase: BattlePhase) {
    this.#items.map((item) => item.classList.remove("active"));
    this.#map[phase].classList.add("active");
  }
}

customElements.define("battle-phase", El);

export const createPhase = () => {
  const el = new El();

  const update: BattleView["update"] = (state) => {
    el.phase = state.phase;
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};
