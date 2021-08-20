import { useCallback } from 'react'
import { createMessage } from 'libcream'
import { genRandomSalt } from 'maci-crypto'
import { Keypair, PrivKey, PubKey } from 'maci-domainobjs'

import { useMaciContract } from './useContract'
import { useElectionState } from '../state/election/hooks'

// TODO
const voiceCredits = 2 // bnSqrt(BigNumber.from(2)) = 0x01, BigNumber

export function usePublishMessageCallback(): (
  recipientIndex: number | null,
  stateIndex: number,
  nonce: number,
  maciSk: string,
  setMaciSk: any
) => Promise<void> {
  const { maciAddress, maciParams }: any = useElectionState()
  const maciContract = useMaciContract(maciAddress)
  const { coordinatorPubKey } = maciParams
  // const [macisk, setMaciSk] = useLocalStorage('macisk', '')

  return useCallback(
    async (recipientIndex, stateIndex, nonce, maciSk, setMaciSk): Promise<void> => {
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
        return await maciContract.publishMessage(message.asContractParam(), encPubKey.asContractParam())
      } else {
        const newUserKeyPair = new Keypair()
        const [message, encPubKey] = createMessage(
          Number(stateIndex),
          userKeyPair,
          newUserKeyPair,
          retrievedPubKey,
          null,
          null,
          Number(nonce)
        )
        setMaciSk(newUserKeyPair.privKey.serialize())
        return await maciContract.publishMessage(message.asContractParam(), encPubKey.asContractParam())
      }
    },
    [coordinatorPubKey, maciContract]
  )
}
