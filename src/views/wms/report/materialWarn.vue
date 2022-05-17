<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb5">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
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
      :data="materialList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="#" type="index" width="50" align="center">
        <template scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料类别" align="center" prop="materialType" />
      <el-table-column label="材料代号" align="center" prop="materialCode" />
      <el-table-column label="材料名称" align="center" prop="materialName" />
      <el-table-column label="规格" align="center" prop="materialSpec" />
      <el-table-column label="型号" align="center" prop="materialModel" />
      <el-table-column label="颜色" align="center" prop="materialColor" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="预警量" align="center" prop="warnQty" />
      <el-table-column label="库存量" align="center" prop="kcQty">
        <template slot-scope="scope">
          <span style="color: red"> {{ scope.row.kcQty }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listMaterialWarn } from "@/api/wms/materialReport";
import { listPosition } from "@/api/wms/position";

export default {
  name: "MaterialWarn",
  data() {
    return {
      restaurants: [],
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
      materialList: [],
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
        positionName: null,
        parentId: null,
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
    this.getPositionList();
  },
  methods: {
    /** 查询材料入库明细列表 */
    getList() {
      this.loading = true;
      listMaterialWarn(this.queryParams).then((response) => {
        this.materialList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/materialReport/exportMaterialWarn",
        {
          ...this.queryParams,
        },
        `materialList_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
