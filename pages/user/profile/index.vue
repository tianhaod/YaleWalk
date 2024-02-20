<template>
  <div>
  <v-row v-if="!requests" row wrap>
    <v-col cols="12" sm="6" class="offset-sm-3 mb-4">
      <v-card>
      
      <v-container class="d-flex align-start justify-end mx-2">
        <v-btn
          elevation="2"
          outlined
          plain
          raised
          rounded
          @click="viewRequests()"
        >REQUESTS</v-btn>
      </v-container>
      <v-container class="d-flex align-start justify-end">
      <v-btn  
            class="mx-3"
            elevation="2"
            fab
            dark
            small
            color="gray"
            @click="edit()"
            >
            <v-icon v-if="!editing" dark>mdi-pencil</v-icon>
            <v-icon v-else dark>mdi-plus</v-icon>
        </v-btn>
      </v-container>

      <v-col class="text-center">
        <v-card-title primary-title class='headline justify-center align-center'>
          <span v-if="!editing">@{{uname}}</span>
          <v-text-field v-else
            dense
            rounded
            label="Enter display name"
            v-model="input_display_name"></v-text-field>                
        </v-card-title>
      </v-col>       

        <v-row class="mt-1 mb-4 justify-center align-center">
          <v-avatar size="120">
            <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              max-height="194"
              max-width="166"
              :src="image"
            ></v-img>
          </v-avatar>
        </v-row>

        <v-card-text>
          <v-text-field v-if="!editing"
            filled
            dense
            rounded
            label="Name"
            v-model="name"
            :disabled="!editing"
          />
          <v-text-field v-else
            filled
            dense
            rounded
            label="Enter name"
            v-model="input_name"
            :disabled="!editing"
          />

          <v-text-field v-if="!editing"
            filled dense rounded
            label="age"
            v-model="age"
            :disabled="!editing"
          />

          <v-text-field v-else
            filled dense rounded
            label="Enter age"
            v-model="input_age"
            :disabled="!editing"
          />

          <v-text-field v-if="!editing"
            filled
            dense
            rounded
            label="Location"
            v-model="location"
            :disabled="!editing"
          />

          <v-text-field v-else
            filled
            dense
            rounded
            label="Enter location"
            v-model="input_location"
            :disabled="!editing"
          />
          
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>


  <!-- REQUESTS -->
  <v-row v-else row wrap>
    <v-col cols="12" sm="6" class="offset-sm-3 mb-4">
      
      <v-card>
        <v-container class="d-flex align-start justify-end">
          <v-btn name="request_button"
              class="mx-2"
              fab
              dark
              small
              color="primary"
              @click="viewRequests()"
            >
              <v-icon dark>
                mdi-minus
              </v-icon>
          </v-btn>
        </v-container>

        <v-container class="d-flex align-start justify-center mb-10">
          <span class="mx-4">FRIEND REQUESTS</span>
        </v-container>


        <!-- @PAUL this is the current barebones UI setup for incoming requests -->
        <ul id="test-requests">
            <li v-for="request in incomingFriendRequests()" :key="request">              
                {{ getUsernames()[incomingFriendRequests().indexOf(request)] }}            
              
                <v-btn
                  class="ma-2"
                  color="primary"
                  dark
                  @click="handleClick(request, true)"
                  >
                  Accept
                  <v-icon
                    dark
                    right>
                    mdi-checkbox-marked-circle
                  </v-icon>
                </v-btn>

                <v-btn
                  class="ma-2"
                  color="red"
                  dark
                  @click="handleClick(request, false)"
                >
                  Decline
                  <v-icon
                    dark
                    right
                  >
                    mdi-cancel
                  </v-icon>
                </v-btn>
            </li>
          </ul>
      </v-card>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')

