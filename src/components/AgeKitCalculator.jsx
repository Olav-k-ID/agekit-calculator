import React, { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CURRENCIES = {
  EUR: { symbol: '€', rate: 1 },
  USD: { symbol: '$', rate: 1.08 },
  GBP: { symbol: '£', rate: 0.85 },
}

const HUBSPOT_EVENT = { id: 'agekit_calculator_book_demo' } // Track click

export default function AgeKitCalculator() {
  const [games, setGames] = useState(2)
  const [countries, setCountries] = useState(5)
  const [ageGroup, setAgeGroup] = useState('under13')
  const [currency, setCurrency] = useState('EUR')

  // Assumptions
  const manualWeeksPerUnit = 1 // per game per country
  const manualCostPerUnitEUR = 5000
  const agekitHoursPerUnit = 1 // per game per country
  const agekitCostPerUnitEUR = 0

  const rate = CURRENCIES[currency].rate
  const symbol = CURRENCIES[currency].symbol

  const units = games * countries

  const manualHours = useMemo(() => units * manualWeeksPerUnit * 40, [units])
  const agekitHours = useMemo(() => units * agekitHoursPerUnit, [units])
  const manualCost = useMemo(() => units * manualCostPerUnitEUR * rate, [units, rate])
  const agekitCost = useMemo(() => units * agekitCostPerUnitEUR * rate, [units, rate])

  const timeSavedPct = manualHours > 0 ? ((manualHours - agekitHours) / manualHours) * 100 : 0
  const costSaved = manualCost - agekitCost

  const chartData = [
    { name: 'Manual', Time: manualHours, Cost: Number(manualCost.toFixed(2)) },
    { name: 'AgeKit', Time: agekitHours, Cost: Number(agekitCost.toFixed(2)) },
  ]

  const formatNumber = (n) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 0 })

  const formatMoney = (n) =>
    `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  const handleBookDemo = () => {
    try {
      window._hsq = window._hsq || []
      window._hsq.push(['trackEvent', HUBSPOT_EVENT])
    } catch (e) {}
    window.location.href = 'https://qikgm.share.hsforms.com/2QUFcj5HFSUaJxCVd8JlCWA'
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Control
          label={`Number of Games: ${games}`}
          hint="Each game that needs an age gate"
        >
          <input
            type="range"
            min={1}
            max={10}
            value={games}
            onChange={(e) => setGames(Number(e.target.value))}
            className="w-full accent-kid-purple"
          />
        </Control>

        <Control
          label={`Number of Countries: ${countries}`}
          hint="Markets where each game is live"
        >
          <input
            type="range"
            min={1}
            max={30}
            value={countries}
            onChange={(e) => setCountries(Number(e.target.value))}
            className="w-full accent-kid-purple"
          />
        </Control>

        <Control label="Age Group" hint="Affects verification flows">
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            className="w-full bg-blackberry-light text-white rounded-xl2 px-4 py-3 border border-white/10"
          >
            <option value="under13">Under 13</option>
            <option value="13-15">13–15</option>
            <option value="16+">16+</option>
          </select>
        </Control>

        <Control label="Currency" hint="Applies fixed demo rates">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-blackberry-light text-white rounded-xl2 px-4 py-3 border border-white/10"
          >
            <option value="EUR">€ EUR</option>
            <option value="USD">$ USD</option>
            <option value="GBP">£ GBP</option>
          </select>
        </Control>
      </div>

      {/* Summary */}
      <div className="bg-blackberry-light rounded-xl2 p-6 shadow-soft space-y-3">
        <p className="text-lg font-semibold">
          Manual setup would take about <span className="text-kid-orange">{formatNumber(manualHours / 40)} weeks</span> and cost <span className="text-kid-orange">{formatMoney(manualCost)}</span>.
        </p>
        <p className="text-lg font-semibold">
          With AgeKit, you're live in just <span className="text-kid-orange">{formatNumber(agekitHours)}</span> hours — for <span className="text-kid-orange">{formatMoney(agekitCost)}</span>.
        </p>
        {countries > 1 && (
          <p className="text-sm text-gray-300">
            Multiple jurisdictions detected (GDPR-K, COPPA, DSA Art 28). Typically each adds legal & localization overhead — with AgeKit this is handled centrally.
          </p>
        )}
        <p className="text-green-300 font-bold">
          You save approximately {timeSavedPct.toFixed(1)}% of time and {formatMoney(costSaved)}.
        </p>
      </div>

      {/* Charts */}
      <div className="bg-blackberry-light rounded-xl2 p-6 shadow-soft">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <XAxis dataKey="name" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'Time') return [value.toLocaleString() + ' h', 'Time']
                  return [symbol + Number(value).toLocaleString(), 'Cost']
                }}
                contentStyle={{ background: '#2C216F', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="Time" name="Time (hours)" fill="#715DEC" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Cost" name={`Cost (${symbol})`} fill="#FC6E0F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button
          onClick={handleBookDemo}
          className="mt-6 w-full bg-kid-purple hover:opacity-90 text-white text-lg font-semibold py-3 rounded-xl2 transition"
        >
          Book a Demo
        </button>
      </div>
    </div>
  )
}

function Control({ label, hint, children }) {
  return (
    <div className="bg-blackberry-light rounded-xl2 p-4 shadow-soft border border-white/5">
      <label className="block text-sm font-semibold mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-300 mt-2">{hint}</p>}
    </div>
  )
}
