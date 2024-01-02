<template>
    <div style="width: 100%;" class="page-bg">
        <el-header  class="header-title">大屏设计系统</el-header>
        <el-header class="bdd>"></el-header>
        <el-container>
            <el-aside width="200px" style="border:1px solid red">
                <el-card></el-card>
                <!-- <el-menu default-active="1" class="el-menu-vertical-demo" mode="vertical" router>
                    <el-menu-item index="1">1</el-menu-item>
                    <el-menu-item index="2">2</el-menu-item>
                    <el-menu-item index="3">3</el-menu-item>
                    <el-menu-item index="4">4</el-menu-item>
                    <el-menu-item index="4">4</el-menu-item>
                </el-menu> -->
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-aside width="200px" class="bdd"><div>侧边栏</div></el-aside>
        </el-container>
    </div>
</template>
<script lang="ts" setup>



</script>
  
<style>
.page-bg{
    background-image: url(../assets/index-bg.png);
    height:1000px
}
.header-title{
    background-image: url(../assets/banner.png);
    background-repeat: no-repeat;
    background-size: cover;
    height: 70px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 26px;
    font-weight: bold;
    text-align: center;
    line-height: 100px;
}
el-header {
    background-color: #B3D9FF;
}

el-aside {
    background-color: #F7F7F7;
}

el-main {
    margin-left: 200px;
}
.bdd{
    border: 1px solid red;
}
</style>
  
