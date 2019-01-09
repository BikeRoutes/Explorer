import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { route, routeReadme } from "queries";
import View from "View";
import Map from "../Map/Map";
import * as Remarkable from "remarkable";

import "./details.scss";
import { none } from "fp-ts/lib/Option";
import { Route } from "model";

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

    return (
      <View className="markdown" hAlignContent="center" shrink={false}>
        <View style={{ maxWidth: 1200 }} grow>
          <View basis="70%" column>
            <View
              className="remarkable"
              column
              grow
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
          <View className="images" hAlignContent="right" basis="30%">
            {Array.from(images).map(image => (
              <img key={image.src} src={image.src} />
            ))}
          </View>
        </View>
      </View>
    );
  }
}

const md = new Remarkable({
  linkify: true
});

const queries = declareQueries({ route, routeReadme });

type Props = typeof queries.Props;

class Details extends React.Component<Props> {
  render() {
    if (
      !this.props.route.ready ||
      this.props.route.value.isNone() ||
      !this.props.routeReadme.ready ||
      this.props.routeReadme.value.isNone()
    ) {
      return null;
    }

    return (
      <View className="details" height="100%" grow column>
        <Markdown
          routeReadme={this.props.routeReadme.value.value}
          route={this.props.route.value.value}
        />
        <View basis={600} className="map-wrapper">
          <Map
            routes={[this.props.route.value.value]}
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

export default queries(Details);
