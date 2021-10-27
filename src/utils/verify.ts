// this function is ported from https://github.com/appliedzkp/maci/blob/master/cli/ts/verify.ts
// and modifiled for zkCREAM
import * as ethers from 'ethers'
import { isAddress } from '@ethersproject/address'
import {
  genPerVOSpentVoiceCreditsCommitment,
  genTallyResultCommitment,
  genSpentVoiceCreditsCommitment,
} from 'maci-core'
import { Contract } from '@ethersproject/contracts'

function calcQuinTreeDepthFromMaxLeaves(maxLeaves: number) {
  let r = 0
  while (5 ** r < maxLeaves) {
    r++
  }
  return r
}

async function contractExists(provider: ethers.providers.Provider, address: string) {
  const code = await provider.getCode(address)
  return code.length > 2
}

export default async function verify(data: any, maciContract: Contract) {
  // Check the result salt
  const validResultsSalt = data.results.salt && data.results.salt.match(/0x[a-fA-F0-9]+/)

  if (!validResultsSalt) {
    throw new Error('Error: invalid results salt')
  }

  // Check the reulsts commitment
  const validResultsCommitment = data.results.commitment && data.results.commitment.match(/0x[a-fA-F0-9]+/)

  if (!validResultsCommitment) {
    throw new Error('Error: invalid results commitment format')
  }

  // Ensure that the length of data.results.tally is a square root of 2
  const depth = calcQuinTreeDepthFromMaxLeaves(data.results.tally.length)
  if (Math.floor(depth).toString() !== depth.toString()) {
    throw new Error('Error: invalid reuslts tally field length')
  }

  // Verify that the reuslts commitment matches the output of
  // genTallyResultCommitment()
  const tally = data.results.tally.map(BigInt)
  const salt = BigInt(data.results.salt)
  const resultsCommitment = BigInt(data.results.commitment)

  const expectedResultsCommitment = genTallyResultCommitment(tally, salt, depth)
  if (expectedResultsCommitment.toString() === resultsCommitment.toString()) {
    console.log('The results commitment in the specified file is correct given the tally and salt')
  } else {
    throw new Error('Error: the results commitment in the specified file is correct')
  }

  // Check the total spent voice credits salt
  const validTvcSalt = data.totalVoiceCredits.salt && data.totalVoiceCredits.salt.match(/0x[a-fA-F0-9]+/)
  if (!validTvcSalt) {
    throw new Error('Error: invalid total spent voice credits results salt')
  }

  // Check the total spent voice credits commitment
  const validTvcCommitment =
    data.totalVoiceCredits.commitment && data.totalVoiceCredits.commitment.match(/0x[a-fA-F0-9]+/)
  if (!validTvcCommitment) {
    throw new Error('Error: invalid total spent voice credits commitment format')
  }

  // Verify that the total spent voice credits commitment matches the output of
  // genSpentVoiceCreditsCommitment()
  const tvcSpent = BigInt(data.totalVoiceCredits.spent)
  const tvcSalt = BigInt(data.totalVoiceCredits.salt)
  const tvcCommitment = BigInt(data.totalVoiceCredits.commitment)
  const expectedTvcCommitment = genSpentVoiceCreditsCommitment(tvcSpent, tvcSalt)
  if (expectedTvcCommitment.toString() === tvcCommitment.toString()) {
    console.log('The total spent voice credit commitment in the specified file is correct given the tally and salt')
  } else {
    throw new Error('Error: the total spent voice credit commitment in the specified file is incorrect')
  }

  const pvcTally = data.totalVoiceCreditsPerVoteOption.tally.map((x: any) => BigInt(x))
  const pvcSalt = BigInt(data.totalVoiceCreditsPerVoteOption.salt)
  const pvcCommitment = BigInt(data.totalVoiceCreditsPerVoteOption.commitment)
  const expectedPvcCommitment = genPerVOSpentVoiceCreditsCommitment(pvcTally, pvcSalt, depth)

  if (expectedPvcCommitment.toString() === pvcCommitment.toString()) {
    console.log(
      'The per vote option spent voice credit commitment in the specified file is correct given the tally and salt'
    )
  } else {
    throw new Error('Error: the per vote option spent voice credit commitment in the specified file is incorrect')
  }

  const maciAddress = data.maci

  // MACI contract
  if (!isAddress(maciAddress)) {
    throw new Error('Error: invalid MACI contract address')
  }

  // Ethereum provider
  const ethProvider = data.provider
  const provider = new ethers.providers.JsonRpcProvider(ethProvider)
  try {
    await provider.getBlockNumber()
  } catch {
    throw new Error(`Error: unable to connect to the Ethereum provider at ${ethProvider}`)
  }

  if (!(await contractExists(provider, maciAddress))) {
    throw new Error('Error: there is no contract deployed at the specified address')
  }

  const onChainResultsCommitment = BigInt((await maciContract.currentResultsCommitment()).toString())
  if (onChainResultsCommitment.toString() === expectedResultsCommitment.toString()) {
    console.log('The results commitment in the MACI contract on-chain is valid')
  } else {
    throw new Error('Error: the results commitment in the MACI contract does not match the expected commitment')
  }

  const onChainTvcCommitment = BigInt((await maciContract.currentSpentVoiceCreditsCommitment()).toString())
  if (onChainTvcCommitment.toString() === expectedTvcCommitment.toString()) {
    console.log('The total spent voice credit commitment in the MACI contract on-chain is valid')
  } else {
    throw new Error(
      'Error: the total spent voice credit commitment in the MACI contract does not match the expected commitment'
    )
  }

  const onChainPvcCommitment = BigInt((await maciContract.currentPerVOSpentVoiceCreditsCommitment()).toString())
  if (onChainPvcCommitment.toString() === expectedPvcCommitment.toString()) {
    console.log('The per vote option spent voice credit commitment in the MACI contract on-chain is valid')
  } else {
    throw new Error(
      'Error: the per vote option spent voice credit commitment in the MACI contract does not match the expected commitment'
    )
  }

  // Check the total votes
  let expectedTotalVotes = BigInt(0)
  for (const t of tally) {
    expectedTotalVotes += t
  }

  const onChainTotalVotes = await maciContract.totalVotes()
  if (onChainTotalVotes.toString() === expectedTotalVotes.toString()) {
    console.log('The total sum of votes in the MACI contract on-chain is valid.')
  } else {
    throw new Error(
      'Error: the total votes value in the MACI contract does not match the expected sum of the vote tally'
    )
  }
}
