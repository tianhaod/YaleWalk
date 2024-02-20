import slugify from 'slugify'
const SLUGIFY_PARAMS = { replacement: '-', lower: true, locale: 'en' }
import { mount, shallowMount } from '@vue/test-utils'
import profile from '@/pages/user/profile/_slug.vue'
import { testEnvironment } from '~/jest.config'
import { createLocalVue} from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
describe('Connect Component Unit test', () => {
    // it('connect test', () => {
    //     let wrapper = mount(Task, {
    //         propsData: {

    //         }
    //     });
    //     const handleConnectClick = jest.fn()

    //     wrapper.setMethods({
    //         handleConnectClick: handleConnectClick
    //     });
    //     console.log(wrapper)
    //     wrapper.find('v-btn.ma-2').trigger('click');
    //     expect(handleConnectClick).toHaveBeenCalled();

    // })
    const localVue = createLocalVue()
    let vuetify

    let actions
    let getters
    let state
    let store
    let slug

    beforeEach(() => {
        // wrapper = shallowMount(profile, {
        //     methods: {
        //         handleConnectClick: ()=> {}}
            
        // })
        slug = jest.fn(),
        vuetify = new Vuetify(),
        actions = {
        sampleAction: jest.fn(),
        };
        getters = {
        isAuthenticated: jest.fn(),
        };
        state = {
        sampleState: jest.fn(),
        };
        data: {
            slug:jest.fn();
            other:jest.fn();
          }
        store = new Vuex.Store({
        modules: {
            firebase: {
            namespaced: true,
            actions,
            getters,
            state,
            slug
            },

        },
        });
    })
    // it("renders", ()=> {
    //     expect(wrapper.exists()).toBe(true);
    // })
    it('renders', async() => {
    
        const wrapper = shallowMount(profile, {
          localVue,
          vuetify,
          propsData: { slug : slugify("abc", SLUGIFY_PARAMS)},
          store,
          slug : slugify("abc", SLUGIFY_PARAMS)
        })
        expect(wrapper.exists()).toBe(true);
      })

    it('is a Vue instance', async() => {
    
        const wrapper = shallowMount(profile, {
          localVue,
          vuetify,
          propsData: { slug : slugify("abc", SLUGIFY_PARAMS)},
          store,
          slug : slugify("abc", SLUGIFY_PARAMS)
        })
        expect(wrapper.vm).toBeTruthy()
      })
    
      it("Connect button fires handleConectClick Call upon being clicked", ()=> {
        const handleConnectClick = jest.fn();
        const handleSpy = jest.spyOn(profile.methods, 'handleConnectClick')
        const wrapper = mount(profile, {
            localVue,
            vuetify,
            propsData: { slug : slugify("abc", SLUGIFY_PARAMS)},
            store,
            slug : slugify("abc", SLUGIFY_PARAMS)
          })
        wrapper.setMethods({
            handleConnectClick : handleConnectClick
        })
        wrapper.find(".connect_button").trigger("click")
        expect(handleSpy).toHaveBeenCalled();
      })

})