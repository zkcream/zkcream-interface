import { Trans } from '@lingui/macro'
import { Label } from '@rebass/forms'
import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass'
import { FormInput } from '../../theme'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'

interface VoterStateProps {
  toggleModal: () => void
  patterns: string[]
  nav: string
  setStateIndex: React.Dispatch<any>
  setNonce: React.Dispatch<any>
  setMaciSk: React.Dispatch<any>
}

export default function VoterState({
  toggleModal,
  patterns,
  nav,
  setStateIndex,
  setNonce,
  setMaciSk,
}: VoterStateProps) {
  const [dataReceived, setDataReceived] = useState<boolean>(false)

  const { value: _stateIndex, bind: bindStateIndex, reset: resetStateIndex } = useInput('')
  const { value: _nonce, bind: bindNonce, reset: resetNonce } = useInput('')
  const { value: _macisk, bind: bindMaciSk, reset: resetMaciSk } = useInput('')

  function setState() {
    if (!isNaN(parseInt(_stateIndex)) && !isNaN(parseInt(_nonce)) && typeof _macisk === 'string') {
      setStateIndex(_stateIndex.toString())
      setNonce(_nonce.toString())
      setMaciSk(_macisk)

      resetStateIndex()
      resetNonce()
      resetMaciSk()

      // TODO validate and reload
    } else {
      console.error('Type doesnot match')
    }
  }

  function validateStatesFormat(data: string[]): boolean {
    if (
      data.length !== 3 ||
      !data[0].startsWith('signUpIndex:') ||
      !data[1].startsWith('macisk.') ||
      !data[2].startsWith('nonce:')
    )
      return false
    return true
  }

  function handleScan(data: string | null) {
    if (data) {
      setDataReceived(true)
      const states = data.split(',')
      if (validateStatesFormat(states)) {
        setStateIndex(states[0].replace('signUpIndex:', ''))
        setMaciSk(states[1])
        setNonce(states[2].replace('nonce:', ''))
        setDataReceived(false)
        toggleModal()
      } else {
        console.error('state data errror')
        return
      }
      console.log('vote state loaded')
    }
  }

  return (
    <Box my={20}>
      {nav === patterns[0] ? (
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
              <QrReader delay={300} onError={(e) => console.error(e)} onScan={handleScan} />
            )}
          </Box>
        </>
      ) : (
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
                <FormInput {...bindStateIndex} />
              </Box>
              <Box>
                <Label fontWeight="bold">
                  <Trans>Nonce</Trans>
                </Label>
                <FormInput {...bindNonce} />
              </Box>
              <Box>
                <Label fontWeight="bold">
                  <Trans>MaciSk</Trans>
                </Label>
                <FormInput {...bindMaciSk} />
              </Box>
            </Box>
          )}
          <Box my={20}>
            <ButtonPrimary onClick={setState}>
              <Trans>Set Voting state</Trans>
            </ButtonPrimary>
          </Box>
        </>
      )}
    </Box>
  )
}
