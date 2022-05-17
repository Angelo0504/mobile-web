import request from '@/utils/request'

// 查询房源详情列表
export function listHouseRoom(query) {
  return request({
    url: '/system/houseRoom/list',
    method: 'get',
    params: query
  })
}

// 查询房源详情详细
export function getHouseRoom(id) {
  return request({
    url: '/system/houseRoom/' + id,
    method: 'get'
  })
}

// 新增房源详情
export function addHouseRoom(data) {
  return request({
    url: '/system/houseRoom',
    method: 'post',
    data: data
  })
}

// 修改房源详情
export function updateHouseRoom(data) {
  return request({
    url: '/system/houseRoom',
    method: 'put',
    data: data
  })
}

// 删除房源详情
export function delHouseRoom(id) {
  return request({
    url: '/system/houseRoom/' + id,
    method: 'delete'
  })
}
