const Login= async()=>{
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <form
          action="/admin"
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Welcome Back
          </h2>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email or Phone
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter Email or Phone"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 text-white font-semibold py-2 rounded-md hover:bg-amber-500 transition duration-200"
          >
            Login
          </button>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-sm text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Logo"
              className="w-5 h-5 mr-2"
            />
            <span className="text-sm text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-amber-500 hover:underline">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    );
}

export default Login