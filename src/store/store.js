import Vue from 'vue'
import { firebaseAuth, firebaseDb } from 'boot/firebase'

const state = {
	userDetails: {},
	users: {},
	gameDetails: {},
	backgroundColor: {
		backgroundColor: "#D3D3D3"
	}
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
	updateColor(state,payload){
		state.backgroundColor = payload	
	}
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
				eliminated: "false"
			})
			if(gameHost){
				firebaseDb.ref('games/' + payload.code).set({
					host: payload.username,
					gameState: "lobby",
					backgroundColor: "#D3D3D3"
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
												console.log("NEW COLOR: ", state.backgroundColor)
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
						    	commit('updateColor', {
						    		backgroundColor: gameDetails.backgroundColor
						    	})
								console.log("NEW COLOR: ", state.backgroundColor)
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
						    	commit('updateColor', {
						    		backgroundColor: gameDetails.backgroundColor
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
		if(payload == "Hot Potato"){
			dispatch('hotPotato')
		}
	},
	hotPotato({commit, dispatch}){
		let gameId = state.userDetails.code

		let gameUsers = {}
		let userNum = 0
		Object.keys(state.users).forEach(key => {
			if(state.users[key].code == state.userDetails.code){
				if(state.users[key].eliminated == "false"){
					console.log(state.users[key].eliminated)
					gameUsers[userNum] = state.users[key].name
					userNum ++;
				}
			}
		})
		console.log(gameUsers)

		var playerCount = Object.keys(gameUsers).length;
		//console.log("USERS IN GAME: ", count)

		let timer = 6;
		var itr = Array(8).fill(0)
		var interval = 1000; //one second
		itr.forEach((itr, index) => {
		  setTimeout(() => {
		    let updates = {
				gameState: "Hot Potato",
				players: gameUsers,
				playerCount: playerCount,
				timer: timer,
				potato: "none"
			}

	    	firebaseDb.ref('games/' + gameId).update(updates)
	    	timer --
		  }, index * interval)
		})

		setTimeout(() => {
            let randomPlayer = Math.floor(Math.random() * playerCount); 
            console.log("UPDATED POTATO")
			let updates = {
				potato: gameUsers[randomPlayer] 
			}

	    	firebaseDb.ref('games/' + gameId).update(updates)
	    	dispatch('potatoGameStart')

        }, 7000)


        setTimeout(() => {
			/*let updates = {
				gameState: "lobby"
			}

	    	firebaseDb.ref('games/' + gameId).update(updates)*/
        }, 28000)
		
	},
	potatoGameStart(){
		var colors = ['#ffffff','#ffffff','#ffffff','#fff2f2','#ffe6e6','#ffe0e0','#ffd9d9','#ffcfcf',
		'#ffc7c7','#ffbfbf','#ffb8b8','#ffb0b0','#ffa8a8','#ffa3a3','#ff9c9c','#ff9494','#ff8585','#ff7a7a',
		'#ff7070','#ff6363','#ff5959','#ff5252','#ff4242','#ff3333','#ff2424','#ff0f0f','#ff0000',"#D3D3D3"]
		var itr = Array(20).fill(0)
		var counter = 0;
		var interval = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
		colors.forEach((color, index) => {
		  setTimeout(() => {
		  	console.log(color)
		   let updates = {
				backgroundColor: color
			}
			counter++;
	    	firebaseDb.ref('games/' + state.userDetails.code).update(updates)

	    	if(index == 27){
	    		let updates = {
					gameState: "potatoLoss"
				}

	    		firebaseDb.ref('games/' + state.userDetails.code).update(updates)
	    	}
		  }, index * interval)
		})
	},
	passPotato({commit}){
		console.log("REPEAT")
		let userChange = ""
		firebaseDb.ref('games/' + state.userDetails.code).on('value', snapshot => { 
			let gameData = snapshot.val()
			let gameUsers = gameData.players
			let users = []
			let currentUser = 0;
			let count = 0;
			Object.keys(gameUsers).forEach(key => {
				users.push(gameUsers[key])
				if(gameUsers[key] == state.userDetails.name){
					currentUser = count;
				}
				count ++;
			})
			console.log("ALL PLAYERS", users)

			if(currentUser == gameData.playerCount - 1){
				userChange = users[0]
			}
			else {
				userChange = users[currentUser + 1]
			}
		})

		let updates = {
			potato: userChange
		}
		console.log("PASS")

    	firebaseDb.ref('games/' + state.userDetails.code).update(updates)

		console.log("exit", state.gameDetails.game)
	}
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
	},
	backgroundColor: state => {
		return state.backgroundColor
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}