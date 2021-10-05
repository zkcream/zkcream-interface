import { t } from '@lingui/macro'
import { darken } from 'polished'
import { useState } from 'react'
import { Box, Text } from 'rebass'

import styled from 'styled-components'

import { usePublishMessageCallback } from '../../hooks/usePublishMessageCallback'
import { black } from '../../theme'
import { ButtonPrimary } from '../Button'
import { RowFixed } from '../Row'
import Spinner from '../Spinner'

const ResultBox = styled(Box)<{
  index?: number
}>`
  border: 2px solid;
  border-color: ${({ theme, index }) => (index === 0 ? theme.green : darken(0.1, theme.red))};
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  padding: 20px;
  color: ${({ theme, index }) => (index === 0 ? theme.green : darken(0.1, theme.red))};
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
  const [index, setIndex] = useState<number | undefined>(undefined)
  const [publishTxState, publishMessage] = usePublishMessageCallback()

  return (
    <RowFixed style={{ width: '100%', gap: '12px' }}>
      {recipients.map((recipient, i) => {
        if (!isApproved) {
          return (
            <ButtonPrimary
              disabled={publishTxState}
              onClick={() => {
                setIndex(i)
                publishMessage(i, parseInt(stateIndex!), parseInt(nonce!), maciSk!, undefined).then(() => {
                  // TEMP fixed nonce
                  // setNonce((parseInt(nonce!) + 1).toString())
                  setIndex(undefined)
                })
              }}
              key={i}
            >
              {publishTxState && i === index ? (
                <Spinner color={black} height={16} width={16} />
              ) : (
                <Text>{i === 0 ? t`For` : t`Against`}</Text>
              )}
            </ButtonPrimary>
          )
        } else {
          return (
            <ResultBox key={i} width={1 / 2} index={i}>
              <TitleWrapper>
                <Text>{i === 0 ? t`For` : t`Against`}</Text>
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
