import React from "react";
import { Line } from "react-chartjs-2";
import classes from "./Graph.module.css";
import GraphSettings from "./GraphSettings/GraphSettings";
import { useSelector } from "react-redux";
import GraphDate from "./GraphDate/GraphDate";

const Graph = (props) => {
    const values = useSelector((state) => state.data.values);

    return (
        <div className={classes.Wrapper}>
            <GraphDate />
            <div className={classes.Graph}>
                <Line
                    data={{
                        labels: values.times,
                        datasets: [
                            {
                                label: "Teplota",
                                data: values.temperature,
                                fill: true,
                                backgroundColor: "rgba(85, 186, 254, .3)",
                                borderWidth: 4,
                                borderColor: "#55D8FE",
                                pointRadius: 0,
                            },
                            {
                                pointRadius: 0,
                                label: "Vlhkosť",
                                data: values.humidity,
                                fill: true,
                                backgroundColor: "rgba(163, 160, 251, .3)",
                                borderWidth: 4,
                                borderColor: "#A3A0FB",
                            },
                            {
                                pointRadius: 0,
                                label: "Osvetlenie",
                                data: values.brightness,
                                fill: true,
                                backgroundColor: "rgba(94, 226, 160, .3)",
                                borderWidth: 4,
                                borderColor: "#5EE2A0",
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: { position: "bottom" },
                        tooltips: {
                            mode: "index",
                            intersect: false,
                        },
                        animation: {
                            duration: 0, // general animation time
                        },
                        hover: {
                            mode: "index",
                            intersect: false,
                            animationDuration: 0, // duration of animations when hovering an item
                        },
                        responsiveAnimationDuration: 0, // animation duration after a resize
                        elements: {
                            line: {
                                tension: 0, // disables bezier curves
                            },
                        },
                        scales: {
                            xAxes: [
                                {
                                    offset: false,
                                    ticks: {
                                        autoSkip: true,
                                        autoSkipPadding: 40,
                                        maxRotation: 0,
                                    },
                                },
                            ],
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            ],
                        },
                    }}
                />
            </div>
            <GraphSettings />
        </div>
    );
};

export default Graph;
