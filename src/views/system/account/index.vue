<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="账户号" prop="accNo">
        <el-input
            v-model="queryParams.accNo"
            placeholder="请输入账户号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户号" prop="cstNo">
        <el-input
            v-model="queryParams.cstNo"
            placeholder="请输入客户号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种" prop="currency">
        <el-input
            v-model="queryParams.currency"
            placeholder="请输入币种"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="账户开户时间" prop="openTime">
        <el-date-picker clearable
                        v-model="queryParams.openTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择账户开户时间"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:account:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:account:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:account:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:account:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accountList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id"/>
      <el-table-column label="账户号" align="center" prop="accNo"/>
      <el-table-column label="客户号" align="center" prop="cstNo"/>
      <el-table-column label="账户名称" align="center" prop="accName"/>
      <el-table-column label="币种" align="center" prop="currency"/>
      <el-table-column label="别名" align="center" prop="accAlias"/>
      <el-table-column label="账户状态" align="center" prop="accStatus"/>
      <el-table-column label="单笔限额" align="center" prop="singleLimit"/>
      <el-table-column label="日累计限额" align="center" prop="dailyAccumulativeLimit"/>
      <el-table-column label="日最大汇出笔数" align="center" prop="maxDayOutwardCount"/>
      <el-table-column label="月最大汇出笔数" align="center" prop="maxMonthOutwardCount"/>
      <el-table-column label="账户开户时间" align="center" prop="openTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.openTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:account:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:account:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改账户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账户号" prop="accNo">
          <el-input v-model="form.accNo" placeholder="请输入账户号"/>
        </el-form-item>
        <el-form-item label="客户号" prop="cstNo">
          <el-input v-model="form.cstNo" placeholder="请输入客户号"/>
        </el-form-item>
        <el-form-item label="账户名称" prop="accName">
          <el-input v-model="form.accName" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种"/>
        </el-form-item>
        <el-form-item label="别名" prop="accAlias">
          <el-input v-model="form.accAlias" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="账户属性 主账户" prop="accProperties">
          <el-input v-model="form.accProperties" placeholder="请输入账户属性 主账户"/>
        </el-form-item>
        <el-form-item label="单笔限额" prop="singleLimit">
          <el-input v-model="form.singleLimit" placeholder="请输入单笔限额"/>
        </el-form-item>
        <el-form-item label="日累计限额" prop="dailyAccumulativeLimit">
          <el-input v-model="form.dailyAccumulativeLimit" placeholder="请输入日累计限额"/>
        </el-form-item>
        <el-form-item label="日最大汇出笔数" prop="maxDayOutwardCount">
          <el-input v-model="form.maxDayOutwardCount" placeholder="请输入日最大汇出笔数"/>
        </el-form-item>
        <el-form-item label="月最大汇出笔数" prop="maxMonthOutwardCount">
          <el-input v-model="form.maxMonthOutwardCount" placeholder="请输入月最大汇出笔数"/>
        </el-form-item>
        <el-form-item label="账户开户时间" prop="openTime">
          <el-date-picker clearable
                          v-model="form.openTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择账户开户时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
import {listAccount, getAccount, delAccount, addAccount, updateAccount} from "@/api/system/account";

export default {
  name: "Account",
  data() {
    return {
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
      // 账户表格数据
      accountList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        accNo: null,
        cstNo: null,
        accName: null,
        accBizType: null,
        currency: null,
        accAlias: null,
        accStatus: null,
        accProperties: null,
        accCurrencyType: null,
        singleLimit: null,
        dailyAccumulativeLimit: null,
        maxDayOutwardCount: null,
        maxMonthOutwardCount: null,
        openTime: null,
        operatorId: null,
        operatorName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        accNo: [
          {required: true, message: "账户号不能为空", trigger: "blur"}
        ],
        cstNo: [
          {required: true, message: "客户号不能为空", trigger: "blur"}
        ],
        accName: [
          {required: true, message: "账户名称不能为空", trigger: "blur"}
        ],
        currency: [
          {required: true, message: "币种不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询账户列表 */
    getList() {
      this.loading = true;
      listAccount(this.queryParams).then(response => {
        this.accountList = response.rows;
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
        accNo: null,
        cstNo: null,
        accName: null,
        accBizType: null,
        currency: null,
        accAlias: null,
        accStatus: "0",
        accProperties: null,
        accCurrencyType: null,
        singleLimit: null,
        dailyAccumulativeLimit: null,
        maxDayOutwardCount: null,
        maxMonthOutwardCount: null,
        openTime: null,
        operatorId: null,
        operatorName: null,
        createTime: null,
        updateTime: null,
        remark: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加账户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAccount(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改账户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAccount(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAccount(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除账户编号为"' + ids + '"的数据项？').then(function () {
        return delAccount(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/account/export', {
        ...this.queryParams
      }, `account_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
