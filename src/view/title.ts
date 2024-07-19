import { TitleAction } from "../core/action.js";
import { View } from "../core/view.js";
import { createShadowRoot, html } from "../lib.js";

const template = document.createElement("template");
template.innerHTML = html`
  <style>
    .wrapper {
      align-items: center;
      display: flex;
      height: 100vh;
      justify-content: center;
    }

    main {
      display: flex;
      justify-content: center;
      flex-direction: column;
    }

    h1 {
      text-align: center;
    }
  </style>

  <div class="wrapper">
    <main>
      <h1>
        Super<br />
        Dragon<br />
        Puncher
      </h1>
      <p>[Enter] Start</p>
    </main>
  </div>
`;

class El extends HTMLElement {
  constructor() {
    super();

    createShadowRoot(this, template);
  }
}

customElements.define("title-mode", El);

export const createTitle = (action: TitleAction): View => {
  const el = new El();

  let startGame: () => void | undefined;

  const onKey: View["keyPressed"] = (key) => {
    if (key === "Enter") startGame();
  };

  const update: View["update"] = (data) => {
    if (data.mode !== "title") return;
    startGame = () => action.start(data);
  };

  const view: View = {
    el,
    keyPressed: onKey,
    update,
  };

  return view;
};
