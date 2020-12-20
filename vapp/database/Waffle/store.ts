import Waffle from '~/database/Waffle'
import WaffleLayer from '~/database/WaffleLayer'
import { bnToNumber } from '~/utils/abi'
import { CustomizationStep } from '~/enums'

const loadFavorites = (): number[] => {
  const favorites = JSON.parse(localStorage.getItem('favorites'))
  return favorites || []
}

const saveFavorites = (favorites: number[]) => {
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

const processWaffleInfo = async (waffleId: number, waffleInfo: any) => {
  const favorites = loadFavorites()
  // layers is an array and is misinterpreted by insertOrUpdate if we don't convert
  const layersData = waffleInfo.layers.map((layer, index) => {
    return {
      layerIndex: index,
      baseId: bnToNumber(layer.baseId),
      toppingId: bnToNumber(layer.toppingId)
    }
  })

  await Waffle.insertOrUpdate({
    data: {
      id: waffleId,
      name: waffleInfo.name,
      favorite: favorites.includes(waffleId),
      description: waffleInfo.description,
      votes: bnToNumber(waffleInfo.votes),
      extraId: bnToNumber(waffleInfo.extraId),
      plateId: bnToNumber(waffleInfo.plateId),
      published: waffleInfo.published,
      processEnd: bnToNumber(waffleInfo.processEnd),
      customizationStep: bnToNumber(waffleInfo.customizationStep)
    }
  })

  const currentLayersCount = WaffleLayer.query().where('waffleId', waffleId).count()
  layersData.forEach((layerData, index) => {
    if (index >= currentLayersCount) {
      WaffleLayer.insert({
        data: {
          waffleId,
          ...layerData
        }
      })
    } else {
      WaffleLayer.update({
        where: (layer) => {
          return layer.waffleId === waffleId && layer.layerIndex === layerData.layerIndex
        },
        data: {
          baseId: layerData.baseId,
          toppingId: layerData.toppingId
        }
      })
    }
  })
}

export default {
  actions: {
    loadFavoriteWaffleIds () {
      return loadFavorites()
    },

    async loadWaffles (_, waffleIds: number[]) {
      await Promise.all(waffleIds.map(async (waffleId) => {
        const waffleInfo = await this.$hmyContracts.WaffleMaker.methods.getWaffleInfo(waffleId).call()
        await processWaffleInfo(waffleId, waffleInfo)
      }))
    },

    async loadPublishedWaffles (_, publishedWaffleIndices: number[]) {
      const waffleIds = []
      await Promise.all(publishedWaffleIndices.map(async (publishedWaffleIndex) => {
        const waffleInfo = await this.$hmyContracts.WaffleMaker.methods.getPublishedWaffleInfo(publishedWaffleIndex).call()
        const waffleId = bnToNumber(waffleInfo.id)
        await processWaffleInfo(waffleId, waffleInfo)
        waffleIds.push(waffleId)
      }))
      return waffleIds
    },

    async loadAccountWaffles ({ dispatch, rootGetters }: any) {
      await dispatch('accounts/loadAccountInfo', null, { root: true })
      const ownedWaffleIds = rootGetters['accounts/getOwnedWaffleIds']
      await dispatch('loadWaffles', ownedWaffleIds)
    },

    createWaffle ({ dispatch }: any) {
      const router = this.$router
      const transaction = this.$hmyContracts.WaffleMaker.methods.createWaffle()
      dispatch('dispatchTransaction', {
        title: 'Creating Waffle',
        transaction,
        successCallback () {
          router.push('/my-waffles')
        }
      }, { root: true })
    },

    submitWaffleCustomization ({ dispatch }: any, { waffleId, name, description, baseId, toppingId, extraId, plateId }) {
      const router = this.$router
      const transaction = this.$hmyContracts.WaffleMaker.methods.submitWaffleCustomization(waffleId, name, description, baseId, toppingId, extraId, plateId)
      dispatch('dispatchTransaction', {
        title: 'Customizing Waffle',
        transaction,
        successCallback () {
          router.push('/my-waffles')
        }
      }, { root: true })
    },

    advanceWaffleCustomizationStep ({ dispatch }: any, waffleId: number) {
      const transaction = this.$hmyContracts.WaffleMaker.methods.advanceWaffleCustomizationStep(waffleId)
      dispatch('dispatchTransaction', {
        title: 'Adding Ingredient',
        transaction,
        async successCallback () {
          await dispatch('loadAccountWaffles')
        }
      }, { root: true })
    },

    bakeWaffleLayer ({ dispatch }: any, waffleId: number) {
      const transaction = this.$hmyContracts.WaffleMaker.methods.bakeWaffleLayer(waffleId)
      dispatch('dispatchTransaction', {
        title: 'Adding Waffle Layer',
        transaction,
        async successCallback () {
          await dispatch('loadAccountWaffles')
        }
      }, { root: true })
    },
    bakeWaffleLayerFlow ({ dispatch }, waffleId: number) {
      const waffle = Waffle.query().find(waffleId)
      if (waffle.customizationStep === CustomizationStep.DONE) {
        dispatch('bakeWaffleLayer', waffleId)
      } else {
        dispatch('dialogs/displayError', {
          title: 'Cannot Add Waffle Layer',
          body: 'The top layer of your waffle must be customized before you can add a new layer'
        }, { root: true })
      }
    },

    publishWaffle ({ dispatch }, waffleId: number) {
      const transaction = this.$hmyContracts.WaffleMaker.methods.publishWaffle(waffleId)
      dispatch('dispatchTransaction', {
        title: 'Publishing Waffle',
        transaction,
        async successCallback () {
          await dispatch('loadAccountWaffles')
        }
      }, { root: true })
    },
    publishWaffleFlow ({ dispatch }, waffleId: number) {
      const waffle = Waffle.query().find(waffleId)
      if (waffle.customizationStep === CustomizationStep.DONE) {
        dispatch('dialogs/displayConfirmation', {
          title: 'Publish this waffle?',
          body: 'Your waffle will be open for voting, but you will not be able to customize it further.',
          affirmativeAction: () => {
            dispatch('publishWaffle', waffleId)
          },
          affirmativeLabel: 'Publish Waffle'
        }, { root: true })
      } else {
        dispatch('dialogs/displayError', {
          title: 'Cannot Publish Waffle',
          body: 'The top layer of your waffle must be customized before it can be published'
        }, { root: true })
      }
    },

    voteWaffle ({ dispatch }, waffleId: number) {
      const transaction = this.$hmyContracts.WaffleMaker.methods.voteWaffle(waffleId)
      dispatch('dispatchTransaction', {
        title: 'Voting',
        transaction,
        async successCallback () {
          await dispatch('loadAccountWaffles')
        }
      }, { root: true })
    },
    voteWaffleFlow ({ dispatch, rootGetters }, waffleId: number) {
      const votedWaffleIds = rootGetters['accounts/getVotedWaffleIds']
      const ownedWaffleIds = rootGetters['accounts/getOwnedWaffleIds']
      if (ownedWaffleIds.includes(waffleId)) {
        dispatch('dialogs/displayError', {
          title: 'Vote Failed',
          body: 'This waffle is yours, cheater!',
          actionLabel: 'Dang!'
        }, { root: true })
      } else if (votedWaffleIds.includes(waffleId)) {
        dispatch('dialogs/displayError', {
          title: 'Vote Failed',
          body: 'You can\'t vote for a waffle you\'ve already voted for.'
        }, { root: true })
      } else {
        dispatch('dialogs/displayConfirmation', {
          title: 'Vote For This Waffle?',
          body: `After this vote, this account will be allowed to vote ${votedWaffleIds.length - 1} more times.`,
          affirmativeAction: () => {
            dispatch('voteWaffle', waffleId)
          },
          affirmativeLabel: 'Vote for Waffle'
        }, { root: true })
      }
    },

    setWaffleFavorite (_, { waffleId, value }) {
      const favorites = loadFavorites()
      const waffleFavoriteIndex = favorites.indexOf(waffleId)

      const updateStoreWaffleFavorite = (value: boolean) => {
        Waffle.update({
          where: (waffle) => {
            return waffle.id === waffleId
          },
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
    getActiveAccountWaffles (_, __, ___, rootGetters) {
      const accountWaffles = rootGetters['accounts/getOwnedWaffleIds']
      return Waffle
        .query()
        .whereIdIn(accountWaffles)
        .orderBy('customizationStep')
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

    getWafflesbyIds () {
      return (ids: number[]) => {
        return Waffle
          .query()
          .whereIdIn(ids)
          .with('layers', (query) => {
            query.orderBy('layerIndex')
          })
          .all()
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
