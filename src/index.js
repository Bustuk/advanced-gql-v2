const {ApolloServer, AuthenticationError, SchemaDirectiveVisitor} = require('apollo-server')
const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')
const {createToken, getUserFromToken} = require('./auth')
const db = require('./db')
const { defaultFieldResolver } = require('graphql')
const { FormatDateDirective, AuthenticationDirective, AuthorizationDirective } = require('./directives')
class LogDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, type) {
    const resolve = field.resolve || defaultFieldResolver
    field.resolve = async function (root, {format, ...rest}, ctx, info) {
      console.log(`⚡️  ${type.objectType}.${field.name}`)
      return resolve.call(this, root, rest, ctx, info)
    }
  }
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({req, connection}) {
    const context = {...db}
    if (connection) {
      return {...context, ...connection.context}
    }
    const token = req.headers.authorization
    const user = getUserFromToken(token)
    return {...context, user, createToken}
  },
  schemaDirectives: {
    log: LogDirective,
    formatDate: FormatDateDirective,
    authentication: AuthenticationDirective,
    authorization: AuthorizationDirective
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket) => {
      const token = connectionParams.authorization
      const user = getUserFromToken(token)
      if (!user) {
        throw new AuthenticationError('subscription connection failed')
      }
      return { user }
    }
  }
})

server.listen(4000).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`)
})
