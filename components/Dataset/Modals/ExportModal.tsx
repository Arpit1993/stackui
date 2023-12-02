import React, { useEffect, useRef, useState } from "react";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import posthog from "posthog-js";

const ExportModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const ref = useRef(null);

  const controller = new AbortController();
  const { signal } = controller;

  const exportDataset = async (format) => {
    if (format == "openai") {
      if (downloading) {
        controller.abort();
        setDownloading(false);
      } else {
        setDownloading(true);
        fetch("http://localhost:8000/export_openai", { signal })
          .then((res) => res.blob())
          .then((blob) => {
            let file = window.URL.createObjectURL(blob);
            window.location.assign(file);
            setDownloading(false);
          });
      }
    } else {
      if (downloading) {
        controller.abort();
        setDownloading(false);
      } else {
        setDownloading(true);
        fetch("http://localhost:8000/download_api", { signal })
          .then((res) => res.blob())
          .then((blob) => {
            let file = window.URL.createObjectURL(blob);
            window.location.assign(file);
            setDownloading(false);
          });
      }
    }
  };

  return (
    <>
      {
        <button
          key={"ccb"}
          onClick={() => {
            props.setPopup(false);
          }}
          className=" bg-black/50 z-[48] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen"
        >
          click to close
        </button>
      }
      <div
        key={"brnchpp"}
        ref={props.ref_}
        className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative bg-white w-[700px] rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Export for Training
            </h3>
            <button
              onClick={() => {
                props.setPopup(false);
              }}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-3 space-y-6 gap-2 w-full flex flex-col justify-center">
            <div className="w-full h-full flex gap-2">
              <button
                onClick={() => exportDataset("openai")}
                className="w-full justify-center gap-2 flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <img
                  src="/Icons/openai-icon-505x512-pr6amibw.png"
                  className="invert w-5 h-5"
                />
                OpenAI
              </button>
              <button
                onClick={() => exportDataset("hf")}
                className="w-full flex justify-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <img
                  src="/Icons/huggingface_logo-noborder.svg"
                  className="w-5 h-5"
                />
                HuggingFace
              </button>
            </div>
            <button
              onClick={() => exportDataset("")}
              className="w-full flex justify-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <SystemUpdateAltIcon className="w-5 h-5" />
              Export Original
            </button>
          </div>
          <div className="flex justify-center items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={() => {
                props.setPopup(false);
              }}
              className="w-full flex justify-center gap-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportModal;
