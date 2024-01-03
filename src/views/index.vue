<template>
	<el-scrollbar style="height:100%;">
		<el-container>
			<el-header>
				<el-button-group>
					<el-button type="primary" @click="BackHome" icon="el-icon-house">主页
						<!-- <router-link to="/UserCenter">
							主页
						</router-link> -->
					</el-button>
					<el-button type="success" @click="OpenDesignSaveModal" icon="el-icon-folder-checked">保存</el-button>
					<el-button @click="PreviewDesign" icon="el-icon-search">预览</el-button>
					<el-button type="danger" @click="ClearDesign" icon="el-icon-delete">删除</el-button>
				</el-button-group>
			</el-header>
			<el-container>
				<!-- 选择组件开始 -->
				<el-aside width="15%">
					<el-tabs value="CommonComponent">
						<el-tab-pane label="通用组件" name="CommonComponent">
							<el-scrollbar style="height:100%;">
								<el-form>
									<el-form-item>
										<el-select v-model="selected_component" placeholder="请选择组件"
											@change="load_component()">
											<el-option v-for="(item,index) in componentList" :key="index"
												:label="item.label" :value="item">
											</el-option>
										</el-select>
									</el-form-item>
								</el-form>
								<el-form v-for="(item,index) in component_types" :key="index">
									<el-form-item>
										<div class="bx-card">
											<div class="bx-card__header-left">
												<span>{{item.DisplayName}}</span>
												<el-button style="float: right;padding: 5px 5px;" type="text"
													@click="AppendComponentToDesign(item)">添加</el-button>
											</div>
											<div class="bx-card__body">
												<!-- <component :is="item.SystemName" :message="item.datas" style="height: 6.25rem;">
												</component> -->
												<el-image style="width: 12.5rem; height: 7.5rem" :src="item.Thumbnail"
													fit="contain">
												</el-image>
											</div>
										</div>
									</el-form-item>
								</el-form>
							</el-scrollbar>
						</el-tab-pane>
						<el-tab-pane label="自定义组件" name="UserComponent">配置管理</el-tab-pane>
						<el-tab-pane label="组件组" name="GroupComponent">角色管理</el-tab-pane>
					</el-tabs>
				</el-aside>
				<!-- 选择组件结束 -->
				<!-- 中间设计器开始 -->
				<el-main width="65%" tabindex="1">
					<el-scrollbar style="height:100%;">
						<div style="height: 80%;">
							<div class="sreen_form" v-if="main_isload"
								:style="'width:'+FormData.r_wight+'px;height:'+ FormData.r_height + 'px;background-image: url('+FormData.r_background+');zoom:'+ zoom/100">
								<!-- 刻度组件 -->
								<EditRuler />
								<!-- 网格组件 -->
								<EditGrid />

								<!-- 顶部位置限制 -->
								<div v-if="ToolTips" class="start-postion"
									:style="'color: #ffffff;transform: translate('+x+'px,'+y+'px)'">
									x:{{x}}-y:{{y}};width:{{width}}-height:{{height}}</div>
								<!-- 拖拽组件 -->
								<vue-draggable-resizable v-for="(item,index) in AppendedComponents" :key="item.id"
									:id="item.id" :parent="true" :snap="true" :snap-tolerance="5" :scaleRatio="zoom/100"
									@resizestop="onResize" @dragstop="onDragStop" @dragging="onDragging"
									@resizing="onResizing" @activated="onActivated(item)"
									@deactivated="hidetool(item.id)" @refLineParams="getRefLineParams"
									style="border: 0px dashed #249ed6;" @keyup.delete.native="remove(item.id)"
									@keyup.up.native="upCommponent(index)" @keyup.down.native="downComponent(index)"
									tabindex="2" class-name-active="my-active-class">
									<!-- 添加过来的子组件 -->
									<component :is="item.name" :key="item.id" :id="item.id" :ref="item.id"
										:message="item.datas" :style="'z-index:'+index">
									</component>
									<!-- 底部操作栏 -->
									<el-button-group :ref="'tool-'+item.id" style="z-index: 9999;">
										<el-button type="primary" size="mini" plain>{{item.name}}</el-button>
										<el-button type="primary" size="mini" plain @click="remove(item.id)">删除
										</el-button>
										<el-button type="primary" size="mini" plain @click="upCommponent(index)">上移
										</el-button>
										<el-button type="primary" size="mini" plain @click="downComponent(index)">下移
										</el-button>
									</el-button-group>
								</vue-draggable-resizable>
								<!--辅助线-->
								<span class="ref-line v-line" v-for="item in vLine" :key="item.id" v-show="item.display"
									:style="{ left: item.position, top: item.origin, height: item.lineLength}" />
								<span class="ref-line h-line" v-for="item in hLine" :key="item.id" v-show="item.display"
									:style="{ top: item.position, left: item.origin, width: item.lineLength}" />
								<!--辅助线END-->
							</div>
						</div>
					</el-scrollbar>

				</el-main>
				<!-- 中间结束 -->
				<!-- 右侧开始 -->
				<el-aside width="15%">
					<el-tabs value="first">
						<el-tab-pane label="组件" name="first">
							<el-scrollbar style="height:100%">
								<!-- 基础数据卡片 -->
								<div class="bx-card">
									<div class="bx-card__header">
										<span>基础数据</span>
									</div>
									<div class="bx-card__body">
										<el-form ref="form" :model="FormData" label-width="80px">
											<el-form-item label="报表尺寸">
												<el-col :span="11">
													<el-input v-model="FormData.r_wight"></el-input>
												</el-col>
												<el-col class="line" :span="2">-</el-col>
												<el-col :span="11">
													<el-input v-model="FormData.r_height"></el-input>
												</el-col>
											</el-form-item>
											<el-form-item label="背景地址">
												<el-input v-model="FormData.r_background"></el-input>
											</el-form-item>
											<el-form-item label="缩放比例">
												<el-slider :min="50" :max="200" v-model="zoom" @change="changeZoom"
													show-tooltip>
												</el-slider>
											</el-form-item>
										</el-form>
									</div>
								</div>
								<!-- 基础数据卡片结束 -->
								<!-- 分割线 -->
								<el-divider style="width: 80%;"></el-divider>
								<!-- 组件数据卡片 -->
								<div class="bx-card ">
									<div class="bx-card__header">
										<span>组件数据</span>
									</div>
									<div class="bx-card__body">
										<el-form ref="form" label-width="80px">
											<div v-for="(item,index) in ActiveComponentData" :key="index">
												<div v-if="item.type != 'Object'">
													<el-form-item :label="index">
														<!-- {{item}} -->
														<!-- 根据不同的数据类型，显示不同的组件 -->
														<!-- <el-tag v-if="item.type == 'label'">{{item.default}}</el-tag> -->
														<el-input type="textarea" autosize v-if="item.type == 'url'"
															placeholder="" v-model="item.default">
															<el-button slot="append" icon="el-icon-search"></el-button>
														</el-input>
														<!-- 显示图标选择弹窗 -->
														<div v-if="item.type=='icon'">
															<el-input placeholder="" v-model="item.default">
																<template slot="append">
																	<el-button size="mini" type="primary"
																		icon="el-icon-view"
																		@click="iconListShow(item.default,index)">icon
																	</el-button>
																</template>
															</el-input>

														</div>
														<el-input type="textarea" autosize
															v-if="item.type == 'textarea'" placeholder=""
															v-model="item.default">
														</el-input>
														<el-input v-if="item.type == 'label'" placeholder=""
															:disabled="true" v-model="item.default">
														</el-input>
														<el-input v-if="item.type == 'String'" placeholder=""
															v-model="item.default">
														</el-input>
														<el-slider v-if="item.type == 'Number'" :min="item.min"
															:max="item.max" v-model="item.default">
														</el-slider>
														<el-select v-if="item.type == 'List'" v-model="item.default">
															<el-option v-for="(items,indexs) in item.list" :key="indexs"
																:label="items" :value="items">
															</el-option>
														</el-select>
														<template v-if="item.type == 'Boolean'">
															<el-radio v-model="item.default" :label="true">正向</el-radio>
															<el-radio v-model="item.default" :label="false">反向
															</el-radio>
														</template>
														<el-color-picker v-if="item.type == 'Color'"
															v-model="item.default" show-alpha>
														</el-color-picker>
													</el-form-item>
												</div>
												<div v-if="item.type == 'Object'">
													<el-form-item v-for="(Oitem,Oindex) in item.default" :key="Oindex"
														:label="Oindex">
														<!-- 根据不同的数据类型，显示不同的组件 -->
														<!-- <label>{{Oitem}}</label> -->
														<el-input type="textarea" autosize v-if="Oitem.type == 'url'"
															placeholder="" v-model="Oitem.default">
															<el-button slot="append" icon="el-icon-search"></el-button>
														</el-input>

														<!-- <pre class="pre-style" contenteditable="true" v-if="Oitem.type == 'eg'">{{Oitem.default}}</pre>	 -->
														<el-button size="mini" type="success" v-if="Oitem.type == 'eg'"
															@click="paramsShow(Oitem.default,Oindex)">编辑</el-button>
														<el-input v-if="Oitem.type == 'String'" placeholder=""
															v-model="Oitem.default">
														</el-input>
														<el-slider v-if="Oitem.type == 'Number'" :min="Oitem.min"
															:max="Oitem.max" v-model="Oitem.default">
														</el-slider>
														<el-select v-if="Oitem.type == 'List'" v-model="Oitem.default">
															<el-option v-for="(Oitems,indexs) in Oitem.list"
																:key="indexs" :label="Oitems" :value="Oitems">
															</el-option>
														</el-select>
														<el-color-picker v-if="Oitem.type == 'Color'"
															v-model="Oitem.default" show-alpha>
														</el-color-picker>
													</el-form-item>
												</div>
											</div>
										</el-form>
										<!-- 显示参数的弹窗 -->
										<el-dialog :title="currentIndex" :visible.sync="dialogVisible" width="30%">
											<el-input placeholder="" v-model="currentParams"></el-input>
											<span slot="footer" class="dialog-footer">
												<el-button @click="dialogVisible = false">取 消</el-button>
												<el-button type="primary" @click="paramsSave">确 定</el-button>
											</span>
										</el-dialog>
										<!-- 图标列表弹窗 -->
										<el-dialog title="GIS图标833" :visible.sync="iconDialog" width="60%" class="">
											<!-- <el-input placeholder="" v-model="currentParams"></el-input> -->
											<IconList />
											<!-- <span slot="footer" class="dialog-footer">
												<el-button size="small" type="danger" @click="iconDialog = false">取 消</el-button>
												
											</span> -->
										</el-dialog>
										<!-- 保存项目时的弹窗 -->
										<el-dialog :title="project.user + '创建于' + project.date"
											:visible.sync="project_modal" width="30%" ref="saveModal">
											<el-form>
												<el-form-item label="分类">
													<!-- <el-input v-model="project.type"></el-input> -->
													<el-select v-model="project.type" placeholder="公开还是私有">
														<el-option label="公开" value="public"></el-option>
														<el-option label="私有" value="private"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="名称">
													<el-input v-model="project.name"></el-input>
												</el-form-item>

												<el-form-item label="描述信息">
													<el-input type="textarea" v-model="project.description"></el-input>
												</el-form-item>
											</el-form>
											<span slot="footer" class="dialog-footer">
												<el-button @click="project_modal = false">取 消</el-button>
												<el-button type="primary" @click="SaveDesign()">确 定</el-button>
											</span>
										</el-dialog>
									</div>
								</div>
							</el-scrollbar>
						</el-tab-pane>
						<el-tab-pane label="图层" name="second">
							<LayerManager :msg="AppendedComponents" />
						</el-tab-pane>
					</el-tabs>

				</el-aside>
				<!-- 右侧结束 -->
			</el-container>
		</el-container>
	</el-scrollbar>

