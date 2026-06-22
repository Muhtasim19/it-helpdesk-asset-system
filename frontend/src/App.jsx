function App() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <section className="rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-slate-900">
          IT Help Desk
        </h1>

        <p className="mt-2 text-slate-600">
          React and Tailwind are working.
        </p>

        <button
          type="button"
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Get Started
        </button>
      </section>
    </main>
  );
}

export default App;