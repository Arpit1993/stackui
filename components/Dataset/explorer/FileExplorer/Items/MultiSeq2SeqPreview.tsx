import React, { useEffect, useRef, useState } from "react";
import DropdownFile from "./DropdownFile";
import FileTagPopup from "../Popups/FileTagPopup";
import { Tooltip } from "@mui/material";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import FmdBadIcon from "@mui/icons-material/FmdBad";

const MultiSeq2SeqPreview = (props) => {
  const [labels, setLabels] = useState<any>(null);
  const [hover, setHover] = useState<Boolean>(false);
  const [popup, setPopup] = useState<Boolean>(false);
  const [nullStr, setNullStr] = useState<string>("");

  let anomaly: Boolean = false;
  let msg: string = "";

  for (let i = 0; i < props.file["tags"].length; i++) {
    if (props.file["tags"][i].includes("anomaly:")) {
      anomaly = true;
      msg = props.file["tags"][i].replace("anomaly: ", "");
    }
  }

  useEffect(() => {
    fetch(`http://localhost:8000/get_labels?filename=${props.file["name"]}`)
      .then((res) => res.json())
      .then(setLabels);
  }, [props.file]);

  console.log(labels);

  return (
    <>
      {popup ? (
        <FileTagPopup
          shortcuts={props.shortcuts}
          key={`tfpp ${props.file["name"]}`}
          setPopup={setPopup}
          file={props.file}
        />
      ) : (
        <></>
      )}
      {labels ? (
        <div
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
          className={`relative h-full w-full`}
        >
          <div className="absolute z-auto right-2">
            <DropdownFile
              hover={hover}
              selected={props.selected[props.index]}
              shortcuts={props.shortcuts}
              setTagsPopup={props.setTagsPopup}
              setPopup={setPopup}
            />
          </div>
          {props.file["tags"].length > 0 ? (
            <Tooltip title={`${msg}`} placement="top">
              {anomaly ? (
                <button
                  key={`tags-${props.file["name"]}`}
                  className="absolute top-2 right-[70px] mt-2 ml-1 z-20"
                  onClick={() => setPopup(true)}
                >
                  <ErrorOutline className="w-1/10 h-1/10 shadow-sm fill-white rounded-full overflow-hidden bg-red-500 hover:bg-red-700" />
                </button>
              ) : (
                <button
                  key={`tags-${props.file["name"]}`}
                  className="absolute mt-2 ml-1 z-20"
                  onClick={() => setPopup(true)}
                >
                  <FmdBadIcon className="w-7 h-7 shadow-sm fill-red-500 hover:fill-red-700 rounded-full overflow-hidden bg-white" />
                </button>
              )}
            </Tooltip>
          ) : (
            <></>
          )}
          {props.selected[props.index] ? (
            <button
              key={`selected-${props.file["name"]}`}
              className="absolute z-20 right-0 bottom-0 mr-2 mb-1 w-[20px] h-[20px] bg-white/50 border-black border hover:bg-white/30 flex justify-center items-center"
              onClick={() => {
                let arr = props.selected;
                arr.splice(props.index, 1, !props.selected[props.index]);
                props.setSelected(arr);
                props.setPointer(props.index);
                setNullStr(nullStr.concat("x"));
              }}
            >
              <div className="flex w-[20px] h-[20px] items-center justify-center">
                <div className="bg-blue-500 w-[15px] h-4"></div>
              </div>
            </button>
          ) : (
            <button
              key={`nselected-${props.file["name"]}`}
              className={
                !hover
                  ? "invisible absolute z-20 right-0 bottom-0 mr-2 mb-1 w-[20px] h-[20px]"
                  : "absolute z-20 right-0 bottom-0 mr-2 mb-1 w-[20px] h-[20px] bg-white/50 border-black border hover:bg-white/30"
              }
              onClick={() => {
                let arr = props.selected;
                if (props.selected.length > 0) {
                  arr.splice(props.index, 1, !props.selected[props.index]);
                  props.setSelected(arr);
                  props.setPointer(props.index);
                  setNullStr(nullStr.concat("x"));
                }
              }}
            ></button>
          )}

          <button
            className="bg-white z-[10] w-full h-full dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
            key={`${props.index.toString()}defg`}
            onClick={() => props.handleObjectClick(props.file["name"])}
          >
            {
              <button
                className={
                  props.selected[props.index]
                    ? `absolute top-0 z-[19] justify-center flex flex-col h-full w-full bg-blue-500/30 hover:bg-blue-500/50`
                    : `absolute  top-0 z-[19] justify-center flex flex-col h-full w-full hover:bg-white/20`
                }
                key={`${props.index.toString()}defg2`}
                onClick={() => props.handleObjectClick(props.file["name"])}
              ></button>
            }
            <div
              className="grid grid-cols-4 py-1 bg-white z-[10] overflow-scroll border-b dark:border-gray-700 w-full dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
              key={`${props.index.toString()}abc`}
              onClick={() => props.handleObjectClick(props.file["name"])}
            >
              {labels.keys.map((k) => {
                return (
                  <div
                    key={`dasdsdsa${k}`}
                    className="w-full gap-3 flex px-6 py-2 font-medium whitespace-nowrap text-ellipsis overflow-hidden text-gray-900 dark:text-white text-left"
                  >
                    <span
                      className="py-1 px-2 text-ellipsis"
                      key={`label ${k}`}
                    >
                      {k}
                    </span>
                  </div>
                );
              })}
              <div
                style={{ gridColumn: `4` }}
                className="w-full gap-3 flex px-6 py-2 font-base whitespace-nowrap text-ellipsis overflow-hidden text-gray-900 dark:text-white text-left"
              >
                <span className="border border-gray-300 py-1 px-2 text-ellipsis">{`${labels.res}`}</span>
              </div>
            </div>
          </button>
        </div>
      ) : null}
    </>
  );
};

export default MultiSeq2SeqPreview;
