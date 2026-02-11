export default function StorePage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white px-6 py-16">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Discover Movies Smarter
        </h1>
        <p className="text-gray-400 text-lg">
          CineVault helps you find what to watch next — without endless scrolling.
        </p>
      </section>

      {/* Plans */}
      <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        {/* Free */}
        <div className="bg-[#111827] rounded-xl p-8 border border-gray-800">
          <h3 className="text-xl font-semibold mb-2">Free</h3>
          <p className="text-3xl font-bold mb-4">R0</p>
          <ul className="text-gray-400 space-y-2 mb-6">
            <li>Browse movies & shows</li>
            <li>Ratings & trailers</li>
            <li>Basic recommendations</li>
          </ul>
          <button className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600">
            Start Free
          </button>
        </div>

        {/* Plus */}
        <div className="bg-[#111827] rounded-xl p-8 border-2 border-yellow-500 relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-sm px-3 py-1 rounded-full">
            Most Popular
          </span>
          <h3 className="text-xl font-semibold mb-2">Plus</h3>
          <p className="text-3xl font-bold mb-4">R19<span className="text-base text-gray-400"> / month</span></p>
          <ul className="text-gray-400 space-y-2 mb-6">
            <li>Advanced recommendations</li>
            <li>No ads</li>
            <li>Watchlist sync</li>
            <li>Mobile app features</li>
          </ul>
          <button className="w-full py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400">
            Upgrade
          </button>
        </div>

        {/* Supporter */}
        <div className="bg-[#111827] rounded-xl p-8 border border-gray-800">
          <h3 className="text-xl font-semibold mb-2">Supporter</h3>
          <p className="text-3xl font-bold mb-4">R39<span className="text-base text-gray-400"> / month</span></p>
          <ul className="text-gray-400 space-y-2 mb-6">
            <li>Everything in Plus</li>
            <li>Experimental features</li>
            <li>Support CineVault ❤️</li>
          </ul>
          <button className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600">
            Become a Supporter
          </button>
        </div>

      </section>

      {/* Footer Note */}
      <p className="text-center text-gray-500 text-sm mt-12 max-w-xl mx-auto">
        CineVault is a movie discovery and recommendation platform. Streaming availability depends on external providers.
      </p>
    </main>
  );
}
