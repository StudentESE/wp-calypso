/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { mergeMethodEdits } from '../helpers';

describe( 'mergeMethodEdits', () => {
	it( 'should return the current edits when there are no saved edits', () => {
		const zoneMethodEdits = {
			creates: [],
			updates: [],
			deletes: [],
		};
		const currentMethodEdits = {
			creates: [ { id: { index: 0 } } ],
			updates: [ { id: 1, title: 'Wololo' } ],
			deletes: [ { id: 2 } ],
		};

		expect( mergeMethodEdits( zoneMethodEdits, currentMethodEdits ) ).to.deep.equal( currentMethodEdits );
	} );

	it( 'should return the saved edits when there are no current edits', () => {
		const zoneMethodEdits = {
			creates: [ { id: { index: 0 } } ],
			updates: [ { id: 1, title: 'Wololo' } ],
			deletes: [ { id: 2 } ],
		};
		const currentMethodEdits = {
			creates: [],
			updates: [],
			deletes: [],
		};

		expect( mergeMethodEdits( zoneMethodEdits, currentMethodEdits ) ).to.deep.equal( zoneMethodEdits );
	} );

	it( 'should return the union of all the edits', () => {
		const zoneMethodEdits = {
			creates: [ { id: { index: 0 } } ],
			updates: [ { id: 1, title: 'Wololo' } ],
			deletes: [ { id: 2 } ],
		};
		const currentMethodEdits = {
			creates: [ { id: { index: 1 } } ],
			updates: [ { id: 3, title: 'Wololo' } ],
			deletes: [ { id: 4 } ],
		};

		expect( mergeMethodEdits( zoneMethodEdits, currentMethodEdits ) ).to.deep.equal( {
			creates: [ { id: { index: 0 } }, { id: { index: 1 } } ],
			updates: [ { id: 1, title: 'Wololo' }, { id: 3, title: 'Wololo' } ],
			deletes: [ { id: 2 }, { id: 4 } ],
		} );
	} );

	it( 'should merge edits for the same shipping zone method', () => {
		const zoneMethodEdits = {
			creates: [ { id: { index: 0 }, key: 'value', title: 'Wololo' } ],
			updates: [ { id: 1, key: 'value', title: 'Wololo' } ],
			deletes: [],
		};
		const currentMethodEdits = {
			creates: [ { id: { index: 0 }, title: 'NewCreateTitle' } ],
			updates: [ { id: 1, title: 'NewUpdateTitle' } ],
			deletes: [],
		};

		expect( mergeMethodEdits( zoneMethodEdits, currentMethodEdits ) ).to.deep.equal( {
			creates: [ { id: { index: 0 }, key: 'value', title: 'NewCreateTitle' } ],
			updates: [ { id: 1, key: 'value', title: 'NewUpdateTitle' } ],
			deletes: [],
		} );
	} );

	it( 'should remove previous updates or creates for a method that has been deleted', () => {
		const zoneMethodEdits = {
			creates: [ { id: { index: 0 }, title: 'Wololo' } ],
			updates: [ { id: 1, title: 'Wololo' } ],
			deletes: [],
		};
		const currentMethodEdits = {
			creates: [],
			updates: [],
			deletes: [ { id: { index: 0 } }, { id: 1 } ],
		};

		expect( mergeMethodEdits( zoneMethodEdits, currentMethodEdits ) ).to.deep.equal( {
			creates: [],
			updates: [],
			deletes: [ { id: 1 } ],
		} );
	} );
} );
