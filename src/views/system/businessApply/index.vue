<template>
<div class="app-container">
    <el-row :gutter="24">
        <!--用户数据-->
        <el-col :span="24" :xs="24">
            <el-row :gutter="24" class="mb8">
                <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px" class="el-form-search">
                    <el-form-item label="用户名称" prop="userName" class="el-form-search-item">
                        <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="商机号码" prop="mobile" class="el-form-search-item">
                        <el-input v-model="queryParams.mobile" placeholder="请输入商机号码" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                  <el-form-item label="注册手机号" prop="mobile" class="el-form-search-item">
                    <el-input v-model="queryParams.createBy" placeholder="请输入注册手机号" clearable size="small" @keyup.enter.native="handleQuery" />
                  </el-form-item>
                  <el-form-item label="业务类型" prop="businessType" class="el-form-search-item">
                    <el-input v-model="queryParams.businessType" placeholder="请输入注册手机号" clearable size="small" @keyup.enter.native="handleQuery" />
                  </el-form-item>
<!--                    <el-form-item label="状态" prop="status" class="el-form-search-item">-->
<!--                        <el-select v-model="queryParams.status" placeholder="用户状态" clearable size="small">-->
<!--                            <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                    <el-form-item class="el-form-search-item">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                      <el-col :span="1.5">
                        <el-button
                          type="warning"
                          plain
                          icon="el-icon-download"
                          size="mini"
                          @click="handleExport"
                        >导出</el-button>
                      </el-col>
                    </el-form-item>
                </el-form>
            </el-row>

            <el-table :height="tableHeight" v-loading="loading" :data="userList">
                <el-table-column label="用户名称" align="center" key="userName" prop="userName" :show-overflow-tooltip="true" />
                <el-table-column label="商机号码" align="center" key="mobile" prop="mobile" width="120" />
                <el-table-column label="业务类型" align="center" key="businessType" prop="businessType" width="120" />
                <el-table-column label="地址" align="center" key="address" prop="address" :show-overflow-tooltip="true" />
              <el-table-column label="获得积分" align="center" key="points" prop="points" :show-overflow-tooltip="true" />
                <el-table-column label="审核状态" align="center" prop="checkStatus" width="160">
                  <template slot-scope="scope">
                    <span v-if="scope.row.checkStatus===0">待审核</span>
                    <span v-else-if="scope.row.checkStatus===1">审核通过</span>
                    <span v-else>审核驳回</span>
                  </template>
                </el-table-column>
              <el-table-column label="注册手机号" align="center" key="createBy" prop="createBy" :show-overflow-tooltip="true" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="160">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" key="remark" prop="remark" :show-overflow-tooltip="true" />
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
    <el-dialog title="办理业务审核" :visible.sync="open" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户昵称" prop="userName">
                        <el-input v-model="form.userName" placeholder="请输入用户昵称" maxlength="30" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请时间" prop="createTime">
                        <el-input v-model="form.createTime" placeholder="请输入手机号码" maxlength="11" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请地址" prop="address">
                        <el-input v-model="form.address" placeholder="请输入申请地址" maxlength="11" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="办理业务">
                        <el-select v-model="value" multiple placeholder="请选择">
                            <el-option-group v-for="group in businessOptions" :key="group.label" :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-option-group>
                            <!-- <el-option v-for="item in businessOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option> -->
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="审核状态" prop="checkStatus">
                        <el-select v-model="form.checkStatus" placeholder="审核状态" size="small">
<!--                            <el-option label="待审核" :value="0" />-->
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
    listBusiness,
    applyBusiness,
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
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {

            },
            //办理业务
            businessOptions: [{
                label: '神州行、动感地带积分激励',
                options: [{
                    label: "套餐139元,折后39元,玄新授权点奖励300分",
                    value: 1
                }, {
                    label: "套餐199元,折后109元,玄新授权点奖励400分",
                    value: 2
                }, {
                    label: "套餐299元,折后119元,玄新授权点奖励500分",
                    value: 3
                }]
            }, {
                label: '宽带积分激励',
                options: [{
                    label: "宽带,玄新授权点奖励:100分/条",
                    value: 4
                }]
            }, {
                label: "入网积分激励",
                options: [{
                    label: "100元39套餐卡,玄新授权点奖励:30分/个",
                    value: 5
                }]
            }],

            value: [],

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                userName: '',
                mobile: '',
                createBy: '',
                businessType: '',
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
    },
    methods: {

        /** 查询商机列表 */
        getList() {
            this.loading = true;
            listBusiness(this.queryParams).then(
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
                mobile: undefined,
                address:"",
                checkStatus: 1,
                comboType:""
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

        /** 修改按钮操作 */
        handleUpdate(row) {
            this.open = true;
            this.form = Object.assign({}, row)
            this.form.checkStatus = 1
            let list = row.comboType.split(',')
            list.forEach(i => {
                this.value.push(+i)
            });
        },

        /** 提交按钮 */
        submitForm() {
            this.form.comboType = this.value.join(",")
            this.$refs["form"].validate((valid) => {
                if (valid) {
                        applyBusiness(this.form).then(res => {
                            this.$modal.msgSuccess("操作成功");
                            this.open = false;
                            this.getList();
                        });
                }
            });
        },
      /** 导出按钮操作 */
      handleExport() {
        this.download(
          "system/info/export",
          {
            ...this.queryParams,
          },
          `businessInfo_${new Date().getTime()}.xlsx`
        );
      },
    },
};
</script>
