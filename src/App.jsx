import React, { useState, useEffect, useRef } from 'react';

// --- UTILS ---
const genId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    appTitle: "Pro PLC Simulator",
    homeDesc: "Select a project to begin. Choose Teacher mode to study complete, working logic, or Student mode to wire it up from scratch.",
    studentBtn: "🎓 Student Mode (Blank Logic)",
    teacherBtn: "👩‍🏫 Teacher Mode (Answers Given)",
    inputs: "Inputs",
    outputs: "Outputs",
    memory: "Memory",
    system: "System",
    tabIo: "1. I/O Configuration",
    tabLadder: "2. Ladder Logic Editor",
    tabProcess: "🏭 3. 2D Process Plant",
    runSystem: "RUN SYSTEM",
    stopSystem: "STOP SYSTEM",
    resetSim: "↺ Reset Simulation",
    teacherMode: "👩‍🏫 Teacher Mode",
    studentMode: "🎓 Student Mode",
    teacherLogin: "Teacher Login",
    loginDesc: "Enter password to unlock pre-built answer logic.",
    password: "Password",
    cancel: "Cancel",
    login: "Login",
    ioTagDb: "I/O Tag Database",
    ioDesc: "Define your physical inputs and outputs before programming. Click any Tag Name to rename it.",
    type: "Type",
    address: "Address",
    tagName: "Tag Name",
    addTag: "Add Tag",
    physicalPanel: "Physical Panel",
    physicalDesc: "Toggle inputs and monitor output states.",
    ladderProg: "Ladder Logic Program",
    editMode: "Edit Mode",
    running: "Running",
    addRung: "+ Add Rung",
    noRungs: "No rungs defined. Click '+ Add Rung' to begin.",
    selectTarget: "Target...",
    preset: "Preset:",
    parallelDown: "+ Parallel ↓",
    outputDown: "+ Output ↓",
    processSim: "2D Process Simulation",
    processDesc: "If using Student Mode, write the ladder logic required to control this plant!",
    bottles: "Bottles",
    conveyor: "Conveyor",
    valve: "Valve",
    motorUp: "Motor Up",
    motorDn: "Motor Dn",
    fillPump: "Fill Pump",
    drainPump: "Drain Pump",
    mixer: "Mixer",
    heater: "Heater",
    floor2: "Floor 2",
    floor1: "Floor 1",
    ground: "Ground",
    call: "Call",
    on: "ON",
    off: "OFF",
    photoEyeHelp: "Photo Eye (I:0/4) - Toggle on Left Panel",
    prox: "Prox",
    level: "Level",
    high: "High",
    low: "Low",
    loadTemplate: "Load Template",
    export: "💾 Save Logic",
    import: "📂 Load Logic",
    importSuccess: "Project loaded successfully!",
    importError: "Failed to load project. Invalid file."
  },
  zh: {
    appTitle: "Pro PLC 模拟器",
    homeDesc: "选择一个项目开始。选择“教师模式”学习完整的逻辑，或者选择“学生模式”从零开始连线。",
    studentBtn: "🎓 学生模式 (空白逻辑)",
    teacherBtn: "👩‍🏫 教师模式 (提供答案)",
    inputs: "输入",
    outputs: "输出",
    memory: "内存",
    system: "系统",
    tabIo: "1. I/O 配置",
    tabLadder: "2. 梯形图编辑器",
    tabProcess: "🏭 3. 2D 过程工厂",
    runSystem: "运行系统",
    stopSystem: "停止系统",
    resetSim: "↺ 重置模拟",
    teacherMode: "👩‍🏫 教师模式",
    studentMode: "🎓 学生模式",
    teacherLogin: "教师登录",
    loginDesc: "输入密码解锁预先构建的答案逻辑。",
    password: "密码",
    cancel: "取消",
    login: "登录",
    ioTagDb: "I/O 标签数据库",
    ioDesc: "在编程之前定义您的物理输入和输出。单击任何标签名称以重命名它。",
    type: "类型",
    address: "地址",
    tagName: "标签名称",
    addTag: "添加标签",
    physicalPanel: "物理面板",
    physicalDesc: "切换输入状态并监控输出状态。",
    ladderProg: "梯形图程序",
    editMode: "编辑模式",
    running: "运行中",
    addRung: "+ 添加逻辑行",
    noRungs: "未定义梯形图。单击“+ 添加逻辑行”开始。",
    selectTarget: "目标...",
    preset: "预设值:",
    parallelDown: "+ 并联分支 ↓",
    outputDown: "+ 并联输出 ↓",
    processSim: "2D 过程模拟",
    processDesc: "如果使用学生模式，请编写控制此工厂所需的梯形图逻辑！",
    bottles: "瓶子数量",
    conveyor: "传送带",
    valve: "灌装阀",
    motorUp: "向上电机",
    motorDn: "向下电机",
    fillPump: "进水泵",
    drainPump: "排水泵",
    mixer: "搅拌机",
    heater: "加热器",
    floor2: "2楼",
    floor1: "1楼",
    ground: "底层",
    call: "呼叫",
    on: "开",
    off: "关",
    photoEyeHelp: "光电传感器 (I:0/4) - 在左侧面板切换",
    prox: "接近",
    level: "液位",
    high: "高",
    low: "低",
    loadTemplate: "加载模板",
    export: "💾 保存逻辑",
    import: "📂 加载逻辑",
    importSuccess: "项目加载成功！",
    importError: "无法加载项目。无效文件。"
  }
};

