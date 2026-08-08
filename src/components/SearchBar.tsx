"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { PropertyType } from "@/lib/types";
import { indianStates, getCitiesByState } from "@/lib/locations";

const PROPERTY_TYPES: { value: PropertyType | ""; label: string }[] = [
  { value: "", label: "All types" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "area", label: "Largest area" },
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState(searchParams.get("state") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [type, setType] = useState<PropertyType | "">(
    (searchParams.get("type") as PropertyType) ?? ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "");
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");

  const cities = useMemo(() => (state ? getCitiesByState(state) : []), [state]);

  const handleStateChange = (newState: string) => {
    setState(newState);
    if (newState) {
      const newCities = getCitiesByState(newState);
      setCity(newCities.includes(city) ? city : "");
    } else {
      setCity("");
    }
  };

  const [priceError, setPriceError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPriceError("");
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (
      min !== null &&
      max !== null &&
      !Number.isNaN(min) &&
      !Number.isNaN(max) &&
      min > max
    ) {
      setPriceError("Minimum price cannot exceed maximum price.");
      return;
    }
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (bathrooms) params.set("bathrooms", bathrooms);
    if (sort && sort !== "newest") params.set("sort", sort);
    router.push(`/listings?${params.toString()}`);
  }

  const hasFilters = Boolean(
    state || city || type || minPrice || maxPrice || bedrooms || bathrooms || (sort && sort !== "newest")
  );

  function clearFilters() {
    setState("");
    setCity("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    setSort("newest");
    router.push("/listings");
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 touch-target";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="state" className={labelClass}>State</label>
          <select id="state" value={state} onChange={(e) => handleStateChange(e.target.value)} className={inputClass}>
            <option value="">All states</option>
            {indianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="city" className={labelClass}>City</label>
          <select id="city" value={city} onChange={(e) => setCity(e.target.value)} disabled={!state} className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value as PropertyType | "")} className={inputClass}>
            {PROPERTY_TYPES.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className={labelClass}>Sort by</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className={inputClass}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="minPrice" className={labelClass}>Min price (₹)</label>
          <input id="minPrice" type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className={inputClass} />
        </div>
        <div>
          <label htmlFor="maxPrice" className={labelClass}>Max price (₹)</label>
          <input id="maxPrice" type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bedrooms" className={labelClass}>Min bedrooms</label>
          <select id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={inputClass}>
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bathrooms" className={labelClass}>Min bathrooms</label>
          <select id="bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={inputClass}>
            <option value="">Any</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>
      </div>
      {priceError && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">{priceError}</p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="touch-target px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Clear
          </button>
        )}
        <button type="submit" className="touch-target px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors">
          Search
        </button>
      </div>
    </form>
  );
}
