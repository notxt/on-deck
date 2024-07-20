import { CardData } from "./core/state.js";

export const punchLight: CardData = {
  damage: 1,
  name: "LP",
  recovery: 1,
  recoveryBlock: 3,
  startup: 3,
  stun: 5,
  stunBlock: 1,
  type: "punch",
};

export const punchMedium: CardData = {
  damage: 2,
  name: "MP",
  recovery: 2,
  recoveryBlock: 5,
  startup: 5,
  stun: 7,
  stunBlock: 2,
  type: "punch",
};

export const punchHeavy: CardData = {
  damage: 4,
  name: "HP",
  recovery: 3,
  recoveryBlock: 7,
  startup: 7,
  stun: 7,
  stunBlock: 3,
  type: "punch",
};
