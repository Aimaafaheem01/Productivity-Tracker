import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../shared/ui/Input";
import Button from "../../../shared/ui/Button";
import { api } from "../../../lib/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const data = await api.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-4xl overflow-hidden">

        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-ocean-500 to-azure-600 text-white p-10 flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-4">Welcome back</h2>
          <p className="text-white/80 leading-relaxed">
            Stay consistent. Stay productive. One calm step at a time.
          </p>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h3 className="text-2xl font-semibold text-deep-800 mb-6">Log in</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <Input
                type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && (
              <p className="text-sm text-coral-600 bg-coral-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-5 text-sm text-deep-700/70">
            Don't have an account?{" "}
            <Link to="/signup" className="text-ocean-600 font-medium hover:text-ocean-700">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;