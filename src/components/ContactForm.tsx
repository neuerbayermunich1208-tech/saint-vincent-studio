'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { sendInquiry } from '@/actions/contact'
import type { FormState } from '@/actions/subscribe'

const TOPICS = ['general', 'product', 'collaboration', 'press', 'order'] as const

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations('contact')
  const tn = useTranslations('notify')
  const [state, action, pending] = useActionState<FormState, FormData>(sendInquiry, { status: 'idle' })
  const bad = (f: string) => state.status === 'invalid' && state.fields?.includes(f)

  if (state.status === 'success') {
    return <p className="d-m" role="status">{t('success')}</p>
  }

  const message =
    state.status === 'invalid' ? t('invalid') : state.status === 'rateLimited' ? tn('rateLimited') : state.status === 'error' ? tn('error') : ''

  return (
    <form className="form" action={action} noValidate>
      <div className="field" data-invalid={bad('name')}>
        <label className="label" htmlFor="c-name">{t('name')}</label>
        <input id="c-name" name="name" autoComplete="name" required maxLength={120} />
      </div>
      <div className="field" data-invalid={bad('email')}>
        <label className="label" htmlFor="c-email">{t('email')}</label>
        <input id="c-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label className="label" htmlFor="c-topic">{t('topic')}</label>
        <select id="c-topic" name="topic" defaultValue="general">
          {TOPICS.map((k) => <option key={k} value={k}>{t(`topics.${k}`)}</option>)}
        </select>
      </div>
      <div className="field" data-invalid={bad('subject')}>
        <label className="label" htmlFor="c-subject">{t('subject')}</label>
        <input id="c-subject" name="subject" required maxLength={160} />
      </div>
      <div className="field" data-invalid={bad('message')}>
        <label className="label" htmlFor="c-message">{t('message')}</label>
        <textarea id="c-message" name="message" required minLength={10} maxLength={5000} />
      </div>
      <input type="hidden" name="locale" value={locale} />
      <div className="hp" aria-hidden="true">
        <label htmlFor="c-company">Company</label>
        <input id="c-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="form-msg" role="status" data-tone={message ? 'error' : undefined}>{message}</p>
      <div><button className="btn" type="submit" disabled={pending}>{pending ? tn('sending') : t('send')} <span className="arr">→</span></button></div>
    </form>
  )
}
