const WaffleMaker = artifacts.require("WaffleMaker");

const bases = [
  {
    name: 'Empty',
    price: 0
  },
  {
    name: 'Chocolate Syrup',
    price: 0
  },
  {
    name: 'Blueberry Syrup',
    price: 0
  },
  {
    name: 'Raspberry Syrup',
    price: 0
  },
  {
    name: 'Brown Sugar',
    price: 0
  },
  {
    name: 'Cinnamon',
    price: 0
  },
  {
    name: 'Apple Butter',
    price: 0
  },
  {
    name: 'Molasses',
    price: 0
  },
  {
    name: 'Butter',
    price: 0
  },
  {
    name: 'Cranberry Syrup',
    price: 0
  },
  {
    name: 'Maple Syrup',
    price: 0
  },
  {
    name: 'Caramel',
    price: 0
  },
  {
    name: 'Greek Yogurt',
    price: 0
  },
  {
    name: 'Almond Butter',
    price: 0
  },
  {
    name: 'Almond Butter Jelly',
    price: 0
  },
  {
    name: 'Peanut Butter',
    price: 0
  },
  {
    name: 'Peanut Butter Jelly',
    price: 0
  },
  {
    name: 'Nutella',
    price: 0
  },
  {
    name: 'Marshmallow Cream',
    price: 0
  },
  {
    name: 'Whipped Cream',
    price: 0
  },
  {
    name: 'Honey',
    price: 0
  },
  {
    name: 'Cream Cheese',
    price: 0
  },
  {
    name: 'Coconut Syrup',
    price: 0
  },
  {
    name: 'Sriracha Hot Sauce',
    price: 0
  },
  {
    name: 'Melted Cheese',
    price: 0
  },
  {
    name: 'Glazed Sugar',
    price: 0
  },
  {
    name: 'Coffee Liqueur',
    price: 0
  },
  {
    name: 'Apple Sauce',
    price: 0
  },
  {
    name: 'Lemon Syrup',
    price: 0
  }
]

const toppings = [
  {
    name: 'Empty',
    price: 0
  },
  {
    name: 'Fried Egg',
    price: 0
  },
  {
    name: 'Sliced Bananas',
    price: 0
  },
  {
    name: 'BACON!',
    price: 0
  },
  {
    name: 'Crushed Peanuts',
    price: 0
  },
  {
    name: 'Sprinkles',
    price: 0
  },
  {
    name: 'Chocolate Chunks',
    price: 0
  },
  {
    name: 'Blueberries',
    price: 0
  },
  {
    name: 'Cherry',
    price: 0
  },
  {
    name: 'Fruit Mix',
    price: 0
  },
  {
    name: 'Grated Cheese',
    price: 0
  },
  {
    name: 'Hershey Kiss',
    price: 0
  },
  {
    name: 'Pocket Coffee',
    price: 0
  },
  {
    name: 'Chocolate Smiley Face',
    price: 0
  },
  {
    name: 'Chocolate XD Face',
    price: 0
  },
  {
    name: 'Blueberry YFL Logo',
    price: 0
  },
  {
    name: 'Multicolor Harmony Logo',
    price: 0
  },
  {
    name: 'Crispy BONK Logo',
    price: 0
  },
  {
    name: 'Raisins',
    price: 0
  },
  {
    name: 'Apple Crumble',
    price: 0
  },
  {
    name: 'M&Ms',
    price: 0
  },
  {
    name: 'Vanilla Ice Cream Scoop',
    price: 0
  },
  {
    name: 'Strawberry Ice Cream Scoop',
    price: 0
  }
]

module.exports = function(deployer) {
  deployer.deploy(WaffleMaker);
};
