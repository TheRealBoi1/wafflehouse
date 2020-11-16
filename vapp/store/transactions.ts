export const state = () => {
  return {
    label: null,
    error: null
  }
}

export const mutations = {
  setTransactionLabel (state, label) {
    state.label = label
    state.error = null
  },
  setTransactionError (state, error) {
    state.error = error
    state.label = null
  }
}

export const actions = {
  dispatchTransaction ({ commit }, { label, transaction, successCallback }) {
    commit('setTransactionLabel', label)
    transaction
      .on('error', () => {
        commit('setTransactionError', 'Transaction Failed')
      })
      .then(() => {
        commit('setTransactionLabel', null)
        if (successCallback) {
          successCallback()
        }
      })
  },

  clearError ({ commit }: any) {
    commit('setTransactionError', null)
  }
}

export const getters = {
  getTransactionLabel (state) {
    return state.label
  },

  getTransactionError (state) {
    return state.error
  }
}
