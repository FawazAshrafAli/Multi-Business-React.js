import { useState } from "react";
import { login } from "/lib/api/auth";
import { useRouter } from "next/router";

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login({ username: email, password });
      if (res) {
        onLoginSuccess();
        router.push(0);
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="p-2">
      <form onSubmit={handleSubmit} className="login-form" style={{maxWidth: "320px"}}>
      <h5 className="text-dark">Login To Post Review</h5>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required            
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button
        className="btn btn-sm btn-primary rounded-0 py-1"
        type="submit"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
      </form>
    </div>
    </>    
  );
};

export default LoginForm;
