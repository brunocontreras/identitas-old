import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/PageHome').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/section/:level1/:level2?',
      name: 'section',
      component: require('@/components/PageSection').default,
      props: true
    },
    {
      path: '/presentation/:id',
      name: 'presentation',
      component: require('@/components/PagePresentation').default,
      props: true
    }
  ]
})
