"use client";

import { useEffect, useState } from "react";

export default function MyComponent({ params }) {
  const [longUrl, setLongUrl] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params?.id) return;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) throw new Error("Failed to fetch URLs");

        const json = await res.json();
        const match = json.find((item) => item.short_url === params.id);

        if (match) {
          setLongUrl(match.long_url);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotFound(true);
      }
    };

    fetchData();
  }, [params?.id]);

  // 🔁 Trigger redirect after longUrl is set
  useEffect(() => {
    if (longUrl) {
      window.open(longUrl, "_self"); // Redirect in the same tab
    }
  }, [longUrl]);

  return (
    <div>
      {longUrl ? (
        <p>Redirecting to {longUrl}...</p>
      ) : notFound ? (
        <p>No matching short URL found.</p>
      ) : (
        <p>Checking for match...</p>
      )}
    </div>
  );
}
