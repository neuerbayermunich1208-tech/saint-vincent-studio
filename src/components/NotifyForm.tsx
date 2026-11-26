'use client'

import { useActionState, useId } from 'react'
import { useTranslations } from 'next-intl'
import { subscribe, type FormState } from '@/actions/subscribe'

export function NotifyForm({ locale, source, label }: { locale: string; source: string; label?: string }) {
  const t = useTranslations('notify')
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { status: 'idle' })
  const id = useId()
  const msg = state.status === 'idle' ? '' : t(state.status === 'success' ? 'success' : state.status)
  const tone = state.status === 'success' || state.status === 'already' ? 'ok' : 'error'

  return (
    <form className="form" action={action} noValidate>
      <label className="label" htmlFor={`${id}-email`}>{label ?? t('label')}</label>
      <div className="field-line">
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" placeholder={t('placeholder')} required aria-describedby={`${id}-msg`} />
        <button type="submit" disabled={pending}>{pending ? t('sending') : t('submit')}</button>
      </div>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={source} />
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="form-msg" id={`${id}-msg`} role="status" data-tone={msg ? tone : undefined}>{msg}</p>
      <p className="label muted">{t('note')}</p>
    </form>
  )
}
