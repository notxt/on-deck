import { Deck } from "../battle.js";
import { html, querySelectorFactory } from "../lib.js";
import { createCard } from "./card.js";

const template = document.createElement("template");
template.innerHTML = html`
  <style>
    main {
      border: dotted;
      display: flex;
      gap: 20px;
      padding: 20px;
      justify-content: space-evenly;
    }
  </style>
  <header>Hand</header>
  <main></main>
`;

export class Hand extends HTMLElement {
  #main: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");
    root.appendChild(template.content.cloneNode(true));

    const querySelector = querySelectorFactory(root);

    const main = querySelector("main");
    this.#main = main;
  }

  update(deck: Deck) {
    this.#main.replaceChildren(...deck.hand.map((card) => createCard(card)));
  }
}

customElements.define("x-hand", Hand);
