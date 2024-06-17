import { Deck } from "../battle.js";
import { html, querySelectorFactory } from "../lib.js";
import { createCard } from "./card.js";

const template = document.createElement("template");
template.innerHTML = html` <style></style>
  <main></main>`;

export class Play extends HTMLElement {
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
    this.#main.replaceChildren(
      ...deck.play.map((slot) => {
        const div = document.createElement("div");
        if (slot === null) return div;

        const card = createCard(slot);
        div.appendChild(card);

        return div;
      })
    );
  }
}

customElements.define("x-play", Play);
