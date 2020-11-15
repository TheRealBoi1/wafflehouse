import { Model } from '@vuex-orm/core'

import baseList, { WaffleBaseType } from '~/lists/waffle-bases'
import toppingList, { WaffleToppingType } from '~/lists/waffle-toppings'

export default class WaffleLayer extends Model {
  static entity = 'waffleLayers'

  baseId: WaffleBaseType;
  toppingId: WaffleToppingType;

  static fields () {
    return {
      id: this.uid(),
      waffleId: this.number(-1),
      baseId: this.number(WaffleBaseType.Empty),
      toppingId: this.number(WaffleToppingType.Empty)
    }
  }

  get base () {
    return baseList[this.baseId]
  }

  get topping () {
    return toppingList[this.toppingId]
  }
};
