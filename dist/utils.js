'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeReducers = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
var mergeReducers = exports.mergeReducers = function mergeReducers() {
  for (var _len = arguments.length, reducers = Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  var reversedReducers = reducers.slice(0).reverse();
  return function (state, action) {
    var nextState = state || {};
    reversedReducers.forEach(function (reducer) {
      if (typeof state === 'undefined') {
        // The reducers are being initilized by Redux. Give them a chance to return their
        // initial default value and merge all the values together for form the final state
        nextState = (0, _assign2.default)({}, nextState, reducer(undefined, action));
      } else {
        nextState = reducer(nextState, action);
      }
    });
    return nextState;
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJtZXJnZVJlZHVjZXJzIiwicmVkdWNlcnMiLCJyZXZlcnNlZFJlZHVjZXJzIiwic2xpY2UiLCJyZXZlcnNlIiwic3RhdGUiLCJhY3Rpb24iLCJuZXh0U3RhdGUiLCJmb3JFYWNoIiwicmVkdWNlciIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ08sSUFBTUEsd0NBQWdCLFNBQWhCQSxhQUFnQixHQUFpQjtBQUFBLG9DQUFiQyxRQUFhO0FBQWJBLFlBQWE7QUFBQTs7QUFDNUMsTUFBTUMsbUJBQW1CRCxTQUFTRSxLQUFULENBQWUsQ0FBZixFQUFrQkMsT0FBbEIsRUFBekI7QUFDQSxTQUFPLFVBQUNDLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUN4QixRQUFJQyxZQUFZRixTQUFTLEVBQXpCO0FBQ0FILHFCQUFpQk0sT0FBakIsQ0FBeUIsVUFBQ0MsT0FBRCxFQUFhO0FBQ3BDLFVBQUksT0FBT0osS0FBUCxLQUFpQixXQUFyQixFQUFrQztBQUN4QjtBQUNBO0FBQ1JFLG9CQUFZLHNCQUFjLEVBQWQsRUFBa0JBLFNBQWxCLEVBQTZCRSxRQUFRQyxTQUFSLEVBQW1CSixNQUFuQixDQUE3QixDQUFaO0FBQ0QsT0FKRCxNQUlPO0FBQ0xDLG9CQUFZRSxRQUFRRixTQUFSLEVBQW1CRCxNQUFuQixDQUFaO0FBQ0Q7QUFDRixLQVJEO0FBU0EsV0FBT0MsU0FBUDtBQUNELEdBWkQ7QUFhRCxDQWZNIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgY29uc3QgbWVyZ2VSZWR1Y2VycyA9ICguLi5yZWR1Y2VycykgPT4ge1xuICBjb25zdCByZXZlcnNlZFJlZHVjZXJzID0gcmVkdWNlcnMuc2xpY2UoMCkucmV2ZXJzZSgpO1xuICByZXR1cm4gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICBsZXQgbmV4dFN0YXRlID0gc3RhdGUgfHwge307XG4gICAgcmV2ZXJzZWRSZWR1Y2Vycy5mb3JFYWNoKChyZWR1Y2VyKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHN0YXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIC8vIFRoZSByZWR1Y2VycyBhcmUgYmVpbmcgaW5pdGlsaXplZCBieSBSZWR1eC4gR2l2ZSB0aGVtIGEgY2hhbmNlIHRvIHJldHVybiB0aGVpclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWwgZGVmYXVsdCB2YWx1ZSBhbmQgbWVyZ2UgYWxsIHRoZSB2YWx1ZXMgdG9nZXRoZXIgZm9yIGZvcm0gdGhlIGZpbmFsIHN0YXRlXG4gICAgICAgIG5leHRTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIG5leHRTdGF0ZSwgcmVkdWNlcih1bmRlZmluZWQsIGFjdGlvbikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dFN0YXRlID0gcmVkdWNlcihuZXh0U3RhdGUsIGFjdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgfTtcbn07XG4iXX0=