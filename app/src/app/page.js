"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [info, setInfo] = useState([]);
  const [form, setForm] = useState({ name: "", long_url: "" });
  const [copiedId, setCopiedId] = useState(null);

  const fetchInfo = async () => {
    try {
      const response = await axios.get("/api/todos");
      setInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      await fetchInfo();
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.long_url) {
      alert("Both name and long URL are required.");
      return;
    }

    try {
      await axios.post("/api/todos", form);
      setForm({ name: "", long_url: "" });
      await fetchInfo();
    } catch (error) {
      console.error("Failed to create short URL:", error.response?.data || error.message);
    }
  };

  const handleCopy = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Short URL Generator</h1>

      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={{
            padding: "0.5rem",
            width: "200px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="text"
          name="long_url"
          placeholder="Long URL"
          value={form.long_url}
          onChange={handleChange}
          style={{
            padding: "0.5rem",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create
        </button>
      </form>

      {info?.length > 0 ? (
        info.map((value) => {
          const fullShortUrl = `${window.location.origin}/${value.short_url}`;
          return (
            <div
              key={value._id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
                marginBottom: "1.5rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              <div style={{ fontSize: "1.1rem", fontWeight: 500 }}>{value.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <a
                  href={value.long_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0070f3", textDecoration: "underline", fontSize: "0.95rem" }}
                >
                  {fullShortUrl}
                </a>
                <button
                  onClick={() => handleCopy(fullShortUrl, value._id)}
                  style={{
                    padding: "0.3rem 0.6rem",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  {copiedId === value._id ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => handleDelete(value._id)}
                  style={{
                    padding: "0.3rem 0.6rem",
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ fontStyle: "italic", color: "#888" }}>No URLs found.</p>
      )}
    </div>
  );
}



