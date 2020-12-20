import { Environment, WalletType } from '~/enums'
import { Wallet } from '~/interfaces'

const wallet: Wallet = {
  name: 'Math Wallet',
  note: 'If already installed, make sure the network is set to "Harmony"',
  image: require('~/static/logos/mathwallet.png'),
  type: WalletType.MATH,
  supportedEnvironments: {
    [Environment.Ios]: {
      link: 'https://apps.apple.com/us/app/math-wallet-blockchain-wallet/id1383637331'
    },
    [Environment.Android]: {
      link: 'https://play.google.com/store/apps/details?id=com.medishares.android'
    },
    [Environment.Chromium]: {
      link: 'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc'
    }
  },

  isWalletAvailable (): boolean {
    return window.harmony
  },

  async signIn (): Promise<void> {
    await window.harmony.getAccount()
  },

  async getAccount (): Promise<string> {
    return await window.harmony.getAccount()
  },

  async signTransaction (txn) {
    const account = await this.getAccount()
    txn.from = account.address
    return window.harmony.signTransaction(txn)
  },

  attachToContract (contract) {
    contract.wallet.signTransaction = async (tx) => {
      try {
        return await this.signTransaction(tx)
      } catch (err) {
        if (err.type === 'locked') {
          alert(
            'Your MathWallet is locked! Please unlock it and try again!'
          )
          return Promise.reject()
        } else if (err.type === 'networkError') {
          await this.signIn()
          this.initWallet()

          try {
            tx.from = this.address
            return await this.signTransaction(tx)
          } catch (error) {
            return Promise.reject(error)
          }
        } else {
          alert(
            'An error occurred - please check that you have MathWallet installed and that it is properly configured!'
          )
          return Promise.reject()
        }
      }
    }
  }
}

export default wallet
