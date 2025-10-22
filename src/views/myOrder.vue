<template>
  <Page title="我的订单">
    <div class="myOrder">
      <!-- 订单状态筛选 -->
      <!-- <div class="filter-tabs">
        <div v-for="tab in orderTabs" :key="tab.key" class="tab-item" :class="{ active: currentTab === tab.key }"
          @click="switchTab(tab.key)">
          {{ tab.name }}
        </div>
      </div> -->

      <!-- 订单列表 -->
      <div class="order-list" v-if="!loading">
        <div v-if="orderList.length > 0">
          <div v-for="order in orderList" :key="order.id" class="order-item" @click="viewOrderDetail(order)">
            <div class="order-header">
              <div class="order-number">订单号：{{ order.orderId }}</div>
              <!-- <div class="order-status" :class="getStatusClass(order.status)">
                {{ getOrderStatusText(order.status) }}
              </div> -->
            </div>

            <div class="order-content">
              <div class="product-info">
                <!-- <div class="product-image">
                  <img :src="order.productImage" alt="商品图片" />
                </div> -->
                <div class="product-details">
                  <div class="product-name">{{ order.name }}</div>
                  <!-- <div class="product-spec">{{ order.productSpec }}</div> -->
                </div>
              </div>

              <div class="order-summary">
                <!-- <div class="quantity">共{{ order.quantity }}件商品</div> -->
                <div class="amount">合计：¥{{ order.price }}</div>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-date">{{ order.ctime }}</div>
              <div class="order-actions">
                <!-- <button v-if="order.status === 'pending'" class="action-button primary" @click.stop="payOrder(order)">
                  立即支付
                </button>
                <button v-if="order.status === 'completed'" class="action-button" @click.stop="viewOrderDetail(order)">
                  查看详情
                </button>
                <button v-if="order.status === 'cancelled'" class="action-button" @click.stop="deleteOrder(order)">
                  删除订单
                </button> -->
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">📦</div>
          <div class="empty-text">暂无订单</div>
          <div class="empty-desc">您还没有相关的订单</div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading" v-else>
        <div class="spinner"></div>
        <div>加载中...</div>
      </div>

      <!-- 订单详情弹窗 -->
      <div class="dialog-overlay" v-if="showDetail" @click="showDetail = false">
        <div class="dialog-content" @click.stop>
          <div class="dialog-header">
            <h2>订单详情</h2>
            <button class="close-btn" @click="showDetail = false">×</button>
          </div>
          <div class="dialog-body" v-if="selectedOrder">
            <div class="detail-section">
              <h3>订单信息</h3>
              <div class="detail-row">
                <span>订单号：</span>
                <span>{{ selectedOrder.orderId }}</span>
              </div>
              <div class="detail-row">
                <span>下单时间：</span>
                <span>{{ selectedOrder.ctime }}</span>
              </div>
              <div class="detail-row">
                <span>订单状态：</span>
                <span :class="getStatusClass(selectedOrder.order_status)">
                  {{ getOrderStatusText(selectedOrder.order_status) }}
                </span>
              </div>
            </div>

            <div class="detail-section">
              <h3>商品信息</h3>
              <div class="product-detail">
                <!-- <div class="product-image">
                  <img :src="selectedOrder.productImage" alt="商品图片" />
                </div> -->
                <div class="product-info">
                  <div class="product-name">{{ selectedOrder.name }}</div>
                  <!-- <div class="product-spec">{{ selectedOrder.productSpec }}</div> -->
                  <div class="product-price">¥{{ selectedOrder.price }}</div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>支付信息</h3>
              <div class="detail-row">
                <span>商品总价：</span>
                <span>¥{{ selectedOrder.price }}</span>
              </div>
              <!-- <div class="detail-row">
                <span>运费：</span>
                <span>¥0.00</span>
              </div>
              <div class="detail-row total">
                <span>实付款：</span>
                <span class="amount">¥{{ selectedOrder.price }}</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Page from '@/components/Page.vue'
import request from '@/plugin/request'
import Loading from '@/plugin/loading'

// 订单状态类型
interface OrderItem {
  id: number
  orderId: string
  outOrderID: string
  address: string;
  ctime: string;
  name: string;
  price: number;
}

// 响应式数据
const orderList = ref<OrderItem[]>([])
const loading = ref<boolean>(true)
const showDetail = ref<boolean>(false)
type stateType = 'order_unpaid' | 'order_making' | 'order_shipped' | 'order_completed' | 'order_refund' | 'order_partial_refund';
const selectedOrder = ref<OrderItem & {
  order_status: stateType
  description: string;
  out_order_no: string;
} | null>(null)
const currentTab = ref<string>('all')

// 订单筛选标签
// const orderTabs = [
//   { key: 'all', name: '全部订单' },
//   { key: 'pending', name: '待支付' },
//   { key: 'paid', name: '已支付' },
//   { key: 'shipped', name: '已发货' },
//   { key: 'completed', name: '已完成' },
//   { key: 'cancelled', name: '已取消' }
// ]

// 切换订单筛选标签
const switchTab = (tab: string) => {
  currentTab.value = tab
  loadOrders()
}

