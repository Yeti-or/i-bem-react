'use strict';

const enzyme = require('enzyme');

const MOD_DELIM = '_',
      ELEM_DELIM = '__',
      NAME_PATTERN = '[a-zA-Z0-9-]+';

module.exports = class BemWrapper {
    constructor(componentData) {
        this.component = enzyme.mount(componentData);
        this._name = componentData.type.displayName;
        this.domElem = this.component.find('.' + this._name);

        this._modCache = {};
        this.__self = BemWrapper;
        this.__self._name = this._name;
    }

    hasMod(elem, modName, modVal) {
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
    }

    getMod (elem, modName) {
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
    }

    _extractModVal (modName, elem, elemName) {
        var domNode = (elem || this.domElem).get(0),
            matches;

        domNode &&
            (matches = domNode.className
                .match(this.__self._buildModValRE(modName, elemName || elem)));

        return matches ? matches[2] : '';
    }


    static _buildModValRE (modName, elem, quantifiers) {
        return new RegExp(
            '(\\s|^)' + this._buildModClassPrefix(modName, elem) + '(' + NAME_PATTERN + ')(?=\\s|$)',
            quantifiers
        );
    }

    static _buildElemNameRE () {
        return new RegExp(this._name + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');
    }

    static _extractElemNameFrom (elem) {
        if(elem.__bemElemName) {
            return elem.__bemElemName;
        }

        var matches = elem[0].className.match(this._buildElemNameRE());
        return matches ? matches[1] : undefined;
    }

    static _buildModClassPrefix (modName, elem) {
        return this._name +
               (elem ?
                   ELEM_DELIM + (typeof elem === 'string' ? elem : this._extractElemNameFrom(elem)) :
                   '') +
               MOD_DELIM + modName + MOD_DELIM;
    }
}
