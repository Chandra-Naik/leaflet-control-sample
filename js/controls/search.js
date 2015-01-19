// refer to the IControl interface
// http://leafletjs.com/reference.html#icontrol
// sample influenced by leaflet-geocoder
// https://github.com/perliedman/leaflet-control-geocoder

function sortParks(a, b) {
  var _a = a.feature.properties.park;
  var _b = b.feature.properties.park;
  if (_a < _b) {
    return -1;
  }
  if (_a > _b) {
    return 1;
  }
  return 0;
}

L.Control.Search = L.Control.extend({
	options: {
    // topright, topleft, bottomleft, bottomright
    position: 'topright',
    placeholder: 'Search...'
	},
  initialize: function (options /*{ data: {...}  }*/) {
    // constructor
    L.Util.setOptions(this, options);
	},
	onAdd: function (map) {
    // happens after added to map
    var container = L.DomUtil.create('div', 'search-container');
    this.form = L.DomUtil.create('form', 'form', container);
    var group = L.DomUtil.create('div', 'form-group', this.form);
    this.input = L.DomUtil.create('input', 'form-control input-sm', group);
    this.input.type = 'text';
    this.input.placeholder = this.options.placeholder;
    this.results = L.DomUtil.create('div', 'list-group', group);
    L.DomEvent.addListener(this.input, 'keyup', _.debounce(this.keyup, 300), this);
    L.DomEvent.addListener(this.form, 'submit', this.find, this);
    L.DomEvent.disableClickPropagation(container);
    return container;
  },
  onRemove: function (map) {
    // when removed
    L.DomEvent.removeListener(this._input, 'keyup', this.keyup, this);
    L.DomEvent.removeListener(form, 'submit', this.find, this);
  },
  keyup: function(e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      this.keydown(e);
    } else {
      this.results.innerHTML = '';
      if (this.input.value.length > 2) {
        var value = this.input.value;
        var results = _.take(_.filter(this.options.data, function(x) {
          return x.feature.properties.park.toUpperCase().indexOf(value.toUpperCase()) > -1;
        }).sort(sortParks), 10);
        this.resultElems = _.map(results, function(x) {
          var a = L.DomUtil.create('a', 'list-group-item');
          a.href = '';
          a.setAttribute('data-result-name', x.feature.properties.park);
          a.innerHTML = x.feature.properties.park;
          this.results.appendChild(a);
          L.DomEvent.addListener(a, 'click', this.itemSelected, this);
          return a;
        }, this);
        this._count = -1;
      }
    }
  },
  itemSelected: function(e) {
    L.DomEvent.preventDefault(e);
  },
  submit: function() {},
  find: function() {}
});

L.control.search = function(id, options) {
  return new L.Control.Search(id, options);
}
