import { Box, Text } from 'rebass'
import { Label } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../Button'
import { useAddressInput } from '../../utils/inputs'
import { FormInput } from '../../theme'

export default function ForOrAgainst({ setRecipients }: { setRecipients: any }) {
  // since we cannot use `for` variable, use `forValue` instead
  const { value: forValue, bind: bindFor, isEthAddress: isForCorrectFormat } = useAddressInput('')
  const { value: againstValue, bind: bindAgainst, isEthAddress: isAgainstCorrectFormat } = useAddressInput('')

  function onConfirm(e: any) {
    e.preventDefault()
    setRecipients([forValue, againstValue])
  }

  const disabled = !isForCorrectFormat || !isAgainstCorrectFormat

  return (
    <>
      <Box>
        <Text fontWeight="bold">
          <Trans>Set candidates address</Trans>
        </Text>
      </Box>
      <Box pb={3}>
        <Label fontWeight="bold">
          <Trans>For</Trans>
        </Label>
        <FormInput type="text" {...bindFor} />
      </Box>
      <Box pb={3}>
        <Label fontWeight="bold">
          <Trans>Against</Trans>
        </Label>
        <FormInput type="text" {...bindAgainst} />
      </Box>
      <Box pb={3}>
        <ButtonPrimary onClick={onConfirm} disabled={disabled}>
          Confirm
        </ButtonPrimary>
      </Box>
    </>
  )
}
