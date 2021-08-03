import { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
import Jazzicon from '@metamask/jazzicon'

import { useActiveWeb3React } from '../../hooks/web3'

const StyledIdenticonContainer = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  padding-left: 0.25rem;
`

export default function Identicon() {
  const ref = useRef<HTMLDivElement>()
  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
    }
  }, [account])

  return <StyledIdenticonContainer ref={ref as any} />
}
