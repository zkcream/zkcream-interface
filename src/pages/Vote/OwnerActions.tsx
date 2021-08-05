import React from 'react'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { useApproveTallyCallback } from '../../hooks/useApproveTallyCallback'

export default function OwnerActions({ isPublished, isApproved }: { isPublished: boolean; isApproved: boolean }) {
  const approveTally = useApproveTallyCallback()

  return (
    <>
      <Text>
        <Trans>You are Owner</Trans>
      </Text>
      {!isPublished ? <Trans>Wait coordinator to publish tally hash</Trans> : null}
      {isApproved ? (
        <Trans>Tally already approved</Trans>
      ) : (
        <ButtonPrimary onClick={approveTally}>
          <Trans>Approve Tally</Trans>
        </ButtonPrimary>
      )}
    </>
  )
}
