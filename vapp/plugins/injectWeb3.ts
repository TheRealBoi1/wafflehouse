import { Inject } from '@nuxt/types/app'
import { ChainType } from '@harmony-js/utils'
import { Harmony } from '@harmony-js/core'

export default (_, inject: Inject) => {
  const hmy = new Harmony(process.env.HARMONY_URL, {
    chainType: ChainType.Harmony,
    chainId: process.env.HARMONY_CHAIN_ID
  })
  inject('hmy', hmy)

  /* if ($web3Modal.cachedProvider) {
    const ethWeb3 = new Web3(process.env.ETHEREUM_URL)
    inject('ethWeb3', ethWeb3)
  } */
}
