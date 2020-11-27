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
    dataLoading: false,
    now: 0
  }
}

export const mutations = {
  setDataLoading (state, value: boolean) {
    state.dataLoading = value
  },

  setNow (state, value: number) {
    state.now = value
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
        dispatch('refreshNow')
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
  },

  refreshNow ({ commit }) {
    const now = Math.round((new Date()).getTime() / 1000)
    commit('setNow', now)
  }
}

export const getters = {
  isDataLoading (state) {
    return state.dataLoading
  },

  getNow (state) {
    return state.now
  }
}

export const strict = false