</template>

<script lang="ts" setup>
	// import VueDraggableResizable from 'vue-draggable-resizable';
	import {
		Project,
		ProjectGet
	} from '../api/uniCloud.js';
	import {
		swapItems,
		getNowDT
	} from '../utils/common.js'
	export default {

		data: function() {
			return {
				ToolTips: false, //拖放位置提示框
				zoom: 67, //画布缩放比例
				zoom_size: {
					r_wight: 1920,
					r_height: 1080
				},
				dialogVisible: false, //编辑JSON数据时的弹窗
				iconDialog: false, //显示图标列表的弹窗
				currentIcon: "", //正在编辑的图标名称
				currentParams: "", //正在编辑的参数
				currentIndex: '', //正在编辑的参数名称
				//保存时的信息
				project_modal: false, //保存项目弹窗状态
				project: {
					name: '',
					user: '',
					content: '',
					data: '',
					type: '',
					description: ''
				},
				messages: '',
				//界面元素加载
				selected_component: '', //下拉列表返回的值
				component_types: '', //选中的组件包含的种类
				componentList: [{ //组件列表
						value: 'border',
						label: '边框',
						detail: ''
					},
					{
						value: 'chart',
						label: '图表',
						detail: ''
					},
					{
						value: 'layout',
						label: '布局',
						detail: ''
					}
				],
				AppendedComponents: [], //已追加到设计器的组件
				ActiveComponentData: [], //激活组件的数据，显示在右侧
				SaveData: '', //点击保存后的数据，分为页面数据和组件数据
				FormData: {
					//大屏样式
					r_wight: 1920,
					r_height: 1080,
					r_background: 'http://www.520yhc.com/bigview/static/images/default1.png',

				},
				//记录拖放组件的位置和尺寸
				width: 200,
				height: 200,
				x: 0,
				y: 0,
				//参考线数组
				vLine: [],
				hLine: [],
				revokeArray: [],
				restoreArray: '',
				revokeIndex: -1,
				main_isload: true, //用来撤销操作时重载
				//tab激活显示
				RightTabActiveName: '',
				//当前激活的图层
				currentLayer: 1
			};
		},
		created() {
			//加载组件列表
			this.load_component_list();
		},
		mounted() {
			//console.log(this)
			//模拟组合键触发函数
			var _this = this;
			document.onkeydown = function(e) {
				let key = window.event.keyCode;
				//ctrl+Z撤销功能
				if (key === 90 && event.ctrlKey) {
					// console.log('ctrl')
					_this.revoke()
				}
			};
			//console.log(document.onkeydown)

		},
		watch: {
			//缩放监听-无用
			zoom: {
				handler(newName, oldName) {
					//console.log(newName + '-' + oldName)

				},
			},
			//图标选择监听，选择新图标后加入到已激活组件数组中
			ci: {
				handler(n, o) {
					console.log(this.ActiveComponentData[this.currentIndex].default)
					this.ActiveComponentData[this.currentIndex].default = n
					this.iconDialog = false; //关闭图标预览界面
				}
			}
		},
		computed: {
			//计算属性-当前选择的图标class_name
			ci() {
				return this.$store.state.CurrentIcon
			}
		},
		methods: {
			test(e) {
				console.log(e)
			},
			//步骤添加功能
			AddStep() {
				// //debugger;
				// //深拷贝
				// var tmp = JSON.parse(JSON.stringify(this.AppendedComponents))
				// this.revokeArray.push(tmp)
				// // this.$message({
				// // 	message:this.revokeArray
				// // })
				// this.revokeIndex++
			},
			//撤销功能-ctrl+Z
			revoke() {
				// //this.AppendedComponents = []
				// //var tmpp = this.revokeArray.pop()
				// console.log(this.revokeIndex)
				// if (this.revokeIndex == 0) {
				// 	this.AppendedComponents = []
				// 	//alert('无法撤销')
				// } else{
				// 	this.main_isload = false
				// 	//隐藏上部位置显示
				// 	this.ToolTips = false
				// 	this.revokeIndex--
				// 	this.AppendedComponents = []
				// 	this.AppendedComponents = JSON.parse(JSON.stringify(this.revokeArray[this.revokeIndex]))
				// 	this.revokeArray.pop()
				// 	//this.Vue.set(this.AppendedComponents,0,this.revokeArray[this.revokeIndex])
				// 	// this.$nextTick(function(){
				// 	// 			// 加载
				// 	// 			this.main_isload= true
				// 	// 		})
				// 	//this.main_isload = true
				// }

				// console.log(this.AppendedComponents)
				// //撤销过程中，取消被撤销元素的显示状态
				// this.ToolTips = false
				// // this.$message({
				// // 	message:this.AppendedComponents
				// // })
			},
			//撤销回复-Ctrl+Y
			restore() {

			},
			//缩放比例计算
			changeZoom(zooms) {
				//console.log(zooms)
				this.zoom_size.r_wight = this.FormData.r_wight * zooms / 100
				this.zoom_size.r_height = this.FormData.r_height * zooms / 100
			},
			//图标列表显示
			iconListShow(e, f) {
				this.iconDialog = true
				this.currentIndex = f
			},
			//参数编辑显示
			paramsShow(e, f) {
				this.dialogVisible = true;
				this.currentParams = JSON.stringify(e)
				this.currentIndex = f
			},
			//参数保存
			paramsSave(e, f) {
				this.dialogVisible = false;
				console.log(this.ActiveComponentData.data.default[this.currentIndex].default)
				this.ActiveComponentData.data.default[this.currentIndex].default = JSON.parse(this.currentParams)
				console.log(this.ActiveComponentData.data.default[this.currentIndex].default)
			},
			//参考线辅助函数
			getRefLineParams(params) {
				const {
					vLine,
					hLine
				} = params
				let id = 0
				this.vLine = vLine.map(item => {
					item['id'] = ++id
					return item
				})
				this.hLine = hLine.map(item => {
					item['id'] = ++id
					return item
				})

			},
			//获取项目数据
			getdatas() {
				ProjectGet().then(res => {
					this.$message({
						message: '第一次发送'
					})
				})
			},
			//加载所有元素列表
			load_component_list() {
				var params = {
					action: 'initData',
					params: 'componentList'
				}
				ProjectGet(params).then(res => {
					console.log(res)
					this.componentList = []
					this.componentList = res.data.data.componentList
					console.log(this.componentList)
				})
			},
			//加载选中的列表的种类
			load_component() {
				// console.log(this.selected_component)
				this.component_types = this.selected_component.detail
			},
			//清空设计器
			ClearDesign() {
				this.AppendedComponents = []
			},
			//将左侧选中组件添加到中间设计器中
			AppendComponentToDesign(res) {
				// console.log(res)

				let ids = this.NewUUID()
				let _this = this
				// this.$notify({
				// 	message: ids
				// })
				res.datas.id = {
					type: "label",
					default: ids
				}
				//通过深拷贝解决数据被覆盖问题
				res.datas = JSON.parse(JSON.stringify(res.datas))
				//res.datas.content = {type:"String",default:ids}
				var data_id = {
					id: {
						type: "label",
						default: ids
					}
				}
				var main_datas = Object.assign(data_id, res.datas)

				this.AppendedComponents.push({
					name: res.SystemName,
					id: ids,
					layers: {
						id: ids,
						parent_id: this.currentLayer,
						name: res.SystemName,
						status: true
					},
					datas: main_datas,
					position: {
						x: 0,
						y: 0,
						width: 200,
						height: 200
					}
				})
				this.AddStep()
				console.log(this.AppendedComponents)
			},
			//显示工具栏
			onActivated(res) {
				console.log(res.datas)
				var c_id = res.id
				this.$refs['tool-' + c_id][0].$el.style.display = "inline-block";
				this.ActiveComponentData = res.datas
				this.ToolTips = true;
				this.AppendedComponents.forEach(item => {
					if (item.id == c_id) {
						this.x = item.position.x;
						this.y = item.position.y;
						this.width = item.position.width;
						this.height = item.position.height;
					}
				})
			},
			//隐藏工具栏
			hidetool(res) {
				//console.log('hide' + res)
				this.$refs['tool-' + res][0].$el.style.display = "none";
				this.ToolTips = false;
				// this.$message({
				// 	message:'隐藏工具栏'
				// })
			},
			//移除设计器添加的组件
			remove(res) {
				//console.log(res)
				// this.$message({
				// 	message: res
				// })
				// this.$notify({
				// 	message: res
				// })
				// console.log(this.AppendedComponents)
				this.AppendedComponents = this.AppendedComponents.filter(function(item) {
					//console.log(item.id)
					return item.id != res
				})
				//移除组件时，隐藏位置提示组件
				this.ToolTips = false;
				this.AddStep()
			},
			//层级上移
			upCommponent(index) {
				if (index === this.AppendedComponents.length - 1) {
					return
				}
				swapItems(this.AppendedComponents, index, index + 1);
				this.AddStep()
			},
			//层级下移
			downComponent(index) {
				if (index === 0) {
					return
				}
				swapItems(this.AppendedComponents, index, index - 1);
				this.AddStep()
			},
			//尺寸正在发生变化时的操作
			onResizing: function(x, y, width, height) {
				// console.log(x + "-" + y + "-" + width + "-" + height)
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
			},
			//尺寸改变结束后触发，用来更新大屏组件尺寸
			onResize: function(x, y, width, height) {
				var ids = this.$data.ActiveComponentData.id.default
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.AppendedComponents.forEach(item => {
					if (item.id == ids) {
						item.position.x = x,
							item.position.y = y,
							item.position.width = width,
							item.position.height = height
					}
				})
				// this.$notify({
				// 	message: x + "-" + y + "-" + width + "-" + height + "-" + ids
				// })
				//引入外部datav取值方式
				try {
					this.$refs[ids][0].$refs[ids].initWH()
				} catch (e) {
					console.log(e.message)
				}
				try {
					this.$refs[ids][0].onResize()
				} catch (e) {
					console.log(e.message)
				}
				//自身引入取值方式

				try {
					this.$refs[ids][0].initWH()
				} catch (e) {
					console.log(e.message)
				}

				try {
					this.$refs[ids][0].$children[0].onResize()
				} catch (e) {
					console.log(e.message)
				}

				this.AddStep()
			},
			//拖动事件
			onDragging(x, y) {

				this.x = x;
				this.y = y;

			},
			//拖动结束事件
			onDragStop(x, y) {
				var ids = this.$data.ActiveComponentData.id.default
				// console.log(x + '-' + y + '-' + ids)
				this.AppendedComponents.forEach(item => {
					if (item.id == ids) {
						item.position.x = x
						item.position.y = y
					}
				})
				this.AddStep()
				// console.log(this.AppendedComponents)
			},
			//报表预览事件
			async PreviewDesign() {
				await this.SaveDesignTemp();

				let routeData = this.$router.resolve({
					path: '/preview'
				});
				window.open(routeData.href, '_blank');
			},
			//返回主页面事件
			BackHome() {
				this.$router.push('/UserCenter')
			},
			//保存报表到本地
			SaveDesignTemp() {
				var DesignData = {
					'ComponentsData': this.AppendedComponents,
					'DesignData': this.FormData
				}
				localStorage.setItem('design', JSON.stringify(DesignData))
			},
			//打开报表保存对话框
			OpenDesignSaveModal() {
				this.project.user = localStorage.getItem('LoginUser')
				this.project.date = getNowDT()
				this.project_modal = true
			},
			//保存报表到服务器
			SaveDesign() {
				var DesignData = {
					'ComponentsData': this.AppendedComponents,
					'DesignData': this.FormData
				}
				localStorage.setItem('design', JSON.stringify(DesignData))
				this.project_modal = false
				var params = {
					action: 'project',
					params: {
						action: 'add',
						content: {
							name: this.project.name,
							created_user: this.project.user,
							created_date: this.project.date,
							description: this.project.description,
							content: DesignData,
							type: this.project.type
						}
					}
				}

				Project(params).then(res => {
					// console.log(res)
					this.$message({
						type: "success",
						message: res
					})
				})
			},
			onDrag: function(x, y) {
				this.x = x;
				this.y = y;
			},

		}
	};
