import { Trans } from '@lingui/macro'
import { Box, Text } from 'rebass'
import QrModal, { ContentData, QrModalContent } from '../QrModal'

interface NoteProps {
  toggleModal: () => void
  data: ContentData
}

export default function Note({ toggleModal, data }: NoteProps) {
  return (
    <Box>
      <Box mb={20}>
        <Text fontWeight="bold">
          <Trans>Your Deposit Note</Trans>
        </Text>
      </Box>
      <QrModal toggleModal={toggleModal} content={QrModalContent.Note} data={data} />
    </Box>
  )
}
