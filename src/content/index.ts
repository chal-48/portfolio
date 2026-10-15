import data from './portfolio.json'

export type Project = Omit<(typeof data.projects)[number], 'sourceUrl' | 'demoUrl'> & {
  sourceUrl: string | null
  demoUrl: string | null
}
type Portfolio = Omit<typeof data, 'portrait' | 'email' | 'github' | 'linkedin' | 'otherContacts' | 'education' | 'projects'> & {
  portrait: string | null
  email: string | null
  github: string | null
  linkedin: string | null
  otherContacts: { label: string; url: string }[]
  education: Omit<typeof data.education, 'year' | 'gpa'> & { year: number | null; gpa: string | number | null }
  projects: Project[]
}

export const portfolio: Portfolio = data

export function safeExternalUrl(value: string | null): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch { return undefined }
}
