import Waffle from '~/database/Waffle'
import WaffleLayer from "~/database/WaffleLayer";

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

          // layers is an array and is misinterpreted by insertOrUpdate if we don't convert
          const layers = waffleInfo.layers.map((layer, index) => {
            return {
              layerIndex: index,
              baseId: layer.baseId,
              toppingId: layer.toppingId
            }
          })

          await Waffle.insertOrUpdate({
            data: {
              id: waffleId,
              favorite: waffleFavorite,
              name: waffleInfo.name,
              description: waffleInfo.description,
              votes: waffleInfo.votes,
              extraId: waffleInfo.extraId,
              plateId: waffleInfo.plateId,
              published: waffleInfo.published,
              processEnd: waffleInfo.processEnd,
              customizationStep: waffleInfo.customizationStep,
              dataKey,
              layers
            }
          })
        }
      }))
    },

    refreshFromCachedCalls () {
      const drizzleState = this.$drizzle.store.getState()

      const waffles = Waffle.query().withAllRecursive(1).all()
      waffles.forEach(async (waffle: Waffle) => {
        const waffleInfo = drizzleState.contracts.WaffleMaker.getWaffleInfo[waffle.dataKey].value

        // layers is an array and is misinterpreted by insertOrUpdate if we don't convert
        const layersData = waffleInfo.layers.map((layer, index) => {
          return {
            layerIndex: index,
            baseId: layer.baseId,
            toppingId: layer.toppingId
          }
        })

        await Waffle.insertOrUpdate({
          data: {
            id: waffle.id,
            name: waffleInfo.name,
            description: waffleInfo.description,
            votes: waffleInfo.votes,
            extraId: waffleInfo.extraId,
            plateId: waffleInfo.plateId,
            published: waffleInfo.published,
            processEnd: waffleInfo.processEnd,
            customizationStep: waffleInfo.customizationStep,
          }
        })

        layersData.forEach((layerData, index) => {
          if(index >= waffle.layers.length) {
            WaffleLayer.insert({
              data: {
                waffleId: waffle.id,
                ...layerData
              }
            })
          } else {
            WaffleLayer.update({
              where: (layer) => {
                return layer.waffleId === waffle.id && layer.layerIndex === layerData.layerIndex
              },
              data: {
                baseId: layerData.baseId,
                toppingId: layerData.toppingId
              }
            })
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
        transaction: this.$drizzle.contracts.WaffleMaker.methods.createWaffle().send({ from: activeAccount })
      }, { root: true })
    },

    submitWaffleCustomization ({ dispatch }: any, { waffleId, name, description, baseId, toppingId, extraId, plateId }) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      dispatch('transactions/dispatchTransaction', {
        label: 'Customizing Waffle',
        transaction: this.$drizzle.contracts.WaffleMaker.methods.submitWaffleCustomization(waffleId, name, description, baseId, toppingId, extraId, plateId).send({ from: activeAccount })
      }, { root: true })
    },

    advanceWaffleCustomizationStep ({ dispatch }: any, waffleId: number) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      dispatch('transactions/dispatchTransaction', {
        label: 'Adding Ingredient',
        transaction: this.$drizzle.contracts.WaffleMaker.methods.advanceWaffleCustomizationStep(waffleId).send({ from: activeAccount })
      }, { root: true })
    },

    bakeWaffleLayer({ dispatch }: any, waffleId: number) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      dispatch('transactions/dispatchTransaction', {
        label: 'Adding Waffle Layer',
        transaction: this.$drizzle.contracts.WaffleMaker.methods.bakeWaffleLayer(waffleId).send({ from: activeAccount })
      }, { root: true })
    },

    publishWaffle ({ dispatch }: any, waffleId) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      dispatch('transactions/dispatchTransaction', {
        label: 'Publishing Waffle',
        transaction: this.$drizzle.contracts.WaffleMaker.methods.publishWaffle(waffleId).send({ from: activeAccount })
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
        .with('layers', (query) => {
          query.orderBy('layerIndex')
        })
        .all()
    },

    getWafflebyId () {
      return (id: number) => {
        return Waffle
          .query()
          .with('layers', (query) => {
            query.orderBy('layerIndex')
          })
          .find(id)
      }
    },

    getFavoriteWaffles () {
      return Waffle
        .query()
        .withAllRecursive(1)
        .with('layers', (query) => {
          query.orderBy('layerIndex')
        })
        .all()
    }
  }
}
