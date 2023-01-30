import React from "react";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { useEffect } from "react";
import DropdownEmbeddings from "./DropdownEmbeddings";

function gaussianRandom(mean=0, stdev=1) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

const Scatter = (props) => {
  useEffect(() => {
    if (props.data){
        const data = {
            datasets: [{
              data: Array(props.data.length).fill(0).map(
                () => {
                    return {x: gaussianRandom(1), y: gaussianRandom(0)}
                }
              ),
            }],
          };
          const config = {
            type: 'scatter',
            data: data,
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
                    display: false
                  },
                  sampleSize: 2
                },
                y: {
                  grid: {
                    display: false
                  },
                  sampleSize: 2
                }
              },
              plugins: {
                legend: {
                  display: false
                },
                decimation: {
                    enabled: true,
                    algorithm: 'lttb',
                  }
              }
          }};
          const ctx = document.getElementById(`bar-chart ${props.title}`).getContext("2d");
          var myChart = new Chart(ctx, config);
          window.myBar = myChart;
      
          return () => {
              myChart.destroy();
          }
    }
  }, [props.data, props.title]);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words dark:bg-gray-800 bg-white w-full mb-6 rounded">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center justify-between">
            <div></div>
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="text-blueGray-400 mb-1 text-xs font-semibold dark:text-white">
                {props.title}
              </h6>
            <div>
            </div>
                {
                  (props.noDropdown) ?
                  null : <DropdownEmbeddings/>
                }
            </div>
          </div>
        </div>
        <div className={(props.noDropdown) ? "p-2 flex-auto" : "p-5 flex-auto"}>
          <div className="relative h-350-px">
            <canvas id={`bar-chart ${props.title}`}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Scatter;