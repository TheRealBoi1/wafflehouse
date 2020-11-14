import { Model } from '@vuex-orm/core'

import WaffleLayer from '~/database/WaffleLayer'
import plateList, { WafflePlateType } from '~/lists/waffle-plates'

export default class Waffle extends Model {
  static entity = 'waffles'

  static fields () {
    return {
      id: this.number(-1),
      owner: this.string(''),
      name: this.string(''),
      description: this.string(''),
      votes: this.number(0),
      plateType: this.number(WafflePlateType.Empty),
      favorite: this.boolean(false),

      layers: this.hasMany(WaffleLayer, 'waffleId')
    }
  }

  get plate () {
    return plateList[this.plateType]
  }
};
