import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { darken } from 'polished'
import { Button } from 'rebass/styled-components'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
//import DeployModal from '../../components/DeployModal'
import MultiLevelModal, { MultiLevelModalContent } from '../../components/MultiLevelModal'
import Paging from '../../components/Paging'
import { RowBetween } from '../../components/Row'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useDeployModalToggle } from '../../state/application/hooks'
import { ElectionState, useLimitedElectionData, useTotalElections } from '../../state/election/hooks'
import { ElectionData } from '../../state/election/reducer'
import { ElectionStatus } from './styled'

const PageWrapper = styled(AutoColumn)`
  color: ${({ theme }) => theme.white};
`

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const PageTitle = styled.span`
  font-weight: 600;
`

const WrapSmall = styled(RowBetween)`
  margin-bottom: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
  `};
`

const Election = styled(Button)`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 480px 1fr 20px;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
  color: ${({ theme }) => theme.white};
  text-decoration: none;
  background-color: ${({ theme }) => darken(0.03, theme.darkBackgraound)};
  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.darkBackgraound)};
  }
`

const ElectionTitle = styled.span`
  font-weight: 600;
  width: fit-content;
  color: ${({ theme }) => theme.white};
`

const EmptyElections = styled.div`
  width: 480px;
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
      <MultiLevelModal isOpen={deployModalOpen} onDismiss={toggleModal} content={MultiLevelModalContent.Deploy} />
      {/* <DeployModal isOpen={deployModalOpen} onDismiss={toggleModal} /> */}
      <TopSection gap="2px">
        <WrapSmall>
          <PageTitle>
            <Trans>Elections</Trans>
          </PageTitle>
          <ButtonPrimary onClick={toggleModal} style={{ width: 'fit-content', borderRadius: '8px' }} padding="8px">
            <Trans>Create new Election</Trans>
          </ButtonPrimary>
        </WrapSmall>
        {electionsData?.length === 0 && (
          <EmptyElections>
            <Trans>No elections found</Trans>
          </EmptyElections>
        )}
        {electionsData?.map((e: ElectionData, i) => {
          return (
            <Election as={Link} to={'/vote/' + e.zkCreamAddress} key={i}>
              <ElectionTitle>{e.title}</ElectionTitle>
              <ElectionStatus status={e.approved ? ElectionState.FINISHED : ElectionState.ACTIVE} />
            </Election>
          )
        })}
      </TopSection>
      {totalElectionNum > 5 ? <Paging total={totalElectionNum} /> : null}
    </PageWrapper>
  )
}
