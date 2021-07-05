import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppState } from '../index'

import { ApplicationModal, setOpenModal } from './actions'

/*
 * modals
 */
export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useAppSelector((state: AppState) => state.application.openModal)
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
