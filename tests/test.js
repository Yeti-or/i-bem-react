var expect = require('chai').expect;

var React = require('react');
var BEM = require('..');

var ReactComponent = require('./component.js');

describe('i-bem-react', () => {

describe('create', function() {
    it('should return instance of block', function() {
        var block = BEM.decl('block', {}),
            instance = BEM.create('block');

        expect(instance instanceof block).to.be.true;
        delete BEM.blocks.block;
    });
});

describe('mods', () => {

    var block;

    beforeEach(function() {
        BEM.decl('block', {});
        block = BEM.create({block: 'block', mods: {mod1: 'val1', mod2: true, mod3: false}});
    });

    afterEach(function() {
        delete BEM.blocks.block;
    });

    describe('getMods', function() {
        it('should return specified mods', function() {
            expect(block.getMods('mod1', 'mod2', 'mod3')).to.eql({mod1: 'val1', mod2: true, mod3: false});
        });
    });

    describe('getMod', function() {
        it('should not drop cache ISL-2432', function() {
            block.getMods();
            expect(block.getMod('mod1')).to.eql('val1');
        });

        it('should return current mod\'s value', function() {
            expect(block.getMod('mod1')).to.eql('val1');
        });

        // TODO: 0.3 compatibility
        xit('should return current boolean mod\'s value', function() {
            expect(block.getMod('mod2')).to.be.true;
            expect(block.getMod('mod3')).to.eql('');
        });

        it('should return \'\' for undefined mod', function() {
            expect(block.getMod('mod4')).to.eql('');
        });
    });

    describe('setMod', function() {
        it('should update mod value', function() {
            block.setMod('mod1', 'val2');
            expect(block.getMod('mod1')).to.eql('val2');
        });

        // TODO: 0.3 compatibility
        xit('should update boolean mod value', function() {
            block
                .setMod('mod1', true)
                .getMod('mod1').should.be.true;

            expect(block.setMod('mod1', true).getMod('mod1')).to.eql(true);

            block
                .setMod('mod1', false)
                .getMod('mod1').should.be.equal('');

            expect(block.setMod('mod1', false).getMod('mod1')).to.eql(false);

            block
                .setMod('mod1')
                .getMod('mod1').should.be.true;

            expect(block.setMod('mod1').getMod('mod1')).to.eql(true);
        });

        // TODO: 0.3 compatibility
        xit('should cast non-boolean mod value to string', function() {
            block.setMod('mod1', 1);
            expect(block.getMod('mod1')).to.eql('1');
        });
    });

    describe('delMod', function() {
        it('should set mod\'s value to \'\'', function() {
           expect(block.delMod('mod1').getMod('mod1')).to.eql('');
        });
    });

    it('shoule hasMod', () => {
        expect(block.hasMod('hovered')).to.eql(false);
    });

});

});
