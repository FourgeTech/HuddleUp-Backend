const functions = require('firebase-functions');
const firebaseFunctionsTest = require('firebase-functions-test')();
const admin = require('firebase-admin');
const { createUser, createUserWithGoogle } = require('../src/controllers/userController');

jest.mock('../src/services/userService', () => ({
  createUserDocument: jest.fn()
}));

// Create A New User Tests
describe('createUser', () => {
  let wrapped;

  beforeEach(() => {
      wrapped = firebaseFunctionsTest.wrap(createUser);
  });

  afterEach(() => {
      firebaseFunctionsTest.cleanup();
      jest.clearAllMocks();
  });

  it('should successfully create a user and return success', async () => {
      // Set up mock data
      const mockData = {
          email: 'test@example.com',
          password: 'password123'
      };
      const mockUid = '123456';
      const mockUser = {
          uid: mockUid,
          email: mockData.email
      };

      // Mock Firebase Admin and createUserDocument
      admin.auth().createUser.mockResolvedValue(mockUser);
      createUserDocument.mockResolvedValue();

      const result = await wrapped(mockData);

      expect(result).toEqual({
          status: 'success',
          message: 'User successfully created.',
          uid: mockUid,
          email: mockData.email
      });
      expect(admin.auth().createUser).toHaveBeenCalledWith({
          email: mockData.email,
          password: mockData.password
      });
      expect(createUserDocument).toHaveBeenCalledWith(mockData, mockUid);
  });

  it('should handle errors and return error response', async () => {
      // Set up mock data
      const mockData = {
          email: 'test@example.com',
          password: 'password123'
      };

      // Mock Firebase Admin to throw an error
      const error = new Error('Test error');
      admin.auth().createUser.mockRejectedValue(error);

      const result = await wrapped(mockData);

      expect(result).toEqual({
          status: 'error',
          message: 'Test error',
          code: 500
      });
      expect(admin.auth().createUser).toHaveBeenCalledWith({
          email: mockData.email,
          password: mockData.password
      });
  });
});

// Create A New User With Google Tests
describe('createUserWithGoogle', () => {
  let wrapped;
  let firestore;

  beforeEach(() => {
    wrapped = firebaseFunctionsTest.wrap(createUserWithGoogle);
    firestore = admin.firestore();
  });

  afterEach(() => {
    firebaseFunctionsTest.cleanup();
    jest.clearAllMocks();
  });

  it('should create a new user document if user does not exist', async () => {
    const mockData = {
      uid: '123456',
      email: 'test@example.com',
    };

    // Mock Firestore to return no existing document
    firestore.collection().doc().get.mockResolvedValue({
      exists: false
    });
    createUserDocument.mockResolvedValue();

    const result = await wrapped(mockData);

    expect(result).toEqual({
      status: 'success',
      message: 'User successfully signed in with Google.'
    });
    expect(firestore.collection).toHaveBeenCalledWith('users');
    expect(firestore.doc).toHaveBeenCalledWith(mockData.uid);
    expect(createUserDocument).toHaveBeenCalledWith(mockData, mockData.uid);
  });

  it('should not create a new user document if user exists', async () => {
    const mockData = {
      uid: '123456',
      email: 'test@example.com',
    };

    // Mock Firestore to return an existing document
    firestore.collection().doc().get.mockResolvedValue({
      exists: true
    });

    const result = await wrapped(mockData);

    expect(result).toEqual({
      status: 'success',
      message: 'User successfully signed in with Google.'
    });
    expect(firestore.collection).toHaveBeenCalledWith('users');
    expect(firestore.doc).toHaveBeenCalledWith(mockData.uid);
    expect(createUserDocument).not.toHaveBeenCalled();
  });

  it('should handle errors and return error response', async () => {
    const mockData = {
      uid: '123456',
      email: 'test@example.com',
    };

    const error = new Error('Test error');
    firestore.collection().doc().get.mockRejectedValue(error);

    const result = await wrapped(mockData);

    expect(result).toEqual({
      status: 'error',
      message: 'Test error',
      code: 500
    });
    expect(firestore.collection).toHaveBeenCalledWith('users');
    expect(firestore.doc).toHaveBeenCalledWith(mockData.uid);
    expect(createUserDocument).not.toHaveBeenCalled();
  });
});