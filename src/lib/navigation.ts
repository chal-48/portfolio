import { UserRound, Braces, FolderOpen, FileText, Send } from 'lucide-react'

export const chapters = [
  { id: 'about', path: '/about', label: 'about', icon: UserRound, accent: '#e7ecdf', ink: '#49523f', number: '01' },
  { id: 'skills', path: '/skills', label: 'skills', icon: Braces, accent: '#e2e8f3', ink: '#445774', number: '02' },
  { id: 'projects', path: '/projects', label: 'projects', icon: FolderOpen, accent: '#f4dfcf', ink: '#a4572b', number: '03' },
  { id: 'resume', path: '/resume', label: 'resume', icon: FileText, accent: '#e9e2ef', ink: '#6c527d', number: '04' },
  { id: 'contact', path: '/contact', label: 'contact', icon: Send, accent: '#f1e9cc', ink: '#7b6b31', number: '05' },
] as const
