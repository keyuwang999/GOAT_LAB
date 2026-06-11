// api/inventory.js (后端代码示例)
export default async function handler(req, res) {
    // 1. 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. 接收前端传来的密码
    const { password } = req.body;

    // 3. 验证密码 (密码存在服务器的环境变量中，前端绝对看不到)
    if (password !== process.env.LAB_ACCESS_PASSWORD) {
        return res.status(401).json({ error: '访问被拒绝：密码错误' });
    }

    // 4. 密码正确，服务器代为向 Vika 发起请求
    const DATASHEET_ID = process.env.VIKA_DATASHEET_ID; 
    const API_TOKEN = process.env.VIKA_API_TOKEN; // Token 藏在环境变量里
    const API_URL = `https://api.vika.cn/fusion/v1/datasheets/${DATASHEET_ID}/records?pageSize=1000`;

    try {
        const vikaResponse = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        });
        const data = await vikaResponse.json();
        
        // 5. 将获取到的数据原封不动返回给前端
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: '获取数据失败' });
    }
}