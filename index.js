import fs from 'fs';

const readFile = (path, encoding) => {
  try {
    return fs.readFileSync(path, {encoding});
  } catch (error) {
    console.log(error);
  }
}

const writeFile = (path, data, encoding) => {
  // data is a string
  try {
    fs.writeFileSync(path, data, {encoding});
  } catch (error) {
    console.log(error);
  }
};

const cleanData = (dataArray) => {
  return dataArray
  .split('\n')
  .filter(line => line != '')
}

const replacePattern = (text) => {
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
  .map(line => replacePattern(line)(/\*\*(.*?)\*\*/g)("<strong>$1</strong>"))
  .map(line => replacePattern(line)(/\*(.*?)\*/g)("<em>$1</em>"))
  .map(line => replacePattern(line)(/\~\~(.*?)\~\~/g)("<s>$1</s>"));
}

const processHeaders = (dataArray) => {
  // primero busco 3#, después 2# y 1#
  // Luego busco '*'
}

const transformData = (dataArray) => {
  
}



// main

const dataArray = readFile('input.md', 'utf-8');
const newdataArray = cleanData(dataArray);
const result = processEmphasis(newdataArray)
writeFile('output.html', result.join('\n'), 'utf-8');


// const exampleArray = ["Hello **world**! This is *some* text with ~~words~~", "And this **too**", "And so does *this*", "And ~~this~~"];
// const newexampleArray = processEmphasis(exampleArray);
// console.log(newexampleArray);


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
