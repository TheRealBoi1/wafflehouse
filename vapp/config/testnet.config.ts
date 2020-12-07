import { ChainID } from '@harmony-js/utils'
import { ProjectConfig } from '~/interfaces'

const config: ProjectConfig = {
  HARMONY_URL: 'https://api.s0.b.hmny.io',
  HARMONY_WS_URL: 'wss://ws.s0.b.hmny.io',
  HARMONY_EXPLORER_URL: 'https://explorer.pops.one/',
  HARMONY_WONE_ADDRESS: '0x7466d7d0C21Fa05F32F5a0Fa27e12bdC06348Ce2',
  HARMONY_CHAIN_ID: ChainID.HmyTestnet,

  ETHEREUM_CHAIN_ID: ChainID.Ropsten
}

export default config
