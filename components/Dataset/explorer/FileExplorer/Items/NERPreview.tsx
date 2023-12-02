import React, { useEffect, useRef, useState } from "react";
import DropdownFile from "./DropdownFile";
import FileTagPopup from "../Popups/FileTagPopup";
import { Tooltip } from "@mui/material";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import FmdBadIcon from "@mui/icons-material/FmdBad";

const stringToColour = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }

  return colour;
};

const NERPreview = (props) => {
  const [labels, setLabels] = useState<Array<any>>([]);
  const [entities, setEntities] = useState<Array<any>>([]);
  const [hover, setHover] = useState<Boolean>(false);
  const [popup, setPopup] = useState<Boolean>(false);
  const [nullStr, setNullStr] = useState<string>("");
  const [preview, setPreview] = useState<Array<any>>([]);
  const sentence = useRef<string>("");

  let anomaly: Boolean = false;
  let msg: string = "";

  for (let i = 0; i < props.file["tags"].length; i++) {
    if (props.file["tags"][i].includes("anomaly:")) {
      anomaly = true;
      msg = props.file["tags"][i].replace("anomaly: ", "");
    }
  }

  useEffect(() => {
    fetch(`http://localhost:8000/get_text?key=${props.file["name"]}`)
      .then((res) => res.json())
      .then((res) => {
        sentence.current = res["text"];
      })
      .then(() =>
        fetch(`http://localhost:8000/get_labels?filename=${props.file["name"]}`)
      )
      .then((res) => res.json())
      .then((res) => {
        let updated_labels = res;
        let order: Array<any> = [];
        let array_spans: Array<any> = [];

        updated_labels = updated_labels.sort((a, b) => {
          if (a.start > b.start) {
            return 1;
          } else {
            return -1;
          }
        });

        let start = 0;

        let x = [];
        for (let j = 0; j < updated_labels.length; j++) {
          if (updated_labels[j].start <= 1 && updated_labels[j].end > 0) {
            x.push(j);
          }
        }

        let entities_per_index: Array<any> = [x];
        let chars: Array<any> = [sentence.current[0]];

        for (let i = 1; i < sentence.current.length; i++) {
          if (updated_labels.map((val) => val.end == i).includes(true)) {
            order.push(
              sentence.current.slice(start, i).replace(/ /g, "\u00A0")
            );
            start = i;
          } else if (
            updated_labels.map((val) => val.start == i + 1).includes(true)
          ) {
            order.push(
              sentence.current.slice(start, i).replace(/ /g, "\u00A0")
            );
            start = i;
          } else if (i == sentence.current.length - 1) {
            order.push(
              sentence.current.slice(start, i + 1).replace(/ /g, "\u00A0")
            );
          }

          let x: Array<any> = [];
          for (let j = 0; j < updated_labels.length; j++) {
            if (updated_labels[j].start <= i + 1 && updated_labels[j].end > i) {
              x.push(j);
            }
          }
          entities_per_index.push(x);
          chars.push(sentence.current[i]);
        }

        start = 0;
        for (let i = 0; i < order.length; i++) {
          const idx_1 = i;
          let child: any = [
            <span
              key={`child${idx_1}--1`}
              className="w-max flex justify-start items-center h-min text-base cursor-text"
            >
              {" "}
              {order[idx_1].replace(/ /g, "\u00A0")}{" "}
            </span>,
          ];

          start =
            start >= entities_per_index.length
              ? entities_per_index.length - 1
              : start;

          for (let j = 0; j < entities_per_index[start].length; j++) {
            const idx_0 = start;
            const idx_2 = j;
            const entity_type =
              updated_labels[entities_per_index[start][idx_2]]["type"];

            child = [
              <button
                key={`child${idx_1}-${idx_2}`}
                className="w-max relative bg-white flex justify-start"
                style={{
                  backgroundColor: `${stringToColour(entity_type)}22`,
                  border: `1px solid ${stringToColour(entity_type)}AA`,
                }}
              >
                {child}
              </button>,
            ];
          }
          start = start + order[i].length;
          array_spans.push(child);
        }

        setPreview(() => {
          return array_spans;
        });

        let str_array: Array<any> = [];
        let ent_array: Array<any> = [];
        let tok_array: Array<any> = [];
        for (let i = 0; i < res.length; i++) {
          const entity = res[i]["type"];

          str_array.push(
            <div
              className="px-1 w-fit h-min text-ellipsis overflow-hidden max-w-1/3"
              style={{
                backgroundColor: `${stringToColour(res[i]["type"])}44`,
                border: `solid ${stringToColour(res[i]["type"])}`,
              }}
            >
              {res[i]["type"]}
            </div>
          );

          ent_array.push(
            <div
              className="px-1 w-fit h-6 text-ellipsis overflow-hidden max-w-1/3"
              style={{
                backgroundColor: `${stringToColour(res[i]["type"])}22`,
                border: `solid ${stringToColour(res[i]["type"])}`,
              }}
            >
              {sentence.current.substring(res[i]["start"] - 1, res[i]["end"])}
            </div>
          );

          tok_array.push(
            sentence.current.substring(res[i]["start"] - 1, res[i]["end"])
          );
        }

        setLabels(() => {
          return str_array;
        });

        setEntities(() => {
          return ent_array;
        });
      });
  }, [props.file]);

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
              // <button key={`tags-${props.file['name']}`} className="absolute border z-20 ml-1 mt-1 w-[15px] h-4 bg-red-500 rounded-full hover:bg-red-700" onClick={() => setPopup(true)}>
              // </button>
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
            className="grid grid-cols-3 bg-white z-[10] border-b w-full h-full dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
            key={`${props.index.toString()}abc`}
            onClick={() => props.handleObjectClick(props.file["name"])}
          >
            <div className="w-full flex px-6 py-4 font-normal whitespace-nowrap text-ellipsis overflow-hidden text-gray-900 dark:text-white text-left">
              {preview}
            </div>
            <div className="w-full px-6 py-4 flex overflow-hidden gap-2 items-center">
              {entities.slice(0, 5)}
            </div>
            <div className="w-full px-6 py-4 flex overflow-hidden gap-2 items-center">
              {labels.slice(0, 5)}
            </div>
          </div>
        </button>
      </div>
    </>
  );
};

export default NERPreview;
