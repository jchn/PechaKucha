import CollectView from "./CollectView";
import {
  h,
  unmountVNode,
  renderVNode,
  mountVNode,
  VNode,
  TextVNode,
} from "./vdom";
import ReadyView from "./ReadyView";
import PlayingView from "./PlayingView";

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

function setSlides(state: AppState, slides: string[]) {
  return {
    ...state,
    slides,
  };
}

type NextSlideAction = { type: "next-slide"; payload: null };
type ChangeAppModeAction = { type: "change-app-mode"; payload: Mode };
type SetSlidesAction = { type: "set-slides"; payload: string[] };
type InitAction = { type: "init"; payload: null };

type AppAction =
  | NextSlideAction
  | ChangeAppModeAction
  | SetSlidesAction
  | InitAction;

function updateAppState(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "next-slide":
      return goToNextSlide(state);
    case "change-app-mode":
      return changeAppMode(state, action.payload);
    case "set-slides":
      return setSlides(state, action.payload);
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
        urls: state.slides,
        onPressPlay: () =>
          dispatch({ type: "change-app-mode", payload: Mode.PLAYING }),
      });
    case Mode.PLAYING:
      return PlayingView({
        currentSlide: state.currentSlide,
        slides: state.slides,
        onSlideFinished: () => dispatch({ type: "next-slide", payload: null }),
        onSlideShowFinished: () =>
          dispatch({ type: "change-app-mode", payload: Mode.FINISHED }),
      });
    case Mode.FINISHED:
      return FinishedView();
    case Mode.COLLECT:
    default:
      return CollectView({
        onCollected: (urls) => {
          dispatch({ type: "set-slides", payload: urls });
          dispatch({ type: "change-app-mode", payload: Mode.READY });
        },
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
