import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useActiveWeb3React } from '../../hooks/web3'
import { useVotingTokenContract } from '../../hooks/useContract'
import { ElectionData, useElectionData } from '../../state/election/hooks'
import { UserToken, useUserTokenStatus } from '../../state/user/hooks'
import { StyledInternalLink } from '../../theme'

import Recipients from './Recipients'

const ElectionInfo = styled.div`
  padding: 1.5rem;
  max-width: 640px;
  width: 100%;
`

const ArrowWrapper = styled(StyledInternalLink)``

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
    <ElectionInfo>
      {electionData && (
        <>
          <div>
            <div>
              <ArrowWrapper to={'/'}>Back</ArrowWrapper>
              {userData.votingToken ? (
                <>
                  <div>
                    <button disabled={isApproved} onClick={approveToken}>
                      {approveState}
                    </button>
                  </div>
                  <div>
                    <button onClick={signUpMaci}>Register</button>
                  </div>
                </>
              ) : null}
              {userData.maciToken ? (
                <div>
                  <button>Create Message</button>
                </div>
              ) : (
                <button>Sign up maci</button>
              )}
            </div>
          </div>
          <p>{electionData.title}</p>
          <Recipients recipients={electionData.recipients} electionType={electionData.electionType} />
          <p>owner: {electionData.owner}</p>
          <p>coordinator: {electionData.coordinator}</p>
        </>
      )}
    </ElectionInfo>
  )
}
