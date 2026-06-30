import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import api from "../services/api";

function getRegistrationErrorMessage(error) {
  if (!error.response) {
    return "Cannot connect to the backend. Make sure the API is running on port 8000.";
  }

  const detail =
    error.response.data?.detail ||
    error.response.data?.message;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || "Registration validation error")
      .join(", ");
  }

  return `Registration failed with status ${error.response.status}.`;
}

function RegisterPage() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMessage("");

    try {
      await api.post("/register", {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      setSuccessMessage(
        "Account created successfully. Redirecting to login...",
      );

      window.setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setServerError(getRegistrationErrorMessage(error));
    }
  };

  return (
    <main className="grid min-h-screen bg-[#F7F8FA] lg:grid-cols-[520px_1fr]">
      <section className="flex min-h-screen flex-col justify-between px-4 py-6 sm:px-8 lg:px-12">
        <div />

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="inline-flex rounded-xl bg-[#5D707F] px-4 py-2 font-bold text-white">
              IT Help Desk
            </div>
          </div>

          <div className="rounded-2xl border border-[#8797B2]/30 bg-white p-8 shadow-sm">
            <div className="mb-8">
              <div className="mb-5 h-2 w-16 rounded-full bg-[#66CED6]" />

              <h1 className="text-3xl font-bold text-black">
                Create account
              </h1>

              <p className="mt-2 text-[#5D707F]">
                Register for the IT Help Desk system.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#5D707F]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-[#8797B2]/50 bg-white px-4 py-3 text-black outline-none transition focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message:
                        "Name must contain at least 2 characters",
                    },
                  })}
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#5D707F]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[#8797B2]/50 bg-white px-4 py-3 text-black outline-none transition focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#5D707F]"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-[#8797B2]/50 bg-white px-4 py-3 text-black outline-none transition focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Password must contain at least 6 characters",
                    },
                  })}
                />

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#5D707F]"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter the password again"
                  className="w-full rounded-lg border border-[#8797B2]/50 bg-white px-4 py-3 text-black outline-none transition focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password ||
                      "Passwords do not match",
                  })}
                />

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {serverError && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {serverError}
                </p>
              )}

              {successMessage && (
                <p className="rounded-lg border border-[#66CED6]/40 bg-[#66CED6]/15 p-3 text-sm text-[#5D707F]">
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#66CED6] px-4 py-3 font-semibold text-black transition-colors duration-200 hover:bg-[#8797B2] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#5D707F]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#5D707F] underline decoration-[#66CED6] decoration-2 underline-offset-4 hover:text-black"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#5D707F] lg:hidden">
          © 2026 IT Help Desk. All rights reserved.
        </p>
      </section>

      <section className="hidden bg-[#5D707F] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex rounded-xl bg-[#66CED6] px-4 py-2 font-bold text-black">
            IT Help Desk
          </div>

          <div className="mt-16 max-w-xl">
            <h2 className="text-5xl font-bold leading-tight">
              Start managing IT support with a cleaner workflow.
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/75">
              Create an account, access the dashboard, track assets,
              and manage help desk tickets from one secure portal.
            </p>
          </div>
        </div>

        <p className="text-sm text-white/65">
          © 2026 IT Help Desk. All rights reserved.
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;