import { Inject } from '@nuxt/types/app'
import hmyWallet from '~/wallets/hmy'
import WaffleMakerJson from '~/contracts/WaffleMaker.json'

export default async ({ $hmy }, inject: Inject) => {
  if (hmyWallet) {
    const contractData = [
      WaffleMakerJson
    ]

    const contracts = {}
    contractData.forEach((data) => {
      if (data.networks[$hmy.chainId]) {
        const contract = $hmy.contracts.createContract(data.abi, data.networks[$hmy.chainId].address)
        hmyWallet.attachToContract(contract)
        contracts[data.contractName] = contract
      }
    })
    inject('hmyContracts', contracts)
  }
}
