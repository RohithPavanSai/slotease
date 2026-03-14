// HairstyleTryOn.jsx
import React, { useEffect, useState, useRef } from "react";

const API_BASE = "https://api.aihairstyles.com/api/v1"; // docs use /api/v1 endpoints
// If you get CORS issues, route requests through your server (recommended for production).

export default function HairstyleTryOn() {
  const [styles, setStyles] = useState([]);
  const [selectedStyleId, setSelectedStyleId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [jobId, setJobId] = useState(null);
  const [resultImages, setResultImages] = useState([]);
  const [status, setStatus] = useState("");
  const pollRef = useRef(null);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_AI_HAIRSTYLES_KEY || "",
  };
  console.log("API KEY:", import.meta.env.VITE_AI_HAIRSTYLES_KEY);
  useEffect(() => {
    // Get available styles
    async function fetchStyles() {
      try {
        const res = await fetch(`${API_BASE}/styles`, { headers });
        const json = await res.json();
        if (json && json.data) {
          setStyles(json.data);
          if (json.data.length) setSelectedStyleId(String(json.data[0].id));
        } else {
          console.error("Unexpected styles response", json);
        }
      } catch (err) {
        console.error("Failed to fetch styles", err);
      }
    }
    fetchStyles();
    // cleanup on unmount
    return () => clearInterval(pollRef.current);
  }, []);

  async function submitGeneration(e) {
    e.preventDefault();
    if (!imageUrl) return alert("Please provide an image URL (publicly accessible).");
    if (!selectedStyleId) return alert("Choose a style first.");

    setStatus("submitting");
    setResultImages([]);
    setJobId(null);

    try {
      const body = {
        mode: "live",                    // "live" or "test"
        gender: "person",                // optional: "person" | "male" | "female" ...
        styles: [selectedStyleId],       // array of style ids (strings/numbers)
        hair_colour: "brown",            // optional color name or id
        image_url: imageUrl,             // you can use image_name if image already uploaded to AIHairstyles
        force_new_hairline: false
      };

      const res = await fetch(`${API_BASE}/generation/hairstyle`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        console.error("Generation error", json);
        return alert("Generation failed: " + (json?.message || res.statusText));
      }

      const newJobId = json?.data?.id;
      setJobId(newJobId);
      setStatus("queued");

      // start polling
      pollRef.current = setInterval(() => pollStatus(newJobId), 2000);
    } catch (err) {
      setStatus("error");
      console.error(err);
      alert("Request failed: " + err.message);
    }
  }

  async function pollStatus(id) {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/generation/${id}`, { headers });
      const json = await res.json();
      if (!res.ok) {
        console.error("Status check failed", json);
        setStatus("error");
        clearInterval(pollRef.current);
        return;
      }
      const data = json.data || {};
      setStatus(data.status || "unknown");

      if (data.status === "completed" && Array.isArray(data.images)) {
        setResultImages(data.images);
        clearInterval(pollRef.current);
      } else if (data.status === "failed") {
        clearInterval(pollRef.current);
        alert("Generation failed: " + (json.message || "unknown error"));
      }
      // otherwise continue polling
    } catch (err) {
      console.error("Polling error", err);
      clearInterval(pollRef.current);
      setStatus("error");
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: "24px auto", fontFamily: "sans-serif" }}>
      <h2>AIHairstyles — Try a hairstyle</h2>

      <form onSubmit={submitGeneration} style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Image URL (public):{" "}
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://.../your-selfie.jpg"
            style={{ width: "100%" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Choose style:
          <select
            value={selectedStyleId}
            onChange={(e) => setSelectedStyleId(e.target.value)}
            style={{ display: "block", marginTop: 6 }}
          >
            {styles.length === 0 && <option>Loading styles...</option>}
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.description || s.tags || s.id}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" style={{ padding: "8px 14px", marginTop: 8 }}>
          Generate hairstyle
        </button>
      </form>

      <div>
        <strong>Status:</strong> {status} {jobId ? ` (job: ${jobId})` : ""}
      </div>

      <div style={{ marginTop: 12 }}>
        {resultImages.length > 0 && (
          <>
            <h4>Results</h4>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {resultImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`result-${i}`}
                  style={{ width: 220, height: "auto", borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,.12)" }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}