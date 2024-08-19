<template>
  <div
    class="noteContentViewer"
    id="noteContentViewer"
    ref="noteContentViewer"
    :style="{
      left: this.left + 'px',
      top: this.top + 'px',
      visibility: show ? 'visible' : 'hidden'
    }"
    @click.stop
    @mousedown.stop
    @mousemove.stop
    @mouseup.stop
    @wheel="handleScroll"
  ></div>
</template>

<script>
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import Editor from '@toast-ui/editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style

/**
 * @Author: 王林
 * @Date: 2021-06-24 22:53:54
 * @Desc: 节点备注内容显示
 */
export default {
  name: 'NodeNoteContentShow',
  props: {
    mindMap: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      editor: null,
      show: false,
      left: 0,
      top: 0,
      node: null
    }
  },
  created() {
    this.$bus.$on('showNoteContent', this.onShowNoteContent)
    this.$bus.$on('hideNoteContent', this.hideNoteContent)
    document.body.addEventListener('click', this.hideNoteContent)
    this.$bus.$on('node_active', this.hideNoteContent)
    this.$bus.$on('scale', this.onScale)
    this.$bus.$on('translate', this.onScale)
    this.$bus.$on('svg_mousedown', this.hideNoteContent)
    this.$bus.$on('expand_btn_click', this.hideNoteContent)
  },
  mounted() {
    this.mindMap.el.appendChild(this.$refs.noteContentViewer)
    this.initEditor()
    this.addScrollListener()
  },
  beforeDestroy() {
    this.$bus.$off('showNoteContent', this.onShowNoteContent)
    this.$bus.$off('hideNoteContent', this.hideNoteContent)
    document.body.removeEventListener('click', this.hideNoteContent)
    this.$bus.$off('node_active', this.hideNoteContent)
    this.$bus.$off('scale', this.onScale)
    this.$bus.$off('translate', this.onScale)
    this.$bus.$off('svg_mousedown', this.hideNoteContent)
    this.$bus.$off('expand_btn_click', this.hideNoteContent)
  },
  methods: {
    // 显示备注浮层
    onShowNoteContent(content, left, top, node) {
      this.node = node
      this.editor.setMarkdown(content)
      this.handleALink()
      this.updateNoteContentPosition(left, top)
      this.show = true
    },

    // 超链接新窗口打开
    handleALink() {
      const list = this.$refs.noteContentViewer.querySelectorAll('a')
      Array.from(list).forEach(a => {
        a.setAttribute('target', '_blank')
      })
    },

    // 更新位置
    updateNoteContentPosition(left, top) {
      this.left = left
      this.top = top
    },

    // 画布缩放事件
    onScale() {
      if (!this.node || !this.show) return
      const { left, top } = this.node.getNoteContentPosition()
      this.updateNoteContentPosition(left, top)
    },

    // 隐藏备注浮层
    hideNoteContent() {
      this.show = false
    },

    //  鼠标滚动/触控板滑动
    onMousewheel(e) {
      return ;

    },

    // 添加滚动监听器
    addScrollListener() {
      this.$refs.noteContentViewer.addEventListener('wheel', this.handleScroll, { passive: false });
    },

    // 移除滚动监听器
    removeScrollListener() {
      this.$refs.noteContentViewer.removeEventListener('wheel', this.handleScroll);
    },

    // 处理滚动事件
    handleScroll(event) {
      event.stopPropagation()
    },

    // 初始化编辑器
    initEditor() {
      const div = document.querySelector('#noteContentViewer')
      div.removeEventListener('wheel', null)

      if (!this.editor) {
        this.editor = Editor.factory({
          el: this.$refs.noteContentViewer,
          viewer: true,
          scrollSync: true,
          plugins: [codeSyntaxHighlight]
        })
      }
    },

  }
}
</script>

<style lang="less" scoped>
.noteContentViewer {
  position: fixed;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);

  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  &::-webkit-scrollbar-track {
    box-shadow: none;
    background: transparent;
    display: none;
  }
}
</style>
