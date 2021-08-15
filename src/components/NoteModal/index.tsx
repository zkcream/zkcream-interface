import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { QRCode } from 'react-qr-svg'
import { Box, Text } from 'rebass/styled-components'
import { Label, Checkbox } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { ButtonPrimary, ButtonNav } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { RowFixed } from '../Row'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const NoteText = styled(Text)`
  font-weight: bold;
  word-break: break-all;
`

const QRContaier = styled.div`
  padding-top: 1rem;
`

interface NoteModalProps {
  note: string | undefined
  isOpen: boolean
  onDismiss: () => void
}

export const NoteModal = memo(({ note, isOpen, onDismiss }: NoteModalProps) => {
  const patterns = ['Text', 'QR Code']
  const [nav, setNav] = useState<string>(patterns[0])
  const [checked, setChecked] = useState<boolean>(false)

  function toggleNav() {
    const op: number = nav === patterns[0] ? 1 : 0
    setNav(patterns[op])
  }

  function generateQR(note: string) {
    const qr: string = 'note:' + note
    return (
      <>
        <QRContaier>
          <QRCode bgColor="#FFFFFF" fgColor="#000000" level="Q" style={{ width: 256, marginBottom: 20 }} value={qr} />
        </QRContaier>
      </>
    )
  }

  function getModalContent() {
    if (!note) {
      return (
        <Box>
          <HeaderRow>
            <Text fontWeight="bold">Error</Text>
          </HeaderRow>
        </Box>
      )
    } else {
      return (
        <Box>
          <Box mb={20}>
            <Text fontWeight="bold">
              <Trans>Depoist Note</Trans>
            </Text>
          </Box>
          <RowFixed style={{ width: '100%' }}>
            {patterns.map((pattern, i) => (
              <ButtonNav disabled={nav === pattern} onClick={toggleNav} key={i}>
                {pattern}
              </ButtonNav>
            ))}
          </RowFixed>
          <Box m={10}>
            {nav === patterns[0] ? (
              <>
                <Box mb={10}>
                  <Text>
                    <Trans>Your Note:</Trans>
                  </Text>
                </Box>
                <NoteText>{note}</NoteText>
              </>
            ) : (
              <Text>{generateQR(note)}</Text>
            )}
            <Box pb={3}>
              <Label>
                <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
                <Trans>I've stored my deposit note</Trans>
              </Label>
            </Box>
            <Box>
              <ButtonPrimary disabled={!checked} onClick={onDismiss}>
                <Text>Close</Text>
              </ButtonPrimary>
            </Box>
          </Box>
        </Box>
      )
    }
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper>{getModalContent()}</ContentWrapper>
    </Modal>
  )
})
