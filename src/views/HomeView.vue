<style>
body {
  background-image: url("../assets/loginImg.png");
  background-size: cover; /*设置封面*/
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
  width: 660px !important;
  height: 1000px;
}

a {
  text-decoration: none;
  margin-left: 20px;
  font-size: 25px;
}
/*-----------------------------------------------*/
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  color: rgba(255, 255, 255, 0.5);
  width: 600px;
  height: 120px;
  margin-bottom: 10px;
}
.title{
  color: white;
  margin-left: 260px;
  margin-bottom: 20px;
  font-size: 30px;
  font-family: 黑体
}
/*--------------------------------------------------*/
/*悬停*/
a:hover {
  color: #322727;
}

/*点击*/
a:active {
  color: brown
}
/*--------------------------------------------------*/
</style>
<template>
  <div>
    <el-container>
      <el-header class="layout-header">
        <div class="block">
          <el-avatar :size="60"
                     :src="user.avatar"/>
          <span class="span">{{user.nickname}}欢迎回来!</span>
          <span style="float: right">
            <a href="/">主页</a>
            <a href="/userDetail">我的</a>
            <a href="/createArticle">创作</a>
            <a href="javascript:void(0)" @click="logout()">退出登录</a>
          </span>
        </div>
      </el-header>
      <el-container>
        <el-aside class="layout-side">
          <div class="block" style="float: right;margin-top: 60px">
            <el-avatar :size="100"
                       :src="user.avatar"/>
            <p style="color: white;text-align: center">昵称:{{user.nickname}}</p>
            <p style="color: white;text-align: center">评论量:{{user.articleCount}}</p>
          </div>
        </el-aside>
        <el-main class="layout-main">
          <p class="title">消息列表</p>
          <el-card shadow="hover" class="box-card" v-for="item in homeList">
            <div slot="header" class="clearfix">
              <span style="font-size: 22px">{{item.title}}</span> &nbsp<span>{{item.gmtCreate}}</span>

              <el-button style="float: right; padding: 3px 0" type="text" @click="articleDetail(item.userId,item.articleId)">查看详情</el-button>

            </div>
            <div class="text item">
              {{item.nickname}}:&nbsp{{item.description}}
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
      user:{
        username:'',
        articleCount:'',
        avatar:''
      },
      ruleForm:{
        username:'',
      },
      homeList:[
        {userId:'',articleId:'',title:'',gmtCreate:'',nickname:'',description:''}
      ],
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
    // 退出登录
    logout(){
      localStorage.removeItem('ruleForm');
      this.$router.push('/login');
    },
    // 加载用户详情信息
    loadUserDetail(){
      let url = 'http://localhost:8888/users/';
      let formData = this.qs.stringify(this.ruleForm);
      console.log('formData='+formData);
      this.axios.post(url,formData).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.user = responseBody.data;
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    articleDetail(userId,articleId){
      this.$router.push('/articleDetail?userId='+userId+'&articleId='+articleId+'');
    },
    // 加载主页列表信息
    loadHomeList(){
      let url = 'http://localhost:8888/articles/';
      this.axios.get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.homeList =  responseBody.data;
        }
      })
    }
  },
  mounted() {
    this.loadLocalRuleForm();
    this.loadUserDetail();
    this.loadHomeList();
  }
}
</script>