import request from '@/utils/request'

// 查询证件信息列表
export function listCertificate(query) {
  return request({
    url: '/system/certificate/list',
    method: 'get',
    params: query
  })
}

// 查询证件信息详细
export function getCertificate(id) {
  return request({
    url: '/system/certificate/' + id,
    method: 'get'
  })
}

// 新增证件信息
export function addCertificate(data) {
  return request({
    url: '/system/certificate',
    method: 'post',
    data: data
  })
}

// 修改证件信息
export function updateCertificate(data) {
  return request({
    url: '/system/certificate',
    method: 'put',
    data: data
  })
}

// 删除证件信息
export function delCertificate(id) {
  return request({
    url: '/system/certificate/' + id,
    method: 'delete'
  })
}
