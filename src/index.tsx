import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'

import App from './pages/App'
import { NetworkContextName } from './constants'
import { getLibrary } from './utils/getLibrary'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <App />
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById('root')
)
