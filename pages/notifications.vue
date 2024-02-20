<template>
    <v-row>
        <v-col>
            <v-card>
                <v-card-title>
                    Alerts
                </v-card-title>
                <ListPerspective :alerts="alerts"/>
            </v-card>
        </v-col>
        
        <v-col>
            <v-card>
                <v-card-title>
                    Friend Requests
                </v-card-title>
                <ListPerspective :alerts="this.friends"

                />
            </v-card>
        </v-col>
        
    </v-row>
</template>

<script>
import ListPerspective from '~/components/ListPerspective.vue'
import { mapState, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')
export default {
    components: {
        ListPerspective
    },
    computed: {
        ...fb.mapState(['friends', 'alerts']),
    },
}
</script>
