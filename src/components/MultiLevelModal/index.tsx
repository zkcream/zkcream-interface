import styled from 'styled-components'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import Deploy from './Deploy'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

export enum MultiLevelModalContent {
  Deploy,
}

interface MultiLevelModalProps {
  isOpen: boolean
  onDismiss: () => void
  content: MultiLevelModalContent
}

export default function MultiLevelModal({ isOpen, onDismiss, content }: MultiLevelModalProps) {
  function getModalcontent() {
    return (
      <>
        {
          {
            0: <Deploy toggleModal={onDismiss} />,
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
