// Created by: Brigham
// Edited by: Brigham
import { useEffect, useRef, useState } from "react";
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingSection, setEditingSection] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/me",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile.");
        }

        setUser(data.user);
      } catch (err) {
        setError(err.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleProfilePictureChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = async () => {
        const uploadResponse = await fetch(
          "http://localhost:5000/api/uploads",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              file: {
                name: file.name,
                folder: "matchet/profiles",
                dataUrl: reader.result,
              },
            }),
          }
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.message || "Unable to upload profile picture."
          );
        }

        const uploadedFile = uploadData.files?.[0];

        if (!uploadedFile) {
          throw new Error("The uploaded profile picture was not returned.");
        }

        const profileResponse = await fetch(
          "http://localhost:5000/api/users/me",
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              avatar: {
                url: uploadedFile.url,
                publicId: uploadedFile.publicId,
              },
            }),
          }
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message || "Unable to save profile picture."
          );
        }

        setUser(profileData.user);

        console.log("Profile picture saved:", profileData.user.avatar);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Profile picture error:", err);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    setSaveError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/me",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            phone: user.phone,
            location: user.location,
            preferences: user.preferences,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile.");
      }

      setUser(data.user);
      setEditing(false);
      setEditingSection("");
    } catch (err) {
      setSaveError(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  function openEditProfile(section) {
    setSaveError("");
    setEditingSection(section);
    setEditing(true);
  }

  function closeEditProfile() {
    setSaveError("");
    setEditing(false);
    setEditingSection("");
  }

  if (loading) {
    return (
      <main className="my-profile-page">
        <div className="my-profile-container">
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-profile-page">
        <div className="my-profile-container">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const location = [
    user.location?.city,
    user.location?.state,
    user.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const initial = user.firstName?.charAt(0)?.toUpperCase() || "U";

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
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={`${fullName}'s profile`}
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
              <button
                type="button"
                className="profile-camera-button"
                aria-label="Change profile picture"
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraIcon />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={handleProfilePictureChange}
              />
            </div>

            <div className="profile-summary-details">
              <h2>{fullName || "User Name"}</h2>

              <p className="profile-username">
                @{user.username || "username"}
              </p>

              <p>{user.email || "user@example.com"}</p>

              <p>{user.phone || "Phone number not set"}</p>

              <p className="profile-location">
                <MapPinIcon />
                <span>{location || "Location not set"}</span>
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
                onClick={() => openEditProfile("profile")}
              >
                <PencilIcon />
                <span>Edit Profile</span>
              </Button>

            </div>
          </div>
        </section>

        {/* Edit Profile */}

        {editing && (
          <div className="profile-edit-form">

            <h2>
              {editingSection === "profile" && "Edit Profile"}
              {editingSection === "name" && "Edit Full Name"}
              {editingSection === "email" && "Edit Email Address"}
              {editingSection === "phone" && "Edit Phone Number"}
              {editingSection === "location" && "Edit Location"}
              {editingSection === "preferred-location" &&
                "Edit Preferred Location"}
              {editingSection === "notifications" && "Edit Notifications"}
              {editingSection === "language" && "Edit Language"}
              {editingSection === "payment" &&
                "Edit Preferred Payment Method"}
            </h2>

            <div className="profile-edit-form-fields">

              {/* Complete profile */}

              {editingSection === "profile" && (
                <>
                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-full-first-name">
                      First name
                    </label>

                    <input
                      id="profile-full-first-name"
                      type="text"
                      value={user.firstName || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-full-last-name">
                      Last name
                    </label>

                    <input
                      id="profile-full-last-name"
                      type="text"
                      value={user.lastName || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-full-email">
                      Email address
                    </label>

                    <input
                      id="profile-full-email"
                      type="email"
                      value={user.email || ""}
                      readOnly
                    />

                    <small>
                      Email changes are not available yet.
                    </small>
                  </div>

                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-full-phone">
                      Phone number
                    </label>

                    <input
                      id="profile-full-phone"
                      type="text"
                      value={user.phone || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-full-city">
                      City
                    </label>

                    <input
                      id="profile-full-city"
                      type="text"
                      value={user.location?.city || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          location: {
                            ...user.location,
                            city: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-full-state">
                      State
                    </label>

                    <input
                      id="profile-full-state"
                      type="text"
                      value={user.location?.state || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          location: {
                            ...user.location,
                            state: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-full-country">
                      Country
                    </label>

                    <input
                      id="profile-full-country"
                      type="text"
                      value={user.location?.country || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          location: {
                            ...user.location,
                            country: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {/* Full name */}

              {editingSection === "name" && (
                <>
                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-first-name">
                      First name
                    </label>

                    <input
                      id="profile-first-name"
                      type="text"
                      value={user.firstName || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-last-name">
                      Last name
                    </label>

                    <input
                      id="profile-last-name"
                      type="text"
                      value={user.lastName || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {/* Email */}

              {editingSection === "email" && (
                <div className="profile-edit-form-field">
                  <label htmlFor="profile-email">
                    Email address
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    value={user.email || ""}
                    readOnly
                  />

                  <small>
                    Email changes are not available yet.
                  </small>
                </div>
              )}

              {/* Phone */}

              {editingSection === "phone" && (
                <div className="profile-edit-form-field">
                  <label htmlFor="profile-phone">
                    Phone number
                  </label>

                  <input
                    id="profile-phone"
                    type="text"
                    value={user.phone || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* Location */}

              {(editingSection === "location" ||
                editingSection === "preferred-location") && (
                <>
                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-city">
                      City
                    </label>

                    <input
                      id="profile-city"
                      type="text"
                      value={user.location?.city || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          location: {
                            ...user.location,
                            city: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-state">
                      State
                    </label>

                    <input
                      id="profile-state"
                      type="text"
                      value={user.location?.state || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          location: {
                            ...user.location,
                            state: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="profile-edit-form-field">
                    <label htmlFor="profile-country">
                      Country
                    </label>

                    <input
                      id="profile-country"
                      type="text"
                      value={user.location?.country || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          location: {
                            ...user.location,
                            country: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {/* Notifications */}

              {editingSection === "notifications" && (
                <div className="profile-edit-form-field">
                  <label htmlFor="profile-notifications">
                    Notifications
                  </label>

                  <select
                    id="profile-notifications"
                    value={
                      user.preferences?.notifications ||
                      "Email and in-app"
                    }
                    onChange={(e) =>
                      setUser({
                        ...user,
                        preferences: {
                          ...user.preferences,
                          notifications: e.target.value,
                        },
                      })
                    }
                  >
                    <option>Email and in-app</option>
                    <option>Email only</option>
                    <option>In-app only</option>
                    <option>None</option>
                  </select>
                </div>
              )}

              {/* Language */}

              {editingSection === "language" && (
                <div className="profile-edit-form-field">
                  <label htmlFor="profile-language">
                    Language
                  </label>

                  <select
                    id="profile-language"
                    value={user.preferences?.language || "English"}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        preferences: {
                          ...user.preferences,
                          language: e.target.value,
                        },
                      })
                    }
                  >
                    <option>English</option>
                  </select>
                </div>
              )}

              {/* Payment */}

              {editingSection === "payment" && (
                <div className="profile-edit-form-field">
                  <label htmlFor="profile-payment">
                    Preferred payment method
                  </label>

                  <select
                    id="profile-payment"
                    value={
                      user.preferences?.paymentMethod || "Not set"
                    }
                    onChange={(e) =>
                      setUser({
                        ...user,
                        preferences: {
                          ...user.preferences,
                          paymentMethod: e.target.value,
                        },
                      })
                    }
                  >
                    <option>Not set</option>
                    <option>Mobile Money</option>
                    <option>Bank Card</option>
                  </select>
                </div>
              )}

            </div>

            {saveError && (
              <p className="profile-edit-error">
                {saveError}
              </p>
            )}

            <div className="profile-edit-form-actions">

              <button
                type="button"
                className="profile-edit-cancel-button"
                onClick={closeEditProfile}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="profile-edit-save-button"
                onClick={handleSaveProfile}
                disabled={
                  saving ||
                  editingSection === "email"
                }
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>
          </div>
        )}

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
                    {fullName || "User Name"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditProfile("name")}
              >
                Edit
              </button>

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
                    {user.email || "user@example.com"}

                    <span className="profile-verified">
                      Verified
                    </span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditProfile("email")}
              >
                Edit
              </button>

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
                    {user.phone || "Phone number not set"}

                    {user.phone && (
                      <span className="profile-verified">
                        Verified
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditProfile("phone")}
              >
                Edit
              </button>

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
                    {location || "Location not set"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditProfile("location")}
              >
                Edit
              </button>

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
                    {location || "Location not set"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditProfile("preferred-location")}
              >
                Edit
              </button>

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
                    {user.preferences?.notifications ||
                      "Email and in-app"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditProfile("notifications")}
              >
                Edit
              </button>

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
                    {user.preferences?.language || "English"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditProfile("language")}
              >
                Edit
              </button>

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
                    {user.preferences?.paymentMethod || "Not set"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditProfile("payment")}
              >
                Edit
              </button>

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
              <ChevronRightIcon />
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
              <ChevronRightIcon />
            </span>
          </button>

        </div>

      </div>
    </main>
  );
}

export default MyProfile;