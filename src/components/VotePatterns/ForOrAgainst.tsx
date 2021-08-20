import { Trans } from '@lingui/macro'
import { darken } from 'polished'
import { Box } from 'rebass'
import styled from 'styled-components'

import { useLocalStorage } from '../../hooks/useLocalStorage'
import { usePublishMessageCallback } from '../../hooks/usePublishMessageCallback'
import { ButtonPrimary } from '../Button'
import { RowFixed } from '../Row'

const ResultBox = styled(Box)<{
  winner?: boolean
}>`
  border: 2px solid;
  border-color: ${({ theme, winner }) => (winner ? theme.green : darken(0.6, theme.white))};
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  padding: 20px;
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

export default function ForOrAgainst({
  recipients,
  isApproved,
  tokenCounts,
}: {
  recipients: string[]
  isApproved: boolean | undefined
  tokenCounts: number[] | undefined
}) {
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
