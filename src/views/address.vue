<template>
  <Page title="我的收件地址">
    <div class="address-container">
      <!-- 地址列表 -->
      <div class="address-list" v-if="addressList.length > 0">
        <div v-for="(address, index) in addressList" :key="index" class="address-item"
          :class="{ 'default-address': address.isDefault }">
          <div class="address-info" @click="editAddress(address, index)">
            <div class="address-header">
              <span class="name">{{ address.name }}</span>
              <span class="phone">{{ address.phone }}</span>
              <span v-if="address.isDefault" class="default-tag">默认</span>
            </div>
            <div class="address-detail">
              {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
            </div>
          </div>
          <div class="address-actions">
            <switch :value="address.isDefault" @input="setDefaultAddress(index)" class="default-switch" />
            <Button text="删除" error @click.stop="deleteAddress(address.id)" class="delete-btn" />
          </div>
        </div>
      </div>

      <!-- 空地址提示 -->
      <div class="empty-address" v-else>
        <div class="empty-icon">📦</div>
        <div class="empty-text">暂无收货地址</div>
      </div>

      <!-- 添加地址按钮 -->
      <div class="add-address-btn">
        <Button text="新增收货地址" primary @click="resetForm(), showAddressForm = true" />
      </div>
    </div>

    <!-- 地址表单弹窗 -->
    <Popup :show="showAddressForm" @close="closeForm">
      <div class="address-form">
        <div class="form-title">{{ editingIndex === -1 ? '新增地址' : '编辑地址' }}</div>

        <div class="form-item">
          <label>收货人</label>
          <Input v-model="currentAddress.name" placeholder="请输入收货人姓名" />
        </div>

        <div class="form-item">
          <label>手机号码</label>
          <Input v-model="currentAddress.phone" placeholder="请输入手机号码" type="tel" />
        </div>

        <div class="form-item">
          <label>所在地区</label>
          <div class="region-selector">
            <select v-model="currentAddress.province" @change="onProvinceChange">
              <option value="">请选择省份</option>
              <option v-for="province in provinces" :key="province.id" :value="province.id">
                {{ province.name }}
              </option>
            </select>
            <select v-model="currentAddress.city" @change="onCityChange" :disabled="!currentAddress.province">
              <option value="">请选择城市</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
            <select v-model="currentAddress.district" :disabled="!currentAddress.city">
              <option value="">请选择区县</option>
              <option v-for="district in districts" :key="district.id" :value="district.id">
                {{ district.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-item">
          <label>详细地址</label>
          <textarea v-model="currentAddress.detail" placeholder="请输入详细地址，如道路、门牌号、小区、楼栋号、单元室等"
            class="detail-input"></textarea>
        </div>

        <div class="form-item checkbox-item">
          <input type="checkbox" id="setDefault" v-model="currentAddress.isDefault" />
          <label for="setDefault">设为默认地址</label>
        </div>

        <div class="form-actions">
          <Button text="取消" @click="closeForm" class="cancel-btn" />
          <Button text="保存" primary @click="saveAddress" class="save-btn" />
        </div>
      </div>
    </Popup>
  </Page>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import Page from '@/components/Page.vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Popup from '@/components/Popup.vue'
import Switch from '@/components/switch.vue'
import request from '@/plugin/request'
import Toast from '@/plugin/toast'

// 地区数据结构
interface AreaItem {
  id: number
  name: string
  level: number
  parentId: number
  '66inID': string
  child?: AreaItem[]
}

// 地址数据结构
interface Address {
  name: string
  phone: string
  province: number
  city: number
  district: number
  detail: string
  isDefault: boolean
}

// 响应式数据
const addressList = ref<(Address & { id: number })[]>([])
const showAddressForm = ref(false)
const editingIndex = ref(-1)

// 当前编辑的地址
const currentAddress = reactive<Address>({
  name: '',
  phone: '',
  province: -1,
  city: -1,
  district: -1,
  detail: '',
  isDefault: false
})

// 省市区数据（从接口获取）
const provinces = ref<AreaItem[]>([])
const cities = ref<AreaItem[]>([])
const districts = ref<AreaItem[]>([])

// 选中的地区ID
const selectedProvinceId = ref<number>(0)
const selectedCityId = ref<number>(0)

onMounted(() => {
  initMyAddress();
})
// 省份改变时更新城市列表
const onProvinceChange = () => {
  // 找到选中的省份
  const selectedProvince = provinces.value.find(province => province.id === currentAddress.province)
  if (selectedProvince && selectedProvince.child) {
    cities.value = selectedProvince.child
    selectedProvinceId.value = selectedProvince.id
  } else {
    cities.value = []
  }
  currentAddress.city = -1
  currentAddress.district = -1
  districts.value = []
  selectedCityId.value = 0
}

// 城市改变时更新区县列表
const onCityChange = () => {
  // 找到选中的城市
  const selectedCity = cities.value.find(city => city.id === currentAddress.city)
  if (selectedCity && selectedCity.child) {
    districts.value = selectedCity.child
    selectedCityId.value = selectedCity.id
  } else {
    districts.value = []
  }
  currentAddress.district = -1
}

// 重置表单
const resetForm = () => {
  editingIndex.value = -1;
  Object.assign(currentAddress, {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  })
  cities.value = []
  districts.value = []
}

// 显示地址表单（编辑）
const editAddress = (address: Address, index: number) => {
  return;
  editingIndex.value = index
  Object.assign(currentAddress, { ...address })

  // 更新城市和区县列表
  onProvinceChange()
  onCityChange()

  showAddressForm.value = true
}

// 关闭表单
const closeForm = () => {
  showAddressForm.value = false
}

async function initMyAddress() {
  const result = await request.get('/studying/address/myAddress')
  console.log(result);
  if (result && Array.isArray(result)) {
    addressList.value = result as any;
  }
}

// 保存地址
const saveAddress = async () => {
  // 简单验证
  if (!currentAddress.name) {
    alert('请输入收货人姓名')
    return
  }
  if (!currentAddress.phone) {
    alert('请输入手机号码')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(currentAddress.phone)) {
    alert('请输入正确的手机号码')
    return
  }
  if (currentAddress.province === -1 || currentAddress.city === -1 || currentAddress.district === -1) {
    alert('请选择完整的省市区信息')
    return
  }
  if (!currentAddress.detail) {
    alert('请输入详细地址')
    return
  }

  // 如果设为默认地址，先取消其他默认地址
  if (currentAddress.isDefault) {
    addressList.value.forEach(addr => {
      addr.isDefault = false
    })
  }
  const result = await request.post('/studying/address/save', currentAddress)
  if (result) {
    setTimeout(() => {
      initMyAddress();
    }, 500)
    Toast({
      message: '保存成功',
      duration: 2000
    })
    closeForm()
  }
}

// 删除地址
const deleteAddress = async (id: number) => {
  if (confirm('确定要删除这个收货地址吗？')) {
    const result = await request.delete('/studying/address/delete/' + id)
    if (result) {
      Toast({
        message: '删除地址成功',
        duration: 2000
      })
      initMyAddress()
    }
  }
}

// 设置默认地址
const setDefaultAddress = (index: number) => {
  // 如果已经是默认地址，则取消默认
  if (addressList.value[index].isDefault) {
    addressList.value[index].isDefault = false
    return
  }

  // 取消其他默认地址
  addressList.value.forEach(addr => {
    addr.isDefault = false
  })

  // 设置当前为默认地址
  addressList.value[index].isDefault = true
}

// 获取地区数据
const getAreaList = async () => {
  try {
    const res = await request.get('/studying/print/getAreaList')
    if (res && Array.isArray(res)) {
      provinces.value = res
    }
  } catch (error) {
    console.error('获取地区数据失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  // 获取地区数据
  getAreaList()

  // 模拟从本地存储或服务器获取地址数据
  const savedAddresses = localStorage.getItem('userAddresses')
  if (savedAddresses) {
    addressList.value = JSON.parse(savedAddresses)
  }

  // 添加一个示例地址
  // if (addressList.value.length === 0) {
  //   addressList.value.push({
  //     name: '张三',
  //     phone: '13800138000',
  //     province: '北京市',
  //     city: '北京市',
  //     district: '朝阳区',
  //     detail: '某某街道某某小区1号楼101室',
  //     isDefault: true
  //   })
  // }
})

// 监听地址列表变化，保存到本地存储
// 注意：在实际项目中，这里应该调用后端API保存数据
// 这里使用localStorage模拟持久化存储
addressList.value = new Proxy(addressList.value, {
  set(target, property, value) {
    // @ts-ignore
    target[property] = value
    localStorage.setItem('userAddresses', JSON.stringify(target))
    return true
  }
})
</script>

<style scoped lang="less">
.address-container {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
}

.address-list {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.address-item {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &.default-address {
    border: 2px solid #00795c;
  }
}

.address-info {
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .name {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin-right: 20px;
  }

  .phone {
    font-size: 28px;
    color: #666;
    flex: 1;
  }

  .default-tag {
    background: #00795c;
    color: white;
    font-size: 24px;
    padding: 4px 10px;
    border-radius: 4px;
  }
}

.address-detail {
  font-size: 28px;
  color: #666;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;

  .default-switch {
    flex: 1;
  }

  .delete-btn {
    width: 120px;
  }
}

.empty-address {
  text-align: center;
  padding: 100px 0;
  background: white;
  border-radius: 10px;
  margin-bottom: 30px;

  .empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }

  .empty-text {
    font-size: 32px;
    color: #999;
  }
}

.add-address-btn {
  padding: 16px 20px;

  .button {
    width: 100%;
  }
}

.address-form {
  padding: 30px;
  max-height: 80vh;
  overflow-y: auto;
}

.form-title {
  font-size: 36px;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
}

.form-item {
  margin-bottom: 30px;

  label {
    display: block;
    font-size: 30px;
    margin-bottom: 15px;
    color: #333;
  }

  .inputBase {
    font-size: 28px;
  }

  textarea.detail-input {
    width: 100%;
    height: 120px;
    border-radius: 10px;
    border: 1px solid #5d5d5d;
    padding: 15px;
    font-size: 28px;
    box-sizing: border-box;
    resize: none;
  }

  .region-selector {
    display: flex;
    flex-direction: column;
    gap: 15px;

    select {
      height: 88px;
      border-radius: 10px;
      border: 1px solid #5d5d5d;
      padding: 0 15px;
      font-size: 28px;
      background: white;

      &:disabled {
        background: #f5f5f5;
        color: #999;
      }
    }
  }

  &.checkbox-item {
    display: flex;
    align-items: center;

    input[type="checkbox"] {
      width: 32px;
      height: 32px;
      margin-right: 15px;
    }

    label {
      margin-bottom: 0;
      font-size: 28px;
    }
  }
}

.form-actions {
  display: flex;
  gap: 20px;

  .button {
    flex: 1;
  }

  .cancel-btn {
    background: #f5f5f5;
    border-color: #ddd;
  }
}
</style>