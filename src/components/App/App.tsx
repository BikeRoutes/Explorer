import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { currentView } from "../../queries";
import View from "../View";
import Explorer from "../Explorer/Explorer";
import Details from "../Details/Details";
import Navigation from "../Navigation/Navigation";

const queries = declareQueries({ currentView });

type Props = typeof queries.Props;

class App extends React.Component<Props> {
  render() {
    return this.props.currentView.fold(
      null,
      () => null,
      currentView => (
        <View className="app" height="100%">
          {currentView.view === "explorer" && <Explorer />}
          {currentView.view === "details" && <Details />}
          {currentView.view === "navigation" && <Navigation />}
        </View>
      )
    );
  }
}

export default queries(App);
