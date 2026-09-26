// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo/matchet_logoname.png";

function UserIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.5 6 8.5 6.5L20.5 6"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.2 3.5 9.5 3a1.5 1.5 0 0 1 1.7 1l1 3a1.5 1.5 0 0 1-.5 1.6l-1.5 1.2a13.6 13.6 0 0 0 4.9 4.9l1.2-1.5a1.5 1.5 0 0 1 1.6-.5l3 1a1.5 1.5 0 0 1 1 1.7l-.5 2.3a2.5 2.5 0 0 1-2.7 2C11.2 19 5 12.8 4.2 5.3a2.5 2.5 0 0 1 3-1.8Z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M6.5 10.5V8a5.5 5.5 0 0 1 11 0v2.5" />
      <path d="M5.5 10.5h13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function EyeIcon({ hidden = false }) {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {hidden ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3 3 18 18"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.6 6.7C4.5 8.1 3 10 3 12c0 0 3.5 6.5 9 6.5 1.6 0 3-.5 4.2-1.2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.9 5.1A9.9 9.9 0 0 1 12 4.9c5.5 0 9 6.5 9 6.5-.4.7-1 1.6-1.8 2.5"
          />
        </>
      ) : (
        <>
          <path d="M3 12s3.5-6.5 9-6.5 9 6.5 9 6.5-3.5 6.5-9 6.5S3 12 3 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      )}
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M5 8h14l1 12H4L5 8Z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m12 3 8 3v5c0 4.8-3.1 8.4-8 10-4.9-1.6-8-5.2-8-10V6l8-3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M14 17a4.5 4.5 0 0 1 6.5 2" />
    </svg>
  );
}

function validate({ firstName, lastName, email, phone, password, accepted }) {
  const errors = {};

  if (!firstName.trim()) errors.firstName = "Enter your first name.";
  if (!lastName.trim()) errors.lastName = "Enter your last name.";

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone.trim()) {
    errors.phone = "Enter your phone number.";
  }

  if (!password) {
    errors.password = "Create a password.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!accepted) {
    errors.accepted = "You must agree to the Terms of Service and Privacy Policy.";
  }

  return errors;
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon,
  type = "text",
  autoComplete,
  rightElement,
  className = "",
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-[14px] font-medium tracking-[-0.01em] text-[#10183f]"
      >
        {label}
      </label>

      <div
        className={[
          "flex h-[54px] items-center rounded-[10px] border bg-white px-4 transition-colors",
          error
            ? "border-red-300"
            : "border-[#dfe3ef] focus-within:border-[#07983f]",
        ].join(" ")}
      >
        <span className="shrink-0 text-[#626c96]">{icon}</span>

        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="min-w-0 flex-1 bg-transparent px-3 text-[14px] text-[#10183f] outline-none placeholder:text-[#8b93b5]"
        />

        {rightElement}
      </div>

      {error && (
        <p className="mt-1.5 text-[12px] text-red-600">{error}</p>
      )}
    </div>
  );
}

const CreateAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const formValues = {
    firstName,
    lastName,
    email,
    phone,
    password,
    accepted,
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formValues));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(formValues);
    setErrors(validationErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      accepted: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    // Placeholder for the real registration request once the backend endpoint exists.
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] w-full max-w-[1500px] overflow-hidden rounded-[16px] border border-slate-100 bg-white shadow-[0_12px_40px_rgba(16,24,63,0.06)] lg:min-h-[calc(100vh-2.5rem)] lg:grid-cols-2">
        {/* Left inspiration panel */}
        <section className="relative hidden overflow-hidden bg-[#fbfcfb] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.84)_38%,rgba(255,255,255,0)_70%)]" />

          <div className="relative z-10 flex h-full flex-col px-10 pb-9 pt-9 xl:px-[72px]">
            <Link to="/" aria-label="Matchet home" className="w-fit">
              <img
                src={logo}
                alt="Matchet"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <div className="mt-14 max-w-[640px]">
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#07983f]">
                QUALITY PRODUCTS. TRUSTED SERVICES.
              </p>

              <h1 className="mt-5 max-w-[610px] text-[50px] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#10183f] xl:text-[58px]">
                Join a marketplace
                <br />
                built for you.
              </h1>

              <p className="mt-5 max-w-[590px] text-[17px] leading-7 text-[#747ca1]">
                Create your account to start shopping products,
                <br />
                booking services, and connecting with trusted providers
                <br />
                around you.
              </p>

              <div className="mt-6 grid max-w-[650px] grid-cols-3 gap-8">
                <div>
                  <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#e5f7eb] text-[#07983f]">
                    <BagIcon />
                  </div>
                  <h3 className="mt-3 text-[16px] font-semibold text-[#10183f]">
                    Shop Products
                  </h3>
                  <p className="mt-1 text-[13px] text-[#747ca1]">
                    Find what you need
                  </p>
                </div>

                <div>
                  <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#e7edff] text-[#3969ed]">
                    <ShieldIcon />
                  </div>
                  <h3 className="mt-3 text-[16px] font-semibold text-[#10183f]">
                    Book Services
                  </h3>
                  <p className="mt-1 text-[13px] text-[#747ca1]">
                    Trusted professionals
                  </p>
                </div>

                <div>
                  <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#fff0e9] text-[#ed5b2c]">
                    <PeopleIcon />
                  </div>
                  <h3 className="mt-3 text-[16px] font-semibold text-[#10183f]">
                    Support Local
                  </h3>
                  <p className="mt-1 text-[13px] text-[#747ca1]">
                    Real people, real impact
                  </p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[52%] overflow-hidden">
              <div className="absolute bottom-[-15%] left-[-6%] h-[74%] w-[112%] rounded-[50%] bg-[#d8d5c8] opacity-75 blur-[2px]" />
              <div className="absolute bottom-[-5%] left-[6%] h-[46%] w-[38%] rounded-[48%] bg-[#70815f] opacity-80 blur-[4px]" />
              <div className="absolute bottom-[3%] left-[31%] h-[48%] w-[39%] rounded-[10px] border-[18px] border-[#d6a36f] bg-[#c68e58] shadow-[0_15px_30px_rgba(70,48,30,0.18)]" />
              <div className="absolute bottom-[2%] left-[57%] h-[34%] w-[16%] rounded-[18px] bg-[#8c9a79] opacity-90" />
              <div className="absolute bottom-[5%] left-[60%] h-[8%] w-[13%] rounded-full bg-[#d9e0d4] opacity-90" />
              <div className="absolute bottom-[0%] left-[4%] h-[8%] w-[88%] rounded-full bg-[#b9a88d] opacity-55 blur-xl" />
            </div>

            <div className="relative z-20 mt-auto flex items-end justify-between pt-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-10 rounded-full bg-white shadow-sm" />
                  <span className="h-2.5 w-10 rounded-full bg-white/40" />
                  <span className="h-2.5 w-10 rounded-full bg-white/40" />
                </div>
                <p className="mt-4 text-[15px] font-medium text-white drop-shadow-sm">
                  Shop. Book. Support Local.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Create account panel */}
        <section className="flex min-w-0 flex-col overflow-y-auto px-6 py-6 sm:px-9 sm:py-8 lg:px-10 xl:px-14">
          <div className="flex shrink-0 justify-end text-[13px] text-[#24305f]">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="ml-2 font-semibold text-[#07983f] transition-colors hover:text-[#068936]"
            >
              Log in
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-[565px] flex-1 flex-col justify-center py-8">
            <div>
              <h2 className="text-[38px] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#10183f] sm:text-[42px]">
                Create your account
              </h2>

              <p className="mt-3 text-[16px] leading-6 text-[#747ca1]">
                Join Matchet and get started in a few simple steps.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="flex h-[58px] items-center justify-center gap-3 rounded-[10px] border border-[#dfe3ef] bg-white px-4 text-[14px] font-medium text-[#10183f] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  <span className="text-[22px] font-semibold text-[#4285f4]">G</span>
                  Continue with Google
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  className="flex h-[58px] items-center justify-center gap-3 rounded-[10px] border border-[#dfe3ef] bg-white px-4 text-[14px] font-medium text-[#10183f] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 384 512"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  Continue with Apple
                </button>
              </div>

              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[13px] text-[#747ca1]">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {formError && (
                <div
                  role="alert"
                  className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {formError}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    id="firstName"
                    label="First name"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    onBlur={() => handleBlur("firstName")}
                    error={touched.firstName ? errors.firstName : undefined}
                    icon={<UserIcon />}
                    autoComplete="given-name"
                  />

                  <Field
                    id="lastName"
                    label="Last name"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    onBlur={() => handleBlur("lastName")}
                    error={touched.lastName ? errors.lastName : undefined}
                    icon={<UserIcon />}
                    autoComplete="family-name"
                  />
                </div>

                <Field
                  id="email"
                  label="Email address"
                  placeholder="Enter your email address"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onBlur={() => handleBlur("email")}
                  error={touched.email ? errors.email : undefined}
                  icon={<MailIcon />}
                  autoComplete="email"
                />

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[14px] font-medium tracking-[-0.01em] text-[#10183f]"
                  >
                    Phone number
                  </label>

                  <div
                    className={[
                      "flex h-[54px] rounded-[10px] border bg-white transition-colors",
                      touched.phone && errors.phone
                        ? "border-red-300"
                        : "border-[#dfe3ef] focus-within:border-[#07983f]",
                    ].join(" ")}
                  >
                    <div className="flex shrink-0 items-center gap-2 border-r border-[#e4e7ef] px-3">
                      <PhoneIcon />
                      <span className="text-[16px]" aria-hidden="true">
                        🇳🇬
                      </span>
                      <select
                        value={countryCode}
                        onChange={(event) => setCountryCode(event.target.value)}
                        className="bg-transparent text-[14px] text-[#24305f] outline-none"
                        aria-label="Country code"
                      >
                        <option value="+234">+234</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                    </div>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      onBlur={() => handleBlur("phone")}
                      className="min-w-0 flex-1 bg-transparent px-3 text-[14px] text-[#10183f] outline-none placeholder:text-[#8b93b5]"
                    />
                  </div>

                  {touched.phone && errors.phone && (
                    <p className="mt-1.5 text-[12px] text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <Field
                  id="password"
                  label="Password"
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onBlur={() => handleBlur("password")}
                  error={touched.password ? errors.password : undefined}
                  icon={<LockIcon />}
                  autoComplete="new-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="shrink-0 text-[#747ca1] transition-colors hover:text-[#10183f]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <EyeIcon hidden={showPassword} />
                    </button>
                  }
                />

                <p className="mt-[-8px] text-[12px] leading-5 text-[#747ca1]">
                  Use at least 8 characters with a mix of letters, numbers, and symbols.
                </p>

                <div>
                  <label className="flex items-start gap-3 text-[13px] leading-5 text-[#4d5680]">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(event) => setAccepted(event.target.checked)}
                      onBlur={() => handleBlur("accepted")}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 accent-[#07983f] focus:ring-[#07983f]"
                    />

                    <span>
                      I agree to Matchet&apos;s{" "}
                      <Link
                        to="/terms"
                        className="font-medium text-[#07983f] hover:text-[#068936]"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="font-medium text-[#07983f] hover:text-[#068936]"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  {touched.accepted && errors.accepted && (
                    <p className="mt-1.5 text-[12px] text-red-600">
                      {errors.accepted}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 flex h-[58px] w-full items-center justify-center gap-4 rounded-[10px] bg-[#07983f] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#068936] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
                  {!isSubmitting && <ArrowRightIcon />}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateAccount;
