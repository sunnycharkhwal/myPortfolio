import {Container} from './styles';
import externalLink from '../../assets/external-link.svg';
import ScrollAnimation from 'react-animate-on-scroll';

export function Project() {
  const ProjectData = [
    {
      id: '1',
      projectTitle: 'High Push',
      projectLink:
        'https://sunnycharkhwal.github.io/WebPush.github.io/index.html',
      projectDescription:
        'High Push is a smart notification platform that lets you send real-time alerts from your custom app or website directly to users on desktop or mobile, helping you boost engagement, retention, and communication instantly.',
      techListData: [
        {
          techTitle: 'html',
        },
        {
          techTitle: 'css',
        },
        {
          techTitle: 'bootstrap',
        },
        {
          techTitle: 'jquery',
        },
        {
          techTitle: 'JavaScript',
        },
      ],
    },
  ];
  return (
    <Container id="project">
      <h2>My Projects</h2>

      <div className="projects">
        {ProjectData.map((val, i) => (
          <ScrollAnimation animateIn="flipInX" key={1}>
            <div className="project">
              <header style={{position: 'relative'}}>
                <svg
                  width="50"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#23ce6b"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <title>Folder</title>
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span
                  style={{
                    position: 'absolute',
                    top: '19px',
                    left: '22px',
                    color: '#24ce6a',
                    fontSize: '16px',
                    fontWeight: '900',
                  }}>
                  {val.id}
                </span>
                <div className="project-links">
                  <a href={val.projectLink} target="_blank" rel="noreferrer">
                    <img src={externalLink} alt="Visit site" />
                  </a>
                </div>
              </header>
              <div className="body">
                <h3>{val.projectTitle}</h3>
                <p>{val.projectDescription}</p>
              </div>
              <footer>
                <ul className="tech-list">
                  {val.techListData.map((val, i) => (
                    <li key={i} style={{textTransform: 'capitalize'}}>
                      {val.techTitle}
                    </li>
                  ))}
                </ul>
              </footer>
            </div>
          </ScrollAnimation>
        ))}
      </div>
    </Container>
  );
}
