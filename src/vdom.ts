export type VNodeProps = {
  onClick?: () => void;
  onDrop?: () => void;
  onDragEnter?: () => void;
  onDragOver?: () => void;
  class: string;
};

export type VNode = {
  type: "div" | "button";
  children: VNode[];
  props: VNodeProps;
  _ref?: HTMLElement;
};

export type TextVNode = {
  type: "text";
  children: string;
  _ref?: Text;
};

export function h(type, props, children): VNode {
  return {
    type,
    props,
    children,
  };
}

export function renderVNode(vnode: VNode | TextVNode): VNode | TextVNode {
  let ref = null;

  if (vnode.type === "text") {
    ref = document.createTextNode(vnode.children);
  } else {
    ref = document.createElement(vnode.type);
    if (vnode.props.onClick) {
      ref.addEventListener("click", vnode.props.onClick);
    }
    if (vnode.props.onDrop) {
      ref.addEventListener("drop", vnode.props.onDrop);
    }
    if (vnode.props.onDragEnter) {
      ref.addEventListener("dragenter", vnode.props.onDragEnter);
    }
    if (vnode.props.onDragOver) {
      ref.addEventListener("dragover", vnode.props.onDragOver);
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

export function mountVNode(container: Element, vnode: VNode | TextVNode) {
  if (vnode._ref) {
    container.appendChild(vnode._ref);
  }

  if (vnode.type !== "text") {
    vnode.children.forEach((cvnode) => {
      mountVNode(vnode._ref, cvnode);
    });
  }
}

export function unmountVNode(container: Element, vnode: VNode | TextVNode) {
  if (vnode.type !== "text") {
    if (vnode.props.onClick && vnode._ref) {
      vnode._ref.removeEventListener("click", vnode.props.onClick, false);
    }

    if (vnode.props.onDrop && vnode._ref) {
      vnode._ref.removeEventListener("drop", vnode.props.onDrop, false);
    }

    if (vnode.props.onDragEnter && vnode._ref) {
      vnode._ref.removeEventListener(
        "dragenter",
        vnode.props.onDragEnter,
        false
      );
    }

    if (vnode.props.onDragOver && vnode._ref) {
      vnode._ref.removeEventListener("dragover", vnode.props.onDragOver, false);
    }

    vnode.children.forEach((cvnode) => {
      unmountVNode(vnode._ref, cvnode);
    });
  }

  if (vnode._ref) {
    container.removeChild(vnode._ref);
  }
}
