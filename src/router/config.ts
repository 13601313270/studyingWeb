// @ts-ignore
import { RouteRecordRaw } from 'vue-router'
import welcome from '../views/welcome.vue'
import source from '../views/source.vue'
import sourceDetail from '../views/sourceDetail.vue'
import lessonDetail from '../views/lessonDetail.vue'
import poiLessonDetail from '../views/poiLessonDetail.vue'
import lessonDetailNew from '../views/lessonDetailNew.vue';
import lessonDetailPPT from '../views/lessonPPT/index.vue';
import lessonQuestionList from '../views/lessonQuestionList.vue';
import poiQuestion from '../views/poiQuestion.vue';
import poiLessonQuestionList from '../views/poiLessonQuestionList.vue';
import lessonKnowledgeList from '../views/lessonKnowledgeList.vue';
import lessonKnowledgeDetail from '../views/lessonKnowledgeDetail.vue'
import mine from '../views/mine.vue';
import friend from "../views/friend.vue";
import userInformation from '../views/userInformation.vue'
import accountInfo from '../views/accountInfo.vue'
import aboutUs from '../views/aboutUs.vue'
import cache from '../views/cache.vue';
import agreement from '../views/agreement.vue'
import QQ from '../views/QQ.vue'
import lessonLog from '../views/lessonLog.vue'
import file from '../views/file.vue'
import word from '../views/word.vue'
import wordSearch from '../views/wordSearch.vue'
import listen from '../views/listen.vue'
import Develop from '@/views/develop.vue'
import Chat from '@/views/chat.vue'
import enGrammar from '@/views/enGrammar.vue'
import enGrammarItem from '@/views/enGrammarItem.vue'
import enRead from '@/views/enRead.vue'
import enReadDetail from '@/views/enReadDetail.vue'
import address from '@/views/address.vue'
import myOrder from '@/views/myOrder.vue'
import Shop from '@/views/shop.vue'
import ShopGood from '@/views/shopGood.vue'

type RouterItem = RouteRecordRaw & {
  meta?: {
    title?: string,
    hideBottom?: boolean,
  }
}
const routes: Array<RouterItem> = [
  {
    path: '/',
    name: 'welcome',
    component: welcome,
    meta: {
      hideBottom: true,
    }
  },
  {
    path: '/source',
    name: 'source',
    component: source,
  },
  {
    path: '/source/:id',
    name: 'sourceDetail',
    component: sourceDetail,
    meta: {
      title: '详情页'
    }
  },
  {
    path: '/lesson/:id',
    name: 'lessonDetail',
    component: lessonDetail,
  },
  {
    path: '/poiLesson/:id',
    name: 'poiLessonDetail',
    component: poiLessonDetail,
  },
  {
    path: '/lessonNew/:id',
    name: 'lessonDetailNew',
    component: lessonDetailNew,
  },
  {
    path: '/lessonPPT/:id',
    name: 'lessonDetailPPT',
    component: lessonDetailPPT,
  },
  {
    path: '/lesson/:id/questionList',
    name: 'lessonQuestionList',
    component: lessonQuestionList,
  },
  {
    path: '/poi/:id/question/:difficult/:page',
    name: 'poiQuestion',
    component: poiQuestion,
  },
  {
    path: '/poiLesson/:id/questionList',
    name: 'poiLessonQuestionList',
    component: poiLessonQuestionList,
  },
  {
    path: '/lesson/:id/knowledge',
    name: 'lessonKnowledgeList',
    component: lessonKnowledgeList,
  },
  {
    path: '/lesson/:lessonId/knowledge/:id',
    name: 'lessonKnowledgeDetail',
    component: lessonKnowledgeDetail,
  },
  {
    path: '/mine',
    name: 'mine',
    component: mine,
  },
  {
    path: '/friend',
    name: 'friend',
    component: friend,
  },
  {
    path: '/userInformation',
    name: 'userInformation',
    component: userInformation,
  },
  {
    path: '/accountInfo',
    name: 'accountInfo',
    component: accountInfo,
  },
  {
    path: '/aboutUs',
    name: 'aboutUs',
    component: aboutUs,
  },
  {
    path: '/cache',
    name: 'cache',
    component: cache,
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: agreement
  },
  {
    path: '/QQ',
    name: 'QQ',
    component: QQ,
  },
  {
    path: '/lessonLog/:id',
    name: 'lessonLog',
    component: lessonLog,
    meta: {
      hideBottom: true,
    }
  },
  {
    path: '/file',
    name: 'file',
    component: file,
  },
  {
    path: '/word',
    name: 'word',
    component: word,
  },
  {
    path: '/wordSearch',
    name: 'wordSearch',
    component: wordSearch,
  },
  {
    path: '/listen',
    name: 'listen',
    component: listen,
  },
  {
    path: '/develop',
    name: 'develop',
    component: Develop,
  },
  {
    path: '/chat/:id',
    name: 'chat',
    component: Chat,
    meta: {
      hideBottom: true,
    }
  },
  {
    path: '/enGrammar',
    name: 'enGrammar',
    component: enGrammar,
  },
  {
    path: '/enGrammarItem/:id',
    name: 'enGrammarItem',
    component: enGrammarItem,
  },
  {
    path: '/enRead',
    name: 'enRead',
    component: enRead,
  },
  {
    path: '/enReadDetail/:id',
    name: 'enReadDetail',
    component: enReadDetail,
  },
  {
    path: '/address',
    name: 'address',
    component: address,
  },
  {
    path: '/order',
    name: 'order',
    component: myOrder,
  },
  {
    path: '/shop',
    name: 'shop',
    component: Shop,
  },
  {
    path: '/shopGood/:id',
    name: 'shopGood',
    component: ShopGood,
    meta: {
      hideBottom: true,
    }
  }
]
export default routes;