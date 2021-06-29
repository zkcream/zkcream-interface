import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppState } from '../index'

import { ApplicationModal, PagingAction, setOpenModal, updateCurrentPage } from './actions'

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

/*
 * paging for election lists
 */
export function useCurrentPage(): number {
  return useAppSelector((state: AppState) => state.application.currentPage)
}

export function useUpdateCurrentPage(action: PagingAction): () => void {
  const current = useCurrentPage()
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(updateCurrentPage(action ? current + 1 : current - 1)), [dispatch, action, current])
}

export function useLoadPrevPage(): () => void {
  return useUpdateCurrentPage(PagingAction.PREV)
}

export function useLoadNextPage(): () => void {
  return useUpdateCurrentPage(PagingAction.NEXT)
}
