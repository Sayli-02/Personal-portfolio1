import Reveal from "@/components/Reveal";
import { about, contact, experience, profile, projectsPage, resume } from "@/lib/sayali/content";

export default function LandingSections() {
  return (
    <div className="home-scroll">
      <section id="about" className="site-section">
        <div className="site-section__inner about-grid">
          <div className="about-main">
            <Reveal>
              <p className="site-page__eyebrow">{about.eyebrow}</p>
              <h2 className="site-page__title">{about.headline}</h2>
              <p className="site-page__lead">{about.lead}</p>
            </Reveal>
            <Reveal delay={120}>
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
                  <a
                    className="btn btn--solid"
                    href={resume.path}
                    download={resume.filename}
                  >
                    {resume.label}
                  </a>
                  <a className="btn btn--ghost" href="#contact">
                    Contact
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <aside className="skills-cards" aria-label="Skills">
            <Reveal delay={80} variant="right">
              <article className="skill-card">
                <h3>Languages</h3>
                <ul>
                  {profile.skills.languages.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={160} variant="right">
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
            </Reveal>
            <Reveal delay={240} variant="right">
              <article className="skill-card">
                <h3>AI & automation</h3>
                <ul>
                  {profile.skills.ai.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </aside>
        </div>
      </section>

      <section id="experience" className="site-section site-section--alt">
        <div className="site-section__inner">
          <Reveal>
            <p className="site-page__eyebrow">{experience.eyebrow}</p>
            <h2 className="site-page__title">{experience.headline}</h2>
          </Reveal>
          <div className="about-timeline">
            {experience.items.map((row, i) => (
              <Reveal key={`${row.org}-${row.title}`} delay={i * 100}>
                <div className="about-timeline__row">
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="site-section">
        <div className="site-section__inner">
          <Reveal>
            <p className="site-page__eyebrow">{projectsPage.eyebrow}</p>
            <h2 className="site-page__title">{projectsPage.headline}</h2>
            <p className="site-page__lead">{projectsPage.lead}</p>
          </Reveal>
          <div className="projects-list">
            {projectsPage.items.map((project, i) => (
              <Reveal key={project.id} delay={i * 110}>
                <article className="project-row">
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="site-section site-section--alt">
        <div className="site-section__inner">
          <Reveal>
            <p className="site-page__eyebrow">{contact.eyebrow}</p>
            <h2 className="site-page__title">{contact.headline}</h2>
            <p className="site-page__lead">{contact.lead}</p>
          </Reveal>

          <Reveal delay={140} variant="up">
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
                    <a
                      href={profile.githubHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {profile.github}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>LinkedIn</dt>
                  <dd>
                    <a
                      href={profile.linkedinHref}
                      target="_blank"
                      rel="noreferrer"
                    >
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
          </Reveal>
        </div>
      </section>

      <footer className="site-footer">
        <Reveal variant="fade">
          <div className="site-footer__inner">
            <span>{profile.shortName}</span>
            <span>AI/ML · Full stack · Automation</span>
          </div>
        </Reveal>
      </footer>
    </div>
  );
}
