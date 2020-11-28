export const state = () => {
  return {
    confirmLabel: null,
    confirmAction: null,

    loadingLabel: null,
    errorLabel: null
  }
}

export const mutations = {
  setConfirmLabel (state, { label, action }) {
    state.confirmLabel = label
    state.confirmAction = null
  },
  setProcessingLabel (state, loadingLabel) {
    state.error = error
    state.label = null
  },
  setErrorLabel (state, errorLabel) {

  }
}

export const actions = {
  confirm ({ commit }, { label, action }) {
    commit('setConfirmLabel')
  },
  error ({ commit }, {})
}

export const getters = {

}
