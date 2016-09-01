'use strict';

var enzyme = require('enzyme');
var React = require('react');

var inherit = require('inherit');

var MOD_DELIM = '_',
    ELEM_DELIM = '__',
    NAME_PATTERN = '[a-zA-Z0-9-]+';

function BemWrapper(componentData) {
    this.__self = BemWrapper;
    this._class = this.__self.components[componentData.block];

    this._data = componentData;

    this.component = enzyme.mount(React.createElement(this._class, this._data.mods));
    this._name = this.component.type.displayName;
    this.domElem = this.component.find('.' + this._name);

    this._modCache = Object.assign({}, this._data.mods);
    this.__self._name = this._name;
};

// storage for bem declarations
BemWrapper.blocks = {};
// storage for react classes
BemWrapper.components = {};

BemWrapper.create = function(block, params) {
    //TODO: params ??
    typeof block == 'string' && (block = {block: block});

    var blockDecl = this.blocks[block.block];
    if (!blockDecl) {
        blockDecl = BemWrapper;
    }

    return new blockDecl(block);
};

BemWrapper.register = function(blockName, componentClass) {
    this.components[blockName] = componentClass;
};

BemWrapper.unregister = function(blockName) {
    delete this.components[blockName];
};

BemWrapper.decl = function(decl, props, staticProps) {
    if(typeof decl == 'string') {
        decl = {block: decl};
    } else if(decl.name) {
        decl.block = decl.name;
    }
    // TODO: think about it

    var component = this.components[decl.block];
    if (!component) {
        component = React.createClass(Object.assign({render: () => null}, props));
        this.components[decl.block] = component;
    }

    return (this.blocks[decl.block] = inherit(BemWrapper, props, staticProps));
};

BemWrapper.prototype.setMod = function(elem, modName, modVal) {
    if(typeof modVal == 'undefined') {
        modVal = modName;
        modName = elem;
        elem = undefined;
    }

    var _this = this;

    var elemName,
        curModVal = elem ?
            _this._getElemMod(modName, elem, elemName = _this.__self._extractElemNameFrom(elem)) :
            _this.getMod(modName);

    if(curModVal === modVal) {
        return _this;
    }

    // TODO: remove empty strings here
    _this._modCache[modName] = modVal;
    _this._data.mods = Object.assign({}, _this._data.mods, _this._modCache);

    this.component = enzyme.mount(React.createElement(this._class, this._data.mods));
    this.domElem = this.component.find('.' + this._name);

    return _this;
}

BemWrapper.prototype.delMod = function(elem, modName) {
    if(!modName) {
        modName = elem;
        elem = undefined;
    }

    return this.setMod(elem, modName, '');
};

BemWrapper.prototype.hasMod = function(elem, modName, modVal) {
    var len = arguments.length,
        invert = false;

    if(len == 1) {
        modVal = '';
        modName = elem;
        elem = undefined;
        invert = true;
    } else if(len == 2) {
        if(typeof elem == 'string') {
            modVal = modName;
            modName = elem;
            elem = undefined;
        } else {
            modVal = '';
            invert = true;
        }
    }

    var res = this.getMod(elem, modName) === modVal;
    return invert ? !res : res;
};

BemWrapper.prototype.getMod = function(elem, modName) {
    var type = typeof elem;
    if(type === 'string' || type === 'undefined') { // Elem either omitted or undefined
        modName = elem || modName;
        var modCache = this._modCache;
        return modName in modCache ?
            modCache[modName] :
            modCache[modName] = this._extractModVal(modName);
    }

    throw new Error('ups no elems right now');
    //return this._getElemMod(modName, elem);
};

BemWrapper.prototype.getMods = function(elem) {
    var hasElem = elem && typeof elem != 'string',
        modCache = this._modCache,
        modNames = [].slice.call(arguments, hasElem ? 1 : 0);

    return !modNames.length ?
        modCache :
        modNames.reduce(function(res, mod) {
            if(mod in modCache) {
                res[mod] = modCache[mod];
            }

            return res;
        }, {});
};

BemWrapper.prototype._extractModVal = function(modName, elem, elemName) {
    var domNode = (elem || this.domElem).get(0),
        matches;

    domNode &&
        (matches = domNode.className
            .match(this.__self._buildModValRE(modName, elemName || elem)));

    return matches ? matches[2] : '';
};

BemWrapper.prototype.elem = function() {
    console.log('not implemented yet');
};

// STATIC

BemWrapper._buildModValRE = function(modName, elem, quantifiers) {
    return new RegExp(
        '(\\s|^)' + this._buildModClassPrefix(modName, elem) + '(' + NAME_PATTERN + ')(?=\\s|$)',
        quantifiers
    );
};

BemWrapper._buildElemNameRE = function() {
    return new RegExp(this._name + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');
};

BemWrapper._extractElemNameFrom = function(elem) {
    if(elem.__bemElemName) {
        return elem.__bemElemName;
    }

    var matches = elem[0].className.match(this._buildElemNameRE());
    return matches ? matches[1] : undefined;
};

BemWrapper._buildModClassPrefix = function(modName, elem) {
    return this._name +
           (elem ?
               ELEM_DELIM + (typeof elem === 'string' ? elem : this._extractElemNameFrom(elem)) :
               '') +
           MOD_DELIM + modName + MOD_DELIM;
};

BemWrapper.DOM = BemWrapper;

BemWrapper.DOM.destruct = function(domElem) {
    domElem.root.unmount();
}

module.exports = BemWrapper;
