import { Model } from '@vuex-orm/core'

import baseList, { WaffleBaseType } from '~/lists/waffle-bases'
import toppingList, { WaffleToppingType } from '~/lists/waffle-toppings'

export default class WaffleLayer extends Model {
  static entity = 'waffleLayers'

  baseType: WaffleBaseType;
  toppingType: WaffleToppingType;

  static fields () {
    return {
      id: this.uid(),
      waffleId: this.number(-1),
      baseType: this.number(WaffleBaseType.Empty),
      toppingType: this.number(WaffleToppingType.Empty)
    }
  }

  get base () {
    return baseList[this.baseType]
  }

  get topping () {
    return toppingList[this.toppingType]
  }
};
