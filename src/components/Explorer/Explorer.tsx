import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { routes } from "queries";
import View from "View";
import Map, { getRouteDistanceInPixels } from "Map/Map";
import SideBar from "SideBar/SideBar";
import { Route } from "model";
import { Option, none, some } from "fp-ts/lib/Option";
import sortBy = require("lodash/sortBy");

const queries = declareQueries({ routes });

type Props = typeof queries.Props;

type State = {
  selectedRoute: Option<Route>;
  hoveredRoute: Option<Route>;
};

class Explorer extends React.Component<Props, State> {
  map: Option<mapboxgl.Map> = none;

  state: State = {
    selectedRoute: none,
    hoveredRoute: none
  };

  onRouteSelect = (route: Route) => {
    this.setState({
      selectedRoute:
        this.state.selectedRoute.isSome() &&
        this.state.selectedRoute.value === route
          ? none
          : some(route)
    });
  };

  onRouteHover = (route: Option<Route>) => {
    this.setState({
      hoveredRoute: route
    });
  };

  render() {
    const routes = this.props.routes;
    if (!routes.ready) {
      return null;
    }

    const sortedRoutes: Route[] = this.map.fold(routes.value, map =>
      sortBy(routes.value, route =>
        getRouteDistanceInPixels(route, map.getCenter(), map)
      )
    );

    return (
      <View height="100%" grow>
        <SideBar
          routes={sortedRoutes}
          onRouteClick={this.onRouteSelect}
          selectedRoute={this.state.selectedRoute}
        />
        <Map
          routes={routes.value}
          selectedRoute={this.state.selectedRoute}
          hoveredRoute={this.state.hoveredRoute}
          onRouteHover={this.onRouteHover}
          onRouteSelect={this.onRouteSelect}
          innerRef={map => (this.map = map)}
          startPosition="userLocation"
        />
      </View>
    );
  }
}

export default queries(Explorer);
