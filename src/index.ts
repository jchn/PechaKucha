const container = document.querySelector("#app");

enum Mode {
  COLLECT,
  READY,
  PLAYING,
  FINISHED,
}

type AppState = {
  currentMode: Mode;
  currentSlide: number;
  slides: string[];
};

const state: AppState = {
  currentMode: Mode.COLLECT,
  currentSlide: 0,
  slides: [],
};

type VNodeProps = {
  onClick?: () => void;
  class: string;
};

type VNode = {
  type: "div" | "button";
  children: VNode[];
  props: VNodeProps;
  _ref?: HTMLElement;
};

type TextVNode = {
  type: "text";
  children: string;
  _ref?: Text;
};

function h(type, props, children): VNode {
  return {
    type,
    props,
    children,
  };
}

function renderVNode(vnode: VNode | TextVNode): VNode | TextVNode {
  let ref = null;

  if (vnode.type === "text") {
    ref = document.createTextNode(vnode.children);
  } else {
    ref = document.createElement(vnode.type);
    if (vnode.props.onClick) {
      ref.addEventListener("click", vnode.props.onClick);
    }
    if (vnode.props.class) {
      ref.classList.add(vnode.props.class);
    }
    vnode.children.forEach((cvnode) => {
      renderVNode(cvnode);
    });
  }

  vnode._ref = ref;

  return vnode;
}

function mountVNode(container: Element, vnode: VNode | TextVNode) {
  if (vnode._ref) {
    container.appendChild(vnode._ref);
  }

  if (vnode.type !== "text") {
    vnode.children.forEach((cvnode) => {
      mountVNode(vnode._ref, cvnode);
    });
  }
}

function unmountVNode(container: Element, vnode: VNode | TextVNode) {
  if (vnode.type !== "text") {
    if (vnode.props.onClick && vnode._ref) {
      vnode._ref.removeEventListener("click", vnode.props.onClick);
    }

    vnode.children.forEach((cvnode) => {
      unmountVNode(vnode._ref, cvnode);
    });
  }

  if (vnode._ref) {
    container.removeChild(vnode._ref);
  }
}

function goToNextSlide(state: AppState): AppState {
  return {
    ...state,
    currentSlide: state.currentSlide + 1,
  };
}

function changeAppMode(state: AppState, nextMode: Mode): AppState {
  return {
    ...state,
    currentMode: nextMode,
  };
}

type NextSlideAction = { type: "next-slide"; payload: null };
type ChangeAppModeAction = { type: "change-app-mode"; payload: Mode };
type InitAction = { type: "init"; payload: null };

type AppAction = NextSlideAction | ChangeAppModeAction | InitAction;

function updateAppState(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "next-slide":
      return goToNextSlide(state);
    case "change-app-mode":
      return changeAppMode(state, action.payload);
  }
  return state;
}

function createStore<S>(state: S, reducers, onChange: (state: S) => void) {
  let s = state;
  return {
    dispatch: function (action) {
      s = reducers(s, action);
      onChange(s);
    },
  };
}

function CollectView({ onCollected }) {
  return h("div", { class: "CollectView" }, [
    h("button", { onClick: onCollected }, [h("text", {}, ["onCollected"])]),
  ]);
}

function ReadyView({ onPressPlay }) {
  return h("div", { class: "ReadyView" }, [
    h("button", { onClick: onPressPlay }, [h("text", {}, ["play"])]),
  ]);
}

function PlayingView({
  currentSlide,
  slides,
  onSlideFinished,
  onSlideShowFinished,
}: {
  currentSlide: number;
  slides: string[];
  onSlideFinished: () => void;
  onSlideShowFinished: () => void;
}) {
  if (currentSlide === 19) {
    setTimeout(() => {
      onSlideShowFinished();
    }, 2000);
  } else {
    setTimeout(() => {
      onSlideFinished();
    }, 2000);
  }

  return h("div", { class: "PlayingView" }, [
    h("text", {}, ["playing slideshow"]),
    h("text", {}, [`current slide: ${currentSlide}`]),
  ]);
}

function FinishedView() {
  return h("div", { class: "FinishedView" }, [
    h("text", {}, ["finished slideshow"]),
  ]);
}

function renderApp(
  state: AppState,
  dispatch: (action: AppAction) => void
): VNode | TextVNode {
  switch (state.currentMode) {
    case Mode.READY:
      return ReadyView({
        onPressPlay: () =>
          dispatch({ type: "change-app-mode", payload: Mode.PLAYING }),
      });
    case Mode.PLAYING:
      return PlayingView({
        currentSlide: state.currentSlide,
        slides: state.slides,
        onSlideFinished: () => dispatch({ type: "next-slide", payload: null }),
        onSlideShowFinished: () =>
          dispatch({ type: "change-app-mode", payload: Mode.READY }),
      });
    case Mode.FINISHED:
      return FinishedView();
    case Mode.COLLECT:
    default:
      return CollectView({
        onCollected: () =>
          dispatch({ type: "change-app-mode", payload: Mode.READY }),
      });
  }
}

let vnode = null;

const store = createStore<AppState>(state, updateAppState, (newState) => {
  if (vnode) unmountVNode(container, vnode);
  vnode = renderVNode(renderApp(newState, store.dispatch));
  mountVNode(container, vnode);
});

store.dispatch({ action: "init", payload: null });
