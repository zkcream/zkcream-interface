import React, { memo } from 'react'
import { Trans } from '@lingui/macro'

import { VoteActionsProps } from '../../pages/Vote/VoteActions'
import { ButtonPrimary } from '../../components/Button'
import { RowFixed } from '../../components/Row'
import { usePublishMessageCallback } from '../../hooks/usePublishMessageCallback'

function PickOne() {
  return <>Unimplemented</>
}

function PickMany() {
  return <>Unimplemented</>
}

function ForOrAgainst({ recipients, maciAddress }: { recipients: string[]; maciAddress: string }) {
  /* TEMP flags */
  const isBeforeVotingDeadline = true

  const publishMessage = usePublishMessageCallback(maciAddress)

  return (
    <>
      {isBeforeVotingDeadline ? (
        <RowFixed style={{ width: '100%', gap: '12px' }}>
          {recipients.map((recipient, i) => (
            <ButtonPrimary
              onClick={() => {
                publishMessage(i, 1, 1)
              }}
              key={i}
            >
              <Trans>Vote {i === 0 ? 'For' : 'Against'}</Trans>
            </ButtonPrimary>
          ))}
        </RowFixed>
      ) : null}
    </>
  )
}

export const VotePatterns = memo(({ recipients, electionType, maciAddress }: VoteActionsProps) => {
  return (
    <>
      {
        {
          0: <PickOne />,
          1: <PickMany />,
          2: <ForOrAgainst recipients={recipients} maciAddress={maciAddress} />,
        }[electionType]
      }
    </>
  )
})
