import { useCallback, useMemo, useState } from 'react'
import { createDeposit, rbigInt, toHex } from 'libcream'

import { useZkCreamContract } from './useContract'
import { useNoteModalToggle } from '../state/application/hooks'
import { useFetchTokenState } from '../state/token/hooks'
import { useActiveWeb3React } from './web3'
import { NoteData } from '../components/QrModal'

export function useDepositCallback(
  zkCreamAddress: string
): [state: boolean, note: NoteData, callback: () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const [txState, setTxState] = useState<boolean>(false)
  const [preimage, setPreimage] = useState<NoteData>({ note: '' })
  const toggleModal = useNoteModalToggle()

  const zkCreamContract = useZkCreamContract(zkCreamAddress)
  const arg: any = { zkCreamAddress, account }
  const fetchTokenState = useFetchTokenState(arg)

  const c = useCallback(async (): Promise<void> => {
    setTxState(true)
    const deposit = createDeposit(rbigInt(31), rbigInt(31))
    return await zkCreamContract
      .deposit(toHex(deposit.commitment))
      .then(async (r: any) => {
        const w = await r.wait()
        if (w.status) {
          setTxState(false)
        }
      })
      .then(() => {
        fetchTokenState()
      })
      .then(() => {
        setPreimage({ note: toHex(deposit.preimage) })
        toggleModal()
      })
      .catch((e: Error) => {
        console.log('deposit error: ', e.message)
        setTxState(false)
        throw e
      })
  }, [fetchTokenState, toggleModal, zkCreamContract])

  const note: NoteData = useMemo(() => preimage, [preimage])

  return [txState, note, c]
}
