import React from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { useEffect } from "react";

const Histogram = (props) => {
  useEffect(() => {
    if (props.data) {
      const keys = Object.keys(props.data);
      const config = {
        type: "bar",
        data: {
          labels: keys,
          datasets: [
            {
              fill: true,
              backgroundColor: "#3182ce",
              borderColor: "#3182ce",
              data: keys.map((key) => {
                return props.data[key];
              }),
              barThickness: 500 / keys.length,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: "Orders Chart",
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
            x: {
              grid: {
                display: false,
              },
              ticks: {
                autoSkip: true,
                // maxRotation: 90,
                // minRotation: 90
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      };
      const ctx = document
        .getElementById(`bar-chart ${props.docid ? props.docid : props.title}`)
        .getContext("2d");
      let myChart = new Chart(ctx, config);
      window.myBar = myChart;

      return () => {
        myChart.destroy();
      };
    }
  }, [props.data, props.title]);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words dark:bg-gray-800 bg-white w-full mb-6 rounded">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="text-blueGray-400 mb-1 text-xs font-semibold">
                {props.title}
              </h6>
            </div>
          </div>
        </div>
        <div className="p-2 flex-auto">
          <div className="relative overflow-scroll h-350-px">
            <canvas
              id={`bar-chart ${props.docid ? props.docid : props.title}`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Histogram;
