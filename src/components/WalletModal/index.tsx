import React from 'react'
import styled from 'styled-components'
import { X } from 'react-feather'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { Trans } from '@lingui/macro'

import { injected } from '../../connectors'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'

import Modal from '../Modal'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const UpperSection = styled.div`
  position: relative;
  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }
  h5:last-child {
    margin-bottom: 0px;
  }
  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const HoverText = styled.div`
  text-decoration: none;
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`

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
        <UpperSection>
          <CloseIcon onClick={toggleModal}>
            <X size={20} />
          </CloseIcon>
          <HeaderRow>
            <HoverText onClick={() => tryActivation(injected)}>
              <Trans>Connecto to a Wallet</Trans>
            </HoverText>
          </HeaderRow>
        </UpperSection>
      )
    }
  }

  return (
    <>
      <Modal isOpen={walletModalOpen} onDismiss={toggleModal}>
        <Wrapper>{getModalContent()}</Wrapper>
      </Modal>
    </>
  )
}
