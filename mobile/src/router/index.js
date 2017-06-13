import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Live from '@/components/Live'
import Interaction from '@/components/lives/Interaction'
import Opinion from '@/components/lives/Opinion'
import Histroy from '@/components/lives/Histroy'
import Team from '@/components/lives/Team'
import Question from '@/components/lives/Question'
import Login from '@/components/login/Login'
import Register from '@/components/login/Register'
import RegisterNext from '@/components/login/RegisterNext'
import ChangeHd from '@/components/lives/ChangeHd'
import LiveHistroy from '@/components/LiveHistroy'

import axios from 'axios'
import VueAxios from 'vue-axios'
import app from '@/assets/js/app'

Vue.use(Router)
Vue.use(VueAxios,axios)
Vue.use(app)

//Vue.prototype.$http = axios
export default new Router({
  routes: [
      { path: '/',redirect:'/live/opinion'},
      { path: '/live',redirect:'/live/opinion', component: Live,
          children: [{path: 'interaction/:invite_code?',name: 'interaction', component: Interaction},
          {path: 'opinion/:invite_code?',name: 'opinion', component: Opinion},
          {path: 'histroy',name: 'histroy', component: Histroy},
          {path: 'question',name: 'question', component: Question},
          {path: 'team',name: 'team', component: Team}]
      },
      { path: '/login', component: Login},
      { path: '/register', component: Register},
      { path: '/changeHd', component: ChangeHd},
      { path: '/live/detail/:live_id-:item_id',name: 'live_detail', component: LiveHistroy}
  ]
})
