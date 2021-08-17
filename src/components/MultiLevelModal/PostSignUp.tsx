import { Trans } from '@lingui/macro'
import { Box, Text } from 'rebass'
import QrModal, { ContentData, QrModalContent } from '../QrModal'

interface PostSignUpProps {
  toggleModal: () => void
  data: ContentData
}

export default function PostSignUp({ toggleModal, data }: PostSignUpProps) {
  return (
    <Box>
      <Box mb={20}>
        <Text fontWeight="bold">
          <Trans>Your Vote status</Trans>
        </Text>
      </Box>
      <QrModal toggleModal={toggleModal} content={QrModalContent.PostSignUp} data={data} />
    </Box>
  )
}
