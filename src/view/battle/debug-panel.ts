import { BattleAction } from "../../core/action.js";
import { html } from "../../lib.js";
import { BattleView } from "../battle.js";

const template = document.createElement("template");

template.innerHTML = html`
  <style></style>
  <main>
    <div>
      <p>[r] to reset game</p>
    </div>
  </main>
`;

class El extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("debug-panel", El);

export const createDebugPanel = (action: BattleAction): BattleView => {
  const el = new El();

  const onKey: BattleView["onKey"] = (key) => {
    if (key === "r") {
      action.resetGame();
      return;
    }
  };

  const view: BattleView = {
    el,
    onKey,
    update: () => {},
  };

  return view;
};
