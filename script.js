// Prompt 生成器主要邏輯

// 行銷目標的中文對照
const goalLabels = {
    content: '文案撰寫',
    social: '社群媒體貼文',
    ad: '廣告創意',
    email: 'Email 行銷',
    seo: 'SEO 優化內容',
    blog: '部落格文章',
    product: '產品描述',
    landing: '著陸頁文案',
    press: '新聞稿',
    video: '影片腳本',
    slogan: '標語口號',
    case: '案例研究',
    other: '其他行銷內容'
};

// 行銷目標的描述
const goalDescriptions = {
    content: '適用於品牌故事、產品介紹、宣傳冊等各類行銷文案創作',
    social: '為 Facebook、Instagram、LinkedIn 等社群平台打造吸睛貼文',
    ad: '創造高轉換的廣告文案，包含 Google Ads、Facebook Ads 等數位廣告',
    email: '撰寫開信率高的 EDM、電子報內容，促進用戶互動與轉換',
    seo: '優化搜尋引擎排名的內容文章，兼顧關鍵字與閱讀體驗',
    blog: '撰寫深度、有價值的部落格文章，建立品牌專業形象',
    product: '撰寫吸引人的產品特色說明，突出賣點與差異化',
    landing: '打造高轉換率的著陸頁文案，引導用戶完成特定行動',
    press: '撰寫專業新聞稿，適合媒體發布與品牌曝光',
    video: '創作引人入勝的影片腳本，適用於廣告、教學或品牌影片',
    slogan: '設計簡潔有力的品牌標語或活動口號，強化記憶點',
    case: '展示成功案例與客戶見證，建立信任與說服力',
    other: '其他類型的行銷內容創作需求'
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
    long: '詳細完整（約 500 字以上）',
    custom: '' // 自訂長度會在生成時動態處理
};

// 目標受眾標籤對照
const audienceLabels = {
    young: '年輕族群（18-30歲）',
    middle: '中壯年（31-50歲）',
    senior: '銀髮族（50歲以上）',
    student: '學生（大學/研究所）',
    professional: '上班族（一般職員）',
    manager: '主管/經理（中高階管理）',
    entrepreneur: '創業者（新創/老闆）',
    homemaker: '家庭主婦/夫（家庭照顧者）',
    parent: '父母（有子女家長）',
    tech: '科技愛好者（早期採用者）',
    b2b: 'B2B 採購（企業決策者）',
    custom: '' // 自訂受眾
};

