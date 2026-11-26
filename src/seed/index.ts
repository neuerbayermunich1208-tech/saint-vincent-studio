/**
 * Seeds the starting content: settings, home page, five collections, four concept pieces,
 * upcoming releases, FAQ and draft legal pages. Safe to re-run: existing slugs are skipped.
 * Run with: npm run seed
 *
 * Content rules: no invented specs, dates, stock or claims. Concept pieces carry only what is decided (name, scale, collection).
 */
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

type Loc = { en: string; vi: string }

const p = (text: string) => ({ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }] })
const h = (text: string) => ({ type: 'heading', tag: 'h2', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }] })
const doc = (...children: object[]) => ({ root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children } }) as never

async function upsertBySlug<T extends 'product-collections' | 'products' | 'pages'>(
  payload: Payload,
  collection: T,
  slug: string,
  en: Record<string, unknown>,
  vi: Record<string, unknown>,
  draft = false,
) {
  const found = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, draft: true, overrideAccess: true })
  if (found.docs[0]) {
    payload.logger.info(`skip ${collection}/${slug} (exists)`)
    return found.docs[0]
  }
  const created = await payload.create({ collection, locale: 'en', data: { ...en, slug } as never, draft, overrideAccess: true })
  await payload.update({ collection, id: created.id, locale: 'vi', data: vi as never, draft, overrideAccess: true })
  payload.logger.info(`created ${collection}/${slug}`)
  return created
}

