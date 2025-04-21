import React, { useState, useEffect } from 'react';
import { fetchData } from './data';
import { Link } from 'react-router-dom';

const Stock = () => {
  
  const [Stocks, setStocks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const [showNext, setshowNext] = useState(true);
  const [showPrev, setshowPrev] = useState(false);
  const [error, setError] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [savedQueries , setSavedQueries] = useState([]);
  const arr = [
    "Market Capitalization",
    "P/E Ratio",
    "ROE",
    "Debt-to-Equity Ratio",
    "Dividend Yield",
    "Revenue Growth",
    "EPS Growth",
    "Current Ratio",
    "Gross Margin",
  ]
  //  for the current state of sorting algorithm
  console.log("filteredStocks", filteredStocks);
  const map = new Map([
    ["Market Capitalization (B)", false],
    ["P/E Ratio", false],
    ["ROE (%)", false],
    ["Debt-to-Equity Ratio", false],
    ["Dividend Yield (%)", false],
    ["Revenue Growth (%)", false],
    ["EPS Growth (%)", false],
    ["Current Ratio", false],
    ["Gross Margin (%)", false],
  ]);
  const [mp, setMap] = useState(map);

  // Load stocks data once
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
    };

    getData();
  }, []);
  useEffect(() => {
    if (data) {
      setLoading(true);
      setStocks(data);
      setFilteredStocks(data);
      setLoading(false);
    }
  }, [data]);
  

  useEffect(() => {
    const data = fetchData();
    console.log("Filtered Stocks Updated:", filteredStocks);
    // setFilteredStocks(filteredStocks);
  }, [filteredStocks]);

  // Handle search logic and update filteredStocks
  const handleSearch = () => {
    setLoading(true);
    // console.log("query", query);
    if (error !== '') {
      setError('');
    }

    // Split the query into conditions and parse each condition
    const conditions = query.split('AND').map(condition => {
      const parts = condition.trim().split(/\s*([<>=!]+)\s*/);
      if (parts.length !== 3) {
        setError("Enter a valid query in the format: 'Field Operator Value'");
        setLoading(false);
        return null; // Return null to indicate an invalid condition
      }

      const [field, operator, value] = parts;
      return [field.trim(), operator.trim(), value.trim()];
    }).filter(Boolean);


    console.log(conditions);

    // Validate the conditions
    const validFields = ['Market Capitalization', 'P/E Ratio', 'ROE', 'Debt-to-Equity Ratio', 'Dividend Yield', 'Revenue Growth', 'EPS Growth', 'Current Ratio', 'Gross Margin'];
    //  map for the Query Name and Table name 
    const m = new Map([
      ["Market Capitalization", "Market Capitalization (B)"],
      ["P/E Ratio", "P/E Ratio"],
      ["ROE", "ROE (%)"],
      ["Debt-to-Equity Ratio", "Debt-to-Equity Ratio"],
      ["Dividend Yield", "Dividend Yield (%)"],
      ["Revenue Growth", "Revenue Growth (%)"],
      ["EPS Growth", "EPS Growth (%)"],
      ["Current Ratio", "Current Ratio"],
      ["Gross Margin", "Gross Margin (%)"],
    ]
    )
    for (let i = 0; i < conditions.length; i++) {
      var [field, operator, value] = conditions[i];
      console.log(value);
      if (field === '' || operator === '' || value === '') {
        setError("Enter a valid query");
        setLoading(false);
        return;
      }
      if (!validFields.includes(field)) {
        setError(`Invalid field: ${field}. Please try again.`);
        setLoading(false);
        return;
      }

      if (!['>', '<', '=', '>=', '<='].includes(operator)) {
        setError(`Invalid operator: ${operator}. Please try again.`);
        setLoading(false);
        return;
      }

      if (isNaN(value)) {
        setError(`Invalid value: ${value}. Please try again.`);
        setLoading(false);
        return;
      }
    }

    const filteredStocks = Stocks.filter(stock => {
      return conditions.every(([field, operator, value]) => {
        const stockValue = stock[m.get(field)]; // Directly access the field value from the stock

        console.log(`Checking stock field: ${field}, operator: ${operator}, value: ${value}, stockValue: ${stockValue}`);

        if (stockValue === undefined || stockValue === null) return false; // Skip if field is missing

        // Perform the condition check based on operator
        switch (operator) {
          case '>':
            return stockValue > value;
          case '<':
            return stockValue < value;
          case '=':
            return stockValue == value;
          case '>=':
            return stockValue >= value;
          case '<=':
            return stockValue <= value;
          default:
            return false;
        }
      });
    });

    console.log('Filtered Stocks:', filteredStocks);


    setFilteredStocks(filteredStocks);
    setCurrentPage(1);
    setshowNext(true);
    setshowPrev(false);
    setLoading(false);
  };


  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedStocks = filteredStocks.slice(startIndex, endIndex);
  const saveQueryToLocalStorage = () => {
    if (!query.trim()) return;

    const saved = JSON.parse(localStorage.getItem('savedQueries')) || [];
    const updated = [...new Set([query, ...saved])]; // prevents duplicates
    localStorage.setItem('savedQueries', JSON.stringify(updated));
  };
  

  // function for the next click button
  const loadMore = () => {
    if (currentPage < Math.ceil(filteredStocks.length / resultsPerPage)) {
      setCurrentPage(currentPage + 1);
      setshowPrev(true);
    }
    if (currentPage + 1 >= Math.ceil(filteredStocks.length / resultsPerPage)) {
      setshowNext(false);
    }
  };

  //  function for the previous button 
  const loadPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setshowNext(true);
    }
    if (currentPage - 1 === 1) {
      setshowPrev(false);
    }
  };

  //  function for the sorting algorithm
  const handleSort = (key) => {
    const isAscending = mp.get(key);
    const sortedStocks = [...filteredStocks].sort((a, b) =>
      isAscending ? a[key] - b[key] : b[key] - a[key]
    );

    setFilteredStocks(sortedStocks);
    setMap((prevMap) => new Map(prevMap).set(key, !isAscending));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 font-['Inter'] p-4 md:p-8">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="container mx-auto">
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Stock Surf 📈
              </h1>
              <p className="text-white/80 mt-2">Your Gen Z Stock Analysis Playground</p>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse table-auto">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700">
                        <th className="py-2 px-4 border text-left text-blue-500">Sno.</th>
                        <th className="py-2 px-4 border text-left text-blue-500">Ticker</th>
                        <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Market Capitalization (B)')}>Market Capitalization (B)</th>
                        <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('P/E Ratio')}>P/E Ratio</th>
                        <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('ROE (%)')}>ROE (%)</th>
                        <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Debt-to-Equity Ratio')}>Debt-to-Equity Ratio</th>
                        <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Dividend Yield (%)')}>Dividend Yield (%)</th>
                        <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Revenue Growth (%)')}>Revenue Growth (%)</th>
                        <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('EPS Growth (%)')}>EPS Growth (%)</th>
                        <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Current Ratio')}>Current Ratio</th>
                        <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Gross Margin (%)')}>Gross Margin (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStocks.length > 0 ? (
                        paginatedStocks.map((stock, index) => (
                          <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} text-gray-800`}>
                            <td className="py-2 px-4 border">{startIndex + index + 1}</td>
                            <td className="py-2 px-4 border text-blue-500">{stock.Ticker}</td>
                            <td className="py-2 px-4 border">{stock['Market Capitalization (B)']}</td>
                            <td className="py-2 px-4 border">{stock['P/E Ratio']}</td>
                            <td className="py-2 px-4 border">{stock['ROE (%)']}</td>
                            <td className="py-2 px-4 border">{stock['Debt-to-Equity Ratio']}</td>
                            <td className="py-2 px-4 border">{stock['Dividend Yield (%)']}</td>
                            <td className="py-2 px-4 border">{stock['Revenue Growth (%)']}</td>
                            <td className="py-2 px-4 border">{stock['EPS Growth (%)']}</td>
                            <td className="py-2 px-4 border">{stock['Current Ratio']}</td>
                            <td className="py-2 px-4 border">{stock['Gross Margin (%)']}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="py-2 px-4 border text-center text-gray-500">No matching stocks found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
              </div>

              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={loadPrev}
                  disabled={!showPrev}
                  className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 transition-all"
                >
                  ← Previous
                </button>
                <button
                  onClick={loadMore}
                  disabled={!showNext}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 transition-all"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50">
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-indigo-800 mb-2">Query Playground 🕹️</h2>
                  <p className="text-gray-600">Craft your stock investigation</p>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                    🚨 {error}
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                  <textarea
                    placeholder="Search stocks by criteria..."
                    className="w-full p-4 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <div className="bg-blue-100 p-4 rounded-xl border border-blue-200 md:w-1/3">
                    <h3 className="font-bold text-blue-800 mb-2">🎮 Demo Query</h3>
                    <code className="text-blue-600">
                      Market Capitalization &gt; 50<br />
                      AND P/E Ratio &lt; 20
                    </code>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-full hover:scale-[1.02] transition-transform"
                >
                  Analyze Stocks 🔍
                </button>
                <button
                onClick={saveQueryToLocalStorage}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-full hover:scale-[1.02] transition-transform"
              >
                Save Query 💾
              </button>
              
            <Link
              to="/saved"
              className="text-indigo-600 underline text-sm mt-4 block hover:text-indigo-800"
            >
              View Saved Queries →
            </Link>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
