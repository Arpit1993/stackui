/* eslint-disable @next/next/no-img-element */
// import Image from "next/image"
import React, { useEffect, useState, useRef, useCallback } from "react";
import YOLOHistoryList from "./History/YOLOHistoryList";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import CanvasBoundingBoxes from "./Items/CanvasBoundingBoxes";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ColorPick from "./Items/ColorPick";
import DeleteIcon from "@mui/icons-material/Delete";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

async function dataURItoBlob(dataURI) {
  const blob = await fetch(dataURI).then((res) => res.blob());
  return blob;
}

const YOLOViz = (props) => {
  const [usableStr, setUsableStr] = useState<string>("Id");
  const [usableStr2, setUsableStr2] = useState<string>("name");
  const [active, setActive] = useState<Array<any>>([]);
  const [selectedLabel, setSelectedLabel] = useState<Array<any>>([]);
  const [labelMap, setLabelMap] = useState<any>({});
  const [labels, setLabels] = useState<Array<any>>([]);
  const [nullstr, setNullStr] = useState<String>("");
  const updated_labels = useRef<Array<any>>([]);
  const newRef = useRef<Array<any>>([]);
  const [first, setFirst] = useState<Boolean>(true);
  const [waiting, setWaiting] = useState<Boolean>(true);

  const [editing, setEditing] = useState<Boolean>(false);
  const [options, setOptions] = useState<Boolean>(true);
  const [shortcuts, setShortcuts] = useState<Boolean>(false);

  const myRef = useRef<any>(null);
  const executeScroll = () => myRef.current.scrollIntoView();

  let boxes: Array<any> = [];

  let im = document.createElement("img");
  im.src = props.img;
  const [imWidth, setImWidth] = useState<number>(props.ww);
  const [imHeight, setImHeight] = useState<number>(props.wh);
  const [width, setWidth] = useState<number>(props.ww);
  const [height, setHeight] = useState<number>(props.wh);

  im.onload = () => {
    setImWidth(im.width);
    setImHeight(im.height);
    if ((props.wh / im.height) * im.width < props.ww) {
      setWidth((props.wh / im.height) * im.width);
      setHeight(props.wh);
    } else {
      setWidth(props.ww);
      setHeight((props.ww / im.width) * im.height);
    }
    setWaiting(false);
  };

  const auto_label = async (img) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_KEY as string}`,
        },
        method: "POST",
        body: await dataURItoBlob(img),
      }
    )
      .then((res) => res.json())
      .then((data: Array<any>) => {
        let arr_copy2 = labelMap;

        if (data.length > 0) {
          let arr_copy0 = active;
          let arr_copy: Array<any> = Object.values(updated_labels.current);
          for (let i = 0; i < data.length; i++) {
            const res = data[i];
            console.log(res);
            let idx2 = Object.keys(arr_copy2).findIndex(
              (el) =>
                arr_copy2[el]["label"].toLowerCase() == res.label.toLowerCase()
            );
            if (idx2 > 0) {
              arr_copy.push([
                arr_copy2[idx2]["class"],
                (res.box.xmin + res.box.xmax) / (2 * imWidth),
                (res.box.ymin + res.box.ymax) / (2 * imHeight),
                (res.box.xmax - res.box.xmin) / imWidth,
                (res.box.ymax - res.box.ymin) / imHeight,
              ]);
            } else {
              arr_copy.push([
                "-1",
                (res.box.xmin + res.box.xmax) / (2 * imWidth),
                (res.box.ymin + res.box.ymax) / (2 * imHeight),
                (res.box.xmax - res.box.xmin) / imWidth,
                (res.box.ymax - res.box.ymin) / imHeight,
              ]);
            }
            arr_copy0.push(true);
          }
          setActive(() => {
            return arr_copy0;
          });
          setLabels(() => {
            return arr_copy;
          });

          let dic_copy = Object.assign({}, arr_copy);
          dic_copy["keyId"] = props.keyId;
          updated_labels.current = dic_copy;

          props.setnewLabels(() => {
            return updated_labels.current;
          });
          props.setSubmit(true);
        }
      });
  };

  const addNewLabel = () => {
    let arr_copy: Array<any> = Object.values(updated_labels.current);
    arr_copy.push(["Id", 400, 250, 0, 0]);
    const idx1 = arr_copy.indexOf(props.keyId);
    if (idx1 > -1) {
      arr_copy.splice(idx1, 1);
    }
    setLabels(() => {
      return arr_copy;
    });
    let dic_copy = Object.assign({}, arr_copy);
    dic_copy["keyId"] = props.keyId;
    updated_labels.current = dic_copy;
    props.setnewLabels(() => {
      return updated_labels.current;
    });
    props.setSubmit(true);

    newRef.current = Array(arr_copy.length).fill(false);
    newRef.current[newRef.current.length - 1] = true;
    setUsableStr("Id");
    setUsableStr2("Name");
    setNullStr(nullstr.concat("z"));

    let sel_arr = Array(arr_copy.length).fill(false);
    sel_arr[sel_arr.length - 1] = true;
    setSelectedLabel(() => {
      return sel_arr;
    });
    setNullStr(nullstr.concat("z"));

    setEditing(true);
    executeScroll();
    let arr_copy = active;
    arr_copy.push(true);
    setActive(() => {
      return arr_copy;
    });
    setNullStr(nullstr.concat("z"));
  };

  const deleteLabel = (idx) => {
    let arr_copy = Object.values(updated_labels.current);
    arr_copy.splice(idx, 1);
    const idx1 = arr_copy.indexOf(props.keyId);
    if (idx1 > -1) {
      arr_copy.splice(idx1, 1);
    }
    newRef.current = Array(arr_copy.length).fill(false);
    let dic_copy = Object.assign({}, arr_copy);
    dic_copy["keyId"] = props.keyId;
    updated_labels.current = dic_copy;
    props.setnewLabels(() => {
      return updated_labels.current;
    });
    props.setSubmit(true);
    setUsableStr("Id");
    setUsableStr2("name");
    setLabels(() => {
      return arr_copy;
    });
    setNullStr(nullstr.concat("z"));
  };

  const handleKeyPress = useCallback(
    (event) => {
      console.log(selectedLabel);
      if (event.ctrlKey) {
        if (event.key == "n") {
          event.preventDefault();
          addNewLabel();
          setOptions(true);
        } else if (event.key == "e") {
          event.preventDefault();
          setEditing(!editing);
        } else if (event.key == "d") {
          event.preventDefault();
          for (let i = 0; i < selectedLabel.length; i++) {
            if (selectedLabel[i] == true) {
              deleteLabel(i);
            }
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      setOptions,
      setEditing,
      active,
      addNewLabel,
      deleteLabel,
      editing,
      updated_labels,
      newRef,
      selectedLabel,
    ]
  );

  useEffect(() => {
    if (first || props.loading) {
      fetch(
        `http://localhost:8000/get_labels?filename=${props.keyId}&version=${props.label_version}`
      )
        .then((response) => response.json())
        .then((res) => {
          setLabels(Object.values(res));
          setActive(() => {
            return Array(Object.values(res).length).fill(true);
          });
          setSelectedLabel(() => {
            return Array(Object.values(res).length).fill(false);
          });
          updated_labels.current = res;
          newRef.current = Array(Object.values(res).length).fill(false);
        })
        .then(() => {
          fetch(`http://localhost:8000/get_class_map`)
            .then((response) => response.json())
            .then((res) => {
              setLabelMap(() => {
                return res;
              });
            });
        })
        .then(() => {
          setFirst(false);
        });
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.keyId, props.label_version, handleKeyPress, props.loading]);

  if (!first) {
    let rect: Array<any> = [];
    for (let i = 0; i < labels.length; i++) {
      const w = labels[i][3] * width;
      const h = labels[i][4] * height;

      const x = (props.ww - width) / 2 + labels[i][1] * width - w / 2;
      const y = (props.wh - height) / 2 + labels[i][2] * height - h / 2;

      rect.push({
        x: Math.floor(x),
        y: Math.floor(y),
        h: Math.floor(h),
        w: Math.floor(w),
        class: labels[i][0],
        new: newRef,
      });
    }

    boxes.push(
      <CanvasBoundingBoxes
        new={newRef}
        loading={props.loading}
        rect={rect}
        ww={props.ww}
        wh={props.wh}
        width={width}
        height={height}
        updated_labels={updated_labels}
        setUsableStr={setUsableStr}
        setUsableStr2={setUsableStr2}
        img={im}
        keyId={props.keyId}
        setEditing={setEditing}
        labelMap={labelMap}
        selected={selectedLabel}
        setEdit={setSelectedLabel}
        setSubmit={props.setSubmit}
        setnewLabels={props.setnewLabels}
        editing={editing}
        diff={props.diff}
        setLabels={setLabels}
        active={active}
      />
    );
  }

  return (
    <>
      {
        // (waiting || !(props.img)) ?
        // <LoadingScreen/>
        // :
        <div className={"relative  w-full h-full"}>
          <div className="relative flex justify-center w-full h-full">
            <div
              className={
                newRef.current.includes(true)
                  ? "absolute top-0 left-0 cursor-crosshair"
                  : "absolute top-0 left-0"
              }
            >
              {Object.keys(labelMap).length > 0 ? boxes : null}
            </div>
            {props.diff ? null : (
              <>
                {/* <button onClick={()=>{setOptions(!options)}} 
                                    className={options ? "z-30 flex gap-1 absolute right-[-75px] top text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-500 dark:text-white dark:border-gray-600 dark:hover:bg-gray-900 dark:hover:border-gray-600 dark:focus:ring-gray-700" : "z-30 flex gap-1 absolute right-[-75px] top text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                                    <FormatListBulletedIcon className="w-[20px] h-[20px]"/>
                                </button> */}
                <ul className="absolute right-[-287px] top-0 text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                  <li className="w-full">
                    <button
                      onClick={() => {
                        setOptions(true);
                        setShortcuts(false);
                      }}
                      className={
                        options || (selectedLabel.includes(true) && !shortcuts)
                          ? "flex w-full p-2 text-gray-900 bg-gray-100 rounded-l-lg  active focus:outline-none dark:bg-gray-700 dark:text-white"
                          : "flex w-full p-2 bg-white hover:text-gray-700 rounded-l-lg  hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                      }
                      aria-current="page"
                    >
                      <FormatListBulletedIcon className="w-[20px] h-[20px] mr-2" />
                      {"Labels"}
                    </button>
                  </li>
                  <li className="w-full">
                    <button
                      onClick={() => {
                        setOptions(false);
                        setShortcuts(false);
                        setSelectedLabel(() => {
                          return Array(selectedLabel.length).fill(false);
                        });
                      }}
                      className={
                        !(options || selectedLabel.includes(true)) && !shortcuts
                          ? "inline-block w-full p-2 text-gray-900 bg-gray-100 active focus:outline-none dark:bg-gray-700 dark:text-white"
                          : "inline-block w-full p-2 bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                      }
                    >
                      {"History"}
                    </button>
                  </li>
                  <li className="w-full">
                    <button
                      onClick={() => {
                        setShortcuts(true);
                        setOptions(false);
                      }}
                      className={
                        shortcuts
                          ? "w-full flex p-2 text-gray-900 bg-gray-100 rounded-r-lg active focus:outline-none dark:bg-gray-700 dark:text-white"
                          : "w-full flex p-2 bg-white rounded-r-lg hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                      }
                    >
                      <KeyboardIcon className="w-[20px] h-[20px] mr-2" />
                      {"Shortcuts"}
                    </button>
                  </li>
                </ul>
                {!(options || selectedLabel.includes(true)) ? (
                  <div className="z-50 absolute right-[-298px] flex flex-col gap-1 top-14 w-[37%] h-[80%] dark:text-white">
                    <YOLOHistoryList key={"YOLOHist"} keyId={props.keyId} />
                  </div>
                ) : (
                  <div className="z-50 absolute right-[-300px] justify-between flex flex-col gap-1 top-20 w-[37%] h-[80%] p-1 rounded-md bg-white dark:bg-gray-900">
                    <div className="relative items-center flex flex-col h-[80%] rounded-md">
                      <div className="w-full h-12 items-center grid grid-cols-5 mb-4 rounded-md border border-gray-300 dark:border-gray-600">
                        <button
                          onClick={() => {
                            let arr_copy = Array(active.length).fill(
                              active.includes(false)
                            );
                            setActive(() => {
                              return arr_copy;
                            });
                            setNullStr(nullstr.concat("z"));
                          }}
                        >
                          {active.includes(true) ? (
                            <Visibility className="w-5 h-5" />
                          ) : (
                            <VisibilityOff className="w-5 h-5" />
                          )}
                        </button>
                        <div className="font-semibold text-center text-gray-900 dark:text-white">
                          {"Id"}
                        </div>
                        <div className="font-semibold text-justify text-gray-900 dark:text-white">
                          {"Display"}
                        </div>
                        <div className="font-semibold  text-gray-900 dark:text-white">
                          {"Color"}
                        </div>
                        <DeleteIcon className="w-5 h-5 ml-5" />
                      </div>
                      <div className="w-full h-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-600 dark:text-white overflow-scroll">
                        {labels.map((label, idx) => (
                          <div
                            key={`checkbox-labels-${idx}`}
                            className={`${
                              selectedLabel[idx]
                                ? "bg-gray-100 dark:bg-gray-700"
                                : ""
                            } w-full h-max rounded-t-lg border-b border-gray-200 dark:border-gray-600`}
                          >
                            <div className="w-full items-center h-10 grid grid-cols-5">
                              <button
                                onClick={() => {
                                  let arr_copy = active;
                                  arr_copy.splice(idx, 1, !active[idx]);
                                  setActive(() => {
                                    return arr_copy;
                                  });
                                  setNullStr(nullstr.concat("z"));
                                }}
                              >
                                {active[idx] ? (
                                  <Visibility className="w-5 h-5" />
                                ) : (
                                  <VisibilityOff className="w-5 h-5" />
                                )}
                              </button>
                              {selectedLabel[idx] ? (
                                <form
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    let arr_copy1: Array<Array<any>> =
                                      Object.values(updated_labels.current);
                                    const idx1 = arr_copy1.indexOf(props.keyId);
                                    if (idx1 > -1) {
                                      arr_copy1.splice(idx1, 1);
                                    }
                                    arr_copy1[idx][0] = usableStr;
                                    let dic_copy = Object.assign({}, arr_copy1);
                                    dic_copy["keyId"] = props.keyId;
                                    updated_labels.current = dic_copy;
                                    props.setnewLabels(() => {
                                      return updated_labels.current;
                                    });
                                    props.setSubmit(true);
                                    setLabels(arr_copy1);

                                    let arr_copy = Array(
                                      selectedLabel.length
                                    ).fill(false);
                                    setSelectedLabel(() => {
                                      return arr_copy;
                                    });
                                    setNullStr(nullstr.concat("ds"));
                                  }}
                                >
                                  <label>
                                    <input
                                      className="w-full h-max text-black dark:bg-gray-900 dark:text-white text-xs"
                                      type="text"
                                      value={usableStr}
                                      onChange={(e) => {
                                        props.setSubmit(true);
                                        let arr_copy1: Array<Array<any>> =
                                          Object.values(updated_labels.current);
                                        const idx1 = arr_copy1.indexOf(
                                          props.keyId
                                        );
                                        if (idx1 > -1) {
                                          arr_copy1.splice(idx1, 1);
                                        }
                                        arr_copy1[idx][0] = e.target.value;
                                        let dic_copy = Object.assign(
                                          {},
                                          arr_copy1
                                        );
                                        dic_copy["keyId"] = props.keyId;
                                        updated_labels.current = dic_copy;
                                        props.setnewLabels(() => {
                                          return updated_labels.current;
                                        });
                                        setLabels((arr_copy1) => {
                                          return arr_copy1;
                                        });
                                        setUsableStr(e.target.value);
                                      }}
                                    />
                                  </label>
                                </form>
                              ) : (
                                <button
                                  className="cursor-text text-center"
                                  onClick={() => {
                                    setNullStr(nullstr.concat("as"));
                                    let arr_copy1 = Array(
                                      selectedLabel.length
                                    ).fill(false);
                                    arr_copy1[idx] = !selectedLabel[idx];

                                    setSelectedLabel(() => {
                                      return arr_copy1;
                                    });
                                    setNullStr(nullstr.concat("as"));
                                    setUsableStr(label[0]);
                                    setUsableStr2(
                                      labelMap[label[0]]
                                        ? labelMap[label[0]].label
                                        : ""
                                    );
                                  }}
                                >
                                  {label[0]}
                                </button>
                              )}

                              {selectedLabel[idx] ? (
                                <form
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    let arr_copy2 = labelMap;

                                    let idx2 = Object.keys(arr_copy2).findIndex(
                                      (el) =>
                                        arr_copy2[el]["label"] == usableStr2
                                    );
                                    if (idx2 >= 0) {
                                      let arr_copy1: Array<Array<any>> =
                                        Object.values(updated_labels.current);
                                      const idx1 = arr_copy1.indexOf(
                                        props.keyId
                                      );
                                      if (idx1 > -1) {
                                        arr_copy1.splice(idx1, 1);
                                      }
                                      arr_copy1[idx][0] =
                                        arr_copy2[Object.keys(arr_copy2)[idx2]][
                                          "class"
                                        ];
                                      let dic_copy = Object.assign(
                                        {},
                                        arr_copy1
                                      );
                                      dic_copy["keyId"] = props.keyId;
                                      updated_labels.current = dic_copy;
                                      props.setnewLabels(() => {
                                        return updated_labels.current;
                                      });
                                      setLabels((arr_copy1) => {
                                        return arr_copy1;
                                      });
                                    } else {
                                      if (arr_copy2[label[0]]) {
                                        arr_copy2[label[0]].label = usableStr2;
                                      } else {
                                        arr_copy2[label[0]] = {};
                                        arr_copy2[label[0]].label = usableStr2;
                                        arr_copy2[label[0]].class = label[0];
                                      }
                                    }

                                    setLabelMap(arr_copy2);
                                    let data = JSON.stringify(arr_copy2);
                                    fetch(
                                      "http://localhost:8000/set_class_map/",
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: data,
                                      }
                                    );

                                    let arr_copy = Array(
                                      selectedLabel.length
                                    ).fill(false);
                                    setSelectedLabel(() => {
                                      return arr_copy;
                                    });
                                    setNullStr(nullstr.concat("ds"));
                                  }}
                                >
                                  <label>
                                    <input
                                      className="w-full h-max text-black dark:bg-gray-900 dark:text-white text-xs"
                                      type="text"
                                      value={usableStr2}
                                      onChange={(e) => {
                                        setUsableStr2(e.target.value);
                                      }}
                                    />
                                  </label>
                                </form>
                              ) : (
                                <button
                                  className="cursor-text flex justify-start"
                                  onClick={() => {
                                    setNullStr(nullstr.concat("as"));
                                    let arr_copy1 = Array(
                                      selectedLabel.length
                                    ).fill(false);
                                    arr_copy1[idx] = !selectedLabel[idx];

                                    setSelectedLabel(() => {
                                      return arr_copy1;
                                    });
                                    setNullStr(nullstr.concat("as"));
                                    setUsableStr(label[0]);
                                    setUsableStr2(
                                      labelMap[label[0]]
                                        ? labelMap[label[0]].label
                                        : ""
                                    );
                                  }}
                                >
                                  {labelMap[label[0]]
                                    ? labelMap[label[0]]["label"]
                                    : "No name"}
                                </button>
                              )}

                              {Object.keys(labelMap).length > 0 ? (
                                labelMap[label[0]] ? (
                                  <ColorPick
                                    map={labelMap}
                                    setMap={setLabelMap}
                                    setStr={setNullStr}
                                    idx={label[0]}
                                  />
                                ) : null
                              ) : null}

                              <button
                                onClick={() => {
                                  deleteLabel(idx);
                                }}
                              >
                                <ClearIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div ref={myRef} className="mt-10"></div>
                      </div>
                    </div>
                    <div className="mb-5 mt-2 flex justify-center w-full">
                      <button
                        onClick={addNewLabel}
                        className={
                          "z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        }
                      >
                        <AddIcon className="h-[20px] w-[20px]" />
                        {"Add"}
                      </button>

                      <button
                        onClick={() => {
                          auto_label(props.img);
                        }}
                        className={
                          "z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        }
                      >
                        <EmojiObjectsIcon className="h-[20px] w-[20px]" />
                        {"AI-Suggestions"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {props.diff ? null : (
              <>
                <div
                  className={
                    shortcuts
                      ? "dark:text-white px-7 z-50 absolute right-[-300px] justify-start flex flex-col gap-1 top-20 w-[37%] h-[80%] p-1 bg-white dark:bg-gray-900"
                      : "invisible z-50 absolute right-[-160px] justify-between flex flex-col gap-1 top-14 w-1/5 h-3/4"
                  }
                >
                  <div className="flex mt-5 gap-1 justify-between px-2 items-center font-medium">
                    {"Previous:"}
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 512"
                      >
                        <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z" />
                      </svg>
                    </kbd>
                  </div>
                  <div className="flex mt-5 gap-1 justify-between px-2 items-center font-medium">
                    {"Next:"}
                    <div className="flex gap-2 items-center">
                      <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                        <svg
                          className="w-4 h-4"
                          aria-hidden="true"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 512"
                        >
                          <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
                        </svg>
                      </kbd>
                    </div>
                  </div>
                  <div className="flex mt-5 gap-1 justify-between px-2 items-center font-medium">
                    {"Add:"}
                    <div className="flex gap-2 items-center">
                      <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                        CTRL
                      </kbd>
                      <div>{"+"}</div>
                      <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                        N
                      </kbd>
                    </div>
                  </div>
                  <div className="flex mt-5 gap-1 justify-between px-2 items-center font-medium">
                    {"Delete:"}
                    <div className="flex gap-2 items-center">
                      <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                        CTRL
                      </kbd>
                      <div>{"+"}</div>
                      <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                        D
                      </kbd>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      }
    </>
  );
};
export default YOLOViz;
