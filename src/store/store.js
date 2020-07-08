import Vue from 'vue'
import { firebaseAuth, firebaseDb } from 'boot/firebase'

const state = {
	userDetails: {},
	users: {}
}
const mutations = {
	setUserDetails(state, payload) {
		state.userDetails = payload
	},
	addUser(state,payload){
		Vue.set(state.users, payload.userId, payload.userDetails)
	},
	updateUser(state,payload){
		Object.assign(state.users[payload.userId], payload.userDetails)
	},
}
const actions = {
	playGame({}, payload){
		console.log("Play")
		firebaseAuth.signInAnonymously()
		.then(response => {
			let userId = firebaseAuth.currentUser.uid;

			let gameHost = true;

			firebaseDb.ref('games/').once('value', snapshot => { 
				    	let games = snapshot.val()

				    	console.log(games[payload.code])

						if(games[payload.code]){
							console.log("ALREADY EXISTS")
							gameHost = false;
						}

				    

			firebaseDb.ref('users/' + userId).set({
				name: payload.username,
				code: payload.code,
				host: gameHost,
				game: "none"
			})
			firebaseDb.ref('games/' + payload.code + "/players/" + payload.username).set({
					score: 0,
					name: payload.username
				})
			if(gameHost){
				firebaseDb.ref('games/' + payload.code).set({
					host: payload.username
				})
			}
			else {
				//Add usernames to list of players
				
			}
			}) 
		})

		.catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;

		  if (errorCode === 'auth/operation-not-allowed') {
		    alert('You must enable Anonymous auth in the Firebase Console.');
		  } else {
		    console.error(error);
		  }
		});


	},
	handleAuthStateChanged({commit, dispatch, state}){
		firebaseAuth.onAuthStateChanged(user => {
			if (user) { 
				this.$router.push('/play').catch(err => {})

				let userId = firebaseAuth.currentUser.uid;
				console.log("USERID: ", userId)

				firebaseDb.ref('users/' + userId).once('value', snapshot => { 
				    	let userDetails = snapshot.val()
				    	console.log("DETAILS: ", userDetails)
				    	commit('setUserDetails', {
				    		name: userDetails.name,
				    		code: userDetails.code,
				    		userId: userId
				    	})
				    }) 

				dispatch('firebaseGetUsers')

			}
			else {
			 	this.$router.push('/').catch(err => {}) 
			}

			
		})



	},
	firebaseGetUsers({commit}){
		firebaseDb.ref('users').on('child_added', snapshot => {
			let userDetails = snapshot.val()
			let userId = snapshot.key
			commit('addUser', {
				userId,
				userDetails
			})
		})
		firebaseDb.ref('users').on('child_changed', snapshot => {
			let userDetails = snapshot.val()
			let userId = snapshot.key
			commit('updateUser', {
				userId,
				userDetails
			})
		})
	},
	logoutUser(){
		var user = firebaseAuth.currentUser;

		user.delete().then(function() {
		  console.log("User Deleted")
		}).catch(function(error) {
		  console.log("user not deleted")
		});

		//firebaseAuth.signOut()
	},
}
const getters = {
	users: state => {
		let gameUsers = {}
		Object.keys(state.users).forEach(key => {
			if(state.users[key].code == state.userDetails.code){
				gameUsers[key] = state.users[key]
			}
		})
		console.log(gameUsers)
		return gameUsers

	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}