import { Box, Text } from 'rebass'
import { Input, Label } from '@rebass/forms'
import { Trans } from '@lingui/macro'

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
      <Box>
        <Text fontWeight="bold">
          <Trans>Set candidates address</Trans>
        </Text>
      </Box>
      <Box pb={3}>
        <Label fontWeight="bold">
          <Trans>For</Trans>
        </Label>
        <Input type="text" {...bindFor} />
      </Box>
      <Box pb={3}>
        <Label fontWeight="bold">
          <Trans>Against</Trans>
        </Label>
        <Input type="text" {...bindAgainst} />
      </Box>
      <ButtonPrimary onClick={onConfirm} disabled={disabled}>
        Confirm
      </ButtonPrimary>
    </div>
  )
}
