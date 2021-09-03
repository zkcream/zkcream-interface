import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ApplicationModal } from '../../state/application/actions'
import {
  useModalOpen,
  usePostSignUpModalToggle,
  useToggleable,
  useToggleToggleable,
} from '../../state/application/hooks'
import { ButtonInverse } from '../Button'
import MultiLevelModal, { MultiLevelModalContent } from '../MultiLevelModal'
import { PostSignUpData } from '../QrModal'

const ExportButtonStyle = styled(ButtonInverse)`
  background: none;
  margin-left: 0.5rem;
  font-size: 0.75rem;
`

interface ExportButtonProps {
  maciAddress: string
}

export default function ExportButton({ maciAddress }: ExportButtonProps) {
  const [data, setData] = useState<PostSignUpData>({ maciSk: '', signUpIndex: 0, nonce: undefined })
  let history = useHistory()
  const isOpen = useModalOpen(ApplicationModal.POST_SIGNUP)
  const toggleModal = usePostSignUpModalToggle()
  const toggleable = useToggleable()
  const setUntoggleable = useToggleToggleable()

  function fetchAndToggleModal() {
    const r = JSON.parse(window.localStorage.getItem(maciAddress)!)
    const d: PostSignUpData = {
      maciSk: r.macisk,
      signUpIndex: parseInt(r.stateIndex),
      nonce: parseInt(r.nonce),
    }
    setData(d)
    toggleModal()
    setUntoggleable()
  }

  function closeModal() {
    if (!toggleable) return
    window.localStorage.clear()
    history.push('/')
    toggleModal()
  }

  return (
    <>
      <MultiLevelModal isOpen={isOpen} onDismiss={closeModal} content={MultiLevelModalContent.PostSignUp} data={data} />
      <ExportButtonStyle padding={'5px'} width={'170px'} onClick={fetchAndToggleModal}>
        <Trans>Export State</Trans>
      </ExportButtonStyle>
    </>
  )
}
