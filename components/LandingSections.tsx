import { about, contact, experience, profile, projectsPage, resume } from "@/lib/sayali/content";

export default function LandingSections() {
  return (
    <div className="home-scroll">
      <section id="about" className="site-section">
        <div className="site-section__inner about-grid">
          <div className="about-main">
            <p className="site-page__eyebrow">{about.eyebrow}</p>
            <h2 className="site-page__title">{about.headline}</h2>
            <p className="site-page__lead">{about.lead}</p>
            <div className="about-copy">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="about-edu">
                <h3>{profile.education.degree}</h3>
                <p>
                  {profile.education.school} · {profile.education.place}
                </p>
              </div>
              <div className="about-actions">
                <a className="btn btn--solid" href={resume.path} download={resume.filename}>
                  {resume.label}
                </a>
                <a className="btn btn--ghost" href="#contact">
                  Contact
                </a>
              </div>
            </div>
          </div>

          <aside className="skills-cards" aria-label="Skills">
            <article className="skill-card">
              <h3>Languages</h3>
              <ul>
                {profile.skills.languages.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </article>
            <article className="skill-card">
              <h3>Frameworks & data</h3>
              <ul>
                {[...profile.skills.frameworks, ...profile.skills.data].map(
                  (s) => (
                    <li key={s}>{s}</li>
                  ),
                )}
              </ul>
            </article>
            <article className="skill-card">
              <h3>AI & automation</h3>
              <ul>
                {profile.skills.ai.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </article>
          </aside>
        </div>
      </section>

      <section id="experience" className="site-section site-section--alt">
        <div className="site-section__inner">
          <p className="site-page__eyebrow">{experience.eyebrow}</p>
          <h2 className="site-page__title">{experience.headline}</h2>
          <div className="about-timeline">
            {experience.items.map((row) => (
              <div key={`${row.org}-${row.title}`} className="about-timeline__row">
                <span className="about-timeline__year">{row.period}</span>
                <div>
                  <h3>{row.title}</h3>
                  <p className="exp-org">{row.org}</p>
                  <ul className="exp-points">
                    {row.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="site-section">
        <div className="site-section__inner">
          <p className="site-page__eyebrow">{projectsPage.eyebrow}</p>
          <h2 className="site-page__title">{projectsPage.headline}</h2>
          <p className="site-page__lead">{projectsPage.lead}</p>
          <div className="projects-list">
            {projectsPage.items.map((project, i) => (
              <article key={project.id} className="project-row">
                <div className="project-row__index">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="project-row__body">
                  <p className="project-row__meta">{project.meta}</p>
                  <h3>{project.title}</h3>
                  <p className="project-row__blurb">{project.blurb}</p>
                  <ul className="project-row__tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <a
                  className="project-row__cta"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live
                  <span aria-hidden="true"> →</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="site-section site-section--alt">
        <div className="site-section__inner">
          <p className="site-page__eyebrow">{contact.eyebrow}</p>
          <h2 className="site-page__title">{contact.headline}</h2>
          <p className="site-page__lead">{contact.lead}</p>

          <div className="profile-card">
            <div className="profile-card__head">
              <p className="profile-card__name">{profile.name}</p>
              <p className="profile-card__role">{profile.role}</p>
            </div>
            <dl className="profile-card__list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={profile.emailHref}>{profile.email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={profile.phoneHref}>{profile.phone}</a>
                </dd>
              </div>
              <div>
                <dt>GitHub</dt>
                <dd>
                  <a href={profile.githubHref} target="_blank" rel="noreferrer">
                    {profile.github}
                  </a>
                </dd>
              </div>
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={profile.linkedinHref} target="_blank" rel="noreferrer">
                    linkedin.com/in/sayli-kulkarni
                  </a>
                </dd>
              </div>
              <div>
                <dt>Resume</dt>
                <dd>
                  <a href={resume.path} download={resume.filename}>
                    {resume.filename}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>{profile.shortName}</span>
        <span>AI/ML · Full stack · Automation</span>
      </footer>
    </div>
  );
}
