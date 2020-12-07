import { ChainID } from '@harmony-js/utils'

export interface ProjectConfig {
  HARMONY_URL: string;
  HARMONY_WS_URL: string;
  HARMONY_EXPLORER_URL: string;
  HARMONY_WONE_ADDRESS: string;
  HARMONY_CHAIN_ID: ChainID;

  ETHEREUM_CHAIN_ID: ChainID;
}
