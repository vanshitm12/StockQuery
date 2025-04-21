# Stock Filtering App

## Features
- Filter stocks based on various financial metrics
- Sort columns in the stock table
- Pagination support
- Example query formatting

## Tech Stack
- React
- Tailwind CSS

## Installation

1. **Install dependencies**
Make sure you have Node.js installed. Then, install the required dependencies:

```bash
npm install
```

2. **Run the application**
Once the dependencies are installed, run the development server:
```bash
npm start
```

Your app should now be running at http://localhost:3000.



### Filter Stocks: 
Enter filter criteria using the "Search Query" text field.
Sort Columns: Click on any of the column headers in the table to sort the data.
Pagination: Use the "Previous" and "Next" buttons to navigate between pages.
I have used the data in the JSON format for the ease.

#### Example Query:

- Market Capitalization > 50 AND P/E Ratio < 20
- Debt-to-Equity Ratio = 1.97 AND Dividend Yield >= 4.36

  These 2 queries will help you understand how to write the queries


#### Writing a Query:
The query syntax follows the pattern of "Parameter Comparison Value" where:

- The query should be in **[Parameter Operator Value]** format and also you can use the AND for the more the one conditions.
- The parameter should be written with a valid spelling.
- Use the parameters correctly and dont put any symbols behind it like % , : etc.
- Use the AND operator like it is shown in the query.
- You can use as many AND operators as you want to do.

#### Operators
 - &gt; (greater than)
  
- <  (less than)

- =  (equal to)

- &gt;= (greater than or equal to)
  
- <= (less than or equal to)

#### Parameters
- Market Capitalization
- P/E Ratio
- ROE
- Debt-to-Equity Ratio
- Dividend Yield
- Revenue Growth
- EPS Growth
- Current Ratio
- Gross Margin
  

Value is the number to compare with (e.g., 50, 20).

