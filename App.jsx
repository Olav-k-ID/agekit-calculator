import React from 'react'
import AgeKitCalculator from './components/AgeKitCalculator.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-blackberry text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">AgeKit Calculator</h1>
          <p className="text-gray-300 mt-2">Estimate time and cost to set up age gates — and see how much you save with AgeKit.</p>
        </header>
        <AgeKitCalculator />
        <footer className="text-center text-sm text-gray-400">
          <span>© {new Date().getFullYear()} k-ID</span>
        </footer>
      </div>
    </div>
  )
}
