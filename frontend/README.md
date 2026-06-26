# Product Listing Application - React Developer Assignment

A responsive, high-performance product listing page built using **React.js (Vite)**, **TypeScript**, and **Bootstrap (v5)**. The application fetches real-time product data from a public API, supports dynamic item detail viewing, and includes pagination, category sorting, search filtering, and robust unit tests.

## Features

- **Responsive Grid**: Developed using Bootstrap's grid system to ensure mobile-friendly responsiveness across all screen sizes.
- **Client-Side Filtering & Sorting**: Includes a search input at the top to filter items by title, category tags (Electronics, Jewelery, Men's Clothing, Women's Clothing) to filter items, and select dropdowns to sort by price (low to high, high to low) and rating.
- **Loading UX**: Displays responsive skeleton cards during initial API fetch and loading spinners during search debounce.
- **Dynamic Routing**: Uses React Router to enable dynamic `/product/:id` routing for displaying individual product descriptions, detailed ratings, status, and cart operations.
- **TypeScript Implementation**: Fully typed application code, including component props and data-fetching payload structures.
- **Unit Testing**: Tests core component interactions, searching, filtering, and detail navigation using Jest and React Testing Library.

## Tech Stack

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Bootstrap (v5), Custom CSS
- **Routing**: React Router (v7)
- **Tests**: Jest, React Testing Library, ts-jest

---

## Setup & Running Instructions

Follow these steps to run the application locally:

### 1. Clone the repository and navigate to the project directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
The application will launch on your local host (usually `http://localhost:5173`).

### 4. Run tests
To execute the unit tests with Jest:
```bash
npm run test
```

### 5. Build for Production
To bundle the application for production:
```bash
npm run build
```

---

## Assumptions Made

1. **Client-Side Filtering**: Since the Fake Store API does not support search endpoints, search filtering is executed client-side.
2. **Search Debounce**: Implemented a 300ms debounce when typing to avoid rendering layout churn on every keypress and display a loading spinner to simulate a realistic search query experience.
3. **Cart Operations**: Simulated cart operations since there is no persistent backend; clicking "Add to Cart" temporarily transitions the button UI state to "Added to Cart ✓".
