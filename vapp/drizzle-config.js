import WaffleMaker from '@/contracts/WaffleMaker.json'

export default (provider) => {
  return {
    contracts: [WaffleMaker],
    polls: {
      accounts: 1500
    },
    web3: {
      fallback: {
        type: 'ws',
        url: 'ws://127.0.0.1:8545'
      }
    }
  }
}
