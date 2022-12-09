const gql = require('graphql-tag')
const createTestServer = require('./helper')

const CRREATE_POST = gql`
  mutation {
    createPost(input: { message: "hello" }) {
      message
    }
  }
`

describe('mutations', () => {
  test('createPost', async () => {
    const mockedFn = jest.fn(() => ({ message: 'hello' }))
    const {mutate} = createTestServer({
      user: {id: 1},
      models: {
        Post: {
          createOne: mockedFn
        },
        user: {
          id: 1
        }
      }
    })

    const res = await mutate({query: CRREATE_POST})
    expect(mockedFn).toBeCalledWith({ message: 'hello', author: 1 })
    expect(res).toMatchSnapshot()
  })
})