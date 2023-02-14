import request from '@/utils/request'

// 查询收款路径信息列表
export function listPayeePath(query) {
  return request({
    url: '/system/payeePath/list',
    method: 'get',
    params: query
  })
}

// 查询收款路径信息详细
export function getPayeePath(id) {
  return request({
    url: '/system/payeePath/' + id,
    method: 'get'
  })
}

// 新增收款路径信息
export function addPayeePath(data) {
  return request({
    url: '/system/payeePath',
    method: 'post',
    data: data
  })
}

// 修改收款路径信息
export function updatePayeePath(data) {
  return request({
    url: '/system/payeePath',
    method: 'put',
    data: data
  })
}

// 删除收款路径信息
export function delPayeePath(id) {
  return request({
    url: '/system/payeePath/' + id,
    method: 'delete'
  })
}
