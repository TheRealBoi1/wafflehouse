const abbreviateAddress: Function = (address: string) => {
  const begin = address.slice(0, 6)
  const end = address.slice(38)
  return `${begin}...${end}`
}

export const state = () => {
  return {
    activeAccount: null,
    ownedWaffleIds: [],
    votedWaffleIds: [],

    dataKey: null
  }
}

export const mutations = {
  setActiveAccount (state, value: string) {
    state.activeAccount = value
  },

  setAccountWaffleIds (state, { ownedWaffleIds, votedWaffleIds }) {
    state.ownedWaffleIds = ownedWaffleIds
    state.votedWaffleIds = votedWaffleIds
  },

  setDataKey (state, dataKey: string) {
    state.dataKey = dataKey
  }
}

export const actions = {
  async refreshAccount ({ commit, dispatch }: any) {
    if (this.$web3 && this.$drizzle) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      commit('setActiveAccount', activeAccount)

      await dispatch('setupCachedCalls')
    }
  },

  async setupCachedCalls ({ dispatch, commit, getters }) {
    const isAccountActive = getters.isAccountActive
    if (isAccountActive) {
      const activeAccount = getters.getActiveAccount
      const results = await Promise.all([
        this.$drizzle.contracts.WaffleMaker.methods.getProfileInfo.cacheCall(activeAccount),
        this.$drizzle.contracts.WaffleMaker.methods.getProfileInfo(activeAccount).call()
      ])
      const dataKey = results[0]
      const profileInfo = results[1]
      commit('setDataKey', dataKey)
      commit('setAccountWaffleIds', profileInfo)
    }
    dispatch('refreshFromCachedCalls')
  },

  refreshFromCachedCalls ({ state, commit }) {
    const dataKey = state.dataKey
    const drizzleState = this.$drizzle.store.getState()
    if (dataKey && drizzleState.contracts.WaffleMaker.getProfileInfo[dataKey]) {
      const profileInfo = drizzleState.contracts.WaffleMaker.getProfileInfo[dataKey].value
      commit('setAccountWaffleIds', profileInfo)
    } else {
      commit('setAccountWaffleIds', {
        ownedWaffleIds: [],
        votedWaffleIds: []
      })
    }
  }
}

export const getters = {
  getActiveAccount (state: any) {
    return state.activeAccount
  },

  getActiveAccountAbbreviated (state: any) {
    const activeAccount = state.activeAccount
    return abbreviateAddress(activeAccount)
  },

  isAccountActive (state: any) {
    const activeAccount = state.activeAccount
    return activeAccount != null
  },

  getOwnedWaffleIds (state: any) {
    return state.ownedWaffleIds
  },

  getVotedWaffleIds (state: any) {
    return state.votedWaffleIds
  }
}
