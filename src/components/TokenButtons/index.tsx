import React from 'react'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../Button'
import { NoteModal } from '../NoteModal'
import { SignUpModal } from '../SignUpModal'
import Spinner from '../Spinner'

import { useDepositCallback } from '../../hooks/useDepositCallback'
import { useApproveTokenCallback } from '../../hooks/useApproveTokenCallback'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useNoteModalToggle, useSignUpModalToggle } from '../../state/application/hooks'
import { useTokenStatus } from '../../state/token/hooks'
import { TokenType } from '../../state/token/reducer'
import { black } from '../../theme'

interface TokenButtonsProps {
  tokenState: TokenType
  zkCreamAddress: string
  maciAddress: string
  votingTokenAddress: string
}

export function TokenButtons({ tokenState, zkCreamAddress, maciAddress, votingTokenAddress }: TokenButtonsProps) {
  const isApproved = useTokenStatus()
  const noteModalOpen = useModalOpen(ApplicationModal.NOTE)
  const signUpModalOpen = useModalOpen(ApplicationModal.SIGNUP)
  const toggleNoteModal = useNoteModalToggle()
  const toggleSignUpModal = useSignUpModalToggle()

  const [approveTxState, approveToken] = useApproveTokenCallback(zkCreamAddress, votingTokenAddress)
  const [depositTxState, note, deposit] = useDepositCallback(zkCreamAddress)

  return (
    <>
      <NoteModal isOpen={noteModalOpen} onDismiss={toggleNoteModal} note={note} />
      <SignUpModal
        zkCreamAddress={zkCreamAddress}
        maciAddress={maciAddress}
        isOpen={signUpModalOpen}
        onDismiss={toggleSignUpModal}
      />
      {tokenState & TokenType.VOTING ? (
        <>
          <ButtonPrimary onClick={approveToken} disabled={isApproved ? true : false}>
            {approveTxState ? <Spinner color={black} height={16} width={16} /> : <Trans>Approve Token</Trans>}
          </ButtonPrimary>
          <ButtonPrimary onClick={deposit} disabled={!isApproved ? true : false}>
            {depositTxState ? <Spinner color={black} height={16} width={16} /> : <Trans>Register</Trans>}
          </ButtonPrimary>
        </>
      ) : null}
      {tokenState & TokenType.SIGNUP ? null : (
        <ButtonPrimary onClick={toggleSignUpModal} disabled={tokenState & TokenType.VOTING ? true : false}>
          <Trans>Sign Up</Trans>
        </ButtonPrimary>
      )}
    </>
  )
}
