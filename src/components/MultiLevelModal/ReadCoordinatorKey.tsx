import { Trans } from '@lingui/macro'
import { Box, Text } from 'rebass'
import QrModal, { QrModalContent } from '../QrModal'

interface ReadCoordinatorKeyProps {
  toggleModal: () => void
}

export default function ReadCoordinatorKey({ toggleModal }: ReadCoordinatorKeyProps) {
  return (
    <Box>
      <Box mb={20}>
        <Text fontWeight="bold">
          <Trans>Your coordinator's Private key</Trans>
        </Text>
        <Text>
          <Trans>Please import the key information for the coordinator key</Trans>
        </Text>
      </Box>
      <QrModal toggleModal={toggleModal} content={QrModalContent.ReadCoordinatorKey} />
    </Box>
  )
}
