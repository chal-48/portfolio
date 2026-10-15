import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Mail, Github, Linkedin, Copy, Check, ArrowUpRight, Send, LoaderCircle, Link as LinkIcon } from 'lucide-react'
import { portfolio, safeExternalUrl } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { sendContactMessage, type ContactFields } from '@/lib/contact'
import { PageHeading, ChapterNavigation } from '@/components/ui'

type ErrorKey = 'invalidName' | 'invalidEmail' | 'invalidSubject' | 'invalidMessage'
type Status = 'idle' | 'sending' | 'sent' | 'activation' | 'error'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const { t } = useLanguage()
  const [copied,setCopied] = useState(false)
  const [copyError,setCopyError] = useState(false)
  const [fields,setFields] = useState<ContactFields>({ name:'',email:'',subject:'',message:'' })
  const [errors,setErrors] = useState<Partial<Record<keyof ContactFields,ErrorKey>>>({})
  const [status,setStatus] = useState<Status>('idle')
  const inputRefs = useRef<Partial<Record<keyof ContactFields,HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const honey = useRef<HTMLInputElement>(null)
  const request = useRef<AbortController | null>(null)
  const alive = useRef(true)
  useEffect(() => { alive.current=true; return () => { alive.current=false; request.current?.abort() } },[])
  const email = portfolio.email && emailPattern.test(portfolio.email) ? portfolio.email : null
  const github = safeExternalUrl(portfolio.github)
  const linkedin = portfolio.linkedin?.match(/^https:\/\/(www\.)?linkedin\.com\/in\//i) ? safeExternalUrl(portfolio.linkedin) : null
  const channels = [{ title:'GitHub',url:github,icon:Github },{ title:'LinkedIn',url:linkedin,icon:Linkedin },...portfolio.otherContacts.map(item => ({ title:item.label,url:safeExternalUrl(item.url),icon:LinkIcon }))].filter(channel => channel.url)
  const copy = async () => {
    if (!email) return
    try { await navigator.clipboard.writeText(email); setCopied(true); setCopyError(false) } catch { setCopyError(true) }
  }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (request.current || status==='sending' || status==='sent' || honey.current?.value) return
    const next: Partial<Record<keyof ContactFields,ErrorKey>> = {}
    if (!fields.name.trim()) next.name='invalidName'
    if (!emailPattern.test(fields.email.trim())) next.email='invalidEmail'
    if (!fields.subject.trim()) next.subject='invalidSubject'
    if (fields.message.trim().length<10) next.message='invalidMessage'
    setErrors(next)
    const invalid = Object.keys(next)[0] as keyof ContactFields | undefined
    if (invalid) { setStatus('idle'); inputRefs.current[invalid]?.focus(); return }
    if (!email) { setStatus('error'); return }
    const controller = new AbortController()
    request.current=controller
    const timeout = window.setTimeout(() => controller.abort(),20000)
    setStatus('sending')
    try {
      const result = await sendContactMessage(email,fields,controller.signal)
      if (alive.current) setStatus(result)
    } catch {
      if (alive.current) setStatus('error')
    } finally { window.clearTimeout(timeout); request.current=null }
  }
  const update = (key: keyof ContactFields,value: string) => {
    setFields(previous => ({ ...previous,[key]:value }))
    setErrors(previous => ({ ...previous,[key]:undefined }))
    setStatus('idle')
  }
  const fieldError = (key: keyof ContactFields) => errors[key] && <span id={`${key}-error`} className="form-error">{t(errors[key]!)}</span>
  const busy = status==='sending'
  return <><PageHeading title={t('contact')}/><div className="contact-grid">
    <div className="contact-channels"><section className="panel email-panel"><span className="panel-icon"><Mail size={23}/></span><h2>Email</h2>{email && <a className="email-address" href={`mailto:${email}`}>{email}</a>}<button type="button" className="button button-light" disabled={!email} onClick={copy}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? t('copied') : t('copyEmail')}</button><span className="sr-only" role="status">{copied ? t('copied') : ''}</span>{copyError && <p className="form-error" role="alert">{t('copyFailed')}</p>}</section>
      {channels.map(channel => <a className="panel social-channel" key={channel.title} href={channel.url!} target="_blank" rel="noopener noreferrer"><channel.icon size={23}/><div><h3>{channel.title}</h3><span>{new URL(channel.url!).hostname}</span></div><ArrowUpRight size={18}/></a>)}
    </div>
    <section className="panel contact-form-panel"><h2>Send a message</h2><p className="form-note">Send a message directly to my inbox.</p>
      <form noValidate onSubmit={submit} aria-busy={busy}>
        <div className="contact-honeypot" aria-hidden="true"><label htmlFor="contact-company">Leave this field empty</label><input id="contact-company" name="_honey" tabIndex={-1} autoComplete="off" ref={honey}/></div>
        <fieldset disabled={busy} className="contact-fields"><div className="form-row"><div className="form-field"><label htmlFor="sender-name">{t('senderName')}</label><input id="sender-name" name="name" autoComplete="name" required maxLength={100} ref={element => { inputRefs.current.name=element }} value={fields.name} onChange={event => update('name',event.target.value)} placeholder="Name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined}/>{fieldError('name')}</div>
        <div className="form-field"><label htmlFor="sender-email">{t('senderEmail')}</label><input id="sender-email" name="email" type="email" autoComplete="email" required maxLength={254} ref={element => { inputRefs.current.email=element }} value={fields.email} onChange={event => update('email',event.target.value)} placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}/>{fieldError('email')}</div></div>
        <div className="form-field"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" required maxLength={200} ref={element => { inputRefs.current.subject=element }} value={fields.subject} onChange={event => update('subject',event.target.value)} placeholder="Subject" aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-error' : undefined}/>{fieldError('subject')}</div>
        <div className="form-field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={6} ref={element => { inputRefs.current.message=element }} value={fields.message} onChange={event => update('message',event.target.value)} placeholder="Your message" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}/>{fieldError('message')}</div></fieldset>
        <button className="button button-dark" type="submit" disabled={busy || status==='sent' || !email}>{busy ? 'Sending…' : status==='sent' ? 'Message submitted' : 'Send message'}{busy ? <LoaderCircle size={16} className="sending-spinner" aria-hidden="true"/> : <Send size={16} aria-hidden="true"/>}</button>
        {status==='sent' && <p className="form-status" role="status">Your message has been submitted. Thank you.</p>}
        {status==='activation' && <p className="form-status" role="status">This contact form is awaiting email verification. Please use the email link for now.</p>}
        {status==='error' && <p className="form-status form-error" role="alert">Unable to send right now. Your message is still here; please try again.</p>}
        <p className="contact-service-note">Messages are handled by <a href="https://formsubmit.co/" target="_blank" rel="noopener noreferrer">FormSubmit</a>.</p>
      </form>
    </section>
  </div><ChapterNavigation current="contact"/></>
}
