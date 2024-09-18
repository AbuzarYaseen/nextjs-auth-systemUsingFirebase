"use client";
import { useState } from "react";
import { auth } from "../../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const router = useRouter();

  const handleGitHugLogin = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        console.log("github successfully login: ", user);
        setSuccess("Login successful");
        setError("");
        router.push("/home");
      })
      .catch((error) => {
        console.log(error);
        setError("Error logging in: " + error.message);
        setSuccess("");
      });
  };
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        setSuccess("Login successful");
        setError("");
        router.push("/home");
      })
      .catch((error) => {
        setError("Error logging in: " + error.message);
        setSuccess("");
      });

    // try {
    //   const result = await signInWithPopup(auth, provider);
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   const credential = GoogleAuthProvider.credentialFromResult(result);
    //   const token = credential.accessToken;
    //   // The signed-in user info.
    //   const user = result.user;
    //   console.log("User info:", user);
    //   setSuccess("Login successful");
    //   setError("");
    // } catch (err) {
    //   setError("Error logging in: " + err.message);
    //   setSuccess("");
    // }
  };

  const handlePasswordReset = () => {
    const { email } = formValues;
    if (!email) {
      setError("Please enter your email first");
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess("Password reset email sent. Check your inbox.");
        setError("");
      })
      .catch((error) => {
        setError("Error sending password reset email: " + error.message);
        setSuccess("");
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formValues;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user.emailVerified) {
        console.log("User logged in:", userCredential.user);
        setSuccess("Login successful");
        router.push("/home");
      } else {
        setError(
          "Email not verified. Please check your email and verify first"
        );
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="font-extrabold text-[25px] italic">Login</h1>
      <div className="sm:w-1/3 flex flex-col items-center mt-7">
        <button
          onClick={handleGoogleLogin}
          className="p-2 px-4 border-2 rounded-xl font-extrabold h-12 shadow-lg mb-4 focus:outline-none bg-white  italic "
        >
          Login with Google
        </button>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button
          onClick={handleGitHugLogin}
          className="p-2 px-4 border-2 rounded-xl font-extrabold h-12 shadow-lg mb-4 focus:outline-none bg-white  italic "
        >
          Login with GitHub
        </button>
      </div>
      <span className="font-bold italic">Or</span>
      <div className="flex flex-col items-center sm:w-3/4">
        <form className="flex flex-col sm:w-1/2" onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className="border-2 rounded-xl mb-4 p-2 border-gray-300"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            className="border-2 rounded-xl mb-4 p-2 border-gray-300"
          />
          <a
            onClick={handlePasswordReset}
            className="text-[14px] text-red-500 font-bold cursor-pointer"
          >
            Forget Password?
          </a>
          <button
            type="submit"
            className="p-2 border-2 rounded-xl font-extrabold h-12 shadow-lg mb-4 focus:outline-none bg-white"
          >
            Login
          </button>
        </form>
        <p className="text-[14px]">
          Don't have an account?{" "}
          <a className="font-semibold" href="/signup">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
