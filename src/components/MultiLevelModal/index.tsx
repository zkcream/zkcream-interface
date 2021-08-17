import styled from 'styled-components'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { NoteData } from '../QrModal'
import Deploy from './Deploy'
import Note from './Note'
import SignUp from './SignUp'
import VoterState from './VoterState'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

export enum MultiLevelModalContent {
  Deploy,
  Note,
  SignUp,
  VoterState,
}

interface MultiLevelModalProps {
  isOpen: boolean
  onDismiss: () => void
  content: MultiLevelModalContent
  data?: NoteData
  zkCreamAddress?: string
  maciAddress?: string
}

export default function MultiLevelModal({
  isOpen,
  onDismiss,
  content,
  data,
  zkCreamAddress,
  maciAddress,
}: MultiLevelModalProps) {
  function getModalcontent() {
    return (
      <>
        {
          {
            0: <Deploy toggleModal={onDismiss} />,
            1: <Note toggleModal={onDismiss} data={data!} />,
            2: <SignUp toggleModal={onDismiss} zkCreamAddress={zkCreamAddress!} maciAddress={maciAddress!} />,
            3: <VoterState toggleModal={onDismiss} />,
          }[content]
        }
      </>
    )
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper gap="lg">{getModalcontent()}</ContentWrapper>
    </Modal>
  )
}
