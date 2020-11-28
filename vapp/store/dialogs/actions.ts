import { ActionTree } from 'vuex'
import { AccountsState } from '~/store/accounts/state'
import { RootState } from '~/store/state'

// ************ PAYLOADS *************
interface DisplayProcessPayload {
  title: string;
}
interface DisplayConfirmationPayload{
  title?: string;
  body?: string;
  affirmativeAction: Function;
  affirmativeLabel?: string;
  negativeAction?: Function;
  negativeLabel?: string;
}
interface SetErrorDataPayload {
  title?: string;
  body: string;
  action?: Function;
  actionLabel?: string;
}

// ************ ACTIONS *************
const actions: ActionTree<AccountsState, RootState> = {
  displayProcess ({ commit }, payload: DisplayProcessPayload) {
    commit('SET_PROCESS_DATA', payload)
  },
  displayConfirmation ({ commit }, payload: DisplayConfirmationPayload) {
    commit('SET_CONFIRM_DATA', payload)
  },
  displayError ({ commit }, payload: SetErrorDataPayload) {
    commit('SET_ERROR_DATA', payload)
  },
  closeDialogs ({ commit }) {
    commit('CLEAR_DATA')
  }
}

export default actions
