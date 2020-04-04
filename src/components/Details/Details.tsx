import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { route, routeReadme } from "../../queries";
import View from "../View";
import Map from "../Map/Map";
import * as RemarkableModule from "remarkable";
import { none } from "fp-ts/lib/Option";
import { Route } from "../../model";
import Button from "@buildo/bento/components/Button";
import { saveAs } from "file-saver";

import "./details.scss";

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
}> {
  componentDidMount() {
    this.forceUpdate();
  }

  render() {
    const images: NodeListOf<HTMLImageElement> = document.querySelectorAll(
      ".markdown img"
    );

    const h1: HTMLElement | null = document.querySelector("h1");

    return (
      <View className="markdown" hAlignContent="center" shrink={false}>
        <View className="wrapper" grow>
          <View grow column style={{ position: "relative" }}>
            <View
              className="actions"
              style={{ left: h1 ? h1.clientWidth : undefined }}
            >
              <Button
                flat
                size="tiny"
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
              <View className="distance" column>
                <span>{this.props.route.properties.length} km</span>
                <label>Distance</label>
              </View>
              <View className="elevation" column>
                <span>{this.props.route.properties.elevationGain} m</span>
                <label>Elevation</label>
              </View>
            </View>
          </View>
          <View className="images" hAlignContent="right" shrink={false}>
            {Array.from(images)
              .filter((_, i) => i === 0)
              .map((image) => (
                <img key={image.src} src={image.src} alt={image.src} />
              ))}
          </View>
        </View>
      </View>
    );
  }
}

const md = new (Remarkable as any)({
  linkify: true
});

const queries = declareQueries({ route, routeReadme });

type Props = typeof queries.Props;

class Details extends React.Component<Props> {
  render() {
    return this.props.route.fold(
      null,
      () => null,
      (route) =>
        this.props.routeReadme.fold(
          null,
          () => null,
          (routeReadme) => {
            if (route.isNone() || routeReadme.isNone()) {
              return null;
            } else {
              return (
                <View className="details" height="100%" grow column>
                  <Markdown
                    routeReadme={routeReadme.value}
                    route={route.value}
                  />
                  <View shrink={false} className="map-wrapper">
                    <Map
                      routes={[route.value]}
                      startPosition="firstRoute"
                      // fake props
                      hoveredRoute={none}
                      selectedRoute={none}
                      onRouteHover={() => {}}
                      onRouteSelect={() => {}}
                      innerRef={() => {}}
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

export default queries(Details);
