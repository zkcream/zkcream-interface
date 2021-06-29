import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from 'rebass/styled-components'

import DeployModal from '../../components/DeployModal'
import Paging from '../../components/Paging'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useDeployModalToggle } from '../../state/application/hooks'
import { ElectionData, useLimitedElectionData, useTotalElections } from '../../state/election/hooks'

const Election = styled(Button)`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  display: grid;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
`

const ElectionTitle = styled.span`
  font-weight: 600;
`

const EmptyElections = styled.div`
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Vote() {
  // should return (empty or non empty) array
  const electionsData: ElectionData[] = useLimitedElectionData()
  const totalElectionNum = useTotalElections()

  // toggle deploy modal
  const deployModalOpen = useModalOpen(ApplicationModal.DEPLOY)
  const toggleModal = useDeployModalToggle()

  return (
    <>
      <DeployModal isOpen={deployModalOpen} />
      <div>
        <h2>Elections</h2>
        <button onClick={toggleModal}>Create new Election</button>
      </div>
      {electionsData?.length === 0 && <EmptyElections>No elections found</EmptyElections>}
      {electionsData?.map((e: ElectionData, i) => {
        return (
          <Election as={Link} to={'/vote/' + e.zkCreamAddress} key={i}>
            <ElectionTitle>{e.title}</ElectionTitle>
          </Election>
        )
      })}
      {totalElectionNum > 5 ? <Paging total={totalElectionNum} /> : null}
    </>
  )
}
