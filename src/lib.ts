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
  h1: HTMLHeadingElement;
  main: HTMLElement;
  p: HTMLParagraphElement;
  pre: HTMLPreElement;
  ul: HTMLUListElement;
};

export const querySelectorFactory =
  (shadow: ShadowRoot) =>
  <S extends keyof SelectorMap>(selector: S): SelectorMap[S] => {
    // const test = shadow.querySelector("main");
    const el = shadow.querySelector(selector);
    if (el === null) throw new Error(`${selector} is null`);
    return el;
  };
