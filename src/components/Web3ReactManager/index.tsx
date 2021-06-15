import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import { network } from '../../connectors'
import { NetworkContextName } from '../../constants/misc'
import { useEagerConnect, useInactiveListener } from '../../hooks/web3'

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

  const triedEager = useEagerConnect()

  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, activateNetwork, active, networkActive, networkError])

  useInactiveListener(!triedEager)

  if (!triedEager) {
    return null
  }

  if (!active && networkError) {
    ;<>Unknown error</>
  }

  return children
}
