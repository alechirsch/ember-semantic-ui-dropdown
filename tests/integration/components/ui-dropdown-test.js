import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-dropdown', 'Integration | Component | ui dropdown', {
  integration: true
});

test('it renders from an array', function(assert) {
  assert.expect(3);

  this.set('people', [ "Suman Kunwar", "Kunwar Suman" ]);
  this.render(hbs`
    {{#ui-dropdown selected=selected}}
      <div class='menu'>
      {{#each people as |person|}}
        <div class='item' data-value={{person}}>{{person}}</div>
      {{/each}}
      </div>
    {{/ui-dropdown}}
  `);

  assert.equal(this.$('.item').length, 2);
  assert.equal(this.get('selected'), undefined);

  this.$(".menu .item[data-value='Suman Kunwar']").click();
  assert.equal(this.get('selected'), 'Suman Kunwar');
});

test('it renders from an object array', function(assert) {
  assert.expect(3);

  this.set('people', [
    { id: 1, name: "Suman Kunwar" },
    { id: 2, name: "Kunwar Suman" }
  ]);

  this.render(hbs`
    {{#ui-dropdown selected=selected}}
      <div class='menu'>
      {{#each people as |person|}}
        <div class='item' data-value={{person.id}}>{{person.name}}</div>
      {{/each}}
      </div>
    {{/ui-dropdown}}
  `);

  assert.equal(this.$('.item').length, 2);
  assert.equal(this.get('selected'), undefined);

  this.$(".menu .item[data-value=1]").click();
  assert.equal(this.get('selected'), 1);
});

test('it renders with an option selected', function(assert) {
  assert.expect(3);

  this.set('people', [
    { id: 1, name: "Suman Kunwar" },
    { id: 2, name: "Kunwar Suman" }
  ]);

  this.set('selected', 2);
  this.render(hbs`
    {{#ui-dropdown selected=selected}}
      <div class='menu'>
      {{#each people as |person|}}
        <div class='item' data-value={{person.id}}>{{person.name}}</div>
      {{/each}}
      </div>
    {{/ui-dropdown}}
  `);

  assert.equal(this.$('.item').length, 2);
  assert.equal(this.get('selected'), 2);

  this.$(".menu .item[data-value=1]").click();
  assert.equal(this.get('selected'), 1);
});

test('it renders multiple', function(assert) {
  assert.expect(3);

  this.set('people', [
    { id: 1, name: "Suman Kunwar" },
    { id: 2, name: "Kunwar Suman" }
  ]);

  this.render(hbs`
    {{#ui-dropdown class='multiple' selected=selected}}
      <div class='menu'>
      {{#each people as |person|}}
        <div class='item' data-value={{person.id}}>{{person.name}}</div>
      {{/each}}
      </div>
    {{/ui-dropdown}}
  `);

  assert.equal(this.$('.item').length, 2);
  assert.equal(this.get('selected'), undefined);

  this.$(".menu .item[data-value=1]").click();
  this.$(".menu .item[data-value=2]").click();
  assert.equal(this.get('selected'), '1,2');
});

test('it sets the value from the binding', function(assert) {
  assert.expect(3);

  this.set('people_id', 2);
  this.set('people', [
    { id: 1, name: "Suman Kunwar" },
    { id: 2, name: "Kunwar Suman" }
  ]);

  this.render(hbs`
    {{#ui-dropdown selected=people_id}}
      <div class='menu'>
      {{#each people as |person|}}
        <div class="item" data-value="{{person.id}}">
          {{person.name}}
        </div>
      {{/each}}
      </div>
    {{/ui-dropdown}}
  `);

  assert.equal(this.$('.item').length, 2);
  assert.equal(this.$('.item.selected').length, 1);
  assert.equal(this.$('.item.selected').data('value'), 2);
});

test('it updates the value if updated from the binding', function(assert) {
  assert.expect(3);

  this.set('people_id', 2);
  this.set('people', [
    { id: 1, name: "Suman Kunwar" },
    { id: 2, name: "Kunwar Suman" }
  ]);

  this.render(hbs`
    {{#ui-dropdown selected=people_id}}
      <div class='menu'>
      {{#each people as |person|}}
        <div class="item" data-value="{{person.id}}">
          {{person.name}}
        </div>
      {{/each}}
      </div>
    {{/ui-dropdown}}
  `);

  assert.equal(this.$('.item').length, 2);

  this.set('people_id', 1);
  assert.equal(this.$('.item.selected').data('value'), 1);

  $(this.$('.item')[0]).click();
  assert.equal(this.get('people_id'), 1);
});

test('it can set the selected value without binding for full DDAU', function(assert) {
  assert.expect(4);

  this.set('people_id', 2);
  this.set('people', [
    { id: 1, name: "Suman Kunwar" },
    { id: 2, name: "Kunwar Suman" }
  ]);

  this.on('update', function(component, value) {
    this.set('people_id', value);
  });

  this.render(hbs`
    {{#ui-dropdown onChange=(action 'update')}}
      <input type="hidden" name="person" value="{{people_id}}" />
      <div class='menu'>
      {{#each people as |person|}}
        <div class="item" data-value="{{person.id}}">
          {{person.name}}
        </div>
      {{/each}}
      </div>
    {{/ui-dropdown}}
  `);

  assert.equal(this.$('.item').length, 2);
  assert.equal(this.$('.item.selected').data('value'), 2);

  $(this.$('.item')[0]).click();
  assert.equal(this.$('.item.selected').data('value'), 1);
  assert.equal(this.get('people_id'), 1);
});

test('it renders and clears the value if it changes and isnt found', function(assert) {
  assert.expect(7);

  this.set('people', Ember.A([
    { id: 1, name: "Suman Kunwar" },
    { id: 2, name: "Kunwar Suman" }
  ]));

  this.render(hbs`
    {{#ui-dropdown selected=selected.id}}
      <div class='menu'>
      {{#each people as |person|}}
        <div class='item' data-value={{person.id}}>{{person.name}}</div>
      {{/each}}
      </div>
    {{/ui-dropdown}}
  `);

  assert.equal(this.$('.item').length, 2, "Right number of items");
  assert.equal(this.get('selected'), undefined, "Nothing is selected");

  this.set('selected', this.get('people').objectAt(1));
  assert.equal(this.$('.item.active').text(), "Kunwar Suman");

  this.$(".menu .item[data-value=1]").click();
  assert.equal(this.get('selected.id'), "1", "Suman has been selected");

  // Now clear the property
  this.set('selected', null);

  assert.equal(this.$('.item').length, 2, "Right number of items");
  assert.equal(this.$('.item.active').length, 0);
  assert.equal(this.get('selected'), undefined, "Nothing is selected");
});
