var Immutable = require('immutable');

var flatten = function(form, list, depth) {
  return form.get('content').reduce(function(list, element) {
    var newContainer;
    if (typeof element.has === 'function' && element.has('inclusion')) {
      newContainer = {
        depth: depth + 1,
        content: [],
        numbering: element.get('numbering')
      };
      if (element.has('heading')) {
        newContainer.heading = element.get('heading');
      }
      var conspicuousKeys = ['inclusion', 'conspicuous'];
      if (element.hasIn(conspicuousKeys)) {
        newContainer.conspicuous = element.getIn(conspicuousKeys);
      }
      return flatten(
        element.get('inclusion'),
        list.push(Immutable.fromJS(newContainer)),
        depth + 1
      );
    } else {
      var last = list.last();
      if (
        !last ||
        !last.has('depth') ||
        last.get('depth') !== depth
      ) {
        newContainer = {
          depth: depth,
          content: []
        };
        if (form.has('conspicuous')) {
          newContainer.conspicuous = form.get('conspicuous');
        }
        newContainer.content.push(element);
        return list.push(Immutable.fromJS(newContainer));
      } else {
        var lastIndex = list.count() - 1;
        return list.updateIn([lastIndex, 'content'], function(last) {
          return last.push(element);
        });
      }
    }
  }, list);
};

var emptyList = Immutable.List();

module.exports = function(form) {
  return flatten(form, emptyList, 1);
};

module.exports.version = '0.2.0';
