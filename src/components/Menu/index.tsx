import { Trans } from '@lingui/macro'
import { useEffect } from 'react'
import styled from 'styled-components'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, usePostSignUpModalToggle } from '../../state/application/hooks'
import { ButtonInverse } from '../Button'
import MultiLevelModal, { MultiLevelModalContent } from '../MultiLevelModal'
import { PostSignUpData } from '../QrModal'

const ExportButton = styled(ButtonInverse)`
  background: none;
`

export default function Menu() {
  const isOpen = useModalOpen(ApplicationModal.POST_SIGNUP)
  const toggleModal = usePostSignUpModalToggle()

  const [stateIndex] = useLocalStorage('stateIndex', '0')
  const [nonce] = useLocalStorage('nonce', '1')
  const [maciSk] = useLocalStorage('macisk', '0')

  const data: PostSignUpData = {
    maciSk: maciSk,
    signUpIndex: parseInt(stateIndex),
    nonce: nonce,
  }

  function closeModal() {
    window.localStorage.clear()
    toggleModal()
  }

  return (
    <>
      <MultiLevelModal isOpen={isOpen} onDismiss={closeModal} content={MultiLevelModalContent.PostSignUp} data={data} />
      <ExportButton padding={'5px'} width={'160px'} onClick={toggleModal}>
        <Trans>Export State</Trans>
      </ExportButton>
    </>
  )
}
