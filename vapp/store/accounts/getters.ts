const abbreviateAddress: Function = (address: string) => {
  const begin = address.slice(0, 6)
  const end = address.slice(38)
  return `${begin}...${end}`
}

export default {
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
