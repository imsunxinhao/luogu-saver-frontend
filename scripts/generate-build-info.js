import fs from 'fs'
import path from 'path'

// 生成8位随机字符串（类似GitHub release的格式）
function generateBuildId() {
  const chars = '0123456789abcdef'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 获取当前时间
const buildTime = new Date().toISOString()
const buildId = generateBuildId()

// 构建信息对象
const buildInfo = {
  buildTime,
  buildId,
  version: 'beta.0.1'
}

// 确保public目录存在
const publicDir = path.join(process.cwd(), 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// 写入构建信息文件
const buildInfoPath = path.join(publicDir, 'build-info.json')
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2))

console.log('构建信息已生成:')
console.log(`构建时间: ${buildTime}`)
console.log(`构建ID: ${buildId}`)
console.log(`文件路径: ${buildInfoPath}`)