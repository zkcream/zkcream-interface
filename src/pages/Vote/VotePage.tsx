import React, { useEffect } from 'react'
import { ArrowLeft } from 'react-feather'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components/macro'
import { Flex, Text } from 'rebass'
import { Trans } from '@lingui/macro'

import CoordinatorActions from './CoordinatorActions'
import OwnerActions from './OwnerActions'
import VoteActions from './VoteActions'

import { AutoColumn } from '../../components/Column'
import { VotePatterns } from '../../components/VotePatterns'
import { TokenButtons } from '../../components/TokenButtons'
import { useActiveWeb3React } from '../../hooks/web3'
import { useElectionState, useSetElectionData } from '../../state/election/hooks'
import { ElectionData } from '../../state/election/reducer'
import { TokenType } from '../../state/token/reducer'
import { useFetchTokenState, useTokenType } from '../../state/token/hooks'

import { StyledInternalLink } from '../../theme'
import ExportButton from '../../components/ExportButton'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
  color: ${({ theme }) => theme.white};
`

const ElectionInfo = styled(AutoColumn)`
  border: ${({ theme }) => theme.white} 1px solid;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  max-width: 640px;
  width: 100%;
`

const ArrowWrapper = styled(StyledInternalLink)`
  color: ${({ theme }) => theme.white};
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  width: 100%;
`

export default function VotePage({
  match: {
    params: { address },
  },
}: RouteComponentProps<{ address: string }>) {
  const { account } = useActiveWeb3React()

  /* get election details */
  const setElectionData = useSetElectionData(address)
  const electionData: ElectionData | undefined = useElectionState()
  const zkCreamAddress = address
  const isOwner: boolean = account === electionData?.owner
  const isCoordinator: boolean = account === electionData?.coordinator
  const isPublished: boolean = electionData?.tallyHash !== undefined
  const isApproved: boolean = electionData?.approved !== false
  const tokenState: TokenType = useTokenType()

  const arg: any = { zkCreamAddress, account }
  const fetchTokenState = useFetchTokenState(arg)

  useEffect(() => {
    setElectionData()
  }, [setElectionData])

  useEffect(() => {
    if (!isOwner && !isCoordinator) {
      fetchTokenState()
    }
  }, [fetchTokenState, isCoordinator, isOwner])

  return (
    <PageWrapper gap="lg" justify="center">
      <ElectionInfo gap="lg" justify="start">
        {electionData && (
          <>
            <AutoColumn gap="10px" style={{ width: '100%' }}>
              <Flex>
                <ArrowWrapper to={'/'}>
                  <ArrowLeft size={20} />
                  <Trans>All Elections</Trans>
                </ArrowWrapper>
                {!isApproved && !isOwner && !isCoordinator && tokenState & TokenType.SIGNUP ? (
                  <ExportButton maciAddress={electionData.maciAddress} />
                ) : null}
              </Flex>
              <Text fontSize={[5]} fontWeight="bold" mt={4} mb={2}>
                {electionData.title}
              </Text>
              {isApproved ? (
                <>
                  <VotePatterns
                    recipients={electionData.recipients}
                    electionType={electionData.electionType}
                    isApproved={isApproved}
                    tokenCounts={electionData.tokenCounts}
                  />
                </>
              ) : null}
              {isOwner || isCoordinator ? (
                <>
                  {isOwner ? (
                    <OwnerActions isPublished={isPublished} isApproved={isApproved} />
                  ) : (
                    <CoordinatorActions isPublished={isPublished} isApproved={isApproved} />
                  )}
                </>
              ) : (
                <>
                  {tokenState & TokenType.SIGNUP ? (
                    <VoteActions
                      recipients={electionData.recipients}
                      electionType={electionData.electionType}
                      isPublished={isPublished}
                      isApproved={isApproved}
                    />
                  ) : (
                    <TokenButtons
                      tokenState={tokenState}
                      zkCreamAddress={zkCreamAddress}
                      maciAddress={electionData.maciAddress}
                      votingTokenAddress={electionData.votingTokenAddress}
                    />
                  )}
                </>
              )}
            </AutoColumn>
            <AutoColumn gap="sm">
              <Text fontSize={[2]}>
                <Trans>Administration Committees</Trans>
              </Text>
              <Text fontSize={[1]}>
                <Trans>Group owner</Trans>
              </Text>
              <Text fontSize={[1]}>{electionData.owner}</Text>
              <Text fontSize={[1]}>
                <Trans>Coordinator</Trans>
              </Text>
              <Text fontSize={[1]}>{electionData.coordinator}</Text>
              <Text fontSize={[1]}>
                <Trans>Tally Hash</Trans>
              </Text>
              <Text fontSize={[1]}>{electionData.tallyHash}</Text>
            </AutoColumn>
          </>
        )}
      </ElectionInfo>
    </PageWrapper>
  )
}
