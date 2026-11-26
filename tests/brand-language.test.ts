import { describe, expect, it } from 'vitest'
import { findViolations } from '../scripts/check-brand-language.mjs'

describe('brand language check', () => {
  it('flags banned wording in English and Vietnamese', () => {
    expect(findViolations('Our 3D printing service')).not.toHaveLength(0)
    expect(findViolations('3D printed products')).not.toHaveLength(0)
    expect(findViolations('Dịch vụ in 3D giá rẻ')).not.toHaveLength(0)
    expect(findViolations('Nhận in 3D theo yêu cầu')).not.toHaveLength(0)
    expect(findViolations('Xưởng in 3D')).not.toHaveLength(0)
  })
  it('allows brand vocabulary', () => {
    expect(findViolations('Design-led manufacturing and precision made objects')).toHaveLength(0)
    expect(findViolations('Thiết kế độc quyền, sản xuất chính xác')).toHaveLength(0)
  })
})
