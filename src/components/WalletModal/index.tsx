import React from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

import { injected } from '../../connectors'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'

import Modal from '../Modal'

export default function WalletModal() {
  const { account, activate } = useWeb3React()

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleModal = useWalletModalToggle()

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    /* TODO: add pending action */

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector)
        } else {
          console.log('pendig error')
        }
      })
  }

  function getModalContent() {
    if (account) {
      return <>show account info</>
    } else {
      return (
        <>
          <button onClick={toggleModal}>close</button>
          <button onClick={() => tryActivation(injected)}>Connecto to a Wallet</button>
        </>
      )
    }
  }

  return (
    <>
      <Modal isOpen={walletModalOpen}>{getModalContent()}</Modal>
    </>
  )
}
