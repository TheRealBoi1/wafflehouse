import { ActionTree } from 'vuex'
import Web3 from 'web3'
import { Drizzle } from '@drizzle/store'
import { Harmony } from '@harmony-js/core'
import { ChainType } from '@harmony-js/utils'
import drizzleConfig from '~/drizzle-config'
import Waffle from '~/database/Waffle'
import { RootState } from '~/store/state'

const actions: ActionTree<RootState, RootState> = {
  async initiateWeb3 ({ dispatch, commit }) {
    const provider = await this.$web3Modal.connect()
    provider.on('accountsChanged', async () => {
      commit('SET_DATA_LOADING', { dataLoading: true })
      await dispatch('accounts/refreshAccount', null, { root: true })
      commit('SET_DATA_LOADING', { dataLoading: false })
    })
    commit('SET_DATA_LOADING', { dataLoading: true })

    const setupDataRefresh = () => {
      setInterval(() => {
        commit('REFRESH_NOW')
      }, 1000)
      setInterval(() => {
        dispatch('refreshFromCachedCalls')
      }, 5000)
    }

    this.$web3 = new Web3(provider)
    this.$drizzle = new Drizzle(drizzleConfig(this.$web3))

    const thisRef = this
    const interval = setInterval(async () => {
      const state = thisRef.$drizzle.store.getState()
      if (state.drizzleStatus.initialized) {
        await dispatch('accounts/refreshAccount', null, { root: true })
        commit('SET_DATA_LOADING', { dataLoading: false })
        clearInterval(interval)

        setupDataRefresh()
      }
    }, 100)
  },

  async refreshFromCachedCalls ({ dispatch }) {
    await Promise.all([
      dispatch('accounts/refreshFromCachedCalls'),
      Waffle.dispatch('refreshFromCachedCalls')
    ])
  },

  dispatchTransaction ({ dispatch }, { title, transaction, successCallback }) {
    dispatch('dialogs/displayProcess', { title })
    transaction
      .on('error', () => {
        dispatch('dialogs/displayError', {
          body: 'Transaction has failed or has been cancelled'
        })
      })
      .then(() => {
        setTimeout(() => {
          dispatch('refreshFromCachedCalls')
          dispatch('dialogs/closeDialogs')
          if (successCallback) {
            successCallback()
          }
        }, 1000)
      })
  }
}

export default actions
