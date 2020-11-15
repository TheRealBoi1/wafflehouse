import database from '@/database'
import VuexORM from '@vuex-orm/core'

import Web3 from 'web3'
import { Drizzle } from '@drizzle/store'
import drizzleConfig from '@/drizzle-config'

export const plugins = [
  VuexORM.install(database)
]

export const actions = {
  async initiateWeb3 ({ dispatch }: any) {
    const provider = await this.$web3Modal.connect()
    provider.on('accountsChanged', () => {
      dispatch('accounts/refreshAccounts', null, { root: true })
    })

    this.$web3 = new Web3(provider)
    this.$drizzle = new Drizzle(drizzleConfig(provider))
    dispatch('accounts/refreshAccounts', null, { root: true })
  }
}

export const strict = false
