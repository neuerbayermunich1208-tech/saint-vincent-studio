import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'

export function PageView({ page, eyebrow }: { page: Page; eyebrow: string }) {
  return (
    <section className="section page-top">
      <div className="wrap">
        <div className="sec-head">
          <p className="label">{eyebrow}</p>
          <h1 className="d-l">{page.title}</h1>
        </div>
        <div className="grid12">
          <div className="prose" style={{ gridColumn: '1 / -1' }}>
            {page.body && <RichText data={page.body} />}
          </div>
        </div>
      </div>
    </section>
  )
}
