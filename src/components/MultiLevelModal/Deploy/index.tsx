import { useState } from 'react'
import CoordinatorKey from './CoordinatorKey'
import InputForm from './InputForm'
import { MaciSk } from '../../QrModal/index'

interface DeployProps {
  toggleModal: () => void
}

export default function Deploy({ toggleModal }: DeployProps) {
  const [maciSk, setMaciSk] = useState<MaciSk>({ maciSk: '' })
  const [showMaciSk, setShowMaciSk] = useState<boolean>(false)

  return (
    <>
      {showMaciSk ? (
        <CoordinatorKey toggleModal={toggleModal} maciSk={maciSk} />
      ) : (
        <InputForm setMaciSk={setMaciSk} setShowMaciSk={setShowMaciSk} />
      )}
    </>
  )
}
