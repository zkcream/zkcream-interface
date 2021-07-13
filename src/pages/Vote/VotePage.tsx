import React, { useEffect } from 'react'
import { ArrowLeft } from 'react-feather'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components/macro'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { AutoColumn } from '../../components/Column'
import { TokenButtons } from '../../components/TokenButtons'
import { useActiveWeb3React } from '../../hooks/web3'
import { ElectionData, useElectionData } from '../../state/election/hooks'

import { StyledInternalLink } from '../../theme'

import { TokenType, fetchTokenState } from '../../state/token/reducer'
import { useTokenType } from '../../state/token/hooks'
import { useAppDispatch } from '../../state/hooks'

import Recipients from './Recipients'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

const ElectionInfo = styled(AutoColumn)`
  border: ${({ theme }) => theme.greyText} 1px solid;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  max-width: 640px;
  width: 100%;
`

const ArrowWrapper = styled(StyledInternalLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  color: ${({ theme }) => theme.greyText};
`

export default function VotePage({
  match: {
    params: { address },
  },
}: RouteComponentProps<{ address: string }>) {
  const { account } = useActiveWeb3React()

  /* get election details */
  // TODO Refacotor rendering
  const electionData: ElectionData | undefined = useElectionData(address)

  /* fetch token status */
  const dispatch = useAppDispatch()
  const tokenState: TokenType = useTokenType()

  // TODO Refacotor rendering
  useEffect(() => {
    const arg: any = { address, account }
    dispatch(fetchTokenState(arg))
  }, [account, address, dispatch])

  return (
    <PageWrapper gap="lg" justify="center">
      <ElectionInfo gap="lg" justify="start">
        {electionData && (
          <>
            <AutoColumn gap="10px" style={{ width: '100%' }}>
              <ArrowWrapper to={'/'}>
                <ArrowLeft size={20} />
                <Trans>All Elections</Trans>
              </ArrowWrapper>
              <Text fontSize={[5]} fontWeight="bold" mt={4} mb={2}>
                {electionData.title}
              </Text>
              {tokenState & TokenType.SIGNUP ? (
                <Recipients recipients={electionData.recipients} electionType={electionData.electionType} />
              ) : (
                <TokenButtons
                  tokenState={tokenState}
                  zkCreamAddress={address}
                  votingTokenAddress={electionData.votingTokenAddress}
                />
              )}
            </AutoColumn>
            <AutoColumn gap="sm">
              <Text fontSize={[3]} fontWeight="bold">
                <Trans>Administration Committees</Trans>
              </Text>
              <Text fontSize={[2]} fontWeight="bold">
                <Trans>Group owner</Trans>
              </Text>
              {electionData.owner}
              <Text fontSize={[2]} fontWeight="bold">
                <Trans>Coordinator</Trans>
              </Text>
              {electionData.coordinator}
            </AutoColumn>
          </>
        )}
      </ElectionInfo>
    </PageWrapper>
  )
}
