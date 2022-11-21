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
  width: 560px !important;
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
    line-height: 60px; font-weight: bold" @back="goBack" content="用户详情">
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
          </div>
        </el-aside>
        <el-main class="layout-main">
          <p class="title">消息列表</p>
          <el-card shadow="hover" class="box-card" v-for="item in articleList">
            <div slot="header" class="clearfix">
              <span style="font-size: 22px">{{item.title}}</span> &nbsp<span>{{item.gmtCreate}}</span>

              <el-button style="float: right; padding: 3px 0" type="text" @click="articleDetail(user.id,item.id)">查看详情</el-button>

            </div>
            <div class="text item">
              {{item.description}}
            </div>
          </el-card>
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
      },
      articleList:[],
    };
  },
  methods: {
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
    // 加载文章列表
    loadHomeList(){
      let url = 'http://localhost:8888/articles/selectById'+location.search;
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.articleList =  responseBody.data;
          console.log(this.articleList);
        }
      })
    },
    articleDetail(userId,articleId){
       this.$router.push('/articleDetail?userId='+userId+'&articleId='+articleId+'');
    },
    goBack() {
      this.$router.push('/userDetail'+location.search);
    },
  },
  created() {
    this.loadLocalRuleForm();
    this.loadUserDetail();
    this.loadHomeList();
  },
}
</script>