import { useRef, useState, type FormEvent } from 'react'
import { Mail, Github, Linkedin, Copy, Check, ArrowUpRight, Send, Link as LinkIcon } from 'lucide-react'
import { portfolio, safeExternalUrl } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { PageHeading, DemoNote, ChapterNavigation } from '@/components/ui'

type Fields = { name: string; email: string; subject: string; message: string }
type ErrorKey = 'invalidName' | 'invalidEmail' | 'invalidSubject' | 'invalidMessage'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [fields, setFields] = useState<Fields>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, ErrorKey>>>({})
  const [status, setStatus] = useState<'pending' | 'opened' | null>(null)
  const inputRefs = useRef<Partial<Record<keyof Fields, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const email = portfolio.email && emailPattern.test(portfolio.email) ? portfolio.email : null
  const github = safeExternalUrl(portfolio.github)
  const linkedin = safeExternalUrl(portfolio.linkedin)
  const copy = async () => { if (!email) return; try { await navigator.clipboard.writeText(email); setCopied(true); setCopyError(false) } catch { setCopyError(true) } }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: Partial<Record<keyof Fields, ErrorKey>> = {}
    if (!fields.name.trim()) next.name='invalidName'
    if (!emailPattern.test(fields.email.trim())) next.email='invalidEmail'
    if (!fields.subject.trim()) next.subject='invalidSubject'
    if (fields.message.trim().length<10) next.message='invalidMessage'
    setErrors(next); setStatus(null)
    const invalid = Object.keys(next)[0] as keyof Fields | undefined
    if (invalid) { inputRefs.current[invalid]?.focus(); return }
    if (!email) { setStatus('pending'); return }
    const body = `${fields.message.trim()}\n\n${fields.name.trim()}\n${fields.email.trim()}`
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(fields.subject.trim())}&body=${encodeURIComponent(body)}`
    setStatus('opened')
  }
  const update = (key: keyof Fields, value: string) => { setFields(previous => ({ ...previous, [key]:value })); setErrors(previous => ({...previous,[key]:undefined})); setStatus(null) }
  return <><PageHeading eyebrow={t('contactEyebrow')} title={t('contactTitle')} description={t('contactIntro')}/><DemoNote/>
    <div className="contact-grid"><div className="contact-channels"><section className="panel email-panel"><span className="panel-icon"><Mail size={23}/></span><h2>{t('emailLabel')}</h2>{email ? <a className="email-address" href={`mailto:${email}`}>{email}</a> : <p className="muted">{t('unsetContact')}</p>}<button type="button" className="button button-light" disabled={!email} onClick={copy}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? t('copied') : t('copyEmail')}</button><span className="sr-only" role="status">{copied ? t('copied') : ''}</span>{copyError && <p className="form-error" role="alert">{t('copyFailed')}</p>}</section>
      {[{title:'GitHub',url:github,icon:Github},{title:'LinkedIn',url:linkedin,icon:Linkedin},...portfolio.otherContacts.map(item=>({title:item.label,url:safeExternalUrl(item.url),icon:LinkIcon}))].map(channel => channel.url ? <a className="panel social-channel" key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer"><channel.icon size={23}/><div><h3>{channel.title}</h3><span>{new URL(channel.url).hostname}</span></div><ArrowUpRight size={18}/></a> : <div className="panel social-channel channel-pending" key={channel.title}><channel.icon size={23}/><div><h3>{channel.title}</h3><span>{t('unsetContact')}</span></div></div>)}
    </div><section className="panel contact-form-panel"><h2>{t('draftTitle')}</h2><p className="form-note">{t('draftNote')}</p><form noValidate onSubmit={submit}><div className="form-row"><div className="form-field"><label htmlFor="sender-name">{t('senderName')}</label><input id="sender-name" name="name" autoComplete="name" required maxLength={100} ref={element => {inputRefs.current.name=element}} value={fields.name} onChange={event=>update('name',event.target.value)} placeholder={t('namePlaceholder')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined}/>{errors.name && <span id="name-error" className="form-error">{t(errors.name)}</span>}</div><div className="form-field"><label htmlFor="sender-email">{t('senderEmail')}</label><input id="sender-email" name="email" type="email" autoComplete="email" required maxLength={254} ref={element => {inputRefs.current.email=element}} value={fields.email} onChange={event=>update('email',event.target.value)} placeholder={t('emailPlaceholder')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}/>{errors.email && <span id="email-error" className="form-error">{t(errors.email)}</span>}</div></div><div className="form-field"><label htmlFor="contact-subject">{t('subject')}</label><input id="contact-subject" name="subject" required maxLength={200} ref={element=>{inputRefs.current.subject=element}} value={fields.subject} onChange={event=>update('subject',event.target.value)} placeholder={t('subjectPlaceholder')} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-error' : undefined}/>{errors.subject && <span id="subject-error" className="form-error">{t(errors.subject)}</span>}</div><div className="form-field"><label htmlFor="contact-message">{t('message')}</label><textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={6} ref={element=>{inputRefs.current.message=element}} value={fields.message} onChange={event=>update('message',event.target.value)} placeholder={t('messagePlaceholder')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}/>{errors.message && <span id="message-error" className="form-error">{t(errors.message)}</span>}</div><button className="button button-dark" type="submit">{t('compose')}<Send size={16}/></button>{status && <p className={`form-status ${status==='pending' ? 'status-pending' : ''}`} role="status">{t(status==='pending' ? 'contactPending' : 'draftOpened')}</p>}</form></section></div><ChapterNavigation current="contact"/></>
}
