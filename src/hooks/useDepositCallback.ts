import { useCallback, useMemo, useState } from 'react'
import { createDeposit, rbigInt, toHex } from 'libcream'

import { useZkCreamContract } from './useContract'
import { useNoteModalToggle } from '../state/application/hooks'

type DepositNote = string | undefined

export function useDepositCallback(address: string): [DepositNote, () => Promise<void>] {
  const [preimage, setPreimage] = useState<string>()
  const toggleModal = useNoteModalToggle()

  const zkCreamContract = useZkCreamContract(address)

  const tx = useCallback(async (): Promise<void> => {
    const deposit = createDeposit(rbigInt(31), rbigInt(31))
    return await zkCreamContract
      .deposit(toHex(deposit.commitment))
      .then(async (r: any) => {
        if (r.status) {
          await r.wait()
        }
      })
      .then(() => {
        setPreimage(toHex(deposit.preimage))
        toggleModal()
      })
      .catch((e: Error) => {
        console.log('deposit error: ', e.message)
        throw e
      })
  }, [toggleModal, zkCreamContract])

  const note: DepositNote = useMemo(() => preimage, [preimage])

  return [note, tx]
}
