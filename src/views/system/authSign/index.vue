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
      <el-form-item label="名" prop="firstName">
        <el-input
          v-model="queryParams.firstName"
          placeholder="请输入名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓" prop="lastName">
        <el-input
          v-model="queryParams.lastName"
          placeholder="请输入姓"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="fullName">
        <el-input
          v-model="queryParams.fullName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker clearable
          v-model="queryParams.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择生日">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="国籍" prop="natiionality">
        <el-input
          v-model="queryParams.natiionality"
          placeholder="请输入国籍"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职位:董事/高管/职员/无职位" prop="occupation">
        <el-input
          v-model="queryParams.occupation"
          placeholder="请输入职位:董事/高管/职员/无职位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumnber">
        <el-input
          v-model="queryParams.phoneNumnber"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮箱"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行卡" prop="bankCard">
        <el-input
          v-model="queryParams.bankCard"
          placeholder="请输入银行卡"
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
          v-hasPermi="['system:authSign:add']"
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
          v-hasPermi="['system:authSign:edit']"
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
          v-hasPermi="['system:authSign:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:authSign:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="authSignList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="客户号" align="center" prop="cstNo" />
      <el-table-column label="名" align="center" prop="firstName" />
      <el-table-column label="姓" align="center" prop="lastName" />
      <el-table-column label="姓名" align="center" prop="fullName" />
      <el-table-column label="生日" align="center" prop="birthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="国籍" align="center" prop="natiionality" />
      <el-table-column label="性别:男/女/其他" align="center" prop="sex" />
      <el-table-column label="职位:董事/高管/职员/无职位" align="center" prop="occupation" />
      <el-table-column label="手机号" align="center" prop="phoneNumnber" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="银行卡" align="center" prop="bankCard" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:authSign:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:authSign:remove']"
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

    <!-- 添加或修改授权签字人信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户号" prop="cstNo">
          <el-input v-model="form.cstNo" placeholder="请输入客户号" />
        </el-form-item>
        <el-form-item label="名" prop="firstName">
          <el-input v-model="form.firstName" placeholder="请输入名" />
        </el-form-item>
        <el-form-item label="姓" prop="lastName">
          <el-input v-model="form.lastName" placeholder="请输入姓" />
        </el-form-item>
        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker clearable
            v-model="form.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择生日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="国籍" prop="natiionality">
          <el-input v-model="form.natiionality" placeholder="请输入国籍" />
        </el-form-item>
        <el-form-item label="职位:董事/高管/职员/无职位" prop="occupation">
          <el-input v-model="form.occupation" placeholder="请输入职位:董事/高管/职员/无职位" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumnber">
          <el-input v-model="form.phoneNumnber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="银行卡" prop="bankCard">
          <el-input v-model="form.bankCard" placeholder="请输入银行卡" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="请输入内容" />
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
import { listAuthSign, getAuthSign, delAuthSign, addAuthSign, updateAuthSign } from "@/api/system/authSign";

export default {
  name: "AuthSign",
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
      // 授权签字人信息表格数据
      authSignList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cstNo: null,
        firstName: null,
        lastName: null,
        fullName: null,
        birthday: null,
        natiionality: null,
        sex: null,
        occupation: null,
        phoneNumnber: null,
        email: null,
        bankCard: null,
        address: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cstNo: [
          { required: true, message: "客户号不能为空", trigger: "blur" }
        ],
        firstName: [
          { required: true, message: "名不能为空", trigger: "blur" }
        ],
        lastName: [
          { required: true, message: "姓不能为空", trigger: "blur" }
        ],
        fullName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        birthday: [
          { required: true, message: "生日不能为空", trigger: "blur" }
        ],
        natiionality: [
          { required: true, message: "国籍不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "性别:男/女/其他不能为空", trigger: "change" }
        ],
        address: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询授权签字人信息列表 */
    getList() {
      this.loading = true;
      listAuthSign(this.queryParams).then(response => {
        this.authSignList = response.rows;
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
        firstName: null,
        lastName: null,
        fullName: null,
        birthday: null,
        natiionality: null,
        sex: null,
        occupation: null,
        phoneNumnber: null,
        email: null,
        bankCard: null,
        address: null,
        createBy: null,
        createTime: null,
        updateBy: null,
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加授权签字人信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAuthSign(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改授权签字人信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAuthSign(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAuthSign(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除授权签字人信息编号为"' + ids + '"的数据项？').then(function() {
        return delAuthSign(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/authSign/export', {
        ...this.queryParams
      }, `authSign_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
