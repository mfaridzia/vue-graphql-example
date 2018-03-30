const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const Champion = require('./champion')

const port = process.env.PORT || 4000

const app = express()
app.use(cors())

// mendefinisikan sebuah skema
const schema = buildSchema(`
  type Query {
    language: String
    getChampions: [Champion]
    getChampionByName(name: String!): Champion
  }

  type Mutation {
    updateAttackDamage(name: String!, attackDamage: Float): Champion
  }

  type Champion {
    name: String
    attackDamage: Float
  }
`)

// mock data
const champions = [
  new Champion('Fulana', 100),
  new Champion('Melki', 200)
]

// membuat sebuah resolver 
const rootValue = {
  language: () => 'GraphQL Server Data',
  
  getChampions: () => champions,
  
  getChampionByName: ({ name }) => {
    return champions.find(x => x.name === name)
  },

  updateAttackDamage: ({ name, attackDamage = 150 }) => {
    const champion = champions.find(x => x.name === name)
    champion.attackDamage = attackDamage
    
    return champion
  }

}

// mount with expressjs
app.use('/graphql', graphqlHTTP({
  rootValue, schema, graphiql: true
}))

app.listen(port, () => {
  console.log('Listening on 4000')
})
