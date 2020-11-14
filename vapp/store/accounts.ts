import {Context} from "@nuxt/types";

const abbreviateAddress: Function = (address: string) => {
  const begin = address.slice(0, 6)
  const end = address.slice(38)
  return `${begin}...${end}`
}

export const state = () => {
  return {
    activeAccount: null
  }
}

export const mutations = {
  setActiveAccount (state, value) {
    state.activeAccount = value
  }
}

export const actions = {
  refreshAccounts ({ commit }: any) {
    if (this.$web3) {
      const activeAccount = this.$web3.currentProvider.selectedAddress
      commit('setActiveAccount', activeAccount)
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
  }
}
