<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="客户号" prop="cstNo">
        <el-input
            v-model="queryParams.cstNo"
            placeholder="请输入客户号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="cstNameEn">
        <el-input
            v-model="queryParams.cstNameEn"
            placeholder="请输入客户名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开户时间" prop="openAccountTime">
        <el-date-picker clearable
                        v-model="queryParams.openAccountTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择开户时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="注册国家" prop="registerCountry">
        <el-select v-model="queryParams.registerCountry" placeholder="注册国家">
          <el-option
              v-for="country in countryList.countryList.elements"
              :key="country.name"
              :label="country.showName"
              :value="country.showName"
          />
        </el-select>
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
            v-hasPermi="['system:info:add']"
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
            v-hasPermi="['system:info:edit']"
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
            v-hasPermi="['system:info:remove']"
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
            v-hasPermi="['system:info:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="客户号" align="center" prop="cstNo"/>
      <el-table-column label="客户状态" align="center" prop="cstStatus"/>
      <el-table-column label="客户名称" align="center" prop="cstNameEn"/>
      <el-table-column label="客户其他名称" align="center" prop="cstOtherName"/>
      <el-table-column label="公司性质" align="center" prop="enterpriseNature"/>
      <el-table-column label="开户时间" align="center" prop="openAccountTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.openAccountTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="registerTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registerTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册国家" align="center" prop="registerCountry"/>
      <el-table-column label="详细地址" align="center" prop="registerAddress"/>
      <el-table-column label="风险等级" align="center" prop="riskLevel"/>
      <el-table-column label="客户网址" align="center" prop="cstWebsite"/>
      <el-table-column label="联系人名称" align="center" prop="contactName"/>
      <el-table-column label="联系人邮箱" align="center" prop="contactEmail"/>
      <el-table-column label="联系人电话号码" align="center" prop="contactTelephoneNo"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:customer:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:customer:remove']"
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

    <!-- 添加或修改客户客户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户号" prop="cstNo">
          <el-input v-model="form.cstNo" placeholder="请输入客户号" :disabled="true"/>
        </el-form-item>
        <el-form-item label="客户名称" prop="cstNameEn">
          <el-input v-model="form.cstNameEn" placeholder="请输入客户英文名称"/>
        </el-form-item>
        <el-form-item label="客户其他名称" prop="cstOtherName">
          <el-input v-model="form.cstOtherName" placeholder="请输入客户其他名称"/>
        </el-form-item>
        <el-form-item label="公司注册号" prop="companyRegisterNo">
          <el-input v-model="form.companyRegisterNo" placeholder="请输入公司注册号"/>
        </el-form-item>
        <el-form-item label="公司性质" prop="enterpriseNature">
          <el-input v-model="form.enterpriseNature" placeholder="请输入公司性质"/>
        </el-form-item>
        <el-form-item label="当地行业种类" prop="localIndustrialClass">
          <el-select v-model="form.localIndustrialClass" placeholder="当地行业种类">
            <el-option
                v-for="localIndustry in countryList.localIndustryTypeEnum.elements"
                :key="localIndustry.name"
                :label="localIndustry.showName"
                :value="localIndustry.showName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当地行业种类子类" prop="subLocalIndustrialClass">
          <el-select v-model="form.subLocalIndustrialClass" placeholder="请输入当地行业种类子类">
            <el-option
                v-for="localIndustrysub in countryList.localIndustrySubTypeEnum.elements"
                :key="localIndustrysub.name"
                :label="localIndustrysub.showName"
                :value="localIndustrysub.showName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开户时间" prop="openAccountTime">
          <el-date-picker clearable
                          v-model="form.openAccountTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择开户时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册时间" prop="registerTime">
          <el-date-picker clearable
                          v-model="form.registerTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择注册时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册国家" prop="registerCountry">
          <el-select v-model="form.registerCountry" placeholder="注册国家">
            <el-option
                v-for="country in countryList.countryList.elements"
                :key="country.name"
                :label="country.showName"
                :value="country.showName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="registerAddress">
          <el-input v-model="form.registerAddress" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="风险等级" prop="riskLevel">
          <el-input v-model="form.riskLevel" placeholder="请输入风险等级"/>
        </el-form-item>
        <el-form-item label="客户网址" prop="cstWebsite">
          <el-input v-model="form.cstWebsite" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="联系人名称" prop="contactName">
          <el-input v-model="form.contactName" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="联系人邮箱" prop="contactEmail">
          <el-input v-model="form.contactEmail" placeholder="请输入联系人邮箱"/>
        </el-form-item>
        <el-form-item label="联系人电话号码" prop="contactTelephoneNo">
          <el-input v-model="form.contactTelephoneNo" placeholder="请输入联系人电话号码"/>
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
import {listInfo, getInfo, delInfo, addInfo, updateInfo, commonEnums} from "@/api/system/customer";

