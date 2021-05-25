import React from 'react'
import { useWeb3React } from '@web3-react/core'

import { useWalletModalToggle } from '../../state/application/hooks'
import { shortenAddress } from '../../utils'
import WalletModal from '../WalletModal'

export default function Web3Status() {
  const { account } = useWeb3React()
  const toggleModal = useWalletModalToggle()

  if (account) {
    return <>{shortenAddress(account)}</>
  } else {
    return (
      <>
        <button onClick={toggleModal}>Connect to a Wallet</button>
        <WalletModal />
      </>
    )
  }
}
