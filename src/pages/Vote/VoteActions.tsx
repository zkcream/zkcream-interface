import React, { useState } from 'react'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { ActionNames, MessageAction, VoteNav } from '../../components/VoteNav'
import { VotePatterns } from '../../components/VotePatterns'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { usePublishMessageCallback } from '../../hooks/usePublishMessageCallback'

export interface VoteActionsProps {
  recipients: string[]
  electionType: string
  maciAddress: string
}

export default function VoteActions({ recipients, electionType, maciAddress }: VoteActionsProps) {
  const [radioState, setRadioState] = useState<MessageAction>(MessageAction.SELECT)
  const [stateIndex] = useLocalStorage('stateIndex', '0')
  const [nonce, setNonce] = useLocalStorage('nonce', '1')
  const publishMessage = usePublishMessageCallback(maciAddress)

  function toggleRadio(e: any) {
    setRadioState(ActionNames[e.target.value][0] as MessageAction)
  }

  return (
    <>
      <VoteNav radioState={radioState} handleChange={toggleRadio} />
      {radioState === 0 ? (
        <VotePatterns recipients={recipients} electionType={electionType} maciAddress={maciAddress} />
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
