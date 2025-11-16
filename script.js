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
const ageLabels = {
    children: '兒童（6-12歲）',
    teen: '青少年（13-17歲）',
    young: '年輕族群（18-30歲）',
    middle: '中壯年（31-50歲）',
    senior: '銀髮族（51歲以上）',
    all: '全年齡層',
    customAge: '' // 自訂年齡
};

const occupationLabels = {
    student: '學生',
    professional: '上班族',
    manager: '主管/經理',
    entrepreneur: '創業者/老闆',
    freelancer: '自由工作者',
    homemaker: '家庭主婦/夫',
    parent: '父母（有子女）',
    retiree: '退休人士',
    tech: '科技從業者',
    creative: '創意工作者',
    b2b: 'B2B 企業決策者',
    general: '一般大眾',
    customOccupation: '' // 自訂職業
};

// 行銷情境
const scenarioLabels = {
    launch: '新品上市 / 功能上線',
    campaign: '季度 / 節慶活動推廣',
    reengage: '會員召回 / 沉睡客戶喚醒',
    promotion: '限時促銷 / 折扣活動',
    branding: '品牌形象與信任建立',
    education: '教育型 / 知識分享內容',
    event: '活動邀請與報名推廣',
    conversion: '試用導入 / 轉換催化',
    customScenario: '客製化情境'
};

const scenarioDescriptions = {
    launch: '適合用於新品上市、重大功能釋出，強調首波亮點與搶先體驗。',
    campaign: '聚焦於檔期、節慶或季度活動，需清楚導入活動主題與時間。',
    reengage: '鎖定沉睡客戶或舊會員，提醒既有價值並給予回流誘因。',
    promotion: '用於限時折扣、加碼優惠或快閃行銷，強調緊迫感與 CTA。',
    branding: '強調品牌理念、價值觀與信任累積，適合長期溝通。',
    education: '以教學、知識、白皮書等內容為主，突顯專業洞察。',
    event: '推廣線上／線下活動與報名資訊，需清楚時間地點與名額限制。',
    conversion: '協助體驗轉購、試用轉付費或導購流程，著重行動指引。'
};

const scenarioGuidelines = {
    launch: [
        '凸顯新品解決的核心痛點與差異化功能',
        '明確標出上市日期、預購或搶先體驗方式',
        '加入客戶信任指標（研發背景、合作品牌等）'
    ],
    campaign: [
        '呼應檔期主題與活動主視覺 Tone',
        '清楚告知活動期間與參與門檻',
        '建議提供至少一個贈品或加碼機制'
    ],
    reengage: [
        '採用關懷式語氣，提醒過往互動紀錄或成就',
        '提供回流專屬優惠或限量福利',
        '降低行動門檻，如一鍵登入或專屬客服'
    ],
    promotion: [
        '在首句放入優惠幅度或倒數資訊',
        '搭配稀缺性描述（名額、時間、庫存）',
        '重複 CTA 以加深行動意識'
    ],
    branding: [
        '連結品牌使命、社會影響或核心價值',
        '建議引入客戶故事或數據證明信任度',
        '語氣維持一致並呼應品牌識別詞'
    ],
    education: [
        '建立場景或問題，引出知識含金量',
        '拆解重點為 3-4 個章節，易於閱讀',
        '結尾附上延伸資源或下載行動'
    ],
    event: [
        '第一段交代活動時間、地點與亮點',
        '清楚描述受眾參與後可獲得的收益',
        '提醒名額限制與報名截止日期'
    ],
    conversion: [
        '聚焦產品如何引導下一步行動（試用、預約等）',
        '加入社會證明或過往成功案例',
        '提供最簡單的 CTA 流程與必要連結'
    ]
};

// UI helpers
function renderChipGroup(container, labels, emptyText) {
    if (!container) return;
    container.innerHTML = '';
    if (!labels.length) {
        container.textContent = emptyText;
        container.classList.add('text-gray-400');
        return;
    }
    container.classList.remove('text-gray-400');
    labels.forEach(label => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = label;
        container.appendChild(chip);
    });
}

function getSelectedAgeLabels() {
    const selected = Array.from(document.querySelectorAll('input[name="audienceAge"]:checked')).map(cb => cb.value);
    if (selected.includes('all')) {
        return ['全年齡層'];
    }
    const labels = selected
        .filter(value => value !== 'customAge')
        .map(value => ageLabels[value])
        .filter(Boolean);
    if (selected.includes('customAge')) {
        const customAgeValue = document.getElementById('customAgeInput').value.trim();
        labels.push(customAgeValue || '自訂年齡');
    }
    return labels;
}

function getSelectedOccupationLabels() {
    const selected = Array.from(document.querySelectorAll('input[name="audienceOccupation"]:checked')).map(cb => cb.value);
    const labels = selected
        .filter(value => value !== 'customOccupation')
        .map(value => occupationLabels[value])
        .filter(Boolean);
    if (selected.includes('customOccupation')) {
        const customOccupationValue = document.getElementById('customOccupationInput').value.trim();
        labels.push(customOccupationValue || '自訂身份');
    }
    return labels;
}

