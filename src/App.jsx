import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { fetchAbout, fetchProjects } from './spreadsheets.js';

const collection = [
  {
    href: 'https://www.youtube.com/channel/UCEbeeMSqjcP7jiYvYBuRX0Q',
    image: 'icon-youtube.png',
    title: 'Videoteca Têxtil',
    description: 'Vídeos',
  },
  {
    href: 'https://open.spotify.com/show/62otApEqkKP4M6IreSrW6d',
    image: 'spotify.png',
    title: 'Tecendo Comentários',
    description: 'Podcast',
  },
  {
    href: 'https://www.instagram.com/tecitecavirtual/',
    image: 'instagram.png',
    title: '@tecitecavirtual',
    description: 'Instagram',
  },
  {
    href: 'https://drive.google.com/drive/folders/1dI2G6_o0qosRzDxEBddu7vEQlliIwPS1',
    image: 'material-didatico.png',
    title: 'Biblioteca Digital',
    description: 'Repositório completo',
  },
];

const team = [
  {
    name: 'Tatiana Ferreira',
    role: 'Coordenadora',
    image: 'tatiana.png',
    alt: 'Coordenadora do projeto',
  },
  {
    name: 'Ciro Medeiros',
    role: 'Desenvolvedor',
    image: 'ciro-medeiros.jpeg',
    alt: 'Desenvolvedor',
  },
  {
    name: 'Maria José',
    role: 'Revisora Filológica e Linguística',
    image: 'maria-jose.jpeg',
    alt: 'Revisora Filológica e Linguística',
  },
];

const sections = [
  ['tf-home', 'Home'],
  ['tf-about', 'Sobre'],
  ['materiais', 'Acervo'],
  ['contato', 'Contato'],
  ['equipe', 'Equipe'],
];