// 表單提交處理
document.getElementById('promptForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 獲取表單數據
    const lengthValue = document.querySelector('input[name="length"]:checked').value;
    const goalValue = document.querySelector('input[name="goal"]:checked').value;

    // 獲取選中的受眾（複選）
    const selectedAudiences = Array.from(document.querySelectorAll('input[name="audience"]:checked'))
        .map(cb => cb.value);

    // 檢查是否至少選擇一個受眾
    if (selectedAudiences.length === 0) {
        alert('請至少選擇一個目標受眾');
        return;
    }

    const formData = {
        goal: goalValue,
        customGoal: goalValue === 'other' ? document.getElementById('customGoal').value.trim() : '',
        product: document.getElementById('product').value.trim(),
        audiences: selectedAudiences,
        customAudience: selectedAudiences.includes('custom') ? document.getElementById('customAudience').value.trim() : '',
        tone: document.querySelector('input[name="tone"]:checked').value,
        length: lengthValue,
        customLength: lengthValue === 'custom' ? document.getElementById('customLength').value.trim() : '',
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
    if (data.goal === 'other' && data.customGoal) {
        prompt += `請為我創作${data.customGoal}。\n\n`;
    } else {
        prompt += `請為我創作${goalLabels[data.goal]}。\n\n`;
    }

    // 3. 產品/服務資訊
    prompt += '【產品/服務資訊】\n';
    prompt += `${data.product}\n\n`;

    // 4. 目標受眾
    prompt += '【目標受眾】\n';
    const audienceList = data.audiences
        .filter(a => a !== 'custom')
        .map(a => audienceLabels[a])
        .filter(Boolean);

    if (data.customAudience) {
        audienceList.push(data.customAudience);
    }

    prompt += audienceList.join('、') + '\n\n';

    // 5. 風格要求
    prompt += '【風格與語調】\n';
    prompt += `請使用${toneDescriptions[data.tone]}。\n\n`;

    // 6. 內容長度
    prompt += '【內容長度】\n';
    if (data.length === 'custom' && data.customLength) {
        prompt += `${data.customLength}。\n\n`;
    } else {
        prompt += `${lengthDescriptions[data.length]}。\n\n`;
    }

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

        case 'blog':
            prompt += '- 標題需要吸引讀者點擊並符合搜尋意圖\n';
            prompt += '- 提供深度見解與實用價值\n';
            prompt += '- 使用副標題、列點等結構化內容\n';
            prompt += '- 適當加入數據、案例或引用增加可信度\n';
            prompt += '- 結尾鼓勵互動或延伸閱讀\n';
            break;

        case 'product':
            prompt += '- 突出產品的核心優勢與差異化特色\n';
            prompt += '- 說明產品如何解決用戶痛點\n';
            prompt += '- 使用具體規格、功能描述\n';
            prompt += '- 加入使用場景或應用情境\n';
            prompt += '- 強調產品價值而非僅列功能\n';
            break;

        case 'landing':
            prompt += '- 清晰明確的價值主張（above the fold）\n';
            prompt += '- 強而有力的主標題與副標題\n';
            prompt += '- 分段說明產品特色與優勢\n';
            prompt += '- 社會證明（testimonials、數據等）\n';
            prompt += '- 突出的 CTA 按鈕文案\n';
            prompt += '- 消除疑慮的 FAQ 或保證\n';
            break;

        case 'press':
            prompt += '- 新聞式標題，包含關鍵訊息\n';
            prompt += '- 第一段涵蓋 5W1H 重點\n';
            prompt += '- 客觀、專業的新聞語調\n';
            prompt += '- 包含相關引述（高層或專家）\n';
            prompt += '- 提供背景資訊與聯絡方式\n';
            break;

        case 'video':
            prompt += '- 開場前 5 秒抓住注意力\n';
            prompt += '- 清晰的腳本結構（開場、內容、結尾）\n';
            prompt += '- 口語化表達，易於演繹\n';
            prompt += '- 標註畫面建議或視覺提示\n';
            prompt += '- 包含明確的 CTA\n';
            break;

        case 'slogan':
            prompt += '- 簡短有力，易於記憶和傳播\n';
            prompt += '- 突出品牌核心價值或產品特色\n';
            prompt += '- 考慮韻律感與朗朗上口\n';
            prompt += '- 提供 3-5 個不同方向的選項\n';
            prompt += '- 每個選項附上創意說明\n';
            break;

        case 'case':
            prompt += '- 說明客戶背景與面臨的挑戰\n';
            prompt += '- 描述提供的解決方案\n';
            prompt += '- 呈現具體成果與數據（ROI、成長率等）\n';
            prompt += '- 包含客戶見證或引述\n';
            prompt += '- 提煉可複製的成功要素\n';
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

// 自訂長度顯示/隱藏控制
document.querySelectorAll('input[name="length"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const customLengthContainer = document.getElementById('customLengthContainer');
        if (this.value === 'custom') {
            customLengthContainer.classList.remove('hidden');
            document.getElementById('customLength').focus();
        } else {
            customLengthContainer.classList.add('hidden');
        }
    });
});

// 行銷目標描述顯示和自訂輸入
document.querySelectorAll('input[name="goal"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const descriptionContainer = document.getElementById('goalDescription');
        const descriptionText = descriptionContainer.querySelector('p');
        const customGoalContainer = document.getElementById('customGoalContainer');

        if (goalDescriptions[this.value]) {
            descriptionText.textContent = goalDescriptions[this.value];
            descriptionContainer.classList.remove('hidden');
        } else {
            descriptionContainer.classList.add('hidden');
        }

        // 顯示/隱藏自訂目標輸入框
        if (this.value === 'other') {
            customGoalContainer.classList.remove('hidden');
            document.getElementById('customGoal').focus();
        } else {
            customGoalContainer.classList.add('hidden');
        }
    });
});

// 目標受眾自訂輸入顯示
document.querySelectorAll('input[name="audience"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const customAudienceContainer = document.getElementById('customAudienceContainer');
        const customCheckbox = document.querySelector('input[name="audience"][value="custom"]');

        if (customCheckbox.checked) {
            customAudienceContainer.classList.remove('hidden');
            document.getElementById('customAudience').focus();
        } else {
            customAudienceContainer.classList.add('hidden');
        }
    });
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 可以在這裡添加初始化邏輯
    console.log('行銷 Prompt 生成器已就緒！');
});
