<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb5">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:materialLk:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:materialLk:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:materialLk:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:materialLk:export']"
          >导出</el-button
        >
      </el-col>
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
        class="el-form-search"
      >
        <el-form-item
          label="单据编号"
          prop="orderCode"
          class="el-form-search-item"
        >
          <el-input
            v-model="queryParams.orderCode"
            placeholder="请输入单据编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="供应商"
          prop="supplier"
          class="el-form-search-item"
        >
          <el-select
            v-model="queryParams.supplier"
            placeholder="请选择供应商"
            clearable
            :style="{ width: '100%' }"
            size="small"
          >
            <el-option
              v-for="(item, index) in supplierList"
              :key="index"
              :label="item.supplier"
              :value="item.supplier"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-search-item">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      :height="tableHeight"
      v-loading="loading"
      :data="materialLkList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="#" type="index" width="50" align="center">
        <template scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="单据编号"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <router-link
            :to="'/wms/materialLkDetail-data/index/' + scope.row.id"
            class="link-type"
          >
            <span>{{ scope.row.orderCode }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="供应商" align="center" prop="supplier" />
      <el-table-column
        label="单据日期"
        align="center"
        prop="orderDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="principal" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:materialLk:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:materialLk:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改材料入库对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据编号" prop="orderCode">
              <el-input
                v-model="form.orderCode"
                placeholder="请输入单据编号"
              /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier">
              <el-select
                v-model="form.supplier"
                placeholder="请选择供应商"
                clearable
                :style="{ width: '100%' }"
                @change="changeSupplier"
              >
                <el-option
                  v-for="(item, index) in supplierList"
                  :key="index"
                  :label="item.supplier"
                  :value="{ value: item.supplier, label: item.supplier }"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据日期" prop="orderDate">
              <el-date-picker
                clearable
                size="small"
                v-model="form.orderDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择单据日期"
                style="width: 100%"
              >
              </el-date-picker> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="principal">
              <el-input v-model="form.principal" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-divider content-position="center">入库明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAddWmsMaterialLkDetail"
              >添加</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDeleteWmsMaterialLkDetail"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <el-table
          :data="wmsMaterialLkDetailList"
          @row-click="onRowClick"
          :row-class-name="rowWmsMaterialLkDetailIndex"
          @selection-change="handleWmsMaterialLkDetailSelectionChange"
          ref="wmsMaterialLkDetail"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="材料代号"
            prop="materialCode"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-autocomplete
                v-model="scope.row.materialCode"
                placeholder="请输入材料代号"
                :fetch-suggestions="querySearchAsync"
                @select="handleSelect"
                :clearable="true"
                prefix-icon="el-icon-search"
                :trigger-on-focus="false"
                style="width: 100%"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column
            label="材料名称"
            prop="materialName"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.materialName"
                placeholder="请选择材料代号"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column
            label="仓位名称"
            prop="positionName"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.positionName"
                placeholder="请选择仓位"
                clearable
                :style="{ width: '100%' }"
                @change="changePosition"
              >
                <el-option
                  v-for="(item, index) in positionList"
                  :key="index"
                  :label="item.positionName"
                  :value="{
                    value: item.positionName,
                    label: item.positionName,
                  }"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="炉批号"
            prop="batchNo"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.batchNo"
                placeholder="请输入炉批号"
              />
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="lkQty" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lkQty" placeholder="数量" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMaterialLk,
  getMaterialLk,
  delMaterialLk,
  addMaterialLk,
  updateMaterialLk,
} from "@/api/wms/materialLk";
import { listMaterial } from "@/api/wms/material";
import { listSupplier } from "@/api/wms/supplier";
import { listPosition } from "@/api/wms/position";
import { Notification, MessageBox, Message, Loading } from "element-ui";

