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

    this.$web3ETH = new Web3('https://mainnet.infura.io/v3/8f316b7022c74f6b8262dfca7ba47101')
  }
}

export const strict = false
