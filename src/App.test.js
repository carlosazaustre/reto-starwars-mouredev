import { render, screen } from "@testing-library/react";
import App from "./App";
import data from "./data.json";

describe("Star Wars APP", () => {
  beforeAll(() => jest.spyOn(window, "fetch"));

  it("should show a list of characters from the API", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });

    render(<App />);
    expect(window.fetch).toHaveBeenCalledTimes(2);
    expect(window.fetch).toHaveBeenCalledWith(
      "http://swapi.dev/api/people/?page=1"
    );

    for (let character of data.results) {
      expect(await screen.findByText(character.name)).toBeInTheDocument();
    }
  });

  it("should show an error message when has a network error", async () => {
    window.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<App />);

    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });

  it("should show an error message if there's a network error", async () => {
    window.fetch.mockRejectedValue(new Error("Network error"));

    render(<App />);
    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
  });

  it("should show an error message if there's a server error", async () => {
    window.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(<App />);
    expect(
      await screen.findByText(/There was a server error./i)
    ).toBeInTheDocument();
  });

  it("should show an error message if there's a NotFound error", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<App />);
    expect(
      await screen.findByText(/The resource you requested was not found./i)
    ).toBeInTheDocument();
  });
});
