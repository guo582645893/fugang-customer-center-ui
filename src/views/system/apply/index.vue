<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="客户号" prop="cstNo">
        <el-input
            v-model="queryParams.cstNo"
            placeholder="请输入客户号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请状态" prop="cstStatus">
        <el-input
            v-model="queryParams.cstStatus"
            placeholder="请输入申请状态"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户英文名称" prop="cstNameEn">
        <el-input
            v-model="queryParams.cstNameEn"
            placeholder="请输入客户英文名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户其他名称" prop="cstOtherName">
        <el-input
            v-model="queryParams.cstOtherName"
            placeholder="请输入客户其他名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司注册号" prop="companyRegisterNo">
        <el-input
            v-model="queryParams.companyRegisterNo"
            placeholder="请输入公司注册号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业性质" prop="enterpriseNature">
        <el-input
            v-model="queryParams.enterpriseNature"
            placeholder="请输入企业性质"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当地行业种类" prop="localIndustrialClass">
        <el-input
            v-model="queryParams.localIndustrialClass"
            placeholder="请输入当地行业种类"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当地行业种类子类" prop="subLocalIndustrialClass">
        <el-input
            v-model="queryParams.subLocalIndustrialClass"
            placeholder="请输入当地行业种类子类"
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
      <el-form-item label="注册时间" prop="registerTime">
        <el-date-picker clearable
                        v-model="queryParams.registerTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择注册时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="企业注册国家" prop="registerCountry">
        <el-input
            v-model="queryParams.registerCountry"
            placeholder="请输入企业注册国家"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="风险等级" prop="riskLevel">
        <el-input
            v-model="queryParams.riskLevel"
            placeholder="请输入风险等级"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人邮箱" prop="contactEmail">
        <el-input
            v-model="queryParams.contactEmail"
            placeholder="请输入联系人邮箱"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人电话号码" prop="contactTelephoneNo">
        <el-input
            v-model="queryParams.contactTelephoneNo"
            placeholder="请输入联系人电话号码"
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
            v-hasPermi="['system:apply:add']"
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
            v-hasPermi="['system:apply:edit']"
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
            v-hasPermi="['system:apply:remove']"
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
            v-hasPermi="['system:apply:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="客户英文名称" align="center" prop="cstNameEn"/>
      <el-table-column label="客户其他名称" align="center" prop="cstOtherName"/>
      <el-table-column label="公司注册号" align="center" prop="companyRegisterNo"/>
      <el-table-column label="企业性质" align="center" prop="enterpriseNature"/>
      <el-table-column label="当地行业种类" align="center" prop="localIndustrialClass"/>
      <el-table-column label="当地行业种类子类" align="center" prop="subLocalIndustrialClass"/>
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
      <el-table-column label="企业注册国家" align="center" prop="registerCountry"/>
      <el-table-column label="企业注册详细地址" align="center" prop="registerAddress"/>
      <el-table-column label="风险等级" align="center" prop="riskLevel"/>
      <el-table-column label="客户网址" align="center" prop="cstWebsite"/>
      <el-table-column label="联系人英文名称" align="center" prop="contactName"/>
      <el-table-column label="联系人邮箱" align="center" prop="contactEmail"/>
      <el-table-column label="联系人电话号码" align="center" prop="contactTelephoneNo"/>
      <el-table-column label="申请状态" align="center" prop="cstStatus"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:apply:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:apply:remove']"
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

    <!-- 添加或修改客户申请对话框 -->
    <el-dialog title="客户申请" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-collapse>
          <el-collapse-item title="客户信息" name="客户信息" @click="customerHandleClick">
            <el-tabs>
              <el-tab-pane label="客户基础信息" name="first">
                <el-form-item label="客户号" prop="cstNo" v-if="form.cstNo != null">
                  <el-input v-model="form.cstNo" placeholder="请输入客户号" disabled="disabled"/>
                </el-form-item>
                <el-form-item label="客户英文名称" prop="cstNameEn">
                  <el-input v-model="form.cstNameEn" placeholder="请输入客户英文名称"/>
                </el-form-item>
                <el-form-item label="客户其他名称" prop="cstOtherName">
                  <el-input v-model="form.cstOtherName" placeholder="请输入客户其他名称"/>
                </el-form-item>
                <el-form-item label="公司注册号" prop="companyRegisterNo">
                  <el-input v-model="form.companyRegisterNo" placeholder="请输入公司注册号"/>
                </el-form-item>
                <el-form-item label="企业性质" prop="enterpriseNature">
                  <el-input v-model="form.enterpriseNature" placeholder="请输入企业性质"/>
                </el-form-item>
                <el-form-item label="当地行业种类" prop="localIndustrialClass">
                  <el-input v-model="form.localIndustrialClass" placeholder="请输入当地行业种类"/>
                </el-form-item>
                <el-form-item label="当地行业种类子类" prop="subLocalIndustrialClass">
                  <el-input v-model="form.subLocalIndustrialClass" placeholder="请输入当地行业种类子类"/>
                </el-form-item>
                <el-form-item label="注册时间" prop="registerTime">
                  <el-date-picker clearable
                                  v-model="form.registerTime"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="请选择注册时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="企业注册国家" prop="registerCountry">
                  <el-input v-model="form.registerCountry" placeholder="请输入企业注册国家"/>
                </el-form-item>
                <el-form-item label="企业注册详细地址" prop="registerAddress">
                  <el-input v-model="form.registerAddress" type="textarea" placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label="风险等级" prop="riskLevel">
                  <el-input v-model="form.riskLevel" placeholder="请输入风险等级"/>
                </el-form-item>
                <el-form-item label="客户网址" prop="cstWebsite">
                  <el-input v-model="form.cstWebsite" type="textarea" placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label="联系人英文名称" prop="contactName">
                  <el-input v-model="form.contactName" type="textarea" placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label="联系人邮箱" prop="contactEmail">
                  <el-input v-model="form.contactEmail" placeholder="请输入联系人邮箱"/>
                </el-form-item>
                <el-form-item label="联系人电话号码" prop="contactTelephoneNo">
                  <el-input v-model="form.contactTelephoneNo" placeholder="请输入联系人电话号码"/>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="证件信息" name="second" @click="customerClick('CUSTOMER')">
                <certificate :data="form"/>
              </el-tab-pane>
            </el-tabs>
          </el-collapse-item>

          <!--账户信息-->
          <el-collapse-item title="账户信息" name="账户信息">
            <el-form-item label="账户号" prop="accNo" v-if="form.accNo != null">
              <el-input v-model="form.accNo" placeholder="请输入账户号" disabled="disabled"/>
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
          </el-collapse-item>

          <!--授权签字人信息-->
          <el-collapse-item title="授权签字人信息" name="授权签字人信息" @click="signHandleClick">
            <el-tabs>
              <el-tab-pane label="授权签字人信息" name="first">
                <el-form-item label="客户号" prop="cstNo" v-if="form.cstNo != null">
                  <el-input v-model="form.cstNo" placeholder="请输入客户号" disabled="disabled"/>
                </el-form-item>
                <el-form-item label="名" prop="signFirstName">
                  <el-input v-model="form.signFirstName" placeholder="请输入名"/>
                </el-form-item>
                <el-form-item label="姓" prop="signFirstName">
                  <el-input v-model="form.signLastName" placeholder="请输入姓"/>
                </el-form-item>
                <el-form-item label="姓名" prop="signFullName">
                  <el-input v-model="form.signFullName" placeholder="请输入姓名"/>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-input v-model="form.sex" placeholder="请输入性别"/>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                  <el-date-picker clearable
                                  v-model="form.signBirthday"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="请选择生日">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="国籍" prop="signNatiionality">
                  <el-input v-model="form.signNatiionality" placeholder="请输入国籍"/>
                </el-form-item>
                <el-form-item label="职位" prop="signOccupation">
                  <el-input v-model="form.signOccupation" placeholder="请输入职位"/>
                </el-form-item>
                <el-form-item label="手机号" prop="signPhoneNumnber">
                  <el-input v-model="form.signPhoneNumnber" placeholder="请输入手机号"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="signEmail">
                  <el-input v-model="form.signEmail" placeholder="请输入邮箱"/>
                </el-form-item>
                <el-form-item label="银行卡" prop="signBankCard">
                  <el-input v-model="form.signBankCard" placeholder="请输入银行卡"/>
                </el-form-item>
                <el-form-item label="地址" prop="signAddress">
                  <el-input v-model="form.signAddress" type="textarea" placeholder="请输入内容"/>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="授权签字人证件信息" name="second" @click="signClick('SING')">
                <certificate :data="form"></certificate>
              </el-tab-pane>
            </el-tabs>
          </el-collapse-item>

          <!--UBO信息 -->
          <el-collapse-item title="UBO信息" name="UBO信息">
            <el-tabs>
              <el-tab-pane label="UBO信息" name="first">
                <el-form-item label="客户号" prop="cstNo" v-if="form.cstNo != null">
                  <el-input v-model="form.cstNo" placeholder="请输入客户号" disabled="disabled"/>
                </el-form-item>
                <el-form-item label="名" prop="firstName">
                  <el-input v-model="form.firstName" placeholder="请输入名"/>
                </el-form-item>
                <el-form-item label="姓" prop="lastName">
                  <el-input v-model="form.lastName" placeholder="请输入姓"/>
                </el-form-item>
                <el-form-item label="姓名" prop="fullName">
                  <el-input v-model="form.fullName" placeholder="请输入姓名"/>
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
                  <el-input v-model="form.natiionality" placeholder="请输入国籍"/>
                </el-form-item>
                <el-form-item label="职位" prop="occupation">
                  <el-input v-model="form.occupation" placeholder="请输入职位"/>
                </el-form-item>
                <el-form-item label="性别" prop="occupation">
                  <el-input v-model="form.uboSex" placeholder="请输入性别"/>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNumnber">
                  <el-input v-model="form.phoneNumnber" placeholder="请输入手机号"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱"/>
                </el-form-item>
                <el-form-item label="银行卡" prop="bankCard">
                  <el-input v-model="form.bankCard" placeholder="请输入银行卡"/>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                  <el-input v-model="form.address" type="textarea" placeholder="请输入内容"/>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="UBO证件信息" name="second">
                <certificate :data="form"></certificate>
              </el-tab-pane>
            </el-tabs>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listApply, getApply, delApply, addApply, updateApply} from "@/api/system/apply";
