import { useCallback, useState } from 'react'
import { createMessage } from 'libcream'
import { genRandomSalt } from 'maci-crypto'
import { Keypair, PrivKey, PubKey } from 'maci-domainobjs'

import { useMaciContract } from './useContract'
import { useElectionState } from '../state/election/hooks'

// TODO
const voiceCredits = 2 // bnSqrt(BigNumber.from(2)) = 0x01, BigNumber

export function usePublishMessageCallback(): [
  state: boolean,
  callback: (
    recipientIndex: number | null,
    stateIndex: number,
    nonce: number,
    maciSk: string,
    setMaciSk: any
  ) => Promise<void>
] {
  const [txState, setTxState] = useState<boolean>(false)
  const { maciAddress, maciParams }: any = useElectionState()
  const maciContract = useMaciContract(maciAddress)
  const { coordinatorPubKey } = maciParams

  const c = useCallback(
    async (recipientIndex, stateIndex, nonce, maciSk, setMaciSk): Promise<void> => {
      setTxState(true)
      const privKey: PrivKey | undefined = maciSk !== '' ? PrivKey.unserialize(maciSk) : undefined
      const userKeyPair: Keypair | undefined = privKey ? new Keypair(privKey) : undefined
      const rawPubKey = [BigInt(coordinatorPubKey[0].hex), BigInt(coordinatorPubKey[1].hex)]
      const retrievedPubKey = new PubKey(rawPubKey)

      if (recipientIndex !== null) {
        const [message, encPubKey] = createMessage(
          Number(stateIndex),
          userKeyPair,
          null,
          retrievedPubKey,
          recipientIndex,
          voiceCredits,
          Number(nonce),
          genRandomSalt()
        )
        await maciContract
          .publishMessage(message.asContractParam(), encPubKey.asContractParam())
          .then(async (r: any) => {
            const w = await r.wait()
            if (w.status) {
              setTxState(false)
            }
          })
          .catch((e: Error) => {
            console.log('publish message error: ', e.message)
            setTxState(false)
            throw e
          })
      } else {
        const newUserKeyPair = new Keypair()
        const [message, encPubKey] = createMessage(
          Number(stateIndex),
          userKeyPair,
          newUserKeyPair,
          retrievedPubKey,
          null,
          null,
          Number(nonce - 1) // new key command does not need to increment nonce
        )
        setMaciSk(newUserKeyPair.privKey.serialize())
        await maciContract
          .publishMessage(message.asContractParam(), encPubKey.asContractParam())
          .then(async (r: any) => {
            const w = await r.wait()
            if (w.status) {
              setTxState(false)
            }
          })
          .catch((e: Error) => {
            console.log('publish message error: ', e.message)
            setTxState(false)
            throw e
          })
      }
    },
    [coordinatorPubKey, maciContract]
  )

  return [txState, c]
}
