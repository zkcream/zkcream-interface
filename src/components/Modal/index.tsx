import React from 'react'
import styled, { css } from 'styled-components'
import { DialogOverlay, DialogContent } from '@reach/dialog'

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  children?: React.ReactNode
}

const StyledDialogOverlay = styled(DialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    background-color: transparent;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.modalBackground};
  }
`

const StyledDialogContent = styled(({ minHeight, maxHeight, mobile, isOpen, ...rest }) => (
  <DialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog',
})`
  overflow-y: auto;

  &[data-reach-dialog-content] {
    margin: 0 0 2rem 0;
    padding: 0px;
    width: 50vw;
    overflow-y: auto;
    overflow-x: hidden;
    max-width: 420px;
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight}vh;
      `}
    display: flex;
    border-radius: 20px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
      margin: 0;
    `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width:  85vw;
      ${
        mobile &&
        css`
          width: 100vw;
          border-radius: 20px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `
      }
    `}
  }
`

export default function Modal({ isOpen, onDismiss, minHeight = false, maxHeight = 90, children }: ModalProps) {
  return (
    <>
      <StyledDialogOverlay isOpen={isOpen} onDismiss={onDismiss}>
        <StyledDialogContent aria-label="dialog content" minHeight="{minHeight}" maxHeight="{maxHeight}">
          {children}
        </StyledDialogContent>
      </StyledDialogOverlay>
    </>
  )
}
