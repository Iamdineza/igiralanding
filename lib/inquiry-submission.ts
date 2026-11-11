export const inquiryInterests = ['Diamond Sponsorship','Platinum Sponsorship','Gold Sponsorship','Silver Sponsorship','Bronze Sponsorship','Technology Sponsorship','Institutional Partnership','Advertising','Other Collaboration'] as const

export function validateInquiry(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Please check the form fields.')
  const data = input as Record<string, unknown>
  const limits = { organization: 200, contact: 100, email: 254, phone: 32, interest: 100, budget: 100, message: 1500, captcha: 2048, requestId: 36 }
  if (Object.keys(data).some(key => !(key in limits))) throw Error('Unexpected form fields.')
  const values: Record<string, string> = {}
  for (const [key, max] of Object.entries(limits)) {
    const raw = data[key]
    if (typeof raw !== 'string' || raw.length > max) throw Error('Please check the form field limits.')
    const value = raw.normalize('NFC').trim()
    if ((!value && key !== 'budget') || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value) || (key !== 'message' && /[\r\n]/.test(value))) throw Error('Please check the form fields.')
    values[key] = value
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !inquiryInterests.includes(values.interest as typeof inquiryInterests[number]) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(values.requestId)) throw Error('Please check your email and partnership interest.')
  return values
}
