import { CardData } from "./core/state.js";

const { random, floor } = Math;

export const html = (
  templateStrings: TemplateStringsArray,
  ...substitutions: string[]
) => {
  let result = "";

  for (let i = 0; i < templateStrings.length; i++) {
    result += templateStrings[i];
    if (i < substitutions.length) result += substitutions[i];
  }

  return result;
};

export const getElementByIdFactory = (shadow: ShadowRoot) => (id: string) => {
  const el = shadow.getElementById(id);
  if (el === null) throw new Error(`#${id} is null`);
  return el;
};

type SelectorMap = {
  button: HTMLButtonElement;
  h1: HTMLHeadingElement;
  h2: HTMLHeadingElement;
  h3: HTMLHeadingElement;
  header: HTMLElement;
  main: HTMLElement;
  p: HTMLParagraphElement;
  pre: HTMLPreElement;
  tbody: HTMLTableSectionElement;
  ul: HTMLUListElement;
};

export const querySelectorFactory =
  (shadow: ShadowRoot) =>
  <S extends keyof SelectorMap>(selector: S): SelectorMap[S] => {
    // const test = shadow.querySelector("tbody");
    const el = shadow.querySelector(selector);
    if (el === null) throw new Error(`${selector} is null`);
    return el;
  };

export const queryTemplateFactory =
  (template: HTMLTemplateElement) =>
  <S extends keyof SelectorMap>(selector: S): SelectorMap[S] => {
    const el = template.querySelector(selector);
    if (el === null) throw new Error(`${selector} is null`);
    return el;
  };

export const shuffle = (cards: CardData[]): CardData[] => {
  const shuffled: CardData[] = [];

  let deck = cards;
  while (deck.length > 0) {
    const i = floor(random() * deck.length);

    const card = deck[i];
    if (typeof card === "undefined")
      throw new Error(`No card at index ${i} in deck ${deck}`);
    shuffled.push(card);

    deck.splice(i, 1);
  }

  return shuffled;
};

export const createShadowRoot = (
  element: Element,
  template: HTMLTemplateElement
) => {
  element.attachShadow({ mode: "open" });
  const root = element.shadowRoot;
  if (root === null) throw new Error("root is null");

  root.appendChild(template.content.cloneNode(true));

  const querySelector = querySelectorFactory(root);
  const getElementById = getElementByIdFactory(root);

  return {
    root,
    querySelector,
    getElementById,
  };
};
