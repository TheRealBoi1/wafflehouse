export default {
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
