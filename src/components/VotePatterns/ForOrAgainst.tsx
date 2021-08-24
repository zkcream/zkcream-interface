import { Trans } from '@lingui/macro'
import { darken } from 'polished'
import { useState } from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'

import { usePublishMessageCallback } from '../../hooks/usePublishMessageCallback'
import { black } from '../../theme'
import { ButtonPrimary } from '../Button'
import { RowFixed } from '../Row'
import Spinner from '../Spinner'

const ResultBox = styled(Box)<{
  winner?: boolean
}>`
  border: 2px solid;
  border-color: ${({ theme, winner }) => (winner ? theme.green : darken(0.6, theme.white))};
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  padding: 20px;
  color: ${({ theme, winner }) => (winner ? theme.green : darken(0.6, theme.white))};
`

const TitleWrapper = styled(Box)`
  font-weight: 600;
`

const ResultWrapper = styled.div`
  margin-left: auto;
`

const ResultText = styled.div`
  font-weight: 600;
`

interface ForOrAgainstProps {
  recipients: string[]
  isApproved: boolean | undefined
  tokenCounts?: number[] | undefined
  stateIndex?: string
  nonce?: string
  setNonce?: any
  maciSk?: string
}

export default function ForOrAgainst({
  recipients,
  isApproved,
  tokenCounts,
  stateIndex,
  nonce,
  setNonce,
  maciSk,
}: ForOrAgainstProps) {
  /* TEMP flags */
  const isBeforeVotingDeadline = true

  const [index, setIndex] = useState<number | undefined>(undefined)
  const [publishTxState, publishMessage] = usePublishMessageCallback()

  return (
    <RowFixed style={{ width: '100%', gap: '12px' }}>
      {recipients.map((recipient, i) => {
        if (isBeforeVotingDeadline && !isApproved) {
          return (
            <ButtonPrimary
              disabled={publishTxState}
              onClick={() => {
                setIndex(i)
                publishMessage(i, parseInt(stateIndex!), parseInt(nonce!), maciSk!, undefined).then(() => {
                  setNonce((parseInt(nonce!) + 1).toString())
                  setIndex(undefined)
                })
              }}
              key={i}
            >
              {publishTxState && i === index ? (
                <Spinner color={black} height={16} width={16} />
              ) : (
                <Trans>Vote {i === 0 ? 'For' : 'Against'}</Trans>
              )}
            </ButtonPrimary>
          )
        } else {
          return (
            <ResultBox key={i} width={1 / 2} winner={tokenCounts![i] > tokenCounts![i + 1]}>
              <TitleWrapper>
                <Trans>{i === 0 ? 'For' : 'Against'}</Trans>
              </TitleWrapper>
              <ResultWrapper>
                <ResultText>{tokenCounts![i]}</ResultText>
              </ResultWrapper>
            </ResultBox>
          )
        }
      })}
    </RowFixed>
  )
}
