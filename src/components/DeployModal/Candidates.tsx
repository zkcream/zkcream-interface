import ForOrAgainst from './ForOrAgainst'

function PickOne() {
  return <>Unimplemented</>
}

function PickMany() {
  return <>Unimplemented</>
}

export default function Candidates({ electionType, setRecipients }: { electionType: string; setRecipients: any }) {
  return (
    <>
      {
        {
          0: <PickOne />,
          1: <PickMany />,
          2: <ForOrAgainst setRecipients={setRecipients} />,
        }[electionType]
      }
    </>
  )
}
