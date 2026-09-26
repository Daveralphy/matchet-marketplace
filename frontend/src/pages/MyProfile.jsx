// Created by: Brima
// Edited by: Brima

import "./MyProfile.css";
import Button from "../components/common/Button";

function MyProfile() {
  return (
    <main className="my-profile-page">
      <div className="my-profile-container">
        {/* Breadcrumb */}

        <nav className="my-profile-breadcrumb" aria-label="Breadcrumb">
          <span className="breadcrumb-home">
            🏠
            <span>Home</span>
          </span>

          <span>›</span>

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
                📷
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
                📍 Location
              </p>

              <p className="profile-bio">
                A short description about the user.
              </p>
            </div>

            <div className="profile-summary-actions">

              <div className="profile-stats">

                <div className="profile-stat">
                  <span className="profile-stat-icon">🛍</span>
                  <strong>0</strong>
                  <span>Orders</span>
                </div>

                <div className="profile-stat">
                  <span className="profile-stat-icon">▣</span>
                  <strong>0</strong>
                  <span>Bookings</span>
                </div>

                <div className="profile-stat">
                  <span className="profile-stat-icon">♡</span>
                  <strong>0</strong>
                  <span>Saved items</span>
                </div>

              </div>

              <Button
                variant="outline"
                className="profile-edit-button"
              >
                ✎&nbsp; Edit Profile
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
                <span className="profile-row-icon">♙</span>

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
                <span className="profile-row-icon">✉</span>

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
                <span className="profile-row-icon">☎</span>

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
                <span className="profile-row-icon">⌖</span>

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
                <span className="profile-row-icon">⌖</span>

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
                <span className="profile-row-icon">♧</span>

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
                <span className="profile-row-icon">◎</span>

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
                <span className="profile-row-icon">▣</span>

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
              🔒
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
              🗑
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