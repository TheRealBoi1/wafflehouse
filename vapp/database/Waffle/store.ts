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
              toppingId: WaffleToppingType.Bacon,
              baseId: WaffleBaseType.Blueberry
            },
            {
              toppingId: WaffleToppingType.MMS,
              baseId: WaffleBaseType.CoffeeLiqueur
            },
            {
              toppingId: WaffleToppingType.Sprinkles,
              baseId: WaffleBaseType.Butter
            },
            {
              toppingId: WaffleToppingType.AppleCrumble,
              baseId: WaffleBaseType.BrownSugar
            },
            {
              toppingId: WaffleToppingType.ChocolateXDFace,
              baseId: WaffleBaseType.GreekYogurt
            }
          ],
          favorite: false
        }
      })
    },

    createWaffle ({ dispatch }: any) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      dispatch('transactions/dispatchTransaction', {
        label: 'Creating Waffle',
        transaction: this.$drizzle.contracts.WaffleMaker.methods.createWaffle().send({ from: activeAccount })
      }, { root: true })
    },

    voteWaffle ({ dispatch }: any, waffleId) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      dispatch('transactions/dispatchTransaction', {
        label: 'Voting',
        transaction: this.$drizzle.contracts.WaffleMaker.methods.voteWaffle(waffleId).send({ from: activeAccount })
      }, { root: true })
    },

    setWaffleFavorite (_, { waffleId, value }) {
      const favorites = loadFavorites()
      const waffleFavoriteIndex = favorites.indexOf(waffleId)

      const updateStoreWaffleFavorite = (value: boolean) => {
        Waffle.update({
          where: waffleId,
          data: {
            favorite: value
          }
        })
      }

      if (value && waffleFavoriteIndex === -1) {
        favorites.push(waffleId)
        updateStoreWaffleFavorite(true)
      } else if (!value && waffleFavoriteIndex !== -1) {
        favorites.splice(waffleFavoriteIndex, 1)
        updateStoreWaffleFavorite(false)
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
