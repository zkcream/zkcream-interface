import React from 'react'
import styled from 'styled-components/macro'
import { Link } from 'rebass'

const InfoCard = styled.button<{ active?: boolean }>`
  background-color: ${({ theme, active }) => (active ? theme.black : theme.white)};
  padding: 1rem;
  outline: none;
  border: 1px solid;
  border-radius: 12px;
  width: 100% !important;
  border-color: ${({ theme, active }) => (active ? 'transparent' : theme.black)};
`

const OptionCard = styled(InfoCard as any)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
`

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
  margin-top: 0;
  &:hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
    border: ${({ clickable, theme }) => (clickable ? `1px solid ${theme.primary}` : ``)};
  }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`

const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  justify-content: center;
  height: 100%;
`

const HeaderText = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary : ({ theme }) => theme.black)};
  font-size: 1rem;
  font-weight: 500;
`

const IconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '24px')};
    width: ${({ size }) => (size ? size + 'px' : '24px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

export default function Option({
  onClick = null,
  clickable = true,
  header,
  link = null,
  icon,
}: {
  onClick?: null | (() => void)
  clickable?: boolean
  header: React.ReactNode
  link?: string | null
  icon: string
}) {
  const content = (
    <OptionCardClickable onClick={onClick} clickable={clickable}>
      <OptionCardLeft>
        <HeaderText>{header}</HeaderText>
      </OptionCardLeft>
      <IconWrapper>
        <img src={icon} alt={'Icon'} />
      </IconWrapper>
    </OptionCardClickable>
  )
  if (link) {
    return <Link href={link}>{content}</Link>
  }

  return content
}
