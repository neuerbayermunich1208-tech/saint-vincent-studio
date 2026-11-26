/**
 * Seeds "Saint Vincent Mini" (SM-01 + SM-02), points the home page at it and retires the starter concept "The Corner".
 * Only touches those records: nothing else is changed or removed.
 * Usage: npm run seed:product -- <photo dir>
 *
 * Re-runnable: photos already uploaded (same filename) are reused, the product is updated in place.
 * Photos are used exactly as provided; they are not committed to git.
 * Content rules: only public, confirmed facts. No price, stock, dates, scale, materials, weight or stall heights.
 */
import fs from 'node:fs'
import path from 'node:path'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

type Loc = { en: string; vi: string }

const SLUG = 'saint-vincent-mini'
const EXT = ['.jpg', '.jpeg', '.png', '.webp']

/** Photo key → alt + caption in both languages. Alt describes what is in the frame. */
const PHOTOS: Record<string, { alt: Loc; caption: Loc }> = {
  '01-burger-banh-mi-closeup': {
    alt: {
      en: 'Close-up of the burger, ice cream and banh mi stalls on Saint Vincent Mini, with picnic tables and street lamps beside the parking bays.',
      vi: 'Cận cảnh quầy burger, kem và bánh mì trên Saint Vincent Mini, cạnh đó là bàn picnic và đèn đường bên các ô đỗ xe.',
    },
    caption: { en: 'Burger, ice cream and banh mi', vi: 'Burger, kem và bánh mì' },
  },
  '02-pizza-coffee-crossroads': {
    alt: {
      en: 'The pizza truck and the coffee kiosk with its bistro tables across the road, with lane arrows, a zebra crossing and the edge of the arch.',
      vi: 'Xe pizza và ki-ốt cà phê cùng bàn bistro bên kia đường, với mũi tên chỉ làn, vạch qua đường và một phần cổng vòm.',
    },
    caption: { en: 'Pizza truck and coffee kiosk', vi: 'Xe pizza và ki-ốt cà phê' },
  },
  '03-cafe-tables-detail': {
    alt: {
      en: 'Bistro tables and chairs on the pavement beside a hedge with white flowers, with a street lamp, a tree and the road behind.',
      vi: 'Bàn ghế bistro trên vỉa hè cạnh hàng rào cây xanh có hoa trắng, phía sau là đèn đường, cây xanh và mặt đường.',
    },
    caption: { en: 'Bistro tables and chairs', vi: 'Bàn ghế bistro' },
  },
  '04-full-set-front': {
    alt: {
      en: 'Saint Vincent Mini from the front: two joined bases, SM-01 and SM-02, forming one street with seven food stalls, marked parking bays and the SAINT VINCENT arch over the road.',
      vi: 'Saint Vincent Mini nhìn từ phía trước: hai đế SM-01 và SM-02 ghép thành một con phố với bảy quầy ẩm thực, các ô đỗ xe có vạch kẻ và cổng vòm SAINT VINCENT bắc qua đường.',
    },
    caption: { en: 'SM-01 + SM-02 · Front view', vi: 'SM-01 + SM-02 · Nhìn chính diện' },
  },
  '05-takoyaki-pizza': {
    alt: {
      en: 'The takoyaki stall, the milk tea stand and the pizza truck behind the parking bays, with picnic tables and street lamps.',
      vi: 'Quầy takoyaki, quầy trà sữa và xe pizza phía sau các ô đỗ xe, cùng bàn picnic và đèn đường.',
    },
    caption: { en: 'Takoyaki, milk tea and pizza', vi: 'Takoyaki, trà sữa và pizza' },
  },
  '06-street-food-side': {
    alt: {
      en: 'Side view along the pavement: the takoyaki stall, picnic tables, street lamps and bistro tables beside the parking bays.',
      vi: 'Góc nhìn ngang dọc vỉa hè: quầy takoyaki, bàn picnic, đèn đường và bàn bistro bên các ô đỗ xe.',
    },
    caption: { en: 'Parking · 6 bays × 39 mm, cars up to 72 mm', vi: 'Ô đỗ xe · 6 ô × 39 mm, xe dài tối đa 72 mm' },
  },
  '07-full-set-angled': {
    alt: {
      en: 'Saint Vincent Mini from a raised corner: the whole street with seven stalls, parking bays, a zebra crossing, trees and the SAINT VINCENT arch.',
      vi: 'Saint Vincent Mini nhìn từ góc cao: toàn bộ con phố với bảy quầy, ô đỗ xe, vạch qua đường, cây xanh và cổng vòm SAINT VINCENT.',
    },
    caption: { en: 'SM-01 + SM-02 · Angled view', vi: 'SM-01 + SM-02 · Góc nghiêng' },
  },
  '08-arch-closeup': {
    alt: {
      en: 'Close-up of the SAINT VINCENT arch over the road where the two bases meet, with the burger, ice cream and banh mi stalls behind.',
      vi: 'Cận cảnh cổng vòm SAINT VINCENT bắc qua đường tại chỗ hai đế gặp nhau, phía sau là quầy burger, kem và bánh mì.',
    },
    caption: { en: 'Arch · opening 84 × 50 mm', vi: 'Cổng vòm · lòng cổng 84 × 50 mm' },
  },
  '09-top-down-plan': {
    alt: {
      en: 'Saint Vincent Mini from above: the road with a zebra crossing and lane arrows, six parking bays, seven stalls, picnic and bistro tables and the SAINT VINCENT arch.',
      vi: 'Saint Vincent Mini nhìn từ trên xuống: con đường có vạch qua đường và mũi tên chỉ làn, sáu ô đỗ xe, bảy quầy, bàn picnic, bàn bistro và cổng vòm SAINT VINCENT.',
    },
    caption: { en: 'Plan view', vi: 'Mặt bằng' },
  },
}

