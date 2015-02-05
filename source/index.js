var flatten = function(list, form, depth) {
  form.content.forEach(function(element) {
    var newContainer;
    if (element.hasOwnProperty('form')) {
      newContainer = {
        depth: depth + 1,
        flattened: [],
        numbering: element.numbering
      };
      if (element.summary) {
        newContainer.summary = element.summary;
      }
      if (element.form.conspicuous) {
        newContainer.conspicuous = element.form.conspicuous;
      }
      list.push(newContainer);
      flatten(list, element.form, depth + 1);
    } else {
      var last = list[list.length - 1];
      if (
        !last ||
        !last.hasOwnProperty('depth') ||
        last.depth !== depth
      ) {
        newContainer = {depth: depth, flattened: []};
        list.push(newContainer);
        last = newContainer;
        if (form.conspicuous) {
          newContainer.conspicuous = form.conspicuous;
        }
      }
      last.flattened.push(element);
    }
  });
  return list;
};

module.exports = function(project) {
  project.flattened = flatten([], project.form, 1);
  return project;
};

module.exports.version = '0.1.0';
