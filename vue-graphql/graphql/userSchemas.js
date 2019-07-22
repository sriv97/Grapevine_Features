var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var UsersModel = require('../models').Users;

var usersType = new GraphQLObjectType({
  name: "users",
  fields: function() {
    return {
      id: {
        type: GraphQLInt
      },
      displayName: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      company: {
        type: GraphQLString
      },
      location: {
        type: GraphQLString
      },
      pets: {
        type: GraphQLList
      },
      createdAt: {
        type: GraphQLDate
      },
      updatedAt: {
        type: GraphQLDate
      }
    };
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      users: {
        type: new GraphQLList(usersType),
        resolve: function () {
          const users = UsersModel.findAll({
            order: [
              ['createdAt', 'DESC']
            ],
          })
          if (!users) {
            throw new Error('Error')
          }
          return users
        }
      },
      book: {
        type: usersType,
        args: {
          id: {
            name: 'id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const userDetails = UsersModel.findByPk(params.id).exec()
          if (!userDetails) {
            throw new Error('Error')
          }
          return userDetails
        }
      }
    }
  }
});

var mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addUser: {
        type: usersType,
        args: {
          displayName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          company: {
            type: new GraphQLNonNull(GraphQLString)
          },
          location: {
            type: new GraphQLNonNull(GraphQLString)
          },
          pets: {
            type: new GraphQLNonNull(GraphQLList)
          }
        },
        resolve: function (root, params) {
          const userModel = new UsersModel(params);
          const newUser = userModel.save();
          if (!newUser) {
            throw new Error('Error');
          }
          return newUser
        }
      },
      updateUser: {
        type: usersType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLInt)
          },
          displayName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          company: {
            type: new GraphQLNonNull(GraphQLString)
          },
          location: {
            type: new GraphQLNonNull(GraphQLString)
          },
          pets: {
            type: new GraphQLNonNull(GraphQLList)
          }
        },
        resolve(root, params) {
          return UsersModel
          .findByPk(params.id)
          .then(user => {
            if (!user) {
              throw new Error('Not found');
            }
            return user
              .update({
                displayName: params.displayName || user.displayName,
                title: params.title || user.title,
                company: params.company || user.company,
                location: params.location || user.location,
                pets: params.pets || book.pets,
              })
              .then(() => { return user; })
              .catch((error) => { throw new Error(error); });
          })
          .catch((error) => { throw new Error(error); });
        }
      },
      removeUser: {
        type: usersType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(root, params) {
          return UsersModel
          .findByPk(params.id)
          .then(user => {
            if (!user) {
              throw new Error('Not found');
            }
            return user
              .destroy()
              .then(() => { return user; })
              .catch((error) => { throw new Error(error); });
          })
          .catch((error) => { throw new Error(error); });
        }
      }
    }
  }
});


module.exports = new GraphQLSchema({query: queryType, mutation: mutation});
