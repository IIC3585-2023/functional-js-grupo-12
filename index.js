const fs = require("fs");
const _ = require("lodash");

// Read a file in markdown(*.md) format and return a string
const readFile = (path, encoding) => {
  try {
    return fs.readFileSync(path, { encoding });
  } catch (error) {
    console.log(error);
  }
};

// Write a string to a file in html(*.html) format
const writeFile = (path, data) => {
  try {
    return fs.writeFileSync(path, data);
  } catch (error) {
    console.error(error);
  }
};

// Proccess an Unordered List in markdown format and return a List in html format
const processUnorderedList = (phrase, index, dataArray) => {
  // Add list item tag to start (<li>) and end(</li>) of the list item
  const compiled_list_item = _.template("   <li><%=phrase %> </li>\n");
  // Replace the * with an empty string
  let html_phrase = _.replace(compiled_list_item({ phrase }), "*", "");
  // Add list tag to start (<ul>) and end(</ul>) of the list
  html_phrase =
    dataArray[index - 1] === "" ? `<ul>\n${html_phrase}` : html_phrase;
  html_phrase =
    dataArray[index + 1] === "" ? `${html_phrase}</ul>\n` : html_phrase;
  // Return a List in html format
  return html_phrase;
};

// Proccess an Ordered List in markdown format and return a List in html format
const processOrderedList = (phrase, index, dataArray) => {
  // Add list item tag to start (<li>) and end(</li>) of the list item
  const compiled_list_item = _.template("   <li><%=phrase %> </li>\n");
  // Replace {number}+. with an empty string
  let html_phrase = _.replace(
    compiled_list_item({ phrase }),
    phrase.match(/^\d+\./)[0],
    ""
  );
  // Add list tag to start (<ol>) and end(</ol>) of the list
  html_phrase =
    dataArray[index - 1] === "" ? `<ol>\n${html_phrase}` : html_phrase;
  html_phrase =
    dataArray[index + 1] === "" ? `${html_phrase}</ol>\n` : html_phrase;
  // Return a List in html format
  return html_phrase;
};

// Proccess a Header in markdown format and return a Header in html format
const processHeaders = (phrase, index) => {
  // Add header tag to start (<h{number}>) and end(</h{number}>) of the header
  const compiled_header = _.template("<h<%=count%>><%=phrase%> </h<%=count%>>\n");
  // Get the number of # in the header
  const count = phrase.split("#").filter((item) => item == "").length;
  // Replace the # with an empty string
  const html_phrase = _.replace(
    compiled_header({ phrase, count }),
    _.repeat("#", count),
    ""
  );
  // Return a Header in html format
  return html_phrase;
};

// Proccess emphasis in markdown format and return emphasis in html format
const proceesEmphasis = (phrase, index) => {
  // Replace ** with <strong> and </strong>
  let html_phrase = _.replace(phrase, /\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Replace __ with <strong> and </strong>
  html_phrase = _.replace(html_phrase, /\_\_(.*?)\_\_/g, "<strong>$1</strong>");
  // Replace * with <em> and </em>
  html_phrase = _.replace(html_phrase, /\*(.*?)\*/g, "<em>$1</em>");
  // Replace _ with <em> and </em>
  html_phrase = _.replace(html_phrase, /\_(.*?)\_/g, "<em>$1</em>");
  // Replace ~~ with <s> and </s>
  html_phrase = _.replace(html_phrase, /\~\~(.*?)\~\~/g, "<s>$1</s>");
  // Replace a link in markdown ( [textLink](urlLink) ) format with a link in html format
  html_phrase = _.replace(
    html_phrase,
    /\[(.*?)\]\((.*?)\)/,
    "<a href='$2'>$1</a>"
  );
  return html_phrase;
};

// Proccess a Paragraph in markdown format and return a Paragraph in html format
const processParagraphs = (phrase, index) => {
  // Replace emphasis in markdown format with emphasis in html format
  let html_phrase = proceesEmphasis(phrase, index);
  // Add paragraph tag to start (<p>) and end(</p>) of the paragraph
  html_phrase = phrase !== "" ? `<p>${html_phrase}</p>\n` : "";
  // Return a Paragraph in html format
  return html_phrase;
};

const main = (path) => {
  // Read the file in markdown format and split it by line
  const dataArray = readFile(path, "utf-8").split("\n");
  // Initilize a string to store the html data
  let htmlData = "";
  // Iterate over the lines of the file
  dataArray.forEach((phrase, index) => {
    // Check if the line is a Unordered list
    if (_.startsWith(phrase, "* "))
      htmlData += processUnorderedList(phrase, index, dataArray);
    // Check if the line is a Ordered list
    else if (phrase.match(/^\d+\./))
      htmlData += processOrderedList(phrase, index, dataArray);
    // Check if the line is a Header
    else if (_.startsWith(phrase, "#"))
      htmlData += processHeaders(phrase, index, dataArray);
    // Check if the line is a Paragraph
    else htmlData += processParagraphs(phrase, index, dataArray);
  });
// Write the html data to a file
  writeFile(path.replace(".md", ".html"), htmlData);
};

main(process.argv[3]);
