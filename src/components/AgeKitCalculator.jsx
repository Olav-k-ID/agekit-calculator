import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AgeKitCalculator() {
  const [games, setGames] = useState(2);
  const [countries, setCountries] = useState(5);
  const [ageGroup, setAgeGroup] = useState("under13");
  const [currency, setCurrency] = useState("EUR");

  const rates = { EUR: 1, USD: 1.08, GBP: 0.85 };
  const symbol = { EUR: "€", USD: "$", GBP: "£" };

  // Cap countries at 10 for calculations; display "10+" at max
  const effectiveCountries = Math.min(countries, 10);
  const countriesLabel = countries >= 11 ? "10+" : countries;

  const manualTimeWeeks = games * effectiveCountries * 1;
  const agekitTimeHours = games * effectiveCountries * 1; // 1 hour each
  const manualCost = games * effectiveCountries * 5000 * rates[currency];
  const agekitCost = 0;

  const savings = manualCost - agekitCost;
  const timeSavingsPercent = 100 - (agekitTimeHours / (manualTimeWeeks * 40)) * 100; // 1 week ≈ 40h

  const chartData = [
    { name: "Manual", Time: manualTimeWeeks * 40, Cost: manualCost },
    { name: "AgeKit", Time: agekitTimeHours, Cost: agekitCost },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">AgeKit Calculator</h1>
      <p className="text-center text-gray-600">Estimate the time and cost to set up age gates for your games — and see how much you save with AgeKit.</p>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div>
            <label className="font-medium">Number of Games: {games}</label>
            <Slider min={1} max={10} step={1} value={[games]} onValueChange={(v) => setGames(v[0])} />
          </div>

          <div>
            <label className="font-medium">Number of Countries: {countriesLabel}</label>
            <Slider min={1} max={11} step={1} value={[countries]} onValueChange={(v) => setCountries(v[0])} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-medium">Age Group</label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="under13">Under 13</SelectItem>
                  <SelectItem value="13-15">13–15</SelectItem>
                  <SelectItem value="16+">16+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="font-medium">Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">€ EUR</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                  <SelectItem value="GBP">£ GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-4 text-center">
          <p className="text-lg font-semibold">Manual setup would take about {manualTimeWeeks} weeks and cost {symbol[currency]}{manualCost.toLocaleString()}.</p>
          <p className="text-lg font-semibold">With AgeKit, you're live in just {agekitTimeHours} hours — for {symbol[currency]}0.</p>
          <p className="text-green-600 font-bold">You save roughly {timeSavingsPercent.toFixed(1)}% of time and {symbol[currency]}{savings.toLocaleString()}.</p>

          {effectiveCountries > 1 && (
            <p className="text-sm text-gray-500">
              This setup spans multiple jurisdictions (GDPR-K, COPPA, DSA Art 28). Normally, each adds legal overhead — with AgeKit, these are handled automatically.
            </p>
          )}

          <div className=\"space-y-6\">
            {/* Time chart */}
            <div className=\"h-96\">
              <ResponsiveContainer width=\"100%\" height=\"100%\"> 
                <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 60 }}>
                  <XAxis dataKey=\"name\" />
                  <YAxis width={70} tickFormatter={(v) => v.toLocaleString()} label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => value.toLocaleString()} labelFormatter={(n) => `${n} (Time)`} />
                  <Bar dataKey=\"Time\" name=\"Time (hours)\" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cost chart */}
            <div className=\"h-96\">
              <ResponsiveContainer width=\"100%\" height=\"100%\"> 
                <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 60 }}>
                  <XAxis dataKey=\"name\" />
                  <YAxis width={90} tickFormatter={(v) => `${symbol}${Number(v).toLocaleString()}`} label={{ value: `Cost (${symbol})`, angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${symbol}${Number(value).toLocaleString()}`} labelFormatter={(n) => `${n} (Cost)`} />
                  <Bar dataKey=\"Cost\" name={`Cost (${symbol})`} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3" onClick={() => window.location.href = '/demo'}>
            Book a Demo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
