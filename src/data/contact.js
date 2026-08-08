import {
  SiTerraform,
  SiKubernetes,
  SiDocker,
  SiJenkins,
  SiGrafana,
  SiPrometheus,
  SiHelm,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

// Purely decorative background icons for the Contact section's hero card — kept static
// (not dashboard-managed) since they're ambient set-dressing, not real content. The
// actual contact details (email/phone/LinkedIn/GitHub/location) and the "How I Can
// Help You" service cards moved to the database — see contactSettingsApi.js/
// contactServicesApi.js and Contact.jsx/Footer.jsx/Nav.jsx's own DEFAULT_* fallbacks.
export const CONTACT_FLOATING_ICONS = [
  { Icon: SiTerraform, color: "#7B42BC", delay: 0 },
  { Icon: FaAws, color: "#FF9900", delay: 0.5 },
  { Icon: SiKubernetes, color: "#326CE5", delay: 1 },
  { Icon: SiDocker, color: "#2496ED", delay: 1.5 },
  { Icon: SiJenkins, color: "#D24939", delay: 2 },
  { Icon: SiGrafana, color: "#F46800", delay: 2.5 },
  { Icon: SiPrometheus, color: "#E6522C", delay: 3 },
  { Icon: SiHelm, color: "#0F1689", delay: 3.5 },
];
