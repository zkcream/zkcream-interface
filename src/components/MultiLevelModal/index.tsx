import styled from 'styled-components'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { ContentData } from '../QrModal'
import Deploy from './Deploy'
import Note from './Note'
import PostSignUp from './PostSignUp'
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
  PostSignUp,
  VoterState,
}

interface MultiLevelModalProps {
  isOpen: boolean
  onDismiss: () => void
  content: MultiLevelModalContent
  data?: ContentData
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
            3: <PostSignUp toggleModal={onDismiss} data={data!} />,
            4: <VoterState toggleModal={onDismiss} />,
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