const GALLERY = ['04', '09', '07', '08', '01', '05', '02', '06', '03']
const DETAILS = ['08', '06']
const STRIP = ['01', '05', '03']

const HOTSPOTS: { x: number; y: number; en: [string, string]; vi: [string, string] }[] = [
  { x: 22, y: 14, en: ['Milk tea stand', 'A milk tea stand with a cup of bubble tea on the roof.'], vi: ['Quầy trà sữa', 'Quầy trà sữa với ly trà trân châu trên mái.'] },
  { x: 49, y: 13, en: ['Pizza truck', 'A pizza truck, with picnic tables in front.'], vi: ['Xe pizza', 'Chiếc xe pizza, phía trước là bàn picnic.'] },
  { x: 77, y: 13, en: ['Coffee kiosk', 'The SAINT VINCENT COFFEE kiosk on the corner.'], vi: ['Ki-ốt cà phê', 'Ki-ốt SAINT VINCENT COFFEE ở góc phố.'] },
  { x: 23, y: 25, en: ['Takoyaki stall', 'The takoyaki stall, with a menu board out front.'], vi: ['Quầy takoyaki', 'Quầy takoyaki, phía trước có bảng menu.'] },
  { x: 50, y: 36, en: ['Parking bays', 'Six marked bays, 39 mm wide, for model cars up to 72 mm long.'], vi: ['Ô đỗ xe', 'Sáu ô có vạch kẻ, rộng 39 mm, cho xe mô hình dài tối đa 72 mm.'] },
  { x: 75, y: 31, en: ['Bistro tables', 'Three bistro tables and six chairs beside the coffee kiosk.'], vi: ['Bàn bistro', 'Ba bàn bistro và sáu ghế cạnh ki-ốt cà phê.'] },
  { x: 25, y: 51, en: ['Crossing', 'A zebra crossing where the road meets the pavement.'], vi: ['Vạch qua đường', 'Vạch kẻ qua đường nơi mặt đường gặp vỉa hè.'] },
  { x: 81, y: 50, en: ['SAINT VINCENT arch', 'The arch spans the road, with an 84 × 50 mm opening.'], vi: ['Cổng vòm SAINT VINCENT', 'Cổng vòm bắc qua đường, lòng cổng 84 × 50 mm.'] },
  { x: 25, y: 76, en: ['Banh mi stall', 'The banh mi stall, with its striped awning.'], vi: ['Quầy bánh mì', 'Quầy bánh mì với mái hiên kẻ sọc.'] },
  { x: 25, y: 88, en: ['Ice cream stall', 'An ice cream stall with a cone on the roof.'], vi: ['Quầy kem', 'Quầy kem với cây kem ốc quế trên mái.'] },
  { x: 50, y: 88, en: ['Burger stall', 'The burger stall, with picnic tables in front.'], vi: ['Quầy burger', 'Quầy burger, phía trước là bàn picnic.'] },
]

