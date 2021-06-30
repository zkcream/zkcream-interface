import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components/macro'
import { Text } from 'rebass'

import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks/web3'
import { useVotingTokenContract } from '../../hooks/useContract'
import { ElectionData, useElectionData } from '../../state/election/hooks'
import { UserToken, useUserTokenStatus } from '../../state/user/hooks'
import { StyledInternalLink } from '../../theme'

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
  const [isApproved, setApproved] = useState<boolean | undefined>()
  const [approveState, setApproveState] = useState<string | undefined>('Approve token')

  const { account } = useActiveWeb3React()

  /* get election details */
  const electionData: ElectionData | undefined = useElectionData(address)

  /* get user details */
  const userData: UserToken | undefined = useUserTokenStatus(address, account)

  /* Set contract instance */
  const votingTokenContract = useVotingTokenContract(electionData?.votingTokenAddress as string)

  useEffect(() => {
    async function getTokenStatus(votingTokenContract: any) {
      const r = await votingTokenContract.isApprovedForAll(account, address)
      setApproved(r)
    }

    if (votingTokenContract && isApproved === undefined) {
      getTokenStatus(votingTokenContract)
    }
  }, [account, address, isApproved, votingTokenContract])

  async function approveToken(e: any) {
    e.preventDefault()
    setApproveState('Approving...')

    if (votingTokenContract) {
      const r = await votingTokenContract.setApprovalForAll(address, true)
      if (r.status) {
        await r.wait()
        setApproveState('Approved')
      }
    } else {
      throw new Error('error')
    }
  }

  function signUpMaci() {
    console.log('foo')
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <ElectionInfo gap="lg" justify="start">
        {electionData && (
          <>
            <AutoColumn gap="10px" style={{ width: '100%' }}>
              <ArrowWrapper to={'/'}>
                <ArrowLeft size={20} />
                All Elections
              </ArrowWrapper>
              {userData.votingToken ? (
                <>
                  <ButtonPrimary disabled={isApproved} onClick={approveToken}>
                    {approveState}
                  </ButtonPrimary>
                  <ButtonPrimary onClick={signUpMaci}>Register</ButtonPrimary>
                </>
              ) : null}
              {userData.maciToken ? (
                <ButtonPrimary>Create Message</ButtonPrimary>
              ) : (
                <ButtonPrimary padding="8px" borderRadius="8px" width="25%">
                  Sign up
                </ButtonPrimary>
              )}
              <Text fontSize={[5]} fontWeight="bold" mt={4} mb={2}>
                {electionData.title}
              </Text>
              <Recipients recipients={electionData.recipients} electionType={electionData.electionType} />
            </AutoColumn>
            <AutoColumn gap="sm">
              <Text fontSize={[3]} fontWeight="bold">
                Administration Committees
              </Text>
              <p>
                <Text fontSize={[2]} fontWeight="bold">
                  Group owner
                </Text>
                {electionData.owner}
              </p>
              <p>
                <Text fontSize={[2]} fontWeight="bold">
                  Coordinator
                </Text>
                {electionData.coordinator}
              </p>
            </AutoColumn>
          </>
        )}
      </ElectionInfo>
    </PageWrapper>
  )
}
