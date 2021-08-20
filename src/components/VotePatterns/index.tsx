import { memo } from 'react'

import { VoteActionsProps } from '../../pages/Vote/VoteActions'
import ForOrAgainst from './ForOrAgainst'

interface VotePatternsProps extends VoteActionsProps {
  recipients: string[]
  electionType: string
  isPublished?: boolean | undefined
  isApproved?: boolean | undefined
  tokenCounts?: number[]
  stateIndex?: string
  nonce?: string
  setNonce?: any
  maciSk?: string
}

function PickOne() {
  return <>Unimplemented</>
}

function PickMany() {
  return <>Unimplemented</>
}

export const VotePatterns = memo(
  ({ recipients, electionType, isApproved, tokenCounts, stateIndex, nonce, setNonce, maciSk }: VotePatternsProps) => {
    return (
      <>
        {
          {
            0: <PickOne />,
            1: <PickMany />,
            2: (
              <ForOrAgainst
                recipients={recipients}
                isApproved={isApproved}
                tokenCounts={tokenCounts}
                stateIndex={stateIndex}
                nonce={nonce}
                setNonce={setNonce}
                maciSk={maciSk}
              />
            ),
          }[electionType]
        }
      </>
    )
  }
)