function SiteNavigation({ scrolled, projectPage = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionHref = (id) => projectPage ? `/#${id}` : `#${id}`;

  return (
    <nav id="tf-menu" className={`navbar navbar-default navbar-fixed-top${scrolled ? ' on' : ''}`}>
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand brand-logo" href={sectionHref('tf-home')} aria-label="TeciTeca Virtual, início">
            <img src="/img/teciteca-logo-mono-small.png" alt="" />
          </a>
          <a className="navbar-brand brand-name" href={sectionHref('tf-home')}>TeciTeca Virtual</a>
          <button
            className="navbar-toggle"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
        </div>
        <div className={`site-nav-links${menuOpen ? ' is-open' : ''}`}>
          <ul className="nav navbar-nav navbar-right">
            {sections.map(([id, label]) => (
              <li key={id}>
                <a href={sectionHref(id)} onClick={() => setMenuOpen(false)}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function SectionTitle({ children, centered = false }) {
  return (
    <div className={`section-title${centered ? ' center' : ''}`}>
      <h2><strong>{children}</strong></h2>
      <div className="line"><hr /></div>
    </div>
  );
}

function LoadingStatus({ error, children = 'Carregando...' }) {
  if (error) return <p className="data-error" role="status">Não foi possível carregar os dados. Tente atualizar a página.</p>;

  return (
    <div className="data-loading" role="status" aria-live="polite">
      <div className="lds-ring" aria-hidden="true"><div /><div /><div /><div /></div>
      <span>{children}</span>
    </div>
  );
}

function AboutSection({ about, error }) {
  return (
    <section id="tf-about">
      <div className="container">
        <div className="row about-row">
          <div className="col-md-6 about-logo">
            <img src="./img/teciteca-logo.png" alt="Logo da TeciTeca" />
          </div>
          <div className="col-md-6">
            <div className="about-text">
              <SectionTitle>Sobre</SectionTitle>
              <div className="about-copy">
                {about ? about.map((paragraph, index) => (
                  paragraph ? <p key={`${index}-${paragraph}`}>{paragraph}</p> : null
                )) : <LoadingStatus error={error} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, to }) {
  const period = `${project.inicio == null ? '' : `${project.inicio} - `}${project.fim ?? 'em andamento'}`;

  const card = (
    <article className="projeto">
      <header className="titulo">
        <h3>{project.titulo}</h3>
        {project.area && <p className="area">Projeto de {project.area}</p>}
        <p className="periodo">{period}</p>
      </header>
      <div className="corpo">
        {project.resumo && <p>{project.resumo}</p>}
        {project.membros.length > 0 && (
          <>
            <h4>Participantes</h4>
            {project.membros.map((member, index) => (
              <div className="participante" key={`${member.nome}-${index}`}>
                <p className="nome">{member.nome}</p>
                {member.vinculo && <p className="vinculo">{member.vinculo}</p>}
                {member.curso_area_disciplina && <p>{member.curso_area_disciplina}</p>}
              </div>
            ))}
          </>
        )}
      </div>
    </article>
  );

  return to ? <Link className="project-link" to={to}>{card}</Link> : card;
}

function ProjectDetail({ projects, error }) {
  const { id: projectId } = useParams();
  const project = projects?.find((item) => String(item.id) === projectId);

  return (
    <section className="project-detail-section">
      <div className="container">
        <a className="project-back" href="/#equipe">&larr; Voltar aos projetos</a>
        {projects === null ? <LoadingStatus error={error} /> : project ? (
          <ProjectCard project={project} />
        ) : (
          <div className="project-not-found">
            <h1>Projeto não encontrado</h1>
            <p>O projeto solicitado não está disponível.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function TeamSection({ projects, error }) {
  return (
    <section id="equipe">
      <div className="overlay">
        <div className="container">
          <div className="section-title center text-center">
            <h2>Conheça <strong>nossa equipe</strong></h2>
            <div className="line"><hr /></div>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <article className="team-member" key={member.name}>
                <img src={`./img/team/${member.image}`} alt={member.alt} className="img-circle team-img" />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
          <SecaoProjetos projetos={projects} error={error} />
        </div>
        <footer className="site-footer">
          <p>Desenvolvido pelo</p>
          <a href="https://portal.ifrn.edu.br/campus/caico/" aria-label="IFRN Campus Caicó">
            <img src="./img/if-logo.png" alt="Instituto Federal do Rio Grande do Norte, Campus Caicó" />
          </a>
        </footer>
      </div>
    </section>
  );
}

function SecaoProjetos({ projetos: projects, error }) {
  return <div className="projects-section">
    <div className="text-center projects-heading"><h2><strong>Projetos</strong></h2></div>
    {projects ? (
      projects.length > 0
        ? <div id="div-projetos">{projects.map((project) => (
          <ProjectCard key={project.id} project={project} to={`/projetos/${encodeURIComponent(project.id)}`} />
        ))}</div>
        : <p className="empty-projects">Nenhum projeto disponível.</p>
    ) : <LoadingStatus error={error} />}
  </div>
}

function HomePage({ about, projects, dataError }) {
  return (
    <main>
      <section id="tf-home" className="text-center">
        <div className="overlay">
          <div className="content">
            <h1>A Revolução <strong><span className="color">Têxtil Chegou</span></strong></h1>
            <a href="#tf-about" className="fa fa-angle-down page-scroll" aria-label="Conheça a TeciTeca" />
          </div>
        </div>
      </section>
      <AboutSection about={about} error={dataError} />
      <section id="materiais" className="text-center container">
        <SectionTitle centered>Acervo</SectionTitle>
        <div className="collection-grid">
          {collection.map((item) => (
            <a className="item-acervo" href={item.href} key={item.title} target="_blank" rel="noreferrer">
              <img src={`/img/${item.image}`} alt="" />
              <p className="caption">{item.title}</p>
              <p className="desc">{item.description}</p>
            </a>
          ))}
        </div>
      </section>
      <section id="contato" className="text-center">
        <div className="container">
          <SectionTitle centered>Contato</SectionTitle>
          <a className="contact-link" href="mailto:teciteca@ifrn.edu.br">
            <img src="./img/email.png" alt="" />
            <span>teciteca@ifrn.edu.br</span>
          </a>
        </div>
      </section>
      <TeamSection projects={projects} error={dataError} />
    </main>
  );
}

function AppRoutes() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState(null);
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    const updateNavigation = () => setScrolled(window.scrollY > window.innerHeight - 100);
    updateNavigation();
    window.addEventListener('scroll', updateNavigation, { passive: true });
    return () => window.removeEventListener('scroll', updateNavigation);
  }, []);

  useEffect(() => {
    let active = true;

    Promise.allSettled([fetchAbout(), fetchProjects()]).then(([aboutResult, projectsResult]) => {
      if (!active) return;
      if (aboutResult.status === 'fulfilled') {
        setAbout(Array.isArray(aboutResult.value) ? aboutResult.value : [aboutResult.value]);
      } else {
        setDataError(true);
        console.error(aboutResult.reason);
      }
      if (projectsResult.status === 'fulfilled') {
        setProjects(projectsResult.value);
      } else {
        setDataError(true);
        console.error(projectsResult.reason);
      }
    });

    return () => { active = false; };
  }, []);

  return (
    <>
      <SiteNavigation scrolled={scrolled} projectPage={location.pathname.startsWith('/projetos/')} />
      <Routes>
        <Route path="/" element={<HomePage about={about} projects={projects} dataError={dataError} />} />
        <Route path="/projetos/:id" element={<ProjectDetail projects={projects} error={dataError} />} />
        <Route path="*" element={<HomePage about={about} projects={projects} dataError={dataError} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}