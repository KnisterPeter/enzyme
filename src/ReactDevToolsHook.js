/**
 * Polyfill react-dev-tools if not available
 */
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == 'undefined') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    inject: function(renderer) {
      this.emit('renderer', {renderer});
    },
    _listeners: {},
    sub: function(evt, fn) {
      this.on(evt, fn);
    },
    on: function(evt, fn) {
      if (!this._listeners[evt]) {
        this._listeners[evt] = [];
      }
      this._listeners[evt].push(fn);
    },
    emit: function(evt, data) {
      if (this._listeners[evt]) {
        this._listeners[evt].map((fn) => fn(data));
      }
    }
  };
}
// Hook into react-dev-tools
// Note: This must be done before importing React
__REACT_DEVTOOLS_GLOBAL_HOOK__.sub('renderer', inject);

export const REACT_ROOTS = {};

function inject({renderer}) {
  const oldFn = renderer.Mount._renderNewRootComponent;
  renderer.Mount._renderNewRootComponent = function(nextElement, container) {
    const result = oldFn.apply(this, arguments);
    const rootId = renderer.Mount.getReactRootID(container);
    if (!REACT_ROOTS[rootId]) {
      REACT_ROOTS[rootId] = renderer.Mount._instancesByReactRootID[rootId]._instance;
    }
    return result;
  };
}
