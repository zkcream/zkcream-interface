import { Trans } from '@lingui/macro'
import { Box, Text } from 'rebass'
import QrModal, { QrModalContent } from '../../QrModal'
import { NoteData } from '../../QrModal'

interface NoteProps {
  toggleModal: () => void
  data: NoteData
}

export default function Note({ toggleModal, data }: NoteProps) {
  return (
    <Box>
      <Box mb={20}>
        <Text fontWeight="bold">
          <Trans>Deposit Note</Trans>
        </Text>
      </Box>
      <QrModal toggleModal={toggleModal} content={QrModalContent.Note} data={data} />
    </Box>
  )
}