</script>
<style>
	body,
	#app {
		/*设置内部填充为0，几个布局元素之间没有间距*/
		padding: 0px;
		/*外部间距也是如此设置*/
		margin: 0px;
		/*统一设置高度为100%*/
		height: 100%;
		/* background-image: url(../../static/index-back.png); */
		background-color: #181D23;
		background-repeat: no-repeat;
		background-size: 100% 100%;

	}

	/* 隐藏X轴滚动条 */
	.el-scrollbar__wrap {
		overflow-x: hidden;
	}

	.start-postion {
		position: absolute;
		left: 0;
		top: -20px;
	}

	/* 自定义下拉列表样式 */
	.el-select {
		border: none;
	}

	.el-input__inner {
		background-color: #697d907a;
		color: #F2F6FC;
	}

	/* .el-input.is-disabled .el-input__inner{
	background-color: #697d907a;
	color: #F2F6FC;
} */
	.el-form-item__label {
		color: #F2F6FC;
	}

	/* 自定义卡片样式 */
	.bx-card {
		background-color: #697d907a;
		margin-top: 20px;
		color: rgba(255, 255, 255, 0.8);
		font-size: 14px;
		border: 0px solid #9e9e9eba;
		margin: 0.3125rem;
	}

	.bx-card:hover {
		border-color: #3f87ff;
		box-shadow: 0 4px 12px rgba(0 0 0 / 50%);
	}

	.bx-card__header-left {
		line-height: 1.5rem;
		border-bottom: dashed 1px #3c404c;


	}

	.bx-card__header-left>div {
		flex-grow: 1;
	}

	.bx-card__body {
		padding: 10px 10px 10px 10px;
		height: auto;
		text-align: center;
	}

	.downs {
		touch-action: none;
		border: 10px dashed #ffffff
	}

	.pre-style {
		text-align: left;
		/* background-color: #E1E4E8; */
		box-shadow: 4px 4px 2px 0px #99999980;
	}

	.sreen_form {
		position: relative;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		/* background-color: #00557f; */
		color: #333;
		text-align: center;
		margin: auto;
		top: 1.25rem;
		left: 0.25rem
			/* height: 1080px; */

	}

	.sreen_form .center {
		margin-left: 200px;
		margin-right: 262px;
		background: #f5f5f5;
		height: 100%;
		overflow: auto;
		padding: 20px;


	}

	.sreen_form.center.content {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.el-header {
		color: #333;
		text-align: center;
		height: 5vh;
	}

	.el-card__header {
		padding: unset;
	}

	.el-main {
		/* padding: 0rem; */
		background-color: #03a9f49e;
		overflow: auto;
	}

	.el-aside {
		color: #333;
		text-align: center;
		height: 93vh;
	}

	.el-form-item {
		margin-bottom: 0.625rem !important;
	}

	.my-active-class {
		background-color: #2196f394;
	}

	.drag-tool {
		position: relative;
		background-color: #00FF00;
	}

	.el-select-dropdown__wrap {
		max-height: 50rem;
	}

	.el-dialog__body {
		background-color: #212121;
		border: solid 0.0625rem #55aaff;


	}

	.el-dialog__header {
		background-color: #03a9f49e;
		/* height: 3vh; */
		padding: 0.625rem;
	}

	.el-dialog__headerbtn {
		/* padding: 0; */
		color: red;

	}

	.el-dialog__footer {
		background-color: #63caf8;
		/* height: 5vh; */
	}

	.el-dialog-border {
		border: solid 0.0625rem #55aaff;
	}

	.el-tabs__item {
		padding: 0 20px;
		height: 40px;
		box-sizing: border-box;
		line-height: 40px;
		display: inline-block;
		list-style: none;
		font-size: 14px;
		font-weight: 500;
		color: #ffffff;
		position: relative;
	}

	.el-tabs__active-bar {
		padding-left: 2.25rem;
	}

	.el-tabs__nav {
		padding-left: 1.25rem;
	}

	/* 	.el-tabs__nav {
		float: none !important;
	} */
</style>
