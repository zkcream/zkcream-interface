import { useCallback, useMemo } from 'react'
import { createMessage } from 'libcream'
import { genRandomSalt } from 'maci-crypto'
import { Keypair, PrivKey, PubKey } from 'maci-domainobjs'

import { useMaciContract } from './useContract'
import { useLocalStorage } from './useLocalStorage'
import { useElectionState } from '../state/election/hooks'

// TODO
const voiceCredits = 2 // bnSqrt(BigNumber.from(2)) = 0x01, BigNumber

export function usePublishMessageCallback(): (
  recipientIndex: number | null,
  stateIndex: number,
  nonce: number
) => Promise<void> {
  const { maciAddress, maciParams }: any = useElectionState()
  const maciContract = useMaciContract(maciAddress)
  const { coordinatorPubKey } = maciParams
  const [macisk, setMaciSk] = useLocalStorage('macisk', '')

  const privKey: PrivKey | undefined = macisk !== '' ? PrivKey.unserialize(macisk) : undefined
  const userKeyPair: Keypair | undefined = useMemo(() => (privKey ? new Keypair(privKey) : undefined), [privKey])
  return useCallback(
    async (recipientIndex, stateIndex, nonce): Promise<void> => {
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
    [coordinatorPubKey, maciContract, setMaciSk, userKeyPair]
  )
}
