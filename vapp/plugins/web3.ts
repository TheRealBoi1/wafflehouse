import { Context, Inject } from '@nuxt/types/app'
import Web3Modal from 'web3modal'

export default async ({ store }: Context, inject: Inject) => {
  const providerOptions = {
    /* See Provider Options Section */
  }

  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions // required
  })

  inject('web3Modal', web3Modal)
  if (web3Modal.cachedProvider) {
    await store.dispatch('initiateWeb3')
  }
}
