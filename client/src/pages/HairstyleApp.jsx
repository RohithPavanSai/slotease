import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const HairstyleApp = () => {
  const [portrait, setPortrait] = useState(null);
  const [hairstyle, setHairstyle] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [portraitFile, setPortraitFile] = useState(null);
  const [hairstyleFile, setHairstyleFile] = useState(null);

  const onDrop = (acceptedFiles, type) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (type === "portrait") {
        setPortraitFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPortrait(reader.result);
        reader.readAsDataURL(file);
      } else {
        setHairstyleFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setHairstyle(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (!portrait || !hairstyle) return alert("Upload both images");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("portrait", portraitFile); // File object from Dropzone
      formData.append("hairstyle", hairstyleFile); // File object from Dropzone

      const response = await axios.post(
        "https://slotease-production-15e5.up.railway.app/api/hairstyle",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setResultImage(response.data.imageUrl);
    } catch (error) {
      console.error("Error applying hairstyle:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Virtual Hairstyle Try-On</h1>

      <div>
        <h2>Upload Portrait</h2>
        <Dropzone onDrop={(files) => onDrop(files, "portrait")} />
        {portrait && <img src={portrait} alt="Portrait Preview" width={200} />}
      </div>

      <div>
        <h2>Upload Hairstyle Reference</h2>
        <Dropzone onDrop={(files) => onDrop(files, "hairstyle")} />
        {hairstyle && (
          <img src={hairstyle} alt="Hairstyle Preview" width={200} />
        )}
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Applying Hairstyle..." : "Apply Hairstyle"}
      </button>

      {resultImage && (
        <div>
          <h2>Result</h2>
          <img src={resultImage} alt="Result" width={300} />
          <a href={resultImage} download="hairstyle_result.png">
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

const Dropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div
      {...getRootProps()}
      style={{ border: "2px dashed #aaa", padding: 20, cursor: "pointer" }}
    >
      <input {...getInputProps()} />
      <p>Drag & drop files here, or click to select files</p>
    </div>
  );
};

export default HairstyleApp;
