import { useCallback } from 'react'
import { generateDeposit, generateMerkleProof, pedersenHash, toHex } from 'libcream'
import { Keypair } from 'maci-domainobjs'

import { useZkCreamContract } from './useContract'
import { post } from '../utils/api'

const PARAMS = {
  depth: process.env.REACT_APP_MERKLETREE_HEIGHT,
  zero_value: process.env.REACT_APP_ZERO_VALUE,
}

export function useSignUpCallback(address: string) {
  const zkCreamContract = useZkCreamContract(address)
  return useCallback(
    async (note): Promise<void> => {
      const userKeypair = new Keypair()
      const deposit = generateDeposit(note)
      const { root, merkleProof } = await generateMerkleProof(deposit, address, PARAMS)

      const input = {
        root,
        nullifierHash: pedersenHash(deposit.nullifier.leInt2Buff(31)).babyJubX,
        nullifier: deposit.nullifier,
        secret: deposit.secret,
        path_elements: merkleProof[0],
        path_index: merkleProof[1],
      }

      const userPubKey = userKeypair.pubKey.asContractParam()
      const data = {
        input: JSON.stringify(input, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
      }

      const formattedProof = await post('zkcream/genproof', data)

      const args = [toHex(input.root), toHex(input.nullifierHash)]

      return await zkCreamContract.signUpMaci(userPubKey, formattedProof.data, ...args).then()
    },
    [address, zkCreamContract]
  )
}
