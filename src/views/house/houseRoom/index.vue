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
          v-hasPermi="['system:houseRoom:add']"
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
          v-hasPermi="['system:houseRoom:edit']"
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
          v-hasPermi="['system:houseRoom:remove']"
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
          v-hasPermi="['system:houseRoom:export']"
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
          label="小区名称"
          prop="villageName"
          class="el-form-search-item"
        >
          <el-select
            v-model="queryParams.villageName"
            placeholder="请选择房源小区"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in houseVillageList"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="房东电话"
          prop="owerPhone"
          class="el-form-search-item"
        >
          <el-input
            v-model="queryParams.owerPhone"
            placeholder="请输入房东电话"
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
      :data="houseRoomList"
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
        label="类型"
        align="center"
        prop="type"
        :formatter="typeFormatter"
      >
      </el-table-column>
      <el-table-column label="户型" align="center" prop="houseCode" />
      <el-table-column label="整套面积" align="center" prop="houseArea" />
      <el-table-column
        label="卧室"
        align="center"
        prop="roomType"
        :formatter="roomTypeFormatter"
      ></el-table-column>
      <el-table-column label="房间号" align="center" prop="roomCode" />
      <el-table-column label="房屋面积" align="center" prop="roomArea" />
      <el-table-column label="租金" align="center" prop="price" />
      <el-table-column label="图片" align="center" prop="faceUrl" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.faceUrl" :width="30" :height="30" />
        </template>
      </el-table-column>
      <el-table-column label="小区名称" align="center" prop="villageName" />
      <el-table-column label="房牌号" align="center" prop="houseNo" />
      <el-table-column label="房东电话" align="center" prop="owerPhone" />
      <!-- <el-table-column label="封面图" align="center" prop="faceUrl" /> -->
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
            v-hasPermi="['system:houseRoom:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:houseRoom:remove']"
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

    <!-- 添加或修改房源详情对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择类型"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="居室" prop="houseNum">
          <el-input v-model="form.houseNum" placeholder="请输入居室" />
        </el-form-item>
        <el-form-item label="厅室" prop="houseHall">
          <el-input v-model="form.houseHall" placeholder="请输入厅室" />
        </el-form-item>
        <el-form-item label="卫生间" prop="toiletNum">
          <el-input v-model="form.toiletNum" placeholder="请输入卫生间" />
        </el-form-item>
        <el-form-item label="整套面积" prop="houseArea">
          <el-input v-model="form.houseArea" placeholder="请输入整套面积" />
        </el-form-item>
        <el-form-item label="卧室" prop="roomType">
          <el-select
            v-model="form.type"
            placeholder="请选择卧室"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in roomTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间号" prop="roomCode">
          <el-input v-model="form.roomCode" placeholder="请输入房间号" />
        </el-form-item>
        <el-form-item label="房屋面积" prop="roomArea">
          <el-input v-model="form.roomArea" placeholder="请输入房屋面积" />
        </el-form-item>
        <el-form-item label="租金" prop="price">
          <el-input v-model="form.price" placeholder="请输入租金" />
        </el-form-item>
        <el-form-item label="起租日期" prop="startDate">
          <el-date-picker
            clearable
            size="small"
            v-model="form.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择起租日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="房源描述" prop="introduce">
          <el-input
            v-model="form.introduce"
            type="textarea"
            placeholder="请输入房源描述"
            :autosize="{ minRows: 2, maxRows: 2 }"
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>

        <el-form-item label="房源小区" prop="villageId">
          <el-select
            v-model="form.villageName"
            placeholder="请选择房源小区"
            clearable
            :style="{ width: '100%' }"
            @change="changeVillage"
          >
            <el-option
              v-for="(item, index) in houseVillageList"
              :key="index"
              :label="item.name"
              :value="{ value: item.id, label: item.name }"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="具体地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入具体地址" />
        </el-form-item>
        <el-form-item label="房牌号" prop="houseNo">
          <el-input v-model="form.houseNo" placeholder="请输入房牌号" />
        </el-form-item>
        <el-form-item label="房东姓名" prop="ownerName">
          <el-input v-model="form.ownerName" placeholder="请输入房东姓名" />
        </el-form-item>
        <el-form-item label="房东电话" prop="owerPhone">
          <el-input v-model="form.owerPhone" placeholder="请输入房东电话" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
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
  listHouseRoom,
  getHouseRoom,
  delHouseRoom,
  addHouseRoom,
  updateHouseRoom,
} from "@/api/system/houseRoom";

import { listHouseVillage } from "@/api/system/houseVillage";

export default {
  name: "HouseRoom",
  dicts: ["sys_notice_status"],
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
      // 房源详情表格数据
      houseRoomList: [],
      // 房源小区表格数据
      houseVillageList: [],
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
        type: null,
        owerPhone: null,
        villageName: null,
        code: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
          },
        ],
        houseNum: [
          { required: true, message: "居室不能为空", trigger: "blur" },
        ],
        ownerName: [
          { required: true, message: "房东姓名不能为空", trigger: "blur" },
        ],
        owerPhone: [
          { required: true, message: "房东电话不能为空", trigger: "blur" },
        ],
        villageName: [
          { required: true, message: "小区名称不能为空", trigger: "blur" },
        ],
      },
      typeOptions: [
        {
          label: "整租",
          value: 0,
        },
        {
          label: "合租",
          value: 1,
        },
      ],
      roomTypeOptions: [
        {
          label: "主卧",
          value: 0,
        },
        {
          label: "次卧",
          value: 1,
        },
      ],
      stepTypeOptions: [
        {
          label: "电梯房",
          value: "电梯房",
        },
        {
          label: "楼梯房",
          value: "楼梯房",
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getVillageList();
  },
  methods: {
    changeVillage(params) {
      const { value, label } = params;
      this.form.villageId = value;
      this.form.villageName = label;
    },
    /** 查询房源小区列表 */
    getVillageList() {
      listHouseVillage(this.queryParams).then((response) => {
        this.houseVillageList = response.rows;
      });
    },
    /** 查询房源详情列表 */
    getList() {
      this.loading = true;
      listHouseRoom(this.queryParams).then((response) => {
        this.houseRoomList = response.rows;
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
        type: null,
        houseNum: null,
        toiletNum: null,
        houseArea: null,
        roomType: null,
        roomCode: null,
        roomArea: null,
        direction: null,
        price: null,
        floor: null,
        stepType: null,
        startDate: null,
        introduce: null,
        ownerName: null,
        owerPhone: null,
        villageId: null,
        villageName: null,
        address: null,
        houseNo: null,
        payType: null,
        publishId: null,
        state: null,
        createTime: null,
        createName: null,
        updateTime: null,
        updateName: null,
        remark: null,
        houseHall: null,
        code: null,
        faceUrl: null,
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
      this.open = true;
      this.title = "添加房源";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getHouseRoom(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改房源";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateHouseRoom(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHouseRoom(this.form).then((response) => {
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
          return delHouseRoom(ids);
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
        "system/houseRoom/export",
        {
          ...this.queryParams,
        },
        `houseRoom_${new Date().getTime()}.xlsx`
      );
    },
    typeFormatter(row, column) {
      if (row.type == 0) {
        return "整租";
      } else if (row.type == 1) {
        return "合租";
      }
    },
    roomTypeFormatter(row, column) {
      if (row.type == 0) {
        return "主卧";
      } else if (row.type == 1) {
        return "次卧";
      }
    },
  },
};
</script>
