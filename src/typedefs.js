const gql = require('graphql-tag')


module.exports = gql`
  directive @log on FIELD_DEFINITION
  directive @formatDate(format: String = "dd MM yyyy") on FIELD_DEFINITION
  directive @authentication on FIELD_DEFINITION
  directive @authorization(role: Role! = ADMIN) on FIELD_DEFINITION
  
  
  enum Theme {
    DARK
    LIGHT
  }

  enum Role {
    ADMIN
    MEMBER
    GUEST
  }

  type User {
    id: ID!
    email: String!
    avatar: String!
    verified: Boolean! @deprecated(reason: "Use verifiedAt deprecated")
    createdAt: String!
    posts: [Post]!
    role: Role!
    settings: Settings!
  }

  type AuthUser {
    token: String!
    user: User!
  }

  type Post {
    id: ID!
    message: String! @log
    author: User!
    createdAt: String! @formatDate
    likes: Int! @log
    views: Int!
  }

  type Settings {
    id: ID!
    user: User!
    theme: Theme!
    emailNotifications: Boolean!
    pushNotifications: Boolean!
  }

  type Invite {
    email: String!
    from: User!
    createdAt: String!
    role: Role!
  }

  input NewPostInput {
    message: String!
  }

  input UpdateSettingsInput {
    theme: Theme
    emailNotifications: Boolean
    pushNotifications: Boolean
  }

  input UpdateUserInput {
    email: String
    avatar: String
    verified: Boolean
  }

  input InviteInput {
    email: String!
    role: Role!
  }

  input SignupInput {
    email: String!
    password: String!
    role: Role!
  }

  input SigninInput {
    email: String!
    password: String!
  }

  type Query {
    me: User!
    posts: [Post]!
    post(id: ID!): Post!
    userSettings: Settings!
    feed: [Post]!
  }

  type Mutation {
    updateSettings(input: UpdateSettingsInput!): Settings!
    createPost(input: NewPostInput!): Post!
    updateMe(input: UpdateUserInput!): User
    invite(input: InviteInput!): Invite! @authorization @authentication
    signup(input: SignupInput!): AuthUser!
    signin(input: SigninInput!): AuthUser!
  }

  type Subscription {
    newPost: Post
  }
`
