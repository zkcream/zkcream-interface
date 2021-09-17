import { useEffect } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/macro'
import { darken, lighten } from 'polished'

import { ButtonPrimary } from '../Button'
import Spinner from '../Spinner'

import { useDepositCallback } from '../../hooks/useDepositCallback'
import { useApproveTokenCallback } from '../../hooks/useApproveTokenCallback'
import { useAddressExists } from '../../hooks/useAddressExists'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useNoteModalToggle, useSignUpModalToggle } from '../../state/application/hooks'
import { useTokenStatus } from '../../state/token/hooks'
import { TokenType } from '../../state/token/reducer'
import { black } from '../../theme'
import MultiLevelModal, { MultiLevelModalContent } from '../MultiLevelModal'

const WarningWrapper = styled.div`
  background-color: ${({ theme }) => lighten(0.25, theme.red)};
  border-radius: 0.25rem;
  color: ${({ theme }) => darken(0.2, theme.red)};
  font-weight: 600;
  padding: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`

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
  const [exists, addressExists] = useAddressExists()

  useEffect(() => {
    /* check if deposit address exists */
    addressExists()
  }, [addressExists])

  return (
    <>
      <MultiLevelModal
        isOpen={noteModalOpen}
        onDismiss={toggleNoteModal}
        content={MultiLevelModalContent.Note}
        data={note}
      />
      <MultiLevelModal
        isOpen={signUpModalOpen}
        onDismiss={toggleSignUpModal}
        content={MultiLevelModalContent.SignUp}
        zkCreamAddress={zkCreamAddress!}
        maciAddress={maciAddress!}
      />
      {tokenState & TokenType.VOTING ? (
        <>
          <ButtonPrimary onClick={approveToken} disabled={isApproved || approveTxState ? true : false}>
            {approveTxState ? <Spinner color={black} height={16} width={16} /> : <Trans>Approve Token</Trans>}
          </ButtonPrimary>
          <ButtonPrimary onClick={deposit} disabled={!isApproved || depositTxState ? true : false}>
            {depositTxState ? <Spinner color={black} height={16} width={16} /> : <Trans>Register</Trans>}
          </ButtonPrimary>
        </>
      ) : null}
      {exists ? (
        <WarningWrapper>
          <Trans>You need to sign up with a different account than the one you made the deposit with.</Trans>
        </WarningWrapper>
      ) : null}
      {tokenState & TokenType.SIGNUP ? null : (
        <ButtonPrimary onClick={toggleSignUpModal} disabled={tokenState & TokenType.VOTING || exists ? true : false}>
          <Trans>Sign Up</Trans>
        </ButtonPrimary>
      )}
    </>
  )
}
