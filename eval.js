// Evaluate keyword and semantic retrieval quality using MRR and Recall@10.
const fs = require('fs');

function loadTestSet(path) {
  const lines = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/).slice(1);
  return lines.map((line) => {
    const comma = line.lastIndexOf(',');
    const query = line.slice(0, comma);
    const ids = line.slice(comma + 1);
    return {
      query,
      correctIds: ids.split(';').map((id) => Number(id.trim())).filter(Number.isFinite),
    };
  });
}

const testSet = loadTestSet('test-set.csv');
const results = JSON.parse(fs.readFileSync('search-results.json', 'utf8'));

// Return the 1-based position of the first relevant result, or null on a miss.
function rankOf(rankedIds, correctIds) {
  const correct = new Set(correctIds);
  const index = rankedIds.findIndex((id) => correct.has(Number(id)));
  return index === -1 ? null : index + 1;
}

// Reciprocal rank is zero when no relevant result appears in the ranked list.
function reciprocalRank(rankedIds, correctIds) {
  const rank = rankOf(rankedIds, correctIds);
  return rank === null ? 0 : 1 / rank;
}

function evaluateSystem(systemName) {
  let reciprocalRankSum = 0;
  let hits = 0;

  for (const test of testSet) {
    const rankedIds = results[test.query]?.[systemName] ?? [];
    const rr = reciprocalRank(rankedIds, test.correctIds);
    reciprocalRankSum += rr;
    if (rr > 0) hits += 1;
  }

  return {
    mrr: reciprocalRankSum / testSet.length,
    recall: hits / testSet.length,
    hits,
  };
}

const keyword = evaluateSystem('keyword');
const semantic = evaluateSystem('semantic');

console.log('| Query | Keyword rank | Semantic rank |');
console.log('|---|---|---|');

for (const test of testSet) {
  const keywordRank = rankOf(results[test.query]?.keyword ?? [], test.correctIds);
  const semanticRank = rankOf(results[test.query]?.semantic ?? [], test.correctIds);
  console.log(
    `| ${test.query} | ${keywordRank ?? 'miss'} | ${semanticRank ?? 'miss'} |`
  );
}

const fmt = (value) => value.toFixed(2);
console.log(
  `| **Summary** | **MRR ${fmt(keyword.mrr)} · Recall@10 ${fmt(keyword.recall)}** | **MRR ${fmt(semantic.mrr)} · Recall@10 ${fmt(semantic.recall)}** |`
);
