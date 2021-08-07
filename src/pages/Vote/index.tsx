import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Box } from 'rebass'
import { Button } from 'rebass/styled-components'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import DeployModal from '../../components/DeployModal'
import Paging from '../../components/Paging'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useDeployModalToggle } from '../../state/application/hooks'
import { useLimitedElectionData, useTotalElections } from '../../state/election/hooks'
import { ElectionData } from '../../state/election/reducer'

const PageWrapper = styled(AutoColumn)`
  color: ${({ theme }) => theme.white};
`

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const PageTitle = styled.h2`
  text-align: center;
`

const Election = styled(Button)`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  border: ${({ theme }) => theme.greyText} 1px solid;
  display: grid;
  grid-template-columns: 240px 1fr 120px;
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

const ApprovedWrapper = styled(Box)`
  display: inline-block;
  background: ${({ theme }) => theme.greyText};
  color: white;
  border-radius: 999px;
  font-size: 0.85rem;
  padding: 0.25rem;
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
        <PageTitle>
          <Trans>Elections</Trans>
        </PageTitle>
        <ButtonPrimary onClick={toggleModal}>
          <Trans>Create new Election</Trans>
        </ButtonPrimary>
        {electionsData?.length === 0 && (
          <EmptyElections>
            <Trans>No elections found</Trans>
          </EmptyElections>
        )}
        {electionsData?.map((e: ElectionData, i) => {
          return (
            <Election as={Link} to={'/vote/' + e.zkCreamAddress} key={i}>
              <ElectionTitle>{e.title}</ElectionTitle>
              {e.approved ? (
                <ApprovedWrapper>
                  <Trans>Approved</Trans>
                </ApprovedWrapper>
              ) : null}
            </Election>
          )
        })}
      </TopSection>
      {totalElectionNum > 5 ? <Paging total={totalElectionNum} /> : null}
    </PageWrapper>
  )
}
