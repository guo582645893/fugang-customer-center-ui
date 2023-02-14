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
      <el-form-item label="证件号码" prop="certificateNo">
        <el-input
            v-model="queryParams.certificateNo"
            placeholder="请输入证件号码"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="证件生效日期" prop="effectiveDate">
        <el-date-picker clearable
                        v-model="queryParams.effectiveDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择证件生效日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="证件过期日期" prop="expirationDate">
        <el-date-picker clearable
                        v-model="queryParams.expirationDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择证件过期日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="签署国家" prop="signCountry">
        <el-input
            v-model="queryParams.signCountry"
            placeholder="请输入签署国家"
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
            v-hasPermi="['system:certificate:add']"
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
            v-hasPermi="['system:certificate:edit']"
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
            v-hasPermi="['system:certificate:remove']"
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
            v-hasPermi="['system:certificate:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="certificateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="客户号" align="center" prop="cstNo"/>
      <el-table-column label="证件号码" align="center" prop="certificateNo"/>
      <el-table-column label="证件类型" align="center" prop="certificateType"/>
      <el-table-column label="证件名称" align="center" prop="certificateName"/>
      <el-table-column label="证件原名" align="center" prop="certificateOriName"/>
      <el-table-column label="证件生效日期" align="center" prop="effectiveDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.effectiveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件过期日期" align="center" prop="expirationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expirationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签署国家" align="center" prop="signCountry"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:certificate:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:certificate:remove']"
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

    <!-- 添加或修改证件信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联ID" prop="relationId">
          <el-input v-model="form.relationId" placeholder="请输入关联ID"/>
        </el-form-item>
        <el-form-item label="证件号码" prop="certificateNo">
          <el-input v-model="form.certificateNo" placeholder="请输入证件号码"/>
        </el-form-item>
        <el-form-item label="证件名称" prop="certificateName">
          <el-input v-model="form.certificateName" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="证件原名" prop="certificateOriName">
          <el-input v-model="form.certificateOriName" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="证件生效日期" prop="effectiveDate">
          <el-date-picker clearable
                          v-model="form.effectiveDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择证件生效日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="证件过期日期" prop="expirationDate">
          <el-date-picker clearable
                          v-model="form.expirationDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择证件过期日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签署国家" prop="signCountry">
          <el-input v-model="form.signCountry" placeholder="请输入签署国家"/>
        </el-form-item>
        <el-form-item label="操作人id" prop="operatorId">
          <el-input v-model="form.operatorId" placeholder="请输入操作人id"/>
        </el-form-item>
        <el-form-item label="操作人名称" prop="operatorName">
          <el-input v-model="form.operatorName" placeholder="请输入操作人名称"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
import {listCertificate, getCertificate, delCertificate, addCertificate, updateCertificate} from "@/api/system/certificate";

export default {
  name: "Certificate",
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
      // 证件信息表格数据
      certificateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cstNo: null,
        relationId: null,
        certificateNo: null,
        certificateType: null,
        certificateName: null,
        certificateOriName: null,
        certificatePath: null,
        effectiveDate: null,
        expirationDate: null,
        signCountry: null,
        operatorId: null,
        operatorName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        relationId: [
          {required: true, message: "关联ID不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询证件信息列表 */
    getList() {
      this.loading = true;
      listCertificate(this.queryParams).then(response => {
        this.certificateList = response.rows;
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
        relationId: null,
        cstNo: null,
        certificateNo: null,
        certificateType: null,
        certificateName: null,
        certificateOriName: null,
        certificatePath: null,
        effectiveDate: null,
        expirationDate: null,
        signCountry: null,
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
      this.title = "添加证件信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCertificate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改证件信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCertificate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCertificate(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除证件信息编号为"' + ids + '"的数据项？').then(function () {
        return delCertificate(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/certificate/export', {
        ...this.queryParams
      }, `certificate_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
