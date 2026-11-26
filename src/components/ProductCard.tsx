import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Product, ProductCollection } from '@/payload-types'
import { ObjectDrawing } from './Drawings'
import { MediaImage, asMedia } from './Media'
import { SaveButton } from './SaveButton'

export async function ProductCard({ product, showSave }: { product: Product; showSave: boolean }) {
  const t = await getTranslations()
  const cover = asMedia(product.cardImage) ?? asMedia(product.gallery?.[0])
  const collection = (product.collections ?? []).find((c): c is ProductCollection => typeof c === 'object')
  return (
    <article className="card">
      <div className="plate r-45">
        {cover ? (
          <MediaImage media={cover} sizes="(min-width: 900px) 30vw, 90vw" />
        ) : (
          <ObjectDrawing kind={product.productType} label={`${t('common.conceptDrawing')}: ${product.name}`} />
        )}
        {(!cover || cover.isConcept) && <span className="concept-tag">{t('common.concept')}</span>}
        {product.catalogueNumber && <span className="stamp">{product.catalogueNumber}</span>}
      </div>
      {showSave && (
        <SaveButton id={String(product.id)} addLabel={t('wishlist.add', { name: product.name })} removeLabel={t('wishlist.remove', { name: product.name })} />
      )}
      {collection && <span className="label muted">{collection.name}</span>}
      <h3><Link href={`/objects/${product.slug}`} style={{ textDecoration: 'none' }}>{product.name}</Link></h3>
      <div className="card-row label">
        <span>{product.specs?.scale ? `${t('product.scale')} ${product.specs.scale}` : product.tagline ?? ''}</span>
        <span className="pencil">{t(`status.${product.status}`)}</span>
      </div>
    </article>
  )
}
