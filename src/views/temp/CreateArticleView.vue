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
    <el-page-header style="background: rgba(255, 255, 255, 0.5); color: white;
    line-height: 60px; font-weight: bold" @back="goBack" content="我的主页">
    </el-page-header>
    <el-container>
      <el-container>
        <el-aside class="layout-side">
          <div class="block" style="float: right;margin-top: 60px">
            <el-avatar :size="100"
                       :src="ruleForm.avatar"/>
            <p style="color: white;text-align: center">昵称:{{ruleForm.nickname}}</p>
            <p style="color: white;text-align: center">评论量:{{ruleForm.articleCount}}</p>
          </div>
        </el-aside>
        <el-main class="layout-main">
          <p class="title">创作详情</p>
          <div style="width:600px ; height: 800px ;padding: 20px; border: 2px solid black ; border-radius: 15px">
            <el-form :model="article" :rules="rules" ref="article" class="demo-ruleForm">
              <p style="font-size: 25px;color: #13cd7c;font-weight: bold">博客类别:</p>
              <el-form-item style="margin: 10px" prop="categoryId">
                <!-- 将选择的多个角色名称对应的多个id与数组进行绑定-->
                <el-select v-model="article.categoryIds" multiple placeholder="请选择">
                  <el-option
                      v-for="item in articleCategoryListOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    <span style="font-size: 15px; font-weight: bold ; float: left">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <p style="font-size: 25px;color: #13cd7c;font-weight: bold">博客标题:</p>
              <el-form-item prop="title">
                <el-input style="margin: 10px;width: 300px"
                          type="text"
                          placeholder="请输入标题"
                          v-model="article.title"
                          maxlength="10"
                          show-word-limit
                          autocomplete="off"
                >
                </el-input>
              </el-form-item>
              <p style="font-size: 25px;color: #13cd7c;font-weight: bold">博客描述:</p>
              <el-form-item prop="description">
                <el-input style="margin: 10px;width: 400px;"
                          type="text"
                          placeholder="请输入文章描述"
                          v-model="article.description"
                          maxlength="25"
                          show-word-limit
                          autocomplete="off"
                ></el-input>
              </el-form-item>
              <p style="font-size: 25px;color: #13cd7c;font-weight: bold">博客内容:</p>
              <el-form-item prop="text">
                <el-input style="margin: 10px;width: 560px"
                          type="textarea"
                          placeholder="请输入文章内容"
                          v-model="article.text"
                          maxlength="300"
                          show-word-limit
                          autocomplete="off"
                >
                </el-input>
              </el-form-item>
              <p style="font-size: 25px;color: #13cd7c;font-weight: bold">上传图片:</p>
              <el-form-item prop="url" style="margin: 10px">
                <el-upload
                    action="http://localhost:8888/upload"
                    name="pic"
                    list-type="picture-card"
                    :on-success="handleSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
              <el-form-item style="margin: 15px;margin-left: 12px">
                <el-button type="success" @click="send('article')" >发布</el-button>
                <el-button @click="resetForm('article')">重置</el-button>
              </el-form-item>
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
        url:'',
        title:'',
        description:'',
        text:'',
        categoryIds:[],// 选择的类别数组
      },
      ruleForm:{ // 本地存储的用户名数据
        username:'',
        avatar:'',
        nickname:'',
        articleCount: '',
        id:'',
      },
      rules: {
        title: [
          {required: true, message: '标题不能为空!', trigger: 'blur'},
        ],
        description: [
          {required: true, message: '描述不能为空!', trigger: 'blur'},
        ],
        text: [
          {required: true, message: '内容不能为空!', trigger: 'blur'},
        ],
      },
      dialogImageUrl: '', // 绑定图片路径
      dialogVisible: false,
    };
  },
  methods: {
    // 加载本地的表单中的数据,存放到roleForm中去
    loadLocalRuleForm() {
      let localRuleFormString = localStorage.getItem('ruleForm');
      if (localRuleFormString) {
        let localRuleForm = JSON.parse(localRuleFormString);
        this.ruleForm.username = localRuleForm;
        console.log('username:' + localRuleForm);
      }
    },
    // 发送博客事件
    send(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:8888/articles/'+this.ruleForm.id+'/insert'
          console.log('url = ' + url);
          //将formData对象转换成FormData格式-------------------------------------数组格式
          let formData = this.qs.stringify(this.article, {arrayFormat: 'repeat'});
          console.log('formData=' + formData);
          this.axios
              .create({
                'headers': {
                  'Authorization': localStorage.getItem('jwt')
                }
              }).post(url,formData).then((response) => {//箭头函数
            let responseBody = response.data;
            console.log('responseBody = ');
            console.log(responseBody);
            if (responseBody.state == 20000) {
              this.$message({
                message: '发布成功！',
                type: 'success'
              });
              location.href="/";
            } else {
              this.$message.error(responseBody.message);
            }
          });
        }else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 加载类别下拉框列表
    loadCategoryList() {
      let url = 'http://localhost:8888/categories';
      console.log('url='+url);
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        this.articleCategoryListOptions = responseBody.data;
      })
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
          this.ruleForm = responseBody.data;
          this.ruleForm.avatar = require("../../assets/img"+this.ruleForm.avatar)
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      let url = 'http://localhost:8888/remove?url=' + file.response;
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        console.log("删除服务器图片完成!")
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {//调用后可直接接收响应过来的数据
      this.article.url = response;//将响应的"唯一文件名图片路径"添加到weibo对象中
    },
    goBack() {
      location.href="/";//主页
    },
  },
  mounted() {
    this.loadLocalRuleForm();
    this.loadUserDetail();
    this.loadCategoryList();
  }
}
</script>