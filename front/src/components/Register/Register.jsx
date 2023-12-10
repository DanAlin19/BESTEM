import { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Login() {
  const [password, setPassword] = useState("");
  const history = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmitToServer = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      try {
        // Make an API request to your registration endpoint using fetch
        const email = e.target.email.value;
        const password = e.target.password.value;
        const response = await fetch("http://207.154.232.144:5001/register_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        // Handle the response (success or failure) as needed
        const data = await response.json();
        if (data.message === "success") {
          // Registration was successful
          // Redirect to login page
          history('/login');
        } else {
          // Registration was not successful
          setError("Registration failed. Please try again.");
        }
      } catch (error) {
        setError("Registration failed. Please try again.");
        console.error(error);
      }
    }
    e.target.reset
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-teal-500"
        >
          <FaShieldAlt className="w-8 h-8 mr-2" />
          GuardVPN
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-teal-500 md:text-2xl">
              Create and account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action="#"
              onSubmit={handleSubmitToServer}
            >
              <div>
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-teal-500"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-teal-500 sm:text-sm rounded-lg focus:ring-pribluemary-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  required=""
                />
              </div>
              <div>
                <label
                  for="password"
                  className="block mb-2 text-sm font-medium text-teal-500"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-teal-500 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  pattern="/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/"
                  required=""
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <label
                  for="confirm-password"
                  className="block mb-2 text-sm font-medium text-teal-500"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-teal-500 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  pattern="/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/"
                  required=""
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
              {error && <div style={{ color: "red" }}>{error}</div>}
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
