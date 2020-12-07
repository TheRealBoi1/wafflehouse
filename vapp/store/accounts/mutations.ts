import { MutationTree } from 'vuex'
import { AccountsState } from '~/store/accounts/state'

// ************ PAYLOADS *************
interface SetActiveAccountPayload {
  activeAccount: string;
}
interface SetAccountWaffleIdsPayload {
  ownedWaffleIds: number[];
  votedWaffleIds: number[];
  canVote: boolean;
}
interface SetDataKeyPayload {
  dataKey: string;
}

const mutations: MutationTree<AccountsState> = {
  SET_ACTIVE_ACCOUNT (state, { activeAccount }: SetActiveAccountPayload) {
    state.activeAccount = activeAccount
  },

  SET_ACCOUNT_WAFFLE_IDS (state, { ownedWaffleIds, votedWaffleIds, canVote }: SetAccountWaffleIdsPayload) {
    state.ownedWaffleIds = ownedWaffleIds
    state.votedWaffleIds = votedWaffleIds
    state.canVote = canVote
  },

  SET_DATA_KEY (state, { dataKey }: SetDataKeyPayload) {
    state.dataKey = dataKey
  }
}

export default mutations
