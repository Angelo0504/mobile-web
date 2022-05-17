import request from "@/utils/request";

// 查询材料状态列表
export function listMaterialStatus(query) {
  return request({
    url: "/system/materialReport/mterialStatus",
    method: "get",
    params: query,
  });
}

// 查询材料预警列表
export function listMaterialWarn(query) {
  return request({
    url: "/system/materialReport/materialWarn",
    method: "get",
    params: query,
  });
}
