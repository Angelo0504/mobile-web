<template>
<div class="app-container">
    <el-row :gutter="24">
        <!--用户数据-->
        <el-col :span="20" :xs="24">
            <el-row :gutter="20" class="mb8">
                <el-form :model="queryParams" ref="queryForm" :inline="true"  label-width="68px" class="el-form-search">
                    <el-form-item label="用户名称" prop="userName" class="el-form-search-item">
                        <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small"  @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phonenumber" class="el-form-search-item">
                        <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable size="small"  @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status" class="el-form-search-item">
                        <el-select v-model="queryParams.status" placeholder="用户状态" clearable size="small" >
                            <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="el-form-search-item">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-row>

            <el-table :height="tableHeight" v-loading="loading" :data="userList">
                <el-table-column label="用户编号" align="center" key="userId" prop="userId"  />
                <el-table-column label="用户名称" align="center" key="userName" prop="userName"  :show-overflow-tooltip="true" />
                <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"  :show-overflow-tooltip="true" />
                <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber"  width="120" />
                <el-table-column label="状态" align="center" key="status" >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime"  width="160">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" :disabled="scope.row.checkStatus" @click="handleUpdate(scope.row)">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户昵称" prop="nickName">
                        <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号码" prop="phonenumber">
                        <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="审核状态" prop="checkStatus">
                        <el-select v-model="form.checkStatus" placeholder="审核状态" size="small">
                            <el-option label="待审核" :value="0" />
                            <el-option label="审核通过" :value="1" />
                            <el-option label="审核驳回" :value="2" />
                        </el-select>
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
    listUser,
    getUser,
    applyUser,
} from "@/api/system/user";

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

            // 表单校验
            rules: {
                nickName: [{
                    required: true,
                    message: "用户昵称不能为空",
                    trigger: "blur"
                }, ],

                checkStatus: [{
                    required: true,
                    message: "'请选择审核状态",
                    trigger: ["blur", "change"],
                }, ],
                phonenumber: [{
                    required: true,
                    message: "手机号码不能为空",
                    trigger: "blur"
                }, ],
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
            listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
                (response) => {
                    this.userList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            );
        },

        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },

        // 表单重置
        reset() {
            this.form = {
                userId: undefined,
                userName: undefined,
                nickName: undefined,
                phonenumber: undefined,
                checkStatus: 1,
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
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },

        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const userId = row.userId || this.ids;
            getUser(userId).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = "审核用户";
                this.form.checkStatus = 1
            });
        },

        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.userId != undefined) {
                        var applyForm = {
                            userId: this.form.userId,
                            checkStatus: this.form.checkStatus
                        }
                        applyUser(applyForm).then(res => {
                            this.$modal.msgSuccess("操作成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
    },
};
</script>
