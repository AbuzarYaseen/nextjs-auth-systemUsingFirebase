"use client";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    password: "",
  });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, password, firstName, lastName, number } = formValues;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up:", userCredential);

      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      setSuccess(
        "Signup successful! Please check your email to verify your account."
      );
      console.log(
        "Signup successful! Please check your email to verify your account."
      );
      setTimeout(() => {
        router.push("/login");
      }, 5000);
      // Save additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        number: number,
        pass: password,
      });
      console.log("data saved to db");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="font-extrabold text-[25px] italic">Sign Up</h1>
      <div className="flex flex-col items-center sm:w-3/4">
        <form className="flex flex-col sm:w-1/2" onSubmit={handleSignup}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            className="border-2 rounded-xl mb-4 p-2 border-gray-300"
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            className="border-2 rounded-xl mb-4 p-2 border-gray-300"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className="border-2 rounded-xl mb-4 p-2 border-gray-300"
          />
          <label htmlFor="number">Phone Number</label>
          <input
            type="text"
            name="number"
            value={formValues.number}
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
          <button
            type="submit"
            className="p-2 border-2 rounded-xl font-extrabold h-12 shadow-lg mb-4 focus:outline-none bg-white"
          >
            Sign Up
          </button>
          {success && <p className="text-green-600">{success}</p>}
        </form>
      </div>
      <p className="text-[14px]">
        Already have an account?{" "}
        <a className="font-semibold" href="/login">
          Login here
        </a>
      </p>
    </div>
  );
};

export default Signup;
