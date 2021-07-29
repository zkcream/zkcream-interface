import React from 'react'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { RandomStateLeafModal } from '../../components/RandomStateLeafModal'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useRandomStateLeafModalToggle } from '../../state/application/hooks'
import { useProcessMessageCallback } from '../../hooks/useProcessMessageCallback'

export default function CoordinatorActions() {
  /* modals */
  const randomStateLeafModalOpen = useModalOpen(ApplicationModal.RANDOM_STATELEAF)
  const toggleRandomStateLeafModal = useRandomStateLeafModalToggle()

  const [randomStateLeaf, processMessage] = useProcessMessageCallback()

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
      <ButtonPrimary onClick={processMessage}>
        <Trans>Process Message</Trans>
      </ButtonPrimary>
      <ButtonPrimary>
        <Trans>Publish Tally</Trans>
      </ButtonPrimary>
    </>
  )
}
