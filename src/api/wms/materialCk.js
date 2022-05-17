import request from '@/utils/request'

// 查询材料出库列表
export function listMaterialCk(query) {
  return request({
    url: '/system/materialCk/list',
    method: 'get',
    params: query
  })
}

// 查询材料出库详细
export function getMaterialCk(id) {
  return request({
    url: '/system/materialCk/' + id,
    method: 'get'
  })
}

// 新增材料出库
export function addMaterialCk(data) {
  return request({
    url: '/system/materialCk',
    method: 'post',
    data: data
  })
}

// 修改材料出库
export function updateMaterialCk(data) {
  return request({
    url: '/system/materialCk',
    method: 'put',
    data: data
  })
}

// 删除材料出库
export function delMaterialCk(id) {
  return request({
    url: '/system/materialCk/' + id,
    method: 'delete'
  })
}
