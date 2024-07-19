import {
  getElementByIdFactory,
  html,
  querySelectorFactory,
} from "../../lib.js";

const template = document.createElement("template");

const hpId = "hp";
const stunId = "stun";

template.innerHTML = html`
  <style>
    th {
      text-align: left;
    }
    td {
      text-align: right;
    }
  </style>

  <h3></h3>
  <main>
    <table>
      <tr>
        <th>HP</th>
        <td id="${hpId}"></td>
      </tr>
      <tr>
        <th>Stun</th>
        <td id="${stunId}"></td>
      </tr>
    </table>
  </main>
`;

class El extends HTMLElement {
  #hp: HTMLElement;
  #stun: HTMLElement;

  constructor(headerText: string) {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);
    const querySelector = querySelectorFactory(root);

    const header = querySelector("h3");
    header.textContent = headerText;

    this.#hp = getElementById(hpId);
    this.#stun = getElementById(stunId);
  }

  set hp(hp: number) {
    this.#hp.textContent = hp.toString();
  }

  set stun(stun: number) {
    this.#stun.textContent = stun.toString();
  }
}

customElements.define("player-stats", El);

export const createPlayerStats = (headerText: string) => {
  const el = new El(headerText);

  const update = (stats: { hp: number; stun: number }) => {
    el.hp = stats.hp;
    el.stun = stats.stun;
  };

  const view = {
    el,
    update: update,
  };

  return view;
};
