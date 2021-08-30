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
          <Trans>Your coordinator key</Trans>
        </Text>
        <Text>
          <Trans>Please provide your coordinator key informations</Trans>
        </Text>
      </Box>
      <QrModal toggleModal={toggleModal} content={QrModalContent.ReadCoordinatorKey} />
    </Box>
  )
}
