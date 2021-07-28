import React, { memo, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass/styled-components'
import { Label, Input } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { RowFixed } from '../Row'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { StyledInternalLink } from '../../theme'
import { useInput } from '../../utils/inputs'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const ArrowWrapper = styled(StyledInternalLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  color: ${({ theme }) => theme.greyText};
`

interface VoterStateModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export const VoterStateModal = memo(({ isOpen, onDismiss }: VoterStateModalProps) => {
  const patterns = ['Text', 'QR Code']
  const [nav, setNav] = useState<string>(patterns[0])
  const [dataReceived, setDataReceived] = useState<boolean>(false)

  const [, setStateIndex] = useLocalStorage('stateIndex', '')
  const [, setNonce] = useLocalStorage('nonce', '')
  const [, setMaciSk] = useLocalStorage('macisk', '')

  const { value: _stateIndex, bind: bindStateIndex, reset: resetStateIndex } = useInput('')
  const { value: _nonce, bind: bindNonce, reset: resetNonce } = useInput('')
  const { value: _macisk, bind: bindMaciSk, reset: resetMaciSk } = useInput('')

  function toggleNav() {
    const op: number = nav === patterns[0] ? 1 : 0
    setNav(patterns[op])
  }

  function handleError(e: any) {
    console.error(e)
  }

  function setState() {
    if (!isNaN(parseInt(_stateIndex)) && !isNaN(parseInt(_nonce)) && typeof _macisk === 'string') {
      setStateIndex(_stateIndex.toString())
      setNonce(_nonce.toString())
      setMaciSk(_macisk)
      // reset
      resetStateIndex()
      resetNonce()
      resetMaciSk()

      // TODO watch localStorage event and re-render

    } else {
      console.error('Type doesnot match')
    }
  }

  /* TODO */
  function handleScan(data: string | null) {
    if (data) {
      setDataReceived(true)
    }
    console.log(data)
  }

  function getModalContent() {
    return (
      <>
        <ArrowWrapper to={'/'}>
          <ArrowLeft size={20} />
          <Trans>Back to All Elections</Trans>
        </ArrowWrapper>
        <Box my={20}>
          <Text fontWeight="bold">
            <Trans>Voter State</Trans>
          </Text>
          <Text>
            <Trans>You need to provide voter's state</Trans>
          </Text>
        </Box>
        <RowFixed style={{ width: '100%' }}>
          {patterns.map((pattern, i) => (
            <ButtonPrimary disabled={nav === pattern} onClick={toggleNav} key={i}>
              {pattern}
            </ButtonPrimary>
          ))}
        </RowFixed>
        <Box my={20}>
          {nav === patterns[0] ? (
            <>
              {dataReceived ? (
                <Text>
                  <Trans>Submitting....</Trans>
                </Text>
              ) : (
                <Box>
                  <Box>
                    <Label fontWeight="bold">
                      <Trans>Sign up index</Trans>
                    </Label>
                    <Input {...bindStateIndex} />
                  </Box>
                  <Box>
                    <Label fontWeight="bold">
                      <Trans>Nonce</Trans>
                    </Label>
                    <Input {...bindNonce} />
                  </Box>
                  <Box>
                    <Label fontWeight="bold">
                      <Trans>MaciSk</Trans>
                    </Label>
                    <Input {...bindMaciSk} />
                  </Box>
                </Box>
              )}
              <Box my={20}>
                <ButtonPrimary onClick={setState}>
                  <Trans>Set state</Trans>
                </ButtonPrimary>
              </Box>
            </>
          ) : (
            <>
              <Box my={20}>
                <Text textAlign={'center'} my={20}>
                  <Trans>Please scan your barcode</Trans>
                </Text>
                {dataReceived ? (
                  <Text>
                    <Trans>Reading....</Trans>
                  </Text>
                ) : (
                  <QrReader delay={300} onError={handleError} onScan={handleScan} />
                )}
              </Box>
            </>
          )}
        </Box>
      </>
    )
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper>{getModalContent()}</ContentWrapper>
    </Modal>
  )
})
