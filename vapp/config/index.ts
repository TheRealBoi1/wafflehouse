import mainnet from './mainnet.config'
import testnet from './testnet.config'
import development from './development.config'

require('dotenv').config()

const configs = {
  mainnet,
  testnet,
  development
}

export default configs[process.env.APP_ENVIRONMENT]
