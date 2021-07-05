import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { Box, Text } from 'rebass/styled-components'

import { ButtonPrimary } from '../Button'
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
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

interface NoteModalProps {
  note: string | undefined
  isOpen: boolean
  onDismiss: () => void
}

export const NoteModal = memo(({ note, isOpen, onDismiss }: NoteModalProps) => {
  const patterns = ['Text', 'QR Code']
  const [nav, setNav] = useState<string>(patterns[0])

  function toggleNav() {
    const op: number = nav === patterns[0] ? 1 : 0
    setNav(patterns[op])
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
            <Text fontWeight="bold">Depoist Note</Text>
          </Box>
          <RowFixed style={{ width: '100%' }}>
            {patterns.map((pattern, i) => (
              <ButtonPrimary disabled={nav === pattern} onClick={toggleNav} key={i}>
                {pattern}
              </ButtonPrimary>
            ))}
          </RowFixed>
          <Box>{nav === patterns[0] ? <Text fontWeight="bold">{note}</Text> : <Text>show qr code</Text>}</Box>
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