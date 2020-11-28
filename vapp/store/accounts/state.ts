const state = () => {
  return {
    activeAccount: null as string,
    ownedWaffleIds: [] as number[],
    votedWaffleIds: [] as number[],

    dataKey: null as string
  }
}

export type AccountsState = ReturnType<typeof state>

export default state
