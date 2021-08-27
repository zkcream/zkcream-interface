import React from 'react'
import { CheckCircle, Copy } from 'react-feather'
import styled from 'styled-components'
import useCopyClipboard from '../../hooks/useCopyClipboard'

import { LinkStyledButton } from '../../theme'

const CopyIcon = styled(LinkStyledButton)`
  color: ${({ theme }) => theme.black};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.primary};
  }
`

const StatusText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.825rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
`

export default function CopyHelper(props: { toCopy: string; children?: React.ReactNode }) {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <CopyIcon onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <StatusText>
          <CheckCircle size={'16'} />
          <StatusText>Copied</StatusText>
        </StatusText>
      ) : (
        <StatusText>
          <Copy size={'16'} />
        </StatusText>
      )}
      {isCopied ? '' : props.children}
    </CopyIcon>
  )
}
