import { Context, Inject } from '@nuxt/types/app'
import Web3Modal from 'web3modal'

import Waffle from '~/database/Waffle'

export default ({ store }: Context, inject: Inject) => {
  const providerOptions = {
    /* See Provider Options Section */
  }

  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions // required
  })

  inject('web3Modal', web3Modal)
  if (web3Modal.cachedProvider) {
    store.dispatch('initiateWeb3')
  }

  Waffle.dispatch('injectWaffles')
}
