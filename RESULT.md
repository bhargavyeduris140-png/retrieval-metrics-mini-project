# Retrieval Metrics Results

## Results

Running `node eval.js` produces the comparison table below:

| Query | Keyword rank | Semantic rank |
|---|---:|---:|
| my redis cache keeps showing old data | 8 | 1 |
| how do I add semantic search to a table I already have | miss | 2 |
| redis or memcached for caching | 1 | 2 |
| why did my query get slower after I added an index | miss | 1 |
| what does ACID actually guarantee | 2 | 1 |
| how do I keep my postgres online while changing the schema | 6 | 3 |
| my background jobs stop after every deploy | miss | 2 |
| how do I let my database accept more writes per second | 4 | 1 |
| sql or nosql for a new product | 1 | 3 |
| why does my redis memory keep climbing | miss | 2 |
| **Summary** | **MRR 0.30 · Recall@10 0.60** | **MRR 0.67 · Recall@10 1.00** |

## Interpretation

Semantic search performs better overall: it has a higher Mean Reciprocal Rank (0.67 versus 0.30) and Recall@10 (1.00 versus 0.60). This means semantic search finds a relevant result for every query and, on average, places the first relevant result closer to the top. Keyword search wins on the direct phrase-matching queries about Redis versus Memcached and choosing SQL or NoSQL, where exact terminology overlaps strongly with the relevant content. Semantic search wins on intent-based or problem-description queries, such as stale cache data, adding semantic search, slower indexed queries, and rising Redis memory usage. A team may still keep keyword search because exact technical terms and product names can make it more precise for some queries, so combining both approaches can provide more robust retrieval.
