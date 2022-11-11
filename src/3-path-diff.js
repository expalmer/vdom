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

// 👉
function patch($parent, newTree, oldTree, childNodeIndex = 0) {
  if (!oldTree) {
    // Se não tem a old tree, só confia e cria tudo novo e apenda
    $parent.appendChild(createElement(newTree));
    return;
  }

  if (!newTree) {
    // Se não tem a new tree, remove de tras para frente até X vezes = qtd de children do $parent (-) childNodeIndex atual
    let times = $parent.childNodes.length - childNodeIndex;
    while (times-- > 0) {
      if ($parent.lastChild) {
        $parent.removeChild($parent.lastChild);
      }
    }
    return;
  }

  // Ou o tagName mudou ou a string (lembra que só pode ser um objet h ou um string)
  const hasChanged =
    typeof newTree === "object"
      ? newTree?.tagName !== oldTree?.tagName
      : newTree !== oldTree;

  if (hasChanged) {
    // se mudou, eu ignoro o que tinha e crio novos nodes
    $parent.childNodes[childNodeIndex].replaceWith(createElement(newTree));
    return;
  }

  // Qtd de children de quem tem mais, e itera lado a lado cada um
  arrayFromMax(newTree?.children?.length, oldTree?.children?.length).forEach(
    (index) => {
      patch(
        $parent.childNodes[childNodeIndex], // o parent agora é esse
        newTree?.children?.[index],
        oldTree?.children?.[index],
        index // Esse index é importante para saber qual childrenIndex está
      );
    }
  );
}

const trees = [
  h(
    "div",
    null,
    h("p", null, h("span", null, "Aqui"), h("span", null, "Aqui")),
    h("h1", null, "h2")
  ),
  h(
    "div",
    null,
    h("p", null, h("span", null, "Aqui"), h("strong", null, "Strong")),
    h("h1", null, "h2")
  ),
];

// 👉
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
