import { Card } from "./core/state.js";

export const punchLight: Card = {
  damage: 1,
  name: "light punch",
  recoveryBlock: 3,
  recoveryHit: 1,
  startup: 3,
  stunBlock: 1,
  stunHit: 5,
  type: "punch",
};

export const punchMedium: Card = {
  damage: 2,
  name: "medium punch",
  recoveryBlock: 5,
  recoveryHit: 2,
  startup: 5,
  stunBlock: 2,
  stunHit: 7,
  type: "punch",
};

export const punchHeavy: Card = {
  damage: 4,
  name: "heavy punch",
  recoveryBlock: 7,
  recoveryHit: 3,
  startup: 7,
  stunBlock: 3,
  stunHit: 7,
  type: "punch",
};
