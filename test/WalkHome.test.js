import { createLocalVue, mount } from '@vue/test-utils'

import WalkHome from '@/components/WalkHome.vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

describe('WalkHome', () => {
  const localVue = createLocalVue()
  let vuetify

  let actions
  let getters
  let state
  let store
  

  beforeEach(() => {
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

    store = new Vuex.Store({
      modules: {
        firebase: {
          namespaced: true,
          actions,
          getters,
          state,
        },
      },
    });
  })
  
  it('is a Vue instance', () => {
    
    const wrapper = mount(WalkHome, {
      localVue,
      vuetify,
      propsData: {},
      store
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
