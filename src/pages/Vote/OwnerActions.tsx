import React from 'react'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import DistributeModal from '../../components/DistributeModal'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useDistributeModalToggle } from '../../state/application/hooks'
import { useApproveTallyCallback } from '../../hooks/useApproveTallyCallback'

export default function OwnerActions({ isPublished, isApproved }: { isPublished: boolean; isApproved: boolean }) {
  // toggle deploy modal
  const distributeModalOpen = useModalOpen(ApplicationModal.DISTRIBUTE)
  const toggleModal = useDistributeModalToggle()
  const approveTally = useApproveTallyCallback()

  return (
    <>
      <DistributeModal isOpen={distributeModalOpen} onDismiss={toggleModal} />
      <Text>
        <Trans>You are Owner</Trans>
      </Text>
      {!isPublished ? (
        <>
          <Trans>Wait coordinator to publish tally hash</Trans>
          <ButtonPrimary onClick={toggleModal}>
            <Trans>Distribute Token</Trans>
          </ButtonPrimary>
        </>
      ) : null}
      {isApproved ? (
        <Trans>Tally already approved</Trans>
      ) : (
        <>
          {isPublished ? (
            <ButtonPrimary onClick={approveTally}>
              <Trans>Approve Tally</Trans>
            </ButtonPrimary>
          ) : null}
        </>
      )}
    </>
  )
}
