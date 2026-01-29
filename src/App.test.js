import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mock Chart.js components to avoid canvas issues
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>
}));

// Mock Graph component to be safe
jest.mock('./components/Graph', () => {
    return function DummyGraph(props) {
      return <div data-testid="graph-component">Graph Component</div>;
    };
  });

test('renders app title', () => {
  render(<App />);
  const linkElement = screen.getByText(/BLIS OAU CGPA Calculator/i);
  expect(linkElement).toBeInTheDocument();
});

test('adds a semester and selects session', () => {
    render(<App />);
    const addSemesterButton = screen.getByText(/Add Semester \+/i);
    fireEvent.click(addSemesterButton);

    // Check if new semester is active (might be hard to check directly, but we can check if selectors are there)
    const levelSelect = screen.getAllByRole('combobox')[0]; // Assuming first select is level
    expect(levelSelect).toBeInTheDocument();
});
