import { useNavigate } from "react-router-dom";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";
import "../styles/provider-onboarding.css";

function Icon({ name }) {
  const paths = {
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3.5v4M16.5 3.5v4M3.5 9h17" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 10v6M12 7h.01" /></>,
  };
  return <svg className="provider-success-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function ProviderSignupPageEight() {
  const navigate = useNavigate();

  return (
    <div className="provider-signup-page-container provider-signup-page8">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page8">
          <img src={sideImage} alt="Thanks for joining as a provider" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={5} />

        <div className="provider-signup-form-page8">
          <div className="provider-success-hero">
            <div className="provider-success-check">✓</div>
            <h1>Application submitted!</h1>
            <p>Thank you for applying to become a provider on Matchet.<br />Your application has been received and is now under review.</p>
          </div>

          <div className="provider-success-next-card">
            <div className="provider-success-next-item">
              <div className="provider-success-round-icon provider-success-round-icon-clock"><Icon name="clock" /></div>
              <h3>What happens next?</h3>
              <p>Our team will review your information, documents, and services to ensure they meet our provider standards.</p>
            </div>

            <div className="provider-success-next-item">
              <div className="provider-success-round-icon provider-success-round-icon-calendar"><Icon name="calendar" /></div>
              <h3>Review time</h3>
              <p>This usually takes<br />1–3 business days.<br />We will notify you by email and in-app once a decision has been made.</p>
            </div>

            <div className="provider-success-next-item">
              <div className="provider-success-round-icon provider-success-round-icon-mail"><Icon name="mail" /></div>
              <h3>You'll get an update</h3>
              <p>We will let you know if your application is approved or if we need any additional information from you.</p>
            </div>
          </div>

          <div className="provider-success-status-card">
            <div className="provider-success-status-icon"><Icon name="info" /></div>
            <div>
              <strong>In the meantime</strong>
              <p>You can track the status of your application from your account. If we need any additional information, you can easily provide it there.</p>
              <button type="button" onClick={() => navigate("/provider/application-status")}>View application status&nbsp;&nbsp;→</button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
