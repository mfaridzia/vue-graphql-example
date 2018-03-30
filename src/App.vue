<template>
  <div id="app">
	  <h3> Example 1 </h3>
	  <div>
		  Data: {{ example1 }}
	  </div>
	  <button @click="getLanguage"> Get Language </button>
	  <hr/>

		<h3> Example 2 </h3>
		<div>
			Data: 
			<div v-for="(champion, index) in champions" :key="index">
				{{ champion }}
			</div>
		</div>
		<button @click="getChampions"> Get Champions </button>
		<hr/>

		<h3> Example 3 </h3>
		Name: <input type="text" v-model="name">
		<div>
			Data: 
				{{ champion }}
		</div>
		<button @click="getChampionByName"> Get Champion </button>
		<hr/>

		<h3> Example 4 </h3>
		Name: <input type="text" v-model="name">
		Attack Damage: <input type="text" v-model.number="attack">
		<div>
			Data: 
				{{ updateChampion }}
		</div>
		<button @click="updateAttackDamage"> Update Champion </button>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
	  return {
			example1: '',
			champions: [],
			name: 'Fulana',
			champion: {},
			updateChampion: {},
			attack: 5.5
	  }
  },
  methods: {
	  async getLanguage() {
		  try {
			  // karena graphql default nya post maka kita kirim query di request axiosnya
			  const res = await axios.post(`http://localhost:4000/graphql`, {
				  query: '{ language }'
			  })
			  this.example1 = res.data.data.language
		  } catch(e) {
			  console.log('error', e)
		  }
		},
		// get data
		async getChampions() {
			const res = await axios.post(`http://localhost:4000/graphql`, {
					query: `{
						getChampions {
							name
						}
					}`
			})
			this.champions = res.data.data
		},
		// passing arguments
		async getChampionByName() {
			const res = await axios.post(`http://localhost:4000/graphql`, {
				query: `
					query GetChampionByName($championName: String!) {
						getChampionByName(name: $championName) {
							name
							attackDamage
						}
					}`,
					variables: {
						championName: this.name
					}
			})
			this.champion = res.data.data.getChampionByName
		},
		// update mutation
		async updateAttackDamage() {
			const res = await axios.post(`http://localhost:4000/graphql`, {
				query: `
					mutation UpdateAttackDamage(
						$championName: String!, $attackDamage: Float) {
							updateAttackDamage(name: $championName, attackDamage: $attackDamage) {
								name
								attackDamage
							}
						}`,
						variables: {
							championName: this.name,
							attackDamage: this.attack
						}			
			})
			this.updateChampion = res.data.data.updateAttackDamage
		}
  }
}
</script>
