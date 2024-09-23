import axios from "axios";
import React, { useEffect, useState } from "react";

const ExchangeRateTable = () => {
  const [currencyRates, setCurrencyRates] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const currencyList = ["CAD", "IDR", "JPY", "CHF", "EUR", "USD"];

  const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;
  const baseUrl = import.meta.env.VITE_CURRENCY_BASE_URL;

  const fetchCurrencyRates = async () => {
    if (!apiKey || !baseUrl) {
      setError("API key or base URL is missing. Please check your .env file.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios({
        method: "get",
        url: `${baseUrl}apikey=${apiKey}`,
      });
      setCurrencyRates(response.data.rates);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch currency rates.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  const calculateRateBuy = (rate) => {
    return (parseFloat(rate) * 1.02).toFixed(4);
  };

  const calculateRateSell = (rate) => {
    return (parseFloat(rate) * 0.98).toFixed(4);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-orange-500">
        <p className="text-white">
          Loading... <br />
          Please Wait ...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-orange-500">
        <p className="text-white">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-orange-500">
      <div className="bg-orange-500 text-white p-8 rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">CURRENCY</th>
              <th className="px-4 py-2 border">WE BUY</th>
              <th className="px-4 py-2 border">EXCHANGE RATE</th>
              <th className="px-4 py-2 border">WE SELL</th>
            </tr>
          </thead>
          <tbody>
            {currencyList.map((currency, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{currency}</td>
                <td className="px-4 py-2 border">
                  {calculateRateBuy(currencyRates[currency])}
                </td>
                <td className="px-4 py-2 border">{currencyRates[currency]}</td>
                <td className="px-4 py-2 border">
                  {calculateRateSell(currencyRates[currency])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-xs">
          <p>* base currency is IDR</p>
          <p>
            * As for the API,{" "}
            <a href="https://exchangeratesapi.io" className="underline">
              https://exchangeratesapi.io
            </a>{" "}
            is used.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateTable;
