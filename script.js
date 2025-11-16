// Prompt 生成器主要邏輯

// 行銷目標的中文對照
const goalLabels = {
    content: '文案撰寫',
    social: '社群媒體貼文',
    ad: '廣告創意',
    email: 'Email 行銷',
    seo: 'SEO 優化內容',
    other: '其他行銷內容'
};

// 語調風格描述
const toneDescriptions = {
    professional: '專業、正式、值得信賴的語氣',
    friendly: '親切、友善、易於理解的語氣',
    creative: '創意、活潑、有趣的語氣',
    urgent: '具有緊迫感和行動號召的語氣'
};

// 內容長度描述
const lengthDescriptions = {
    short: '簡短精煉（約 50-100 字）',
    medium: '中等長度（約 200-300 字）',
    long: '詳細完整（約 500 字以上）'
};

// 表單提交處理
document.getElementById('promptForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 獲取表單數據
    const formData = {
        goal: document.querySelector('input[name="goal"]:checked').value,
        product: document.getElementById('product').value.trim(),
        audience: document.getElementById('audience').value.trim(),
        tone: document.querySelector('input[name="tone"]:checked').value,
        length: document.querySelector('input[name="length"]:checked').value,
        additional: document.getElementById('additional').value.trim()
    };

    // 生成 Prompt
    const generatedPrompt = generatePrompt(formData);

    // 顯示結果
    displayResult(generatedPrompt);
});

// 生成 Prompt 的核心函數
function generatePrompt(data) {
    let prompt = '';

    // 1. 角色設定
    prompt += '【角色設定】\n';
    prompt += '你是一位專業的行銷文案專家，擅長創造吸引人的內容，並深諳消費者心理學。\n\n';

    // 2. 任務描述
    prompt += '【任務】\n';
    prompt += `請為我創作${goalLabels[data.goal]}。\n\n`;

    // 3. 產品/服務資訊
    prompt += '【產品/服務資訊】\n';
    prompt += `${data.product}\n\n`;

    // 4. 目標受眾
    prompt += '【目標受眾】\n';
    prompt += `${data.audience}\n\n`;

    // 5. 風格要求
    prompt += '【風格與語調】\n';
    prompt += `請使用${toneDescriptions[data.tone]}。\n\n`;

    // 6. 內容長度
    prompt += '【內容長度】\n';
    prompt += `${lengthDescriptions[data.length]}。\n\n`;

    // 7. 根據不同行銷目標添加特定要求
    prompt += '【具體要求】\n';

    switch(data.goal) {
        case 'content':
            prompt += '- 標題需要吸引眼球，引發好奇心\n';
            prompt += '- 內容需要清楚說明產品價值和優勢\n';
            prompt += '- 包含明確的行動號召（CTA）\n';
            prompt += '- 使用具體案例或數據增加說服力\n';
            break;

        case 'social':
            prompt += '- 開頭需要立即抓住注意力\n';
            prompt += '- 適合在社群平台分享，易於互動\n';
            prompt += '- 考慮使用適當的 emoji 增加視覺吸引力\n';
            prompt += '- 建議包含 3-5 個相關 hashtag\n';
            prompt += '- 鼓勵用戶留言、分享或點擊連結\n';
            break;

        case 'ad':
            prompt += '- 主標題需要強而有力，突出核心賣點\n';
            prompt += '- 副標題補充關鍵資訊或優惠內容\n';
            prompt += '- 內文簡潔有力，聚焦於解決用戶痛點\n';
            prompt += '- 明確的 CTA 按鈕文字建議\n';
            prompt += '- 考慮 A/B 測試，提供 2-3 個版本\n';
            break;

        case 'email':
            prompt += '- 主旨：吸引人且避免被當作垃圾郵件\n';
            prompt += '- 開頭：個人化問候，建立連結\n';
            prompt += '- 內容：清晰的價值主張和優惠說明\n';
            prompt += '- 結尾：明確的 CTA 和聯絡方式\n';
            prompt += '- 請提供完整的 Email 結構\n';
            break;

        case 'seo':
            prompt += '- 自然融入相關關鍵字（避免過度優化）\n';
            prompt += '- 使用清晰的標題結構（H1, H2, H3）\n';
            prompt += '- 內容要有價值，解答用戶搜尋意圖\n';
            prompt += '- 適當的段落長度，提升可讀性\n';
            prompt += '- 建議 meta description（150-160字）\n';
            break;

        default:
            prompt += '- 內容需要符合行銷目標\n';
            prompt += '- 突出產品/服務的獨特價值\n';
            prompt += '- 包含明確的行動號召\n';
    }

    // 8. 其他特殊要求
    if (data.additional) {
        prompt += '\n【其他特殊要求】\n';
        prompt += `${data.additional}\n`;
    }

    // 9. 輸出格式
    prompt += '\n【輸出格式】\n';
    prompt += '請直接提供內容，並在最後簡要說明創作理念和預期效果。';

    return prompt;
}

// 顯示生成結果
function displayResult(prompt) {
    const resultSection = document.getElementById('resultSection');
    const generatedPromptElement = document.getElementById('generatedPrompt');

    generatedPromptElement.textContent = prompt;
    resultSection.classList.remove('hidden');

    // 平滑滾動到結果區域
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 複製功能
document.getElementById('copyBtn').addEventListener('click', function() {
    const promptText = document.getElementById('generatedPrompt').textContent;
    const button = this;

    // 使用 Clipboard API 複製文字
    navigator.clipboard.writeText(promptText).then(function() {
        // 成功回饋
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            已複製！
        `;
        button.classList.remove('bg-green-500', 'hover:bg-green-600');
        button.classList.add('bg-green-600');

        // 3秒後恢復原狀
        setTimeout(function() {
            button.innerHTML = originalHTML;
            button.classList.remove('bg-green-600');
            button.classList.add('bg-green-500', 'hover:bg-green-600');
        }, 3000);
    }).catch(function(err) {
        // 錯誤處理
        alert('複製失敗，請手動選取文字複製');
        console.error('複製失敗:', err);
    });
});

// 重置功能
document.getElementById('resetBtn').addEventListener('click', function() {
    // 隱藏結果區域
    document.getElementById('resultSection').classList.add('hidden');

    // 滾動回表單頂部
    document.querySelector('header').scrollIntoView({ behavior: 'smooth' });

    // 選擇性：不重置表單，讓用戶可以修改後重新生成
    // 如果要完全重置，取消下面這行的註解：
    // document.getElementById('promptForm').reset();
});

// 表單驗證增強
document.getElementById('promptForm').addEventListener('input', function(e) {
    // 可以在這裡添加即時驗證邏輯
    // 例如：字數統計、格式檢查等
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 可以在這裡添加初始化邏輯
    console.log('行銷 Prompt 生成器已就緒！');
});
