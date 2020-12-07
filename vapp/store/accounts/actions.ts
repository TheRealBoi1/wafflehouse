import { ActionTree } from 'vuex'
import { AccountsState } from '~/store/accounts/state'
import { RootState } from '~/store/state'

// ************ ACTIONS *************
const actions: ActionTree<AccountsState, RootState> = {
  async refreshAccount ({ dispatch, commit }) {
    if (this.$web3 && this.$drizzle) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      commit('SET_ACTIVE_ACCOUNT', { activeAccount })

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
      commit('SET_DATA_KEY', { dataKey })
      commit('SET_ACCOUNT_WAFFLE_IDS', {
        ownedWaffleIds: profileInfo.ownedWaffleIds,
        votedWaffleIds: profileInfo.votedWaffleIds,
        canVote: profileInfo.canVote
      })
    }
    dispatch('refreshFromCachedCalls')
  },

  refreshFromCachedCalls ({ state, commit }) {
    const dataKey = state.dataKey
    const drizzleState = this.$drizzle.store.getState()
    if (dataKey && drizzleState.contracts.WaffleMaker.getProfileInfo[dataKey]) {
      const profileInfo = drizzleState.contracts.WaffleMaker.getProfileInfo[dataKey].value
      commit('SET_ACCOUNT_WAFFLE_IDS', profileInfo)
    } else {
      commit('SET_ACCOUNT_WAFFLE_IDS', {
        ownedWaffleIds: [],
        votedWaffleIds: []
      })
    }
  }
}

export default actions
