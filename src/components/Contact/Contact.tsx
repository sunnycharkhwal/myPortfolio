import {Container} from './styles';
import emailIcon from '../../assets/email-icon.svg';
import phoneIcon from '../../assets/phone-icon.svg';

export function Contact() {
  return (
    <Container id="contact">
      <header>
        <h2>Contact</h2>
        <p> Ready to bring your project to life? </p>
        <p>✨ Let’s turn your ideas into reality! ✨</p>
        <p>
          💬 Contact me today for a FREE consultation and let's get started.
        </p>
      </header>
      <div className="contacts">
        <div>
          <a href="mailto:sunny.charkhwal@gmail.com">
            <img src={emailIcon} alt="Email" style={{marginTop: '5px'}} />
          </a>
          <a href="mailto:sunny.charkhwal@gmail.com">
            sunny.charkhwal@gmail.com
          </a>
        </div>
        <div>
          <a href="tel:+919013030173">
            <img src={phoneIcon} alt="Phone No" />
          </a>
          <a href="tel:+919013030173">(+91) 9013030173</a>
        </div>
      </div>
    </Container>
  );
}
