import styled from 'styled-components'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { ContentData } from '../QrModal'
import Deploy from './Deploy'
import Note from './Note'
import PostSignUp from './PostSignUp'
import ReadRandomStateLeaf from './ReadRandomStateLeaf'
import ReadCoordinatorKey from './ReadCoordinatorKey'
import SignUp from './SignUp'
import VoterState from './VoterState'
import PostProcessMessage from './PostProcessMessage'

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
  CoordinatorKey,
  PostProcessMessage,
  ReadRandomStateLeaf,
}

interface MultiLevelModalProps {
  isOpen: boolean
  onDismiss: () => void
  content: MultiLevelModalContent
  data?: ContentData
  zkCreamAddress?: string
  maciAddress?: string
  setStateIndex?: any
  setNonce?: any
  setMaciSk?: any
}

export default function MultiLevelModal({
  isOpen,
  onDismiss,
  content,
  data,
  zkCreamAddress,
  maciAddress,
  setStateIndex,
  setNonce,
  setMaciSk,
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
            4: (
              <VoterState
                toggleModal={onDismiss}
                setStateIndex={setStateIndex}
                setNonce={setNonce}
                setMaciSk={setMaciSk}
              />
            ),
            5: <ReadCoordinatorKey toggleModal={onDismiss} />,
            6: <PostProcessMessage toggleModal={onDismiss} data={data!} />,
            7: <ReadRandomStateLeaf toggleModal={onDismiss} />,
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
