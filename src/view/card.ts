import { Stats } from "../cards.js";
import { getElementByIdFactory, html, querySelectorFactory } from "../lib.js";

const template = document.createElement("template");

const attackId = "attack";
const hitPointsId = "hit-points";

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

    pre {
      display: inline-block;
    }
  </style>

  <main>
    <pre></pre>
    <table>
      <tr>
        <th>AT</th>
        <td id="${attackId}"></td>
      </tr>
      <tr>
        <th>HP</th>
        <td id="${hitPointsId}"></td>
      </tr>
    </table>
  </main>
`;

class El extends HTMLElement {
  constructor(card: Stats) {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const querySelector = querySelectorFactory(root);
    const getElementById = getElementByIdFactory(root);

    const art = querySelector("pre");
    art.textContent = card.art;

    const attack = getElementById(attackId);
    attack.textContent = card.at.toString();

    const hitPoints = getElementById(hitPointsId);
    hitPoints.textContent = card.hp.toString();
  }
}

customElements.define("x-card", El);

export const createCard = (card: Stats): HTMLElement => {
  const el = new El(card);

  return el;
};
