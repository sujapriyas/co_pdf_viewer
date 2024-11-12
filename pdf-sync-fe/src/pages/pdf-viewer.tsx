import { useParams } from "react-router-dom";
import { Document, Page } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import { server } from "./pdf-upload";

export const PDFViewer = () => {
  const { id } = useParams();
  const [pdfURL, setPdfURL] = useState("");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(2);
  const [ws, setWS] = useState<WebSocket>();
  const [admin, setAdmin] = useState(false);
  const firstRender = useRef(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const downloadFile = async () => {
    const resp = await server.get("/pdf-download/" + id, {
      responseType: "blob",
    });
    const href = URL.createObjectURL(resp.data);
    // window.open(href);
    setPdfURL(href);
  };

  const joinRoom = () => {
    const webSocket = new WebSocket("ws://localhost:8000/ws?roomId=" + id);
    webSocket.onopen = (event) => {
      console.log("joined");
      setWS(webSocket);
    };
    webSocket.onmessage = (messageEvent) => {
      const message = JSON.parse(messageEvent.data);
      console.log("message", message);
      setPageNumber(message.page);
      if (message.admin !== undefined) {
        setAdmin(message.admin);
      }
    };
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    downloadFile();
    joinRoom();
  }, []);

  const onNextClick = () => {
    const c = pageNumber;
    let nextPage = c + 1;
    if (nextPage > numPages) {
      nextPage = 1;
    }
    ws?.send(
      JSON.stringify({
        page: nextPage,
      }),
    );
  };
  const onPrevClick = () => {
    const c = pageNumber;
    let prevPage = c - 1;
    if (prevPage === 0) {
      prevPage = numPages;
    }
    ws?.send(
      JSON.stringify({
        page: prevPage,
      }),
    );
  };

  return (
    <div>
      Joined: {id}
      {pdfURL === "" ? (
        <div> Loading</div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          {admin && <button onClick={onPrevClick}>Prev</button>}
          <div>
            <div
              style={{
                height: 700,
                overflow: "hidden",
                aspectRatio: 0.8,
              }}
            >
              <Document
                options={{}}
                file={pdfURL}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </div>

            <p
              style={{
                color: "white",
              }}
            >
              Page {pageNumber} of {numPages}
            </p>
          </div>
          {admin && <button onClick={onNextClick}>Next</button>}
        </div>
      )}
    </div>
  );
};
