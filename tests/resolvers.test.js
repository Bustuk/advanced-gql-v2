const resolvers = require('../src/resolvers');

describe('resolvers', () => {
  test('feed', async () => {
    const result = resolvers.Query.feed(null, null, {
      models: 
      { Post: 
        { 
          findMany: jest.fn(() => [{id: 1, message: 'hello', createdAt: 12345839, likes: 20, views: 300}]) 
        } 
      }
    })

    expect(result).toMatchSnapshot()
  })
})