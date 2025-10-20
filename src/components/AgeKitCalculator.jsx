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
  const [countries, setCountries] = useState(5) // 1..11 (11 = 10+)
  const [ageGroup, setAgeGroup] = useState('under13')
  const [currency, setCurrency] = useState('EUR')
  const [metric, setMetric] = useState('time') // 'time' | 'cost'

  // ---- Countries cap & display ----
  const effectiveCountries = Math.min(countries, 10)
  const countriesLabel = countries >= 11 ? '10+' : String(countries)

  // Assumptions
  const manualWeeksPerUnit = 1 // per game per country
  const manualCostPerUnitEUR = 5000
  const agekitHoursPerUnit = 1 // per game per country
  const agekitCostPerUnitEUR = 0

  const [isLive, setIsLive] = useState(false); // false = not live (default)

// Tunable retrofit multipliers when a game is already live
const LIVE_MULTIPLIERS = {
  manualTime: 1.5,   // +50% time
  manualCost: 1.25,  // +25% cost
  agekitTime: 1.2,   // +20% time
  agekitCost: 1,     // keep 0 unless you want a non-zero marginal cost
};

  const rate = CURRENCIES[currency].rate
  const symbol = CURRENCIES[currency].symbol

  // IMPORTANT: use effectiveCountries in all math
  const units = games * effectiveCountries;

const manualHours = useMemo(() => units * manualWeeksPerUnitAdj * 40, [units, manualWeeksPerUnitAdj]);
const agekitHours = useMemo(() => units * agekitHoursPerUnitAdj,       [units, agekitHoursPerUnitAdj]);

const manualCost = useMemo(() => units * manualCostPerUnitAdjEUR * rate, [units, manualCostPerUnitAdjEUR, rate]);
const agekitCost = useMemo(() => units * agekitCostPerUnitAdjEUR * rate, [units, agekitCostPerUnitAdjEUR, rate]);


const [isLive, setIsLive] = useState(false); // false = not live (default)

// Tunable retrofit multipliers when a game is already live
const LIVE_MULTIPLIERS = {
  manualTime: 1.5,   // +50% time
  manualCost: 1.25,  // +25% cost
  agekitTime: 1.2,   // +20% time
  agekitCost: 1,     // keep 0 unless you want a non-zero marginal cost
};

  const timeSavedPct = manualHours > 0 ? ((manualHours - agekitHours) / manualHours) * 100 : 0
  const costSaved = manualCost - agekitCost

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
          label={`Number of Countries: ${countriesLabel}`}
          hint='Economies of scale after 10 countries — "10+" is capped for calculations'
        >
          <input
            type="range"
            min={1}
            max={11}               // 11 represents "10+"
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

        <Control label="Game already live?" hint="Retrofit adds integration, QA, and migration overhead">
  <div className="flex gap-2">
    <button
      onClick={() => setIsLive(false)}
      className={`px-3 py-1 rounded-xl2 border text-sm ${!isLive ? 'bg-kid-purple border-kid-purple' : 'border-white/10'}`}
    >
      No (new launch)
    </button>
    <button
      onClick={() => setIsLive(true)}
      className={`px-3 py-1 rounded-xl2 border text-sm ${isLive ? 'bg-kid-purple border-kid-purple' : 'border-white/10'}`}
    >
      Yes (already live)
    </button>
  </div>
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
        {effectiveCountries > 1 && (
          <p className="text-sm text-gray-300">
            Multiple jurisdictions detected (GDPR-K, COPPA, DSA Art 28). Typically each adds legal & localization overhead — with AgeKit this is handled centrally.
          </p>
        )}
        <p className="text-green-300 font-bold">
          You save approximately {timeSavedPct.toFixed(1)}% of time and {formatMoney(costSaved)}.
        </p>
        <p className="text-xs text-gray-400">
  Mode: {isLive ? 'Retrofitting an already-live game' : 'New launch (not yet live)'}
</p>

      </div>

      {/* Single-metric chart (Manual only, toggle Time/Cost) */}
      <div className="bg-blackberry-light rounded-xl2 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-300">Show</span>
          <button
            onClick={() => setMetric('time')}
            className={`px-3 py-1 rounded-xl2 border text-sm ${metric==='time' ? 'bg-kid-purple border-kid-purple' : 'border-white/10'}`}
          >
            Time
          </button>
          <button
            onClick={() => setMetric('cost')}
            className={`px-3 py-1 rounded-xl2 border text-sm ${metric==='cost' ? 'bg-kid-purple border-kid-purple' : 'border-white/10'}`}
          >
            Cost
          </button>
          <span className="ml-auto text-xs text-gray-400">AgeKit ≈ 0 hidden for readability</span>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[{ name: 'Manual', Value: metric==='time' ? manualHours : Number(manualCost.toFixed(2)) }]}
              margin={{ top: 10, right: 20, bottom: 10, left: 70 }}
            >
              <XAxis dataKey="name" stroke="#FFFFFF" />
              <YAxis
                stroke="#FFFFFF"
                width={90}
                tickFormatter={(v) => metric==='time' ? v.toLocaleString() : `${symbol}${Number(v).toLocaleString()}`}
                label={{ value: metric==='time' ? 'Hours' : `Cost (${symbol})`, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value) => metric==='time'
                  ? [value.toLocaleString() + ' h', 'Manual']
                  : [`${symbol}${Number(value).toLocaleString()}`, 'Manual']
                }
                contentStyle={{ background: '#2C216F', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="Value" name={metric==='time' ? 'Manual (hours)' : `Manual (${symbol})`} fill="#715DEC" radius={[8,8,0,0]} />
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
