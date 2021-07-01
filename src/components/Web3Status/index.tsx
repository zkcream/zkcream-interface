import React from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

import { ButtonPrimary } from '../Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { shortenAddress } from '../../utils'
import WalletModal from '../WalletModal'

export default function Web3Status() {
  const { account, error } = useWeb3React()
  const toggleModal = useWalletModalToggle()

  if (account) {
    return <>{shortenAddress(account)}</>
  } else if (error) {
    return <>{error instanceof UnsupportedChainIdError ? <>Wrong network</> : <>Error</>}</>
  } else {
    return (
      <>
        <ButtonPrimary width="180px" padding="8px" onClick={toggleModal}>
          Connect to a Wallet
        </ButtonPrimary>
        <WalletModal />
      </>
    )
  }
}
