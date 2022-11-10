import { arrayFromMax, wait } from "./libs/utils";

function h(tagName, props = null, ...children) {
  if (Array.isArray(children[0])) {
    children = children[0];
  }

  return {
    tagName,
    props,
    children,
  };
}

function createElement(node) {
  if (!node?.tagName) {
    return document.createTextNode(String(node));
  }

  const $el = document.createElement(node.tagName);

  applyProps($el, node.props);

  const elements = node.children.map(createElement);
  $el.append(...elements);

  return $el;
}

function applyProps($el, props) {
  Object.entries(props || {}).forEach(([propName, propValue]) => {
    const name = propName === "className" ? "class" : propName;

    if (name === "style") {
      Object.entries(propValue).forEach(([key, val]) => {
        $el.style[key] = val;
      });
    } else {
      $el.setAttribute(name, propValue);
    }
  });
}

function patch($parent, newTree, oldTree, childNodeIndex = 0) {
  if (!oldTree) {
    $parent.appendChild(createElement(newTree));
    return;
  }

  if (!newTree) {
    let times = $parent.childNodes.length - childNodeIndex;
    console.log(times);
    while (times-- > 0) {
      if ($parent.lastChild) {
        $parent.removeChild($parent.lastChild);
      }
    }
    return;
  }

  const hasChanged =
    typeof newTree === "object"
      ? newTree?.tagName !== oldTree?.tagName
      : newTree !== oldTree;

  if (hasChanged) {
    // se mudou, eu ignoro o que tinha e crio novos nodes
    $parent.childNodes[childNodeIndex].replaceWith(createElement(newTree));
    return;
  }

  arrayFromMax(newTree?.children?.length, oldTree?.children?.length).forEach(
    (index) => {
      patch(
        $parent.childNodes[childNodeIndex],
        newTree?.children?.[index],
        oldTree?.children?.[index],
        index
      );
    }
  );
}

const trees = [
  h(
    "div",
    null,
    h("h1", null, "Title"),
    h("span", null, "Oi"),
    h("span", null, "Oi")
  ),
  h("div", null, h("h2", null, "Title"), h("span", null, "Oi")),
];

let currentTree = undefined;

async function main() {
  const $root = document.getElementById("root");

  for (const nextTree of trees) {
    patch($root, nextTree, currentTree);
    currentTree = nextTree;

    await wait(2000);
  }
}

document.addEventListener("DOMContentLoaded", main);
