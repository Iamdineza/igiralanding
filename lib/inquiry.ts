export const INQUIRY_EMAIL = 'info@igiraprovisoire.rw'

export function inquiryDraft(form: FormData): string {
  const fields = [
    ['organization', 'Organization', 200], ['contact', 'Contact person', 100],
    ['email', 'Business email', 254], ['phone', 'Phone', 32],
    ['interest', 'Partnership interest', 100], ['budget', 'Estimated budget', 100],
    ['message', 'Message', 1500],
  ] as const
  const values = fields.map(([key, label, limit]) => {
    const value = form.get(key)
    if (typeof value !== 'string' || value.length > limit || (key !== 'budget' && !value.trim())) {
      throw new Error('Please complete the required fields within the displayed limits.')
    }
    return `${label}: ${value.trim() || 'Not specified'}`
  })
  // Encode the entire value: user text cannot add mailto recipients or query fields.
  return `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent('Igira partnership inquiry')}&body=${encodeURIComponent(values.join('\n\n'))}`
}
