import mutations from '@/store/firebase/mutations'

let { SET_PROFILE } = mutations

describe('mutations', () => {
    it('SET_PROFILE', () => {
        // mock state
        const state = { profile: null }
        // apply mutation
        SET_PROFILE(state, {
            profile: {
                displayName: 'test user'
            }
        })
        // assert result
        expect(state.profile.displayName).toMatch('test user')
    })
})