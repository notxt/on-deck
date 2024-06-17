export type CardType = "wizard" | "brute" | "knight";

export type Stats = {
  at: number;
  hp: number;
  type: CardType;
  art: string;
};

// prettier-ignore
const wizardArt = 
`>@<
 | ~o~
 |‾‾|‾‾
   / \\`

export const wizard: Stats = {
  at: 9,
  hp: 1,
  type: "wizard",
  art: wizardArt,
};

// prettier-ignore
const knightArt = 
`|  ∩
⌝‾| (+)
  |‾|`;

export const knight: Stats = {
  at: 4,
  hp: 4,
  type: "knight",
  art: knightArt,
};

// prettier-ignore
const bruteArt = 
`  (_ _)
/‾‾   ‾‾\\
L|=====|⅃
 |/   \\|`;

export const brute: Stats = {
  at: 1,
  hp: 9,
  type: "brute",
  art: bruteArt,
};
