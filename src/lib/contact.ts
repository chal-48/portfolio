export type ContactFields = { name: string; email: string; subject: string; message: string }

/** Submit directly from the website. Delivery requires the recipient's one-time verification. */
export async function sendContactMessage(recipient: string, fields: ContactFields, signal: AbortSignal): Promise<'sent' | 'activation'> {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json',Accept:'application/json' },
    signal,
    body:JSON.stringify({
      name:fields.name.trim(), email:fields.email.trim(), subject:fields.subject.trim(), message:fields.message.trim(),
      _subject:`Website message: ${fields.subject.trim()}`, _replyto:fields.email.trim(), _template:'table', _captcha:'false',
    }),
  })
  const result: unknown = await response.json()
  if (!response.ok || !result || typeof result !== 'object') throw new Error('Submission failed')
  const data = result as Record<string,unknown>
  const message = [data.message,data.error].filter(item => typeof item === 'string').join(' ')
  if (/activat|confirm.{0,30}email|verify.{0,30}email/i.test(message)) return 'activation'
  if (data.success !== true && data.success !== 'true') throw new Error('Submission not accepted')
  return 'sent'
}
