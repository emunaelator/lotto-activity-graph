// src/App.js

import React, { useState, useEffect } from 'react';
import loadLottoData from './loadLottoData';
import './index.css';

function App() {
  const [lottoData, setLottoData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [numberFrequencies, setNumberFrequencies] = useState({});
  const [superNumberFrequencies, setSuperNumberFrequencies] = useState({});
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [sortedSuperNumbers, setSortedSuperNumbers] = useState([]);
  const [baseColor, setBaseColor] = useState('#407fff'); // Default base color

  useEffect(() => {
    // Load and combine the data
    const data = loadLottoData();
    setLottoData(data);
  }, []);

  useEffect(() => {
    // Filter data based on selected year
    const filteredData =
      selectedYear === 'All Years'
        ? lottoData
        : lottoData.filter((entry) => new Date(entry.date).getFullYear() === selectedYear);

    // Initialize frequency counters
    const numberFreq = {};
    const superNumberFreq = {};

    // Initialize counts to zero
    for (let i = 1; i <= 49; i++) {
      numberFreq[i] = 0;
    }
    for (let i = 0; i <= 9; i++) {
      superNumberFreq[i] = 0;
    }

    // Count frequencies
    filteredData.forEach((entry) => {
      entry.numbers.forEach((number) => {
        numberFreq[number]++;
      });
      if (entry.superNumber !== null) {
        superNumberFreq[entry.superNumber]++;
      }
    });

    setNumberFrequencies(numberFreq);
    setSuperNumberFrequencies(superNumberFreq);

    // Sort numbers by frequency
    const sortedNums = Object.entries(numberFreq)
      .sort((a, b) => b[1] - a[1])
      .map(([number, frequency]) => ({ number: parseInt(number), frequency }));
    setSortedNumbers(sortedNums);

    // Sort super numbers by frequency
    const sortedSuperNums = Object.entries(superNumberFreq)
      .sort((a, b) => b[1] - a[1])
      .map(([number, frequency]) => ({ number: parseInt(number), frequency }));
    setSortedSuperNumbers(sortedSuperNums);
  }, [selectedYear, lottoData]);

  const years = ['All Years', ...new Set(lottoData.map((entry) => new Date(entry.date).getFullYear()))].sort();

  // Function to get color based on frequency
  function getColorForFrequency(frequency, type) {
    const frequencies = type === 'number' ? numberFrequencies : superNumberFrequencies;
    const maxFrequency = Math.max(...Object.values(frequencies));
    const minFrequency = Math.min(...Object.values(frequencies));

    // Handle the case when maxFrequency equals minFrequency to avoid division by zero
    const normalizedFrequency =
      maxFrequency !== minFrequency ? (frequency - minFrequency) / (maxFrequency - minFrequency) : 0;

    // Calculate alpha value (from 0 to 1)
    const alpha = normalizedFrequency; // Alpha ranges from 0 (min freq) to 1 (max freq)

    // Base color from color picker
    const rgb = hexToRgb(baseColor);

    return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha.toFixed(2)})`;
  }

  // Helper function to convert hex color to RGB
  function hexToRgb(hex) {
    // Remove '#' if present
    hex = hex.replace('#', '');

    // Parse r, g, b values
    let bigint = parseInt(hex, 16);
    let r, g, b;
    if (hex.length === 6) {
      r = (bigint >> 16) & 255;
      g = (bigint >> 8) & 255;
      b = bigint & 255;
    } else if (hex.length === 3) {
      r = (bigint >> 8) & 15;
      g = (bigint >> 4) & 15;
      b = bigint & 15;
      // Convert 0-15 to 0-255
      r = r * 17;
      g = g * 17;
      b = b * 17;
    } else {
      // Invalid format
      r = 64;
      g = 127;
      b = 255;
    }
    return { r, g, b };
  }

  // Number of hottest and coldest numbers to display
  const HOTTEST_COUNT = 6;
  const COLDEST_COUNT = 6;

  return (
    <div>
      <h1>German Lotto Number Frequencies</h1>

      {/* Year Selector */}
      <label htmlFor="year-selector">Select Year: </label>
      <select
        id="year-selector"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value === 'All Years' ? 'All Years' : parseInt(e.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Color Picker */}
      <br />
      <label htmlFor="color-picker">
        Select Base Color: {' '}
      </label>
      <input style={{ alignItems: 'right' }}
        type="color"
        id="color-picker"
        value={baseColor}
        onChange={(e) => setBaseColor(e.target.value)}
      />

      {/* Main Numbers Grid */}
      <h2>Main Numbers (1-49)</h2>
      <div className="grid-container numbers-grid">
        {Array.from({ length: 49 }, (_, i) => {
          const number = i + 1;
          const frequency = numberFrequencies[number];
          return (
            <div
              key={number}
              className="grid-item"
              style={{ backgroundColor: getColorForFrequency(frequency, 'number') }}
              title={`Number: ${number}\nFrequency: ${frequency}`}
            >
              {number}
            </div>
          );
        })}
      </div>

      {/* Hottest Main Numbers */}
      <h3>Top {HOTTEST_COUNT} Numbers</h3>
      <div className="number-list">
        {sortedNumbers.slice(0, HOTTEST_COUNT).map(({ number, frequency }) => (
          <div
            key={number}
            className="number-item"
            style={{ backgroundColor: getColorForFrequency(frequency, 'number') }}
            title={`Number: ${number}\nFrequency: ${frequency}`}
          >
            {number}
          </div>
        ))}
      </div>

      {/* Coldest Main Numbers */}
      <h3>Bottom {COLDEST_COUNT} Numbers</h3>
      <div className="number-list">
        {sortedNumbers.slice(-COLDEST_COUNT).map(({ number, frequency }) => (
          <div
            key={number}
            className="number-item"
            style={{ backgroundColor: getColorForFrequency(frequency, 'number') }}
            title={`Number: ${number}\nFrequency: ${frequency}`}
          >
            {number}
          </div>
        ))}
      </div>

      {/* Super Numbers Grid */}
      <h2>Super Numbers (0-9)</h2>
      <div className="grid-container super-numbers-grid">
        {Array.from({ length: 10 }, (_, i) => {
          const superNumber = i;
          const frequency = superNumberFrequencies[superNumber];
          return (
            <div
              key={superNumber}
              className="grid-item"
              style={{ backgroundColor: getColorForFrequency(frequency, 'superNumber') }}
              title={`Super Number: ${superNumber}\nFrequency: ${frequency}`}
            >
              {superNumber}
            </div>
          );
        })}
      </div>

      {/* Hottest Super Number */}
      <h3>Hottest Super Number</h3>
      <div className="number-list">
        {sortedSuperNumbers.slice(0, 1).map(({ number, frequency }) => (
          <div
            key={number}
            className="number-item"
            style={{ backgroundColor: getColorForFrequency(frequency, 'superNumber') }}
            title={`Super Number: ${number}\nFrequency: ${frequency}`}
          >
            {number}
          </div>
        ))}
      </div>

      {/* Coldest Super Number */}
      <h3>Coldest Super Number</h3>
      <div className="number-list">
        {sortedSuperNumbers.slice(-1).map(({ number, frequency }) => (
          <div
            key={number}
            className="number-item"
            style={{ backgroundColor: getColorForFrequency(frequency, 'superNumber') }}
            title={`Super Number: ${number}\nFrequency: ${frequency}`}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
