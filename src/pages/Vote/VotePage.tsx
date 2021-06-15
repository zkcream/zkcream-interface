import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { ElectionData, useElectionData } from '../../state/election/hooks'

export default function VotePage({
  match: {
    params: { address },
  },
}: RouteComponentProps<{ address: string }>) {
  const electionData: ElectionData | undefined = useElectionData(address)
  console.log(electionData)
  return (
    <>
      {electionData && (
        <>
          <p>{electionData.title}</p>
          <p>for: {electionData.for}</p>
          <p>against: {electionData.against}</p>
          <p>owner: {electionData.owner}</p>
          <p>coordinator: {electionData.coordinator}</p>
        </>
      )}
    </>
  )
}
