import React, { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

/** =======================
 *  COPY — edit all text here
 *  ======================= */
const COPY = {
  // Controls
  titleGames: 'Number of Games',
  hintGames: 'Each game that needs an age gate',
  titleCountries: 'Number of Countries',
  hintCountries: 'Economies of scale after 10 countries — "10+" is capped for calculations',
  titleAgeGroup: 'Age Group',
  hintAgeGroup: 'Affects verification flows',
  titleCurrency: 'Currency',
  hintCurrency: 'Applies demo rates',
  titleLive: 'Is the game already live?',
  liveNo: 'No (new launch)',
  liveYes: 'Yes (already live)',

  // Summary
  modePrefix: 'Mode:',
  modeNew: 'New launch (not yet live)',
  modeLive: 'Retrofitting an already-live game',
  summaryManualA: 'Manual setup would take about',
  summaryManualBWeeks: 'weeks and cost',
  summaryKID: 'With k-ID, you will pay a standard single fee.',
  jurisdictionNote:
    'Multiple jurisdictions detected (GDPR-K, COPPA, DSA Art 28). Typically each adds legal & localization overhead — with k-ID this is handled centrally.',
  savingsPrefix: 'You save approximately',

  // Chart
  chartToggleLabel: 'Show',
  chartToggleTime: 'Time',
  chartToggleCost: 'Cost',
  chartNote: 'k-ID ≈ 0 hidden for readability',
  chartYAxisTime: 'Hours',
  chartYAxisCost: (symbol) => `Cost (${symbol})`,
  chartSeriesTime: 'Manual (hours)',
  chartSeriesCost: (symbol) => `Manual (${symbol})`,

  // CTA
  cta: 'Book a Demo',
}

/** Currency config */
const CURRENCIES = {
  EUR: { symbol: '€', rate: 1 },
  USD: { symbol: '$', rate: 1.08 },
  GBP: { symbol: '£', rate: 0.85 },
}

const HUBSPOT_EVENT = { id: 'agekit_calculator_book_demo' } // CTA click tracking

export default function AgeKitCalculator() {
  // ---- Inputs ----
  const [games, setGames] = useState(2)
  const [countries, setCountries] = useState(5) // 1..11 (11 = "10+")
  const [ageGroup, setAgeGroup] = useState('under13')
  const [currency, setCurrency] = useState('EUR')
  const [metric, setMetric] = useState('time') // 'time' | 'cost'
  const [isLive, setIsLive] = useState(false)  // false = new launch; true = retrofit

  // ---- Countries cap & display (economies of scale after 10) ----
  const effectiveCountries = Math.min(countries, 10)
  const countriesLabel = countries >= 11 ? '10+' : String(countries)

  // ---- Baseline assumptions (per game-per-country) ----
  const manualWeeksPerUnit = 1
  const manualCostPerUnitEUR = 5000
  const agekitHoursPerUnit = 1
  const agekitCostPerUnitEUR = 0

  // ---- Retrofit multipliers when game is already live (tweak if needed) ----
  const LIVE_MULTIPLIERS = {
    manualTime: 1.5,   // +50% manual time
    manualCost: 1.25,  // +25% manual cost
    agekitTime: 1.2,   // +20% AgeKit time (still small)
    agekitCost: 1,     // keep €0 unless you want a marginal retrofit cost
  }

  // Apply multipliers if retrofitting
  const manualWeeksPerUnitAdj   = isLive ? manualWeeksPerUnit   * LIVE_MULTIPLIERS.manualTime : manualWeeksPerUnit
  const manualCostPerUnitAdjEUR = isLive ? manualCostPerUnitEUR * LIVE_MULTIPLIERS.manualCost : manualCostPerUnitEUR
  const agekitHoursPerUnitAdj   = isLive ? agekitHoursPerUnit   * LIVE_MULTIPLIERS.agekitTime : agekitHoursPerUnit
  const agekitCostPerUnitAdjEUR = isLive ? agekitCostPerUnitEUR * LIVE_MULTIPLIERS.agekitCost : agekitCostPerUnitEUR

  // ---- Currency + units ----
  const rate = CURRENCIES[currency].rate
  const symbol = CURRENCIES[currency].symbol
  const units = games * effectiveCountries
  const HOURS_PER_WEEK = 40

  // ---- Calculations ----
  const manualHours = useMemo(() => units * manualWeeksPerUnitAdj * HOURS_PER_WEEK, [units, manualWeeksPerUnitAdj])
  const agekitHours = useMemo(() => units * agekitHoursPerUnitAdj, [units, agekitHoursPerUnitAdj])

  const manualCost = useMemo(() => units * manualCostPerUnitAdjEUR * rate, [units, manualCostPerUnitAdjEUR, rate])
  const agekitCost = useMemo(() => units * agekitCostPerUnitAdjEUR * rate, [units, agekitCostPerUnitAdjEUR, rate])

  const timeSavedPct = manualHours > 0 ? ((manualHours - agekitHours) / manualHours) * 100 : 0
  const costSaved = manualCost - agekitCost

  // ---- Formatting ----
  const fmtInt = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  const fmtMoney = (n) => `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  // ---- CTA ----
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
          label={`${COPY.titleGames}: ${games}`}
          hint={COPY.hintGames}
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
          label={`${COPY.titleCountries}: ${countriesLabel}`}
          hint={COPY.hintCountries}
        >
          <input
            type="range"
            min={1}
            max={11} // 11 represents "10+"
            value={countries}
            onChange={(e) => setCountries(Number(e.target.value))}
            className="w-full accent-kid-purple"
          />
        </Control>

        <Control label={COPY.titleAgeGroup} hint={COPY.hintAgeGroup}>
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

        <Control label={COPY.titleCurrency} hint={COPY.hintCurrency}>
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

        <Control label={COPY.titleLive} hint="Retrofit adds integration, QA, and migration overhead">
          <div className="flex gap-2">
            <button
              onClick={() => setIsLive(false)}
              className={`px-3 py-1 rounded-xl2 border text-sm ${!isLive ? 'bg-kid-purple border-kid-purple' : 'border-white/10'}`}
            >
              {COPY.liveNo}
            </button>
            <button
              onClick={() => setIsLive(true)}
              className={`px-3 py-1 rounded-xl2 border text-sm ${isLive ? 'bg-kid-purple border-kid-purple' : 'border-white/10'}`}
            >
              {COPY.liveYes}
            </button>
          </div>
        </Control>
      </div>

      {/* Summary */}
      <div className="bg-blackberry-light rounded-xl2 p-6 shadow-soft space-y-3">
        <p className="text-xs text-gray-400">
          {COPY.modePrefix} {isLive ? COPY.modeLive : COPY.modeNew}
        </p>

        <p className="text-lg font-semibold">
          {COPY.summaryManualA}{' '}
          <span className="text-kid-orange">{fmtInt(manualHours / HOURS_PER_WEEK)} {COPY.summaryManualBWeeks}</span>{' '}
          <span className="text-kid-orange">{fmtMoney(manualCost)}</span>.
        </p>

        {/* k-ID line (replaces the old AgeKit line) */}
        <p className="text-lg font-semibold">
          {COPY.summaryKID}
        </p>

        {effectiveCountries > 1 && (
          <p className="text-sm text-gray-300">
            {COPY.jurisdictionNote}
          </p>
        )}

        {/* Bigger savings line */}
        <p className="text-green-300 font-extrabold text-xl md:text-2xl">
          {COPY.savingsPrefix} {timeSavedPct.toFixed(1)}% of time and {fmtMoney(costSaved)}.
        </p>
      </div>

      {/* Single-metric chart (Manual only; k-ID ≈ 0 hidden for readability) */}
      <div className="bg-blackberry-light rounded-xl2 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-300">{COPY.chartToggleLabel}</span>
          <button
            onClick={() => setMetric('time')}
            className={`px-3 py-1 rounded-xl2 border text-sm ${metric==='time' ? 'bg-kid-purple border-kid-purple' : 'border-white/10'}`}
          >
            {COPY.chartToggleTime}
          </button>
          <button
            onClick={() => setMetric('cost')}
            className={`px-3 py-1 rounded-xl2 border text-sm ${metric==='cost' ? 'bg-kid-purple border-kid-purple' : 'border-white/10'}`}
          >
            {COPY.chartToggleCost}
          </button>
          <span className="ml-auto text-xs text-gray-400">{COPY.chartNote}</span>
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
                tickFormatter={(v) =>
                  metric === 'time'
                    ? v.toLocaleString()
                    : `${symbol}${Number(v).toLocaleString()}`
                }
                label={{
                  value: metric === 'time' ? COPY.chartYAxisTime : COPY.chartYAxisCost(symbol),
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip
                formatter={(value) =>
                  metric === 'time'
                    ? [value.toLocaleString() + ' h', 'Manual']
                    : [`${symbol}${Number(value).toLocaleString()}`, 'Manual']
                }
                contentStyle={{ background: '#2C216F', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <Legend />
              <Bar
                dataKey="Value"
                name={metric === 'time' ? COPY.chartSeriesTime : COPY.chartSeriesCost(symbol)}
                fill="#715DEC"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button
          onClick={handleBookDemo}
          className="mt-6 w-full bg-kid-purple hover:opacity-90 text-white text-lg font-semibold py-3 rounded-xl2 transition"
        >
          {COPY.cta}
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
