import setup from './test.setup.js';
import { Simulate } from 'react-addons-test-utils';


const ENTER = 13;


describe('App', function() {
  let $component;

  beforeEach(function() {
    $component = setup();
  });

  describe('adding new todos', function() {
    it('should focus on the new todo input when the page loads', function() {
      expect(document.activeElement).to.equal(
        $component.find('.new-todo')[0]);
    });

    it('should add a new todo when pressing enter', function() {
      const node = $component.find('.new-todo')[0];

      // TODO: this exposes too much of the internals; figure out a way to write
      // tests without knowing all of this
      Simulate.change(node, { target: { value: 'buy milk' } });
      Simulate.keyDown(node, { keyCode: ENTER });

      expect($component.find('.todo')).to.have.length(1);
      expect($component.find('.todo').text()).to.equal('buy milk');
    });
  });
});
