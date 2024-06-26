import { Card } from "./state.js";

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
  main: HTMLElement;
  p: HTMLParagraphElement;
  pre: HTMLPreElement;
  ul: HTMLUListElement;
};

export const querySelectorFactory =
  (shadow: ShadowRoot) =>
  <S extends keyof SelectorMap>(selector: S): SelectorMap[S] => {
    // const test = shadow.querySelector("button");
    const el = shadow.querySelector(selector);
    if (el === null) throw new Error(`${selector} is null`);
    return el;
  };

export const shuffle = (cards: Card[]): Card[] => {
  const shuffled: Card[] = [];

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
