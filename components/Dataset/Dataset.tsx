import React from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "../LoadingScreen";
import TopBar from "./explorer/topbar/topbar";
import FileExplorer from "./explorer/FileExplorer/FileExplorer";
import NERExplorer from "./explorer/FileExplorer/NERExplorer";
import YOLOExplorer from "./explorer/FileExplorer/YOLOExplorer";
import NERStatistics from "./tabs/statistics/NERStatistics";
import YOLOStatistics from "./tabs/statistics/YOLOStatistics";
import QAStatistics from "./tabs/statistics/QAStatistics";
import Experiments from "./tabs/experiments/Experiments";

import Link from "next/link";
import Seq2SeqExplorer from "./explorer/FileExplorer/Seq2SeqExplorer";
import SeqToSeqStatistics from "./tabs/statistics/SeqToSeqStatistics";
import QA2Explorer from "./explorer/FileExplorer/QA2Explorer";
import MultiSeq2SeqExplorer from "./explorer/FileExplorer/MultiSeq2SeqExplorer";

const Dataset = () => {
  // states for each json
  const [tab, setTab] = useState<number>(0);
  const [files, setFiles] = useState<Array<any>>([]);
  const [URI, setURI] = useState({
    schema: "",
    storage: "",
    dataset: "",
    storage_dataset: "",
  });
  const [commits, setCommits] = useState<Array<any>>([]);
  const [len, setLen] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [waiting, setWaiting] = useState<Boolean>(true);
  const [schema, setSchema] = useState<string>("files");
  const [view, setView] = useState<Boolean>(
    schema == "yolo" || schema == "labelbox" ? false : true
  );
  const [filtering, setFiltering] = useState<string>("x");
  const [max_view, setMaxView] = useState<number>(view ? 36 : 36);
  const first = useRef(true);
  const router = useRouter();
  const shortcuts = useRef<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const dataset = router.query.dataset;

  const cancelRequest = useRef<any>(null);

  // reads the API endpoints

  useEffect(() => {
    const fetchFiles = async () => {
      let view_ex = view;
      let max_view_var = max_view;

      if (cancelRequest.current) {
        for (let i = 0; i < cancelRequest.current.length; i++) {
          cancelRequest.current[i].abort();
        }
        cancelRequest.current = [];
      } else {
        cancelRequest.current = [];
      }

      if (first.current) {
        shortcuts.current = true;
        fetch(
          "http://localhost:8000/connect/?uri=".concat(dataset as string)
        ).then(() => {
          fetch(`http://localhost:8000/schema`)
            .then((response) => response.json())
            .then((res) => {
              setSchema(res.value);
              if (res.value == "yolo" || res.value == "labelbox") {
                view_ex = false;
                max_view_var = 36;
                setFiles(() => {
                  return Array(1).fill({
                    name: "",
                    base_name: "",
                    last_modified: "",
                    thumbnail: "/Icons/icon-image-512.webp",
                    tags: [],
                  });
                });
              }
              if (
                res.value.includes("ner") ||
                res.value.includes("qa") ||
                res.value.includes("seq")
              ) {
                view_ex = false;
                max_view_var = 7;
                setView(false);
                setMaxView(7);
              }
              first.current = false;
            })
            .then(() => {
              let length = 0;

              fetch(`http://localhost:8000/uri`)
                .then((response) => response.json())
                .then((res) => {
                  console.log(res);
                  setURI(res);
                  if (res.storage_dataset) {
                    fetch(
                      "http://localhost:8000/connect/?uri=".concat(
                        dataset as string
                      )
                    );
                  }
                  length = res.storage_dataset.length;

                  fetch(
                    `http://localhost:8000/current?page=${page}&max_pp=${max_view_var}`
                  )
                    .then((response) => response.json())
                    .then(async (current) => {
                      setLen(current.len);

                      let files_: Array<any> = [];
                      for (let i = 0; i < current.keys.length; i++) {
                        const isImage = [
                          current.keys[i].includes(".jpg"),
                          current.keys[i].includes(".png"),
                          current.keys[i].includes(".jpeg"),
                          current.keys[i].includes(".tiff"),
                          current.keys[i].includes(".bmp"),
                          current.keys[i].includes(".eps"),
                        ].includes(true);
                        if (isImage && !view_ex) {
                          setWaiting(true);
                          const controller = new AbortController();
                          const { signal } = controller;

                          cancelRequest.current.push(controller);
                          try {
                            const tags = await fetch(
                              `http://localhost:8000/get_tags?file=${current.keys[i]}`,
                              { signal }
                            ).then((res) => res.json());

                            files_.push({
                              name: current.keys[i],
                              base_name: current.keys[i].substring(length),
                              last_modified: current.lm[i],
                              // thumbnail: await thumbnail_,
                              thumbnail: null,
                              tags: await tags,
                            });
                          } catch {
                            return;
                          }
                        } else {
                          const controller = new AbortController();
                          const { signal } = controller;

                          cancelRequest.current.push(controller);

                          try {
                            const tags = await fetch(
                              `http://localhost:8000/get_tags?file=${current.keys[i]}`,
                              { signal }
                            ).then((res) => res.json());

                            files_.push({
                              name: current.keys[i],
                              base_name: current.keys[i].substring(length),
                              last_modified: current.lm[i],
                              thumbnail: (await isImage)
                                ? "/Icons/icon-image-512.webp"
                                : "/Icons/file-icon.jpeg",
                              tags: await tags,
                            });
                          } catch {
                            return;
                          }
                        }
                      }

                      setWaiting(false);
                      setFiles([]);
                      setFiles(() => {
                        console.log(files_);
                        return files_;
                      });
                      setLoading(false);
                    });
                });
            });
        });
      } else {
        let length = 0;

        fetch(`http://localhost:8000/uri`)
          .then((response) => response.json())
          .then((res) => {
            console.log(res);
            setURI(res);
            length = res.storage_dataset.length;

            fetch(
              `http://localhost:8000/current?page=${page}&max_pp=${max_view_var}`
            )
              .then((response) => response.json())
              .then(async (current) => {
                setLen(current.len);

                let files_: Array<any> = [];
                for (let i = 0; i < current.keys.length; i++) {
                  const isImage = [
                    current.keys[i].includes(".jpg"),
                    current.keys[i].includes(".png"),
                    current.keys[i].includes(".jpeg"),
                    current.keys[i].includes(".tiff"),
                    current.keys[i].includes(".bmp"),
                    current.keys[i].includes(".eps"),
                  ].includes(true);
                  if (isImage && !view_ex) {
                    setWaiting(true);
                    const controller = new AbortController();
                    const { signal } = controller;

                    cancelRequest.current.push(controller);
                    try {
                      const tags = await fetch(
                        `http://localhost:8000/get_tags?file=${current.keys[i]}`,
                        { signal }
                      ).then((res) => res.json());

                      files_.push({
                        name: current.keys[i],
                        base_name: current.keys[i].substring(length),
                        last_modified: current.lm[i],
                        // thumbnail: await thumbnail_,
                        thumbnail: null,
                        tags: await tags,
                      });
                    } catch {
                      return;
                    }
                  } else {
                    const controller = new AbortController();
                    const { signal } = controller;

                    cancelRequest.current.push(controller);

                    try {
                      const tags = await fetch(
                        `http://localhost:8000/get_tags?file=${current.keys[i]}`,
                        { signal }
                      ).then((res) => res.json());

                      files_.push({
                        name: current.keys[i],
                        base_name: current.keys[i].substring(length),
                        last_modified: current.lm[i],
                        thumbnail: (await isImage)
                          ? "/Icons/icon-image-512.webp"
                          : "/Icons/file-icon.jpeg",
                        tags: await tags,
                      });
                    } catch {
                      return;
                    }
                  }
                }

                setWaiting(false);
                setFiles([]);
                setFiles(() => {
                  console.log(files_);
                  return files_;
                });
                setLoading(false);
              });
          });
      }
    };

    if (dataset) {
      fetchFiles();
      const newLocal: number = 4;
      fetch(
        `http://localhost:8000/last_n_commits/?n=`.concat(newLocal.toString())
      )
        .then((response) => response.json())
        .then((data) => Object.values(data))
        .then((res) => setCommits(res as []));
    }
  }, [page, view, filtering, max_view, router.query, dataset]);

  const dataprops = {
    dataset: URI.dataset,
    URI: URI.storage,
    storage_dataset: URI.storage_dataset,
  };

  let props = {
    files: files,
    dataprops: dataprops,
    dataset: URI.storage_dataset,
  };

  return (
    <div className="flex flex-col">
      <nav className="flex p-2 h-10" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/Datasets">
              <button className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </button>
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                {URI.dataset}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="flex justify-between w-full">
        {loading ? <LoadingScreen key={"loading_screen_dataset"} /> : null}
        <div className="w-full h-fit">
          <div className="h-fit bg-gray-100 dark:bg-gray-800">
            <div className="h-fit">
              <TopBar
                tab={tab}
                setTab={setTab}
                commits={commits}
                dataset={URI.storage_dataset}
                shortcuts={shortcuts}
                props={props.dataprops}
                setFiltering={setFiltering}
                schema={schema}
                setPage={setPage}
                filtering={filtering}
              />
            </div>
          </div>
          <div className="flex w-full h-[80%]">
            <div className="px-5 relative w-[100%] h-[80%] mt-2">
              {tab == 0 ? (
                schema.includes("qa") ? (
                  <QA2Explorer
                    shortcuts={shortcuts}
                    schema={schema}
                    max_view={max_view}
                    setFiltering={setFiltering}
                    setMaxView={setMaxView}
                    waiting={waiting}
                    files={files}
                    dataset={URI.dataset}
                    page={page}
                    setPage={setPage}
                    view={view}
                    setView={setView}
                    len={len}
                  />
                ) : schema.includes("ner") ? (
                  <NERExplorer
                    shortcuts={shortcuts}
                    schema={schema}
                    max_view={max_view}
                    setFiltering={setFiltering}
                    setMaxView={setMaxView}
                    waiting={waiting}
                    files={files}
                    dataset={URI.dataset}
                    page={page}
                    setPage={setPage}
                    view={view}
                    setView={setView}
                    len={len}
                  />
                ) : schema.includes("multi_seq") ? (
                  <MultiSeq2SeqExplorer
                    cancelRequest={cancelRequest}
                    shortcuts={shortcuts}
                    setFiltering={setFiltering}
                    schema={schema}
                    max_view={max_view}
                    setMaxView={setMaxView}
                    waiting={waiting}
                    files={files}
                    dataset={URI.dataset}
                    page={page}
                    setPage={setPage}
                    view={view}
                    setView={setView}
                    len={len}
                  />
                ) : schema.includes("seq") ? (
                  <Seq2SeqExplorer
                    cancelRequest={cancelRequest}
                    shortcuts={shortcuts}
                    setFiltering={setFiltering}
                    schema={schema}
                    max_view={max_view}
                    setMaxView={setMaxView}
                    waiting={waiting}
                    files={files}
                    dataset={URI.dataset}
                    page={page}
                    setPage={setPage}
                    view={view}
                    setView={setView}
                    len={len}
                  />
                ) : schema == "yolo" || schema == "labelbox" ? (
                  <YOLOExplorer
                    cancelRequest={cancelRequest}
                    shortcuts={shortcuts}
                    schema={schema}
                    max_view={max_view}
                    setFiltering={setFiltering}
                    setMaxView={setMaxView}
                    waiting={waiting}
                    files={files}
                    dataset={URI.dataset}
                    page={page}
                    setPage={setPage}
                    view={view}
                    setView={setView}
                    len={len}
                  />
                ) : (
                  <FileExplorer
                    cancelRequest={cancelRequest}
                    shortcuts={shortcuts}
                    schema={schema}
                    max_view={max_view}
                    setFiltering={setFiltering}
                    setMaxView={setMaxView}
                    waiting={waiting}
                    files={files}
                    dataset={URI.dataset}
                    page={page}
                    setPage={setPage}
                    view={view}
                    setView={setView}
                    len={len}
                  />
                )
              ) : tab == 1 ? (
                schema == "yolo" || schema == "labelbox" ? (
                  <YOLOStatistics
                    schema={schema}
                    filtering={filtering}
                    shortcuts={shortcuts}
                  />
                ) : schema.includes("ner") ? (
                  <NERStatistics
                    schema={schema}
                    filtering={filtering}
                    shortcuts={shortcuts}
                  />
                ) : schema.includes("seq") ? (
                  <SeqToSeqStatistics
                    schema={schema}
                    filtering={filtering}
                    shortcuts={shortcuts}
                  />
                ) : schema.includes("qa") ? (
                  <QAStatistics
                    schema={schema}
                    filtering={filtering}
                    shortcuts={shortcuts}
                  />
                ) : (
                  <></>
                )
              ) : tab == 2 ? (
                <Experiments schema={schema} shortcuts={shortcuts} />
              ) : (
                <></>
              )}
            </div>
            {/* <div className="px-5 w-[20%] h-[80%]">
                            <Infobar shortcuts={shortcuts} commits={commits} dataset={URI.storage_dataset}/>
                        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dataset;
