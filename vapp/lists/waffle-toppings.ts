export enum WaffleToppingType {
  Empty,
  FriedEgg,
  SlicedBananas,
  Bacon,
  CrushedPeanuts,
  Sprinkles,
  ChocolateChunks,
  Blueberries,
  Cherry,
  FruitMix,
  GratedCheese,
  HersheyKiss,
  PocketCoffee,
  ChocolateSmileyFace,
  ChocolateXDFace,
  BlueberryYFLLogo,
  MulticolorHarmonyLogo,
  PurpleBONKLogo,
  Raisins,
  AppleCrumble,
  MMS,
  VanillaIceCreamScoop,
  StrawberryIceCreamScoop
}

export interface WaffleToppingData {
  name: string;
  image: any;
}

type WaffleToppingList = {
  [index in WaffleToppingType]: WaffleToppingData;
};

const waffleToppingList: WaffleToppingList = {
  [WaffleToppingType.Empty]: {
    name: 'Empty',
    image: require('~/static/waffles/empty.png')
  },
  [WaffleToppingType.FriedEgg]: {
    name: 'Fried Egg',
    image: require('~/static/waffles/toppings/friedegg.png')
  },
  [WaffleToppingType.SlicedBananas]: {
    name: 'Sliced Bananas',
    image: require('~/static/waffles/toppings/slicedbananas.png')
  },
  [WaffleToppingType.Bacon]: {
    name: 'BACON!',
    image: require('~/static/waffles/toppings/bacon.png')
  },
  [WaffleToppingType.CrushedPeanuts]: {
    name: 'Crushed Peanuts',
    image: require('~/static/waffles/toppings/chocolatechunks.png') // To change
  },
  [WaffleToppingType.Sprinkles]: {
    name: 'Sprinkles',
    image: require('~/static/waffles/toppings/sprinkles.png')
  },
  [WaffleToppingType.ChocolateChunks]: {
    name: 'Chocolate Chunks',
    image: require('~/static/waffles/toppings/chocolatechunks.png')
  },
  [WaffleToppingType.Blueberries]: {
    name: 'Blueberries',
    image: require('~/static/waffles/toppings/blueberries.png')
  },
  [WaffleToppingType.Cherry]: {
    name: 'Cherry',
    image: require('~/static/waffles/toppings/cherry.png')
  },
  [WaffleToppingType.FruitMix]: {
    name: 'Fruit Mix',
    image: require('~/static/waffles/toppings/chocolatechunks.png') // To change
  },
  [WaffleToppingType.GratedCheese]: {
    name: 'Grated Cheese',
    image: require('~/static/waffles/toppings/gratedcheese.png')
  },
  [WaffleToppingType.HersheyKiss]: {
    name: 'Hershey Kiss',
    image: require('~/static/waffles/toppings/hersheykiss.png')
  },
  [WaffleToppingType.PocketCoffee]: {
    name: 'Pocket Coffee',
    image: require('~/static/waffles/toppings/chocolatechunks.png') // To change
  },
  [WaffleToppingType.ChocolateSmileyFace]: {
    name: 'Chocolate Smiley Face',
    image: require('~/static/waffles/toppings/chocolatechunks.png') // To change
  },
  [WaffleToppingType.ChocolateXDFace]: {
    name: 'Chocolate XD Face',
    image: require('~/static/waffles/toppings/xdfacechocolate.png')
  },
  [WaffleToppingType.BlueberryYFLLogo]: {
    name: 'Blueberry YFL Logo',
    image: require('~/static/waffles/toppings/blueberryyfllogo.png')
  },
  [WaffleToppingType.MulticolorHarmonyLogo]: {
    name: 'Multicolor Harmony Logo',
    image: require('~/static/waffles/toppings/creamharmonylogo.png')
  },
  [WaffleToppingType.PurpleBONKLogo]: {
    name: 'Crispy BONK Logo',
    image: require('~/static/waffles/toppings/bonklogo.png')
  },
  [WaffleToppingType.Raisins]: {
    name: 'Raisins',
    image: require('~/static/waffles/toppings/raisins.png')
  },
  [WaffleToppingType.AppleCrumble]: {
    name: 'Apple Crumble',
    image: require('~/static/waffles/toppings/chocolatechunks.png') // To change
  },
  [WaffleToppingType.MMS]: {
    name: 'M&Ms',
    image: require('~/static/waffles/toppings/mms.png')
  },
  [WaffleToppingType.VanillaIceCreamScoop]: {
    name: 'Vanilla Ice Cream Scoop',
    image: require('~/static/waffles/toppings/icecreamvanilla.png')
  },
  [WaffleToppingType.StrawberryIceCreamScoop]: {
    name: 'Strawberry Ice Cream Scoop',
    image: require('~/static/waffles/toppings/icecreamstrawberry.png')
  }
}

export default waffleToppingList
