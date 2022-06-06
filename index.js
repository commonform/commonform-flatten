var resolve = require('commonform-resolve')
var has = require('has')
var predicate = require('commonform-predicate')

var flatten = function (form, list, depth) {
  return form.content.reduce(function (list, element) {
    var newContainer
    if (predicate.child(element)) {
      newContainer = {
        depth: depth + 1,
        content: [],
        numbering: element.numbering
      }
      if (has(element, 'heading')) {
        newContainer.heading = element.heading
      }
      if (has(element.form, 'conspicuous')) {
        newContainer.conspicuous = element.form.conspicuous
      }
      list.push(newContainer)
      return flatten(element.form, list, depth + 1)
    } else if (predicate.component(element)) {
      newContainer = {
        depth: depth + 1,
        numbering: element.numbering
      }
      var toCopy = ['heading', 'component', 'version', 'substitutions']
      toCopy.forEach(function (key) {
        if (has(element, key)) {
          newContainer[key] = element[key]
        }
      })
      list.push(newContainer)
      return list
    } else {
      var listLength = list.length
      var last = list[listLength - 1]
      var startNew = (
        !last ||
        !has(last, 'depth') ||
        last.depth !== depth
      )
      if (startNew) {
        newContainer = {
          depth: depth,
          content: []
        }
        if (has(form, 'conspicuous')) {
          newContainer.conspicuous = form.conspicuous
        }
        newContainer.content.push(element)
        list.push(newContainer)
      } else {
        list[listLength - 1].content.push(element)
      }
      return list
    }
  }, list)
}

module.exports = function (form, values) {
  if (!values) values = []
  return flatten(resolve(form, values), [], 1)
}
