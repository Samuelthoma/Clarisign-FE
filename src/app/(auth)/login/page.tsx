import "../../../styles/globals.css";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card shadow-lg rounded-sm overflow-hidden flex max-w-3xl w-full border border-border">
        
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Login
          </h2>

          <form id="loginForm" className="w-full space-y-6">
            
            <div>
              <label
                htmlFor="email"
                className="block text-foreground/80 text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="
                  w-full py-2 bg-transparent
                  border-b border-border 
                  text-foreground
                  focus:outline-none focus:border-primary
                  transition-colors
                "
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-foreground/80 text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="
                  w-full py-2 bg-transparent
                  border-b border-border 
                  text-foreground
                  focus:outline-none focus:border-primary
                  transition-colors
                "
              />
            </div>

            <div>
              <button
                type="submit"
                className="
                  w-full bg-primary text-primary-foreground
                  py-2 rounded 
                  hover:bg-primary/90 
                  transition-colors
                "
              >
                Login
              </button>
            </div>

            <p className="text-center text-muted-foreground text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-primary font-semibold underline underline-offset-2"
              >
                Register now
              </a>
            </p>
          </form>
        </div>

        <div className="w-1/2 bg-muted">
          <div className="aspect-square w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=1000"
              alt="Office"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
