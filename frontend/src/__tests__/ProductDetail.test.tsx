import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ProductDetail from '../Product-listiing/pages/ProductDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

interface Rating {
  rate: number;
  count: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: Rating;
}

const mockProduct: Product = {
  id: 1,
  title: 'Test Backpack Detail',
  price: 109.95,
  description: 'A great backpack with high reliability and durability.',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  rating: { rate: 4.2, count: 15 },
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderWithRouter = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProductDetail Component', () => {
  test('renders product detailed information', async () => {
    await act(async () => {
      renderWithRouter('/product/1');
    });

    // Check loader is gone and titles display correctly
    expect(screen.getByText('Test Backpack Detail')).toBeInTheDocument();
    expect(screen.getByText('$109.95')).toBeInTheDocument();
    expect(screen.getByText('A great backpack with high reliability and durability.')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  test('adds product to cart when button clicked', async () => {
    await act(async () => {
      renderWithRouter('/product/1');
    });

    const addToCartButton = screen.getByText('Add to Cart');
    expect(addToCartButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(addToCartButton);
    });

    expect(screen.getByText('Added to Cart ✓')).toBeInTheDocument();
  });
});
