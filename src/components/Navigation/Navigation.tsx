import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { route } from "../../queries";
import View from "../View";
import { none } from "fp-ts/lib/Option";
import { declareCommands } from "react-avenger";
import { doUpdateLocation } from "../../commands";
import memoize from "memoize-one";
import { Route } from "../../model";
import MapWithControls from "../MapWithControls/MapWithControls";
import mobileDetect from "@buildo/bento/utils/mobileDetect";

import "react-responsive-carousel/lib/styles/carousel.min.css";

const md = mobileDetect();

const queries = declareQueries({ route });
const commands = declareCommands({ doUpdateLocation });

type Props = typeof queries.Props & typeof commands.Props;

class Navigation extends React.Component<Props> {
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
      route => {
        if (route.isNone()) {
          return null;
        } else {
          return (
            <View className="navigation" height="100%" grow column>
              <MapWithControls
                routes={this.getRoutes(route.value)}
                navigatingRoute={route}
                altimeter={!md.isDesktop}
                altitudeControl
                drinkingWaterControl
                noSleep
                scale
                speedometer={!md.isDesktop}
                geoLocateControl
                startPosition="firstRoute"
                hoveredRoute={none}
                selectedRoute={none}
              />
            </View>
          );
        }
      }
    );
  }
}

export default commands(queries(Navigation));
