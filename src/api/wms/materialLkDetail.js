import request from "@/utils/request";

// 查询材料库存
export function materialKc(query) {
  return request({
    url: "/system/materialLkDetail/materialKc",
    method: "get",
    params: query,
  });
}

// 查询材料入库明细列表
export function listMaterialLkDetail(query) {
  return request({
    url: "/system/materialLkDetail/list",
    method: "get",
    params: query,
  });
}

// 查询材料入库明细详细
export function getMaterialLkDetail(id) {
  return request({
    url: "/system/materialLkDetail/" + id,
    method: "get",
  });
}

// 新增材料入库明细
export function addMaterialLkDetail(data) {
  return request({
    url: "/system/materialLkDetail",
    method: "post",
    data: data,
  });
}

// 修改材料入库明细
export function updateMaterialLkDetail(data) {
  return request({
    url: "/system/materialLkDetail",
    method: "put",
    data: data,
  });
}

// 删除材料入库明细
export function delMaterialLkDetail(id) {
  return request({
    url: "/system/materialLkDetail/" + id,
    method: "delete",
  });
}
