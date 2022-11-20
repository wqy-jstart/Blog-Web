<style>
body {
  background-image: url("../../assets/loginImg.png");
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
  width: 600px !important;
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
      <a href="/login">注销</a>
    </div>
    <el-container>
      <el-container>
        <el-aside class="layout-side">
          <div class="block" style="float: right;margin-top: 60px">
            <el-avatar :size="100"
                       :src="user.avatar"></el-avatar>
            <p style="color: white;text-align: center">昵称:{{user.nickname}}</p>
            <p style="color: white;text-align: center">评论量:{{user.articleCount}}</p>
            <el-button style="margin-right:12px;margin-top:10px;float: right" type="success" size="mini" @click="selectArticle()">我的文章</el-button>
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
      user:{},
      ruleForm:{
        username:''
      }
    };
  },
  methods: {
    selectArticle(){
      this.$router.push('/personalArticle'+location.search);
    },
    // 加载本地的表单中的数据,存放到roleForm中去
    loadLocalRuleForm(){
      let localRuleFormString = localStorage.getItem('ruleForm');
      if (localRuleFormString) {
        let localRuleForm = JSON.parse(localRuleFormString);
        this.ruleForm.username = localRuleForm;
        console.log(this.ruleForm.username)
      }
    },
    // 加载用户详情信息
    loadUserDetail(){
      let url = 'http://localhost:8888/users/';
      let formData = this.qs.stringify(this.ruleForm);
      console.log(formData);
      this.axios.post(url,formData).then((response)=>{
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