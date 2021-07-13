import React from 'react'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../Button'
import { NoteModal } from '../NoteModal'
import { SignUpModal } from '../SignUpModal'

import { useDepositCallback } from '../../hooks/useDepositCallback'
import { useApproveTokenCallback } from '../../hooks/useApproveTokenCallback'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useNoteModalToggle, useSignUpModalToggle } from '../../state/application/hooks'
import { useTokenStatus } from '../../state/token/hooks'
import { TokenType } from '../../state/token/reducer'

interface TokenButtonsProps {
  tokenState: TokenType
  zkCreamAddress: string
  votingTokenAddress: string
}

export function TokenButtons({ tokenState, zkCreamAddress, votingTokenAddress }: TokenButtonsProps) {
  /* modals */
  const noteModalOpen = useModalOpen(ApplicationModal.NOTE)
  const signUpModalOpen = useModalOpen(ApplicationModal.SIGNUP)
  const toggleNoteModal = useNoteModalToggle()
  const toggleSignUpModal = useSignUpModalToggle()

  /* check `isApproved` */
  const isApproved = useTokenStatus()

  /*
   * deposit callback from hook
   * @retuns note for snark proof
   */
  const [note, deposit] = useDepositCallback(zkCreamAddress)

  /* approveToken callback from hook */
  const approveToken = useApproveTokenCallback(zkCreamAddress, votingTokenAddress)

  function signUp() {
    toggleSignUpModal()
  }

  return (
    <>
      <NoteModal isOpen={noteModalOpen} onDismiss={toggleNoteModal} note={note} />
      <SignUpModal address={zkCreamAddress} isOpen={signUpModalOpen} onDismiss={toggleSignUpModal} />
      {tokenState & TokenType.VOTING ? (
        <>
          <ButtonPrimary onClick={approveToken} disabled={isApproved ? true : false}>
            <Trans>Approve Token</Trans>
          </ButtonPrimary>
          <ButtonPrimary onClick={deposit} disabled={!isApproved ? true : false}>
            <Trans>Register</Trans>
          </ButtonPrimary>
        </>
      ) : null}
      {tokenState & TokenType.SIGNUP ? null : (
        <ButtonPrimary onClick={signUp}>
          <Trans>Sign Up</Trans>
        </ButtonPrimary>
      )}
    </>
  )
}
