import React from 'react'

function PickOne() {
  return <>Unimplemented</>
}

function PickMany() {
  return <>Unimplemented</>
}

function ForOrAgainst({ recipients }: { recipients: string[] }) {
  return (
    <>
      {recipients.map((recipient, i) => (
        <p key={i}>
          {i === 0 ? 'For: ' : 'Against: '}
          {recipient}
        </p>
      ))}
    </>
  )
}

export default function Recipients({ recipients, electionType }: { recipients: string[]; electionType: string }) {
  return (
    <>
      {
        {
          0: <PickOne />,
          1: <PickMany />,
          2: <ForOrAgainst recipients={recipients} />,
        }[electionType]
      }
    </>
  )
}
