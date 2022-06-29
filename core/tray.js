/*
 * @Author: fzf404
 * @Date: 2022-05-24 22:06:34
 * @LastEditors: fzf404 nmdfzf404@163.com
 * @LastEditTime: 2022-06-20 23:32:50
 * @Description: 托盘图标
 */

import { app, Menu, Tray } from 'electron'

import { pluginList } from '../common/plugin'
import { storage } from '../common/utils/storage'
import { createWindow } from './window'

const { set, get } = storage('_config')

// 托盘全局变量
let TrayMenu

// 插件启动列表
let openPlugins = get('open', [])

// 调试模式
const isDevelopment = process.env.NODE_ENV !== 'production'

// 生产模式 & debug 不开启插件
const pluginLists = pluginList.filter(({ debug }) => !(!isDevelopment && debug))

// 全部插件菜单
const pluginMenu = pluginLists.map((item) => {
  // 调试模式开启全部插件
  return {
    label: `${item.name} - ${item.description}`,
    click: () => {
      // 创建窗口
      createWindow(item.name)
    },
  }
})

// 自启动插件菜单
const pluginOpen = pluginLists.map((item) => {
  return {
    label: `${item.name} - ${item.description}`,
    type: 'checkbox',
    checked: openPlugins.includes(item.name),
    click: () => {
      // 切换插件自启动状态
      const index = openPlugins.indexOf(item.name)
      if (index > -1) {
        openPlugins.splice(index, 1)
      } else {
        openPlugins.push(item.name)
      }
      // 保存插件自启动状态
      set('open', openPlugins)
    },
  }
})

// 初始化托盘
export const initTray = () => {
  TrayMenu = new Tray(__static + '/logo/tray.png')

  // 托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    { label: '插件列表', submenu: pluginMenu },
    { label: '插件自启', submenu: pluginOpen },
    { type: 'separator' }, // 分割线
    {
      label: '开机自启',
      click: () => {
        app.setLoginItemSettings({ openAtLogin: true })
      },
    },
    { label: '退出', click: () => app.quit() },
  ])

  TrayMenu.setContextMenu(contextMenu)
}