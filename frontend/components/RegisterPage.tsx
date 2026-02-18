import React, { useState } from "react";
import { Bike, ArrowLeft } from "lucide-react";

interface RegisterPageProps {
  onBack: () => void;
  onLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onLogin }) => {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    age: "",
    gender: "Male",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.map((err: any) => err.msg).join(", "));
        } else {
          setError(data.error || "Registration failed");
        }
        setLoading(false);
        return;
      }

      // save token
      localStorage.setItem("token", data.token);

      setSuccess("Account created successfully 🎉");

      setTimeout(() => {
        onLogin(); // redirect to login page
      }, 1500);
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="flex items-center text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 mb-6">
          <Bike className="h-10 w-10 text-green-600" />
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            GreenBike
          </h2>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="nom"
                type="text"
                required
                value={form.nom}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md"
                placeholder="John Doe"
              />
            </div>

            {/* email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md"
                placeholder="you@example.com"
              />
            </div>

            {/* password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md"
                placeholder="••••••"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  name="age"
                  type="number"
                  required
                  min="12"
                  value={form.age}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  required
                  value={form.gender}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* error */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* success */}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}

            {/* button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={onLogin}
              className="text-green-600 font-medium hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
