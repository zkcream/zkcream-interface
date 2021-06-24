import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
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
  const dispatch = useDispatch()
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

export function useUpdateCurrentPage(next: PagingAction): () => void {
  const current = useCurrentPage()
  const dispatch = useDispatch()
  return useCallback(() => dispatch(updateCurrentPage(next ? current + 1 : current - 1)), [dispatch, next, current])
}

export function useUpdatePrevPage(): () => void {
  return useUpdateCurrentPage(PagingAction.PREV)
}

export function useUpdateNextPage(): () => void {
  return useUpdateCurrentPage(PagingAction.NEXT)
}
