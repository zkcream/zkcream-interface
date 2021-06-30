import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from 'rebass/styled-components'

import { AutoColumn } from '../../components/Column'
import DeployModal from '../../components/DeployModal'
import Paging from '../../components/Paging'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useDeployModalToggle } from '../../state/application/hooks'
import { ElectionData, useLimitedElectionData, useTotalElections } from '../../state/election/hooks'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const Election = styled(Button)`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  border: ${({ theme }) => theme.greyText} 1px solid;
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
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
    <PageWrapper gap="lg" justify="center">
      <DeployModal isOpen={deployModalOpen} onDismiss={toggleModal} />
      <TopSection>
        <h2>Elections</h2>
        <button onClick={toggleModal}>Create new Election</button>
        {electionsData?.length === 0 && <EmptyElections>No elections found</EmptyElections>}
        {electionsData?.map((e: ElectionData, i) => {
          return (
            <Election as={Link} to={'/vote/' + e.zkCreamAddress} key={i}>
              <ElectionTitle>{e.title}</ElectionTitle>
            </Election>
          )
        })}
      </TopSection>
      {totalElectionNum > 5 ? <Paging total={totalElectionNum} /> : null}
    </PageWrapper>
  )
}
