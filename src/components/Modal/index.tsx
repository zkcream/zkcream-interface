import React from 'react'

interface ModalProps {
  isOpen: boolean
  children?: React.ReactNode
}

export default function Modal({ isOpen, children }: ModalProps) {
  return <>{isOpen ? <>{children}</> : null}</>
}
