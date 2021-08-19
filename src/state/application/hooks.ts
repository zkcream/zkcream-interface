import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { RootState } from '../index'

import { ApplicationModal, setOpenModal } from './actions'

/*
 * modals
 */
export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useAppSelector((state: RootState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET)
}

export function useDeployModalToggle(): () => void {
  return useToggleModal(ApplicationModal.DEPLOY)
}

export function useNoteModalToggle(): () => void {
  return useToggleModal(ApplicationModal.NOTE)
}

export function useSignUpModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SIGNUP)
}

export function usePostSignUpModalToggle(): () => void {
  return useToggleModal(ApplicationModal.POST_SIGNUP)
}

export function useVoterStateModalToggle(): () => void {
  return useToggleModal(ApplicationModal.VOTERSTATE)
}

export function usePostProcessMessageModalToggle(): () => void {
  return useToggleModal(ApplicationModal.POST_PROCESSMESSAGE)
}

export function useRandomStateLeafModalToggle(): () => void {
  return useToggleModal(ApplicationModal.RANDOM_STATELEAF)
}

export function useDistributeModalToggle(): () => void {
  return useToggleModal(ApplicationModal.DISTRIBUTE)
}

export function useCoordinatorKeyModalToggle(): () => void {
  return useToggleModal(ApplicationModal.COORDINATOR_KEY)
}
