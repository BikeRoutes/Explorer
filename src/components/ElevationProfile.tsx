import * as React from "react";
import { Line, defaults } from "react-chartjs-2";
import { Route } from "../model";
import uniq from "lodash/uniq";
import { Option, none } from "fp-ts/lib/Option";

defaults.global.animation = 0;

type Props = {
  route: Route;
  activeRoutePointIndex?: number;
};

export default class ElevationProfile extends React.Component<Props> {
  interval: Option<NodeJS.Timeout> = none;

  render() {
    const scale = Math.round(this.props.route.properties.length / 10) || 1;

    const round = (number: number, roundedInteger: number): number => {
      const remainder = number % roundedInteger;
      const discriminatingFactor = roundedInteger / 2;

      const flooredNumber = Math.round(number - remainder);

      if (remainder < discriminatingFactor) {
        return flooredNumber;
      } else {
        return flooredNumber + roundedInteger;
      }
    };

    const distances = this.props.route.properties.distances;

    const ticks = uniq(distances.map(d => round(d, scale)));

    const elevations = this.props.route.geometry.coordinates.map(c =>
      c[2] ? Math.round(c[2]) : null
    );

    return (
      <Line
        datasetKeyProvider={dataset => dataset.datasetKeyProvider}
        data={{
          datasets: [
            {
              label: "Elevation",
              pointRadius: 0,
              borderWidth: 0,
              yAxisID: "y-axis",
              xAxisID: "x-axis-hidden",
              data: elevations,
              datasetKeyProvider: "elevation"
            },
            {
              xAxisID: "x-axis",
              data: [],
              datasetKeyProvider: "ticks"
            },
            {
              yAxisID: "y-axis",
              data: elevations.map((el, i) =>
                i === this.props.activeRoutePointIndex ? el : null
              ),
              backgroundColor: "#5bb3e0",
              datasetKeyProvider: "userLocation"
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                id: "x-axis-hidden",
                type: "category",
                labels: distances.map(d => d.toFixed(1)),
                display: false
              },
              {
                id: "x-axis",
                labels: ticks,
                ticks: {
                  callback: (value: number) => {
                    return value <= this.props.route.properties.length
                      ? `${value} km`
                      : null;
                  }
                }
              }
            ],
            yAxes: [
              {
                type: "linear",
                id: "y-axis",
                ticks: {
                  precision: 0,
                  maxRotation: 0,
                  stepSize: 50,
                  suggestedMin: this.props.route.properties.minElevation * 0.7,
                  suggestedMax: 300,
                  ticks: {
                    callback: (value: number) => {
                      return `${value} m`;
                    }
                  }
                }
              }
            ]
          },
          tooltips: {
            mode: "index",
            intersect: false,
            callbacks: {
              title: (tooltipItems: any[]) => {
                return `Dist:  ${tooltipItems[0].label} km`;
              },
              label: () => "",
              footer: (tooltipItems: any[], data: unknown) => {
                return `Elev: ${tooltipItems[0].value} m`;
              }
            }
          }
        }}
        legend={null}
        height={50}
      />
    );
  }
}
