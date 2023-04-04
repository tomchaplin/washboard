const countRelations = (relations) => {
  const lengths = Object.values(relations).flatMap((sub_relations) => {
    return sub_relations.length;
  });
  return lengths.reduce((a, b) => a + b, 0);
};

const containsRelation = (relation_list, relation) => {
  const rel_js = JSON.stringify(relation);
  return relation_list.some((rel) => {
    return JSON.stringify(rel) == rel_js;
  });
};

const addRelations = (relations, diagram_key, point_idx_pair, data) => {
  const point =
    data.pairings[diagram_key][point_idx_pair[0]][point_idx_pair[1]];
  const relations_to_add = point[1];
  Object.entries(relations_to_add).forEach(([new_key, new_relations]) => {
    new_relations.forEach((new_rel) => {
      if (!containsRelation(relations[new_key], new_rel)) {
        relations[new_key].push(new_rel);
      }
    });
  });
  return relations;
};

const recurseRelations = (relations, data) => {
  let prevCount = countRelations(relations);
  let nextCount = -1;
  while (prevCount != nextCount) {
    // Recurse
    Object.entries(relations).forEach(([diagram_key, sub_relations]) => {
      sub_relations.forEach((point_idx_pair) => {
        relations = addRelations(relations, diagram_key, point_idx_pair, data);
      });
    });
    // Update counts to check for loop
    prevCount = nextCount;
    nextCount = countRelations(relations);
  }
  return relations;
};

export function recurseData(data) {
  Object.entries(data.pairings).forEach(([diagram_key, diagram]) => {
    diagram.forEach((diagram_d, d) => {
      diagram_d.forEach(([point, relations], point_idx) => {
        // Add current point
        relations[diagram_key] = [[d, point_idx]];
        // Recurse
        relations = recurseRelations(relations, data);
      });
    });
  });
  return data;
}
