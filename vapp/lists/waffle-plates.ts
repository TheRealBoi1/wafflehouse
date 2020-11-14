export enum WafflePlateType {
  Empty,
  Plain,
  Black,
  Pink,
  Orange,
  Blue,
  Purple,
  Red,
  Yellow,
  Glass,
  Gold
}

export interface PlateData {
  name: string;
  image: any;
}

type PlateList = {
  [index in WafflePlateType]: PlateData;
};

const plateList: PlateList = {
  [WafflePlateType.Empty]: {
    name: 'Empty',
    image: require('~/static/waffles/empty.png')
  },
  [WafflePlateType.Plain]: {
    name: 'Plain Plate',
    image: require('~/static/waffles/plates/plain.png')
  },
  [WafflePlateType.Black]: {
    name: 'Black Plate',
    image: require('~/static/waffles/plates/black.png')
  },
  [WafflePlateType.Pink]: {
    name: 'Pink Plate',
    image: require('~/static/waffles/plates/pink.png')
  },
  [WafflePlateType.Orange]: {
    name: 'Orange Plate',
    image: require('~/static/waffles/plates/orange.png')
  },
  [WafflePlateType.Blue]: {
    name: 'Blue Plate',
    image: require('~/static/waffles/plates/blue.png')
  },
  [WafflePlateType.Purple]: {
    name: 'Purple Plate',
    image: require('~/static/waffles/plates/purple.png') // To change
  },
  [WafflePlateType.Red]: {
    name: 'Red Plate',
    image: require('~/static/waffles/plates/red.png')
  },
  [WafflePlateType.Yellow]: {
    name: 'Yellow Plate',
    image: require('~/static/waffles/plates/yellow.png')
  },
  [WafflePlateType.Glass]: {
    name: 'Glass Plate',
    image: require('~/static/waffles/plates/glass.png')
  },
  [WafflePlateType.Gold]: {
    name: 'Gold Plate',
    image: require('~/static/waffles/plates/gold.png')
  }
}

export default plateList
