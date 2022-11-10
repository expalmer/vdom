import { wait } from "./libs/utils";

function h(tagName, props = null, ...children) {
  if (Array.isArray(children[0])) {
    children = children[0];
  }

  if (typeof tagName === "function") {
    return tagName({ ...props, children });
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

function hasChanged(newTree, oldTree) {
  // se mudou o node tagName ou o node text
  if (typeof newTree === "object") {
    return newTree?.tagName !== oldTree?.tagName;
  }

  return newTree !== oldTree;
}

function patch($parent, newTree, oldTree, childNodeIndex = 0) {
  if (!oldTree) {
    $parent.appendChild(createElement(newTree));
    return;
  }

  if (!newTree) {
    let times = $parent.childNodes.length - childNodeIndex;
    while (times-- > 0) {
      if ($parent.lastChild) {
        $parent.removeChild($parent.lastChild);
      }
    }
    return;
  }

  if (hasChanged(newTree, oldTree)) {
    // se mudou, eu ignoro o que tinha e crio novos nodes
    $parent.childNodes[childNodeIndex].replaceWith(createElement(newTree));
    return;
  }

  // se não mudou, precisa verificar se as props mudaram
  // agora usamos um applyProps com os valores antigos e novos
  applyProps($parent.childNodes[childNodeIndex], newTree.props, oldTree.props);

  let i = 0;
  let len = Math.max(
    newTree.children?.length || 0,
    oldTree.children?.length || 0
  );
  while (i < len) {
    patch(
      $parent.childNodes[childNodeIndex],
      newTree?.children?.[i],
      oldTree?.children?.[i],
      i
    );

    i++;
  }
}

function applyProps($el, nextProps, currentProps) {
  const newProps = nextProps || {};
  const oldProps = currentProps || {};
  Object.keys({ ...newProps, ...oldProps }).forEach((propName) => {
    const newValue = newProps[propName];
    const oldValue = oldProps[propName];
    const name = propName === "className" ? "class" : propName;
    if (!newValue) {
      $el.removeAttribute(name);
      // a implementação no reac, preact é diferente..
    } else if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      if (name === "style") {
        Object.entries(newValue).forEach(([key, val]) => {
          $el.style[key] = val;
        });
      } else {
        $el.setAttribute(name, newValue);
      }
    }
  });
}

function Title(props) {
  return h("h1", null, props.title);
}

function List({ children, ...props }) {
  return h("ul", props, children);
}

function ListItem({ content, ...props }) {
  return h("li", null, content);
}

const trees = [
  h(
    "div",
    null,
    h(Title, { title: "Hay ia", className: "red" }),
    h(
      List,
      null,
      h(ListItem, { content: "A" }),
      h(ListItem, { content: "B" }),
      h(ListItem, { content: "C" })
    )
  ),
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
