import React from 'react'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
// import { CoordinatorKeyModal } from '../../components/CoordinatorKeyModal'
import { RandomStateLeafModal } from '../../components/RandomStateLeafModal'
import { ApplicationModal } from '../../state/application/actions'
import {
  useModalOpen,
  useCoordinatorKeyModalToggle,
  useRandomStateLeafModalToggle,
} from '../../state/application/hooks'
import { useProcessMessageCallback } from '../../hooks/useProcessMessageCallback'
import { usePublishTallyCallback } from '../../hooks/usePublishTallyCallback'
import { useWithdrawCallback } from '../../hooks/useWithdrawCallback'
import MultiLevelModal, { MultiLevelModalContent } from '../../components/MultiLevelModal'

export default function CoordinatorActions({ isPublished, isApproved }: { isPublished: boolean; isApproved: boolean }) {
  /* modals */
  const randomStateLeafModalOpen = useModalOpen(ApplicationModal.RANDOM_STATELEAF)
  const coordinatorKeyModalOpen = useModalOpen(ApplicationModal.COORDINATOR_KEY)
  const toggleRandomStateLeafModal = useRandomStateLeafModalToggle()
  const toggleCoordinatorKeyModal = useCoordinatorKeyModalToggle()

  const [randomStateLeaf] = useProcessMessageCallback()
  const publishTally = usePublishTallyCallback()
  const withdraw = useWithdrawCallback()

  return (
    <>
      <RandomStateLeafModal
        randomStateLeaf={randomStateLeaf}
        isOpen={randomStateLeafModalOpen}
        onDismiss={toggleRandomStateLeafModal}
      />
      <MultiLevelModal
        isOpen={coordinatorKeyModalOpen}
        onDismiss={toggleCoordinatorKeyModal}
        content={MultiLevelModalContent.CoordinatorKey}
      />
      {/* <CoordinatorKeyModal isOpen={coordinatorKeyModalOpen} onDismiss={toggleCoordinatorKeyModal} /> */}
      <Text>
        <Trans>You are Coordinator</Trans>
      </Text>
      {isPublished && !isApproved ? <Trans>Wait owner to approve tally</Trans> : null}
      {!isPublished ? (
        <>
          <ButtonPrimary onClick={toggleCoordinatorKeyModal}>
            <Trans>Process Message</Trans>
          </ButtonPrimary>
          <ButtonPrimary onClick={() => publishTally(randomStateLeaf)}>
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
