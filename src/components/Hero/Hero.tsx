import {BrowserRouter} from 'react-router-dom';
import {Container} from './styles';
import ScrollAnimation from 'react-animate-on-scroll';
import Illustration from '../../assets/illustration.svg';
import {NavHashLink} from 'react-router-hash-link';
import linkedin from '../../assets/linkedin.svg';
import githubIcon from '../../assets/github.svg';
import whatsapp from '../../assets/whatsapp.svg';
import Hello from '../../assets/Hello.gif';
import Instagram from '../../assets/instagram.svg';
export function Hero() {
  return (
    <Container id="home">
      <div className="hero-text">
        <ScrollAnimation animateIn="fadeInUp">
          <p>
            Hello <img src={Hello} alt="Hello" width="20px" />, I'm
          </p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInUp" delay={0.2 * 1000}>
          <h1>Sunny Charkhwal</h1>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInUp" delay={0.4 * 1000}>
          <h3>Front-End Developer | React.js & Modern Web Development</h3>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInUp" delay={0.6 * 1000}>
          <p className="small-resume">4.6+ Years of Industry Experience</p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInUp" delay={0.8 * 1000}>
          <BrowserRouter>
            <NavHashLink smooth to="#contact" className="button">
              Contact
            </NavHashLink>
          </BrowserRouter>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInUp" delay={1 * 1000}>
          <div className="social-media">
            <a
              href="https://www.linkedin.com/in/sunnycharkhwal/"
              target="_blank"
              rel="noreferrer">
              <img src={linkedin} alt="Linkedin" />
            </a>
            <a
              href="https://github.com/sunnycharkhwal"
              target="_blank"
              rel="noreferrer">
              <img src={githubIcon} alt="GitHub" />
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=%2B919013030173&text&type=phone_number&app_absent=0&wame_ctl=1"
              target="_blank"
              rel="noreferrer">
              <img src={whatsapp} alt="Whatsapp" />
            </a>
            <a
              href="https://www.instagram.com/hacking_hunter/"
              target="_blank"
              rel="noreferrer">
              <img src={Instagram} alt="telegram" />
            </a>
          </div>
        </ScrollAnimation>
      </div>
      <div className="hero-image">
        <ScrollAnimation animateIn="fadeInRight" delay={1 * 1000}>
          <img src={Illustration} alt="Ilustração" />
        </ScrollAnimation>
      </div>
    </Container>
  );
}
