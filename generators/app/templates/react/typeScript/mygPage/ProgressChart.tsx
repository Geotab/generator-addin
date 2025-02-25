import React, { memo } from "react";
import { LineChart } from "@geotab/zenith";

const data = [17, 18, 20, 21, 21, 21, 24]

export const ProgressChart = memo(() => {
    return <LineChart
        aria-label="Zenith components per version"
        data={{
            datasets: [
                {
                    data: data,
                    label: 'Amount of components'
                }
            ],
            labels: [
                "1.9.2",
                "1.10.0",
                "1.11.0",
                "1.12.0",
                "1.12.1",
                "1.12.2",
                "1.13.0"
            ]
        }}
        options={{
            onClick: () => { },
            plugins: {
                htmlLegend: {
                    containerID: 'legend-container'
                }
            },
            scales: {
                x: {
                    title: {
                        text: 'Zenith version'
                    }
                },
                y: {
                    title: {
                        text: 'Amount of components'
                    }
                }
            }
        }}
    />;
});
