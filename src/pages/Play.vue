<template>
<div v-if="gameDetails.game.gameState == 'lobby'" class="row justify-center text-center q-mt-md">
    <div class="col-lg-5 col-xs-10">
		<div class="title-font" v-if="!userDetails.host" >Waiting for the host to start the game</div>
		<div class="title-font" v-if="userDetails.host">You are the host.</div>
		<div class="title-font">Room Code: <a style="color:#1976D2; font-size:40px"> {{userDetails.code}} </a> </div>
		<div class="title-font q-mt-md">Current Players:    </div>

		<div style="font-size: 20px" v-for="(user, key) in users">
		  {{ user.name }}<a v-if="user.host == true"> (Host) </a>
		</div>


		<q-btn-dropdown ref="gameLabel" v-if="userDetails.host" size="18px" class="q-py-xs q-mt-md" color="primary" :label="gameLabel">
	      <q-list>
	      	<q-item clickable v-close-popup @click="onItemClick('Codenames')">
	          <q-item-section>
	            <q-item-label>Codenames</q-item-label>
	          </q-item-section>
	        </q-item>

	      	<q-item clickable v-close-popup @click="onItemClick('Hot Potato')">
	          <q-item-section>
	            <q-item-label>Hot Potato</q-item-label>
	          </q-item-section>
	        </q-item>

	        <q-item clickable v-close-popup @click="onItemClick('Headlines')">
	          <q-item-section>
	            <q-item-label>Headlines</q-item-label>
	          </q-item-section>
	        </q-item>

	        <q-item clickable v-close-popup @click="onItemClick('Crack The Code')">
	          <q-item-section>
	            <q-item-label>Crack The Code</q-item-label>
	          </q-item-section>
	        </q-item>

	        <q-item clickable v-close-popup @click="onItemClick('Bounce Back')">
	          <q-item-section>
	            <q-item-label>Bounce Back</q-item-label>
	          </q-item-section>
	        </q-item>
	      </q-list>
	    </q-btn-dropdown>

		<br>

		<q-btn v-if="userDetails.host"
		      size="19px"
		      class="q-px-xl q-py-xs q-mt-md"
		      color="primary"
		      label="Start"
		      @click="onStart()"
		    	/>
		          </div>
		</div>

	</div>
</div>

<!------- HOT POTATO ------->
<div v-else-if="gameDetails.game.gameState == 'Hot Potato'" class="row justify-center text-center q-mt-md">
    <div class="col-lg-5 col-xs-10">
    	<div class="title-font" style="font-size:50px;">Hot Potato</div>

    	<div class="title-font" style="font-size:30px;" v-if="gameDetails.game.potato == userDetails.name && gameDetails.game.potato != 'none'">YOU HAVE THE POTATO!</div>
    	<div class="title-font" style="font-size:30px;" v-if="gameDetails.game.potato != userDetails.name && gameDetails.game.potato != 'none'">{{gameDetails.game.potato}} HAS THE POTATO!</div>

    	<div class="title-font" style="font-size:15px;" v-if="gameDetails.game.potato == userDetails.name && gameDetails.game.potato != 'none'">(Tap it to throw)</div>

    	<q-img v-if="gameDetails.game.potato == userDetails.name && gameDetails.game.potato != 'none'"
    	      :src="url"
    	      style="height: 150px; max-width: 150px; transform:translateY(-15px)" @click="throwPotato()"
    	/><br>

    	<q-circular-progress v-if="gameDetails.game.timer >= 0"
    	      show-value
    	      class="text-white q-ma-md"
    	      :value="(4-gameDetails.game.timer) * 25"
    	      size="90px"
    	      :thickness="0.2"
    	      color="orange"
    	      center-color="grey-8"
    	      track-color="transparent"
    	    >
    	    	<div v-if="gameDetails.game.timer >= 4"></div>
    	    	<div v-else-if="gameDetails.game.timer >= -1 && gameDetails.game.timer <= 0">Go!</div>
    	    	<div v-else>{{gameDetails.game.timer}}</div>
    	    </q-circular-progress>

    	    <div class="title-font q-mt-md">Players Remaining:    </div>

    	    <div style="font-size: 20px" v-for="(user, key) in users" v-if="user.eliminated == 'false'">
    	      {{ user.name }} <q-img v-if="gameDetails.game.potato == user.name"
    	      :src="url"
    	      style="height: 50px; max-width: 50px; transform:translateY(-8px)"
    	/></div>  
		
		          


    </div>
</div>

