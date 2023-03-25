import fs from 'fs';

const readFile = (path, encoding) => {
  try {
    return fs.readFileSync(path, {encoding});
  } catch (error) {
    console.log(error);
  }
};

const replaceCurried = (text) => {
  return (pattern) => {
    return (replacement) => {
      return text.replace(pattern, replacement);
    }
  }
}

const processEmphasis = (dataArray) => {
  // ** ** o __ __ -> <strong></strong>
  // * * o _ _ -> <em></em>
  // ~~ ~~ -> <s></s>
  return dataArray
  .map(line => replaceCurried(line)(/\*\*(.*?)\*\*/g)("<strong>$1</strong>"))
  .map(line => replaceCurried(line)(/\*(.*?)\*/g)("<em>$1</em>"))
  .map(line => replaceCurried(line)(/\~\~(.*?)\~\~/g)("<s>$1</s>"));
}


// main

// const dataArray = readFile('input.md', 'utf-8').split('\n');

const exampleArray = ["Hello **world**! This is *some* text with ~~words~~", "And this **too**", "And so does *this*", "And ~~this~~"];
const newexampleArray = processEmphasis(exampleArray);
console.log(newexampleArray);


// Ejemplo compose:
// const compose = (f,g) => (x) => f(g(x));
// const f = x => x + 1;
// const g = x => x * 2;
// const h = compose(f, g);
// h(4)

// const compose = (f,g) => (x) => f(g(x));
// const processHeaders = () => {};
// const processEmphasis = () => {};
// const processMarkdown = compose(processHeaders, processEmphasis);
// processMarkdown(data);
