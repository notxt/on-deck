import { Card, Punch } from "../../core/state.js";
import { createShadowRoot, html } from "../../lib.js";

const nameId = "name";

const punchTemplate = document.createElement("template");

punchTemplate.innerHTML = html`
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    main {
      align-items: center;
      border-radius: 5px;
      border-style: solid;
      display: flex;
      height: 150px;
      justify-content: center;
      width: 100px;
    }
  </style>

  <main>
    <div id="${nameId}"></div>
  </main>
`;

class PunchEl extends HTMLElement {
  constructor(card: Punch) {
    super();

    const { getElementById } = createShadowRoot(this, punchTemplate);

    const type = getElementById(nameId);
    type.textContent = card.name.toUpperCase();
  }
}

customElements.define("card-punch", PunchEl);

const blockTemplate = document.createElement("template");

blockTemplate.innerHTML = html`
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    main {
      align-items: center;
      border-radius: 5px;
      border-style: solid;
      display: flex;
      height: 150px;
      justify-content: center;
      width: 100px;
    }
  </style>

  <main>
    <div id="${nameId}"></div>
  </main>
`;

export const createCard = (card: Card): HTMLElement => {
  return new PunchEl(card);
};
