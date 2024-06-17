import { Card } from "../cards.js";
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

class El extends HTMLElement {
  constructor(cards: Card[]) {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const querySelector = querySelectorFactory(root);

    const main = querySelector("main");
    main.append(...cards.map((card) => createCard(card)));
  }
}

customElements.define("x-hand", El);

export const createHand = (cards: Card[]) => new El(cards);
