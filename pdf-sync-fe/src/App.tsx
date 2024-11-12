import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PDFUpload from "./pages/pdf-upload";
import { PDFViewer } from "./pages/pdf-viewer";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const router = createBrowserRouter([
  {
    path: "/",
    element: <PDFUpload />,
  },
  {
    path: "/:id",
    element: <PDFViewer />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
