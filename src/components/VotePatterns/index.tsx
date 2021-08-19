import React, { memo } from 'react'
import { Box } from 'rebass'
import styled from 'styled-components/macro'
import { Trans } from '@lingui/macro'

import { VoteActionsProps } from '../../pages/Vote/VoteActions'
import { ButtonPrimary } from '../../components/Button'
import { RowFixed } from '../../components/Row'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { usePublishMessageCallback } from '../../hooks/usePublishMessageCallback'

interface VotePatternsProps extends VoteActionsProps {
  recipients: string[]
  electionType: string
  isPublished?: boolean | undefined
  isApproved?: boolean | undefined
}

const ResultBox = styled(Box)`
  border: 1px solid;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  padding: 20px;
`

const TitleWrapper = styled(Box)`
  font-weight: 500;
`

const ResultWrapper = styled.div`
  margin-left: auto;
`

const ResultText = styled.div`
  font-weight: 500;
`

function Result({ count }: { count: number }) {
  return <ResultText>{count}</ResultText>
}

function PickOne() {
  return <>Unimplemented</>
}

function PickMany() {
  return <>Unimplemented</>
}

function ForOrAgainst({ recipients, isApproved }: { recipients: string[]; isApproved: boolean | undefined }) {
  /* TEMP flags */
  const isBeforeVotingDeadline = true
  const [stateIndex] = useLocalStorage('stateIndex', '0')
  const [nonce, setNonce] = useLocalStorage('nonce', '1')
  const publishMessage = usePublishMessageCallback()

  return (
    <RowFixed style={{ width: '100%', gap: '12px' }}>
      {recipients.map((recipient, i) => {
        if (isBeforeVotingDeadline && !isApproved) {
          return (
            <ButtonPrimary
              onClick={() => {
                publishMessage(i, stateIndex, nonce).then(() => setNonce((parseInt(nonce) + 1).toString()))
              }}
              key={i}
            >
              <Trans>Vote {i === 0 ? 'For' : 'Against'}</Trans>
            </ButtonPrimary>
          )
        } else {
          return (
            <ResultBox key={i} width={1 / 2}>
              <TitleWrapper>
                <Trans>{i === 0 ? 'For' : 'Against'}</Trans>
              </TitleWrapper>
              <ResultWrapper>
                <Result count={10} />
              </ResultWrapper>
            </ResultBox>
          )
        }
      })}
    </RowFixed>
  )
}

export const VotePatterns = memo(({ recipients, electionType, isApproved }: VotePatternsProps) => {
  return (
    <>
      {
        {
          0: <PickOne />,
          1: <PickMany />,
          2: <ForOrAgainst recipients={recipients} isApproved={isApproved} />,
        }[electionType]
      }
    </>
  )
})
