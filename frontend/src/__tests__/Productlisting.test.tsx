import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Productlisting from '../Product-listiing/pages/Productlisting';
import { BrowserRouter } from 'react-router-dom';
import { Product } from '../types';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Backpack',
    price: 109.95,
    description: 'A great backpack',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Test Ring',
    price: 168.0,
    description: 'Gold ring',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 3,
    title: 'Test Hard Drive',
    price: 64.0,
    description: 'External SSD',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61IBJVmLuDL._AC_SY879_.jpg',
    rating: { rate: 3.3, count: 203 },
  },
];

beforeEach(() => {
  jest.useFakeTimers();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Productlisting Component', () => {
  test('renders products list and handles filters', async () => {
    await act(async () => {
      renderWithRouter(<Productlisting />);
    });

    // Check loader initially is gone and products are loaded
    expect(screen.getByText('Discover Our Products')).toBeInTheDocument();
    
    // Check titles exist
    expect(screen.getByText('Test Backpack')).toBeInTheDocument();
    expect(screen.getByText('Test Ring')).toBeInTheDocument();
    expect(screen.getByText('Test Hard Drive')).toBeInTheDocument();

    // Check categories buttons exist
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText("Men's clothing")).toBeInTheDocument();
    expect(screen.getByText('Jewelery')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  test('filters products based on search input', async () => {
    await act(async () => {
      renderWithRouter(<Productlisting />);
    });

    const searchInput = screen.getByPlaceholderText('Search products by title...');
    
    // Type search
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Backpack' } });
    });

    // Loading spinner should be shown during debounce
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Fast-forward timers to complete debounce
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Spinner should be gone
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // "Test Backpack" should be visible, others should be hidden
    expect(screen.getByText('Test Backpack')).toBeInTheDocument();
    expect(screen.queryByText('Test Ring')).not.toBeInTheDocument();
  });

  test('filters products by category tags', async () => {
    await act(async () => {
      renderWithRouter(<Productlisting />);
    });

    const jeweleryBtn = screen.getByText('Jewelery');
    
    await act(async () => {
      fireEvent.click(jeweleryBtn);
    });

    expect(screen.getByText('Test Ring')).toBeInTheDocument();
    expect(screen.queryByText('Test Backpack')).not.toBeInTheDocument();
  });
});
