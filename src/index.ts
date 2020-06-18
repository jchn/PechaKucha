import CollectView from "./CollectView";
import {
  unmountVNode,
  renderVNode,
  mountVNode,
  VNode,
  TextVNode,
} from "./vdom";
import ReadyView from "./ReadyView";
import PlayingView from "./PlayingView";
import FinishedView from "./FinishedView";

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

function replay(state: AppState) {
  return {
    ...state,
    currentMode: Mode.PLAYING,
    currentSlide: 0,
  };
}

type NextSlideAction = { type: "next-slide"; payload: null };
type ChangeAppModeAction = { type: "change-app-mode"; payload: Mode };
type SetSlidesAction = { type: "set-slides"; payload: string[] };
type ReplayAction = { type: "replay"; payload: null };
type InitAction = { type: "init"; payload: null };

type AppAction =
  | NextSlideAction
  | ChangeAppModeAction
  | SetSlidesAction
  | ReplayAction
  | InitAction;

function updateAppState(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "next-slide":
      return goToNextSlide(state);
    case "change-app-mode":
      return changeAppMode(state, action.payload);
    case "set-slides":
      return setSlides(state, action.payload);
    case "replay":
      return replay(state);
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
      return FinishedView({
        urls: state.slides,
        onPressReplay: () => {
          dispatch({ type: "replay", payload: null });
        },
      });
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
console.log("test");
let vnode = null;

const store = createStore<AppState>(state, updateAppState, (newState) => {
  if (vnode) unmountVNode(container, vnode);
  vnode = renderVNode(renderApp(newState, store.dispatch));
  mountVNode(container, vnode);
});

store.dispatch({ action: "init", payload: null });
