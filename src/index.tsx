import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import '@reach/dialog/styles.css'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'

import { LanguageProvider } from './i18n'
import { NetworkContextName } from './constants/misc'
import App from './pages/App'
import store from './state'
import { GlobalStyle, theme, ThemedGlobalStyle } from './theme'
import { ThemeProvider } from 'styled-components'
import getLibrary from './utils/getLibrary'
import ApplicationUpdater from './state/application/updater'
import { getToken, verify } from './utils/user'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
    </>
  )
}

async function init() {
  const verified = await verify()
  if (!verified) {
    const token = await getToken()
    if (token === null) {
      alert("Failed to authenticate app!!")
      return
    }
    window.location.reload()
  }
}

init()

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <Provider store={store}>
      <LanguageProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Updaters />
            <ThemeProvider theme={theme}>
              <ThemedGlobalStyle />
              <HashRouter>
                <App />
              </HashRouter>
            </ThemeProvider>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </LanguageProvider>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
