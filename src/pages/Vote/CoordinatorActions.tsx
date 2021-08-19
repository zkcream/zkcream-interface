import React from 'react'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { ApplicationModal } from '../../state/application/actions'
import {
  useModalOpen,
  useCoordinatorKeyModalToggle,
  useRandomStateLeafModalToggle,
} from '../../state/application/hooks'
import { useWithdrawCallback } from '../../hooks/useWithdrawCallback'
import MultiLevelModal, { MultiLevelModalContent } from '../../components/MultiLevelModal'

export default function CoordinatorActions({ isPublished, isApproved }: { isPublished: boolean; isApproved: boolean }) {
  /* modals */
  const randomStateLeafModalOpen = useModalOpen(ApplicationModal.RANDOM_STATELEAF)
  const coordinatorKeyModalOpen = useModalOpen(ApplicationModal.COORDINATOR_KEY)
  const toggleRandomStateLeafModal = useRandomStateLeafModalToggle()
  const toggleCoordinatorKeyModal = useCoordinatorKeyModalToggle()

  const withdraw = useWithdrawCallback()

  return (
    <>
      <MultiLevelModal
        isOpen={randomStateLeafModalOpen}
        onDismiss={toggleRandomStateLeafModal}
        content={MultiLevelModalContent.ReadRandomStateLeaf}
      />
      <MultiLevelModal
        isOpen={coordinatorKeyModalOpen}
        onDismiss={toggleCoordinatorKeyModal}
        content={MultiLevelModalContent.CoordinatorKey}
      />
      <Text>
        <Trans>You are Coordinator</Trans>
      </Text>
      {isPublished && !isApproved ? <Trans>Wait owner to approve tally</Trans> : null}
      {!isPublished ? (
        <>
          <ButtonPrimary onClick={toggleCoordinatorKeyModal}>
            <Trans>Process Message</Trans>
          </ButtonPrimary>
          <ButtonPrimary onClick={toggleRandomStateLeafModal}>
            <Trans>Publish Tally</Trans>
          </ButtonPrimary>
        </>
      ) : null}
      <ButtonPrimary disabled={!isApproved ? true : false} onClick={withdraw}>
        <Trans>Withdraw</Trans>
      </ButtonPrimary>
    </>
  )
}
