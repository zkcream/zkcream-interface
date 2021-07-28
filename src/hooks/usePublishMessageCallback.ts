import { useCallback, useMemo } from 'react'
import { createMessage } from 'libcream'
import { genRandomSalt } from 'maci-crypto'
import { Keypair, PrivKey } from 'maci-domainobjs'

import { useMaciContract } from './useContract'
import { useLocalStorage } from './useLocalStorage'

// TODO
const voiceCredits = 2 // bnSqrt(BigNumber.from(2)) = 0x01, BigNumber
const coordinatorPrivKey: string = process.env.REACT_APP_COORDINATOR_PRIVKEY!
const coordinator = new Keypair(new PrivKey(BigInt(coordinatorPrivKey)))

export function usePublishMessageCallback(
  maciAddress: string
): (recipientIndex: number | null, stateIndex: number, nonce: number) => Promise<void> {
  const maciContract = useMaciContract(maciAddress)
  const [macisk, setMaciSk] = useLocalStorage('macisk', '')
  const privKey: PrivKey | undefined = macisk ? PrivKey.unserialize(macisk) : undefined
  const userKeyPair: Keypair | undefined = useMemo(() => (privKey ? new Keypair(privKey) : undefined), [privKey])

  return useCallback(
    async (recipientIndex, stateIndex, nonce): Promise<void> => {
      if (recipientIndex) {
        const [message, encPubKey] = createMessage(
          stateIndex,
          userKeyPair,
          null,
          coordinator.pubKey,
          recipientIndex,
          voiceCredits,
          nonce,
          genRandomSalt()
        )
        return await maciContract.publishMessage(message.asContractParam(), encPubKey.asContractParam())
      } else {
        const newUserKeyPair = new Keypair()
        const [message, encPubKey] = createMessage(
          stateIndex,
          userKeyPair,
          newUserKeyPair,
          coordinator.pubKey,
          null,
          null,
          nonce
        )
        setMaciSk(newUserKeyPair.privKey.serialize())
        return await maciContract.publishMessage(message.asContractParam(), encPubKey.asContractParam())
      }
    },
    [maciContract, setMaciSk, userKeyPair]
  )
}
