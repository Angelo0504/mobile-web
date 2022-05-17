import request from "@/utils/request";

// 查询材料出库明细列表
export function listMaterialCkDetail(query) {
  return request({
    url: "/system/materialCkDetail/list",
    method: "get",
    params: query,
  });
}

// 查询材料出库明细详细
export function getMaterialCkDetail(id) {
  return request({
    url: "/system/materialCkDetail/" + id,
    method: "get",
  });
}

// 新增材料出库明细
export function addMaterialCkDetail(data) {
  return request({
    url: "/system/materialCkDetail",
    method: "post",
    data: data,
  });
}

// 修改材料出库明细
export function updateMaterialCkDetail(data) {
  return request({
    url: "/system/materialCkDetail",
    method: "put",
    data: data,
  });
}

// 删除材料出库明细
export function delMaterialCkDetail(id) {
  return request({
    url: "/system/materialCkDetail/" + id,
    method: "delete",
  });
}
