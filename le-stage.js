class LeStage {
  constructor() {
    // 一个初始化的场景
    this.initStageStyle()
    this.dom = this.initStage()
  }

  initStage() {
    let stage = ehtml('#stage')
    document.body.appendChild(stage)
    return stage
  }

  initStageStyle() {
    let stageStyle = document.querySelector('head>style#le-stage')
    if (!stageStyle) {
      stageStyle = ehtml('style#le-stage')
      stageStyle.textContent = `
      *{
        margin: 0;
        padding: 0;
      }
        
      html,body{
        width:100%;
        height: 100%;
      }
      
      body{
        display:flex;
        overflow:hidden;
        align-items: center;
        justify-content: center;
        background-color: hsl(234deg 100% 63%);
      }

      #stage {
        width: 70%;
        height: 70%;
        background-color:#fff;
        border: 1px solid hsl(234deg 21% 46%);
        border-radius:5px;
        box-shadow: 0 2.8px 2.2px hsl(198deg 100% 68% / 20%);
      }
      `
      document.head.appendChild(stageStyle)
    }
  }
}
