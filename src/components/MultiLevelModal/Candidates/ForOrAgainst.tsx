import { Box, Text } from 'rebass'
import { Label } from '@rebass/forms'
import { t, Trans } from '@lingui/macro'

import { FormInput } from '../../../theme'

const FieldEditor = ({ value, onChange, id }: { value: string; onChange: any; id: string }) => {
  const handleChange = (e: any) => {
    const address = e.target.value
    onChange(id, address)
  }

  return <FormInput onChange={handleChange} value={value} />
}

function FormEditor({ values, setValues }: { values: any; setValues: any }) {
  const types = [t`for`, t`against`]
  const types_en = ['for', 'against'] // for id
  const handleFieldChange = (fieldId: any, value: {}) => {
    setValues({ ...values, [fieldId]: value })
  }

  const fields = types.map((type: string, index: number) => (
    <Box pb={3} key={type}>
      <Label>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
      <FieldEditor id={types_en[index]} onChange={handleFieldChange} value={values[type]} />
    </Box>
  ))

  return <>{fields}</>
}

export default function ForOrAgainst({ values, setValues }: { values: any; setValues: any }) {
  return (
    <>
      <Box>
        <Text fontWeight="bold">
          <Trans>Set candidate's address</Trans>
        </Text>
      </Box>
      <FormEditor values={values} setValues={setValues} />
    </>
  )
}
