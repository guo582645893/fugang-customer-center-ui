import request from '@/utils/request'

// 查询客户申请列表
export function listApply(query) {
  return request({
    url: '/system/apply/list',
    method: 'get',
    params: query
  })
}

// 查询客户申请详细
export function getApply(id) {
  return request({
    url: '/system/apply/' + id,
    method: 'get'
  })
}

// 新增客户申请
export function addApply(data) {
  return request({
    url: '/system/apply',
    method: 'post',
    data: data
  })
}

// 修改客户申请
export function updateApply(data) {
  return request({
    url: '/system/apply',
    method: 'put',
    data: data
  })
}

// 删除客户申请
export function delApply(id) {
  return request({
    url: '/system/apply/' + id,
    method: 'delete'
  })
}