<div v-else-if="gameDetails.game.gameState == 'potatoLoss'" class="row justify-center text-center q-mt-md">
    <div class="col-lg-5 col-xs-10">
    	<div class="title-font" style="font-size:50px; color:red">{{ gameDetails.game.potato }} LOST!</div>
    	<div class="title-font" style="font-size:50px;">PLAYERS REMAINING:</div>
    	<div class="title-font" style="font-size:30px;" v-for="(user, key) in users">
    	     <div v-if="user.eliminated == 'false'"> {{ user.name }} </div></div>
    	     <q-btn v-if="userDetails.host == true"
		      size="19px"
		      class="q-px-xl q-py-xs q-mt-md"
		      color="primary"
		      label="CONTINUE"
		      @click="onStart()"
		    	/>
 	</div>
</div>

<div v-else-if="gameDetails.game.gameState == 'potatoWin'" class="row justify-center text-center q-mt-md">
    <div class="col-lg-5 col-xs-10">
    	<div class="title-font" style="font-size:50px;">Hot Potato</div>
    	<div class="title-font" style="font-size:50px;" v-for="(user, key) in users">
    	     <div class="absolute-center" v-if="user.eliminated == 'false'"> {{ user.name }} WINS!</div><br><br></div>
    	     <q-btn v-if="userDetails.host == true"
		      size="19px"
		      class="q-px-xl q-py-xs q-mt-md q-mb-md absolute-bottom"
		      color="primary" style="margin-left: auto; margin-right: auto; display:block"
		      label="Main Menu"
		      @click="quitPotatoGame()"
		    	/>
	</div>
</div>

<!------- Codenames ------->
<div v-else-if="gameDetails.game.gameState == 'codenamesLobby'" class="row justify-center text-center q-mt-md">
    <div class="col-lg-5 col-xs-10">
    	<div class="title-font" style="font-size:50px;">Codenames</div>
		<div class="title-font" style="font-size:50px; color:#1976d2">Blue Team</div>
		<div class="title-font" style="font-size:40px;" v-for="(user, key) in users" v-if="user.team =='blue'">
						      <q-icon v-if="user.spymaster == 'true'" name="star"/> {{user.name}}
		</div>

		<div class="title-font" style="font-size:50px; color:#c10015">Red Team</div>
		<div class="title-font" style="font-size:40px;" v-for="(user, key) in users" v-if="user.team =='red'">
			      <q-icon v-if="user.spymaster == 'true'" name="star"/> {{user.name}}
		</div>
		
		<q-btn v-if="userDetails.host == true" class="q-px-md q-py-xs q-ma-sm" color="primary" label="Start" size="md"  @click="startCodenames()"/>
    	<q-btn v-if="userDetails.host == true" class="q-px-md q-py-xs q-ma-sm" color="primary" label="Shuffle" size="md"  @click="shuffleTeams()"/>



	</div>
</div>

<div v-else-if="gameDetails.game.gameState == 'codenames'" class="row justify-center text-center q-mt-md">
    <div class="col-lg-5 col-xs-12">
    	<div class="title-font" style="font-size:50px;">Codenames</div>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	    <q-btn class="q-ma-sm" outline color="primary" label="Dinosaur" size="md"/>
    	   
    	   

		<div class="title-font" style="font-size:50px; color:#1976d2">Blue Team</div>

		<div class="title-font" style="font-size:50px; color:#c10015">Red Team</div>

	</div>
</div>
</template>


<script>
import {mapState, mapGetters, mapActions} from 'vuex'

export default {
	computed: {
		...mapState('store', ['messages', 'userDetails']),
		...mapGetters('store', ['users', 'gameDetails'])
	},
	methods: {
		...mapActions('store',['startGame', 'passPotato', 'quitPotato']),
	    onItemClick (x) {
	    	this.gameLabel = x
	    },
	    onStart(){
	    	this.startGame(this.gameLabel)
	    },
	    countDownTimer() {
            if(this.countDown > 0) {
                setTimeout(() => {
                    this.countDown -= 1
                    this.countDownTimer()
                }, 1000)
            }
        },
        throwPotato() {
        	return this.passPotato()
        },
        quitPotatoGame() {
        	return this.quitPotato()
        },
        shuffleTeams() {
	    	this.startGame("Codenames")
        },
        startCodenames(){
        	console.log("START")
        }
	},
	data() {
        return {
            countDown: 30,
            gameLabel: "Select Game",
            url: 'https://vignette.wikia.nocookie.net/minecraft/images/c/c2/Potato.png/revision/latest?cb=20200213034838'
        }
    },
    watch: {
       	countDown: {
           handler(value) {

               if (value > 0) {
                   setTimeout(() => {
                       this.countDown--;
                   }, 1000);
               }
           },
           immediate: true // This ensures the watcher is triggered upon creation
       }	
	}
}

</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Sans:wght@900&display=swap');
  .title-font
    font-family: 'Fira Sans', sans-serif;
    color: #333
    font-weight: 900
    font-size: 25px
    padding-left: 14px
</style>