export default {
  name: "Info",
  data() {
    return {
      countryList: null,
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
      // 客户表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cstNo: null,
        cstStatus: null,
        cstNameEn: null,
        cstOtherName: null,
        companyRegisterNo: null,
        enterpriseNature: null,
        otherEnterpriseNatureDesc: null,
        localIndustrialClass: null,
        subLocalIndustrialClass: null,
        openAccountTime: null,
        registerTime: null,
        registerCountry: null,
        registerProvince: null,
        registerCity: null,
        registerArea: null,
        registerAddress: null,
        riskLevel: null,
        cstWebsite: null,
        contactName: null,
        contactEmail: null,
        contactTelephoneNo: null,
        operatorId: null,
        operatorName: null,
      },
      // 表单参数
      form: {
        id: '',
        cstNo: null,
        cstStatus: null,
        cstNameEn: null,
        cstOtherName: null,
        companyRegisterNo: null,
        enterpriseNature: null,
        otherEnterpriseNatureDesc: null,
        localIndustrialClass: null,
        subLocalIndustrialClass: null,
        openAccountTime: null,
        registerTime: null,
        registerCountry: null,
        registerProvince: null,
        registerCity: null,
        registerArea: null,
        registerAddress: null,
        riskLevel: null,
        cstWebsite: null,
        contactName: null,
        contactEmail: null,
        contactTelephoneNo: null
      },
      // 表单校验
      rules: {
        cstNo: [
          {required: true, message: "客户号不能为空", trigger: "blur"}
        ],
        cstNameEn: [
          {required: true, message: "客户英文名称不能为空", trigger: "blur"}
        ],
        companyRegisterNo: [
          {required: true, message: "公司注册号不能为空", trigger: "blur"}
        ],
        enterpriseNature: [
          {required: true, message: "企业性质不能为空", trigger: "blur"}
        ],
        localIndustrialClass: [
          {required: true, message: "当地行业种类不能为空", trigger: "blur"}
        ],
        subLocalIndustrialClass: [
          {required: true, message: "当地行业种类子类不能为空", trigger: "blur"}
        ],
        openAccountTime: [
          {required: true, message: "开户时间不能为空", trigger: "blur"}
        ],
        registerTime: [
          {required: true, message: "注册时间不能为空", trigger: "blur"}
        ],
        registerCountry: [
          {required: true, message: "企业注册国家不能为空", trigger: "blur"}
        ],
        registerAddress: [
          {required: true, message: "企业注册详细地址不能为空", trigger: "blur"}
        ],
        riskLevel: [
          {required: true, message: "风险等级不能为空", trigger: "blur"}
        ],
      }
    };
  }
  ,
  created() {
    this.commonEnums()
    this.getList();
  }
  ,
  methods: {
    /** 查询客户客户列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    }
    ,
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    }
    ,
    // 表单重置
    reset() {
      this.form = {
        id: null,
        cstNo: null,
        cstStatus: "0",
        cstNameEn: null,
        cstOtherName: null,
        companyRegisterNo: null,
        enterpriseNature: null,
        otherEnterpriseNatureDesc: null,
        localIndustrialClass: null,
        subLocalIndustrialClass: null,
        openAccountTime: null,
        registerTime: null,
        registerCountry: null,
        registerProvince: null,
        registerCity: null,
        registerArea: null,
        registerAddress: null,
        riskLevel: null,
        cstWebsite: null,
        contactName: null,
        contactEmail: null,
        contactTelephoneNo: null,
        remark: null
      };
      this.resetForm("form");
    }
    ,
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    }
    ,
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
    ,
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    }
    ,
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客户客户";
    }
    ,
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户客户";
      });
    }
    ,
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    }
    ,
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除客户编号为"' + ids + '"的数据项？').then(function () {
        return delInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    }
    ,
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/customer/export', {
        ...this.queryParams
      }, `info_${new Date().getTime()}.xlsx`)
    }
    ,
    /** 公共枚举 */
    commonEnums() {
      commonEnums().then(response => {
        this.countryList = response;
      });
    }
    ,
  }
}
;
</script>