import certificate from "./certificate_common";

export default {
  name: "Apply",
  components: {
    certificate,
  },
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
      // 客户申请表格数据
      applyList: [],
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
        model: ''
      },
      // 表单校验
      rules: {
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
        accName: [
          {required: true, message: "账户名称不能为空", trigger: "blur"}
        ],
        currency: [
          {required: true, message: "币种不能为空", trigger: "blur"}
        ],
        singleLimit: [
          {required: true, message: "单笔限额不能为空", trigger: "blur"}
        ],
        dailyAccumulativeLimit: [
          {required: true, message: "日累计限额不能为空", trigger: "blur"}
        ],
        maxDayOutwardCount: [
          {required: true, message: "日最大汇出笔数不能为空", trigger: "blur"}
        ],
        maxMonthOutwardCount: [
          {required: true, message: "月最大汇出笔数不能为空", trigger: "blur"}
        ],
        firstName: [
          {required: true, message: "名不能为空", trigger: "blur"}
        ],
        lastName: [
          {required: true, message: "姓不能为空", trigger: "blur"}
        ],
        fullName: [
          {required: true, message: "姓名不能为空", trigger: "blur"}
        ],
        birthday: [
          {required: true, message: "生日不能为空", trigger: "blur"}
        ],
        natiionality: [
          {required: true, message: "国籍不能为空", trigger: "blur"}
        ],
        uboSex: [
          {required: true, message: "性别:男/女/其他不能为空", trigger: "change"}
        ],
        address: [
          {required: true, message: "地址不能为空", trigger: "blur"}
        ],
        signFirstName: [
          {required: true, message: "名不能为空", trigger: "blur"}
        ],
        signLastName: [
          {required: true, message: "姓不能为空", trigger: "blur"}
        ],
        signFullName: [
          {required: true, message: "姓名不能为空", trigger: "blur"}
        ],
        signBirthday: [
          {required: true, message: "生日不能为空", trigger: "blur"}
        ],
        signNatiionality: [
          {required: true, message: "国籍不能为空", trigger: "blur"}
        ],
        sex: [
          {required: true, message: "性别:男/女/其他不能为空", trigger: "change"}
        ],
        signAddress: [
          {required: true, message: "地址不能为空", trigger: "blur"}
        ],
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    customerHandleClick(tab, event) {
      console.log(tab, event);
      if (tab.name == 'second') {
        // 触发‘配置管理’事件
        this.form.model = 'CUSTOMER'
      }
    },
    signHandleClick(tab, event) {
      console.log(tab, event);
      if (tab.name == 'second') {
        // 触发‘配置管理’事件
        this.form.model = 'SIGN'
      }
    },
    uboHandleClick(tab, event) {
      this.form.model = 'UBO'
      console.log(tab, event);
      if (tab.name == 'second') {
        // 触发‘配置管理’事件
        this.form.model = 'UBO'
      }
    },
    /** 查询客户申请列表 */
    getList() {
      this.loading = true;
      listApply(this.queryParams).then(response => {
        this.applyList = response.rows;
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
        accName: null,
        accBizType: null,
        currency: null,
        accAlias: null,
        accProperties: null,
        accCurrencyType: null,
        singleLimit: null,
        dailyAccumulativeLimit: null,
        maxDayOutwardCount: null,
        maxMonthOutwardCount: null,
        firstName: null,
        lastName: null,
        fullName: null,
        birthday: null,
        natiionality: null,
        uboSex: null,
        state: null,
        occupation: null,
        phoneNumnber: null,
        email: null,
        bankCard: null,
        address: null,
        signFirstName: null,
        signLastName: null,
        signFullName: null,
        signBirthday: null,
        signNatiionality: null,
        sex: null,
        signOccupation: null,
        signPhoneNumnber: null,
        signEmail: null,
        signBankCard: null,
        signAddress: null,
        certificateList: []
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
      this.title = "添加客户申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getApply(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户申请";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateApply(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.open = false;
            addApply(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除客户申请编号为"' + ids + '"的数据项？').then(function () {
        return delApply(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/apply/export', {
        ...this.queryParams
      }, `apply_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
