import {Container} from './styles';
import VinayakSingh from '../../assets/d2.jpg';
import htmlIcon from '../../assets/html-icon.svg';
import cssIcon from '../../assets/css-icon.svg';
import nodeIcon from '../../assets/node-icon.svg';
import reactIcon from '../../assets/react-icon.svg';
import typescriptIcon from '../../assets/typescript-icon.svg';
import boostrapIcon from '../../assets/bootstrap-icon.svg';
import Tailwind from '../../assets/tailwind.svg';
import Material from '../../assets/Material.svg';
import GitHub from '../../assets/github.svg';
import AWS from '../../assets/AWS.svg';

import ScrollAnimation from 'react-animate-on-scroll';

export function About() {
  return (
    <Container id="about">
      <div className="about-text">
        <ScrollAnimation animateIn="fadeInLeft">
          <h2>About me</h2>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p>
            Welcome to a space built by a passionate and skilled Front-End
            Developer with over 4.5 years of hands-on experience in creating
            visually appealing, responsive, and high-performing web
            applications. I specialize in turning creative ideas into seamless
            digital experiences using modern technologies like HTML5, CSS3,
            Tailwind CSS, Material UI, JavaScript, React, and Redux (Redux
            Toolkit).
          </p>
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="fadeInLeft"
          delay={0.2 * 1000}
          style={{marginTop: '2rem', marginBottom: '2rem'}}>
          <p>
            With a strong command of Responsive Web Design, API integration, and
            AWS deployment, I focus on developing websites and applications that
            not only look stunning but also deliver smooth, user-friendly
            functionality across all devices. Every project I work on is crafted
            with precision, performance, and client satisfaction in mind.
          </p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.3 * 1000}>
          <p>
            Whether it's building an interactive web platform, a sleek business
            website, or a dynamic application, my goal is to blend clean,
            efficient code with engaging UI/UX design — ensuring that every
            digital product I create is impactful, modern, and exceeds client
            expectations.
          </p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.4 * 1000}>
          <h3>Here are my main skills:</h3>
        </ScrollAnimation>
        <div className="hard-skills">
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.13 * 1000}>
              <img src={reactIcon} alt="React" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={Tailwind} alt="Tailwind" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.12 * 1000}>
              <img src={Material} alt="Material" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.14 * 1000}>
              <img src={typescriptIcon} alt="Typescript" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.15 * 1000}>
              <img src={GitHub} alt="GitHub" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.16 * 1000}>
              <img src={nodeIcon} alt="Node" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.17 * 1000}>
              <img src={htmlIcon} alt="Html" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.18 * 1000}>
              <img src={cssIcon} alt="Css" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.19 * 1000}>
              <img src={boostrapIcon} alt="bootstrap" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.19 * 1000}>
              <img src={AWS} alt="AWS" />
            </ScrollAnimation>
          </div>
        </div>
      </div>
      <div className="about-image">
        <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
          <img src={VinayakSingh} alt="Vinayak Singh" />
        </ScrollAnimation>
      </div>
    </Container>
  );
}
