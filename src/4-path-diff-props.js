import { wait } from "./libs/utils";

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
    $parent.childNodes[childNodeIndex].replaceWith(createElement(newTree));
    return;
  }

  // Se não mudou, precisa verificar se as props mudaram
  // Agora usamos um applyProps com os valores antigos e novos (lembra que o antigo não tinha esses params)
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

// 👉
function applyProps($el, nextProps, currentProps) {
  const newProps = nextProps || {};
  const oldProps = currentProps || {};
  // junta todas chaves, e itera cada uma para verificar as props old com as props new
  Object.keys({ ...newProps, ...oldProps }).forEach((propName) => {
    const newValue = newProps[propName];
    const oldValue = oldProps[propName];
    const name = propName === "className" ? "class" : propName;
    if (!newValue) {
      $el.removeAttribute(name);
      // a implementação no reac, preact é diferente...
    } else if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      if (name === "style") {
        // poderiamos melhorar o algoritmo...
        Object.entries(newValue).forEach(([key, val]) => {
          $el.style[key] = val;
        });
      } else {
        $el.setAttribute(name, newValue);
      }
    }
  });
}

const trees = [
  h("div", null, h("h1", { className: "container" }, "Hey")),
  h("div", null, h("h1", null, "Hey")),
  h("div", null, h("h1", { style: { color: "red" } }, "Hey")),
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