// 获取订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    const res = await request.get('/studying/print/myOrderList')
    // 模拟订单数据，实际应从API获取
    const mockOrders: OrderItem[] = res as any;

    orderList.value = mockOrders

    // // 根据当前筛选标签过滤订单
    // if (currentTab.value === 'all') {
    //   orderList.value = mockOrders
    // } else {
    //   orderList.value = mockOrders.filter(order => order.status === currentTab.value)
    // }
  } catch (error) {
    console.error('获取订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取订单状态文本
const getOrderStatusText = (status: stateType) => {
  const statusMap: Record<stateType, string> = {
    order_unpaid: '待支付',
    order_making: '订单制作中',
    order_shipped: '已发货',
    order_completed: '订单确认收货(已完成)',
    order_refund: '订单已退款',
    order_partial_refund: '订单部分退款',
  }
  return statusMap[status] || '未知状态'
}

// 获取订单状态样式类
const getStatusClass = (status: string) => {
  return `status-${status}`
}

// 查看订单详情
const viewOrderDetail = async (order: OrderItem) => {
  const loading = Loading();
  const res: any = await request.get('/studying/print/orderInfo/' + order.id)
  console.log('222222', res)
  if (res.code === 200) {
    loading.destory()
    showDetail.value = true;
    selectedOrder.value = {
      ...order,
      ...res.data
    };
  }
}

// 支付订单
const payOrder = (order: OrderItem) => {
  console.log('支付订单:', order)
  // 这里应该调用支付接口
  alert(`正在支付订单 ${order.outOrderID}`)
}

// 删除订单
const deleteOrder = (order: OrderItem) => {
  console.log('删除订单:', order)
  // 这里应该调用删除订单接口
  if (confirm(`确定要删除订单 ${order.outOrderID} 吗？`)) {
    orderList.value = orderList.value.filter(item => item.id !== order.id)
  }
}

// 组件挂载时加载订单数据
onMounted(() => {
  loadOrders()
})
</script>

<style lang="less" scoped>
.myOrder {
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  // .filter-tabs {
  //   display: flex;
  //   background: #fff;
  //   border-radius: 16px;
  //   padding: 20px;
  //   margin-bottom: 40px;
  //   box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  //   .tab-item {
  //     flex: 1;
  //     text-align: center;
  //     padding: 20px;
  //     border-radius: 12px;
  //     cursor: pointer;
  //     font-size: 24px;
  //     color: #666;

  //     &.active {
  //       background: #00795c;
  //       color: #fff;
  //       font-weight: bold;
  //     }
  //   }
  // }

  .order-list {
    flex: 1;
    overflow-y: auto;
    padding: 40px;

    .order-item {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      cursor: pointer;

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 24px;
        border-bottom: 1px solid #eee;
        margin-bottom: 24px;

        .order-number {
          font-size: 24px;
          color: #666;
        }

        .order-status {
          font-size: 24px;
          font-weight: bold;

          &.status-pending {
            color: #ff6b35;
          }

          &.status-paid {
            color: #00795c;
          }

          &.status-shipped {
            color: #00795c;
          }

          &.status-completed {
            color: #00795c;
          }

          &.status-cancelled {
            color: #999;
          }
        }
      }

      .order-content {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;

        .product-info {
          display: flex;
          flex: 1;

          .product-image {
            width: 160px;
            height: 160px;
            border-radius: 8px;
            overflow: hidden;
            margin-right: 24px;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .product-details {
            flex: 1;

            .product-name {
              font-size: 32px;
              font-weight: bold;
              color: #333;
              margin-bottom: 8px;
            }

            .product-spec {
              font-size: 24px;
              color: #999;
            }
          }
        }

        .order-summary {
          text-align: right;

          .quantity {
            font-size: 24px;
            color: #666;
            margin-bottom: 8px;
          }

          .amount {
            font-size: 32px;
            font-weight: bold;
            color: #333;
          }
        }
      }

      .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .order-date {
          font-size: 24px;
          color: #999;
        }

        .order-actions {
          display: flex;
          gap: 24px;

          .action-button {
            padding: 12px 24px;
            border-radius: 8px;
            border: 1px solid #ddd;
            background: #fff;
            font-size: 24px;
            cursor: pointer;

            &.primary {
              background: #00795c;
              color: #fff;
              border-color: #00795c;
            }

            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 120px 40px;

      .empty-icon {
        font-size: 120px;
        margin-bottom: 40px;
      }

      .empty-text {
        font-size: 36px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }

      .empty-desc {
        font-size: 24px;
        color: #999;
      }
    }
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120px 40px;

    .spinner {
      width: 80px;
      height: 80px;
      border: 8px solid #f3f3f3;
      border-top: 8px solid #00795c;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 32px;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .dialog-content {
      background: #fff;
      border-radius: 16px;
      width: 90%;
      max-height: 85vh;
      overflow-y: auto;

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 32px;
        border-bottom: 1px solid #eee;

        h2 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 48px;
          cursor: pointer;
          color: #999;

          &:hover {
            color: #333;
          }
        }
      }

      .dialog-body {
        padding: 24px;

        .detail-section {
          margin-bottom: 24px;

          h3 {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 24px;
            color: #333;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            font-size: 28px;

            &.total {
              border-top: 1px solid #eee;
              margin-top: 24px;
              padding-top: 24px;

              .amount {
                font-weight: bold;
                font-size: 32px;
                color: #ff6b35;
              }
            }
          }

          .product-detail {
            display: flex;
            padding: 24px;
            background: #f9f9f9;
            border-radius: 12px;

            .product-image {
              width: 160px;
              height: 160px;
              border-radius: 4px;
              overflow: hidden;
              margin-right: 24px;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }

            .product-info {
              flex: 1;

              .product-name {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin-bottom: 8px;
              }

              .product-spec {
                font-size: 28px;
                color: #999;
                margin-bottom: 16px;
              }

              .product-price {
                font-size: 32px;
                font-weight: bold;
                color: #ff6b35;
              }
            }
          }
        }
      }
    }
  }
}
</style>
