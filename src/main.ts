import { ApolloServer, PubSub } from 'apollo-server';
import { resolvers } from './resolvers';
import { typedefs } from './typedefs';

const pubsub: PubSub = new PubSub();

const server = new ApolloServer({ typeDefs: typedefs, resolvers, context: { pubsub } });
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}graphql`);
});