function updateAudienceSummary() {
    renderChipGroup(document.getElementById('ageChipGroup'), getSelectedAgeLabels(), '尚未選擇');
    renderChipGroup(document.getElementById('occupationChipGroup'), getSelectedOccupationLabels(), '尚未選擇');
}

// 表單提交處理
document.getElementById('promptForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 獲取表單數據
    const lengthValue = document.querySelector('input[name="length"]:checked').value;
    const goalValue = document.querySelector('input[name="goal"]:checked').value;
    const scenarioValue = document.querySelector('input[name="scenario"]:checked').value;

    // 獲取選中的年齡層（複選）
    const selectedAges = Array.from(document.querySelectorAll('input[name="audienceAge"]:checked'))
        .map(cb => cb.value);

    // 獲取選中的職業（複選）
    const selectedOccupations = Array.from(document.querySelectorAll('input[name="audienceOccupation"]:checked'))
        .map(cb => cb.value);

    // 檢查是否至少選擇一個年齡層和一個職業
    if (selectedAges.length === 0 || selectedOccupations.length === 0) {
        alert('請至少選擇一個年齡層和一個職業/身份');
        return;
    }

    const formData = {
        goal: goalValue,
        customGoal: goalValue === 'other' ? document.getElementById('customGoal').value.trim() : '',
        scenario: scenarioValue,
        customScenario: scenarioValue === 'customScenario' ? document.getElementById('customScenario').value.trim() : '',
        product: document.getElementById('product').value.trim(),
        painPoints: document.getElementById('painPoints').value.trim(),
        valueProps: document.getElementById('valueProps').value.trim(),
        offerDetails: document.getElementById('offerDetails').value.trim(),
        desiredAction: document.getElementById('desiredAction').value.trim(),
        audienceAges: selectedAges,
        customAgeInput: selectedAges.includes('customAge') ? document.getElementById('customAgeInput').value.trim() : '',
        audienceOccupations: selectedOccupations,
        customOccupationInput: selectedOccupations.includes('customOccupation') ? document.getElementById('customOccupationInput').value.trim() : '',
        tone: document.querySelector('input[name="tone"]:checked').value,
        customTone: document.querySelector('input[name="tone"]:checked').value === 'customTone'
            ? document.getElementById('customTone').value.trim()
            : '',
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

    // 3. 行銷情境
    prompt += '【行銷情境】\n';
    let scenarioText = scenarioLabels[data.scenario] || '';
    if (data.scenario === 'customScenario' && data.customScenario) {
        scenarioText = data.customScenario;
    }
    prompt += `${scenarioText}\n`;
    if (scenarioDescriptions[data.scenario]) {
        prompt += `${scenarioDescriptions[data.scenario]}\n`;
    }
    prompt += '\n';

    if (scenarioGuidelines[data.scenario]) {
        prompt += '【情境提示】\n';
        scenarioGuidelines[data.scenario].forEach(item => {
            prompt += `- ${item}\n`;
        });
        prompt += '\n';
    }

    // 4. 產品/服務資訊
    prompt += '【產品/服務資訊】\n';
    prompt += `${data.product}\n\n`;

    // 5. 需求重點
    const hasStructuredInfo = data.painPoints || data.valueProps || data.offerDetails || data.desiredAction;
    if (hasStructuredInfo) {
        prompt += '【需求重點】\n';
        if (data.painPoints) {
            prompt += `- 受眾痛點：${data.painPoints}\n`;
        }
        if (data.valueProps) {
            prompt += `- 核心賣點：${data.valueProps}\n`;
        }
        if (data.offerDetails) {
            prompt += `- 方案 / 優惠：${data.offerDetails}\n`;
        }
        if (data.desiredAction) {
            prompt += `- 期望 CTA：${data.desiredAction}\n`;
        }
        prompt += '\n';
    }

    // 6. 目標受眾
    prompt += '【目標受眾】\n';

    // 組合年齡層
    const ageList = data.audienceAges
        .filter(age => age !== 'customAge')
        .map(age => ageLabels[age])
        .filter(Boolean);

    // 加入自訂年齡
    if (data.customAgeInput) {
        ageList.push(data.customAgeInput);
    }

    // 組合職業
    const occupationList = data.audienceOccupations
        .filter(occ => occ !== 'customOccupation')
        .map(occ => occupationLabels[occ])
        .filter(Boolean);

    // 加入自訂職業
    if (data.customOccupationInput) {
        occupationList.push(data.customOccupationInput);
    }

    // 如果選擇了「全年齡層」，則不需要列出其他年齡
    const ageText = data.audienceAges.includes('all')
        ? '全年齡層'
        : ageList.join('、');

    const occupationText = occupationList.join('、');

    prompt += `${ageText}的${occupationText}\n\n`;

    // 7. 風格要求
    prompt += '【風格與語調】\n';
    if (data.tone === 'customTone' && data.customTone) {
        prompt += `請使用自訂語調：「${data.customTone}」。\n\n`;
    } else {
        prompt += `請使用${toneDescriptions[data.tone]}。\n\n`;
    }

    // 8. 內容長度
    prompt += '【內容長度】\n';
    if (data.length === 'custom' && data.customLength) {
        prompt += `${data.customLength}。\n\n`;
    } else {
        prompt += `${lengthDescriptions[data.length]}。\n\n`;
    }

    // 9. 根據不同行銷目標添加特定要求
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

    // 9. 其他特殊要求
    if (data.additional) {
        prompt += '\n【其他特殊要求】\n';
        prompt += `${data.additional}\n`;
    }

    // 10. 輸出格式
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

// 自訂語調輸入控制
document.querySelectorAll('input[name="tone"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const customToneContainer = document.getElementById('customToneContainer');
        if (this.value === 'customTone') {
            customToneContainer.classList.remove('hidden');
            document.getElementById('customTone').focus();
        } else {
            customToneContainer.classList.add('hidden');
        }
    });
});

