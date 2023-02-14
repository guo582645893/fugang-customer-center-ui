<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户号" prop="cstNo">
        <el-input
          v-model="queryParams.cstNo"
          placeholder="请输入客户号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主账户号" prop="accNo">
        <el-input
          v-model="queryParams.accNo"
          placeholder="请输入主账户号"
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

      <el-form-item label="收款人账号" prop="payeeAccNo">
        <el-input
          v-model="queryParams.payeeAccNo"
          placeholder="请输入收款人账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:payeePath:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:payeePath:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:payeePath:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:payeePath:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="payeePathList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="客户号" align="center" prop="cstNo" />
      <el-table-column label="主账户号" align="center" prop="accNo" />
      <el-table-column label="账户名称" align="center" prop="accName" />
      <el-table-column label="币种" align="center" prop="currency" />
      <el-table-column label="收款银行名称" align="center" prop="payeeBankName" />
      <el-table-column label="收款银行地址" align="center" prop="payeeBankAddress" />

      <el-table-column label="收款人账号" align="center" prop="payeeAccNo" />
      <el-table-column label="收款人名称" align="center" prop="payeeAccName" />
      <el-table-column label="收款人地址" align="center" prop="payeeAddress" />

      <el-table-column label="代理行名称" align="center" prop="agentBankName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:payeePath:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:payeePath:remove']"
          >删除</el-button>
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

    <!-- 添加或修改收款路径信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户号" prop="cstNo">
          <el-input v-model="form.cstNo" placeholder="请输入客户号" />
        </el-form-item>
        <el-form-item label="主账户号" prop="accNo">
          <el-input v-model="form.accNo" placeholder="请输入主账户号" />
        </el-form-item>
        <el-form-item label="账户名称" prop="accName">
          <el-input v-model="form.accName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="收款银行名称" prop="payeeBankName">
          <el-input v-model="form.payeeBankName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="收款银行地址" prop="payeeBankAddress">
          <el-input v-model="form.payeeBankAddress" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="收款银行swift号" prop="payeeBankSwift">
          <el-input v-model="form.payeeBankSwift" placeholder="请输入收款银行swift号" />
        </el-form-item>
        <el-form-item label="收款行所在区域编码(本地编码)" prop="payeeBankAreaCode">
          <el-input v-model="form.payeeBankAreaCode" placeholder="请输入收款行所在区域编码(本地编码)" />
        </el-form-item>
        <el-form-item label="收款行本地号码" prop="payeeBankLocalCode">
          <el-input v-model="form.payeeBankLocalCode" placeholder="请输入收款行本地号码" />
        </el-form-item>
        <el-form-item label="收款人账号" prop="payeeAccNo">
          <el-input v-model="form.payeeAccNo" placeholder="请输入收款人账号" />
        </el-form-item>
        <el-form-item label="收款人名称" prop="payeeAccName">
          <el-input v-model="form.payeeAccName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="收款人地址" prop="payeeAddress">
          <el-input v-model="form.payeeAddress" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="摘要是否要编码：是 否" prop="digestCode">
          <el-input v-model="form.digestCode" placeholder="请输入摘要是否要编码：是 否" />
        </el-form-item>
        <el-form-item label="代理行编码" prop="agentBankCode">
          <el-input v-model="form.agentBankCode" placeholder="请输入代理行编码" />
        </el-form-item>
        <el-form-item label="代理行名称" prop="agentBankName">
          <el-input v-model="form.agentBankName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="代理行地址" prop="agentBankAddress">
          <el-input v-model="form.agentBankAddress" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="代理行swift号" prop="agentBankSwift">
          <el-input v-model="form.agentBankSwift" placeholder="请输入代理行swift号" />
        </el-form-item>
        <el-form-item label="代理行账户号" prop="agentBankAccNo">
          <el-input v-model="form.agentBankAccNo" placeholder="请输入代理行账户号" />
        </el-form-item>
        <el-form-item label="收款路径账户号" prop="payeePathAccNo">
          <el-input v-model="form.payeePathAccNo" placeholder="请输入收款路径账户号" />
        </el-form-item>
        <el-form-item label="收款银行代理行名称" prop="payeeAgentBankName">
          <el-input v-model="form.payeeAgentBankName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="收款银行代理行地址" prop="payeeAgentBankAddress">
          <el-input v-model="form.payeeAgentBankAddress" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="收款银行代理行SWIFT号码" prop="payeeAgentBankSwift">
          <el-input v-model="form.payeeAgentBankSwift" placeholder="请输入收款银行代理行SWIFT号码" />
        </el-form-item>
        <el-form-item label="汇款附言" prop="remittanceInfo">
          <el-input v-model="form.remittanceInfo" placeholder="请输入汇款附言" />
        </el-form-item>
        <el-form-item label="业务描述" prop="businessDesc">
          <el-input v-model="form.businessDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="代理行要求/说明" prop="agentBankDesc">
          <el-input v-model="form.agentBankDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="操作员ID" prop="operatorId">
          <el-input v-model="form.operatorId" placeholder="请输入操作员ID" />
        </el-form-item>
        <el-form-item label="操作员名称" prop="operatorName">
          <el-input v-model="form.operatorName" placeholder="请输入操作员名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listPayeePath, getPayeePath, delPayeePath, addPayeePath, updatePayeePath } from "@/api/system/payeePath";

