import { InjectedConnector } from '@web3-react/injected-connector'

import { NetworkConnector } from './NetworkConnector'
import { SupportedChainId } from '../constants/chains'

const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [SupportedChainId.MAINNET, SupportedChainId.LOCAL]

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY

if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}

const NETWORK_URLS: {
  [chainId in SupportedChainId]: string
} = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.LOCAL]: `http://localhost:8545`,
}

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: 1,
})

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})
