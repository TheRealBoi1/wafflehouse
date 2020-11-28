export default {
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
