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
          v-hasPermi="['system:materialCkDetail:add']"
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
          v-hasPermi="['system:materialCkDetail:edit']"
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
          v-hasPermi="['system:materialCkDetail:remove']"
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
          v-hasPermi="['system:materialCkDetail:export']"
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
          label="材料代号"
          prop="materialCode"
          class="el-form-search-item"
        >
          <el-input
            v-model="queryParams.materialCode"
            placeholder="请输入材料代号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="仓位名称"
          prop="positionName"
          class="el-form-search-item"
        >
          <el-select
            v-model="queryParams.positionName"
            placeholder="请选择仓位"
            clearable
            size="small"
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in positionList"
              :key="index"
              :label="item.positionName"
              :value="item.positionName"
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
      :data="materialCkDetailList"
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
      <el-table-column label="材料类别" align="center" prop="materialType" />
      <el-table-column label="材料代号" align="center" prop="materialCode" />
      <el-table-column label="仓位名称" align="center" prop="materialName" />
      <el-table-column label="规格" align="center" prop="materialSpec" />
      <el-table-column label="型号" align="center" prop="materialModel" />
      <el-table-column label="颜色" align="center" prop="materialColor" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="仓位名称" align="center" prop="positionName" />
      <el-table-column label="炉批号" align="center" prop="batchNo" />
      <el-table-column label="数量" align="center" prop="ckQty" />
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
            v-hasPermi="['system:materialCkDetail:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:materialCkDetail:remove']"
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

    <!-- 添加或修改材料出库明细对话框 -->
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
            <el-form-item label="材料代号" prop="materialCode">
              <el-autocomplete
                v-model="form.materialCode"
                placeholder="请输入材料代号"
                :fetch-suggestions="querySearchAsync"
                @select="handleSelect"
                :clearable="true"
                prefix-icon="el-icon-search"
                :trigger-on-focus="false"
                style="width: 100%"
              >
                <template slot-scope="{ item }">
                  {{ item.value }}/{{ item.material.positionName }}/{{
                    item.material.batchNo
                  }}
                </template>
              </el-autocomplete>
            </el-form-item></el-col
          >
          <el-col :span="12">
            <el-form-item label="材料类别" prop="materialType">
              <el-input v-model="form.materialType" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item label="材料名称" prop="materialName">
              <el-input v-model="form.materialName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="规格" prop="materialSpec">
              <el-input v-model="form.materialSpec" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="型号" prop="materialModel">
              <el-input v-model="form.materialModel" disabled /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="颜色" prop="materialColor">
              <el-input v-model="form.materialColor" disabled /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item label="单位" prop="materialUnit">
              <el-input v-model="form.materialUnit" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓位名称">
              <el-input v-model="form.positionName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="炉批号" prop="batchNo">
              <el-input v-model="form.batchNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="数量" prop="ckQty" ref="ckQty">
              <el-input v-model="form.ckQty" placeholder="请输入数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
  listMaterialCkDetail,
  getMaterialCkDetail,
  delMaterialCkDetail,
  addMaterialCkDetail,
  updateMaterialCkDetail,
} from "@/api/wms/materialCkDetail";
import { listPosition } from "@/api/wms/position";
import { materialKc } from "@/api/wms/materialLkDetail";

export default {
  name: "MaterialCkDetail",
  data() {
    return {
      // 表格高度
      tableHeight: document.documentElement.clientHeight - 180,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 材料出库明细表格数据
      materialCkDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        orderByColumn: "material_type asc,material_code",
        isAsc: "asc",
        materialCode: null,
        materialName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        materialCode: [
          { required: true, message: "请输入材料代号", trigger: "blur" },
        ],
        materialType: [
          { required: true, message: "请选择材料代号", trigger: "blur" },
        ],
        lkQty: [{ required: true, message: "请输入数量", trigger: "blur" }],
      },
      positionList: null,
    };
  },
  created() {
    const parentId = this.$route.params && this.$route.params.parentId;
    this.queryParams.parentId = parentId;
    this.getList();
    this.getPositionList();
  },
  methods: {
    /** 查询材料出库明细列表 */
    getList() {
      this.loading = true;
      listMaterialCkDetail(this.queryParams).then((response) => {
        this.materialCkDetailList = response.rows;
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
        parentId: null,
        materialType: null,
        materialCode: null,
        materialName: null,
        materialSpec: null,
        materialModel: null,
        materialColor: null,
        materialUnit: null,
        positionName: null,
        batchNo: null,
        ckQty: null,
        qrCode: null,
        state: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
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
      this.form.parentId = this.queryParams.parentId;
      this.open = true;
      this.title = "添加材料出库明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMaterialCkDetail(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改材料出库明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateMaterialCkDetail(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterialCkDetail(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
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
          return delMaterialCkDetail(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/materialCkDetail/export",
        {
          ...this.queryParams,
        },
        `materialCkDetail_${new Date().getTime()}.xlsx`
      );
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        this.form.materialName = null;
        this.form.materialType = null;
        this.form.materialSpec = null;
        this.form.materialModel = null;
        this.form.materialColor = null;
        this.form.materialUnit = null;
        this.form.positionName = null;
        this.form.batchNo = null;
        materialKc({ materialCode: queryString }).then((response) => {
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
      this.form.materialName = item.material.materialName;
      this.form.materialType = item.material.materialType;
      this.form.materialSpec = item.material.materialSpec;
      this.form.materialModel = item.material.materialModel;
      this.form.materialColor = item.material.materialColor;
      this.form.materialUnit = item.material.materialUnit;
      this.form.positionName = item.material.positionName;
      this.form.batchNo = item.material.batchNo;
      this.form.materialUnit = item.material.materialUnit;
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
  },
};
</script>
