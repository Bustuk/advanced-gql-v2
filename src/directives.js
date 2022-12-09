const { SchemaDirectiveVisitor, AuthenticationError } = require('apollo-server')
const { defaultFieldResolver, GraphQLString } = require('graphql')
const {formatDate} = require('./utils')

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const {resolve = defaultFieldResolver} = field
    const { format: defaultFormat } = this.args
    field.args.push({
      name: 'format',
      type: GraphQLString
    })
    field.resolve = async function (root, {format, ...rest}, ctx, info) {
      const date = await resolve.call(this, root, rest, ctx, info)
      return formatDate(date, format || defaultFormat)
    }
    field.type = GraphQLString
  }
}
class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (root, args, ctx, info) {
      if (!ctx.user) {
          throw new AuthenticationError('You must be logged in to do this')
      }
      return resolve.call(this, root, args, ctx, info)
    }
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const { role } = this.args
    field.resolve = async function (root, args, ctx, info) {
      if (ctx.user.role !== role) {
          throw new AuthenticationError('Not suffiecient permissions')
      }
      return resolve.call(this, root, args, ctx, info)
    }
  }
}
module.exports = {
    FormatDateDirective,
    AuthenticationDirective,
    AuthorizationDirective
}