import { Trans } from '@lingui/macro'
import { Box, Text } from 'rebass'
import QrModal, { QrModalContent } from '../QrModal'

interface SignUpModalProps {
  toggleModal: () => void
  zkCreamAddress: string
  maciAddress: string
}

export default function SignUp({ toggleModal, zkCreamAddress, maciAddress }: SignUpModalProps) {
  return (
    <Box>
      <Box mb={20}>
        <Text fontWeight="bold">
          <Trans>Deposit Note</Trans>
        </Text>
      </Box>
      <QrModal
        toggleModal={toggleModal}
        content={QrModalContent.SignUp}
        zkCreamAddress={zkCreamAddress}
        maciAddress={maciAddress}
      />
    </Box>
  )
}
