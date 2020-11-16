import Waffle from '~/database/Waffle'

const loadFavorites = (): number[] => {
  const favorites = JSON.parse(localStorage.getItem('favorites'))
  return favorites || []
}

const saveFavorites = (favorites: number[]) => {
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

export default {
  actions: {
    async setupCachedCalls (_, waffleIds: number[]) {
      const favorites = loadFavorites()
      await Promise.all(waffleIds.map(async (waffleId: number) => {
        const waffleIdNum = Number(waffleId)
        const waffleExists = Waffle.query().where('id', waffleIdNum).exists()
        if (!waffleExists) {
          const results = await Promise.all([
            this.$drizzle.contracts.WaffleMaker.methods.getWaffleInfo.cacheCall(waffleId),
            this.$drizzle.contracts.WaffleMaker.methods.getWaffleInfo(waffleId).call()
          ])

          const dataKey = results[0]
          const waffleInfo = results[1]
          const waffleFavorite = favorites.includes(waffleIdNum)

          await Waffle.insertOrUpdate({
            data: {
              id: waffleId,
              favorite: waffleFavorite,
              dataKey,
              ...waffleInfo
            }
          })
        }
      }))
    },

    refreshFromCachedCalls () {
      const drizzleState = this.$drizzle.store.getState()

      const waffles = Waffle.query().all()
      waffles.forEach((waffle: Waffle) => {
        const waffleInfo = drizzleState.contracts.WaffleMaker.getWaffleInfo[waffle.dataKey].value
        Waffle.update({
          where: waffle.id,
          data: {
            ...waffleInfo
          }
        })
      })
    },

    setupAccountWaffleCachedCalls ({ dispatch, rootGetters }: any) {
      const ownedWaffleIds = rootGetters['accounts/getOwnedWaffleIds']
      dispatch('setupCachedCalls', ownedWaffleIds)
    },

    setupFavoriteWaffleCachedCalls ({ dispatch }: any) {
      const favorites = loadFavorites()
      dispatch('setupCachedCalls', favorites)
    },

    createWaffle ({ dispatch }: any) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      dispatch('transactions/dispatchTransaction', {
        label: 'Creating Waffle',
        transaction: this.$drizzle.contracts.WaffleMaker.methods.createWaffle().send({ from: activeAccount }),
        successCallback: () => {
          this.$router.push('/my-waffles')
        }
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
        console.log(waffleId)
        console.log(typeof waffleId)
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
