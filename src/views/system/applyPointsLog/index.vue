<template>
<div class="app-container">
    <el-row :gutter="24">
        <!--用户数据-->
        <el-col :span="24" :xs="24">
<!--            <el-row :gutter="20" class="mb8">-->
<!--                <el-form :model="queryParams" ref="queryForm" :inline="true"  label-width="68px" class="el-form-search">-->
<!--                    <el-form-item label="手机号码" prop="phonenumber" class="el-form-search-item">-->
<!--                        <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable size="small"  @keyup.enter.native="handleQuery" />-->
<!--                    </el-form-item>-->
<!--                    <el-form-item class="el-form-search-item">-->
<!--                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--            </el-row>-->

            <el-table :height="tableHeight" v-loading="loading" :data="userList">
                <el-table-column label="积分用户" align="center" key="userName" prop="userName"  :show-overflow-tooltip="true" />
                <el-table-column label="获得积分" align="center" key="points" prop="points" />
                <el-table-column label="创建时间" align="center" prop="createTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
              <el-table-column label="审核人" align="center" key="createBy" prop="createBy"  width="120" />
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </el-col>
    </el-row>
</div>
</template>

<script>
import {
  listUser,
  getUser,
  applyUser, listApplyPointsLog
} from '@/api/system/user'

export default {
    name: "User",
    dicts: ["sys_normal_disable", "sys_user_sex"],
    data() {
        return {
            tableHeight: document.documentElement.clientHeight - 180,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 总条数
            total: 0,
            // 用户表格数据
            userList: null,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 默认密码
            initPassword: undefined,
            // 日期范围
            dateRange: [],
            // 表单参数
            form: {},
            defaultProps: {
                children: "children",
                label: "label",
            },

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                userName: undefined,
                phonenumber: undefined,
                status: undefined,
                deptId: undefined,
                userType: "01",
            },
        };
    },

    created() {
        this.getList();
        this.getConfigKey("sys.user.initPassword").then((response) => {
            this.initPassword = response.msg;
        });
    },
    methods: {

        /** 查询用户列表 */
        getList() {
            this.loading = true;
          listApplyPointsLog().then(
                (response) => {
                    this.userList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            );
        },


        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },

        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },
    },
};
</script>
