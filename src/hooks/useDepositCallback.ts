import { useCallback, useMemo, useState } from 'react'
import { createDeposit, rbigInt, toHex } from 'libcream'

import { useZkCreamContract } from './useContract'
import { useNoteModalToggle } from '../state/application/hooks'

type DepositNote = string | undefined

export function useDepositCallback(
  address: string
): [state: boolean, note: DepositNote, callback: () => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const [preimage, setPreimage] = useState<string>()
  const toggleModal = useNoteModalToggle()

  const zkCreamContract = useZkCreamContract(address)

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
        setPreimage(toHex(deposit.preimage))
        toggleModal()
      })
      .catch((e: Error) => {
        console.log('deposit error: ', e.message)
        setTxState(false)
        throw e
      })
  }, [toggleModal, zkCreamContract])

  const note: DepositNote = useMemo(() => preimage, [preimage])

  return [txState, note, c]
}
