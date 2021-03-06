import { useCallback } from 'react'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAppDispatch, useAppSelector } from '../hooks'
import { RootState } from '../index'

import { ApplicationModal, setOpenModal, toggleToggleable } from './actions'

/*
 * blockNumber
 */
export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React()

  return useAppSelector((state: RootState) => state.application.blockNumber[chainId ?? -1])
}

/*
 * modals
 */
export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useAppSelector((state: RootState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const toggleable = useToggleable()
  const dispatch = useAppDispatch()
  return useCallback(
    () => (toggleable ? dispatch(setOpenModal(open ? null : modal)) : console.error('cannot dismiss')),
    [dispatch, modal, open, toggleable]
  )
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

export function useToggleable(): boolean {
  return useAppSelector((state: RootState) => state.application.toggleable)
}

/* set modal toggleable/untoggleable to let the user check the ckeckbox */
export function useToggleToggleable(): () => void {
  const state = useToggleable()
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(toggleToggleable(state)), [dispatch, state])
}
