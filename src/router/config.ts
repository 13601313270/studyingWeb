import { RouteRecordRaw } from 'vue-router'
import welcome from '../views/welcome.vue'
import source from '../views/source.vue'
import sourceDetail from '../views/sourceDetail.vue'
import lessonDetail from '../views/lessonDetail.vue'
import poiLessonDetail from '../views/poiLessonDetail.vue'
import lessonDetailNew from '../views/lessonDetailNew.vue';
import lessonAllChildPoiVideo from '../views/lessonAllChildPoiVideo.vue';
import lessonQuestionList from '../views/lessonQuestionList.vue';
import poiQuestion from '../views/poiQuestion.vue';
import poiLessonQuestionList from '../views/poiLessonQuestionList.vue';
import lessonKnowledgeList from '../views/lessonKnowledgeList.vue';
import lessonKnowledgeDetail from '../views/lessonKnowledgeDetail.vue'
import mine from '../views/mine.vue';
import friend from "../views/friend.vue";
import InformationDetail from '../views/informationDetail.vue'
import zhidaoDetail from '../views/zhidaoDetail.vue'
import userInformation from '../views/userInformation.vue'
import accountInfo from '../views/accountInfo.vue'
import aboutUs from '../views/aboutUs.vue'
import cache from '../views/cache.vue';
import agreement from '../views/agreement.vue'
import QQ from '../views/QQ.vue'
import lessonLog from '../views/lessonLog.vue'
import addQuestion from '../views/addQuestion.vue'
import file from '../views/file.vue'
import word from '../views/word.vue'
import listen from '../views/listen.vue'
import Develop from '@/views/develop.vue'
import Chat from '@/views/chat.vue'
import enYF from '@/views/yf.vue'

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
    path: '/lessonAllChildPoiVideo/:id',
    name: 'lessonAllChildPoiVideo',
    component: lessonAllChildPoiVideo,
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
    path: '/addQuestion',
    name: 'addQuestion',
    component: addQuestion,
  },
  {
    path: '/informationDetail',
    name: 'informationDetail',
    component: InformationDetail,
  },
  {
    path: '/zhidaoDetail/:id',
    name: 'zhidaoDetail',
    component: zhidaoDetail
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
    path: '/enYF',
    name: 'enYF',
    component: enYF,
  }
]
export default routes;