import { Box, Text } from 'rebass'
import { Input, Label } from '@rebass/forms'

import { ButtonPrimary } from '../Button'
import { useAddressInput } from '../../utils/inputs'

export default function ForOrAgainst({ setRecipients }: { setRecipients: any }) {
  // since we cannot use `for` variable, use `forValue` instead
  const { value: forValue, bind: bindFor, reset: resetFor, isEthAddress: isForCorrectFormat } = useAddressInput('')
  const {
    value: againstValue,
    bind: bindAgainst,
    reset: resetAgainst,
    isEthAddress: isAgainstCorrectFormat,
  } = useAddressInput('')

  function onConfirm(e: any) {
    e.preventDefault()
    setRecipients([forValue, againstValue])
    resetFor()
    resetAgainst()
  }

  const disabled = !isForCorrectFormat || !isAgainstCorrectFormat

  return (
    <div>
      <Box my={10}>
        <Text fontWeight="bold">Set candidates address:</Text>
      </Box>
      <Box>
        <Label fontWeight="bold">For</Label>
        <Input type="text" {...bindFor} />
      </Box>
      <Box>
        <Label fontWeight="bold">Against</Label>
        <Input type="text" {...bindAgainst} />
      </Box>
      <ButtonPrimary onClick={onConfirm} disabled={disabled}>
        Confirm
      </ButtonPrimary>
    </div>
  )
}
