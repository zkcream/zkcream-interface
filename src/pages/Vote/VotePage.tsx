import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useActiveWeb3React } from '../../hooks/web3'
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
  const { account } = useActiveWeb3React()

  const electionData: ElectionData | undefined = useElectionData(address)
  const userData: UserToken | undefined = useUserTokenStatus(address, account)

  return (
    <ElectionInfo>
      {electionData && (
        <>
          <div>
            <div>
              <ArrowWrapper to={'/'}>Back</ArrowWrapper>
              <div>STATUS goes here</div>
              {userData.votingToken ? (
                <div>
                  <button>Approve Voting token</button>
                  <button>Register</button>
                </div>
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
