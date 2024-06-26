import { TitleAction } from "../action.js";
import { html, querySelectorFactory } from "../lib.js";

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
      <button>Start</button>
    </main>
  </div>
`;

class El extends HTMLElement {
  constructor(start: () => void) {
    super();

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    if (root === null) throw new Error("root is null");

    root.appendChild(template.content.cloneNode(true));

    const querySelector = querySelectorFactory(root);

    const startButton = querySelector("button");
    startButton.onclick = start;
  }
}

customElements.define("title-mode", El);

export const createTitleView = (action: TitleAction) =>
  new El(action.startGame);
