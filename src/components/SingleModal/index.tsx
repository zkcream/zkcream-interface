import styled from 'styled-components'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import Distribute from './Distribute'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

export enum SingleModalContent {
  Distribute,
}

interface SingleModalProps {
  isOpen: boolean
  onDismiss: () => void
  content: SingleModalContent
}

export default function SingleModal({ isOpen, onDismiss, content }: SingleModalProps) {
  function getModalContent(content: SingleModalContent) {
    return (
      <>
        {
          {
            0: <Distribute toggleModal={onDismiss} />,
          }[content]
        }
      </>
    )
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper gap="lg">{getModalContent(content)}</ContentWrapper>
    </Modal>
  )
}
