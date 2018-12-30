import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { routes } from "queries";
import View from "View";
import Map from "Map/Map";
import SideBar from "SideBar/SideBar";
import { GeoJson } from "model";
import { Option, none, some } from "fp-ts/lib/Option";

const queries = declareQueries({ routes });

type Props = typeof queries.Props;

type State = {
  selectedRoute: Option<GeoJson>;
  hoveredRoute: Option<GeoJson>;
};

class App extends React.Component<Props, State> {
  state: State = {
    selectedRoute: none,
    hoveredRoute: none
  };

  onRouteSelect = (route: GeoJson) => {
    this.setState({
      selectedRoute:
        this.state.selectedRoute.isSome() &&
        this.state.selectedRoute.value === route
          ? none
          : some(route)
    });
  };

  onRouteHover = (route: Option<GeoJson>) => {
    this.setState({
      hoveredRoute: route
    });
  };

  render() {
    if (!this.props.routes.ready) {
      return null;
    }

    return (
      <View className="app" height="100%">
        <SideBar
          routes={this.props.routes.value}
          onRouteClick={this.onRouteSelect}
          selectedRoute={this.state.selectedRoute}
        />
        <Map
          routes={this.props.routes.value}
          selectedRoute={this.state.selectedRoute}
          hoveredRoute={this.state.hoveredRoute}
          onRouteHover={this.onRouteHover}
        />
      </View>
    );
  }
}

export default queries(App);