export default {
  name: "MaterialLk",
  data() {
    return {
      restaurants: [],
      // 表格高度
      tableHeight: document.documentElement.clientHeight - 180,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsMaterialLkDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 材料入库表格数据
      materialLkList: [],
      // 材料入库明细表格数据
      wmsMaterialLkDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        orderByColumn: "create_time",
        isAsc: "desc",
        supplier: null,
        orderCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderCode: [
          { required: true, message: "单据编号不能为空", trigger: "blur" },
        ],
        supplier: [
          { required: true, message: "供应商不能为空", trigger: "blur" },
        ],
        principal: [
          { required: true, message: "负责人不能为空", trigger: "blur" },
        ],
      },
      detailCurrentRowIndex: 0,
      supplierList: null,
      positionList: null,
    };
  },
  created() {
    this.getList();
    this.getSupplierList();
    this.getPositionList();
  },
  methods: {
    /** 查询材料入库列表 */
    getList() {
      this.loading = true;
      listMaterialLk(this.queryParams).then((response) => {
        this.materialLkList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        supplier: null,
        orderDate: null,
        orderCode: null,
        principal: null,
        state: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.wmsMaterialLkDetailList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加入库材料";
      this.form.orderDate = new Date();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMaterialLk(id).then((response) => {
        this.form = response.data;
        this.wmsMaterialLkDetailList = response.data.wmsMaterialLkDetailList;
        this.open = true;
        this.title = "修改入库材料";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.wmsMaterialLkDetailList = this.wmsMaterialLkDetailList;
          let message;
          let detaialValid = true;
          this.wmsMaterialLkDetailList.filter((item) => {
            if (!item.materialName) {
              message = "请选择材料代号";
              return (detaialValid = false);
            }
            if (!item.positionName) {
              message = "请选择仓位";
              return (detaialValid = false);
            }
            if (!item.batchNo) {
              message = "请输入炉批号";
              return (detaialValid = false);
            }
            if (!item.lkQty) {
              message = "请输入数量";
              return (detaialValid = false);
            }
          });
          if (detaialValid) {
            if (this.form.id != null) {
              updateMaterialLk(this.form).then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addMaterialLk(this.form).then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          } else {
            return Message({
              message: message,
              type: "warning",
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除记录？")
        .then(function () {
          return delMaterialLk(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 材料入库明细添加按钮操作 */
    handleAddWmsMaterialLkDetail() {
      let obj = {};
      obj.materialType = "";
      obj.materialCode = "";
      obj.materialName = "";
      obj.materialSpec = "";
      obj.materialModel = "";
      obj.materialColor = "";
      obj.materialUnit = "";
      obj.positionName = "";
      obj.batchNo = "";
      obj.lkQty = "";
      obj.remark = "";
      this.wmsMaterialLkDetailList.push(obj);
    },
    /** 材料入库明细删除按钮操作 */
    handleDeleteWmsMaterialLkDetail() {
      if (this.checkedWmsMaterialLkDetail.length == 0) {
        this.$modal.msgError("请先选择要删除的材料入库明细数据");
      } else {
        const wmsMaterialLkDetailList = this.wmsMaterialLkDetailList;
        const checkedWmsMaterialLkDetail = this.checkedWmsMaterialLkDetail;
        this.wmsMaterialLkDetailList = wmsMaterialLkDetailList.filter(function (
          item
        ) {
          return checkedWmsMaterialLkDetail.indexOf(item.index) == -1;
        });
      }
    },
    /** 复选框选中数据 */
    handleWmsMaterialLkDetailSelectionChange(selection) {
      this.checkedWmsMaterialLkDetail = selection.map((item) => item.index);
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/materialLk/export",
        {
          ...this.queryParams,
        },
        `materialLk_${new Date().getTime()}.xlsx`
      );
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialName =
          null;
        this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialType =
          null;
        this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialSpec =
          null;
        this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialModel =
          null;
        this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialColor =
          null;
        this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialUnit =
          null;
        listMaterial({ materialCode: queryString }).then((response) => {
          this.restaurants = response.rows.map((item) => {
            return {
              value: item.materialCode,
              material: item,
            };
          });
          cb(this.restaurants);
        });
      } else {
        this.restaurants = [];
        cb([]);
      }
    },
    handleSelect(item) {
      this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialName =
        item.material.materialName;
      this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialType =
        item.material.materialType;
      this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialSpec =
        item.material.materialSpec;
      this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialModel =
        item.material.materialModel;
      this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialColor =
        item.material.materialColor;
      this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].materialUnit =
        item.material.materialUnit;
    },
    /** 当前选中行的行号 */
    rowWmsMaterialLkDetailIndex({ row, rowIndex }) {
      row.row_index = rowIndex;
    },
    onRowClick(row, event, column) {
      this.detailCurrentRowIndex = row.row_index;
    },
    /** 查询供应商列表 */
    getSupplierList() {
      listSupplier({
        pageNum: 1,
        pageSize: 50,
        orderByColumn: "supplier",
        isAsc: "asc",
      }).then((response) => {
        this.supplierList = response.rows;
      });
    },
    changeSupplier(params) {
      const { value, label } = params;
      this.form.supplier = value;
    },
    /** 查询仓位列表 */
    getPositionList() {
      listPosition({
        pageNum: 1,
        pageSize: 50,
        orderByColumn: "warehouse_name asc,position_name",
        isAsc: "asc",
      }).then((response) => {
        this.positionList = response.rows;
      });
    },
    changePosition(params) {
      const { value, label } = params;
      this.wmsMaterialLkDetailList[this.detailCurrentRowIndex].positionName =
        value;
    },
  },
};
</script>
