import { getElementByIdFactory, html } from "../../lib.js";
import { BattleView } from "../battle.js";

const template = document.createElement("template");

const hitId = "hit";

template.innerHTML = html`
  <style>
    .wrapper {
      display: flex;
      justify-content: center;
    }

    .wrapper > div {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    td {
      text-align: right;
    }
  </style>

  <div class="wrapper">
    <div>
      <header>Dragon Stats</header>
      <main>
        <table>
          <tr>
            <th>HP</th>
            <td id="${hitId}"></td>
          </tr>
        </table>
      </main>
    </div>
  </div>
`;

class El extends HTMLElement {
  #hit: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const getElementById = getElementByIdFactory(root);

    this.#hit = getElementById(hitId);
  }

  set hit(hit: number) {
    this.#hit.textContent = hit.toString();
  }
}

customElements.define("dragon-stats", El);

export const createDragonStats = (): BattleView => {
  const el = new El();

  const update: BattleView["update"] = (battle) => {
    el.hit = battle.dragon.stats.hit;
  };

  const view: BattleView = {
    el,
    update,
  };

  return view;
};
