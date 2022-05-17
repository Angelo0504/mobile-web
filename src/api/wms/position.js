import request from '@/utils/request'

// 查询仓位管理列表
export function listPosition(query) {
  return request({
    url: '/system/position/list',
    method: 'get',
    params: query
  })
}

// 查询仓位管理详细
export function getPosition(id) {
  return request({
    url: '/system/position/' + id,
    method: 'get'
  })
}

// 新增仓位管理
export function addPosition(data) {
  return request({
    url: '/system/position',
    method: 'post',
    data: data
  })
}

// 修改仓位管理
export function updatePosition(data) {
  return request({
    url: '/system/position',
    method: 'put',
    data: data
  })
}

// 删除仓位管理
export function delPosition(id) {
  return request({
    url: '/system/position/' + id,
    method: 'delete'
  })
}
