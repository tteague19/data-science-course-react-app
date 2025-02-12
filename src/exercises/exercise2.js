export const FETCH_BUSINESSES_QUERY = `
CALL db.index.fulltext.queryNodes("BusinessNameIndex", $searchText + "~0.75")
YIELD node, score
WITH node AS b ORDER BY score DESC LIMIT 200
MATCH (b)-[:IN_CATEGORY]->(c:Category {name: $category})
OPTIONAL MATCH (b)-[:HAS_PHOTO]->(p:Photo)
WITH b, COLLECT(p)[0] AS p
MATCH (me:User {id: $userId})
OPTIONAL MATCH (me)-[similarity:SIMILAR]-(other)-[:WROTE]-(:Review)-[:REVIEWS]->(b)
WITH DISTINCT b, p, avg(coalesce(similarity.score, 0)) AS avgScore ORDER BY avgScore DESC LIMIT 100
RETURN COLLECT(b {.*, photo: p.id, score: avgScore}) AS businesses
`;