const SPEC_EXTRA: { en: [string, string]; vi: [string, string] }[] = [
  { en: ['Bases', 'SM-01 + SM-02, joined into one street'], vi: ['Đế', 'SM-01 + SM-02, ghép thành một con phố'] },
  { en: ['Main road', '80 mm wide'], vi: ['Đường chính', 'Rộng 80 mm'] },
  { en: ['Parking', '6 bays, 39 mm wide, for model cars up to 72 mm long'], vi: ['Ô đỗ xe', '6 ô, rộng 39 mm, cho xe mô hình dài tối đa 72 mm'] },
  { en: ['Arch opening', '84 × 50 mm'], vi: ['Lòng cổng vòm', '84 × 50 mm'] },
  { en: ['Base', '5.2 mm thick (release edition)'], vi: ['Đế', 'Dày 5,2 mm (bản phát hành)'] },
  { en: ['Trees', 'Two parts each'], vi: ['Cây', 'Mỗi cây gồm 2 phần'] },
]

const INCLUDED: Loc[] = [
  { en: '7 stalls: burger, ice cream and banh mi (SM-01); pizza truck, milk tea, takoyaki and coffee (SM-02)', vi: '7 quầy: burger, kem và bánh mì (SM-01); xe pizza, trà sữa, takoyaki và cà phê (SM-02)' },
  { en: '5 picnic tables', vi: '5 bàn picnic' },
  { en: '2 benches', vi: '2 ghế băng' },
  { en: '3 bistro tables, 6 bistro chairs', vi: '3 bàn bistro, 6 ghế bistro' },
  { en: '4 street lamps', vi: '4 đèn đường' },
  { en: '4 bins', vi: '4 thùng rác' },
  { en: '3 menu boards', vi: '3 bảng menu' },
  { en: '6 hedges, 2 flower planters', vi: '6 hàng rào cây xanh, 2 bồn hoa' },
  { en: '7 trees', vi: '7 cây xanh' },
]

const LAYOUT_MODULES: { code: string; name: Loc }[] = [
  { code: 'SM-01', name: { en: 'Saint Vincent · Mini', vi: 'Saint Vincent · Mini' } },
  { code: 'SM-02', name: { en: 'Supercar Street Food', vi: 'Supercar Street Food' } },
]

const LAYOUT_NOTES: { label: Loc; value: string }[] = [
  { label: { en: 'Joined set', vi: 'Bộ ghép hoàn chỉnh' }, value: '≈ 432 × 260 mm' },
  { label: { en: 'Main road', vi: 'Đường chính' }, value: '80 mm' },
  { label: { en: 'Parking bays', vi: 'Ô đỗ xe' }, value: '6 × 39 mm' },
  { label: { en: 'Car length', vi: 'Chiều dài xe' }, value: '≤ 72 mm' },
  { label: { en: 'Arch opening', vi: 'Lòng cổng vòm' }, value: '84 × 50 mm' },
  { label: { en: 'Base (release)', vi: 'Đế (bản phát hành)' }, value: '5.2 mm' },
]

const TAGLINE: Loc = {
  en: 'A street-food corner for your collector cars.',
  vi: 'Góc phố ẩm thực cho những chiếc xe sưu tầm của bạn.',
}

const PHOTO_NOTE: Loc = {
  en: 'Prototype shown. The release edition has a slimmer 5.2 mm base, two-part trees and no wheel stops.',
  vi: 'Ảnh chụp bản prototype. Bản phát hành có đế mỏng 5,2 mm, cây gồm 2 phần và không có thanh chắn bánh xe.',
}

const STORY: Loc[] = [
  {
    en: 'Saint Vincent Mini is a street-food corner made for the model cars you already collect. Two bases, SM-01 and SM-02, meet at a hidden joint and read as one street, about 432 by 260 mm.',
    vi: 'Saint Vincent Mini là một góc phố ẩm thực dành cho những chiếc xe mô hình bạn đang sưu tầm. Hai đế SM-01 và SM-02 gặp nhau ở một mối nối ẩn và trở thành một con phố liền mạch, khoảng 432 × 260 mm.',
  },
  {
    en: 'Seven stalls line the street: burger, ice cream and banh mi on SM-01; a pizza truck, milk tea, takoyaki and coffee on SM-02. Picnic tables, benches and bistro chairs sit between them, with street lamps, menu boards, hedges and flower planters around.',
    vi: 'Bảy quầy nằm dọc con phố: burger, kem và bánh mì trên SM-01; xe pizza, trà sữa, takoyaki và cà phê trên SM-02. Xen giữa là bàn picnic, ghế băng và ghế bistro, xung quanh có đèn đường, bảng menu, hàng rào cây xanh và bồn hoa.',
  },
  {
    en: 'The road is marked like a real one, with crossings, lane arrows and six parking bays waiting for your cars. At the entrance to the street stands the SAINT VINCENT arch.',
    vi: 'Mặt đường được kẻ vạch như thật, với vạch qua đường, mũi tên chỉ làn và sáu ô đỗ chờ những chiếc xe của bạn. Ở lối vào con phố là cổng vòm SAINT VINCENT.',
  },
]

