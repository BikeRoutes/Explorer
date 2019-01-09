import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { currentView } from "queries";
import View from "View";
import Explorer from "Explorer/Explorer";
import Details from "Details/Details";

const queries = declareQueries({ currentView });

type Props = typeof queries.Props;

class App extends React.Component<Props> {
  render() {
    if (!this.props.currentView.ready) {
      return null;
    }

    return (
      <View className="app" height="100%">
        {this.props.currentView.value.view === "explorer" && <Explorer />}
        {this.props.currentView.value.view === "details" && <Details />}
      </View>
    );
  }
}

export default queries(App);
