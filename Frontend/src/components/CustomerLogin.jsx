import { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/Logo.svg";
import googleLogo from "../assets/Google Icon.svg";
import { MESSAGE_API_CONTEXT, USER_PROFILE_CONTEXT } from "../contexts";
import { getCustomerProfileApi } from "../lib/api/serviceApi";
import { loginCustomerApi } from "../lib/api/authApi";
import { getAuth, storeAuth } from "../lib/util";
import Loading from "../componets-utils/Loading";
import { GOOGLE_URL } from "@/config";
import { LOGIN_MODAL_CONTEXT, SIGNUP_MODAL_CONTEXT } from "../contexts";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const messageApi = useContext(MESSAGE_API_CONTEXT);
  const { loginOpen, setLoginOpen } = useContext(LOGIN_MODAL_CONTEXT);
  const { setSignupOpen } = useContext(SIGNUP_MODAL_CONTEXT);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);

  useEffect(() => {
    if (!loginOpen) {
      document.body.style.overflow = "auto";
      return;
    }

    document.body.style.overflow = "hidden";

    const currentRef = modalRef.current;
    if (currentRef) {
      currentRef.focus();
      const handleKeyPress = (e) => {
        if (e.key === "Escape") {
          setLoginOpen(false);
        }
      };
      currentRef.addEventListener("keypress", handleKeyPress);

      return () => {
        currentRef.removeEventListener("keypress", handleKeyPress);
        document.body.style.overflow = "auto";
      };
    }
  }, [loginOpen, setLoginOpen]);

  if (!loginOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const errorLogger = (error) => {
      console.error(error);
      setError(error);
    };

    const loginData = await loginCustomerApi({ email, password }, errorLogger);
    if (!loginData) return;

    const { accessToken, refreshToken, id: userId } = loginData;
    storeAuth(userId, accessToken, refreshToken);

    if (!userProfile) return;

    setUserProfile(userProfile);
    messageApi.success("Login Successful");
    setLoginOpen(false);
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50">
      <div className="relative bg-white shadow-lg p-4 sm:p-6 rounded-2xl w-[95%] max-w-md max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setLoginOpen(false)}
          className="top-3 right-3 absolute p-2 text-gray-500 hover:text-gray-700"
        >
          <span className="text-2xl">&times;</span>
        </button>

        <div className="mb-6 text-center">
          <img
            src={logo}
            alt="9ja Markets Logo"
            className="mx-auto h-12 sm:h-14"
          />
          <h2 className="mt-2 font-bold text-Primary text-lg sm:text-xl">
            Welcome Back
          </h2>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            setLoading(true);
            await handleLogin(e).finally(() => setLoading(false));
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 text-sm"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 text-sm"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="top-1/2 right-2 absolute text-gray-500 hover:text-gray-700 -translate-y-1/2"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-Primary hover:bg-Primary/90 p-2.5 rounded-lg w-full font-medium text-white transition-colors"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <Loading />
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-gray-300 border-t w-full"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <a
            href={GOOGLE_URL}
            className="flex justify-center items-center gap-3 hover:bg-gray-50 p-2.5 border border-gray-300 rounded-lg w-full transition-colors"
          >
            <img src={googleLogo} alt="Google" className="w-5 h-5" />
            <span className="text-gray-700">Continue with Google</span>
          </a>

          <div className="space-y-3 text-sm text-center">
            <p>
              <Link
                to="/forget-password"
                className="text-Primary hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
            <p>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setLoginOpen(false);
                  setSignupOpen(true);
                }}
                className="font-semibold text-Primary hover:text-Primary/80"
              >
                Create an account
              </button>
            </p>
            <p className="pt-2 text-gray-500 text-xs">
              By continuing you agree to the{" "}
              <Link to="/terms" className="text-Primary hover:underline">
                Policy and Rules
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
