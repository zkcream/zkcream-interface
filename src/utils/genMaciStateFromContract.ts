// ported from https://github.com/appliedzkp/maci/blob/v0.4.11/cli/ts/utils.ts
import { Contract } from '@ethersproject/contracts'
import { Interface } from '@ethersproject/abi'
import { MaciState } from 'maci-core'
import { Keypair, Message, PubKey, StateLeaf } from 'maci-domainobjs'
import MACI from '../abis/MACI.json'
const MACI_ABI = MACI.abi

export async function genMaciStateFromContract(
  maciContract: Contract,
  coordinatorKeypair: Keypair,
  zerothLeaf: StateLeaf,
  signUpLogs: any[],
  publishMessageLogs: any[]
) {
  const treeDepths = await maciContract.treeDepths()
  const stateTreeDepth = BigInt(treeDepths[0].toString())
  const messageTreeDepth = BigInt(treeDepths[1].toString())
  const voteOptionTreeDepth = BigInt(treeDepths[2].toString())
  const maxVoteOptionIndex = BigInt((await maciContract.voteOptionsMaxLeafIndex()).toString())

  const maciState = new MaciState(
    coordinatorKeypair,
    stateTreeDepth,
    messageTreeDepth,
    voteOptionTreeDepth,
    maxVoteOptionIndex
  )

  const iface = new Interface(MACI_ABI)
  for (const log of signUpLogs) {
    const event = iface.parseLog(log)
    const voiceCreditBalance = BigInt(event.args._voiceCreditBalance.toString())
    const pubKey = new PubKey([BigInt(event.args._userPubKey[0]), BigInt(event.args._userPubKey[1])])

    maciState.signUp(pubKey, voiceCreditBalance)
  }

  let msgData: BigInt[] = []
  for (const log of publishMessageLogs) {
    const event = iface.parseLog(log)
    const msgIv = BigInt(event.args._message[0].toString())
    for (let i = 0; i < event.args._message[1].length; i++) {
      msgData.push(BigInt(event.args._message[1][i].toString()))
    }
    // msgData = event.args._message[1].map((x: any) => BigInt(x.toString())) // to avoid eslint error
    const message = new Message(msgIv, msgData)
    const encPubKey = new PubKey([BigInt(event.args._encPubKey[0]), BigInt(event.args._encPubKey[1])])

    maciState.publishMessage(message, encPubKey)
  }

  // Check whether the above steps were done correctly
  const onChainStateRoot = await maciContract.getStateTreeRoot()

  if (maciState.genStateRoot().toString(16) !== BigInt(onChainStateRoot).toString(16)) {
    throw new Error('Error: could not correctly recreate the state tree from on-chain data. The state root differs.')
  }

  const onChainMessageRoot = await maciContract.getMessageTreeRoot()
  if (maciState.genMessageRoot().toString(16) !== BigInt(onChainMessageRoot).toString(16)) {
    throw new Error(
      'Error: could not correctly recreate the message tree from on-chain data. The message root differs.'
    )
  }

  // Process the messages so that the users array is up to date with the
  // contract's state tree
  const currentMessageBatchIndex = Number((await maciContract.currentMessageBatchIndex()).toString())
  const messageBatchSize = Number((await maciContract.messageBatchSize()).toString())
  const numMessages = maciState.messages.length
  const maxMessageBatchIndex =
    numMessages % messageBatchSize === 0
      ? numMessages
      : (1 + Math.floor(numMessages / messageBatchSize)) * messageBatchSize

  const hasUnprocessedMessages = await maciContract.hasUnprocessedMessages()

  // Process messages up to the latest batch (in reverse order)
  if (hasUnprocessedMessages) {
    for (let i = currentMessageBatchIndex; i > currentMessageBatchIndex; i -= messageBatchSize) {
      maciState.batchProcessMessage(i, messageBatchSize, zerothLeaf)
    }
  } else {
    // Process all messages (in reverse order)
    for (let i = maxMessageBatchIndex; i > 0; i -= messageBatchSize) {
      maciState.batchProcessMessage(i - messageBatchSize, messageBatchSize, zerothLeaf)
    }
  }

  return maciState
}
