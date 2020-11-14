export enum WaffleBaseType {
  Empty,
  Chocolate,
  Blueberry,
  Raspberry,
  BrownSugar,
  Cinnamon,
  AppleButter,
  Molasses,
  Butter,
  Cranberry,
  Maple,
  Caramel,
  GreekYogurt,
  AlmondButter,
  AlmondButterJelly,
  PeanutButter,
  PeanutButterJelly,
  Nutella,
  MarshmallowCream,
  WhippedCream,
  Honey,
  CreamCheese,
  CoconutSyrup,
  SrirachaHotSauce,
  MeltedCheese,
  GlazedSugar,
  CoffeeLiqueur,
  AppleSauce,
  Lemon
}

export interface BaseData {
  name: string;
  image: any;
}

type BaseList = {
  [index in WaffleBaseType]: BaseData;
};

const baseList: BaseList = {
  [WaffleBaseType.Empty]: {
    name: 'Empty',
    image: require('~/static/waffles/empty.png')
  },
  [WaffleBaseType.Chocolate]: {
    name: 'Chocolate Syrup',
    image: require('~/static/waffles/bases/chocolate.png')
  },
  [WaffleBaseType.Blueberry]: {
    name: 'Blueberry Syrup',
    image: require('~/static/waffles/bases/blueberry.png')
  },
  [WaffleBaseType.Raspberry]: {
    name: 'Raspberry Syrup',
    image: require('~/static/waffles/bases/raspberry.png')
  },
  [WaffleBaseType.BrownSugar]: {
    name: 'Brown Sugar',
    image: require('~/static/waffles/bases/almondbutter.png') // To change
  },
  [WaffleBaseType.Cinnamon]: {
    name: 'Cinnamon',
    image: require('~/static/waffles/bases/almondbutter.png') // To change
  },
  [WaffleBaseType.AppleButter]: {
    name: 'Apple Butter',
    image: require('~/static/waffles/bases/almondbutter.png') // To change
  },
  [WaffleBaseType.Molasses]: {
    name: 'Molasses',
    image: require('~/static/waffles/bases/molasses.png')
  },
  [WaffleBaseType.Butter]: {
    name: 'Butter',
    image: require('~/static/waffles/bases/butter.png')
  },
  [WaffleBaseType.Cranberry]: {
    name: 'Cranberry Syrup',
    image: require('~/static/waffles/bases/cranberry.png')
  },
  [WaffleBaseType.Maple]: {
    name: 'Maple Syrup',
    image: require('~/static/waffles/bases/maple.png')
  },
  [WaffleBaseType.Caramel]: {
    name: 'Caramel',
    image: require('~/static/waffles/bases/almondbutter.png') // To change
  },
  [WaffleBaseType.GreekYogurt]: {
    name: 'Greek Yogurt',
    image: require('~/static/waffles/bases/yogurt.png')
  },
  [WaffleBaseType.AlmondButter]: {
    name: 'Almond Butter',
    image: require('~/static/waffles/bases/almondbutter.png')
  },
  [WaffleBaseType.AlmondButterJelly]: {
    name: 'Almond Butter Jelly',
    image: require('~/static/waffles/bases/almondbutterjelly.png')
  },
  [WaffleBaseType.PeanutButter]: {
    name: 'Peanut Butter',
    image: require('~/static/waffles/bases/peanutbutter.png')
  },
  [WaffleBaseType.PeanutButterJelly]: {
    name: 'Peanut Butter Jelly',
    image: require('~/static/waffles/bases/peanutbutterjelly.png')
  },
  [WaffleBaseType.Nutella]: {
    name: 'Nutella',
    image: require('~/static/waffles/bases/nutella.png')
  },
  [WaffleBaseType.MarshmallowCream]: {
    name: 'Marshmallow Cream',
    image: require('~/static/waffles/bases/almondbutter.png') // To change
  },
  [WaffleBaseType.WhippedCream]: {
    name: 'Whipped Cream',
    image: require('~/static/waffles/bases/whippedcream.png')
  },
  [WaffleBaseType.Honey]: {
    name: 'Honey',
    image: require('~/static/waffles/bases/almondbutter.png') // To change
  },
  [WaffleBaseType.CreamCheese]: {
    name: 'Cream Cheese',
    image: require('~/static/waffles/bases/almondbutter.png') // To change
  },
  [WaffleBaseType.CoconutSyrup]: {
    name: 'Coconut Syrup',
    image: require('~/static/waffles/bases/coconut.png')
  },
  [WaffleBaseType.SrirachaHotSauce]: {
    name: 'Sriracha Hot Sauce',
    image: require('~/static/waffles/bases/sriracha.png')
  },
  [WaffleBaseType.MeltedCheese]: {
    name: 'Melted Cheese',
    image: require('~/static/waffles/bases/meltedcheese.png')
  },
  [WaffleBaseType.GlazedSugar]: {
    name: 'Glazed Sugar',
    image: require('~/static/waffles/bases/almondbutter.png') // To change
  },
  [WaffleBaseType.CoffeeLiqueur]: {
    name: 'Coffee Liqueur',
    image: require('~/static/waffles/bases/coffeeliqueur.png')
  },
  [WaffleBaseType.AppleSauce]: {
    name: 'Apple Sauce',
    image: require('~/static/waffles/bases/applesauce.png')
  },
  [WaffleBaseType.Lemon]: {
    name: 'Lemon Syrup',
    image: require('~/static/waffles/bases/almondbutter.png') // To change
  }
}

export default baseList
