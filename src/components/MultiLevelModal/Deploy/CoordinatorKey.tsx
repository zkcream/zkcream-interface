import { Trans } from '@lingui/macro'
import { Box, Text } from 'rebass'
import QrModal, { MaciSk, QrModalContent } from '../../QrModal'

interface CoordinatorKeyProps {
  toggleModal: () => void
  maciSk: MaciSk
}

export default function CoordinatorKey({ toggleModal, maciSk }: CoordinatorKeyProps) {
  return (
    <Box>
      <Box mb={20}>
        <Text fontWeight="bold">
          <Trans>Your coordinator Private key</Trans>
        </Text>
      </Box>
      <QrModal toggleModal={toggleModal} content={QrModalContent.CoordinatorKey} data={maciSk} />
    </Box>
  )
}
