import React from 'react'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { RandomStateLeafModal } from '../../components/RandomStateLeafModal'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useRandomStateLeafModalToggle } from '../../state/application/hooks'
import { useProcessMessageCallback } from '../../hooks/useProcessMessageCallback'
import { usePublishTallyCallback } from '../../hooks/usePublishTallyCallback'
import { useWithdrawCallback } from '../../hooks/useWithdrawCallback'

export default function CoordinatorActions({ isPublished, isApproved }: { isPublished: boolean; isApproved: boolean }) {
  /* modals */
  const randomStateLeafModalOpen = useModalOpen(ApplicationModal.RANDOM_STATELEAF)
  const toggleRandomStateLeafModal = useRandomStateLeafModalToggle()

  const [randomStateLeaf, processMessage] = useProcessMessageCallback()
  const publishTally = usePublishTallyCallback()
  const withdraw = useWithdrawCallback()

  return (
    <>
      <RandomStateLeafModal
        randomStateLeaf={randomStateLeaf}
        isOpen={randomStateLeafModalOpen}
        onDismiss={toggleRandomStateLeafModal}
      />
      <Text>
        <Trans>You are Coordinator</Trans>
      </Text>
      {isPublished && !isApproved ? <Trans>Wait owner to approve tally</Trans> : null}
      {!isPublished ? (
        <>
          <ButtonPrimary onClick={processMessage}>
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
