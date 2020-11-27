export const state = () => {
  return {
    onePrize: 0,
    yflPrize: 0,
    competitionEndTimestamp: 0
  }
}

export const mutations = {
  setCompetitionData (state, {onePrize, yflPrize, competitionEndTimestamp}) {
    state.onePrize = onePrize
    state.yflPrize = yflPrize
    state.competitionEndTimestamp = competitionEndTimestamp
  }
}

export const actions = {
  async loadCompetitionData ({ commit }) {
    const results = await Promise.all([
      this.$drizzle.contracts.WaffleMaker.methods.competitionEndTimestamp().call()
    ])

    commit('setCompetitionData', {
      competitionEndTimestamp: results[0]
    })
  }
}

export const getters = {
  getOnePrize (state) {
    return state.onePrize
  },
  getYflPrize (state) {
    return state.yflPrize
  },
  getPrizeValue (state) {
    return 0
  },
  getCompetitionEndTimestamp (state) {
    return state.competitionEndTimestamp
  }
}
