import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { useEffect } from 'react'
import { Box, Text } from 'rebass'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import QrModal, { QrModalContent } from '../QrModal'

interface ReadRandomStateLeafProps {
  toggleModal: () => void
}

export default function ReadRandomStateLeaf({ toggleModal }: ReadRandomStateLeafProps) {
  const [hasMaciSk, setHasMaciSk] = useState<boolean>(false)
  const [maciSk, setMaciSk] = useLocalStorage('macisk', '')

  useEffect(() => {
    function checkMaciSk(): boolean {
      return maciSk !== '' ? true : false
    }

    const r = checkMaciSk()
    setHasMaciSk(r)
  }, [maciSk])

  return (
    <Box>
      <Box mb={20}>
        <Text fontWeight="bold">
          {hasMaciSk ? (
            <Trans>Please import the random state leaf</Trans>
          ) : (
            <Trans>Please imoprt the coordinator's private key before publishing the tally results</Trans>
          )}
        </Text>
      </Box>
      {hasMaciSk ? (
        <QrModal toggleModal={toggleModal} content={QrModalContent.ReadRandomStateLeaf} />
      ) : (
        <QrModal toggleModal={toggleModal} content={QrModalContent.SetCoodrinatorKey} setMaciSk={setMaciSk} />
      )}
    </Box>
  )
}
