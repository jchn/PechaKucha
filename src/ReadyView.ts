import { h } from "./vdom";

function ReadyView({
  onPressPlay,
  urls,
}: {
  onPressPlay: () => void;
  urls: string[];
}) {
  return h("div", { class: "ReadyView" }, [
    h("button", { onClick: onPressPlay }, [h("text", {}, ["play"])]),
    ...urls.map((url) => {
      return h("img", { src: url }, []);
    }),
  ]);
}

export default ReadyView;
