import { Model } from '@vuex-orm/core'

import WaffleLayer from '~/database/WaffleLayer'
import plateList, { WafflePlateType } from '~/lists/waffle-plates'

export default class Waffle extends Model {
  static entity = 'waffles'

  id: number;
  owner: string;
  name: string;
  description: string;
  votes: number;
  favorite: boolean;
  plateId: WafflePlateType;
  dataKey: string;

  static fields () {
    return {
      id: this.number(-1),
      owner: this.string(''),
      name: this.string(''),
      description: this.string(''),
      votes: this.number(0),
      favorite: this.boolean(false),
      plateId: this.number(WafflePlateType.Empty),

      layers: this.hasMany(WaffleLayer, 'waffleId'),

      dataKey: this.string(null)
    }
  }

  get plate () {
    return plateList[this.plateId]
  }
};
