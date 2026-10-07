<template>
  <Page title="商店" root foot-active="shop" hide-header>
    <div class="shopList">
      <div v-for="item in allMiniBookList" :key="item.id" class="card" @click="toDetail(item.id)">
        <!-- 左侧封面 -->
        <div class="cover">
          <img :src="item.img" @click.stop="showImgUrl = item.img" />
          <div class="coverMask">
            <div class="maskTag">松鼠学精选</div>
            <div class="maskTitle">{{ extractSubject(item.title) }}</div>
            <div class="maskSub">知识精编</div>
          </div>
        </div>

        <!-- 右侧信息 -->
        <div class="info">
          <!-- <div class="infoTop">
            <span class="pill" :style="{ backgroundColor: getTagColor(item.id).bg, color: getTagColor(item.id).fg }">
              {{ getTagText(item.id) }}
            </span>
          </div> -->
          <div class="infoTitle">{{ cleanTitle(item.title) }}</div>
          <div class="infoSub">缩印版 · {{ item.pageCount }}页</div>
          <div class="infoDesc">缩印版，给书包减重，可单手持握</div>
          <div class="infoBottom">
            <div class="price">
              <template v-if="item.price">
                <span class="small">¥</span>
                <span>{{ (item.price / 100).toFixed(2) }}</span>
                <span class="small" style="margin-left: 4px;">起</span>
              </template>
              <template v-else>免费</template>
            </div>
            <div class="addBtn" @click.stop="toDetail(item.id)">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="allMiniBookList.length === 0" class="emptyState">
        加载中…
      </div>
    </div>
    <ImgPreview v-if="showImgUrl" :url="showImgUrl.replace('http://', 'https://')" @cancel="showImgUrl = ''" />
  </Page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/plugin/request'
import Page from '@/components/Page.vue';
import ImgPreview from '@/components/imgPreview.vue';

const router = useRouter();

type bookItem = {
  id: number;
  file: string;
  img: string;
  pageCount: number;
  title: string;
  price?: number | string;
}

const allMiniBookList = ref<bookItem[]>([])
const showImgUrl = ref<string>('')

// 标签配置（id 哈希取模，模拟不同标签风格）
const TAG_CONFIGS = [
  { text: '热门', bg: '#FDECEC', fg: '#D93025' },
  { text: 'VIP 9折', bg: '#F1EDFF', fg: '#6A4FD0' },
  { text: '新品', bg: '#E8F5E9', fg: '#2E7D32' },
  { text: '缩印版', bg: '#FFF8E1', fg: '#B8860B' },
  { text: '精选', bg: '#E3F2FD', fg: '#1976D2' },
]
function getTagConfig(id: number) {
  return TAG_CONFIGS[Math.abs(id) % TAG_CONFIGS.length]
}
function getTagText(id: number) { return getTagConfig(id).text }
function getTagColor(id: number) { return getTagConfig(id) }

// 清洗标题：去掉「【电子课本】」等后缀，更简洁
function cleanTitle(title: string): string {
  if (!title) return ''
  return title
    .replace(/【.*?】/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/电子课本|电子教材|电子书籍/g, '')
    .trim()
}

// 从标题中提取学科名（用于封面水印大字）
function extractSubject(title: string): string {
  if (!title) return '精选'
  const match = title.match(/(数学|英语|语文|物理|化学|生物|历史|地理|政治|思想政治|科学)/)
  if (match) return match[1]
  return '精选'
}

onMounted(() => {
  request.get('/file/allMiniBook').then((res: any) => {
    allMiniBookList.value = res;
  })
})
function toDetail(id: number) {
  router.push('/shopGood/' + id)
}
</script>
<style lang="less" scoped>
.shopList {
  padding: 40px;
  padding-top: max(40px, env(safe-area-inset-top));

  .card {
    background-color: #fff;
    padding: 30px;
    border-radius: 24px;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    /* 左侧封面 */
    .cover {
      width: 184px;
      height: 256px;
      flex-shrink: 0;
      border-radius: 12px 20px 20px 12px;
      position: relative;
      overflow: hidden;
      background-color: #f0f0f0;

      >img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* 封面水印遮罩 */
      .coverMask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(160deg,
            rgba(0, 0, 0, 0.25) 0%,
            rgba(0, 0, 0, 0.05) 40%,
            rgba(0, 0, 0, 0.35) 100%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px;
        color: #fff;
        pointer-events: none;

        .maskTag {
          font-size: 20px;
          opacity: 0.85;
          letter-spacing: 1px;
        }

        .maskTitle {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 4px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .maskSub {
          font-size: 20px;
          opacity: 0.8;
        }
      }
    }

    /* 右侧信息 */
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      margin-left: 28px;

      .infoTop {
        margin-bottom: 8px;
        display: flex;
      }

      .pill {
        display: inline-block;
        padding: 4px 16px;
        font-size: 22px;
        line-height: 30px;
        border-radius: 20px;
        font-weight: 500;
      }

      .infoTitle {
        font-size: 30px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .infoSub {
        font-size: 24px;
        color: #888;
        margin-bottom: 12px;
      }

      .infoDesc {
        font-size: 24px;
        color: #999;
        margin-bottom: auto;
      }

      .infoBottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;

        .price {
          font-size: 32px;
          font-weight: 700;
          color: #E65100;

          .small {
            font-size: 24px;
            margin-right: 8px;
          }
        }

        .addBtn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: #2E7D32;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);
          transition: transform 0.15s;

          &:active {
            transform: scale(0.9);
          }
        }
      }
    }
  }

  .emptyState {
    padding: 80px 0;
    text-align: center;
    font-size: 28px;
    color: #999;
  }
}
</style>
