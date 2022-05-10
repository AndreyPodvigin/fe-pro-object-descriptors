import {
  assignLockedValues,
  freezeAllInObject,
  getKeysByDescriptor,
  isObjectAnyFrozen,
} from '../index';

describe('all funcs', () => {
  describe('getKeysByDescriptor()', () => {
    it('returns correct keys', () => {
      const object = {};

      Object.defineProperties(object, {
        firstName: {
          value: 'Test',
          writable: false,
          enumerable: false,
          configurable: false,
        },
        lastName: {
          value: 'Test',
          writable: true,
          enumerable: false,
          configurable: false,
        },
        age: {
          value: 80,
          writable: false,
          enumerable: true,
          configurable: false,
        },
        checker: {
          value: 80,
          writable: false,
          enumerable: false,
          configurable: true,
        },
      });

      expect(getKeysByDescriptor(object, 'writable')).toStrictEqual([
        'lastName',
      ]);
      expect(getKeysByDescriptor(object, 'enumerable')).toStrictEqual(['age']);
      expect(getKeysByDescriptor(object, 'configurable')).toStrictEqual([
        'checker',
      ]);
    });
  });

  describe('isObjectAnyFrozen()', () => {
    it('should return correct value', () => {
      expect(isObjectAnyFrozen(Object.freeze({}))).toStrictEqual(true);
      expect(isObjectAnyFrozen(Object.seal({}))).toStrictEqual(true);
      expect(isObjectAnyFrozen(Object.preventExtensions({}))).toStrictEqual(
        true
      );
      expect(isObjectAnyFrozen({})).toStrictEqual(false);
    });
  });

  describe('assignLockedValues()', () => {
    it('should return new object', () => {
      const object = {
        name: 'test',
        age: 24,
      };
      const result = assignLockedValues(object, 'newV');
      expect(result).toStrictEqual({
        name: 'test',
        age: 24,
        newV: null,
      });
      expect(Object.getOwnPropertyDescriptor(result, 'newV')).toStrictEqual({
        writable: false,
        enumerable: true,
        configurable: true,
        value: null,
      });
      expect(object).not.toStrictEqual({
        name: 'test',
        age: 24,
        newV: null,
      });
    });

    describe('with existing value', () => {
      it('should return correct value', () => {
        const object = {
          name: 'test',
          age: 24,
        };
        const result = assignLockedValues(object, 'name');
        expect(result).toStrictEqual({
          name: 'test',
          age: 24,
        });
        expect(Object.getOwnPropertyDescriptor(result, 'name')).toStrictEqual({
          writable: false,
          enumerable: true,
          configurable: true,
          value: 'test',
        });
        expect(object === result).toStrictEqual(false);
      });
    });
  });

  describe('freezeAllInObject', () => {
    it('returns correct value', () => {
      const obj = { name: 'test' };
      const res = freezeAllInObject(obj);

      expect(res !== undefined).toStrictEqual(true);
      expect(
        Object.isFrozen(res) &&
          Object.isSealed(res) &&
          !Object.isExtensible(res)
      ).toStrictEqual(true);
      expect(res !== obj).toStrictEqual(true);
    });
  });
});
