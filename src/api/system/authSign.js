import request from '@/utils/request'

// 查询授权签字人信息列表
export function listAuthSign(query) {
  return request({
    url: '/system/authSign/list',
    method: 'get',
    params: query
  })
}

// 查询授权签字人信息详细
export function getAuthSign(id) {
  return request({
    url: '/system/authSign/' + id,
    method: 'get'
  })
}

// 新增授权签字人信息
export function addAuthSign(data) {
  return request({
    url: '/system/authSign',
    method: 'post',
    data: data
  })
}

// 修改授权签字人信息
export function updateAuthSign(data) {
  return request({
    url: '/system/authSign',
    method: 'put',
    data: data
  })
}

// 删除授权签字人信息
export function delAuthSign(id) {
  return request({
    url: '/system/authSign/' + id,
    method: 'delete'
  })
}
