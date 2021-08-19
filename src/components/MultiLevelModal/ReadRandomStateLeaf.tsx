import { Trans } from '@lingui/macro'
import { Box, Text } from 'rebass'
import QrModal, { QrModalContent } from '../QrModal'

interface ReadRandomStateLeafProps {
  toggleModal: () => void
}

export default function ReadRandomStateLeaf({ toggleModal }: ReadRandomStateLeafProps) {
  return (
    <Box>
      <Box mb={20}>
        <Text fontWeight="bold">
          <Trans>Read Random state leaf</Trans>
        </Text>
      </Box>
      <QrModal toggleModal={toggleModal} content={QrModalContent.ReadRandomStateLeaf} />
    </Box>
  )
}
