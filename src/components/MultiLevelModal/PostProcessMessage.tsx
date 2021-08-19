import { Trans } from '@lingui/macro'
import { Box, Text } from 'rebass'
import QrModal, { QrModalContent } from '../QrModal'

interface PostProcessMessageProps {
  toggleModal: () => void
  data: any
}

export default function PostProcessMessage({ toggleModal, data }: PostProcessMessageProps) {
  return (
    <Box>
      <Box mb={20}>
        <Text fontWeight="bold">
          <Trans>Current random state leaf</Trans>
        </Text>
      </Box>
      <QrModal toggleModal={toggleModal} content={QrModalContent.PostProcessMessage} data={data} />
    </Box>
  )
}
