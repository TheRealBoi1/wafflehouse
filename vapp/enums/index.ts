export enum DialogType {
  Closed,
  Process,
  Confirm,
  Spending,
  Error
}

export enum WaffleStatus {
  Idle,
  Burned,
  Baking,
  AddingLayer,
  Customizing,
  WaitingPlate,
  WaitingBase,
  WaitingTopping,
  WaitingExtra
}

export enum CustomizationStep {
  NOT_CUSTOMIZED,
  PLATE,
  BASE,
  TOPPING,
  EXTRA,
  DONE
}
