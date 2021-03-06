import React from 'react'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useDistributeModalToggle } from '../../state/application/hooks'
import { useApproveTallyCallback } from '../../hooks/useApproveTallyCallback'
import SingleModal, { SingleModalContent } from '../../components/SingleModal'
import Spinner from '../../components/Spinner'
import { black } from '../../theme'

export default function OwnerActions({
  isPublished,
  isApproved,
  beforeSignUpDeadline,
}: {
  isPublished: boolean
  isApproved: boolean
  beforeSignUpDeadline: boolean
}) {
  // toggle deploy modal
  const distributeModalOpen = useModalOpen(ApplicationModal.DISTRIBUTE)
  const toggleModal = useDistributeModalToggle()
  const [approveTxState, approveTally] = useApproveTallyCallback()

  return (
    <>
      <SingleModal isOpen={distributeModalOpen} onDismiss={toggleModal} content={SingleModalContent.Distribute} />
      <Text>
        <Trans>You are Owner</Trans>
      </Text>
      {!isPublished ? (
        <>
          {beforeSignUpDeadline ? (
            <>
              <Trans>Distribute voting tokens to voters</Trans>
              <ButtonPrimary onClick={toggleModal}>
                <Trans>Distribute Token</Trans>
              </ButtonPrimary>
            </>
          ) : (
            <>
              <Trans>Wait coordinator to publish tally hash</Trans>
            </>
          )}
        </>
      ) : null}
      {isApproved ? (
        <Trans>Tally already approved</Trans>
      ) : (
        <>
          {isPublished ? (
            <ButtonPrimary onClick={approveTally} disabled={approveTxState || isApproved}>
              {approveTxState ? <Spinner color={black} height={16} width={16} /> : <Trans>Approve Tally</Trans>}
            </ButtonPrimary>
          ) : null}
        </>
      )}
    </>
  )
}
