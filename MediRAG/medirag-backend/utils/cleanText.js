module.exports = function cleanText(raw) {
  const lines = raw
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && line.length > 5);

  const uniqueLines = [...new Set(lines)];
  const important = uniqueLines.filter(l =>
    /bp|blood|glucose|hemoglobin|mg|ml|report|diagnosis|test|date|result/i.test(l)
  );

  return important.length > 3 ? important.join(". ") : uniqueLines.join(". ");
};
