import { useCallback } from 'react'
import { createMessage } from 'libcream'
import { genRandomSalt } from 'maci-crypto'
import { Keypair, PrivKey } from 'maci-domainobjs'

import { useMaciContract } from './useContract'

/* TEMP */
const voiceCredits = 2 // bnSqrt(BigNumber.from(2)) = 0x01, BigNumber
const coordinatorPrivKey = '2222222222263902553431241761119057960280734584214105336279476766401963593688'
const coordinator = new Keypair(new PrivKey(BigInt(coordinatorPrivKey)))

// TODO
const userKeypair = new Keypair()

export function usePublishMessageCallback(
  maciAddress: string
): (recipientIndex: number | null, stateIndex: number, nonce: number) => Promise<void> {
  const maciContract = useMaciContract(maciAddress)

  return useCallback(
    async (recipientIndex, stateIndex, nonce): Promise<void> => {
      if (recipientIndex) {
        const [message, encPubKey] = createMessage(
          stateIndex,
          userKeypair,
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
          userKeypair,
          newUserKeyPair,
          coordinator.pubKey,
          null,
          null,
          nonce
        )
        return await maciContract.publishMessage(message.asContractParam(), encPubKey.asContractParam())
      }
    },
    [maciContract]
  )
}
