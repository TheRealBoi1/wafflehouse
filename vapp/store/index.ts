import database from '@/database'
import VuexORM from '@vuex-orm/core'

import Web3 from 'web3'
import { Drizzle } from '@drizzle/store'
import drizzleConfig from '@/drizzle-config'
import Waffle from '~/database/Waffle'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => {
  return {
    dataLoading: false
  }
}

export const mutations = {
  setDataLoading (state, value: boolean) {
    state.dataLoading = value
  }
}

export const actions = {
  async initiateWeb3 ({ dispatch, commit }) {
    const provider = await this.$web3Modal.connect()
    provider.on('accountsChanged', async () => {
      commit('setDataLoading', true)
      await dispatch('accounts/refreshAccount', null, { root: true })
      commit('setDataLoading', false)
    })
    commit('setDataLoading', true)

    const setupDataRefresh = () => {
      setInterval(() => {
        dispatch('refreshFromCachedCalls')
      }, 10000)
    }

    this.$web3 = new Web3(provider)
    this.$drizzle = new Drizzle(drizzleConfig(this.$web3))

    const thisRef = this
    const interval = setInterval(async () => {
      const state = thisRef.$drizzle.store.getState()
      if (state.drizzleStatus.initialized) {
        await dispatch('accounts/refreshAccount', null, { root: true })
        commit('setDataLoading', false)
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
  }
}

export const getters = {
  isDataLoading (state) {
    return state.dataLoading
  }
}

export const strict = false
