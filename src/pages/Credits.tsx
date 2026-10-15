import { PageHeading } from '@/components/ui'

export default function Credits() {
  return <><PageHeading title="Credits"/><section className="panel credits-panel">
    <p>This portfolio website is based on <a href="https://github.com/itousouta15/itouSouta.me" target="_blank" rel="noopener noreferrer">itouSouta.me</a>, created by <a href="https://github.com/itousouta15" target="_blank" rel="noopener noreferrer">itousouta15</a>.</p>
    <p>I use the original website as the base for my personal portfolio. I have changed the personal information, projects, and content to make it my own.</p>
    <p>Thanks to the original developer for sharing this project.</p>
    <h2>License</h2>
    <p>The original project is licensed under the Apache License 2.0. See the <a href="/licenses/itouSouta-Apache-2.0.txt" target="_blank" rel="noopener noreferrer">LICENSE</a> file for details.</p>
    <p className="credits-notices"><a href="/third-party-notices.txt" target="_blank" rel="noopener noreferrer">Third-party notices and font licenses</a></p>
  </section></>
}
