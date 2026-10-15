import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { portfolio } from '@/content'
import { PageHeading, ChapterNavigation } from '@/components/ui'

export default function About() {
  return (
    <>
      <PageHeading title="About Me" />
      <div className="about-grid">
        {/* ฝั่งซ้ายบน: ประวัติ + ชั้นปี/GPA */}
        <section className="about-main">
          <h2 className="about-lead">{portfolio.name.en}</h2>
          {portfolio.bio.en.split(/\n\s*\n/).map(paragraph => (
            <p className="about-p" key={paragraph}>
              {paragraph.replaceAll('’', "'")}
            </p>
          ))}
          <p className="about-p">{portfolio.goal.en}</p>
          <div className="divider" />
          <div className="stat-grid">
            <div className="stat">
              <div className="stat-k">MAJOR</div>
              <div className="stat-v mono">Computer</div>
            </div>
            <div className="stat">
              <div className="stat-k">STUDY YEAR</div>
              <div className="stat-v mono">{portfolio.education.year}</div>
            </div>
            <div className="stat">
              <div className="stat-k">GPA</div>
              <div className="stat-v mono">{portfolio.education.gpa} / 4.00</div>
            </div>
          </div>
        </section>

        {/* ฝั่งขวาบน: Focus */}
        <aside className="about-side">
          <img
            src="/project-placeholders/bg-about.jpg"
            alt=""
            className="about-banner-slot"
          />
          <div className="about-side-body">
            <div className="label">Focus</div>
            <p className="about-side-quote">Full-stack development</p>
            <p className="about-side-v">
              Backend systems, APIs
              <br />
              and databases.
            </p>
          </div>
        </aside>

        {/* ฝั่งซ้ายล่าง: แบนเนอร์ My projects */}
        <Link to="/projects" className="mini-card mini-interest">
          <img
            src="/project-placeholders/bg-project.jpg"
            alt=""
            className="mini-interest-bg image-slot"
            data-image-slot="about-project-background"
          />
          <div className="mini-kicker">PROJECTS</div>
          <h2 className="mini-interest-title">My projects</h2>
          <div className="mini-interest-stack" aria-hidden="true">
            {portfolio.projects.map((project, index) => (
              <img
                key={project.id}
                src={project.coverImage}
                alt=""
                className="mini-interest-stack-img"
                data-image-slot={`about-project-${project.id}`}
                style={{ '--i': index } as CSSProperties}
              />
            ))}
          </div>
          <span className="mini-arrow" aria-hidden="true">↗</span>
        </Link>


        <section className="mini-card mini-music">
          <div className="mini-interest-bg image-slot" data-image-slot="about-interest-background" />
          <div className="mini-kicker">INTERESTS</div>
          <h2 className="mini-interest-title">Development</h2>
          <ul className="about-interest-list">
            {portfolio.interests.map(interest => (
              <li key={interest.en}>{interest.en}</li>
            ))}
          </ul>
        </section>

        {/* ฝั่งขวาล่าง: Education 3 ระดับ */}
        <section className="mini-card about-education">
          <div className="mini-kicker">EDUCATION</div>
          <h2 className="mini-interest-title">Education</h2>
          <div className="edu-list">
            <div className="edu-item">
              <div className="edu-level">Bachelor's Degree</div>
              <h3>King Mongkut's University of Technology North Bangkok</h3>
              <p>
                Electronics Engineering Technology - Computer
                <br />
                2023 - Expected 2027
              </p>
            </div>
            <div className="edu-item">
              <div className="edu-level">Senior High School</div>
              <h3>Ngammuangwittayakhom School</h3>
              <p>2020 - 2023 </p>
            </div>
            <div className="edu-item">
              <div className="edu-level">Junior High School</div>
              <h3>Ngammuangwittayakhom School</h3>
              <p>2017 - 2020 </p>
            </div>
          </div>
        </section>
      </div>
      <ChapterNavigation current="about" />
    </>
  )
}
