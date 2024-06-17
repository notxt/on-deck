import { Deck } from "../battle.js";
import { getElementByIdFactory, html } from "../lib.js";
import { Hand } from "./hand.js";
import { Play } from "./play.js";

const template = document.createElement("template");

const playContainerId = "play";
const handContainerId = "hand";

template.innerHTML = html`
  <style></style>
  <main>
    <section id="${playContainerId}"></section>
    <section id="${handContainerId}"></section>
  </main>
`;

export class View extends HTMLElement {
  #play: Play;
  #hand: Hand;

  constructor(deps: { play: Play; hand: Hand }) {
    super();

    const { play, hand } = deps;

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");
    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    const handContainer = getElementById(handContainerId);
    handContainer.appendChild(hand);
    this.#hand = hand;

    const playContainer = getElementById(playContainerId);
    playContainer.appendChild(play);
    this.#play = play;
  }

  update(deck: Deck) {
    this.#hand.update(deck);
    this.#play.update(deck);
  }
}

customElements.define("x-view", View);
