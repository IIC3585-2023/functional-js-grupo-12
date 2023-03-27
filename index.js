import fs from 'fs';
import _ from 'lodash';


const readFile = (path, encoding) => {
  try {
    return fs.readFileSync(path, {encoding});
  } catch (error) {
    console.log(error);
  }
}

const writeFile = (path, data, encoding) => {
  try {
    fs.writeFileSync(path, data, {encoding});
  } catch (error) {
    console.log(error);
  }
}

const cleanData = (dataArray) => {
  return dataArray
  .split('\n')
  .filter(line => line != '');
}

const replacePattern = (text) => {
  return (pattern) => {
    return (replacement) => {
      return text.replace(pattern, replacement);
    }
  }
}

const processHeaders = (dataArray) => {
  return dataArray.map(line => {
    if (_.startsWith(line, "#")) {
      const compiledHeader = _.template("<h<%=count%>><%=line%> </h<%=count%>>");
      const count = line.split("#").filter((item) => item == "").length;
      return _.replace(compiledHeader({ line, count }), _.repeat("#", count), "");
    }
    else {
      return line;
    }
  })
}

const processOrder = (line, matchPattern, orderTag, first, last) => {
  const compiledListItem = _.template("   <li><%=line %> </li>");
  let htmlPhrase = _.replace(compiledListItem({ line }), matchPattern, "");
  htmlPhrase = first ? `<${orderTag}>\n${htmlPhrase}` : htmlPhrase;
  htmlPhrase = last ? `${htmlPhrase}\n</${orderTag}>` : htmlPhrase;
  return htmlPhrase;
}

const processLists = (dataArray) => {
  return dataArray.map(line => {
    if (_.startsWith(line, "* ")) {
      // Si el elemento anterior a la línea no empieza con '* ', entonces es el primer elemento de la lista.
      const first = !_.startsWith(dataArray[_.indexOf(dataArray, line)-1], '* ');
      // Si el elemento siguiente a la línea no empieza con '* ', entonces es el último elemento de la lista.
      const last = !_.startsWith(dataArray[_.indexOf(dataArray, line)+1], '* ');
      return processOrder(line, '*', 'ul', first, last);
    }
    else if (line.match(/^\d+\./)) {
      const first = !dataArray[_.indexOf(dataArray, line)-1].match(/^\d+\./);
      const last = !dataArray[_.indexOf(dataArray, line)+1].match(/^\d+\./);
      return processOrder(line, line.match(/^\d+\./)[0], 'ol', first, last);
    }
    else {
      return line;
    }
  })
}

const processParagraphs = (dataArray) => {
  return dataArray.map(line => {
    if (!(_.startsWith(line, '<') || _.startsWith(line, '   <'))) {
      return `<p>${line}</p>`
    }
    else {
      return line;
    }
  })
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

const pipe = (...fs) => data => {
  return fs.reduce((value, f) => f(value), data)};

const processMarkdown = pipe(
  processHeaders,
  processLists,
  processParagraphs,
  processEmphasis
)

const main = (inputFile, outputFile) => {
  const dataArray = readFile(inputFile, 'utf-8');
  const cleanDataArray = cleanData(dataArray);
  const htmlArray = processMarkdown(cleanDataArray);
  const htmlText = htmlArray.join('\n')
  writeFile(outputFile, htmlText, 'utf-8');
}

// main(process.argv[2], process.argv[3]);
main('input.md', 'output.html');