const para = (text: string) => ({
  type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '',
  children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }],
})
const richText = (paras: string[]) => ({ root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: paras.map(para) } }) as never

function findPhoto(dir: string, key: string) {
  const files = fs.readdirSync(dir)
  const hit = files.find((f) => EXT.includes(path.extname(f).toLowerCase()) && path.basename(f, path.extname(f)).toLowerCase() === key)
  return hit ? path.join(dir, hit) : null
}

async function upsertMedia(payload: Payload, file: string, key: string) {
  const meta = PHOTOS[key]
  const filename = path.basename(file)
  // Storage may have renamed an earlier upload to "name-1.png", so match the base name with an optional numeric suffix.
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)
  const candidates = await payload.find({ collection: 'media', where: { filename: { like: base } }, limit: 20, overrideAccess: true, sort: 'createdAt' })
  const sameFile = (name: string) => {
    if (!name.toLowerCase().endsWith(ext.toLowerCase())) return false
    const stem = name.slice(0, -ext.length)
    return stem === base || (stem.startsWith(`${base}-`) && /^\d+$/.test(stem.slice(base.length + 1)))
  }
  let id = candidates.docs.find((d) => d.filename && sameFile(d.filename))?.id
  if (id) {
    payload.logger.info(`media ${filename}: exists, updating text`)
    await payload.update({ collection: 'media', id, locale: 'en', overrideAccess: true, data: { alt: meta.alt.en, caption: meta.caption.en, isConcept: false } })
  } else {
    const created = await payload.create({ collection: 'media', locale: 'en', overrideAccess: true, filePath: file, data: { alt: meta.alt.en, caption: meta.caption.en, isConcept: false } })
    id = created.id
    payload.logger.info(`media ${filename}: uploaded`)
  }
  await payload.update({ collection: 'media', id, locale: 'vi', overrideAccess: true, data: { alt: meta.alt.vi, caption: meta.caption.vi } })
  return id
}

