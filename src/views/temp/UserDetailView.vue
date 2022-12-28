<style>
body {
  background-image: url("../../../public/loginImg.png");
  background-size: cover; /*设置封面*/
}

.el-descriptions__title{
  font-size: 25px;
  font-family: 黑体;
  color: white;
}

.el-descriptions{
  margin-top: 120px;
  width: 460px;
}

.el-descriptions-item__label.is-bordered-label{
  height: 70px;
}

.el-descriptions__body .el-descriptions__table .el-descriptions-item__cell{
  font-size: 15px;
  font-family: "微软雅黑 Light";
  font-weight: bold;
}

.layout-header {
  background: rgba(255, 255, 255, 0.5);
  color: #fff;
  text-align: left;
  font-size: 20px;
  line-height: 60px;
}

.span{
  position: absolute;
  left: 100px;
}

.layout-side{
  width: 730px !important;
  height: 1000px;
}

a {
  text-decoration: none;
  margin-left: 20px;
  font-size: 25px;
}

/*-----------------------------------------------*/

/*--------------------------------------------------*/
</style>
<template>
  <div>
    <el-page-header style="background: rgba(255, 255, 255, 0.5); color: white;
    line-height: 60px; font-weight: bold" @back="goBack" content="我的主页">
    </el-page-header>
    <div style="float: right;position: absolute; right: 10px;top: 12px">
      <a href="/createArticle">创作</a>
      <a href="javascript:void(0)" @click="openLogOff()">注销</a>
    </div>
    <el-container>
      <el-container>
        <el-aside class="layout-side">
          <div class="block" style="float: right;margin-top: 60px">
            <el-avatar :size="120"
                       :src="user.avatar"></el-avatar>
            <p style="color: white;font-family: 幼圆;text-align: center">昵称:{{user.nickname}}</p>
            <p style="color: white;font-family: 幼圆;text-align: center">评论量:{{user.articleCount}}</p>
            <el-button style="margin-right:20px;margin-top:10px;float: right" type="success" size="mini" @click="selectArticle()">我的文章</el-button>
          </div>
        </el-aside>
        <el-main class="layout-main">
          <el-descriptions class="margin-top" title="用户详情:" :column="1" :size="size" border>
            <template slot="extra">
              <el-button type="primary" size="mini" @click="update()">修改</el-button>
            </template>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                用户名:
              </template>
              {{user.username}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone"></i>
                昵称:
              </template>
              {{user.nickname}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-location-outline"></i>
                性别:
              </template>
              {{user.gender}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets"></i>
                年龄:
              </template>
              {{user.age}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                生日:
              </template>
              {{user.birthday}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                联系电话:
              </template>
              {{user.phone}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                电子邮箱:
              </template>
              {{user.email}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                地址:
              </template>
              {{user.address}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                个性签名:
              </template>
              {{user.sign}}
            </el-descriptions-item>
          </el-descriptions>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      size: 'medium',
      user:{
        id:'',
      },
      ruleForm:{
        username:''
      }
    };
  },
  methods: {
    // 注销时删除用户的功能
    handleLogOff(){
      let url = this.GLOBAL.blog+'users/'+this.user.id+'/logOff';
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.$message.success("注销成功!")
          this.$router.push("/login")
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    // 处理点击注销的功能
    openLogOff(){
      let message = '此操作将永久注销[' + this.user.username + ']用户, 是否继续?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleLogOff();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消注销'
        });
      });
    },
    // 查询个人文章
    selectArticle(){
      this.$router.push('/personalArticle'+location.search);
    },
    // 加载本地的表单中的数据,存放到roleForm中去
    loadLocalRuleForm(){
      let localRuleFormString = localStorage.getItem('ruleForm');
      if (localRuleFormString) {
        let localRuleForm = JSON.parse(localRuleFormString);
        this.ruleForm.username = localRuleForm;
      }
    },
    // 加载用户详情信息
    loadUserDetail(){
      let url = this.GLOBAL.blog+'users/';
      let formData = this.qs.stringify(this.ruleForm);
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).post(url,formData).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.user = responseBody.data;
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    update() {
      location.href="/userUpdate"
    },
    goBack() {
      location.href="/";//主页
    },
  },
  mounted() {
    this.loadLocalRuleForm();
    this.loadUserDetail();
  }
}
</script>