'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _reactRedux = require('react-redux');

var _actions = require('./actions.js');

var UIActions = _interopRequireWildcard(_actions);

var _localReducer = require('./localReducer.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (Config) {
  return function (Component) {
    var defaultMapStateToProps = function defaultMapStateToProps(state) {
      return state;
    };
    var ConnectComp = (0, _reactRedux.connect)(Config.mapStateToProps || defaultMapStateToProps, Config.mapDispatchToProps, Config.mergeProps)(function (props) {
      var newProps = (0, _assign2.default)({}, props);
      delete newProps.store;
      // eslint-disable-next-line
      return _react2.default.createElement(Component, newProps);
    });

    var UI = function (_React$Component) {
      (0, _inherits3.default)(UI, _React$Component);

      function UI(props, context) {
        (0, _classCallCheck3.default)(this, UI);

        var _this = (0, _possibleConstructorReturn3.default)(this, (UI.__proto__ || (0, _getPrototypeOf2.default)(UI)).call(this, props, context));

        var compKey = typeof Config.key === 'function' ? Config.key(props, context) : Config.key;
        _this.store = null;
        (0, _invariant2.default)(Config.key, '[redux-fractal] - You must supply a  key to the component either as a function or string');
        _this.compKey = compKey;
        _this.unsubscribe = null;
        return _this;
      }

      (0, _createClass3.default)(UI, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var existingState = this.context.store.getState().local[this.compKey];
          var storeResult = (0, _localReducer.createStore)(Config.createStore, this.props, this.compKey, existingState, this.context);
          this.store = storeResult.store;
          this.storeCleanup = storeResult.cleanup;
          this.context.store.dispatch({
            type: UIActions.CREATE_COMPONENT_STATE,
            payload: { config: Config, props: this.props, store: this.store, hasStore: !!Config.createStore },
            meta: { reduxFractalTriggerComponent: this.compKey }
          });
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var _this2 = this;

          var persist = typeof Config.persist === 'function' ? Config.persist(this.props, this.context) : Config.persist;
          setTimeout(function () {
            _this2.context.store.dispatch({
              type: UIActions.DESTROY_COMPONENT_STATE,
              payload: { persist: persist, hasStore: !!Config.createStore },
              meta: { reduxFractalTriggerComponent: _this2.compKey }
            });
            if (_this2.storeCleanup) {
              _this2.storeCleanup();
            }
            _this2.store = null;
          }, 0);
        }
      }, {
        key: 'render',
        value: function render() {
          if (this.props.store) {
            // eslint-disable-next-line
            console.warn('Props named \'store\' cannot be passed to redux-fractal \'local\'\n                HOC with key ' + this.compKey + ' since it\'s a reserved prop');
          }
          return this.store && _react2.default.createElement(ConnectComp, (0, _extends3.default)({}, this.props, {
            store: this.store
          }));
        }
      }]);
      return UI;
    }(_react2.default.Component);

    UI.contextTypes = (0, _assign2.default)({}, Component.contextTypes, {
      store: _propTypes2.default.shape({
        subscribe: _propTypes2.default.func.isRequired,
        dispatch: _propTypes2.default.func.isRequired,
        getState: _propTypes2.default.func.isRequired
      })
    });
    UI.propTypes = (0, _assign2.default)({}, {
      store: _propTypes2.default.shape({
        subscribe: _propTypes2.default.func.isRequired,
        dispatch: _propTypes2.default.func.isRequired,
        getState: _propTypes2.default.func.isRequired
      })
    });
    var displayName = Component.displayName || Component.name || 'Component';
    UI.displayName = 'local(' + displayName + ')';
    return (0, _hoistNonReactStatics2.default)(UI, Component);
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2NhbC5qcyJdLCJuYW1lcyI6WyJVSUFjdGlvbnMiLCJDb25maWciLCJDb21wb25lbnQiLCJkZWZhdWx0TWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJDb25uZWN0Q29tcCIsIm1hcFN0YXRlVG9Qcm9wcyIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsIm1lcmdlUHJvcHMiLCJwcm9wcyIsIm5ld1Byb3BzIiwic3RvcmUiLCJVSSIsImNvbnRleHQiLCJjb21wS2V5Iiwia2V5IiwidW5zdWJzY3JpYmUiLCJleGlzdGluZ1N0YXRlIiwiZ2V0U3RhdGUiLCJsb2NhbCIsInN0b3JlUmVzdWx0IiwiY3JlYXRlU3RvcmUiLCJzdG9yZUNsZWFudXAiLCJjbGVhbnVwIiwiZGlzcGF0Y2giLCJ0eXBlIiwiQ1JFQVRFX0NPTVBPTkVOVF9TVEFURSIsInBheWxvYWQiLCJjb25maWciLCJoYXNTdG9yZSIsIm1ldGEiLCJyZWR1eEZyYWN0YWxUcmlnZ2VyQ29tcG9uZW50IiwicGVyc2lzdCIsInNldFRpbWVvdXQiLCJERVNUUk9ZX0NPTVBPTkVOVF9TVEFURSIsImNvbnNvbGUiLCJ3YXJuIiwiUmVhY3QiLCJjb250ZXh0VHlwZXMiLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN1YnNjcmliZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwicHJvcFR5cGVzIiwiZGlzcGxheU5hbWUiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7SUFBWUEsUzs7QUFDWjs7Ozs7O2tCQUVlLFVBQUNDLE1BQUQ7QUFBQSxTQUFZLFVBQUNDLFNBQUQsRUFBZTtBQUN4QyxRQUFNQyx5QkFBeUIsU0FBekJBLHNCQUF5QixDQUFDQyxLQUFEO0FBQUEsYUFBV0EsS0FBWDtBQUFBLEtBQS9CO0FBQ0EsUUFBTUMsY0FBYyx5QkFDZEosT0FBT0ssZUFBUCxJQUEwQkgsc0JBRFos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QUFrQixzQkFBYyxFQUFkLEVBQWtCcEMsVUFBVW9DLFlBQTVCLEVBQTBDO0FBQzFEM0IsYUFBTzRCLG9CQUFVQyxLQUFWLENBQWdCO0FBQ3JCQyxtQkFBV0Ysb0JBQVVHLElBQVYsQ0FBZUMsVUFETDtBQUVyQm5CLGtCQUFVZSxvQkFBVUcsSUFBVixDQUFlQyxVQUZKO0FBR3JCekIsa0JBQVVxQixvQkFBVUcsSUFBVixDQUFlQztBQUhKLE9BQWhCO0FBRG1ELEtBQTFDLENBQWxCO0FBT0EvQixPQUFHZ0MsU0FBSCxHQUFlLHNCQUFjLEVBQWQsRUFBa0I7QUFDL0JqQyxhQUFPNEIsb0JBQVVDLEtBQVYsQ0FBZ0I7QUFDckJDLG1CQUFXRixvQkFBVUcsSUFBVixDQUFlQyxVQURMO0FBRXJCbkIsa0JBQVVlLG9CQUFVRyxJQUFWLENBQWVDLFVBRko7QUFHckJ6QixrQkFBVXFCLG9CQUFVRyxJQUFWLENBQWVDO0FBSEosT0FBaEI7QUFEd0IsS0FBbEIsQ0FBZjtBQU9BLFFBQU1FLGNBQWMzQyxVQUFVMkMsV0FBVixJQUF5QjNDLFVBQVU0QyxJQUFuQyxJQUEyQyxXQUEvRDtBQUNBbEMsT0FBR2lDLFdBQUgsY0FBMEJBLFdBQTFCO0FBQ0EsV0FBTyxvQ0FBcUJqQyxFQUFyQixFQUF5QlYsU0FBekIsQ0FBUDtBQUNELEdBbEZjO0FBQUEsQyIsImZpbGUiOiJsb2NhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IGhvaXN0Tm9uUmVhY3RTdGF0aWNzIGZyb20gJ2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzJztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgKiBhcyBVSUFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnLi9sb2NhbFJlZHVjZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoQ29uZmlnKSA9PiAoQ29tcG9uZW50KSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRNYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xuICBjb25zdCBDb25uZWN0Q29tcCA9IGNvbm5lY3QoXG4gICAgICAgIENvbmZpZy5tYXBTdGF0ZVRvUHJvcHMgfHwgZGVmYXVsdE1hcFN0YXRlVG9Qcm9wcyxcbiAgICAgICAgQ29uZmlnLm1hcERpc3BhdGNoVG9Qcm9wcyxcbiAgICAgICAgQ29uZmlnLm1lcmdlUHJvcHMpKChwcm9wcykgPT4ge1xuICAgICAgICAgIGNvbnN0IG5ld1Byb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMpO1xuICAgICAgICAgIGRlbGV0ZSBuZXdQcm9wcy5zdG9yZTtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICByZXR1cm4gKDxDb21wb25lbnQgey4uLm5ld1Byb3BzfSAvPik7XG4gICAgICAgIH0pO1xuICBjbGFzcyBVSSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICAgIGNvbnN0IGNvbXBLZXkgPSB0eXBlb2YgQ29uZmlnLmtleSA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgICAgICAgICAgQ29uZmlnLmtleShwcm9wcywgY29udGV4dCkgOiBDb25maWcua2V5O1xuICAgICAgdGhpcy5zdG9yZSA9IG51bGw7XG4gICAgICBpbnZhcmlhbnQoQ29uZmlnLmtleSxcbiAgICAgJ1tyZWR1eC1mcmFjdGFsXSAtIFlvdSBtdXN0IHN1cHBseSBhICBrZXkgdG8gdGhlIGNvbXBvbmVudCBlaXRoZXIgYXMgYSBmdW5jdGlvbiBvciBzdHJpbmcnKTtcbiAgICAgIHRoaXMuY29tcEtleSA9IGNvbXBLZXk7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlID0gbnVsbDtcbiAgICB9XG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgY29uc3QgZXhpc3RpbmdTdGF0ZSA9IHRoaXMuY29udGV4dC5zdG9yZS5nZXRTdGF0ZSgpLmxvY2FsW3RoaXMuY29tcEtleV07XG4gICAgICBjb25zdCBzdG9yZVJlc3VsdCA9IGNyZWF0ZVN0b3JlKFxuICAgICAgICAgICAgICAgIENvbmZpZy5jcmVhdGVTdG9yZSwgdGhpcy5wcm9wcyxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBLZXksIGV4aXN0aW5nU3RhdGUsIHRoaXMuY29udGV4dCk7XG4gICAgICB0aGlzLnN0b3JlID0gc3RvcmVSZXN1bHQuc3RvcmU7XG4gICAgICB0aGlzLnN0b3JlQ2xlYW51cCA9IHN0b3JlUmVzdWx0LmNsZWFudXA7XG4gICAgICB0aGlzLmNvbnRleHQuc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBVSUFjdGlvbnMuQ1JFQVRFX0NPTVBPTkVOVF9TVEFURSxcbiAgICAgICAgcGF5bG9hZDogeyBjb25maWc6IENvbmZpZywgcHJvcHM6IHRoaXMucHJvcHMsIHN0b3JlOiB0aGlzLnN0b3JlLCBoYXNTdG9yZTogISFDb25maWcuY3JlYXRlU3RvcmUgfSxcbiAgICAgICAgbWV0YTogeyByZWR1eEZyYWN0YWxUcmlnZ2VyQ29tcG9uZW50OiB0aGlzLmNvbXBLZXkgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIGNvbnN0IHBlcnNpc3QgPSB0eXBlb2YgQ29uZmlnLnBlcnNpc3QgPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWcucGVyc2lzdCh0aGlzLnByb3BzLCB0aGlzLmNvbnRleHQpIDogQ29uZmlnLnBlcnNpc3Q7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBVSUFjdGlvbnMuREVTVFJPWV9DT01QT05FTlRfU1RBVEUsXG4gICAgICAgICAgcGF5bG9hZDogeyBwZXJzaXN0LCBoYXNTdG9yZTogISFDb25maWcuY3JlYXRlU3RvcmUgfSxcbiAgICAgICAgICBtZXRhOiB7IHJlZHV4RnJhY3RhbFRyaWdnZXJDb21wb25lbnQ6IHRoaXMuY29tcEtleSB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5zdG9yZUNsZWFudXApIHtcbiAgICAgICAgICB0aGlzLnN0b3JlQ2xlYW51cCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmUgPSBudWxsO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLnN0b3JlKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBjb25zb2xlLndhcm4oYFByb3BzIG5hbWVkICdzdG9yZScgY2Fubm90IGJlIHBhc3NlZCB0byByZWR1eC1mcmFjdGFsICdsb2NhbCdcbiAgICAgICAgICAgICAgICBIT0Mgd2l0aCBrZXkgJHt0aGlzLmNvbXBLZXl9IHNpbmNlIGl0J3MgYSByZXNlcnZlZCBwcm9wYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUgJiYgPENvbm5lY3RDb21wXG4gICAgICAgICAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICAgICAgICAgIHN0b3JlPXt0aGlzLnN0b3JlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgIH1cbiAgICB9XG5cbiAgVUkuY29udGV4dFR5cGVzID0gT2JqZWN0LmFzc2lnbih7fSwgQ29tcG9uZW50LmNvbnRleHRUeXBlcywge1xuICAgIHN0b3JlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgc3Vic2NyaWJlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgZGlzcGF0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBnZXRTdGF0ZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KSxcbiAgfSk7XG4gIFVJLnByb3BUeXBlcyA9IE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICBzdG9yZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHN1YnNjcmliZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGRpc3BhdGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgZ2V0U3RhdGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gIH0pO1xuICBjb25zdCBkaXNwbGF5TmFtZSA9IENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fCBDb21wb25lbnQubmFtZSB8fCAnQ29tcG9uZW50JztcbiAgVUkuZGlzcGxheU5hbWUgPSBgbG9jYWwoJHtkaXNwbGF5TmFtZX0pYDtcbiAgcmV0dXJuIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKFVJLCBDb21wb25lbnQpO1xufTtcbiJdfQ==