// The website is English only. Bilingual source content remains available to the PDF generator.
type Localized = { en: string }

const messages = {
  home: 'Home',
  about: 'About Me',
  skills: 'Technical Skills',
  projects: 'Projects',
  resume: 'Resume',
  contact: 'Contact',
  skip: 'Skip to content',
  back: 'Back to home',
  previous: 'Previous',
  next: 'Next',
  allSections: 'Section navigation',
  projectOverview: 'The project',
  role: 'My role',
  responsibilities: 'What I worked on',
  outcome: 'Outcome & takeaways',
  tech: 'Built with',
  source: 'View code',
  liveDemo: 'Live demo',
  backProjects: 'Back to projects',
  downloadResume: 'Download Resume',
  copyEmail: 'Copy email',
  copied: 'Copied',
  copyFailed: 'Could not copy. Please select and copy the email directly.',
  senderName: 'Your name',
  senderEmail: 'Your email',
  invalidEmail: 'Please enter a valid email address.',
  invalidName: 'Please enter your name.',
  invalidSubject: 'Please enter a subject.',
  invalidMessage: 'Please enter a message of at least 10 characters.',
  notFound: 'Page not found',
  notFoundNote: 'The page you requested could not be found.',
} as const

type MessageKey = keyof typeof messages
const copy = {
  t: (key: MessageKey): string => messages[key],
  localize: (value: Localized): string => value.en,
}

export function useLanguage() { return copy }
