import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";

var myHeaders = new Headers();
myHeaders.append("apikey", "unJqZzzhaYkrhGf7eifu7N2xaiqJ3yCl");

var requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};
let usdToUah, eurToUah;
fetch(
  "https://api.apilayer.com/exchangerates_data/latest?symbols=USD%2CEUR&base=UAH",
  requestOptions
)
  .then((response) => response.json())
  .then((result) => {
    usdToUah = (1 / result.rates.USD).toFixed(2);
    eurToUah = (1 / result.rates.EUR).toFixed(2);
  });

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmaunt, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmaunt = amount * exchangeRate;
  } else {
    toAmaunt = amount;
    fromAmount = amount / exchangeRate;
  }
  useEffect(() => {
    fetch("https://api.apilayer.com/exchangerates_data/latest", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[147];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      });
  }, []);
  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(
        `https://api.apilayer.com/exchangerates_data/latest?symbols=${toCurrency}&base=${fromCurrency}`,
        requestOptions
      )
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.rates[toCurrency]));
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }
  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <>
      <div className="dashboard">
        <div className="header">
          <div>$ {usdToUah}</div>
          <div>€ {eurToUah}</div>
        </div>
        <div className="exchanger">
          <h1>Exchange</h1>
          <CurrencyRow
            currencyOptions={currencyOptions}
            selectCurrency={fromCurrency}
            onChangeCurrency={(e) => setFromCurrency(e.target.value)}
            onChangeAmount={handleFromAmountChange}
            amount={fromAmount}
          />
          <CurrencyRow
            currencyOptions={currencyOptions}
            selectCurrency={toCurrency}
            onChangeCurrency={(e) => setToCurrency(e.target.value)}
            onChangeAmount={handleToAmountChange}
            amount={toAmaunt}
          />
        </div>
      </div>
    </>
  );
}

export default App;
