import styled from 'styled-components'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { NoteData } from '../QrModal'
import Deploy from './Deploy'
import Note from './Note'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

export enum MultiLevelModalContent {
  Deploy,
  Note,
}

interface MultiLevelModalProps {
  isOpen: boolean
  onDismiss: () => void
  content: MultiLevelModalContent
  data?: NoteData
}

export default function MultiLevelModal({ isOpen, onDismiss, content, data }: MultiLevelModalProps) {
  function getModalcontent() {
    return (
      <>
        {
          {
            0: <Deploy toggleModal={onDismiss} />,
            1: <Note toggleModal={onDismiss} data={data!} />,
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
