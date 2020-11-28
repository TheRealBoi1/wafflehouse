import { MutationTree } from 'vuex'
import { DialogsState } from '~/store/dialogs/state'
import { DialogType } from '~/interfaces/enums'

// ************ PAYLOADS *************
interface SetProcessDataPayload {
  title: string;
}
interface SetConfirmDataPayload {
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

// ************ MUTATIONS *************
const mutations: MutationTree<DialogsState> = {
  SET_PROCESS_DATA (state, { title }: SetProcessDataPayload) {
    state.title = title
    state.dialogType = DialogType.Process
  },
  SET_CONFIRM_DATA (state, { title, body, affirmativeAction, affirmativeLabel, negativeAction, negativeLabel }: SetConfirmDataPayload) {
    state.title = title || 'Are you sure?'
    state.body = body || ''
    state.affirmativeAction = affirmativeAction
    state.affirmativeLabel = affirmativeLabel || 'Understood'
    state.negativeAction = negativeAction || function () {}
    state.negativeLabel = negativeLabel || 'Nevermind'
    state.dialogType = DialogType.Confirm
  },
  SET_ERROR_DATA (state, { title, body, action, actionLabel }: SetErrorDataPayload) {
    state.title = title || 'Uh oh!'
    state.body = body
    state.affirmativeAction = action || function () {}
    state.affirmativeLabel = actionLabel || 'Understood'
    state.dialogType = DialogType.Error
  },
  CLEAR_DATA (state) {
    state.title = ''
    state.body = ''
    state.affirmativeAction = () => {}
    state.affirmativeLabel = ''
    state.negativeAction = () => {}
    state.negativeLabel = ''
    state.dialogType = DialogType.Closed
  }
}

export default mutations