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

    describe('hasMod', function() {
        it('should return true for matching mod\'s value', function() {
            expect(block.hasMod('mod1', 'val1')).to.eql(true);
        });

        it('should return false for non-matching mod\'s value', function() {
            expect(block.hasMod('mod1', 'val2')).to.eql(false);
        });

        it('should return false for undefined mod\'s value', function() {
            expect(block.hasMod('mod2', 'val2')).to.eql(false);
        });

        it('in short form should return true for non-empty mod\'s value', function() {
            expect(block.hasMod('mod1')).to.eql(true);
        });

        it('in short form should return true for empty mod\'s value', function() {
            expect(block.setMod('mod1', '').hasMod('mod1')).to.eql(false);
        });

        // TODO: 0.3 compatibility
        xit('should treat defined non-boolean mod value as a string', function() {
            expect(block.setMod('mod1', 1).hasMod('mod1', 1)).to.eql(true);
            expect(block.hasMod('mod1', '1')).to.eql(true);
            expect(block.setMod('mod1', '2').hasMod('mod1', 2)).to.eql(true);
        });

        it('in short form should return true for undefined mod', function() {
            expect(block.hasMod('mod4')).to.eql(false);
        });

        // TODO: 0.3 compatibility
        xit('should return true for matching boolean mod\'s value', function() {
            expect(block.setMod('mod1', true).hasMod('mod1')).to.eql(true, 'setMod().hasMod() return true');
            expect(block.hasMod('mod1', true)).to.eql(true, 'hasMod return true');
        });
    });

    describe('toggleMod', function() {
        it('should switch mod\'s values', function() {
            expect(block.toggleMod('mod1', 'val1', 'val2').hasMod('mod1', 'val2')).to.eql(true);
            expect(block.toggleMod('mod1', 'val1', 'val2').hasMod('mod1', 'val1')).to.eql(true);
        });

        it('should switch mod\'s value if "modVal2" param omited', function() {
            expect(block.toggleMod('mod1', 'val1').hasMod('mod1')).to.eql(false, 'should return false');
            expect(block.toggleMod('mod1', 'val1').hasMod('mod1')).to.eql(true, 'should return true');
        });

        it('should switch boolean mod\'s value', function() {
            expect(block.toggleMod('mod2').hasMod('mod2')).to.eql(true);
        });

        it('should switch mod\'s values according to "condition" param', function() {
            expect(block.toggleMod('mod1', 'val1', 'val2', true).hasMod('mod1', 'val1'))
                .to.eql(true, 'should set value "val1", toggleMod true');

            expect(block.toggleMod('mod1', 'val1', 'val2', false).hasMod('mod1', 'val2'))
                .to.eql(true, 'should set value "val2", toggleMod false');
        });

        it('should switch mod\'s value according to "condition" param if "modVal2" param omited', function() {
            expect(block.toggleMod('mod1', 'val1', true).hasMod('mod1', 'val1')).to.eql(true, 'should return true');
            expect(block.toggleMod('mod1', 'val1', false).hasMod('mod1')).to.eql(false, 'should return false');
        });
    });

});

});
