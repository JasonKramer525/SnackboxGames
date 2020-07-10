import Vue from 'vue'
import { firebaseAuth, firebaseDb } from 'boot/firebase'

const state = {
	userDetails: {},
	users: {},
	gameDetails: {}
}
const mutations = {
	setUserDetails(state, payload) {
		state.userDetails = payload
	},
	setGameDetails(state, payload) {
		state.gameDetails = payload
	},
	addUser(state,payload){
		Vue.set(state.users, payload.userId, payload.userDetails)
	},
	updateUser(state,payload){
		Object.assign(state.users[payload.userId], payload.userDetails)
	},
	updateGame(state,payload){
		state.gameDetails = payload
	},
	removeUser(state,payload){
		Vue.delete(state.users, payload.userId, payload.userDetails)
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
							gameHost = false;
						}

				    

			firebaseDb.ref('users/' + userId).set({
				name: payload.username,
				code: payload.code,
				host: gameHost,
				game: "none"
			})
			if(gameHost){
				firebaseDb.ref('games/' + payload.code).set({
					host: payload.username,
					gameState: "lobby"
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

				firebaseDb.ref('users').on('value', snapshot => { 
				    if(snapshot.hasChild(userId)){

						firebaseDb.ref('users/' + userId).once('value', snapshot => { 
					    	let userDetails = snapshot.val()
					    	let currentCode = userDetails.code
					    	console.log("DETAILS: ", userDetails)
					    	commit('setUserDetails', {
					    		name: userDetails.name,
					    		code: userDetails.code,
					    		userId: userId,
					    		host: userDetails.host
					    	})

						    firebaseDb.ref('games/' + currentCode).once('value', snapshot => { 
						    	let gameDetails = snapshot.val()
						    	commit('setGameDetails', {
						    		game: gameDetails
						    	})
						    })

						    firebaseDb.ref('games').on('child_changed', snapshot => {
								console.log("GAME SET: ", state.gameDetails)
						    	let gameDetails = snapshot.val()
						    	console.log(gameDetails)
						    	commit('updateGame', {
						    		game: gameDetails
						    	})
						    	console.log("GAME UPDATED: ", state.gameDetails)
						    })

					    })

					}

					else {
						firebaseDb.ref('users/' + userId).once('child_added', snapshot => { 
					    	let userDetails = snapshot.val()
					    	let currentCode = userDetails.code
					    	commit('setUserDetails', {
					    		name: userDetails.name,
					    		code: userDetails.code,
					    		userId: userId,
					    		host: userDetails.host
					    	})

					    	firebaseDb.ref('games/' + currentCode).once('value', snapshot => { 
						    	let gameDetails = snapshot.val()
						    	commit('setGameDetails', {
						    		game: gameDetails
						    	})
						    })

						    firebaseDb.ref('games').on('child_changed', snapshot => {
						    	let gameDetails = snapshot.val()
						    	commit('updateGame', {
						    		game: gameDetails
						    	})
						    	console.log("GAME UPDATED: ", state.gameDetails)
						    })
					    
					    }) 
					}

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
		firebaseDb.ref('users').on('child_removed', snapshot => {
			let userDetails = snapshot.val()
			let userId = snapshot.key
			commit('removeUser', {
				userId,
				userDetails
			})
		})		
	},
	logoutUser({dispatch}){
		var user = firebaseAuth.currentUser;

		let userId = firebaseAuth.currentUser.uid;
		let code = state.userDetails.code;
		let host = state.userDetails.host
		let hostChanged = false;
		firebaseDb.ref('users/' + userId).remove();
		if(host){
			Object.keys(state.users).forEach(key => {
				if(state.users[key].code == code && hostChanged == false){
					hostChanged = true;
					dispatch('firebaseUpdateHost', {
						userId: key,
						updates: {
							host: true
						}
					})
				}
			})

			if(hostChanged == false){
				firebaseDb.ref('games/' + code).remove();
			}
		}
		
		user.delete().then(function() {
		  console.log("User Deleted")
		}).catch(function(error) {
		  console.log("user not deleted")
		});

		//firebaseAuth.signOut()
	},
	firebaseUpdateHost({}, payload){
		firebaseDb.ref('users/' + payload.userId).update(payload.updates)
	},
	startGame({commit, dispatch}, payload){
		let gameId = state.userDetails.code


		if(payload == "Hot Potato"){
			

			
			let timer = 4;
			for(let i = 0; i<6; i++){


				let updates = {
					gameState: payload,
					timer: timer
				}

		    	firebaseDb.ref('games/' + gameId).update(updates)
		    	timer --


	   		}
		}
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
	gameDetails: state => {
		return state.gameDetails
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}