import { GetterTree } from 'vuex'
import { AccountsState } from '~/store/accounts/state'
import { RootState } from '~/store/state'

const abbreviateAddress: Function = (address: string) => {
  const begin = address.slice(0, 6)
  const end = address.slice(38)
  return `${begin}...${end}`
}

const getters: GetterTree<AccountsState, RootState> = {
  getActiveAccount ({ activeAccount }) {
    return activeAccount
  },
  getActiveAccountAbbreviated ({ activeAccount }) {
    return abbreviateAddress(activeAccount)
  },
  isAccountActive ({ activeAccount }) {
    return activeAccount != null
  },

  getOwnedWaffleIds ({ ownedWaffleIds }) {
    return ownedWaffleIds
  },

  getVotedWaffleIds ({ votedWaffleIds }) {
    return votedWaffleIds
  }
}

export default getters
