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
  width: 1020px !important;
  height: 1000px;
}

a {
  text-decoration: none;
  margin-left: 20px;
  font-size: 25px;
}

.title{
  color: white;
  margin-left: 240px;
  margin-bottom: 20px;
  font-size: 35px;
  font-family: 方正姚体
}

/*-----------------------------------------------*/

/*--------------------------------------------------*/
</style>
<template>
  <div>
    <el-page-header style="background: rgba(255, 255, 255, 0.5); color: white;
    line-height: 60px; font-weight: bold" @back="goBack" content="返回主页">
    </el-page-header>
    <el-container>
      <el-container>
        <el-aside class="layout-side">
          <div class="block" style="float:left;margin-top: 60px;margin-left: 380px">
            <el-avatar :size="120"
                       :src="user.avatar"></el-avatar>
            <p style="color: white;font-family: 幼圆;text-align: center">昵称:{{user.nickname}}</p>
            <p style="color: white;font-family: 幼圆;text-align: center">评论量:{{user.articleCount}}</p>
          </div>
          <div style="float: right;margin-right: 20px">
          <el-descriptions class="margin-top" title="用户详情:" :column="1" :size="size" border>
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
          </div>
        </el-aside>
        <el-main class="layout-main">
          <p class="title">文章列表</p>
          <el-card shadow="hover" class="box-card" v-for="item in articleList">
            <div slot="header" class="clearfix">
              <span style="font-size: 22px">{{item.title}}</span> &nbsp<span>{{item.gmtCreate}}</span>
            </div>
            <div class="text item">
              {{user.nickname}}:&nbsp{{item.description}}
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
      articleList:[],
    };
  },
  methods: {
    // 根据id加载对应用户详情信息
    loadUserDetail(){
      //location.search: ?userId=2&articleId=5
      let sp = location.search.split("&")
      let id = sp[0].split("=")
      let uid = id[1]
      let url = this.GLOBAL.blog+'users/'+uid+'/selectById';
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.user = responseBody.data;
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    loadArticleList(){
      //location.search: ?userId=2&articleId=5
      let sp = location.search.split("&")
      let id = sp[0].split("=")
      let uid = id[1]
      let url = this.GLOBAL.blog+'articles/selectById?userId='+uid;
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.articleList = responseBody.data;
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    goBack() {
      location.href="/";//主页
    },
  },
  mounted() {
    this.loadUserDetail();
    this.loadArticleList();
  }
}
</script>