import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import { loginUser, saveToken } from "../services/auth";

function getErrorMessage(error) {
  const detail = error.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || "Login validation error")
      .join(", ");
  }

  return "Unable to log in. Please try again.";
}

function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const result = await loginUser({
        email: data.email.trim(),
        password: data.password,
      });

      saveToken(result.access_token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <main className="grid min-h-screen bg-[#F7F8FA] lg:grid-cols-[1fr_520px]">
      <section className="hidden bg-[#5D707F] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex rounded-xl bg-[#66CED6] px-4 py-2 font-bold text-black">
            IT Help Desk
          </div>

          <div className="mt-16 max-w-xl">
            <h1 className="text-5xl font-bold leading-tight">
              Manage assets and support requests in one place.
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/75">
              Track company equipment, create help desk tickets,
              and monitor your IT operations from a single portal.
            </p>
          </div>
        </div>

        <p className="text-sm text-white/65">
          © 2026 IT Help Desk. All rights reserved.
        </p>
      </section>

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
                Welcome back
              </h1>

              <p className="mt-2 text-[#5D707F]">
                Sign in to the IT Help Desk system.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-[#8797B2]/50 bg-white px-4 py-3 text-black outline-none transition focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {serverError && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#66CED6] px-4 py-3 font-semibold text-black transition-colors duration-200 hover:bg-[#8797B2] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#5D707F]">
              Do not have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#5D707F] underline decoration-[#66CED6] decoration-2 underline-offset-4 hover:text-black"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#5D707F] lg:hidden">
          © 2026 IT Help Desk. All rights reserved.
        </p>
      </section>
    </main>
  );
}

export default LoginPage;