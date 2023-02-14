<template>
  <el-col :span="24">
    <el-table :data="form.certificateList" :border=true style="width: 99.99%;">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="certificateNo" label="证件号" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.certificateNo" autocomplete="off" size="small"
                    placeholder="请输入证件号"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="certificateType" label="证件类型" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.certificateType" autocomplete="off" size="small" placeholder="证件类型"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="证件名称" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.certificateName" autocomplete="off" size="small"
                    placeholder="请输入证件名称"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="signCountry" label="签署国家">
        <template slot-scope="scope">
          <el-input v-model="scope.row.signCountry" autocomplete="off" size="small" placeholder="请输入签署国家"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="effectiveDate" label="证件生效日期" width="150">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.effectiveDate" type="date"
                          value-format="yyyy-MM-dd" placeholder="请输入证件生效日期" size="small"
                          class="allwidth">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="expirationDate" label="证件失效日期" width="150">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.expirationDate" type="date"
                          value-format="yyyy-MM-dd" placeholder="请输入证件失效日期" size="small"
                          class="allwidth">
          </el-date-picker>
        </template>
      </el-table-column>

      <el-table-column prop="model" label="来源" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.model" autocomplete="off" size="small" placeholder="来源"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="delmembers(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <i class="el-icon-circle-plus-outline" @click="addmembers"></i>
<!--    <el-form-item label="证件信息:" :label-width="100">

    </el-form-item>-->
  </el-col>
</template>


<script>

export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        certificateList: [],
        model: ''
      }
    }
  },
  watch: {
    data: {
      handler (val) {
        this.form = val
      },
      immediate: true
    }
  },
  methods: {
    addmembers() {
      this.form.certificateList.push(
          {
            certificateNo: '',
            certificateType: '',
            certificateName: '',
            signCountry: '',
            effectiveDate: '',
            expirationDate: '',
            model: this.form.model
          })
    },
    delmembers(index, row) {
      var that = this;
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //点击确定的操作(调用接口)
        var hasmembers = that.form.certificateList;
        for (var i = 0; i < hasmembers.length; i++) {
          if (row.id == hasmembers[i].id) {
            that.form.certificateList.splice(i, 1);
            // this.$message({ message: '删除成功', duration: 2000, type: 'success' });
          }
        }
      }).catch(() => {
        //点取消的提示
        return;
      });
    }
  }
}
</script>