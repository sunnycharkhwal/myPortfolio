import {Container} from './styles';
import externalLink from '../../assets/external-link.svg';
import ScrollAnimation from 'react-animate-on-scroll';

export const Project = () => {
  const ProjectData = [
    {
      projectTitle: 'template for developers',
      projectLink:
        'https://684c1bafbce3a5298f343f14--polite-meringue-ca28e0.netlify.app/',
      projectDescription:
        'This project is built using React and is fully responsive, ensuring seamless performance across all devices. It features dynamic components, clean UI, and modern design for an optimal user experience.',
      techListData: ['React js', 'scss', 'Ant Design', 'redux', 'JavaScript'],
    },
    {
      projectTitle: 'Auto part wala',
      projectLink: 'https://poetic-chaja-46b667.netlify.app/',
      projectDescription:
        'This React.js-based auto parts website was developed as a freelance project, featuring a responsive design, dynamic product listings, and seamless navigation to enhance user experience and streamline online purchases.',
      techListData: ['React js', 'scss', 'bootstrap', 'redux', 'JavaScript'],
    },
    {
      projectTitle: 'Adyansh Solutions',
      projectLink: 'https://adyanshsolutions.com/',
      projectDescription:
        'This website showcases my freelancing expertise, crafted with passion for the Green Industry Business. From innovative solutions to sustainable strategies, I help businesses thrive with my skills, creativity, and commitment to excellence.',
      techListData: ['html', 'css', 'bootstrap', 'jquery', 'JavaScript'],
    },
    {
      projectTitle: 'High Push',
      projectLink:
        'https://sunnycharkhwal.github.io/WebPush.github.io/index.html',
      projectDescription:
        'High Push is a smart notification platform that lets you send real-time alerts from your custom app or website directly to users on desktop or mobile, helping you boost engagement, retention, and communication instantly.',
      techListData: ['html', 'css', 'bootstrap', 'jquery', 'JavaScript'],
    },
    {
      projectTitle: 'Massman Cyber Geeks',
      projectLink: 'https://sunnycharkhwal.github.io/Messman.github.io/',
      projectDescription:
        'Our digital agency transforms ideas into stunning digital experiences. From web design to branding and marketing, we craft innovative solutions that elevate your brand, drive engagement, and deliver measurable success in the digital world.',
      techListData: ['html', 'css', 'bootstrap', 'jquery', 'JavaScript'],
    },
    {
      projectTitle: 'Logo Design',
      projectLink: 'https://sunnycharkhwal.github.io/logo.github.io/',
      projectDescription:
        'Our platform offers high-quality, professional logos tailored to your brand. Whether you need a sleek, modern, or creative design, we provide stunning logos instantly, helping you build a strong and memorable brand identity effortlessly.',
      techListData: ['html', 'css', 'bootstrap', 'jquery', 'JavaScript'],
    },
    {
      projectTitle: 'Atrophy',
      projectLink:
        'https://sunnycharkhwal.github.io/Astrophy.github.io/index.html',
      projectDescription:
        'Atrophy is your trusted online destination for accurate horoscopes and solutions to all religious and spiritual concerns. Get personalized guidance, astrological insights, and remedies to bring peace, positivity, and balance to your life.',
      techListData: ['html', 'css', 'bootstrap', 'jquery', 'JavaScript'],
    },
    {
      projectTitle: 'Mountain Bike Race',
      projectLink:
        'https://sunnycharkhwal.github.io/racing.github.io/#section_a',
      projectDescription:
        'Our Mountain Bike Race website connects adventure enthusiasts with thrilling trail rides. Explore scenic, safe, and well-designed biking paths, get expert guidance, and join our community to experience the ultimate mountain biking adventure with us!',
      techListData: ['html', 'css', 'bootstrap', 'jquery', 'JavaScript'],
    },
    {
      projectTitle: 'Tattoos Website',
      projectLink: 'https://sunnycharkhwal.github.io/tattoos.githube.io/',
      projectDescription:
        'Our tattoo design platform lets you create and explore stunning tattoo ideas online. Whether you seek custom artwork or inspiration, we help you design and get the perfect tattoo that reflects your unique style.',
      techListData: ['html', 'css', 'bootstrap', 'jquery', 'JavaScript'],
    },
    {
      projectTitle: 'Crypto Byte Website',
      projectLink: 'https://sunnycharkhwal.github.io/Bitcoin2.github.io/',
      projectDescription:
        'Our platform is your gateway to smart crypto investments and real-time market insights. Stay informed with expert analysis, track trends, and make confident investment decisions in the ever-evolving world of cryptocurrency.',
      techListData: ['html', 'css', 'bootstrap', 'jquery', 'JavaScript'],
    },
  ];

  return (
    <Container id="project">
      <h2>My Projects</h2>

      <div className="projects">
        {ProjectData.map((val, index) => (
          <ScrollAnimation animateIn="flipInX" key={index}>
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
                  {index + 1}
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
                  {val.techListData.map((tech, i) => (
                    <li key={i} style={{textTransform: 'capitalize'}}>
                      {tech}
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
};
