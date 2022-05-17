import request from '@/utils/request'

// 查询材料入库列表
export function listMaterialLk(query) {
  return request({
    url: '/system/materialLk/list',
    method: 'get',
    params: query
  })
}

// 查询材料入库详细
export function getMaterialLk(id) {
  return request({
    url: '/system/materialLk/' + id,
    method: 'get'
  })
}

// 新增材料入库
export function addMaterialLk(data) {
  return request({
    url: '/system/materialLk',
    method: 'post',
    data: data
  })
}

// 修改材料入库
export function updateMaterialLk(data) {
  return request({
    url: '/system/materialLk',
    method: 'put',
    data: data
  })
}

// 删除材料入库
export function delMaterialLk(id) {
  return request({
    url: '/system/materialLk/' + id,
    method: 'delete'
  })
}
