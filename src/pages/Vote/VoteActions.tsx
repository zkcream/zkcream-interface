import React, { useState } from 'react'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { ActionNames, MessageAction, VoteNav } from '../../components/VoteNav'
import { VoterStateModal } from '../../components/VoterStateModal'
import { VotePatterns } from '../../components/VotePatterns'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { usePublishMessageCallback } from '../../hooks/usePublishMessageCallback'
import { ApplicationModal } from '../../state/application/actions'
import { useVoterStateModalToggle, useModalOpen } from '../../state/application/hooks'

export interface VoteActionsProps {
  recipients: string[]
  electionType: string
}

export default function VoteActions({ recipients, electionType }: VoteActionsProps) {
  const [radioState, setRadioState] = useState<MessageAction>(MessageAction.SELECT)
  const [stateIndex] = useLocalStorage('stateIndex', '0')
  const [nonce, setNonce] = useLocalStorage('nonce', '1')
  const publishMessage = usePublishMessageCallback()

  // toggle voter state modal
  const voterStateModalOpen = useModalOpen(ApplicationModal.VOTERSTATE)
  const toggleModal = useVoterStateModalToggle()

  function toggleRadio(e: any) {
    setRadioState(ActionNames[e.target.value][0] as MessageAction)
  }

  return (
    <>
      <VoterStateModal isOpen={!parseInt(stateIndex) || voterStateModalOpen} onDismiss={toggleModal} />
      <VoteNav radioState={radioState} handleChange={toggleRadio} />
      {radioState === 0 ? (
        <VotePatterns recipients={recipients} electionType={electionType} />
      ) : (
        <AutoColumn justify="center">
          <ButtonPrimary
            width="50%"
            onClick={() => publishMessage(null, stateIndex, nonce).then(() => setNonce(parseInt(nonce) + 1))}
          >
            <Trans>New Key</Trans>
          </ButtonPrimary>
        </AutoColumn>
      )}
    </>
  )
}