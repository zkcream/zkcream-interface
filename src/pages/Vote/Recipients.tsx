import React, { useState } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { RowFixed } from '../../components/Row'
import { ActionNames, MessageAction, VoteNav } from '../../components/VoteNav'
import { shortenAddress } from '../../utils'

interface RecipientsProps {
  recipients: string[]
  electionType: string
}

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
`

function PickOne() {
  return <>Unimplemented</>
}

function PickMany() {
  return <>Unimplemented</>
}

function ForOrAgainst({ recipients }: { recipients: string[] }) {
  /* TEMP flags */
  const isBeforeVotingDeadline = true

  return (
    <>
      {isBeforeVotingDeadline ? (
        <RowFixed style={{ width: '100%', gap: '12px' }}>
          {recipients.map((recipient, i) => (
            <ButtonPrimary
              onClick={() => {
                console.log({ recipient })
              }}
              key={i}
            >
              Vote {i === 0 ? 'For' : 'Against'}
            </ButtonPrimary>
          ))}
        </RowFixed>
      ) : null}
      <CardWrapper>
        {recipients.map((recipient, i) => (
          <p key={i}>{shortenAddress(recipient)}</p>
        ))}
      </CardWrapper>
    </>
  )
}

function ActionPatterns({ recipients, electionType }: RecipientsProps) {
  return (
    <>
      {
        {
          0: <PickOne />,
          1: <PickMany />,
          2: <ForOrAgainst recipients={recipients} />,
        }[electionType]
      }
    </>
  )
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
        <ActionPatterns recipients={recipients} electionType={electionType} />
      ) : (
        <ButtonPrimary>
          <Trans>New Key</Trans>
        </ButtonPrimary>
      )}
    </>
  )
}
