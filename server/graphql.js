const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList } = require('graphql');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        price: { type: GraphQLFloat },
        description: { type: GraphQLString },
    },
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                const data = fs.readFileSync(dataPath, 'utf8');
                return JSON.parse(data);
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});