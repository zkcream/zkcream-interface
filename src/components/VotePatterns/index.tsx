import React, { memo } from 'react'
import { Trans } from '@lingui/macro'

import { VoteActionsProps } from '../../pages/Vote/VoteActions'
import { ButtonPrimary } from '../../components/Button'
import { RowFixed } from '../../components/Row'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { usePublishMessageCallback } from '../../hooks/usePublishMessageCallback'

interface VotePatternsProps extends VoteActionsProps {
  recipients: string[]
  electionType: string
}

function PickOne() {
  return <>Unimplemented</>
}

function PickMany() {
  return <>Unimplemented</>
}

function ForOrAgainst({ recipients }: { recipients: string[] }) {
  /* TEMP flags */
  const isBeforeVotingDeadline = true
  const [stateIndex] = useLocalStorage('stateIndex', '0')
  const [nonce, setNonce] = useLocalStorage('nonce', '1')
  const publishMessage = usePublishMessageCallback()
  return (
    <>
      {isBeforeVotingDeadline ? (
        <RowFixed style={{ width: '100%', gap: '12px' }}>
          {recipients.map((recipient, i) => (
            <ButtonPrimary
              onClick={() => {
                publishMessage(i, stateIndex, nonce).then(() => setNonce(parseInt(nonce) + 1))
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

export const VotePatterns = memo(({ recipients, electionType }: VotePatternsProps) => {
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
})
