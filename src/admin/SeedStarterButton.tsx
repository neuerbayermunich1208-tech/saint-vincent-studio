'use client'

import { useState } from 'react'
import { useAuth } from '@payloadcms/ui'

/** Dashboard panel shown to owners: loads starter content on an empty site. */
export default function SeedStarterButton() {
  const { user } = useAuth<{ roles?: string[] }>()
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  if (!user?.roles?.includes('owner') || state === 'done') {
    return state === 'done' ? <p style={{ margin: '24px 0' }}>Starter content loaded. Nội dung mẫu đã được tải.</p> : null
  }

  async function run() {
    setState('busy')
    const res = await fetch('/api/seed-starter-content', { method: 'POST', credentials: 'include' })
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    if (res.ok) setState('done')
    else {
      setState('error')
      setMessage(body.error ?? `Error ${res.status}`)
    }
  }

  return (
    <div style={{ margin: '24px 0', padding: 16, border: '1px solid var(--theme-elevation-150)' }}>
      <p style={{ marginTop: 0 }}>
        Empty site? Load the starter collections, concept pieces, home page and FAQ. Only works while there are no products.
        <br />
        Trang còn trống? Tải bộ sưu tập, sản phẩm concept, trang chủ và FAQ mẫu. Chỉ chạy khi chưa có sản phẩm nào.
      </p>
      <button type="button" className="btn btn--style-secondary btn--size-small" disabled={state === 'busy'} onClick={run}>
        {state === 'busy' ? 'Loading…' : 'Load starter content'}
      </button>
      {state === 'error' && <p style={{ color: 'var(--theme-error-500)' }}>{message}</p>}
    </div>
  )
}
