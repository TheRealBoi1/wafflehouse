export const state = () => {
  return {
    confirmLabel: null,
    confirmAction: null,
    loadingLabel: null,
    errorLabel: null,

    dataLoading: false,
    now: 0
  }
}

export const mutations = {
  setConfirmLabel (state, { label, action }) {
    state.confirmLabel = label
    state.confirmAction = null
  },
  setLoadingLabel (state, loadingLabel) {
    state.error = error
    state.label = null
  },
  setErrorLabel (state, errorLabel) {

  }
}

export const actions = {
  confirm ({ commit }, {label, action}) {
    commit('setConfirmLabel')
  }
}

export const getters = {

}
