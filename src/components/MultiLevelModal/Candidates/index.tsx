import ForOrAgainst from './ForOrAgainst'

function PickOne() {
  return <>Unimplemented</>
}

function PickMany() {
  return <>Unimplemented</>
}

export default function Candidates({
  electionType,
  values,
  setValues,
}: {
  electionType: string
  values: any
  setValues: any
}) {
  return (
    <>
      {
        {
          0: <PickOne />,
          1: <PickMany />,
          2: <ForOrAgainst values={values} setValues={setValues} />,
        }[electionType]
      }
    </>
  )
}
