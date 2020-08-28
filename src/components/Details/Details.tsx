import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { route, routeReadme } from "../../queries";
import View from "../View";
import MapWithControls from "../MapWithControls/MapWithControls";
import * as RemarkableModule from "remarkable";
import { none, some } from "fp-ts/lib/Option";
import { Route, viewToLocation } from "../../model";
import Button from "@buildo/bento/components/Button";
import { saveAs } from "file-saver";
import { Carousel } from "react-responsive-carousel";
import { declareCommands } from "react-avenger";
import { doUpdateLocation } from "../../commands";
import ElevationProfile from "../ElevationProfile";
import memoize from "memoize-one";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./details.scss";

const { linkify } = require("remarkable/linkify");

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
  getRoutes = memoize(
    (route: Route) => {
      return [route];
    },
    (newArgs: Route[], prevArgs: Route[]): boolean =>
      newArgs[0].id === prevArgs[0].id
  );

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
                    <MapWithControls
                      routes={this.getRoutes(route.value)}
                      startPosition="firstRoute"
                      navigatingRoute={none}
                      hoveredRoute={route} // fixed blue color that is easily visible
                      selectedRoute={none}
                      altimeter={false}
                      altitudeControl={false}
                      geoLocateControl
                      noSleep={false}
                      speedometer={false}
                      scale={false}
                    />
                  </View>
                  <View className="elevation-profile-wrapper" shrink={false}>
                    <ElevationProfile route={route.value} />
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