export default {
  name: "PayeePath",
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
      // 收款路径信息表格数据
      payeePathList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cstNo: null,
        accNo: null,
        accName: null,
        currency: null,
        payeeBankName: null,
        payeeBankAddress: null,
        payeeBankSwift: null,
        payeeBankAreaCode: null,
        payeeBankLocalCode: null,
        payeeAccNo: null,
        payeeAccName: null,
        payeeAddress: null,
        digestCode: null,
        agentBankCode: null,
        agentBankName: null,
        agentBankAddress: null,
        agentBankSwift: null,
        agentBankAccNo: null,
        agentBankAccStatus: null,
        payeePathAccNo: null,
        payeeAgentBankName: null,
        payeeAgentBankAddress: null,
        payeeAgentBankSwift: null,
        remittanceInfo: null,
        businessDesc: null,
        agentBankDesc: null,
        operatorId: null,
        operatorName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cstNo: [
          { required: true, message: "客户号不能为空", trigger: "blur" }
        ],
        accNo: [
          { required: true, message: "主账户号不能为空", trigger: "blur" }
        ],
        accName: [
          { required: true, message: "账户名称不能为空", trigger: "blur" }
        ],
        currency: [
          { required: true, message: "币种不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询收款路径信息列表 */
    getList() {
      this.loading = true;
      listPayeePath(this.queryParams).then(response => {
        this.payeePathList = response.rows;
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
        cstNo: null,
        accNo: null,
        accName: null,
        currency: null,
        payeeBankName: null,
        payeeBankAddress: null,
        payeeBankSwift: null,
        payeeBankAreaCode: null,
        payeeBankLocalCode: null,
        payeeAccNo: null,
        payeeAccName: null,
        payeeAddress: null,
        digestCode: null,
        agentBankCode: null,
        agentBankName: null,
        agentBankAddress: null,
        agentBankSwift: null,
        agentBankAccNo: null,
        agentBankAccStatus: "0",
        payeePathAccNo: null,
        payeeAgentBankName: null,
        payeeAgentBankAddress: null,
        payeeAgentBankSwift: null,
        remittanceInfo: null,
        businessDesc: null,
        agentBankDesc: null,
        operatorId: null,
        operatorName: null,
        remark: null,
        createTime: null,
        updateTime: null
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加收款路径信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPayeePath(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改收款路径信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePayeePath(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPayeePath(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除收款路径信息编号为"' + ids + '"的数据项？').then(function() {
        return delPayeePath(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/payeePath/export', {
        ...this.queryParams
      }, `payeePath_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
