import Waffle from '~/database/Waffle'

import { WaffleToppingType } from '~/lists/waffle-toppings'
import { WaffleBaseType } from '~/lists/waffle-bases'

const loadFavorites = (): number[] => {
  const favorites = JSON.parse(localStorage.getItem('favorites'))
  return favorites || []
}

const saveFavorites = (favorites: number[]) => {
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

export default {
  actions: {
    injectWaffles (_: any) {
      Waffle.insert({
        data: {
          id: 1,
          owner: '0xcBF5693a407d42CF2c31f9C93E28E0fF2593F19c',
          name: 'The Penetrator',
          description: 'This is just plain and simply wrong and yet you will vote for it anyways',
          layers: [
            {
              toppingType: WaffleToppingType.Bacon,
              baseType: WaffleBaseType.Blueberry
            },
            {
              toppingType: WaffleToppingType.MMS,
              baseType: WaffleBaseType.CoffeeLiqueur
            },
            {
              toppingType: WaffleToppingType.Sprinkles,
              baseType: WaffleBaseType.Butter
            },
            {
              toppingType: WaffleToppingType.AppleCrumble,
              baseType: WaffleBaseType.BrownSugar
            },
            {
              toppingType: WaffleToppingType.ChocolateXDFace,
              baseType: WaffleBaseType.GreekYogurt
            }
          ],
          favorite: true
        }
      })
    },

    createWaffle () {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      this.$drizzle.contracts.WaffleMaker.methods.createWaffle().send({ from: activeAccount })
    },

    voteWaffle (_, waffleId) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      this.$drizzle.contracts.WaffleMaker.methods.voteWaffle(waffleId).send({ from: activeAccount })
    },

    setWaffleFavorite (_, { waffleId, value }) {
      const favorites = loadFavorites()
      const waffleFavoriteIndex = favorites.indexOf(waffleId)
      if (value && waffleFavoriteIndex !== -1) {
        favorites.push(waffleId)
      } else if (!value && waffleFavoriteIndex === -1) {
        favorites.splice(waffleFavoriteIndex, 1)
      }
      saveFavorites(favorites)
    }
  },

  getters: {
    getActiveAccountWaffles () {
      return Waffle
        .query()
        .withAllRecursive(1)
        .all()
    },

    getWafflebyId () {
      return (id: number) => {
        return Waffle
          .query()
          .withAllRecursive(1)
          .find(id)
      }
    },

    getFavoriteWaffles () {
      return Waffle
        .query()
        .withAllRecursive(1)
        .where('favorite', true)
        .all()
    }
  }
}
