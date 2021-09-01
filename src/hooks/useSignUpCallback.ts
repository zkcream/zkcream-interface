import { useCallback, useState } from 'react'
import { generateDeposit, generateMerkleProof, pedersenHash, toHex } from 'libcream'
import { Keypair } from 'maci-domainobjs'

import { useMaciContract, useZkCreamContract } from './useContract'
import { useLocalStorage } from './useLocalStorage'
import { StateIndex } from '../state/election/reducer'
import { post } from '../utils/api'
import { FormatError, TxError } from '../utils/error'
import { useToggleToggleable } from '../state/application/hooks'

const PARAMS = {
  depth: process.env.REACT_APP_MERKLETREE_HEIGHT,
  zero_value: process.env.REACT_APP_ZERO_VALUE,
}

export function useSignUpCallback(
  zkCreamAddress: string,
  maciAddress: string
): [state: boolean, index: StateIndex, mackSk: string, callback: (note: string) => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const [stateIndex, setStateIndex] = useLocalStorage('stateIndex', '0')

  const [macisk, setMaciSk] = useState<string>('')

  const zkCreamContract = useZkCreamContract(zkCreamAddress)
  const maciContract = useMaciContract(maciAddress)
  const setUntoggleable = useToggleToggleable()

  const c = useCallback(
    async (note): Promise<void> => {
      setTxState(true)
      if (!note.startsWith('0x') || note.length !== 126) {
        setTxState(false)
        throw new FormatError('Note need to start with 0x or 126-bit length')
      }

      let deposit
      try {
        deposit = generateDeposit(note)
      } catch (e) {
        setTxState(false)
        throw new TxError('Generate deposit failed')
      }

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

      let formattedProof
      try {
        formattedProof = await post('zkcream/genproof', data)
      } catch (e) {
        setTxState(false)
        throw new TxError('Generate proof failed')
      }

      const userKeyPair: Keypair = new Keypair()
      // store userPubKey to local storage
      setMaciSk(userKeyPair.privKey.serialize())

      const args = [toHex(input.root), toHex(input.nullifierHash)]
      return await zkCreamContract
        .signUpMaci(userKeyPair?.pubKey.asContractParam(), formattedProof.data, ...args)
        .then(async (r: any) => {
          await r.wait()
        })
        .then(async () => {
          await maciContract.on('SignUp', (_: any, _stateIndex: any) => {
            // store _stateIndex to local storage as string type
            setStateIndex(_stateIndex.toString())
            setUntoggleable()
            setTxState(false)
          })
        })
        .catch((e: Error) => {
          setTxState(false)
          throw new TxError('SignUpMaci contract tx failed')
        })
    },
    [maciContract, setMaciSk, setUntoggleable, zkCreamAddress, zkCreamContract, setStateIndex]
  )

  return [txState, stateIndex, macisk, c]
}
