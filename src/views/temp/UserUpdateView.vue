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

.layout-side {
  width: 600px !important;
  height: 1000px;
}

a {
  text-decoration: none;
  margin-left: 20px;
  font-size: 25px;
}

/*-----------------------------------------------*/
.box-card {
  margin-left: 0 !important;
}

/*--------------------------------------------------*/
</style>
<template>
  <div>
    <el-page-header style="background: rgba(255, 255, 255, 0.5); color: white;
    line-height: 60px; font-weight: bold" @back="goBack" content="用户详情">
    </el-page-header>
    <el-container>
      <el-container>
        <el-aside class="layout-side">
          <div class="block" style="float: right;margin-top: 60px">
            <el-avatar :size="100"
                       :src="user.avatar"/>
            <p style="color: white;font-family: 幼圆;text-align: center">昵称:{{ user.nickname }}</p>
            <p style="color: white;font-family: 幼圆;text-align: center">浏览量:{{ user.articleCount }}</p>
            <el-button style="margin-right:12px;margin-top:10px;float: right" type="primary" size="mini"
                       @click="handleEdit()">修改密码
            </el-button>
          </div>
        </el-aside>
        <el-main class="layout-main">
          <p style="color: white;font-family: 方正姚体;margin-left: 250px;margin-bottom: 20px;font-size: 35px">修改信息</p>
          <el-card class="box-card" style="width: 600px;height: 1000px;margin: 0;border: 1px solid black"><!--卡片-->
            <el-form label-width="80px"> <!--Element组件中的表单-->
              <el-form-item label="用户名:">
                <el-input type="text" v-model="user.username"/>
              </el-form-item>
              <el-form-item label="昵称:">
                <el-input type="text" v-model="user.nickname"/>
              </el-form-item>
              <el-form-item label="性别:">
                <template>
                  <el-radio v-model="user.gender" label=男></el-radio>
                  <el-radio v-model="user.gender" label=女></el-radio>
                </template>
              </el-form-item>
              <el-form-item label="年龄:">
                <el-input type="text" v-model="user.age"/>
              </el-form-item>
              <el-form-item label="生日:">
                <el-date-picker
                    v-model="user.birthday"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="联系电话:">
                <el-input type="text" v-model="user.phone"/>
              </el-form-item>
              <el-form-item label="电子邮箱:">
                <el-input type="text" v-model="user.email"/>
              </el-form-item>
              <el-form-item label="地址:">
                <el-input type="text" v-model="user.address"/>
              </el-form-item>
              <el-form-item label="个性签名:">
                <el-input type="textarea" v-model="user.sign"/>
              </el-form-item>
              <el-form-item label="头像:">
                <img :src="oldAvatar" width="100px" height="100px" v-if="isShow" alt=""><!--修改前的图片,控制显示isShow-->
                <!--当上传成功后调用handleSuccess这个方法-->
                <el-upload
                    action="http://localhost:8888/upload"
                    name="pic"
                    list-type="picture-card"
                    :on-success="handleSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :before-upload="handleBeforeUpload">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
              <el-form-item>
                <el-button style="margin: 0 0 0 20px"
                           type="primary" @click="submitEdit()">开始修改
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-main>
      </el-container>
    </el-container>

    <!-- 弹出的编辑相册的对话框 -->
    <el-dialog width="30%" title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="原密码:" prop="OldPassword" :label-width="formLabelWidth">
          <el-input @blur="matches()" type="password" v-model="old.oldPassword" placeholder="请输入原密码" autocomplete="off"/>{{info}}
        </el-form-item>
        <el-form-item label="修改后的密码:" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入修改后的密码" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTrue()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 图片属性
      isShow: true,
      dialogImageUrl: '',
      dialogVisible: false,
      // 弹窗属性
      dialogFormVisible: false,
      formLabelWidth: '120px',

      // 用户对象
      user: {
        id: '',
        username: '',
        nickname: '',
        gender: '',
        age: '',
        birthday: '',
        phone: '',
        email: '',
        address: '',
        sign: '',
        articleCount: '',
        avatar: ''
      },
      oldAvatar:'',
      old:{
        oldPassword: '',
      },
      ruleForm: {
        username: '',
        password: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      rules: { // 制定规则
        password: [
          {required: true, message: '修改后的密码不能为空!', trigger: 'blur'},
          {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        ],
      },
      info:'',
    };
  },
  methods: {
    // 加载本地的表单中的数据,存放到roleForm中去
    loadLocalRuleForm() {
      let localRuleFormString = localStorage.getItem('ruleForm');
      if (localRuleFormString) {
        let localRuleForm = JSON.parse(localRuleFormString);
        this.ruleForm.username = localRuleForm;
      }
    },
    // 处理修改密码前的信息
    handleEdit() {
      this.dialogFormVisible = true;
    },
    matches(){
      let url = 'http://localhost:8888/users/'+this.user.id+'/matches';
      let formData = this.qs.stringify(this.old)
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).post(url,formData).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state==20000){
          this.info = "密码匹配";
        }else {
          this.info = responseBody.message;
        }
      })
    },
    // 处理修改密码后的信息
    submitTrue() {
      if (this.info=='密码匹配'){
        let url = 'http://localhost:8888/users/' + this.user.id + '/updateToPassword';
        console.log('url:' + url);
        let formData = this.qs.stringify(this.ruleForm);// 将修改的数据转换为formData格式
        console.log('formData=' + formData);
        this.axios
            .create({
              'headers': {
                'Authorization': localStorage.getItem('jwt')
              }
            }).post(url, formData).then((response) => {
          let responseBody = response.data;
          if (responseBody.state == 20000) {
            this.$alert('修改成功!', '操作成功', {
              confirmButtonText: '确定',
            });
            this.dialogFormVisible = false;
            this.old.oldPassword = '';
            this.ruleForm.password = '';
            // 返回详情列表
            this.loadUserDetail();
          } else {
            this.$message.error(responseBody.message);
          }
        })
      }else {
        this.$message.error("修改失败,原密码不匹配!")
      }
    },
    // 处理提交修改
    submitEdit() {
      let url = 'http://localhost:8888/users/' + this.user.id + '/update';
      console.log('url:' + url);
      // let formData = this.qs.stringify(this.user);// 将修改的数据转换为formData格式
      // console.log('formData=' + formData);
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).post(url, this.user).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.$alert('修改成功!', '操作成功', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push('/userDetail');// 返回到用户详情页面
              this.loadUserDetail();// 加载user数据
            }
          });
          // 返回详情列表
        } else {
          this.$message.error(responseBody.message);
        }
      })
    },
    // 加载修改前用户详情信息
    loadUserDetail() {
      let url = 'http://localhost:8888/users/';
      let formData = this.qs.stringify(this.ruleForm);
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).post(url, formData).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.user = responseBody.data;
          this.oldAvatar = this.user.avatar
        } else {
          this.$message.error(responseBody.message);
        }
      })
    },
    handleBeforeUpload(file){// 上传图片前删除原来的图片
      this.handleRemove(file);
    },
    handleSuccess(response, file, fileList) {//图片上传成功后接收图片的url
      //response代表服务器响应的图片路径
      this.user.avatar = response;
      this.isShow = false;//上传图片后不显示
    },
    goBack() {
      history.back();//返回上一页面
    },
    handleRemove(file, fileList) {
      this.isShow = true;//删除后设为显示
      console.log(file, fileList);
      //发出删除图片的请求
      let url = 'http://localhost:8888/remove?url=' + this.oldAvatar;
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response) => {
        this.$message.success("删除原头像成功!")
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  mounted() {
    this.loadLocalRuleForm();
    this.loadUserDetail();
  }
}
</script>