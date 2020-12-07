import { ChainID } from '@harmony-js/utils'
import { ProjectConfig } from '~/interfaces'

const config: ProjectConfig = {
  HARMONY_URL: 'https://api.s0.t.hmny.io',
  HARMONY_WS_URL: 'wss://ws.s0.t.hmny.io',
  HARMONY_EXPLORER_URL: 'https://explorer.harmony.one/',
  HARMONY_WONE_ADDRESS: '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a',
  HARMONY_CHAIN_ID: ChainID.HmyLocal,

  ETHEREUM_CHAIN_ID: ChainID.Ganache
}

export default config
