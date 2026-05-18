import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import '@testing-library/jest-dom';
import HomePage from "./HomePage";

vi.mock("./BalanceWidget", () => ({ default: () => <div data-testid="balance-widget" /> }));
vi.mock("./HomeExpensesCard", () => ({ default: () => <div data-testid="expenses-card" /> }));
vi.mock("./HomeGoalsCard", () => ({ default: () => <div data-testid="goals-card" /> }));
vi.mock("./HomeOperationsCard", () => ({ default: () => <div data-testid="operations-card" /> }));

describe("HomePage Component", () => {
  it("renders without crashing and displays all widgets", () => {
    const { getByTestId } = render(<HomePage />);
    expect(getByTestId("expenses-card")).toBeInTheDocument();
    expect(getByTestId("balance-widget")).toBeInTheDocument();
    expect(getByTestId("goals-card")).toBeInTheDocument();
    expect(getByTestId("operations-card")).toBeInTheDocument();
  });
});
