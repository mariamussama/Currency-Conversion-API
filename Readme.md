# Currency Conversion API

A simple RESTful API for converting currency rates using Node.js. This API integrates with a public currency conversion service to provide accurate exchange rates between different currencies.

## Features

- **Currency Conversion**: Convert currency rates from a source currency to multiple target currencies.
- **Swagger Documentation**: Interactive API documentation using Swagger UI.
- **Rate Limiting**: Prevent abuse with rate limiting functionality.
- **Caching**: Reduce external API requests using in-memory caching.
- **Unit Tests**: Ensure code quality and reliability with comprehensive unit tests.

## Prerequisites

- Node.js (version >= 12.0.0)
- npm (Node Package Manager)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/currency-conversion-api.git
   cd currency-conversion-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up API token:**

   - You can change the `API_TOKEN` in `src/config.js` with your actual API token from the currency conversion provider.

## Getting Started

1. **Start the application:**

   ```bash
   npm start
   ```

   The application will start on `http://localhost:3000`.

2. **Explore API documentation:**

   Open your browser and go to `http://localhost:3000/api-docs` to view and interact with the Swagger documentation.

## API Endpoints

### Convert Currency

Converts a specified amount from a source currency to multiple target currencies.

- **URL:** `/convert`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
      "source": "inr",
      "targets": ["usd", "aed", "eur"],
      "date": "2023-06-20"
  }
  ```

  - `source` (String, required): The source currency code (e.g., "inr").
  - `targets` (Array, required): An array of target currency codes to convert to (e.g., `["usd", "aed", "eur"]`).
  - `date` (String, optional): Date in YYYY-MM-DD format for historical rates (defaults to today if not provided).

- **Response:**

  ```json
  {
      "inr_usd": 0.012085,
      "inr_aed": 0.044382,
      "inr_eur": 0.011266
  }
  ```

  - Returns exchange rates as key-value pairs where the key is `source_target` and the value is the conversion rate.

## Running Tests

Run unit tests to ensure all functionalities are working correctly:

```bash
npm test
```

## Contact

For any questions or feedback, please feel free to contact me at [mariam2000@aucegypt.edu](mailto:mariam2000@aucegypt.edu).