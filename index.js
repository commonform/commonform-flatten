var resolve = require('commonform-resolve')

var flatten = function(form, list, depth) {
  return form.content
    .reduce(
      function(list, element) {
        var newContainer
        if (element.hasOwnProperty('form')) {
          newContainer = {
            depth: ( depth + 1 ),
            content: [ ],
            numbering: element.numbering }
          if (element.hasOwnProperty('heading')) {
            newContainer.heading = element.heading }
          if (element.form.hasOwnProperty('conspicuous')) {
            newContainer.conspicuous = element.form.conspicuous }
          list.push(newContainer)
          return flatten(element.form, list, depth + 1) }
        else {
          var listLength = list.length
          var last = list[listLength - 1]
          var startNew = (
            !last ||
            !last.hasOwnProperty('depth') ||
            last.depth !== depth )
          if (startNew) {
            newContainer = {
              depth: depth,
              content: [ ] }
            if (form.hasOwnProperty('conspicuous')) {
              newContainer.conspicuous = form.conspicuous }
            newContainer.content.push(element)
            list.push(newContainer) }
          else {
            list[listLength - 1].content.push(element) }
          return list } },
      list) }

module.exports = function(form, values) {
  if (!values) {
    values = [ ] }
  return flatten(resolve(form, values), [ ], 1) }
