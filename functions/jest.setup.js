const admin = require('firebase-admin');

jest.mock('firebase-admin', () => {
  const createUser = jest.fn();
  const deleteUser = jest.fn();
  const getUser = jest.fn();
  const collection = jest.fn().mockReturnThis();
  const doc = jest.fn().mockReturnThis();
  const get = jest.fn();
  const set = jest.fn();
  const update = jest.fn();
  const functions = {
    https: {
      onCall: jest.fn()
    }
  };

  return {
    initializeApp: jest.fn(),
    auth: jest.fn().mockReturnValue({
      createUser,
      deleteUser,
      getUser
    }),
    firestore: jest.fn().mockReturnValue({
      collection,
      doc,
      get,
      set,
      update
    }),
    functions
  };
});

