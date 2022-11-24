<style>
body {
  background-image: url("../../../public/loginImg.png");
  background-size: cover; /*设置封面*/
}

.layout-header {
  background: rgba(255, 255, 255, 0.5);
  color: #fff;
  text-align: left;
  font-size: 20px;
  line-height: 60px;
}

.span {
  position: absolute;
  left: 100px;
}

.layout-side {
  width: 620px !important;
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

.title {
  color: whitesmoke;
  margin-left: 260px;
  margin-bottom: 20px;
  font-size: 35px;
  font-family: 方正姚体
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
    <el-page-header style="background: rgba(255, 255, 255, 0.5); color: white;
    line-height: 60px; font-weight: bold" @back="goBack" content="我的主页">
    </el-page-header>
    <el-container>
      <el-container>
        <el-aside class="layout-side">
          <div class="block" style="float: right;margin-top: 60px">
            <a style="margin-right: 15px" href="javascript:void(0)" @click="nowDetail(user.id,article.id)">
              <el-avatar :size="120"
                         :src="user.avatar"/>
            </a>
            <p style="color: white;font-family: 幼圆;text-align: center;font-size: 15px">昵称:{{user.nickname}}</p>
            <p style="color: white;font-family: 幼圆;text-align: center;font-size: 15px">评论量:{{user.articleCount}}</p>
          </div>
        </el-aside>
        <el-main class="layout-main">
          <p class="title">文章详情</p>
          <div style="width:600px ; height: 800px ;padding: 40px; border: 2px solid black ; border-radius: 15px">
            <el-form v-model="article" ref="article" class="demo-ruleForm">
              <p style="font-size: 50px;font-family: 幼圆;color: #c63445;font-weight: bold">Author:{{user.nickname}}</p>
              <div style="height: 18px"></div>

              <p style="font-size: 35px;font-family: 幼圆;color: #0e6bf5;font-weight: bold">标题:      {{article.title}}</p>
              <div style="height: 18px"></div>

              <p style="font-size: 30px;font-family: 幼圆;color: #0e6bf5;font-weight: bold">描述:     {{article.description}}</p>
              <div style="height: 18px"></div>

              <p style="font-size: 25px;font-family: 幼圆;color: #0e6bf5;font-weight: bold">博客内容: {{article.text}}</p>
              <div style="height: 15px"></div>
              <p style="font-size: 25px;font-family: 幼圆;color: #0e6bf5;font-weight: bold">类别:</p>
              <el-tag style="margin: 15px 10px 15px "
                  v-for="item in category"
                  :key="item.name"
                  type="success"
                  effect="plain">
                {{ item.name }}
              </el-tag>
              <p style="font-size: 25px;font-family: 幼圆;color: #0e6bf5;font-weight: bold">图片:</p>
                <img style="width: 120px;height: 120px" :src="article.url" alt="">
              <div style="height: 18px"></div>
              <p style="font-size: 25px;font-family: 幼圆;color: #0e6bf5;font-weight: bold">评论:</p>
              <el-input style="margin: 10px;width: 300px"
                        type="text"
                        placeholder="请输入评论"
                        v-model="comment.content"
                        maxlength="50"
                        show-word-limit
                        autocomplete="off"
              >
              </el-input>
              <el-button type="success" plain size="mini" @click="send()">发送</el-button>
              <div v-for="item in commentList">
                <p style="font-size: 25px;font-family: 幼圆;color: #c10f41;font-weight: bold">
                  {{item.nickname}}:{{item.content}}
                  <span style="float: right;font-size: 18px">{{item.gmtCreate}}</span>
                </p>
              </div>
            </el-form>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      articleCategoryListOptions:[],
      article: { // 文章信息
        id:'',
        url:'',
        title:'',
        description:'',
        text:'',
        category:'',// 关联查询的类别
      },
      user:{ // 本地存储的用户名数据
        username:'',
        nickname:'',
        articleCount: '',
        id:'',
        avatar:''
      },
      category:[],
      comment:{
        username:'',
        userId:'',
        articleId:'',
        content:''
      },
      commentList:[],
    };
  },
  methods: {
    // 加载本地的表单中的数据,存放到roleForm中去
    loadLocalRuleForm(){
      let localRuleFormString = localStorage.getItem('ruleForm');
      if (localRuleFormString) {
        let localRuleForm = JSON.parse(localRuleFormString);
        this.comment.username = localRuleForm;
      }
    },
    // 点击发送评论事件
    send(){
      let formData = this.qs.stringify(this.comment);
      let url = 'http://localhost:8888/comments/insert';
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).post(url,formData).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.$message.success("评论成功!")
          this.comment.content='';// 清空评论区
          this.loadCommentList();
          this.loadUserDetail();
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    nowDetail(userId,articleId){
      location.href = '/otherDetail?userId='+userId+'&articleId='+articleId+'';
    },
    // 加载用户详情信息
    loadUserDetail(){
      //location.search: ?userId=2&articleId=5
      let sp = location.search.split("&")
      let id = sp[0].split("=")
      let uid = id[1]
      this.comment.userId = uid;
      let url = 'http://localhost:8888/users/'+uid+'/selectById';
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
    // 加载文章详情信息
    loadArticleDetail(){
      //location.search: ?userId=2&articleId=5
      let sp = location.search.split("&")
      let id = sp[1].split("=")
      let aid = id[1]
      this.comment.articleId = aid;
      let url = 'http://localhost:8888/articles/'+aid+'/selectById';
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.article = responseBody.data;
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    // 加载文章类别信息
    loadCategoryList() {
      let sp = location.search.split("&")
      let id = sp[1].split("=")
      let aid = id[1]
      let url = 'http://localhost:8888/categories/'+aid+'/listByArticleId';
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.category = responseBody.data;
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    // 加载文章评论信息
    loadCommentList(){
      //location.search: ?userId=2&articleId=5
      let sp = location.search.split("&")
      let id = sp[1].split("=")
      let aid = id[1]
      let url = 'http://localhost:8888/comments/'+aid+'/listByArticleId';
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.commentList = responseBody.data;
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
    this.loadArticleDetail();
    this.loadCategoryList();
    this.loadCommentList();
    this.loadLocalRuleForm();
  }
}
</script>