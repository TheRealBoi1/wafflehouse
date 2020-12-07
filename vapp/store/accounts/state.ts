const state = () => {
  return {
    activeAccount: null as string,
    ownedWaffleIds: [] as number[],
    votedWaffleIds: [] as number[],
    canVote: false as boolean,

    dataKey: null as string
  }
}

export type AccountsState = ReturnType<typeof state>

export default state
