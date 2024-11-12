import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Axios } from "axios";

export const server = new Axios({
  baseURL: "http://localhost:8000",
});

function PDFUpload() {
  const navigate = useNavigate();
  const onFileUplaod = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("pdf", file);
    const resp = await server.post("/pdf-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    navigate("/" + resp.data);
  };

  return (
    <>
      <input className="read-the-docs" type="file" onChange={onFileUplaod} />
    </>
  );
}

export default PDFUpload;