// 行銷情境描述顯示與自訂輸入
document.querySelectorAll('input[name="scenario"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const descriptionContainer = document.getElementById('scenarioDescription');
        const descriptionText = descriptionContainer.querySelector('p');
        const customScenarioContainer = document.getElementById('customScenarioContainer');

        if (scenarioDescriptions[this.value]) {
            descriptionText.textContent = scenarioDescriptions[this.value];
            descriptionContainer.classList.remove('hidden');
        } else {
            descriptionContainer.classList.add('hidden');
        }

        if (this.value === 'customScenario') {
            customScenarioContainer.classList.remove('hidden');
            document.getElementById('customScenario').focus();
        } else {
            customScenarioContainer.classList.add('hidden');
        }
    });
});

// 年齡層「其他」選項控制
document.getElementById('customAgeCheckbox').addEventListener('change', function() {
    const customAgeContainer = document.getElementById('customAgeContainer');
    if (this.checked) {
        customAgeContainer.classList.remove('hidden');
        document.getElementById('customAgeInput').focus();
    } else {
        customAgeContainer.classList.add('hidden');
        document.getElementById('customAgeInput').value = '';
    }
    updateAudienceSummary();
});

// 職業「其他」選項控制
document.getElementById('customOccupationCheckbox').addEventListener('change', function() {
    const customOccupationContainer = document.getElementById('customOccupationContainer');
    if (this.checked) {
        customOccupationContainer.classList.remove('hidden');
        document.getElementById('customOccupationInput').focus();
    } else {
        customOccupationContainer.classList.add('hidden');
        document.getElementById('customOccupationInput').value = '';
    }
    updateAudienceSummary();
});

// 需求模板摺疊控制
(function setupRequirementToggle() {
    const toggleBtn = document.getElementById('toggleRequirementBtn');
    const fields = document.getElementById('requirementFields');
    const label = document.getElementById('requirementToggleLabel');
    const icon = document.getElementById('requirementToggleIcon');

    if (!toggleBtn || !fields) return;

    toggleBtn.setAttribute('aria-controls', 'requirementFields');
    toggleBtn.setAttribute('aria-expanded', 'false');

    toggleBtn.addEventListener('click', function() {
        const isHidden = fields.classList.toggle('hidden');
        const expanded = !isHidden;
        if (label) {
            label.textContent = expanded ? '收合區塊' : '展開填寫';
        }
        if (icon) {
            icon.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }
        toggleBtn.setAttribute('aria-expanded', expanded.toString());
    });
})();

// 受眾選擇 Chips 更新
document.querySelectorAll('input[name="audienceAge"]').forEach(cb => {
    cb.addEventListener('change', updateAudienceSummary);
});
document.querySelectorAll('input[name="audienceOccupation"]').forEach(cb => {
    cb.addEventListener('change', updateAudienceSummary);
});

document.getElementById('customAgeInput').addEventListener('input', updateAudienceSummary);
document.getElementById('customOccupationInput').addEventListener('input', updateAudienceSummary);

// 清空按鈕
const clearAgeBtn = document.getElementById('clearAgeBtn');
if (clearAgeBtn) {
    clearAgeBtn.addEventListener('click', function() {
        document.querySelectorAll('input[name="audienceAge"]').forEach(cb => {
            cb.checked = false;
        });
        document.getElementById('customAgeCheckbox').checked = false;
        document.getElementById('customAgeContainer').classList.add('hidden');
        document.getElementById('customAgeInput').value = '';
        updateAudienceSummary();
    });
}

const clearOccupationBtn = document.getElementById('clearOccupationBtn');
if (clearOccupationBtn) {
    clearOccupationBtn.addEventListener('click', function() {
        document.querySelectorAll('input[name="audienceOccupation"]').forEach(cb => {
            cb.checked = false;
        });
        document.getElementById('customOccupationCheckbox').checked = false;
        document.getElementById('customOccupationContainer').classList.add('hidden');
        document.getElementById('customOccupationInput').value = '';
        updateAudienceSummary();
    });
}

updateAudienceSummary();

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 可以在這裡添加初始化邏輯
    console.log('行銷 Prompt 生成器已就緒！');
});
