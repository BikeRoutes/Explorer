import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { route, routeReadme } from "../../queries";
import View from "../View";
import Map from "../Map/Map";
import * as RemarkableModule from "remarkable";
import { none, some } from "fp-ts/lib/Option";
import { Route, viewToLocation } from "../../model";
import Button from "@buildo/bento/components/Button";
import { saveAs } from "file-saver";
import { Carousel } from "react-responsive-carousel";
import { Line, defaults } from "react-chartjs-2";
import * as geoJsonLength from "geojson-length";
import uniq from "lodash/uniq";
import { declareCommands } from "react-avenger";
import { doUpdateLocation } from "../../commands";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./details.scss";

const { linkify } = require("remarkable/linkify");

defaults.global.animation = 0;

const togpx = require("togpx");

const Remarkable = (RemarkableModule as any).Remarkable as RemarkableModule;

const saveGPX = (route: Route): void => {
  const blob = new Blob([togpx(route)], {
    type: "text/plain;charset=utf-8"
  });

  saveAs(blob, `${route.properties.name}.gpx`);
};

class Markdown extends React.PureComponent<{
  routeReadme: string;
  route: Route;
  onEnterNavigation: () => void;
}> {
  componentDidMount() {
    this.forceUpdate();
  }

  render() {
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(".remarkable img")
    );

    const h1 = document.querySelector<HTMLElement>(
      ".remarkable h1:first-of-type"
    );

    return (
      <View className="markdown" hAlignContent="center" shrink={false}>
        <View className="wrapper" grow>
          <View grow column style={{ position: "relative" }}>
            <View className="title">{h1?.innerText}</View>
            <View className="actions">
              <Button
                flat
                size="medium"
                label="Enter Navigation"
                onClick={this.props.onEnterNavigation}
              />
              <Button
                flat
                size="medium"
                label="Download GPX"
                onClick={() => saveGPX(this.props.route)}
              />
            </View>

            <div
              className="remarkable"
              dangerouslySetInnerHTML={{
                __html: md.render(this.props.routeReadme)
              }}
            />

            <View className="summary">
              <View className="distance" column shrink={false}>
                <span>{this.props.route.properties.length} km</span>
                <label>Distance</label>
              </View>
              <View className="min-elevation" column shrink={false}>
                <span>
                  {Math.round(this.props.route.properties.minElevation)} m
                </span>
                <label>Min elevation</label>
              </View>
              <View className="max-elevation" column shrink={false}>
                <span>
                  {Math.round(this.props.route.properties.maxElevation)} m
                </span>
                <label>Max elevation</label>
              </View>
            </View>
          </View>
          <View className="images" hAlignContent="right" shrink={false}>
            <Carousel
              showThumbs={false}
              showStatus={false}
              showIndicators={images.length > 1}
              infiniteLoop
              autoPlay
              interval={6000}
            >
              {images.map(image => (
                <img key={image.src} src={image.src} alt={image.src} />
              ))}
            </Carousel>
          </View>
          <View className="mobile-images" grow>
            {images.slice(0, 2).map(image => (
              <img key={image.src} src={image.src} alt={image.src} />
            ))}
          </View>
        </View>
      </View>
    );
  }
}

const md = new (Remarkable as any)().use(linkify);

const queries = declareQueries({ route, routeReadme });
const commands = declareCommands({ doUpdateLocation });

type Props = typeof queries.Props & typeof commands.Props;

class Details extends React.Component<Props> {
  render() {
    return this.props.route.fold(
      null,
      () => null,
      route =>
        this.props.routeReadme.fold(
          null,
          () => null,
          routeReadme => {
            if (route.isNone() || routeReadme.isNone()) {
              return null;
            } else {
              const scale = Math.round(route.value.properties.length / 10) || 1;

              const round = (
                number: number,
                roundedInteger: number
              ): number => {
                const remainder = number % roundedInteger;
                const discriminatingFactor = roundedInteger / 2;

                const flooredNumber = Math.round(number - remainder);

                if (remainder < discriminatingFactor) {
                  return flooredNumber;
                } else {
                  return flooredNumber + roundedInteger;
                }
              };

              const distances = route.value.geometry.coordinates.map(
                (_, i) =>
                  geoJsonLength({
                    ...route.value.geometry,
                    coordinates: route.value.geometry.coordinates.slice(
                      0,
                      i + 1
                    )
                  }) / 1000
              );

              const ticks = uniq(distances.map(d => round(d, scale)));

              const elevations = route.value.geometry.coordinates.map(c =>
                c[2] ? Math.round(c[2]) : null
              );

              return (
                <View className="details" height="100%" grow column>
                  <Markdown
                    routeReadme={routeReadme.value}
                    route={route.value}
                    onEnterNavigation={() => {
                      this.props.doUpdateLocation(
                        viewToLocation({
                          view: "navigation",
                          routeId: some(route.value.id)
                        })
                      );
                    }}
                  />

                  <View shrink={false} className="map-wrapper">
                    <Map
                      routes={[route.value]}
                      startPosition="firstRoute"
                      navigating={false}
                      hoveredRoute={route} // fixed blue color that is easily visible
                      // fake props
                      selectedRoute={none}
                      onRouteHover={() => {}}
                      onRouteSelect={() => {}}
                      innerRef={() => {}}
                    />
                  </View>
                  <View className="elevation-profile-wrapper" shrink={false}>
                    <Line
                      data={{
                        datasets: [
                          {
                            label: "Elevation",
                            pointRadius: 0,
                            borderWidth: 0,
                            yAxisID: "y-axis",
                            xAxisID: "x-axis-hidden",
                            data: elevations
                          },
                          {
                            xAxisID: "x-axis",
                            data: []
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
                                  return value < route.value.properties.length
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
                                suggestedMin:
                                  route.value.properties.minElevation * 0.7,
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
                  </View>
                </View>
              );
            }
          }
        )
    );
  }
}

export default commands(queries(Details));
