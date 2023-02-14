import request from '@/utils/request'

// 查询虚拟子客户企业客户列表
export function listInfo(query) {
  return request({
    url: '/system/customer/list',
    method: 'get',
    params: query
  })
}

// 查询虚拟子客户企业客户详细
export function getInfo(id) {
  return request({
    url: '/system/customer/' + id,
    method: 'get'
  })
}

// 新增虚拟子客户企业客户
export function addInfo(data) {
  return request({
    url: '/system/customer',
    method: 'post',
    data: data
  })
}

// 修改虚拟子客户企业客户
export function updateInfo(data) {
  return request({
    url: '/system/customer',
    method: 'put',
    data: data
  })
}

// 删除虚拟子客户企业客户
export function delInfo(id) {
  return request({
    url: '/system/customer/' + id,
    method: 'delete'
  })
}

// 获取通用枚举
export function commonEnums() {
  return request({
    url: '/common/getCommonEnums',
    method: 'get'
  })
}
