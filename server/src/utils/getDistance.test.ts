import { getDistance } from "./getDistance";

describe("getDistance", () => {
  it("should return 0 for the same point", () => {
    const point = { lat: 48.8566, lng: 2.3522 };
    expect(getDistance(point, point)).toBe(0);
  });

  it("should calculate distance between Paris and Lyon (~390-395 km)", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const lyon = { lat: 45.764, lng: 4.8357 };
    const distance = getDistance(paris, lyon);
    expect(distance).toBeGreaterThan(380);
    expect(distance).toBeLessThan(400);
  });

  it("should calculate distance between Paris and London (~340-345 km)", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const london = { lat: 51.5074, lng: -0.1278 };
    const distance = getDistance(paris, london);
    expect(distance).toBeGreaterThan(330);
    expect(distance).toBeLessThan(350);
  });

  it("should be symmetric (A->B == B->A)", () => {
    const a = { lat: 48.8566, lng: 2.3522 };
    const b = { lat: 40.4168, lng: -3.7038 };
    expect(getDistance(a, b)).toBeCloseTo(getDistance(b, a), 10);
  });
});
