import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { routes } from "../../queries";
import View from "../View";
import { getRouteDistanceInPixels } from "../Map/Map";
import MapWithControls from "../MapWithControls/MapWithControls";
import SideBar from "../SideBar/SideBar";
import { Route } from "../../model";
import { Option, none, some } from "fp-ts/lib/Option";
import sortBy from "lodash/sortBy";

import "./explorer.scss";

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

  onSortRoutes = () => {
    this.forceUpdate();
  };

  updateInnerRef = (map: mapboxgl.Map) => {
    if (this.map.isNone()) {
      this.map = some(map);
      this.forceUpdate();
    }
  };

  render() {
    return this.props.routes.fold(
      null,
      () => null,
      routes => {
        const sortedRoutes: Route[] = this.map.fold(routes, map =>
          sortBy(routes, route =>
            getRouteDistanceInPixels(route, map.getCenter(), map)
          )
        );

        return (
          <View className="explorer" grow>
            <SideBar
              routes={sortedRoutes}
              onRouteClick={this.onRouteSelect}
              selectedRoute={this.state.selectedRoute}
            />
            <MapWithControls
              routes={routes}
              selectedRoute={this.state.selectedRoute}
              hoveredRoute={this.state.hoveredRoute}
              onRouteHover={this.onRouteHover}
              onRouteSelect={this.onRouteSelect}
              onSortRoutes={this.onSortRoutes}
              innerRef={this.updateInnerRef}
              startPosition="userLocation"
              navigatingRoute={none}
              noSleep={false}
              altimeter={false}
              altitudeControl={false}
              drinkingWaterControl={false}
              geoLocateControl
              speedometer={false}
              scale={false}
            />
          </View>
        );
      }
    );
  }
}

export default queries(Explorer);