export default {
  name: 'ProfilePage',
  components: {},
  data: () => ({
    editing: false,
    input_display_name: '', 
    input_name: '', 
    input_age: '',
    input_location: '', 
    requests: false, 
    incomingFriendUsernames: []
  }), 
  computed: {
    ...fb.mapState(['authUser', 'user', 'profile']),
    uname() {
      return this.profile ? this.profile.displayName : ''
    },
    email() {
      return this.profile ? this.profile.email : ''
    },
    image() {
      return this.profile ? this.profile.image : ''
    },
    name() {
      return this.profile ? this.profile.Name : ''
    },
    age() {
      return this.profile ? this.profile.age : ''
    },
    location() {
      return this.profile ? this.profile.location : ''
    },
  },
  methods: {
    ...fb.mapActions([
      'userAcceptFriendRequest',
      'userDenyFriendRequest',
    ]),

    reloadPage() {
      window.location.reload();
    },

    getUsernames() {
      return this.incomingFriendUsernames
    },

    getDisplayName() {
      if (this.input_display_name != '') {
        return this.input_display_name 
      }
      else {
        return this.profile ? this.profile.displayName : ''
      }
    },

    getName() {
      if (this.input_name != '') {
        return this.input_name 
      }
      else {
        return this.profile ? this.profile.Name : ''
      }
    },

    getAge() {
      if (this.input_age != '') {
        return this.input_age
      }
      else {
        return this.profile ? this.profile.age : ''
      }
    },

    getLocation() {
      if (this.input_location != '') {
        return this.input_location
      }
      else {
        return this.profile ? this.profile.location : ''
      }
    },


    edit(event) {
      this.editing = !this.editing

      //update the profile
      this.updateProfile()
      if (!this.editing){
        this.reloadPage()
      }
      
    },


    async updateProfile() {
      let that = this
      try {
        //check if theres an auth user, if its authenticated, go authUser.uid
      console.log(this.getName(), that.getName())
        
        await this.$fire.firestore.collection('profiles').doc(that.authUser.uid).update({
          displayName: that.getDisplayName(),
          Name: that.getName(), 
          age: that.getAge(),
          location: that.getLocation()
        })
      
        return
      }
      catch(e){
        console.error(e)
      }
    }, 

    async fetchUserProfile() {
      try {
        let ref = this.$fire.firestore.collection('profiles')
        let query = ref.where('slug', '==', this.slug).limit(1)
        let snapshot = await query.get()
        if (snapshot.empty) {
          return this.$router('/')
        }
        let profile = snapshot.docs[0].data()

        Vue.set(this, 'other', profile)
        console.log(profile)
        return profile
      } catch (e) {}
    },

    async updateData(display_name) {
      var batch = db.batch()
      var querySnapshot = await db
        .collection('profiles')
        .where('Name', '==', display_name)
        .get()
      querySnapshot.forEach(function (doc) {
        batch.update(doc.ref, { status: 'complete' })
      })
      batch.commit()
    },

    async handleClick(otherId, accept) {
      console.log(otherId)

      try {
        let ref = this.$fire.firestore.collection('profiles').doc(otherId)
        let doc = await ref.get()
        let other = doc.data()

        if (other === null || other === undefined) return null
        //accept or deny
        if (accept) {
        await this.userAcceptFriendRequest({ user: this.profile, other })
      } else {
        await this.userDenyFriendRequest({ user: this.profile, other })
      }
    } catch (e) {
      console.error(e)
    }
    },

    incomingFriendRequests() {
      return this.profile?.incomingFriendRequests
    },

    async uidToUsername(uid) {
      try {
        let ref = this.$fire.firestore.collection('profiles').doc(uid)
        let doc = await ref.get()
        let other = doc.data()
        if (other === null || other === undefined) return null
        return other.displayName

      } catch (e) {
        console.error(e)
      }
  }, 
    async viewRequests() {
      this.requests = !this.requests
      this.incomingFriendUsernames = []
      try {
        let requests = this.incomingFriendRequests()
        
        let username = await this.uidToUsername(requests[0])

        for (let i=0; i<requests.length; i++){
          let username = await this.uidToUsername(requests[i])
          this.incomingFriendUsernames.push(username)
        }
        console.log(this.incomingFriendUsernames)

      } catch(e) {
        console.error(e)
      }

    }
  },
}
</script>

<style></style>
