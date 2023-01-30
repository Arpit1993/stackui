import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Chart, registerables } from 'chart.js';
import YOLOMetadata from "./YOLOMetadata";
import NERMetadata from "./NERMetadata";
import QAMetadata from "./QAMetadata";

Chart.register(...registerables);

const Curve = (props) => {

    const [log, setLog] = useState<any>(null)
    const [schema, setSchema] = useState<any>(null)
    const time = useRef(true)

    useEffect(() => {
        if (time.current){
            time.current = false
            fetch(`http://localhost:8000/get_logs_experiment?log=${props.logs}`).then((res) => res.json()).then((res) => {setLog(res)})
            fetch(`http://localhost:8000/schema?`).then((res) => res.json()).then(setSchema)
        }
        var config = {
            type: "line",
            data: {
                labels: (log) ? Object.keys(log): [],
                datasets: [
                {
                    label: 'losses',
                    backgroundColor: "#3182ce",
                    borderColor: "#3182ce",
                    data: (log) ?  [...log.map((l) => {return l.log.loss})] : [],
                    fill: false,
                },
                ],
            },
            options: {
                animation: false,
                maintainAspectRatio: false,
                responsive: true,
                title: {
                    display: false,
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                hover: {
                    mode: "nearest",
                    intersect: true,
                },
                scales: {
                    xAxes: [
                        {
                        ticks: {
                            fontColor: "rgba(255,255,255,.7)",
                        },
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: "Month",
                            fontColor: "white",
                        },
                        gridLines: {
                            display: false,
                            borderDash: [2],
                            borderDashOffset: [2],
                            color: "rgba(33, 37, 41, 0.3)",
                            zeroLineColor: "rgba(0, 0, 0, 0)",
                            zeroLineBorderDash: [2],
                            zeroLineBorderDashOffset: [2],
                        },
                        },
                    ],
                    yAxes: [
                        {
                        ticks: {
                            fontColor: "rgba(255,255,255,.7)",
                        },
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: "Value",
                            fontColor: "white",
                        },
                        gridLines: {
                            borderDash: [3],
                            borderDashOffset: [3],
                            drawBorder: false,
                            color: "rgba(255, 255, 255, 0.15)",
                            zeroLineColor: "rgba(33, 37, 41, 0)",
                            zeroLineBorderDash: [2],
                            zeroLineBorderDashOffset: [2],
                        },
                        },
                    ],
                },
            },
        };
        var ctx = document.getElementById(`curve-chart for log ${props.date}`).getContext("2d");
        var myLine = new Chart(ctx, config);
        window.myLine = myLine;
        return () => {
            myLine.destroy();
        }
    }, [props, log]);
    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded bg-blueGray-700">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                        <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                            Loss curve
                        </h6>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div className="relative h-350-px">
                        <canvas id={`curve-chart for log ${props.date}`}></canvas>
                    </div>
                </div>
            </div>
            {
                (log && schema) ? 
                (schema.value == 'yolo') ? <YOLOMetadata key={'metadata'} mtdt={log[log.length-1]['metadata']}  date={props.date} /> :
                (schema.value.includes('ner'))  ? <NERMetadata key={'metadata'} mtdt={log[log.length-1]['metadata']} date={props.date} /> :
                (schema.value.includes('qa'))  ? <QAMetadata key={'metadata'} mtdt={log[log.length-1]['metadata']} date={props.date} /> : null
                : null
            }
        </>
    );
}

export default Curve