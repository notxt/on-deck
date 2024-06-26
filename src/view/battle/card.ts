import { getElementByIdFactory, html } from "../../lib.js";
import { BattleCard } from "../../state.js";

const template = document.createElement("template");

const typeId = "type";

template.innerHTML = html`
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    main {
      border-style: solid;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
    }
  </style>

  <main>
    <div id="${typeId}"></div>
  </main>
`;

export class CardEl extends HTMLElement {
  constructor(card: BattleCard) {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    const type = getElementById(typeId);
    type.textContent = card.type.toUpperCase();
  }
}

customElements.define("x-card", CardEl);
