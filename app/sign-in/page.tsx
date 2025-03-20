import { signIn } from "@/auth";

export default function Page() {
  return (
    <main className="w-screen h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-6" />
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/" });
          }}
        >
          <button className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black shadow-md transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
            Sign In with GitHub
          </button>
        </form>
      </div>
    </main>
  );
}
