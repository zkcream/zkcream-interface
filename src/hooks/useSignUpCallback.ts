import { useCallback, useMemo, useState } from 'react'
import { generateDeposit, generateMerkleProof, pedersenHash, toHex } from 'libcream'
import { Keypair } from 'maci-domainobjs'

import { useMaciContract, useZkCreamContract } from './useContract'
import { post } from '../utils/api'

const PARAMS = {
  depth: process.env.REACT_APP_MERKLETREE_HEIGHT,
  zero_value: process.env.REACT_APP_ZERO_VALUE,
}

type StateIndex = string | undefined

export function useSignUpCallback(
  zkCreamAddress: string,
  maciAddress: string
): [StateIndex, (note: string) => Promise<void>] {
  const [index, setIndex] = useState<string>()
  const zkCreamContract = useZkCreamContract(zkCreamAddress)
  const maciContract = useMaciContract(maciAddress)

  const signUp = useCallback(
    async (note): Promise<void> => {
      const userKeypair = new Keypair()
      const deposit = generateDeposit(note)
      const { root, merkleProof } = await generateMerkleProof(deposit, zkCreamAddress, PARAMS)

      const input = {
        root,
        nullifierHash: pedersenHash(deposit.nullifier.leInt2Buff(31)).babyJubX,
        nullifier: deposit.nullifier,
        secret: deposit.secret,
        path_elements: merkleProof[0],
        path_index: merkleProof[1],
      }

      const data = {
        input: JSON.stringify(input, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
      }

      const formattedProof = await post('zkcream/genproof', data)

      const userPubKey = userKeypair.pubKey.asContractParam()
      const args = [toHex(input.root), toHex(input.nullifierHash)]
      return await zkCreamContract
        .signUpMaci(userPubKey, formattedProof.data, ...args)
        .then(async (r: any) => {
          if (r.status) {
            await r.wait()
          }
        })
        .then(async () => {
          await maciContract.on('SignUp', (_: any, _stateIndex: any) => {
            setIndex(_stateIndex.toString())
          })
        })
        .catch((e: Error) => {
          console.log('signup error: ', e.message)
          throw e
        })
    },
    [maciContract, zkCreamAddress, zkCreamContract]
  )

  const stateIndex: StateIndex = useMemo(() => index, [index])

  return [stateIndex, signUp]
}