async function run() {
  const dir = process.argv[2]
  if (!dir || !fs.existsSync(dir)) throw new Error('Usage: npm run seed:product -- <photo dir>')
  const payload = await getPayload({ config })

  const ids: Record<string, number | string> = {}
  const missing: string[] = []
  for (const key of Object.keys(PHOTOS)) {
    const file = findPhoto(dir, key)
    if (!file) { missing.push(key); continue }
    ids[key.slice(0, 2)] = await upsertMedia(payload, file, key)
  }
  if (missing.length) throw new Error(`Missing photos in ${dir}: ${missing.join(', ')}`)

  const collection = await payload.find({ collection: 'product-collections', where: { slug: { equals: 'miniature-worlds' } }, limit: 1, overrideAccess: true })
  if (!collection.docs[0]) throw new Error('Collection "miniature-worlds" not found. Run `npm run seed` first.')

  const en = {
    name: 'Saint Vincent Mini',
    tagline: TAGLINE.en,
    story: richText(STORY.map((p) => p.en)),
    catalogueNumber: 'SM-01 + SM-02',
    productType: 'diorama',
    status: 'prototype',
    featured: true,
    collections: [collection.docs[0].id],
    gallery: GALLERY.map((k) => ids[k]),
    photoNote: PHOTO_NOTE.en,
    cardImage: ids['07'],
    planImage: ids['09'],
    hotspots: HOTSPOTS.map((h) => ({ x: h.x, y: h.y, title: h.en[0], body: h.en[1] })),
    detailImages: DETAILS.map((k) => ids[k]),
    layout: {
      modules: LAYOUT_MODULES.map((m) => ({ code: m.code, name: m.name.en })),
      notes: LAYOUT_NOTES.map((n) => ({ label: n.label.en, value: n.value })),
    },
    specs: {
      widthMm: 432,
      depthMm: 260,
      heightMm: null,
      weightG: null,
      scale: null,
      materials: null,
      extra: SPEC_EXTRA.map((r) => ({ label: r.en[0], value: r.en[1] })),
      includedComponents: INCLUDED.map((i) => ({ item: i.en })),
    },
    assembly: { requiresAssembly: false },
    variants: [],
    seo: { title: 'Saint Vincent Mini · Street-food diorama', description: TAGLINE.en },
    _status: 'published',
  }

  const found = await payload.find({ collection: 'products', where: { slug: { equals: SLUG } }, limit: 1, draft: true, overrideAccess: true })
  const product = found.docs[0]
    ? await payload.update({ collection: 'products', id: found.docs[0].id, locale: 'en', overrideAccess: true, data: en as never })
    : await payload.create({ collection: 'products', locale: 'en', overrideAccess: true, data: { ...en, slug: SLUG } as never })
  payload.logger.info(`${found.docs[0] ? 'updated' : 'created'} products/${SLUG}`)

  // VI: array rows are matched by row id so both locales share one row.
  const full = await payload.findByID({ collection: 'products', id: product.id, locale: 'en', draft: true, overrideAccess: true, depth: 0 })
  await payload.update({
    collection: 'products', id: product.id, locale: 'vi', overrideAccess: true,
    data: {
      name: 'Saint Vincent Mini',
      tagline: TAGLINE.vi,
      story: richText(STORY.map((p) => p.vi)),
      photoNote: PHOTO_NOTE.vi,
      hotspots: (full.hotspots ?? []).map((row, k) => ({ ...row, title: HOTSPOTS[k].vi[0], body: HOTSPOTS[k].vi[1] })),
      layout: {
        modules: (full.layout?.modules ?? []).map((row, k) => ({ ...row, name: LAYOUT_MODULES[k].name.vi })),
        notes: (full.layout?.notes ?? []).map((row, k) => ({ ...row, label: LAYOUT_NOTES[k].label.vi })),
      },
      specs: {
        ...full.specs,
        extra: (full.specs?.extra ?? []).map((row, k) => ({ ...row, label: SPEC_EXTRA[k].vi[0], value: SPEC_EXTRA[k].vi[1] })),
        includedComponents: (full.specs?.includedComponents ?? []).map((row, k) => ({ ...row, item: INCLUDED[k].vi })),
      },
      seo: { title: 'Saint Vincent Mini · Sa bàn phố ẩm thực', description: TAGLINE.vi },
      _status: 'published',
    } as never,
  })

  // Release board entry (no date).
  const rel = await payload.find({ collection: 'releases', where: { catalogueNumber: { equals: 'SM-01 + SM-02' } }, limit: 1, overrideAccess: true })
  if (!rel.docs[0]) {
    const r = await payload.create({ collection: 'releases', locale: 'en', overrideAccess: true, data: { title: 'Saint Vincent Mini', catalogueNumber: 'SM-01 + SM-02', stage: 'prototype', product: product.id, order: -1, visible: true } as never })
    await payload.update({ collection: 'releases', id: r.id, locale: 'vi', overrideAccess: true, data: { title: 'Saint Vincent Mini' } })
    payload.logger.info('created release SM-01 + SM-02')
  }

  // Retire the starter concept "The Corner": archived (kept in the CMS, no public page), not featured, off the release board.
  const corner = await payload.find({ collection: 'products', where: { slug: { equals: 'the-corner' } }, limit: 1, draft: true, overrideAccess: true })
  if (corner.docs[0]) {
    await payload.update({ collection: 'products', id: corner.docs[0].id, overrideAccess: true, data: { status: 'archived', featured: false, _status: 'published' } as never })
    payload.logger.info('archived products/the-corner')
  }
  const cornerRelease = await payload.find({ collection: 'releases', where: { catalogueNumber: { equals: 'SV-MW-001' } }, limit: 1, overrideAccess: true })
  if (cornerRelease.docs[0]) {
    await payload.update({ collection: 'releases', id: cornerRelease.docs[0].id, overrideAccess: true, data: { visible: false } })
    payload.logger.info('hid release SV-MW-001')
  }

  // Home page: wide hero, featured design and detail strip. The studio headline and lede stay as they are.
  const homeData = (loc: 'en' | 'vi') => ({
    heroLayout: 'wide',
    heroImage: ids['04'],
    heroLabel: loc === 'en' ? 'SM-01 + SM-02 · Prototype' : 'SM-01 + SM-02 · Prototype',
    heroNote: PHOTO_NOTE[loc],
    heroProduct: product.id,
    featuredProduct: product.id,
    detailStrip: STRIP.map((k) => ids[k]),
    _status: 'published',
  })
  await payload.updateGlobal({ slug: 'homepage', locale: 'en', overrideAccess: true, data: homeData('en') as never })
  await payload.updateGlobal({ slug: 'homepage', locale: 'vi', overrideAccess: true, data: homeData('vi') as never })
  payload.logger.info('home page updated')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
