import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { lighten } from 'polished'
import styled from 'styled-components'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../Button'
import Identicon from '../Identicon'
import { injected } from '../../connectors'
import { useWalletModalToggle } from '../../state/application/hooks'
import { shortenAddress } from '../../utils'
import WalletModal from '../WalletModal'

const AddressWrapper = styled.span`
  color: ${({ theme }) => theme.white};
`

const ErrorWrapper = styled(Text)`
  background-color: ${({ theme }) => lighten(0.5, theme.darkBackgraound)};
  border-radius: 0.25rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  text-align: center;
`

export default function Web3Status() {
  const { account, connector, error } = useWeb3React()
  const toggleModal = useWalletModalToggle()

  if (account) {
    return (
      <>
        {connector === injected ? <Identicon /> : null}
        <AddressWrapper>{shortenAddress(account)}</AddressWrapper>
      </>
    )
  } else if (error) {
    return (
      <ErrorWrapper>
        {error instanceof UnsupportedChainIdError ? <Trans>Wrong network</Trans> : <Trans>Error</Trans>}
      </ErrorWrapper>
    )
  } else {
    return (
      <>
        <ButtonPrimary width="180px" padding="8px" onClick={toggleModal}>
          <Trans>Connect to a Wallet</Trans>
        </ButtonPrimary>
        <WalletModal />
      </>
    )
  }
}
