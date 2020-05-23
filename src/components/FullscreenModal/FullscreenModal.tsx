import * as React from "react";
import Modal from "@buildo/bento/components/Modal";
import View from "../View";
import Button from "@buildo/bento/components/Button";

import "@buildo/bento/components/modal.scss";

type Props = {};

type State = {
  showModal: boolean;
};

let fullscreen: boolean = false;
let documentHidden: { time: number; value: boolean } = {
  time: 0,
  value: false
};

export default class FullscreenModal extends React.PureComponent<Props, State> {
  state: State = {
    showModal: false
  };

  onFullscreenChange = () => {
    if (document.fullscreenElement) {
      fullscreen = true;
    } else {
      setTimeout(() => {
        fullscreen = false;
      }, 30);
    }
  };

  onVisibilityChange = () => {
    if (
      Date.now() > documentHidden.time + 300 &&
      documentHidden.value &&
      !document.hidden
    ) {
      if (fullscreen) {
        this.setState({
          showModal: true
        });
      }
    }

    documentHidden = {
      time: Date.now(),
      value: document.hidden
    };
  };

  enterFullscreen = () => {
    document.getElementById("map")?.requestFullscreen();
  };

  componentDidMount() {
    document.addEventListener("fullscreenchange", this.onFullscreenChange);
    document.addEventListener(
      "visibilitychange",
      this.onVisibilityChange,
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener("fullscreenchange", this.onFullscreenChange);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  onDismiss = () => {
    fullscreen = false;
    this.setState({
      showModal: false
    });
  };

  render() {
    return this.state.showModal ? (
      <Modal
        className="fullscreenModal"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        onDismiss={this.onDismiss}
        iconClose={
          <svg height="12" viewBox="0 0 22 28">
            <path
              fill="#9098a7"
              d="M20.281 20.656q0 0.625-0.438 1.062l-2.125 2.125q-0.438 0.438-1.062 0.438t-1.062-0.438l-4.594-4.594-4.594 4.594q-0.438 0.438-1.062 0.438t-1.062-0.438l-2.125-2.125q-0.438-0.438-0.438-1.062t0.438-1.062l4.594-4.594-4.594-4.594q-0.438-0.438-0.438-1.062t0.438-1.062l2.125-2.125q0.438-0.438 1.062-0.438t1.062 0.438l4.594 4.594 4.594-4.594q0.438-0.438 1.062-0.438t1.062 0.438l2.125 2.125q0.438 0.438 0.438 1.062t-0.438 1.062l-4.594 4.594 4.594 4.594q0.438 0.438 0.438 1.062z"
            ></path>
          </svg>
        }
        title="Re-enter Fullscreen"
        footer={
          <View style={{ justifyContent: "space-between" }}>
            <Button size="medium" onClick={this.onDismiss}>
              No
            </Button>
            <Button primary size="medium" onClick={this.enterFullscreen}>
              Yes
            </Button>
          </View>
        }
      >
        <span>Do do you want to re-enter fullscreen?</span>
      </Modal>
    ) : null;
  }
}
