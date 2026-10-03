// Created by: Brigham
// Edited by: Brigham

import "./MyProfile.css";
import Button from "../components/common/Button";

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 4h-4l-2 3H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2-3Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 8.6c0 5.4-8.8 10.4-8.8 10.4S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function MyProfile() {
  return (
    <main className="my-profile-page">
      <div className="my-profile-container">

        {/* Breadcrumb */}

        <nav className="my-profile-breadcrumb" aria-label="Breadcrumb">
          <span className="breadcrumb-home">
            <HomeIcon />
            <span>Home</span>
          </span>

          <ChevronRightIcon />

          <span>My Profile</span>
        </nav>

        {/* Page heading */}

        <header className="my-profile-header">
          <h1>My Profile</h1>
          <p>View and manage your personal information.</p>
        </header>

        {/* Profile summary */}

        <section className="profile-summary-card">
          <div className="profile-summary-content">

            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <span>U</span>
              </div>

              <button
                type="button"
                className="profile-camera-button"
                aria-label="Change profile picture"
              >
                <CameraIcon />
              </button>
            </div>

            <div className="profile-summary-details">
              <h2>User Name</h2>

              <p className="profile-username">
                @username
              </p>

              <p>user@example.com</p>

              <p>+000 000 000 000</p>

              <p className="profile-location">
                <MapPinIcon />
                <span>Location</span>
              </p>

              <p className="profile-bio">
                A short description about the user.
              </p>
            </div>

            <div className="profile-summary-actions">

              <div className="profile-stats">

                <div className="profile-stat">
                  <span className="profile-stat-icon">
                    <ShoppingBagIcon />
                  </span>
                  <strong>0</strong>
                  <span>Orders</span>
                </div>

                <div className="profile-stat">
                  <span className="profile-stat-icon">
                    <CalendarIcon />
                  </span>
                  <strong>0</strong>
                  <span>Bookings</span>
                </div>

                <div className="profile-stat">
                  <span className="profile-stat-icon">
                    <HeartIcon />
                  </span>
                  <strong>0</strong>
                  <span>Saved items</span>
                </div>

              </div>

              <Button
                variant="outline"
                className="profile-edit-button"
              >
                <PencilIcon />
                <span>Edit Profile</span>
              </Button>

            </div>
          </div>
        </section>

        {/* Personal Information */}

        <section className="profile-section">

          <div className="profile-section-header">
            <h2>Personal Information</h2>
            <p>Your basic account information.</p>
          </div>

          <div className="profile-information-list">

            <div className="profile-information-row">

              <div className="profile-information-main">
                <span className="profile-row-icon">
                  <UserIcon />
                </span>

                <div>
                  <span className="profile-information-label">
                    Full name
                  </span>

                  <span className="profile-information-value">
                    User Name
                  </span>
                </div>
              </div>

              <button type="button">Edit</button>

            </div>

            <div className="profile-information-row">

              <div className="profile-information-main">
                <span className="profile-row-icon">
                  <MailIcon />
                </span>

                <div>
                  <span className="profile-information-label">
                    Email address
                  </span>

                  <span className="profile-information-value">
                    user@example.com

                    <span className="profile-verified">
                      Verified
                    </span>
                  </span>
                </div>
              </div>

              <button type="button">Edit</button>

            </div>

            <div className="profile-information-row">

              <div className="profile-information-main">
                <span className="profile-row-icon">
                  <PhoneIcon />
                </span>

                <div>
                  <span className="profile-information-label">
                    Phone number
                  </span>

                  <span className="profile-information-value">
                    +000 000 000 000

                    <span className="profile-verified">
                      Verified
                    </span>
                  </span>
                </div>
              </div>

              <button type="button">Edit</button>

            </div>

            <div className="profile-information-row">

              <div className="profile-information-main">
                <span className="profile-row-icon">
                  <MapPinIcon />
                </span>

                <div>
                  <span className="profile-information-label">
                    Location
                  </span>

                  <span className="profile-information-value">
                    Location
                  </span>
                </div>
              </div>

              <button type="button">Edit</button>

            </div>

          </div>
        </section>

        {/* Preferences */}

        <section className="profile-section">

          <div className="profile-section-header">
            <h2>Preferences</h2>
            <p>Manage your preferences and default settings.</p>
          </div>

          <div className="profile-information-list">

            <div className="profile-information-row">

              <div className="profile-information-main">
                <span className="profile-row-icon">
                  <MapPinIcon />
                </span>

                <div>
                  <span className="profile-information-label">
                    Preferred location
                  </span>

                  <span className="profile-information-value">
                    Location
                  </span>
                </div>
              </div>

              <button type="button">Edit</button>

            </div>

            <div className="profile-information-row">

              <div className="profile-information-main">
                <span className="profile-row-icon">
                  <BellIcon />
                </span>

                <div>
                  <span className="profile-information-label">
                    Notifications
                  </span>

                  <span className="profile-information-value">
                    Email and in-app
                  </span>
                </div>
              </div>

              <button type="button">Edit</button>

            </div>

            <div className="profile-information-row">

              <div className="profile-information-main">
                <span className="profile-row-icon">
                  <GlobeIcon />
                </span>

                <div>
                  <span className="profile-information-label">
                    Language
                  </span>

                  <span className="profile-information-value">
                    English
                  </span>
                </div>
              </div>

              <button type="button">Edit</button>

            </div>

            <div className="profile-information-row">

              <div className="profile-information-main">
                <span className="profile-row-icon">
                  <CreditCardIcon />
                </span>

                <div>
                  <span className="profile-information-label">
                    Preferred payment method
                  </span>

                  <span className="profile-information-value">
                    Not set
                  </span>
                </div>
              </div>

              <button type="button">Edit</button>

            </div>

          </div>
        </section>

        {/* Account actions */}

        <div className="profile-account-actions">

          <button
            type="button"
            className="profile-account-card"
          >
            <span className="profile-account-icon security-icon">
              <LockIcon />
            </span>

            <span className="profile-account-text">
              <strong>Account security</strong>
              <small>Keep your account safe and secure.</small>
            </span>

            <span className="profile-account-arrow">
              ›
            </span>
          </button>

          <button
            type="button"
            className="profile-account-card"
          >
            <span className="profile-account-icon delete-icon">
              <TrashIcon />
            </span>

            <span className="profile-account-text">
              <strong>Delete account</strong>
              <small>
                Permanently delete your account and all associated data.
              </small>
            </span>

            <span className="profile-account-arrow">
              ›
            </span>
          </button>

        </div>

      </div>
    </main>
  );
}

export default MyProfile;