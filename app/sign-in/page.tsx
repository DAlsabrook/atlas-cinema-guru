import { signIn } from "@/auth";

export default function Page() {
  return (
    <main className="w-screen py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex lg:flex-row flex-col gap-4 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl">
              We Got Movies
            </h1>

            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <form
                action={async () => {
                  "use server";
                  await signIn("github", { redirectTo: "/" });
                }}
              >
                <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  <div className="bg-green-dark">Sign In</div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
