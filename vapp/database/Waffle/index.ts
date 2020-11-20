import { Model } from '@vuex-orm/core'

import WaffleLayer from '~/database/WaffleLayer'

export default class Waffle extends Model {
  static entity = 'waffles'

  id: number;
  owner: string;
  name: string;
  description: string;
  votes: number;
  favorite: boolean;
  extraId: number;
  plateId: number;
  actionStart: number;
  dataKey: string;

  static fields () {
    return {
      id: this.number(-1),
      owner: this.string(''),
      name: this.string(''),
      description: this.string(''),
      votes: this.number(0),
      favorite: this.boolean(false),
      extraId: this.number(0),
      plateId: this.number(0),
      actionStart: this.number(0),

      layers: this.hasMany(WaffleLayer, 'waffleId'),
      customizedLayersCount: this.number(0),

      dataKey: this.string(null)
    }
  }

  get actionEnd () {
    return this.actionStart + 60 * 60 * 24
  }

  get isActionInProgress () {
    const currentTimestamp = Math.round((new Date()).getTime() / 1000)
    return currentTimestamp < this.actionEnd
  }
};
