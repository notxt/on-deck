import { BattleAction } from "../../core/action.js";
import { BattlePhase } from "../../core/state.js";
import { getElementByIdFactory, html } from "../../lib.js";
import { BattleView } from "../battle.js";
import { createCard } from "./card.js";

const template = document.createElement("template");

const discardCountId = "discard-count";
const drawCountId = "draw-count";
const drawActionId = "draw-action";
const handContentId = "hand-content";

template.innerHTML = html`
  <style>
    main {
      display: grid;
      gap: 15px;
      grid-template-columns: 1fr 4fr 1fr;
      padding: 30px;
    }

    .hand-content {
      display: flex;
      justify-content: space-around;
    }
  </style>

  <div>
    <main>
      <section class="draw">
        <h2>Draw</h2>
        <div>
          <p>Card Count <span id="${drawCountId}"></span></p>
          <div id="${drawActionId}"></div>
        </div>
      </section>

      <section class="hand">
        <h2>Hand</h2>
        <div class="hand-content" id="${handContentId}"></div>
      </section>

      <section class="discard">
        <h2>Discard</h2>
        <div>
          <p>Card Count <span id="${discardCountId}"></span></p>
        </div>
      </section>
    </main>
  </div>
`;

class El extends HTMLElement {
  #discardCount: HTMLElement;
  #drawAction: HTMLElement;
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
    this.#drawAction = getElementById(drawActionId);
    this.#drawCount = getElementById(drawCountId);
    this.#handContent = getElementById(handContentId);
  }

  set discardCount(count: number) {
    this.#discardCount.textContent = count.toString();
  }

  set drawAction(text: string) {
    this.#drawAction.textContent = text;
  }

  set drawCount(count: number) {
    this.#drawCount.textContent = count.toString();
  }

  set handContent(cards: HTMLElement[]) {
    this.#handContent.replaceChildren(...cards);
  }
}

customElements.define("knight-deck", El);

export const createKnightDeck = (action: BattleAction): BattleView => {
  const el = new El();

  const map: Record<BattlePhase, PhaseStrategy> = {
    draw: createDraw(action, el),
    fight: createFight(action, el),
    play: createPlay(action, el),
  };

  const onKey: BattleView["onKey"] = (key, data) => {
    const { phase } = data;

    map[phase].onKey(key, data);
  };

  const update: BattleView["update"] = (data) => {
    const { knightDiscard, knightDraw, phase } = data;

    el.discardCount = knightDiscard.length;
    el.drawCount = knightDraw.length;

    map[phase].update(data);
    return;
  };

  const view: BattleView = {
    el,
    onKey,
    update,
  };

  return view;
};

type PhaseStrategy = {
  onKey: BattleView["onKey"];
  update: BattleView["update"];
};

const createDraw = (action: BattleAction, el: El): PhaseStrategy => {
  const onKey: PhaseStrategy["onKey"] = (key, data) => {
    const { phase } = data;

    if (phase !== "draw") return;

    if (key === "Enter") action.drawCard(data);
  };

  const update: PhaseStrategy["update"] = (data) => {
    const { phase, knightHand } = data;

    if (phase !== "draw") return;

    el.drawAction = "[Enter] to draw";
    el.handContent = knightHand.map((card) => createCard(card));
  };

  const strategy: PhaseStrategy = {
    onKey,
    update,
  };

  return strategy;
};

const createFight = (_: BattleAction, el: El): PhaseStrategy => {
  const onKey: PhaseStrategy["onKey"] = () => {};

  const update: PhaseStrategy["update"] = (data) => {
    const { phase, knightHand } = data;

    if (phase !== "fight") return;

    el.drawAction = "";
    el.handContent = knightHand.map((card) => createCard(card));
  };

  const strategy: PhaseStrategy = {
    onKey,
    update,
  };

  return strategy;
};

const createPlay = (action: BattleAction, el: El): PhaseStrategy => {
  const onKey: PhaseStrategy["onKey"] = (key, data) => {
    const { phase, knightHand } = data;

    if (phase !== "play") return;

    if (key === "0" || key === "1" || key === "2") {
      if (!knightHand[key]) return;
      action.playCard(data, parseInt(key, 10));
      return;
    }
  };

  const update: PhaseStrategy["update"] = (data) => {
    const { phase, knightHand } = data;

    if (phase !== "play") return;

    el.drawAction = "";

    const handContent = knightHand.map((card, index) => {
      const cardEl = createCard(card);

      const p = document.createElement("p");
      p.textContent = `[${index}] to play card`;

      const div = document.createElement("div");
      div.append(cardEl, p);

      return div;
    });

    el.handContent = handContent;
  };

  const strategy: PhaseStrategy = {
    onKey,
    update,
  };

  return strategy;
};
