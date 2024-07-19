import { Card } from "../../core/state.js";
import { createShadowRoot, html } from "../../lib.js";

const template = document.createElement("template");

const damageId = "damage";
const startupId = "startup";

template.innerHTML = html`
  <style>
    th {
      text-align: left;
    }
    td {
      text-align: right;
    }
  </style>

  <table>
    <tr>
      <th>startup</th>
      <td id="${startupId}"></td>
    </tr>
    <tr>
      <th>damage</th>
      <td id="${damageId}"></td>
    </tr>
  </table>
`;

class El extends HTMLElement {
  #damage: HTMLElement;
  #startup: HTMLElement;

  constructor() {
    super();

    const { getElementById } = createShadowRoot(this, template);

    this.#damage = getElementById(damageId);
    this.#startup = getElementById(startupId);
  }

  set damage(damage: number) {
    this.#damage.textContent = damage.toString();
  }

  set startup(startup: number) {
    this.#startup.textContent = startup.toString();
  }
}

customElements.define("card-stats", El);

export const createCardStats = (card: Card): HTMLElement => {
  const el = new El();

  el.startup = card.startup;
  el.damage = card.damage;

  return el;
};