// --- PLANT TEMPLATES ---
const PLANT_TEMPLATES = {
  sandbox: {
    name_en: "🛠️ Sandbox (Beginner)",
    name_zh: "🛠️ 沙盒 (初学者)",
    desc_en: "A blank canvas to learn basic logic gates. Wire the switches to the colored LEDs!",
    desc_zh: "一个空白画布，用于学习基本逻辑门。将开关连接到彩色LED上！",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Switch_A', tag_zh: '开关_A', mode: 'toggle' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Switch_B', tag_zh: '开关_B', mode: 'toggle' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Push_Button', tag_zh: '按钮', mode: 'momentary' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Green_LED', tag_zh: '绿灯' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Yellow_LED', tag_zh: '黄灯' },
      { id: 'out3', type: 'output', address: 'O:0/2', tag_en: 'Red_LED', tag_zh: '红灯' },
    ],
    rungs: [
      { id: 'r1', nodes: [{ id: 'n1', branches: [[{ id: 'c1', address: 'I:0/0', type: 'NO' }]] }], outputs: [{ id: 'o1', type: 'coil', address: 'O:0/0', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r2', nodes: [{ id: 'n2', branches: [[{ id: 'c2', address: 'I:0/1', type: 'NO' }]] }], outputs: [{ id: 'o2', type: 'coil', address: 'O:0/1', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r3', nodes: [{ id: 'n3', branches: [[{ id: 'c3', address: 'I:0/2', type: 'NO' }]] }], outputs: [{ id: 'o3', type: 'coil', address: 'O:0/2', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }
    ]
  },
  bottle: {
    name_en: "🍾 Bottle Filling Line",
    name_zh: "🍾 灌装生产线",
    desc_en: "Control a conveyor belt and a fill valve using proximity and level sensors.",
    desc_zh: "使用接近和液位传感器控制传送带和灌装阀。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Start_Button', tag_zh: '启动按钮', mode: 'momentary' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Stop_Button', tag_zh: '停止按钮', mode: 'momentary' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Bottle_Present_Sensor', tag_zh: '瓶子到位传感器', mode: 'auto' },
      { id: 'io4', type: 'input', address: 'I:0/3', tag_en: 'Bottle_Full_Sensor', tag_zh: '瓶子满载传感器', mode: 'auto' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Conveyor_Motor', tag_zh: '传送带电机' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Fill_Valve', tag_zh: '灌装阀' },
    ],
    rungs: [
      { id: 'r1', nodes: [{ id: 'n1', branches: [[{ id: 'c1', address: 'I:0/0', type: 'NO' }], [{ id: 'c2', address: 'O:0/0', type: 'NO' }]] }, { id: 'n2', branches: [[{ id: 'c3', address: 'I:0/1', type: 'NC' }]] }, { id: 'n3', branches: [[{ id: 'c4', address: 'I:0/2', type: 'NC' }], [{ id: 'c5', address: 'I:0/3', type: 'NO' }]] }], outputs: [{ id: 'o1', type: 'coil', address: 'O:0/0', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r2', nodes: [{ id: 'n4', branches: [[{ id: 'c6', address: 'I:0/2', type: 'NO' }]] }, { id: 'n5', branches: [[{ id: 'c7', address: 'I:0/3', type: 'NC' }]] }], outputs: [{ id: 'o2', type: 'coil', address: 'O:0/1', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }
    ]
  },
  garage: {
    name_en: "🚪 Garage Door",
    name_zh: "🚪 车库门控制",
    desc_en: "Safely open and close a door using limit switches and interlocks.",
    desc_zh: "使用限位开关和联锁装置安全地打开和关闭车库门。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Open_Button', tag_zh: '开门按钮', mode: 'momentary' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Close_Button', tag_zh: '关门按钮', mode: 'momentary' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Upper_Limit', tag_zh: '上限位', mode: 'auto' },
      { id: 'io4', type: 'input', address: 'I:0/3', tag_en: 'Lower_Limit', tag_zh: '下限位', mode: 'auto' },
      { id: 'io5', type: 'input', address: 'I:0/4', tag_en: 'Photo_Eye_Blocked', tag_zh: '光电被遮挡', mode: 'toggle' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Motor_Up', tag_zh: '电机_上' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Motor_Down', tag_zh: '电机_下' },
    ],
    rungs: [
      { id: 'r1', nodes: [{ id: 'n1', branches: [[{ id: 'c1', address: 'I:0/0', type: 'NO' }], [{ id: 'c2', address: 'O:0/0', type: 'NO' }]] }, { id: 'n2', branches: [[{ id: 'c3', address: 'I:0/2', type: 'NC' }]] }, { id: 'n3', branches: [[{ id: 'c4', address: 'O:0/1', type: 'NC' }]] }], outputs: [{ id: 'o1', type: 'coil', address: 'O:0/0', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r2', nodes: [{ id: 'n4', branches: [[{ id: 'c5', address: 'I:0/1', type: 'NO' }], [{ id: 'c6', address: 'O:0/1', type: 'NO' }]] }, { id: 'n5', branches: [[{ id: 'c7', address: 'I:0/3', type: 'NC' }]] }, { id: 'n6', branches: [[{ id: 'c8', address: 'I:0/4', type: 'NC' }]] }, { id: 'n7', branches: [[{ id: 'c9', address: 'O:0/0', type: 'NC' }]] }], outputs: [{ id: 'o2', type: 'coil', address: 'O:0/1', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }
    ]
  },
  tank: {
    name_en: "🧪 Batch Mixing Tank",
    name_zh: "🧪 批量混合罐",
    desc_en: "Fill a tank, mix and heat the contents, then drain it using level sensors.",
    desc_zh: "填充水箱，混合并加热内容物，然后使用液位传感器将其排空。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Start_Fill', tag_zh: '开始注水', mode: 'momentary' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Start_Drain', tag_zh: '开始排水', mode: 'momentary' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Low_Sensor', tag_zh: '低液位传感器', mode: 'auto' },
      { id: 'io4', type: 'input', address: 'I:0/3', tag_en: 'High_Sensor', tag_zh: '高液位传感器', mode: 'auto' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Fill_Pump', tag_zh: '进水泵' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Drain_Pump', tag_zh: '排水泵' },
      { id: 'out3', type: 'output', address: 'O:0/2', tag_en: 'Mixer', tag_zh: '搅拌机' },
      { id: 'out4', type: 'output', address: 'O:0/3', tag_en: 'Heater', tag_zh: '加热器' },
    ],
    rungs: [
      { id: 'r1', nodes: [{ id: 'n1', branches: [[{ id: 'c1', address: 'I:0/0', type: 'NO' }], [{ id: 'c2', address: 'O:0/0', type: 'NO' }]] }, { id: 'n2', branches: [[{ id: 'c3', address: 'I:0/3', type: 'NC' }]] }], outputs: [{ id: 'o1', type: 'coil', address: 'O:0/0', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r2', nodes: [{ id: 'n3', branches: [[{ id: 'c4', address: 'I:0/1', type: 'NO' }], [{ id: 'c5', address: 'O:0/1', type: 'NO' }]] }, { id: 'n4', branches: [[{ id: 'c6', address: 'I:0/2', type: 'NO' }]] }], outputs: [{ id: 'o2', type: 'coil', address: 'O:0/1', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r3', nodes: [{ id: 'n5', branches: [[{ id: 'c7', address: 'I:0/3', type: 'NO' }]] }], outputs: [{ id: 'o3', type: 'coil', address: 'O:0/2', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }, { id: 'o4', type: 'coil', address: 'O:0/3', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }
    ]
  },
  traffic: {
    name_en: "🚦 Traffic Intersection",
    name_zh: "🚦 交通路口",
    desc_en: "Use 4 cascaded timers to perfectly sequence N/S and E/W traffic lights on a 4-way crossroad.",
    desc_zh: "使用 4 个级联定时器完美控制南北和东西交通信号灯的顺序。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Enable_System', tag_zh: '启用系统', mode: 'toggle' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'NS_Green', tag_zh: '南北_绿灯' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'NS_Yellow', tag_zh: '南北_黄灯' },
      { id: 'out3', type: 'output', address: 'O:0/2', tag_en: 'NS_Red', tag_zh: '南北_红灯' },
      { id: 'out4', type: 'output', address: 'O:0/3', tag_en: 'EW_Green', tag_zh: '东西_绿灯' },
      { id: 'out5', type: 'output', address: 'O:0/4', tag_en: 'EW_Yellow', tag_zh: '东西_黄灯' },
      { id: 'out6', type: 'output', address: 'O:0/5', tag_en: 'EW_Red', tag_zh: '东西_红灯' },
      { id: 'mem1', type: 'memory', address: 'M:0/0', tag_en: 'Timer_NS_G', tag_zh: '定时器_南北绿' },
      { id: 'mem2', type: 'memory', address: 'M:0/1', tag_en: 'Timer_NS_Y', tag_zh: '定时器_南北黄' },
      { id: 'mem3', type: 'memory', address: 'M:0/2', tag_en: 'Timer_EW_G', tag_zh: '定时器_东西绿' },
      { id: 'mem4', type: 'memory', address: 'M:0/3', tag_en: 'Timer_EW_Y', tag_zh: '定时器_东西黄' }
    ],
    rungs: [
      { id: 'r1', nodes: [{ id: 'n1', branches: [[{ id: 'c1', address: 'I:0/0', type: 'NO' }]] }, { id: 'n2', branches: [[{ id: 'c2', address: 'M:0/3', type: 'NC' }]] }], outputs: [{ id: 'o1', type: 'timer', address: 'M:0/0', preset: 4, accum: 0, doneBit: false, state: false, lastState: false }] },
      { id: 'r2', nodes: [{ id: 'n3', branches: [[{ id: 'c3', address: 'M:0/0', type: 'NO' }]] }], outputs: [{ id: 'o2', type: 'timer', address: 'M:0/1', preset: 2, accum: 0, doneBit: false, state: false, lastState: false }] },
      { id: 'r3', nodes: [{ id: 'n4', branches: [[{ id: 'c4', address: 'M:0/1', type: 'NO' }]] }], outputs: [{ id: 'o3', type: 'timer', address: 'M:0/2', preset: 4, accum: 0, doneBit: false, state: false, lastState: false }] },
      { id: 'r4', nodes: [{ id: 'n5', branches: [[{ id: 'c5', address: 'M:0/2', type: 'NO' }]] }], outputs: [{ id: 'o4', type: 'timer', address: 'M:0/3', preset: 2, accum: 0, doneBit: false, state: false, lastState: false }] },
      { id: 'r5', nodes: [{ id: 'n6', branches: [[{ id: 'c6', address: 'I:0/0', type: 'NO' }]] }, { id: 'n7', branches: [[{ id: 'c7', address: 'M:0/0', type: 'NC' }]] }], outputs: [{ id: 'o5', type: 'coil', address: 'O:0/0', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r6', nodes: [{ id: 'n8', branches: [[{ id: 'c8', address: 'M:0/0', type: 'NO' }]] }, { id: 'n9', branches: [[{ id: 'c9', address: 'M:0/1', type: 'NC' }]] }], outputs: [{ id: 'o6', type: 'coil', address: 'O:0/1', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r7', nodes: [{ id: 'n10', branches: [[{ id: 'c10', address: 'M:0/1', type: 'NO' }]] }], outputs: [{ id: 'o7', type: 'coil', address: 'O:0/2', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r8', nodes: [{ id: 'n11', branches: [[{ id: 'c11', address: 'I:0/0', type: 'NO' }]] }, { id: 'n12', branches: [[{ id: 'c12', address: 'M:0/1', type: 'NC' }]] }], outputs: [{ id: 'o8', type: 'coil', address: 'O:0/5', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r9', nodes: [{ id: 'n13', branches: [[{ id: 'c13', address: 'M:0/1', type: 'NO' }]] }, { id: 'n14', branches: [[{ id: 'c14', address: 'M:0/2', type: 'NC' }]] }], outputs: [{ id: 'o9', type: 'coil', address: 'O:0/3', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r10', nodes: [{ id: 'n15', branches: [[{ id: 'c15', address: 'M:0/2', type: 'NO' }]] }, { id: 'n16', branches: [[{ id: 'c16', address: 'M:0/3', type: 'NC' }]] }], outputs: [{ id: 'o10', type: 'coil', address: 'O:0/4', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }
    ]
  },
  elevator: {
    name_en: "🛗 3-Floor Elevator",
    name_zh: "🛗 3层电梯",
    desc_en: "Build logic to latch momentary floor calls and set/reset the UP and DOWN motors correctly.",
    desc_zh: "构建逻辑来锁存瞬时楼层呼叫，并向上或向下运行电机到正确的传感器。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Call_Ground', tag_zh: '呼叫_底层', mode: 'momentary' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Call_Floor_1', tag_zh: '呼叫_1楼', mode: 'momentary' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Call_Floor_2', tag_zh: '呼叫_2楼', mode: 'momentary' },
      { id: 'io4', type: 'input', address: 'I:0/3', tag_en: 'Sensor_Ground', tag_zh: '传感器_底层', mode: 'auto' },
      { id: 'io5', type: 'input', address: 'I:0/4', tag_en: 'Sensor_Floor_1', tag_zh: '传感器_1楼', mode: 'auto' },
      { id: 'io6', type: 'input', address: 'I:0/5', tag_en: 'Sensor_Floor_2', tag_zh: '传感器_2楼', mode: 'auto' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Motor_Up', tag_zh: '电机_上' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Motor_Down', tag_zh: '电机_下' },
      { id: 'mem1', type: 'memory', address: 'M:0/0', tag_en: 'Req_G', tag_zh: '请求_底层' },
      { id: 'mem2', type: 'memory', address: 'M:0/1', tag_en: 'Req_1', tag_zh: '请求_1楼' },
      { id: 'mem3', type: 'memory', address: 'M:0/2', tag_en: 'Req_2', tag_zh: '请求_2楼' },
      { id: 'mem4', type: 'memory', address: 'M:0/3', tag_en: 'Move_Up', tag_zh: '上升_锁定' },
      { id: 'mem5', type: 'memory', address: 'M:0/4', tag_en: 'Move_Down', tag_zh: '下降_锁定' }
    ],
    rungs: [
      { id: 'r1', nodes: [{ id: 'n1', branches: [[{ id: 'c1', address: 'I:0/0', type: 'NO' }], [{ id: 'c2', address: 'M:0/0', type: 'NO' }]] }, { id: 'n2', branches: [[{ id: 'c3', address: 'I:0/3', type: 'NC' }]] }], outputs: [{ id: 'o1', type: 'coil', address: 'M:0/0', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r2', nodes: [{ id: 'n3', branches: [[{ id: 'c4', address: 'I:0/1', type: 'NO' }], [{ id: 'c5', address: 'M:0/1', type: 'NO' }]] }, { id: 'n4', branches: [[{ id: 'c6', address: 'I:0/4', type: 'NC' }]] }], outputs: [{ id: 'o2', type: 'coil', address: 'M:0/1', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r3', nodes: [{ id: 'n5', branches: [[{ id: 'c7', address: 'I:0/2', type: 'NO' }], [{ id: 'c8', address: 'M:0/2', type: 'NO' }]] }, { id: 'n6', branches: [[{ id: 'c9', address: 'I:0/5', type: 'NC' }]] }], outputs: [{ id: 'o3', type: 'coil', address: 'M:0/2', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r4', nodes: [{ id: 'n7', branches: [[{ id: 'c10', address: 'M:0/2', type: 'NO' }], [{ id: 'c11', address: 'M:0/1', type: 'NO' }, { id: 'c12', address: 'I:0/3', type: 'NO' }]] }], outputs: [{ id: 'o4', type: 'set', address: 'M:0/3', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r5', nodes: [{ id: 'n8', branches: [[{ id: 'c13', address: 'I:0/5', type: 'NO' }], [{ id: 'c14', address: 'I:0/4', type: 'NO' }, { id: 'c15', address: 'M:0/2', type: 'NC' }]] }], outputs: [{ id: 'o5', type: 'reset', address: 'M:0/3', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r6', nodes: [{ id: 'n9', branches: [[{ id: 'c16', address: 'M:0/0', type: 'NO' }], [{ id: 'c17', address: 'M:0/1', type: 'NO' }, { id: 'c18', address: 'I:0/5', type: 'NO' }]] }], outputs: [{ id: 'o6', type: 'set', address: 'M:0/4', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r7', nodes: [{ id: 'n10', branches: [[{ id: 'c19', address: 'I:0/3', type: 'NO' }], [{ id: 'c20', address: 'I:0/4', type: 'NO' }, { id: 'c21', address: 'M:0/0', type: 'NC' }]] }], outputs: [{ id: 'o7', type: 'reset', address: 'M:0/4', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r8', nodes: [{ id: 'n11', branches: [[{ id: 'c28', address: 'M:0/3', type: 'NO' }]] }, { id: 'n12', branches: [[{ id: 'c29', address: 'M:0/4', type: 'NC' }]] }], outputs: [{ id: 'o8', type: 'coil', address: 'O:0/0', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] },
      { id: 'r9', nodes: [{ id: 'n13', branches: [[{ id: 'c30', address: 'M:0/4', type: 'NO' }]] }, { id: 'n14', branches: [[{ id: 'c31', address: 'M:0/3', type: 'NC' }]] }], outputs: [{ id: 'o9', type: 'coil', address: 'O:0/1', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }
    ]
  }
};

const PLCSimulator = () => {
  const [lang, setLang] = useState('en');
  const t = (key) => TRANSLATIONS[lang][key] || key;

  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [userMode, setUserMode] = useState('student'); 
  
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState('');

  // --- STATE ---
  const [ioMap, setIoMap] = useState([]);
  const [newIO, setNewIO] = useState({ type: 'input', address: '', tag: '', mode: 'toggle' });
  const [physicalInputs, setPhysicalInputs] = useState({});
  const [rungs, setRungs] = useState([]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const latchedTags = useRef({});
  const previousScanTags = useRef({});
  const rungsRef = useRef(rungs); 
  const fileInputRef = useRef(null);

  // Process States
  const [plantState, setPlantState] = useState({
    bottle: { pos: -200, fill: 0, count: 0 },
    garage: { pos: 0 },
    tank: { level: 0 },
    elevator: { pos: 0 } 
  });

  useEffect(() => { rungsRef.current = rungs; }, [rungs]);

  const loadTemplate = (plantId, mode) => {
    setIsRunning(false);
    setSelectedPlant(plantId);
    
    // Always load the IO config map, even in student mode!
    const localizedIoMap = PLANT_TEMPLATES[plantId].ioMap.map(io => ({
      id: io.id,
      type: io.type,
      address: io.address,
      mode: io.mode || 'toggle',
      tag: lang === 'zh' ? (io.tag_zh || io.tag_en) : io.tag_en
    }));
    setIoMap(localizedIoMap);
    
    if (mode === 'teacher') {
      setRungs(JSON.parse(JSON.stringify(PLANT_TEMPLATES[plantId].rungs))); 
    } else {
      // Blank ladder logic for students
      setRungs([{ id: genId('r'), nodes: [], outputs: [{ id: genId('o'), type: 'coil', address: '', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }]);
    }
    
    setPhysicalInputs({});
    setPlantState({ bottle: { pos: -200, fill: 0, count: 0 }, garage: { pos: 0 }, tank: { level: 0 }, elevator: { pos: 0 } });
    setActiveTab('simulator');
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setPlantState({ bottle: { pos: -200, fill: 0, count: 0 }, garage: { pos: 0 }, tank: { level: 0 }, elevator: { pos: 0 } });
    setPhysicalInputs({});
    setRungs(rungs.map(r => ({ ...r, outputs: r.outputs.map(o => ({...o, state: false, accum: o.type === 'ctd' ? o.preset : 0, doneBit: false, lastState: false})) })));
    latchedTags.current = {};
  };

  const handleTeacherLogin = () => {
    if (teacherPassword === '12345678') {
      setUserMode('teacher');
      setShowTeacherLogin(false);
      setTeacherPassword('');
    } else {
      alert("Incorrect password! Hint: hehe :)");
    }
  };

  const exportLogic = () => {
    const data = JSON.stringify({ plant: selectedPlant, ioMap, rungs }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PLC_${selectedPlant}_Logic.json`;
    a.click();
  };

  const importLogic = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.plant && data.rungs && data.ioMap) {
          setIsRunning(false);
          setSelectedPlant(data.plant);
          setIoMap(data.ioMap);
          setRungs(data.rungs);
          alert(t('importSuccess'));
        } else {
          alert(t('importError'));
        }
      } catch (err) {
        alert(t('importError'));
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const isOutputOn = (address) => {
    let p = false;
    for (const r of rungsRef.current) for (const o of r.outputs) {
      if (o.address === address) {
        if (['coil', 'reset', 'difu', 'difd', 'set'].includes(o.type)) p = p || o.state;
        else p = p || o.doneBit;
      }
    }
    return p || (latchedTags.current[address] === true);
  };

  // --- ENGINE TICK ---
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTick(t => t + 1), 100); 
    return () => clearInterval(id);
  }, [isRunning]);

  // --- 2D PHYSICS ENGINE ---
  useEffect(() => {
    if (!isRunning || !selectedPlant || selectedPlant === 'sandbox') return;

    setPlantState(prev => {
      let next = { ...prev };
      
      if (selectedPlant === 'bottle') {
        let { pos, fill, count } = next.bottle;
        const motor = isOutputOn('O:0/0');
        const valve = isOutputOn('O:0/1');

        if (motor) pos += 15; // Conveyor speed
        
        // Exact sensor trigger window (Valve is at x=500. Bottle is 100px wide. Centered at pos=450)
        const isPresent = pos >= 440 && pos <= 460;
        
        if (valve && isPresent) fill += 5; // Fill speed (takes 2 seconds to reach 100)
        if (fill > 100) fill = 100;
        
        // Full sensor drops back to false as soon as the bottle rolls away!
        const isFull = (fill >= 100) && isPresent;
        
        if (pos > 1200) { pos = -200; fill = 0; count += 1; }
        next.bottle = { pos, fill, count };

        setPhysicalInputs(inputs => {
          if (inputs['I:0/2'] !== isPresent || inputs['I:0/3'] !== isFull) return { ...inputs, 'I:0/2': isPresent, 'I:0/3': isFull };
          return inputs;
        });
      }

      if (selectedPlant === 'garage') {
        let { pos } = next.garage;
        const motorUp = isOutputOn('O:0/0');
        const motorDn = isOutputOn('O:0/1');
        const photoEye = physicalInputs['I:0/4'] || false;

        if (motorUp && !motorDn && pos < 100) pos += 2;
        if (motorDn && !motorUp && pos > 0 && !photoEye) pos -= 2;
        if (pos > 100) pos = 100;
        if (pos < 0) pos = 0;
        next.garage = { pos };

        setPhysicalInputs(inputs => {
          const upLim = pos >= 100;
          const dnLim = pos <= 0;
          if (inputs['I:0/2'] !== upLim || inputs['I:0/3'] !== dnLim) return { ...inputs, 'I:0/2': upLim, 'I:0/3': dnLim };
          return inputs;
        });
      }

      if (selectedPlant === 'tank') {
        let { level } = next.tank;
        if (isOutputOn('O:0/0')) level += 1.5;
        if (isOutputOn('O:0/1')) level -= 1.5; 
        if (level > 100) level = 100;
        if (level < 0) level = 0;
        next.tank = { level };

        setPhysicalInputs(inputs => {
          const lowSens = level <= 5;
          const highSens = level >= 95;
          if (inputs['I:0/2'] !== lowSens || inputs['I:0/3'] !== highSens) return { ...inputs, 'I:0/2': lowSens, 'I:0/3': highSens };
          return inputs;
        });
      }

      if (selectedPlant === 'elevator') {
        let { pos } = next.elevator;
        if (isOutputOn('O:0/0')) pos += 1.0; 
        if (isOutputOn('O:0/1')) pos -= 1.0; 
        
        pos = Math.round(pos * 10) / 10;
        
        if (pos > 100) pos = 100;
        if (pos < 0) pos = 0;
        next.elevator = { pos };

        setPhysicalInputs(inputs => {
          const sensG = pos === 0;
          const sens1 = pos === 50;
          const sens2 = pos === 100;
          if (inputs['I:0/3'] !== sensG || inputs['I:0/4'] !== sens1 || inputs['I:0/5'] !== sens2) {
            return { ...inputs, 'I:0/3': sensG, 'I:0/4': sens1, 'I:0/5': sens2 };
          }
          return inputs;
        });
      }

      return next;
    });
  }, [tick, isRunning, selectedPlant, physicalInputs]);

  // --- LADDER LOGIC ENGINE ---
  useEffect(() => {
    if (!isRunning) {
      latchedTags.current = {};
      previousScanTags.current = {};
      return;
    }

    setRungs(prevRungs => {
      const nextRungs = prevRungs.map(r => ({ ...r, nodes: r.nodes.map(n => ({ ...n, branches: n.branches.map(b => b.map(c => ({ ...c }))) })), outputs: r.outputs.map(o => ({ ...o })) }));
      let changed = false;
      const resets = new Set();

      const getContactPower = (contact) => {
        const ioDef = ioMap.find(io => io.address === contact.address);
        let p = false;
        if (ioDef?.type === 'input') p = physicalInputs[contact.address] || false;
        else if (ioDef?.type === 'output' || ioDef?.type === 'memory') {
          for (const r of nextRungs) for (const o of r.outputs) {
            if (o.address === contact.address) {
              if (['coil','reset','difu','difd','set'].includes(o.type)) p = p || o.state;
              else p = p || o.doneBit;
            }
          }
          p = p || (latchedTags.current[contact.address] === true);
        } else if (ioDef?.type === 'system' || contact.address.startsWith('S:')) {
           if (contact.address === 'S:1Hz') p = Math.floor(Date.now() / 500) % 2 === 0;
           else if (contact.address === 'S:2Hz') p = Math.floor(Date.now() / 250) % 2 === 0;
        }

        const prevPower = previousScanTags.current[contact.address] || false;
        if (contact.type === 'NO') return p;
        if (contact.type === 'NC') return !p;
        if (contact.type === 'P') return p && !prevPower;
        if (contact.type === 'N') return !p && prevPower;
        return false;
      };

      for (let i = 0; i < nextRungs.length; i++) {
        const rung = nextRungs[i];
        let isRungTrue = true;
        if (rung.nodes && rung.nodes.length > 0) {
          for (const node of rung.nodes) {
            let isNodeTrue = false;
            for (const branch of node.branches) {
              let isBranchTrue = true;
              for (const contact of branch) {
                if (!getContactPower(contact)) { isBranchTrue = false; break; }
              }
              if (isBranchTrue || branch.length === 0) { isNodeTrue = true; break; }
            }
            if (!isNodeTrue) { isRungTrue = false; break; }
          }
        } else { isRungTrue = false; }

        for (let j = 0; j < rung.outputs.length; j++) {
          let out = rung.outputs[j];
          let newAccum = out.accum || 0;
          let newDoneBit = out.doneBit || false;
          let newState = out.state || false;

          // TIMERS: Fix to +0.1 per 100ms tick to ensure realistic speed!
          if (out.type === 'timer') {
            if (isRungTrue) {
              newAccum = Math.round((newAccum + 0.1) * 10) / 10;
              if (newAccum >= out.preset) { newAccum = out.preset; newDoneBit = true; }
            } else { newAccum = 0; newDoneBit = false; }
            newState = isRungTrue;
          } else if (out.type === 'tof') {
            if (isRungTrue) { newAccum = 0; newDoneBit = true; newState = true; } 
            else { newState = false; if (newDoneBit) { newAccum = Math.round((newAccum + 0.1) * 10) / 10; if (newAccum >= out.preset) { newAccum = out.preset; newDoneBit = false; } } }
          } else if (out.type === 'rto') {
            if (isRungTrue) { if (newAccum < out.preset) newAccum = Math.round((newAccum + 0.1) * 10) / 10; if (newAccum >= out.preset) newDoneBit = true; }
            newState = isRungTrue;
          } else if (out.type === 'counter') {
            if (isRungTrue && !out.lastState) newAccum += 1;
            if (newAccum >= out.preset) newDoneBit = true;
            newState = isRungTrue;
          } else if (out.type === 'ctd') {
            if (isRungTrue && !out.lastState) newAccum -= 1;
            if (newAccum <= 0) newDoneBit = true;
            newState = isRungTrue;
          } else if (out.type === 'difu') { newState = isRungTrue && !out.lastState;
          } else if (out.type === 'difd') { newState = !isRungTrue && out.lastState;
          } else if (out.type === 'set') { newState = isRungTrue; if (isRungTrue && out.address) latchedTags.current[out.address] = true;
          } else if (out.type === 'reset') { newState = isRungTrue; if (isRungTrue && out.address) { latchedTags.current[out.address] = false; resets.add(out.address); }
          } else { newState = isRungTrue; newDoneBit = isRungTrue; }

          if (out.state !== newState || out.accum !== newAccum || out.doneBit !== newDoneBit || out.lastState !== isRungTrue) {
            out.state = newState; out.accum = newAccum; out.doneBit = newDoneBit; out.lastState = isRungTrue; changed = true;
          }
        }
      }

      if (resets.size > 0) {
        for (let i = 0; i < nextRungs.length; i++) {
          for (let j = 0; j < nextRungs[i].outputs.length; j++) {
            let out = nextRungs[i].outputs[j];
            if (resets.has(out.address) && ['timer','tof','rto','counter','ctd'].includes(out.type)) {
              const resetValue = out.type === 'ctd' ? out.preset : 0;
              if (out.accum !== resetValue || out.doneBit !== false) { out.accum = resetValue; out.doneBit = false; changed = true; }
            }
          }
        }
      }

      const newPrevTags = {};
      const allAddressesToTrack = new Set(ioMap.map(io => io.address));
      allAddressesToTrack.add('S:1Hz');
      allAddressesToTrack.add('S:2Hz');
      
      Array.from(allAddressesToTrack).forEach(address => {
        let p = false;
        const io = ioMap.find(i => i.address === address);
        
        if (io?.type === 'input') p = physicalInputs[address] || false;
        else if (io?.type === 'output' || io?.type === 'memory' || (!io && !address.startsWith('S:'))) {
          for (const r of nextRungs) for (const o of r.outputs) {
            if (o.address === address) {
              if (['coil', 'reset', 'difu', 'difd', 'set'].includes(o.type)) p = p || o.state; else p = p || o.doneBit;
            }
          }
          p = p || (latchedTags.current[address] === true);
        } else if (io?.type === 'system' || address.startsWith('S:')) {
          if (address === 'S:1Hz') p = Math.floor(Date.now() / 500) % 2 === 0; else if (address === 'S:2Hz') p = Math.floor(Date.now() / 250) % 2 === 0;
        }
        newPrevTags[address] = p;
      });
      previousScanTags.current = newPrevTags;

      return changed ? nextRungs : prevRungs;
    });
  }, [physicalInputs, ioMap, isRunning, tick]);

  // --- HANDLERS ---
  const handleAddIO = (e) => {
    e.preventDefault();
    if (!newIO.address || !newIO.tag) return;
    if (ioMap.some(io => io.address === newIO.address)) return alert("Address already exists!");
    setIoMap([...ioMap, { id: genId('io'), ...newIO }]);
    if (newIO.type === 'input') setPhysicalInputs(prev => ({ ...prev, [newIO.address]: false }));
    setNewIO({ type: 'input', address: '', tag: '', mode: 'toggle' });
  };
  const removeIO = (idToRemove, address) => {
    setIoMap(ioMap.filter(io => io.id !== idToRemove));
    const newPhysical = { ...physicalInputs }; delete newPhysical[address]; setPhysicalInputs(newPhysical);
  };
  const renameIO = (idToRename, newTag) => setIoMap(ioMap.map(io => io.id === idToRename ? { ...io, tag: newTag } : io));
  const updateIOMode = (idToUpdate, newMode) => setIoMap(ioMap.map(io => io.id === idToUpdate ? { ...io, mode: newMode } : io));
  
  const togglePhysicalInput = (address) => setPhysicalInputs(prev => ({ ...prev, [address]: !prev[address] }));
  
  const triggerMomentaryInput = (address) => {
    setPhysicalInputs(prev => ({ ...prev, [address]: true }));
    setTimeout(() => {
      setPhysicalInputs(prev => ({ ...prev, [address]: false }));
    }, 300);
  };

  const addRung = () => setRungs([...rungs, { id: genId('r'), nodes: [], outputs: [{ id: genId('o'), type: 'coil', address: '', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }]);
  const removeRung = (rungId) => setRungs(rungs.filter(r => r.id !== rungId));
  const addNode = (rungId) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, nodes: [...rung.nodes, { id: genId('n'), branches: [[{ id: genId('c'), address: '', type: 'NO' }]] }] } : rung));
  const addParallelBranch = (rungId, nodeId) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, nodes: rung.nodes.map(n => n.id === nodeId ? { ...n, branches: [...n.branches, [{ id: genId('c'), address: '', type: 'NO' }]] } : n) } : rung));
  const addContactToBranch = (rungId, nodeId, branchIdx) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, nodes: rung.nodes.map(n => n.id === nodeId ? { ...n, branches: n.branches.map((b, i) => i === branchIdx ? [...b, { id: genId('c'), address: '', type: 'NO' }] : b) } : n) } : rung));
  const updateContact = (rungId, nodeId, branchIdx, contactId, field, value) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, nodes: rung.nodes.map(n => n.id === nodeId ? { ...n, branches: n.branches.map((b, i) => i === branchIdx ? b.map(c => c.id === contactId ? { ...c, [field]: value } : c) : b) } : n) } : rung));
  const removeContact = (rungId, nodeId, branchIdx, contactId) => setRungs(rungs.map(rung => {
    if (rung.id !== rungId) return rung;
    let updatedNodes = rung.nodes.map(n => {
      if (n.id !== nodeId) return n;
      const newBranches = n.branches.map((b, i) => i === branchIdx ? b.filter(c => c.id !== contactId) : b);
      return { ...n, branches: newBranches.filter(b => b.length > 0) };
    });
    return { ...rung, nodes: updatedNodes.filter(n => n.branches.length > 0) };
  }));
  const removeBranch = (rungId, nodeId, branchIdx) => setRungs(rungs.map(rung => {
    if (rung.id !== rungId) return rung;
    const newNodes = rung.nodes.map(n => n.id === nodeId ? { ...n, branches: n.branches.filter((_, i) => i !== branchIdx) } : n).filter(n => n.branches.length > 0);
    return { ...rung, nodes: newNodes };
  }));
  const addOutput = (rungId) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, outputs: [...rung.outputs, { id: genId('o'), type: 'coil', address: '', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] } : rung));
  const removeOutput = (rungId, outputId) => setRungs(rungs.map(rung => {
    if (rung.id !== rungId || rung.outputs.length <= 1) return rung;
    return { ...rung, outputs: rung.outputs.filter(o => o.id !== outputId) };
  }));
  const updateOutputField = (rungId, outputId, field, value) => setRungs(rungs.map(rung => rung.id === rungId ? {
    ...rung, outputs: rung.outputs.map(o => {
      if (o.id !== outputId) return o;
      const updated = { ...o, [field]: value };
      if (field === 'type' && value === 'ctd') updated.accum = updated.preset;
      else if (field === 'type' && value !== 'ctd') updated.accum = 0;
      if (field === 'preset' && updated.type === 'ctd' && !isRunning) updated.accum = value;
      return updated;
    })
  } : rung));
  const resetCounter = (rungId, outputId) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, outputs: rung.outputs.map(o => o.id === outputId ? { ...o, accum: o.type === 'ctd' ? o.preset : 0, doneBit: false } : o) } : rung));

  const inputsList = ioMap.filter(io => io.type === 'input');
  const outputsList = ioMap.filter(io => io.type === 'output');
  const memoryList = ioMap.filter(io => io.type === 'memory');
  const systemList = ioMap.filter(io => io.type === 'system');

  // --- PERFECT SVG CONTACT RENDERER ---
  const renderContactIcon = (type) => {
    return (
      <svg viewBox="0 0 40 24" className="w-full h-full stroke-slate-800 stroke-[3px] fill-none overflow-visible group-hover/contact:stroke-blue-500">
        <line x1="0" y1="12" x2="14" y2="12" />
        <line x1="14" y1="4" x2="14" y2="20" />
        <line x1="26" y1="4" x2="26" y2="20" />
        <line x1="26" y1="12" x2="40" y2="12" />
        {type === 'NC' && <line x1="10" y1="22" x2="30" y2="2" />}
        {type === 'P' && <text x="20" y="17" className="text-[12px] font-bold fill-slate-800 stroke-none font-sans" textAnchor="middle">P</text>}
        {type === 'N' && <text x="20" y="17" className="text-[12px] font-bold fill-slate-800 stroke-none font-sans" textAnchor="middle">N</text>}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative">
      
      {/* LANGUAGE TOGGLE */}
      <div className="absolute top-4 right-8 z-50 flex gap-2">
         <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
            🌐 {lang === 'en' ? '中文' : 'English'}
         </button>
      </div>

      {/* TEACHER LOGIN MODAL */}
      {showTeacherLogin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
            <h3 className="text-2xl font-bold mb-2 text-slate-800">{t('teacherLogin')}</h3>
            <p className="text-sm text-slate-500 mb-6">{t('loginDesc')}</p>
            <input 
              type="password" 
              value={teacherPassword} 
              onChange={e => setTeacherPassword(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleTeacherLogin()}
              className="w-full p-3 border border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none mb-6 text-center tracking-widest text-lg" 
              placeholder={t('password')}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => {setShowTeacherLogin(false); setTeacherPassword('');}} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 transition-colors">{t('cancel')}</button>
              <button onClick={handleTeacherLogin} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-sm">{t('login')}</button>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN FILE INPUT FOR IMPORT */}
      <input type="file" ref={fileInputRef} onChange={importLogic} accept=".json" style={{ display: 'none' }} />

      {/* HEADER NAV */}
      {activeTab !== 'home' && (
        <header className="bg-white border-b border-slate-200 px-8 pt-6 pb-0 shadow-sm flex justify-between items-end shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-4">
              <button onClick={() => setActiveTab('home')} className="text-slate-400 hover:text-blue-600 transition-colors">←</button>
              {lang === 'en' ? PLANT_TEMPLATES[selectedPlant]?.name_en : PLANT_TEMPLATES[selectedPlant]?.name_zh}
            </h1>
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('io_setup')} className={`px-5 py-3 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'io_setup' ? 'bg-slate-100 border-t border-l border-r border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>{t('tabIo')}</button>
              <button onClick={() => setActiveTab('simulator')} className={`px-5 py-3 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'simulator' ? 'bg-slate-100 border-t border-l border-r border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>{t('tabLadder')}</button>
              <button onClick={() => setActiveTab('process')} className={`px-5 py-3 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'process' ? 'bg-slate-800 text-white shadow-inner' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>{t('tabProcess')}</button>
            </div>
          </div>
          <div className="mb-3 flex items-center gap-4 pt-8">
            <div className={`text-xs font-bold tracking-widest px-3 py-1.5 rounded border ${userMode === 'teacher' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
              {userMode === 'teacher' ? t('teacherMode') : t('studentMode')}
            </div>
            <button onClick={resetSimulation} className="px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm border border-slate-300">
              {t('resetSim')}
            </button>
            <button onClick={() => setIsRunning(!isRunning)} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-3 shadow-sm ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-red-200 animate-pulse' : 'bg-green-200'}`}></div>
              {isRunning ? t('stopSystem') : t('runSystem')}
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto">
        
        {/* --- TAB 0: HOME / PROJECT SELECTOR --- */}
        {activeTab === 'home' && (
          <div className="max-w-5xl mx-auto py-16 px-8 relative">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">{t('appTitle')}</h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t('homeDesc')}</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-slate-200 p-1.5 rounded-xl flex shadow-inner">
                <button onClick={() => setUserMode('student')} className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${userMode === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {t('studentBtn')}
                </button>
                <button onClick={() => userMode !== 'teacher' && setShowTeacherLogin(true)} className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${userMode === 'teacher' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {t('teacherBtn')}
                </button>
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(PLANT_TEMPLATES).map(([key, template]) => (
                <div key={key} onClick={() => loadTemplate(key, userMode)} className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{lang === 'en' ? template.name_en : template.name_zh}</h3>
                  <p className="text-sm text-slate-500 flex-1">{lang === 'en' ? template.desc_en : template.desc_zh}</p>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>{template.ioMap.filter(i=>i.type==='input').length} {t('inputs')}</span>
                    <span>{template.ioMap.filter(i=>i.type==='output').length} {t('outputs')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 1: I/O CONFIGURATION --- */}
        {activeTab === 'io_setup' && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 my-8">
            <h2 className="text-2xl font-bold mb-2">{t('ioTagDb')}</h2>
            <p className="text-slate-500 mb-8">{t('ioDesc')}</p>
            <form onSubmit={handleAddIO} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8 flex-wrap">
              <div className="flex-1 min-w-[120px]"><label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t('type')}</label><select value={newIO.type} onChange={e => setNewIO({...newIO, type: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"><option value="input">{t('inputs')}</option><option value="output">{t('outputs')}</option><option value="memory">{t('memory')}</option></select></div>
              {newIO.type === 'input' && (
                <div className="flex-1 min-w-[140px]"><label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Behavior</label><select value={newIO.mode || 'toggle'} onChange={e => setNewIO({...newIO, mode: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"><option value="toggle">Toggle Switch</option><option value="momentary">Push Button</option><option value="auto">Auto Sensor</option></select></div>
              )}
              <div className="flex-1 min-w-[120px]"><label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t('address')}</label><input type="text" placeholder="e.g. I:0/0 or M:0/0" required value={newIO.address} onChange={e => setNewIO({...newIO, address: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"/></div>
              <div className="flex-1 min-w-[120px]"><label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t('tagName')}</label><input type="text" placeholder="e.g. Start_Button" required value={newIO.tag} onChange={e => setNewIO({...newIO, tag: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"/></div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors whitespace-nowrap mb-0.5">{t('addTag')}</button>
            </form>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-700 mb-3 border-b pb-2">{t('inputs')}</h3>
                <div className="space-y-2">{inputsList.map(io => (
                  <div key={io.id} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded shadow-sm">
                    <div className="flex flex-col gap-1 w-full mr-2">
                      <div className="flex items-center">
                        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded mr-2">{io.address}</span>
                        <input type="text" value={io.tag} onChange={(e) => renameIO(io.id, e.target.value)} className="font-medium text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-full truncate" />
                      </div>
                      <select value={io.mode || 'toggle'} onChange={(e) => updateIOMode(io.id, e.target.value)} className="text-[10px] bg-slate-50 border border-slate-200 rounded p-1 text-slate-500 outline-none w-32 cursor-pointer">
                        <option value="toggle">Toggle Switch</option>
                        <option value="momentary">Push Button</option>
                        <option value="auto">Auto Sensor</option>
                      </select>
                    </div>
                    <button onClick={() => removeIO(io.id, io.address)} className="text-red-400 hover:text-red-700 font-bold px-2">&times;</button>
                  </div>
                ))}</div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-700 mb-3 border-b pb-2">{t('outputs')}</h3>
                <div className="space-y-2">{outputsList.map(io => (<div key={io.id} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded shadow-sm"><div><span className="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded mr-2">{io.address}</span><input type="text" value={io.tag} onChange={(e) => renameIO(io.id, e.target.value)} className="font-medium text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-24 truncate" /></div><button onClick={() => removeIO(io.id, io.address)} className="text-red-400 hover:text-red-700 font-bold px-2">&times;</button></div>))}</div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-700 mb-3 border-b pb-2">{t('memory')} / {t('system')}</h3>
                <div className="space-y-2">
                  {memoryList.map(io => (<div key={io.id} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded shadow-sm"><div><span className="font-mono text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded mr-2">{io.address}</span><input type="text" value={io.tag} onChange={(e) => renameIO(io.id, e.target.value)} className="font-medium text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-24 truncate" /></div><button onClick={() => removeIO(io.id, io.address)} className="text-red-400 hover:text-red-700 font-bold px-2">&times;</button></div>))}
                  {systemList.map(io => (<div key={io.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2 rounded shadow-sm"><div><span className="font-mono text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded mr-2">{io.address}</span><span className="font-medium text-sm text-slate-500 truncate">{io.tag}</span></div></div>))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2 & 3 SHARED CONTENT AREA --- */}
        {(activeTab === 'simulator' || activeTab === 'process') && (
          <div className="flex flex-col gap-6 h-full max-w-[90rem] mx-auto p-8">
            
            {/* Top: Compact Physical Simulator Panel */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 shrink-0">
              <div className="flex justify-between items-center mb-3 border-b pb-2">
                <h2 className="text-lg font-bold text-slate-800">{t('physicalPanel')}</h2>
                <span className="text-xs text-slate-500">{t('physicalDesc')}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Inputs Column */}
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('inputs')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {inputsList.map(io => {
                      const isAuto = io.mode === 'auto';
                      const isMomentary = io.mode === 'momentary';
                      const modeLabel = isAuto ? 'AUTO SENSOR' : isMomentary ? 'PUSH BUTTON' : 'SWITCH';
                      
                      return (
                        <div key={io.id} className={`flex items-center justify-between p-2 rounded border ${isAuto ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-slate-700 truncate w-24" title={io.tag}>{io.tag}</span>
                            <span className="text-[8px] font-mono text-slate-400 mt-0.5">{io.address} <span className="bg-slate-200 text-slate-500 px-1 rounded ml-1">{modeLabel}</span></span>
                          </div>
                          <button onClick={() => { if (isRunning && !isAuto) { isMomentary ? triggerMomentaryInput(io.address) : togglePhysicalInput(io.address) } }} disabled={!isRunning || isAuto} className={`w-9 h-5 rounded-full transition-all relative shadow-inner shrink-0 ${physicalInputs[io.address] ? 'bg-green-500' : 'bg-slate-300'} ${(!isRunning || isAuto) && 'opacity-60 cursor-not-allowed'}`}><div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow ${physicalInputs[io.address] ? 'translate-x-4' : 'translate-x-0'}`} /></button>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Outputs Column */}
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('outputs')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {outputsList.map(io => {
                      const isOn = rungs.some(r => r.outputs.some(o => o.address === io.address && (((o.type === 'coil' || o.type === 'difu' || o.type === 'difd' || o.type === 'set') && o.state) || ((['timer','tof','rto','counter','ctd'].includes(o.type)) && o.doneBit)))) || latchedTags.current[io.address];
                      return (
                        <div key={io.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-slate-700 truncate w-24" title={io.tag}>{io.tag}</span>
                            <span className="text-[9px] font-mono text-slate-400">{io.address}</span>
                          </div>
                          <div className={`w-3.5 h-3.5 rounded-full shadow-inner shrink-0 ${isOn ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-slate-300'}`} />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Memory Column */}
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('memory')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {memoryList.map(io => {
                      const isOn = rungs.some(r => r.outputs.some(o => o.address === io.address && (((o.type === 'coil' || o.type === 'difu' || o.type === 'difd' || o.type === 'set') && o.state) || ((['timer','tof','rto','counter','ctd'].includes(o.type)) && o.doneBit)))) || latchedTags.current[io.address];
                      return (
                        <div key={io.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-slate-700 truncate w-24" title={io.tag}>{io.tag}</span>
                            <span className="text-[9px] font-mono text-slate-400">{io.address}</span>
                          </div>
                          <div className={`w-3.5 h-3.5 rounded-full shadow-inner shrink-0 ${isOn ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-slate-300'}`} />
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* --- TAB 2 CONTENT: LADDER EDITOR --- */}
            {activeTab === 'simulator' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto min-h-[500px]">
                <div className="flex justify-between items-end mb-6 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{t('ladderProg')}</h2>
                    <p className="text-sm text-slate-500 mt-1">{isRunning ? <span className="text-green-600 font-semibold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>{t('running')}</span> : t('editMode')}</p>
                  </div>
                  {!isRunning && (
                    <div className="flex gap-2">
                      <button onClick={exportLogic} className="bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded text-sm font-bold transition-colors border border-slate-200 shadow-sm">{t('export')}</button>
                      <button onClick={() => fileInputRef.current.click()} className="bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded text-sm font-bold transition-colors border border-slate-200 shadow-sm">{t('import')}</button>
                      <button onClick={addRung} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded text-sm font-bold transition-colors border border-blue-200 shadow-sm">{t('addRung')}</button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-10 relative py-4">
                  <div className="absolute top-0 bottom-0 left-4 w-1.5 bg-red-500 z-0 rounded-full"></div>
                  <div className="absolute top-0 bottom-0 right-4 w-1.5 bg-blue-500 z-0 rounded-full"></div>

                  {rungs.length === 0 && (
                     <div className="text-center py-10 text-slate-400 italic">{t('noRungs')}</div>
                  )}

                  {rungs.map((rung) => {
                    let rungRunningPower = true;

                    return (
                      <div key={rung.id} className="relative z-10 flex items-center min-w-max px-4">
                        {!isRunning && (
                          <button onClick={() => removeRung(rung.id)} className="absolute -left-10 w-6 h-6 flex items-center justify-center rounded bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-200 z-50 font-bold shadow-sm">&times;</button>
                        )}
                        <div className="w-8 h-1.5 bg-red-500 shrink-0"></div>

                        {/* --- SERIES NODES --- */}
                        {rung.nodes.map((node, nIdx) => {
                          let nodeOutputPower = false;
                          const evaluatedBranches = node.branches.map(branch => {
                            let branchAccumPower = rungRunningPower;
                            const evaluatedContacts = branch.map(contact => {
                              const ioDef = ioMap.find(io => io.address === contact.address);
                              let p = false;
                              if (ioDef?.type === 'input') p = physicalInputs[contact.address] || false;
                              else if (ioDef?.type === 'output' || ioDef?.type === 'memory') {
                                for (const r of rungs) for (const o of r.outputs) {
                                  if (o.address === contact.address) {
                                    if (['coil','reset','difu','difd','set'].includes(o.type)) p = p || o.state;
                                    else p = p || o.doneBit;
                                  }
                                }
                              } else if (ioDef?.type === 'system') {
                                if (contact.address === 'S:1Hz') p = Math.floor(Date.now() / 500) % 2 === 0;
                                else if (contact.address === 'S:2Hz') p = Math.floor(Date.now() / 250) % 2 === 0;
                              }
                              
                              p = p || (latchedTags.current[contact.address] === true);
                              const prevP = previousScanTags.current[contact.address] || false;
                              
                              const contactPasses = (contact.type === 'NO' && p) || (contact.type === 'NC' && !p) || (contact.type === 'P' && p && !prevP) || (contact.type === 'N' && !p && prevP);
                              const currentWirePower = branchAccumPower;
                              branchAccumPower = branchAccumPower && contactPasses;
                              return { ...contact, inputWirePower: currentWirePower, contactPasses };
                            });
                            
                            if (branchAccumPower || branch.length === 0) nodeOutputPower = true;
                            return { contacts: evaluatedContacts, outputWirePower: branchAccumPower };
                          });
                          if (!nodeOutputPower) rungRunningPower = false;

                          return (
                            <React.Fragment key={node.id}>
                              <div className="relative flex flex-col justify-center gap-2 group/node shrink-0">
                                {node.branches.length > 1 && (
                                  <>
                                    <div className={`absolute left-0 top-8 bottom-8 w-1.5 transition-colors ${rungRunningPower || nodeOutputPower ? 'bg-green-500' : 'bg-slate-200'} z-0`}></div>
                                    <div className={`absolute right-0 top-8 bottom-8 w-1.5 transition-colors ${nodeOutputPower ? 'bg-green-500' : 'bg-slate-200'} z-0`}></div>
                                  </>
                                )}
                                {evaluatedBranches.map((branchData, bIdx) => (
                                  <div key={bIdx} className="flex flex-row items-center h-16 relative group/branch">
                                    <div className={`w-4 h-1.5 transition-colors ${node.branches.length > 1 ? (rungRunningPower || nodeOutputPower ? 'bg-green-500' : 'bg-slate-200') : (branchData.contacts[0]?.inputWirePower || rungRunningPower ? 'bg-green-500' : 'bg-slate-200')} shrink-0`}></div>
                                    
                                    {branchData.contacts.map((cData, cIdx) => (
                                      <React.Fragment key={cData.id}>
                                        <div className="flex flex-col items-center mx-2 relative group/contact">
                                          <div className={`absolute bottom-[100%] left-1/2 -translate-x-1/2 pb-2 z-20 ${isRunning ? 'hidden' : 'opacity-0 group-hover/contact:opacity-100'} transition-opacity pointer-events-none group-hover/contact:pointer-events-auto`}>
                                            <div className="bg-white border border-slate-200 shadow-lg rounded p-1 flex gap-1">
                                              <select value={cData.address} onChange={(e) => updateContact(rung.id, node.id, bIdx, cData.id, 'address', e.target.value)} className="text-xs p-1 border rounded w-24 outline-none">
                                                <option value="">{t('selectTarget')}</option>
                                                <optgroup label={t('inputs')}>{inputsList.map(io => <option key={io.id} value={io.address}>{io.tag}</option>)}</optgroup>
                                                <optgroup label={t('outputs')}>{outputsList.map(io => <option key={io.id} value={io.address}>{io.tag}</option>)}</optgroup>
                                                <optgroup label={t('memory')}>{memoryList.map(io => <option key={io.id} value={io.address}>{io.tag}</option>)}</optgroup>
                                                <optgroup label={t('system')}>{systemList.map(io => <option key={io.id} value={io.address}>{io.tag}</option>)}</optgroup>
                                              </select>
                                              <select value={cData.type} onChange={(e) => updateContact(rung.id, node.id, bIdx, cData.id, 'type', e.target.value)} className="text-xs p-1 border rounded outline-none"><option value="NO">NO</option><option value="NC">NC</option><option value="P">P (↑)</option><option value="N">N (↓)</option></select>
                                              <button onClick={() => removeContact(rung.id, node.id, bIdx, cData.id)} className="bg-red-50 text-red-500 hover:bg-red-100 px-2 rounded text-xs">X</button>
                                            </div>
                                          </div>
                                          <span className="text-[10px] font-bold text-blue-700 mb-1 truncate w-16 text-center" title={ioMap.find(io => io.address === cData.address)?.tag}>{ioMap.find(io => io.address === cData.address)?.tag || <span className="text-red-400 italic">...</span>}</span>
                                          
                                          <div className={`w-10 h-8 flex items-center justify-center transition-colors ${cData.inputWirePower && cData.contactPasses ? 'text-green-600' : 'text-slate-600'} shrink-0`}>
                                            {renderContactIcon(cData.type)}
                                          </div>

                                          <span className="text-[9px] font-mono text-slate-400 mt-1">{cData.address || '?'}</span>
                                        </div>
                                        <div className={`w-6 h-1.5 transition-colors ${cData.inputWirePower && cData.contactPasses ? 'bg-green-500' : 'bg-slate-200'} shrink-0`}></div>
                                      </React.Fragment>
                                    ))}

                                    {branchData.contacts.length === 0 && <div className={`flex-1 min-w-[40px] h-1.5 transition-colors ${rungRunningPower || nodeOutputPower ? 'bg-green-500' : 'bg-slate-200'}`}></div>}
                                    {!isRunning && <button onClick={() => addContactToBranch(rung.id, node.id, bIdx)} className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center text-xs font-bold shadow-sm bg-white z-10 mx-1 shrink-0 opacity-0 group-hover/branch:opacity-100 transition-opacity">+</button>}
                                    <div className={`flex-1 h-1.5 transition-colors ${branchData.outputWirePower ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                    <div className={`w-4 h-1.5 transition-colors ${branchData.outputWirePower ? 'bg-green-500' : 'bg-slate-200'} shrink-0`}></div>
                                    {!isRunning && node.branches.length > 1 && <button onClick={() => removeBranch(rung.id, node.id, bIdx)} className="absolute right-0 top-0 w-4 h-4 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center text-[10px] font-bold shadow-sm z-20">&times;</button>}
                                  </div>
                                ))}
                                {!isRunning && <button onClick={() => addParallelBranch(rung.id, node.id)} className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 hover:text-blue-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm opacity-0 group-hover/node:opacity-100 transition-opacity z-20 whitespace-nowrap">{t('parallelDown')}</button>}
                              </div>
                              <div className={`w-8 h-1.5 transition-colors ${nodeOutputPower ? 'bg-green-500' : 'bg-slate-200'} shrink-0`}></div>
                            </React.Fragment>
                          );
                        })}
                        {!isRunning && <button onClick={() => addNode(rung.id)} className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center text-lg font-bold shadow-sm bg-white shrink-0 mx-2">+</button>}
                        <div className={`flex-1 min-w-[20px] h-1.5 transition-colors ${rungRunningPower ? 'bg-green-500' : 'bg-slate-200'}`}></div>

                        {/* --- OUTPUTS --- */}
                        <div className="relative flex flex-col justify-center gap-2 shrink-0">
                          {rung.outputs.length > 1 && (
                            <>
                              <div className={`absolute left-0 top-8 bottom-8 w-1.5 transition-colors ${rungRunningPower ? 'bg-green-500' : 'bg-slate-200'} z-0`}></div>
                              <div className="absolute right-0 top-8 bottom-8 w-1.5 bg-blue-500 z-0"></div>
                            </>
                          )}
                          {rung.outputs.map((out, oIdx) => (
                            <div key={out.id} className="flex flex-row items-center h-16 relative">
                              <div className={`w-4 h-1.5 transition-colors ${rungRunningPower ? 'bg-green-500' : 'bg-slate-200'} shrink-0`}></div>
                              <div className="flex flex-col items-center px-4 relative group/coil z-10">
                                <div className={`absolute bottom-[100%] left-1/2 -translate-x-1/2 pb-2 z-20 ${isRunning ? 'hidden' : 'opacity-0 group-hover/coil:opacity-100'} transition-opacity pointer-events-none group-hover/coil:pointer-events-auto`}>
                                  <div className="bg-white border border-slate-200 shadow-lg rounded p-2 flex flex-col gap-2 w-48">
                                    <select value={out.type || 'coil'} onChange={(e) => updateOutputField(rung.id, out.id, 'type', e.target.value)} className="text-xs p-1 border rounded outline-none font-bold">
                                      <option value="coil">Coil ()</option><option value="set">Set (SET)</option><option value="reset">Reset (RES)</option><option value="difu">DIFU (↑)</option><option value="difd">DIFD (↓)</option><option value="timer">Timer (TON)</option><option value="tof">Timer (TOF)</option><option value="rto">Timer (RTO)</option><option value="counter">Counter (CTU)</option><option value="ctd">Counter (CTD)</option>
                                    </select>
                                    <select value={out.address} onChange={(e) => updateOutputField(rung.id, out.id, 'address', e.target.value)} className="text-xs p-1 border rounded outline-none">
                                      <option value="">{t('selectTarget')}</option>
                                      <optgroup label={t('outputs')}>{outputsList.map(io => <option key={io.id} value={io.address}>{io.tag}</option>)}</optgroup>
                                      <optgroup label={t('memory')}>{memoryList.map(io => <option key={io.id} value={io.address}>{io.tag}</option>)}</optgroup>
                                    </select>
                                    {(['timer','tof','rto','counter','ctd'].includes(out.type)) && (
                                      <div className="flex justify-between items-center"><label className="text-xs text-slate-500">{t('preset')}</label><input type="number" min="1" step="any" value={out.preset} onChange={(e) => updateOutputField(rung.id, out.id, 'preset', Number(e.target.value))} className="w-16 p-1 text-xs border rounded"/></div>
                                    )}
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold text-blue-700 mb-1 truncate w-20 text-center" title={[...outputsList, ...memoryList].find(io => io.address === out.address)?.tag}>{[...outputsList, ...memoryList].find(io => io.address === out.address)?.tag || <span className="text-red-400 italic">...</span>}</span>
                                {['timer','tof','rto','counter','ctd'].includes(out.type) ? (
                                  <div className={`w-20 h-12 border-2 rounded flex flex-col items-center justify-center transition-colors relative ${out.doneBit ? 'border-yellow-400 bg-yellow-50 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : (out.state ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50')}`}>
                                    <div className="text-[10px] font-bold bg-white/50 w-full text-center border-b pb-0.5">{out.type.toUpperCase()}</div>
                                    <div className="flex gap-2 text-[9px] mt-0.5"><span className="text-slate-600">P:{out.preset}</span><span className="font-bold text-blue-700">A:{out.accum}</span></div>
                                    {isRunning && ['counter','rto','ctd'].includes(out.type) && <button onClick={() => resetCounter(rung.id, out.id)} className="absolute -bottom-5 bg-red-100 hover:bg-red-200 text-red-700 text-[8px] px-1.5 py-0.5 rounded border border-red-200">RESET</button>}
                                  </div>
                                ) : out.type === 'set' ? (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-blue-400 bg-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-(S)-</div></div>
                                ) : out.type === 'reset' ? (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-red-400 bg-red-50 shadow-[0_0_15px_rgba(248,113,113,0.5)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-(R)-</div></div>
                                ) : out.type === 'difu' ? (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-green-400 bg-green-50 shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-(↑)-</div></div>
                                ) : out.type === 'difd' ? (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-green-400 bg-green-50 shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-(↓)-</div></div>
                                ) : (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-yellow-400 bg-yellow-100 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-( )-</div></div>
                                )}
                                <span className="text-[9px] font-mono text-slate-400 mt-1">{out.address || '?'}</span>
                              </div>
                              <div className={`flex-1 min-w-[20px] h-1.5 transition-colors ${out.doneBit || (['coil','reset','set','difu','difd'].includes(out.type) && out.state) ? 'bg-blue-400' : 'bg-blue-500'} shrink-0`}></div>
                              <div className="w-4 h-1.5 bg-blue-500 shrink-0"></div>
                              {!isRunning && rung.outputs.length > 1 && <button onClick={() => removeOutput(rung.id, out.id)} className="absolute right-0 top-0 w-4 h-4 rounded-full bg-red-100 text-red-500 hover:bg-red-500 flex items-center justify-center text-[10px] font-bold z-20">&times;</button>}
                            </div>
                          ))}
                          {!isRunning && <button onClick={() => addOutput(rung.id)} className="absolute -bottom-6 right-0 text-[10px] font-bold text-slate-400 hover:text-blue-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm opacity-0 group-hover/coil:opacity-100 transition-opacity z-20 whitespace-nowrap">{t('outputDown')}</button>}
                        </div>
                        <div className="w-8 h-1.5 bg-blue-500 shrink-0"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- TAB 3 CONTENT: 2D PROCESS PLANT --- */}
            {activeTab === 'process' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
                <div className="mb-6 border-b pb-4 flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{t('processSim')}</h2>
                    <p className="text-sm text-slate-500 mt-1">{t('processDesc')}</p>
                  </div>
                </div>

                <div className="w-full aspect-video max-h-[600px] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border-4 border-slate-700 shadow-inner">
                   
                   {/* ---- 0. SANDBOX (SVG) ---- */}
                   {selectedPlant === 'sandbox' && (
                     <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                       <rect width="1000" height="600" fill="#1e293b" />
                       
                       <text x="500" y="80" fill="white" fontSize="32" fontWeight="bold" textAnchor="middle">Sandbox Simulation</text>
                       
                       {/* LEDs */}
                       <g transform="translate(140, 200)">
                         {/* Green LED O:0/0 */}
                         <circle cx="120" cy="100" r="80" fill={isOutputOn('O:0/0') ? '#22c55e' : '#475569'} stroke="#0f172a" strokeWidth="12" />
                         <text x="120" y="220" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">O:0/0 (Green)</text>

                         {/* Yellow LED O:0/1 */}
                         <circle cx="360" cy="100" r="80" fill={isOutputOn('O:0/1') ? '#eab308' : '#475569'} stroke="#0f172a" strokeWidth="12" />
                         <text x="360" y="220" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">O:0/1 (Yellow)</text>

                         {/* Red LED O:0/2 */}
                         <circle cx="600" cy="100" r="80" fill={isOutputOn('O:0/2') ? '#ef4444' : '#475569'} stroke="#0f172a" strokeWidth="12" />
                         <text x="600" y="220" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">O:0/2 (Red)</text>
                       </g>

                       {/* Inputs Visual Feedback (Optional, but good) */}
                       <g transform="translate(100, 480)">
                          <rect x="0" y="0" width="800" height="80" fill="#334155" rx="10" />
                          <text x="400" y="45" fill="white" fontSize="20" textAnchor="middle">
                            Use the Physical Panel (Left) to toggle: 
                            I:0/0 (Switch A), I:0/1 (Switch B), I:0/2 (Push Button)
                          </text>
                       </g>
                     </svg>
                   )}

                   {/* ---- 1. BOTTLE FILLING PLANT (SVG) ---- */}
                   {selectedPlant === 'bottle' && (
                     <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                       {/* Background */}
                       <rect width="1000" height="600" fill="#1e293b" />
                       
                       {/* Data Dashboard */}
                       <rect x="20" y="20" width="220" height="110" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                       <text x="35" y="50" fill="#94a3b8" fontSize="16" fontWeight="bold" fontFamily="monospace">{t('bottles')}:</text>
                       <text x="130" y="50" fill="#22c55e" fontSize="24" fontWeight="bold" fontFamily="monospace">{plantState.bottle.count}</text>
                       <text x="35" y="80" fill="#94a3b8" fontSize="14" fontFamily="monospace">{t('conveyor')}: {isOutputOn('O:0/0') ? <tspan fill="#22c55e" fontWeight="bold">{t('on')}</tspan> : t('off')}</text>
                       <text x="35" y="105" fill="#94a3b8" fontSize="14" fontFamily="monospace">{t('valve')}: {isOutputOn('O:0/1') ? <tspan fill="#3b82f6" fontWeight="bold">{t('on')}</tspan> : t('off')}</text>

                       {/* Conveyor */}
                       <rect x="0" y="450" width="1000" height="150" fill="#334155" />
                       <rect x="0" y="450" width="1000" height="15" fill="#475569" />
                       {Array.from({length: 20}).map((_, i) => (
                          <g key={i} transform={`translate(${25 + i*50}, 490)`}>
                            <circle r="20" fill="#94a3b8" />
                            {/* Simple spin indicator lines */}
                            {isOutputOn('O:0/0') && (
                               <g transform={`rotate(${tick * 20 % 360})`}>
                                 <line x1="-15" y1="0" x2="15" y2="0" stroke="#475569" strokeWidth="4" />
                                 <line x1="0" y1="-15" x2="0" y2="15" stroke="#475569" strokeWidth="4" />
                               </g>
                            )}
                          </g>
                       ))}

                       {/* Water Stream */}
                       {isOutputOn('O:0/1') && <rect x="490" y="150" width="20" height="300" fill="#3b82f6" opacity="0.8" />}

                       {/* Hopper & Valve */}
                       <path d="M 400 0 L 600 0 L 530 130 L 470 130 Z" fill="#64748b" />
                       <rect x="480" y="130" width="40" height="40" fill={isOutputOn('O:0/1') ? '#3b82f6' : '#94a3b8'} stroke="#fff" strokeWidth="2" />
                       <text x="530" y="155" fill="white" fontSize="16" fontWeight="bold">O:0/1 {t('valve')}</text>

                       {/* Bottle */}
                       <g transform={`translate(${plantState.bottle.pos}, 250)`}>
                          {/* Glass outline */}
                          <rect x="0" y="0" width="100" height="200" rx="5" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="4" />
                          {/* Liquid fill (100% fill = 192px height, inverted drawing) */}
                          <rect x="4" y={196 - plantState.bottle.fill * 1.92} width="92" height={plantState.bottle.fill * 1.92} fill="#3b82f6" />
                          {/* Glare */}
                          <rect x="10" y="10" width="10" height="180" fill="white" opacity="0.2" rx="5" />
                       </g>

                       {/* Sensors */}
                       {/* Proximity Sensor */}
                       <rect x="360" y="420" width="40" height="20" fill={physicalInputs['I:0/2'] ? '#ef4444' : '#475569'} stroke="#fff" strokeWidth="2" />
                       <text x="320" y="400" fill="white" fontSize="16" fontWeight="bold">I:0/2 {t('prox')}</text>
                       
                       {/* Level Sensor */}
                       <rect x="600" y="270" width="40" height="20" fill={physicalInputs['I:0/3'] ? '#22c55e' : '#475569'} stroke="#fff" strokeWidth="2" />
                       <text x="650" y="285" fill="white" fontSize="16" fontWeight="bold">I:0/3 {t('level')}</text>

                       <text x="20" y="580" fill="white" fontSize="20" fontWeight="bold">O:0/0 {t('conveyor')}</text>
                     </svg>
                   )}

                   {/* ---- 2. GARAGE DOOR (SVG) ---- */}
                   {selectedPlant === 'garage' && (
                     <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                       {/* Background */}
                       <rect width="1000" height="600" fill="#1e293b" />
                       
                       {/* Control Status */}
                       <text x="40" y="50" fill="white" fontSize="18" fontWeight="bold">O:0/0 {t('motorUp')}: <tspan fill={isOutputOn('O:0/0')?'#22c55e':'#94a3b8'}>{isOutputOn('O:0/0')?t('on'):t('off')}</tspan></text>
                       <text x="260" y="50" fill="white" fontSize="18" fontWeight="bold">O:0/1 {t('motorDn')}: <tspan fill={isOutputOn('O:0/1')?'#3b82f6':'#94a3b8'}>{isOutputOn('O:0/1')?t('on'):t('off')}</tspan></text>
                       <text x="480" y="50" fill="white" fontSize="14" opacity="0.6">{t('photoEyeHelp')}</text>

                       {/* Garage Opening */}
                       <rect x="250" y="150" width="500" height="400" fill="#0f172a" />
                       
                       {/* Garage Door (Slides Up) */}
                       <g transform={`translate(0, ${-plantState.garage.pos * 4})`}>
                          <rect x="250" y="150" width="500" height="400" fill="#cbd5e1" stroke="#64748b" strokeWidth="4" />
                          {Array.from({length: 8}).map((_, i) => (
                             <line key={i} x1="250" y1={200 + i*50} x2="750" y2={200 + i*50} stroke="#94a3b8" strokeWidth="4" />
                          ))}
                       </g>

                       {/* Wall Mask (Hides door moving up) */}
                       <rect x="0" y="60" width="1000" height="90" fill="#334155" stroke="#475569" strokeWidth="4" />
                       <rect x="0" y="150" width="250" height="450" fill="#334155" stroke="#475569" strokeWidth="4" />
                       <rect x="750" y="150" width="250" height="450" fill="#334155" stroke="#475569" strokeWidth="4" />

                       {/* Limit Sensors */}
                       <rect x="200" y="170" width="50" height="20" fill={physicalInputs['I:0/2'] ? '#ef4444' : '#475569'} stroke="#fff" strokeWidth="2" />
                       <text x="60" y="185" fill="white" fontSize="16" fontWeight="bold">I:0/2 Upper Limit</text>

                       <rect x="200" y="520" width="50" height="20" fill={physicalInputs['I:0/3'] ? '#ef4444' : '#475569'} stroke="#fff" strokeWidth="2" />
                       <text x="60" y="535" fill="white" fontSize="16" fontWeight="bold">I:0/3 Lower Limit</text>

                       {/* Photo Eye */}
                       <circle cx="270" cy="500" r="10" fill={physicalInputs['I:0/4'] ? '#ef4444' : '#64748b'} />
                       <circle cx="730" cy="500" r="10" fill="#64748b" />
                       {!physicalInputs['I:0/4'] && <line x1="270" y1="500" x2="730" y2="500" stroke="#ef4444" strokeWidth="4" strokeDasharray="15 10" />}
                       <text x="250" y="480" fill="white" fontSize="16" fontWeight="bold">I:0/4 Photo Eye</text>
                     </svg>
                   )}

                   {/* ---- 3. BATCH MIXING TANK (SVG) ---- */}
                   {selectedPlant === 'tank' && (
                     <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                       <rect width="1000" height="600" fill="#1e293b" />

                       {/* Status text */}
                       <text x="40" y="40" fill="white" fontSize="18" fontWeight="bold">O:0/0 {t('fillPump')}: <tspan fill={isOutputOn('O:0/0')?'#3b82f6':'#94a3b8'}>{isOutputOn('O:0/0')?t('on'):t('off')}</tspan></text>
                       <text x="40" y="70" fill="white" fontSize="18" fontWeight="bold">O:0/1 {t('drainPump')}: <tspan fill={isOutputOn('O:0/1')?'#3b82f6':'#94a3b8'}>{isOutputOn('O:0/1')?t('on'):t('off')}</tspan></text>
                       <text x="750" y="40" fill="white" fontSize="18" fontWeight="bold">O:0/2 {t('mixer')}: <tspan fill={isOutputOn('O:0/2')?'#a855f7':'#94a3b8'}>{isOutputOn('O:0/2')?t('on'):t('off')}</tspan></text>
                       <text x="750" y="70" fill="white" fontSize="18" fontWeight="bold">O:0/3 {t('heater')}: <tspan fill={isOutputOn('O:0/3')?'#ef4444':'#94a3b8'}>{isOutputOn('O:0/3')?t('on'):t('off')}</tspan></text>

                       {/* Fill Pipe & Pump */}
                       <path d="M 50 100 L 350 100 L 350 150" fill="none" stroke="#64748b" strokeWidth="20" strokeLinejoin="round" />
                       <circle cx="150" cy="100" r="30" fill={isOutputOn('O:0/0') ? '#3b82f6' : '#475569'} stroke="#fff" strokeWidth="4" />
                       {isOutputOn('O:0/0') && <rect x="340" y="145" width="20" height={400 - plantState.tank.level * 4} fill="#3b82f6" opacity="0.6" />}

                       {/* Drain Pipe & Pump */}
                       <path d="M 650 500 L 650 550 L 950 550" fill="none" stroke="#64748b" strokeWidth="20" strokeLinejoin="round" />
                       <circle cx="800" cy="550" r="30" fill={isOutputOn('O:0/1') ? '#3b82f6' : '#475569'} stroke="#fff" strokeWidth="4" />

                       {/* Tank Body (Inner) */}
                       <path d="M 300 150 L 700 150 L 700 500 A 50 50 0 0 1 650 550 L 350 550 A 50 50 0 0 1 300 500 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="8" />

                       {/* Liquid (0 to 100 level -> 0 to 400px height. Bottom is at Y=545) */}
                       <rect x="304" y={546 - plantState.tank.level * 3.96} width="392" height={plantState.tank.level * 3.96} fill="#0ea5e9" opacity="0.9" rx="15" />

                       {/* Heater */}
                       <rect x="350" y="520" width="300" height="15" rx="7" fill={isOutputOn('O:0/3') ? '#ef4444' : '#475569'} />

                       {/* Mixer */}
                       <rect x="490" y="100" width="20" height="350" fill="#94a3b8" /> {/* Shaft */}
                       <rect x="470" y="50" width="60" height="50" fill="#475569" rx="5" /> {/* Motor */}
                       <g transform={`translate(500, 300) rotate(${isOutputOn('O:0/2') ? (tick * 45 % 360) : 0})`}>
                          <rect x="-80" y="-10" width="160" height="20" fill="#cbd5e1" rx="5" />
                       </g>
                       <g transform={`translate(500, 420) rotate(${isOutputOn('O:0/2') ? (tick * 45 % 360) : 0})`}>
                          <rect x="-80" y="-10" width="160" height="20" fill="#cbd5e1" rx="5" />
                       </g>

                       {/* Sensors */}
                       <polygon points="280,180 280,200 310,190" fill={physicalInputs['I:0/3'] ? '#22c55e' : '#475569'} />
                       <text x="180" y="195" fill="white" fontSize="16" fontWeight="bold">I:0/3 {t('high')}</text>

                       <polygon points="280,450 280,470 310,460" fill={physicalInputs['I:0/2'] ? '#22c55e' : '#475569'} />
                       <text x="180" y="465" fill="white" fontSize="16" fontWeight="bold">I:0/2 {t('low')}</text>
                     </svg>
                   )}

                   {/* ---- 4. TRAFFIC INTERSECTION (SVG) ---- */}
                   {selectedPlant === 'traffic' && (
                     <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                       <rect width="1000" height="600" fill="#15803d" /> {/* Grass */}

                       <text x="30" y="40" fill="white" fontSize="18" fontWeight="bold">I:0/0 System: {physicalInputs['I:0/0']?'ON':'OFF'} (Use Switch in Physical Panel)</text>

                       {/* E/W Road */}
                       <rect x="0" y="200" width="1000" height="200" fill="#334155" />
                       {/* N/S Road */}
                       <rect x="400" y="0" width="200" height="600" fill="#334155" />
                       
                       {/* Dashed Lines */}
                       <line x1="500" y1="0" x2="500" y2="200" stroke="#facc15" strokeWidth="6" strokeDasharray="30 20" />
                       <line x1="500" y1="400" x2="500" y2="600" stroke="#facc15" strokeWidth="6" strokeDasharray="30 20" />
                       <line x1="0" y1="300" x2="400" y2="300" stroke="#facc15" strokeWidth="6" strokeDasharray="30 20" />
                       <line x1="600" y1="300" x2="1000" y2="300" stroke="#facc15" strokeWidth="6" strokeDasharray="30 20" />

                       {/* Crosswalks */}
                       {/* Top */}
                       {Array.from({length: 6}).map((_, i) => <rect key={`tc_${i}`} x={415+i*30} y="150" width="15" height="40" fill="white" /> )}
                       {/* Bottom */}
                       {Array.from({length: 6}).map((_, i) => <rect key={`bc_${i}`} x={415+i*30} y="410" width="15" height="40" fill="white" /> )}
                       {/* Left */}
                       {Array.from({length: 6}).map((_, i) => <rect key={`lc_${i}`} x="350" y={215+i*30} width="40" height="15" fill="white" /> )}
                       {/* Right */}
                       {Array.from({length: 6}).map((_, i) => <rect key={`rc_${i}`} x="610" y={215+i*30} width="40" height="15" fill="white" /> )}

                       {/* Traffic Light N/S */}
                       <g transform="translate(280, 20)">
                          <rect x="0" y="0" width="80" height="180" fill="#0f172a" rx="10" stroke="#475569" strokeWidth="4" />
                          <circle cx="40" cy="40" r="20" fill={isOutputOn('O:0/2') ? '#ef4444' : '#450a0a'} stroke="#000" strokeWidth="2" />
                          <circle cx="40" cy="90" r="20" fill={isOutputOn('O:0/1') ? '#eab308' : '#422006'} stroke="#000" strokeWidth="2" />
                          <circle cx="40" cy="140" r="20" fill={isOutputOn('O:0/0') ? '#22c55e' : '#052e16'} stroke="#000" strokeWidth="2" />
                          <text x="40" y="200" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">North / South</text>
                          <text x="40" y="220" fill="white" fontSize="12" textAnchor="middle">O:0/0, O:0/1, O:0/2</text>
                       </g>

                       {/* Traffic Light E/W */}
                       <g transform="translate(680, 420)">
                          <rect x="0" y="0" width="180" height="80" fill="#0f172a" rx="10" stroke="#475569" strokeWidth="4" />
                          <circle cx="40" cy="40" r="20" fill={isOutputOn('O:0/5') ? '#ef4444' : '#450a0a'} stroke="#000" strokeWidth="2" />
                          <circle cx="90" cy="40" r="20" fill={isOutputOn('O:0/4') ? '#eab308' : '#422006'} stroke="#000" strokeWidth="2" />
                          <circle cx="140" cy="40" r="20" fill={isOutputOn('O:0/3') ? '#22c55e' : '#052e16'} stroke="#000" strokeWidth="2" />
                          <text x="90" y="105" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">East / West</text>
                          <text x="90" y="125" fill="white" fontSize="12" textAnchor="middle">O:0/3, O:0/4, O:0/5</text>
                       </g>
                     </svg>
                   )}

                   {/* ---- 5. ELEVATOR (SVG) ---- */}
                   {selectedPlant === 'elevator' && (
                     <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                       <rect width="1000" height="600" fill="#1e293b" />

                       {/* Status */}
                       <text x="40" y="50" fill="white" fontSize="18" fontWeight="bold">O:0/0 {t('motorUp')}: <tspan fill={isOutputOn('O:0/0')?'#22c55e':'#94a3b8'}>{isOutputOn('O:0/0')?t('on'):t('off')}</tspan></text>
                       <text x="260" y="50" fill="white" fontSize="18" fontWeight="bold">O:0/1 {t('motorDn')}: <tspan fill={isOutputOn('O:0/1')?'#3b82f6':'#94a3b8'}>{isOutputOn('O:0/1')?t('on'):t('off')}</tspan></text>
                       
                       {/* Motor Hoist Graphic */}
                       <circle cx="450" cy="50" r="30" fill="#94a3b8" />
                       {isOutputOn('O:0/0') && <path d="M 450 50 L 480 30" stroke="#fff" strokeWidth="4" />} {/* Animation hack hint */}

                       {/* Shaft */}
                       <rect x="350" y="50" width="200" height="500" fill="#0f172a" stroke="#475569" strokeWidth="8" />

                       {/* Wire */}
                       <line x1="450" y1="50" x2="450" y2={450 - plantState.elevator.pos * 4} stroke="#94a3b8" strokeWidth="6" />

                       {/* Elevator Car (Pos 0 -> Y=450, Pos 100 -> Y=50) */}
                       <g transform={`translate(355, ${450 - plantState.elevator.pos * 4})`}>
                          <rect x="0" y="0" width="190" height="100" fill="#cbd5e1" rx="5" />
                          <rect x="10" y="10" width="80" height="80" fill="#64748b" />
                          <rect x="100" y="10" width="80" height="80" fill="#64748b" />
                          <line x1="95" y1="10" x2="95" y2="90" stroke="#1e293b" strokeWidth="4" />
                       </g>

                       {/* Floors & Sensors */}
                       {/* Ground */}
                       <line x1="150" y1="550" x2="350" y2="550" stroke="#fff" strokeWidth="6" />
                       <text x="180" y="520" fill="white" fontSize="20" fontWeight="bold">{t('ground')}</text>
                       <rect x="310" y="530" width="40" height="20" fill={physicalInputs['I:0/3'] ? '#22c55e' : '#475569'} stroke="#fff" strokeWidth="2" />
                       <text x="260" y="545" fill="white" fontSize="14">I:0/3</text>
                       {/* Call Button G */}
                       <g onClick={() => isRunning && triggerMomentaryInput('I:0/0')} className="cursor-pointer">
                         <rect x="180" y="450" width="40" height="40" rx="5" fill={physicalInputs['I:0/0'] ? '#facc15' : '#94a3b8'} />
                         <text x="200" y="475" fill="#0f172a" fontSize="16" fontWeight="bold" textAnchor="middle">G</text>
                         <text x="180" y="440" fill="white" fontSize="10">I:0/0 Call</text>
                       </g>

                       {/* Floor 1 */}
                       <line x1="150" y1="350" x2="350" y2="350" stroke="#fff" strokeWidth="6" />
                       <text x="180" y="320" fill="white" fontSize="20" fontWeight="bold">{t('floor1')}</text>
                       <rect x="310" y="330" width="40" height="20" fill={physicalInputs['I:0/4'] ? '#22c55e' : '#475569'} stroke="#fff" strokeWidth="2" />
                       <text x="260" y="345" fill="white" fontSize="14">I:0/4</text>
                       {/* Call Button 1 */}
                       <g onClick={() => isRunning && triggerMomentaryInput('I:0/1')} className="cursor-pointer">
                         <rect x="180" y="250" width="40" height="40" rx="5" fill={physicalInputs['I:0/1'] ? '#facc15' : '#94a3b8'} />
                         <text x="200" y="275" fill="#0f172a" fontSize="16" fontWeight="bold" textAnchor="middle">1</text>
                         <text x="180" y="240" fill="white" fontSize="10">I:0/1 Call</text>
                       </g>

                       {/* Floor 2 */}
                       <line x1="150" y1="150" x2="350" y2="150" stroke="#fff" strokeWidth="6" />
                       <text x="180" y="120" fill="white" fontSize="20" fontWeight="bold">{t('floor2')}</text>
                       <rect x="310" y="130" width="40" height="20" fill={physicalInputs['I:0/5'] ? '#22c55e' : '#475569'} stroke="#fff" strokeWidth="2" />
                       <text x="260" y="145" fill="white" fontSize="14">I:0/5</text>
                       {/* Call Button 2 */}
                       <g onClick={() => isRunning && triggerMomentaryInput('I:0/2')} className="cursor-pointer">
                         <rect x="180" y="50" width="40" height="40" rx="5" fill={physicalInputs['I:0/2'] ? '#facc15' : '#94a3b8'} />
                         <text x="200" y="75" fill="#0f172a" fontSize="16" fontWeight="bold" textAnchor="middle">2</text>
                         <text x="180" y="40" fill="white" fontSize="10">I:0/2 Call</text>
                       </g>
                     </svg>
                   )}

                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PLCSimulator;
