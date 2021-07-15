import React, { useState } from 'react'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { ActionNames, MessageAction, VoteNav } from '../../components/VoteNav'
import { VotePatterns } from '../../components/VotePatterns'

export interface RecipientsProps {
  recipients: string[]
  electionType: string
}

export default function Recipients({ recipients, electionType }: RecipientsProps) {
  const [radioState, setRadioState] = useState<MessageAction>(MessageAction.SELECT)

  function toggleRadio(e: any) {
    setRadioState(ActionNames[e.target.value][0] as MessageAction)
  }

  return (
    <>
      <VoteNav radioState={radioState} handleChange={toggleRadio} />
      {radioState === 0 ? (
        <VotePatterns recipients={recipients} electionType={electionType} />
      ) : (
        <ButtonPrimary>
          <Trans>New Key</Trans>
        </ButtonPrimary>
      )}
    </>
  )
}