async function seed() {
  const payload = await getPayload({ config })

  // Settings
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      mode: 'prelaunch',
      features: { journal: false, shop: false, search: false, wishlist: true, modularPreview: true },
      contact: { email: 'hello@saintvincent.studio' },
      defaultCurrency: 'VND',
    },
  })

  // Collections
  const cols: { slug: string; code: string; name: Loc; summary: Loc; themes: Loc[]; collector?: boolean }[] = [
    {
      slug: 'miniature-worlds', code: 'MW', collector: true,
      name: { en: 'Miniature Worlds', vi: 'Thế giới thu nhỏ' },
      summary: { en: 'Dioramas, architectural miniatures and display environments for 1:64 cars.', vi: 'Sa bàn, mô hình kiến trúc và không gian trưng bày cho xe tỷ lệ 1:64.' },
      themes: [{ en: 'Dioramas', vi: 'Sa bàn' }, { en: 'Architectural miniatures', vi: 'Kiến trúc thu nhỏ' }, { en: 'Street scenes', vi: 'Góc phố' }, { en: '1:64 displays', vi: 'Trưng bày 1:64' }],
    },
    {
      slug: 'modular-models', code: 'MM',
      name: { en: 'Modular Models', vi: 'Mô hình module' },
      summary: { en: 'Assembly kits made of interchangeable modules, designed to grow.', vi: 'Bộ lắp ráp từ các module có thể hoán đổi, được thiết kế để mở rộng.' },
      themes: [{ en: 'Assembly kits', vi: 'Bộ lắp ráp' }, { en: 'Interchangeable modules', vi: 'Module hoán đổi' }, { en: 'Expansions', vi: 'Gói mở rộng' }],
    },
    {
      slug: 'lighting-objects', code: 'LO',
      name: { en: 'Lighting Objects', vi: 'Đèn trang trí' },
      summary: { en: 'Ambient, bedside and sculptural lamps.', vi: 'Đèn không gian, đèn ngủ và đèn điêu khắc.' },
      themes: [{ en: 'Ambient', vi: 'Đèn không gian' }, { en: 'Bedside', vi: 'Đèn ngủ' }, { en: 'Sculptural', vi: 'Đèn điêu khắc' }],
    },
    {
      slug: 'everyday-objects', code: 'EO',
      name: { en: 'Everyday Objects', vi: 'Đồ dùng hằng ngày' },
      summary: { en: 'Desk accessories and decorative objects with a purpose.', vi: 'Phụ kiện bàn làm việc và vật trang trí có công năng.' },
      themes: [{ en: 'Desk accessories', vi: 'Phụ kiện bàn làm việc' }, { en: 'Decorative objects', vi: 'Vật trang trí' }, { en: 'Functional designs', vi: 'Thiết kế công năng' }],
    },
    {
      slug: 'studio-editions', code: 'SE', collector: true,
      name: { en: 'Studio Editions', vi: 'Studio Editions' },
      summary: { en: 'Original concepts, experiments and collaborations.', vi: 'Những concept nguyên bản, thử nghiệm và dự án hợp tác.' },
      themes: [{ en: 'Original concepts', vi: 'Concept nguyên bản' }, { en: 'Experiments', vi: 'Thử nghiệm' }, { en: 'Collaborations', vi: 'Hợp tác' }],
    },
  ]
  const colIds: Record<string, number | string> = {}
  for (const [i, c] of cols.entries()) {
    const created = await upsertBySlug(
      payload, 'product-collections', c.slug,
      { name: c.name.en, summary: c.summary.en, code: c.code, order: i, visible: true, collectorMode: Boolean(c.collector), themes: c.themes.map((t) => ({ label: t.en })) },
      { name: c.name.vi, summary: c.summary.vi },
    )
    colIds[c.slug] = created.id
    // Theme labels are array rows: update VI labels by row id.
    const full = await payload.findByID({ collection: 'product-collections', id: created.id, locale: 'en', overrideAccess: true })
    await payload.update({
      collection: 'product-collections', id: created.id, locale: 'vi', overrideAccess: true,
      data: { themes: (full.themes ?? []).map((row, k) => ({ id: row.id, label: c.themes[k]?.vi ?? row.label })) },
    })
  }

  // Concept pieces (published so they appear, status says what they are)
  const corner = await upsertBySlug(
    payload, 'products', 'the-corner',
    {
      name: 'The Corner', tagline: 'at 1:64', catalogueNumber: 'SV-MW-001', productType: 'diorama', status: 'prototype', featured: true,
      collections: [colIds['miniature-worlds']], specs: { scale: '1:64' }, _status: 'published',
      story: doc(p('A street corner designed for the 1:64 cars people already collect. Each base connects to the next, so one corner can grow into a whole street.')),
      hotspots: [
        { x: 35, y: 66, title: '1:64 parking bay', body: 'Sized for the 1:64 die-cast cars collectors already own, so a collection can be parked and shown.' },
        { x: 68, y: 38, title: 'Facade module', body: 'The building is a separate module. Facades are planned to swap between styles.' },
        { x: 88, y: 60, title: 'Connector edge', body: 'Each base joins the next one, so a single corner can become a street.' },
        { x: 46, y: 58, title: 'Road markings', body: 'Markings and kerbs are part of the base design. Final finish to be confirmed.' },
      ],
    },
    {
      name: 'The Corner', tagline: 'tỷ lệ 1:64',
      story: doc(p('Một góc phố được thiết kế cho những chiếc xe 1:64 mà người sưu tầm đang có. Mỗi đế nối được với đế tiếp theo, nên một góc phố có thể mở rộng thành cả một con đường.')),
    },
  )
  const cornerFull = await payload.findByID({ collection: 'products', id: corner.id, locale: 'en', draft: true, overrideAccess: true })
  const viSpots = [
    ['Ô đỗ xe 1:64', 'Vừa với những chiếc xe die-cast 1:64 mà người sưu tầm đang sở hữu, để bộ sưu tập có chỗ đỗ và trưng bày.'],
    ['Module mặt tiền', 'Toà nhà là một module riêng. Mặt tiền được thiết kế để thay đổi giữa nhiều phong cách.'],
    ['Cạnh nối', 'Mỗi đế nối với đế tiếp theo, để một góc phố có thể trở thành cả con đường.'],
    ['Vạch kẻ đường', 'Vạch kẻ và bó vỉa là một phần của thiết kế đế. Bề mặt hoàn thiện sẽ được xác nhận sau.'],
  ]
  await payload.update({
    collection: 'products', id: corner.id, locale: 'vi', overrideAccess: true,
    data: { hotspots: (cornerFull.hotspots ?? []).map((s, k) => ({ ...s, title: viSpots[k][0], body: viSpots[k][1] })), _status: 'published' } as never,
  })

  const lantern = await upsertBySlug(
    payload, 'products', 'lantern-study',
    { name: 'Lantern Study', tagline: 'A lamp in five parts', catalogueNumber: 'SV-LO-001', productType: 'lighting', status: 'in_development', collections: [colIds['lighting-objects']], _status: 'published' },
    { name: 'Lantern Study', tagline: 'Một chiếc đèn từ năm bộ phận' },
  )
  const plinth = await upsertBySlug(
    payload, 'products', 'desk-plinth',
    { name: 'Desk Plinth', tagline: 'A base for small things', catalogueNumber: 'SV-EO-001', productType: 'object', status: 'concept', collections: [colIds['everyday-objects']], _status: 'published' },
    { name: 'Desk Plinth', tagline: 'Chiếc đế cho những vật nhỏ' },
  )
  await upsertBySlug(
    payload, 'products', 'block-kit-01',
    { name: 'Block Kit 01', tagline: 'Three modules to start', catalogueNumber: 'SV-MM-001', productType: 'model_kit', status: 'concept', collections: [colIds['modular-models']], _status: 'published' },
    { name: 'Block Kit 01', tagline: 'Ba module để bắt đầu' },
  )
  await payload.update({ collection: 'products', id: lantern.id, data: { related: [plinth.id] } as never, overrideAccess: true })

  // Releases
  const existingReleases = await payload.count({ collection: 'releases', overrideAccess: true })
  if (existingReleases.totalDocs === 0) {
    const rel: [Loc, string, string, number | string][] = [
      [{ en: 'The Corner 1:64', vi: 'The Corner 1:64' }, 'SV-MW-001', 'prototype', corner.id],
      [{ en: 'Lantern Study', vi: 'Lantern Study' }, 'SV-LO-001', 'design', lantern.id],
      [{ en: 'Desk Plinth', vi: 'Desk Plinth' }, 'SV-EO-001', 'concept', plinth.id],
    ]
    for (const [i, [title, cat, stage, product]] of rel.entries()) {
      const r = await payload.create({ collection: 'releases', locale: 'en', overrideAccess: true, data: { title: title.en, catalogueNumber: cat, stage: stage as never, product: product as never, order: i, visible: true } })
      await payload.update({ collection: 'releases', id: r.id, locale: 'vi', overrideAccess: true, data: { title: title.vi } })
    }
  }

  // Home page
  await payload.updateGlobal({
    slug: 'homepage', locale: 'en', overrideAccess: true,
    data: {
      _status: 'published',
      heroLines: [{ text: 'Objects' }, { text: 'with a', italic: true, indent: true }, { text: 'point of view.' }],
      heroLede: 'Saint Vincent Studio is an independent design and manufacturing studio. We make miniature worlds, modular models and objects designed to be kept.',
      introHeading: 'Design first. Everything else follows.',
      introStatement: 'Every object starts as a drawing, is tested through prototypes, and is only released when its proportions, details and feel in the hand are right.',
      pillars: [
        { label: 'Original design', text: 'Every piece is designed in-house. No catalogue stock, no copies.' },
        { label: 'Modular by intent', text: 'Designs are planned as systems that extend and combine over time.' },
        { label: 'Precision made', text: 'Design and making share one roof, so every detail stays under our control.' },
      ],
      featuredProduct: corner.id as never,
      closingStatement: 'Imagination, made to be kept.',
    } as never,
  })
  const homeEn = await payload.findGlobal({ slug: 'homepage', locale: 'en', draft: true, overrideAccess: true })
  const viHero = [['Đồ vật'], ['mang một'], ['góc nhìn riêng.']]
  const viPillars = [
    ['Thiết kế độc quyền', 'Mọi sản phẩm đều được thiết kế tại studio. Không hàng có sẵn, không sao chép.'],
    ['Hệ thống module', 'Các thiết kế được nghĩ như một hệ thống, để mở rộng và kết hợp theo thời gian.'],
    ['Sản xuất chính xác', 'Thiết kế và sản xuất dưới cùng một mái nhà, nên từng chi tiết đều được kiểm soát.'],
  ]
  await payload.updateGlobal({
    slug: 'homepage', locale: 'vi', overrideAccess: true,
    data: {
      _status: 'published',
      heroLines: (homeEn.heroLines ?? []).map((l, k) => ({ ...l, text: viHero[k]?.[0] ?? l.text })),
      heroLede: 'Saint Vincent Studio là studio thiết kế và sản xuất độc lập. Chúng tôi tạo ra những thế giới thu nhỏ, mô hình lắp ghép và đồ vật được thiết kế để giữ lại lâu dài.',
      introHeading: 'Thiết kế trước. Mọi thứ khác theo sau.',
      introStatement: 'Mỗi vật phẩm bắt đầu bằng một bản vẽ, được thử nghiệm qua nhiều mẫu, và chỉ ra đời khi tỷ lệ, chi tiết và cảm giác cầm trên tay đều đúng như ý định.',
      pillars: (homeEn.pillars ?? []).map((pl, k) => ({ ...pl, label: viPillars[k][0], text: viPillars[k][1] })),
      closingStatement: 'Trí tưởng tượng, được làm ra để giữ lại.',
    } as never,
  })

  // FAQ (published) and legal/support pages (drafts until reviewed by the owner)
  await upsertBySlug(
    payload, 'pages', 'faq',
    {
      title: 'Frequently asked questions', section: 'support', _status: 'published',
      body: doc(
        h('Can I buy a piece yet?'), p('Not yet. The first collection is in development. Join the release list on the Upcoming page and we will write when pieces are ready.'),
        h('Who designs the pieces?'), p('Every piece is designed and developed in-house at Saint Vincent Studio.'),
        h('Do the miniatures fit my 1:64 cars?'), p('Pieces marked 1:64 are designed around the 1:64 scale used by die-cast collectors. Exact dimensions are published for each piece once its prototype is final.'),
        h('Do you ship outside Vietnam?'), p('Shipping options will be announced before the first release.'),
        h('How can I contact the studio?'), p('Use the contact form or write to hello@saintvincent.studio.'),
      ),
    },
    {
      title: 'Câu hỏi thường gặp',
      body: doc(
        h('Tôi đã mua sản phẩm được chưa?'), p('Chưa. Bộ sưu tập đầu tiên đang được phát triển. Bạn hãy đăng ký ở trang Sắp ra mắt, chúng tôi sẽ báo khi sản phẩm sẵn sàng.'),
        h('Ai thiết kế các sản phẩm?'), p('Mọi sản phẩm đều được thiết kế và phát triển tại Saint Vincent Studio.'),
        h('Mô hình có vừa xe 1:64 của tôi không?'), p('Những sản phẩm ghi 1:64 được thiết kế theo tỷ lệ 1:64 mà người sưu tầm xe die-cast đang dùng. Kích thước chính xác sẽ được công bố cho từng sản phẩm khi mẫu hoàn thiện.'),
        h('Studio có giao hàng ra nước ngoài không?'), p('Các phương án vận chuyển sẽ được thông báo trước đợt ra mắt đầu tiên.'),
        h('Liên hệ studio bằng cách nào?'), p('Dùng form liên hệ hoặc gửi email đến hello@saintvincent.studio.'),
      ),
    },
  )
  const drafts: [string, 'legal' | 'support', Loc][] = [
    ['privacy-policy', 'legal', { en: 'Privacy Policy', vi: 'Chính sách bảo mật' }],
    ['terms', 'legal', { en: 'Terms & Conditions', vi: 'Điều khoản sử dụng' }],
    ['shipping', 'support', { en: 'Shipping & Delivery', vi: 'Vận chuyển & giao hàng' }],
    ['returns', 'support', { en: 'Returns & Exchanges', vi: 'Đổi trả' }],
    ['product-care', 'support', { en: 'Product Care', vi: 'Bảo quản sản phẩm' }],
    ['assembly-instructions', 'support', { en: 'Assembly Instructions', vi: 'Hướng dẫn lắp ráp' }],
  ]
  for (const [slug, section, title] of drafts) {
    await upsertBySlug(
      payload, 'pages', slug,
      { title: title.en, section, _status: 'draft', body: doc(p('Draft. To be written and reviewed by the studio before publishing.')) },
      { title: title.vi, body: doc(p('Bản nháp. Studio sẽ viết và duyệt trước khi xuất bản.')) },
      true,
    )
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
