const dimensions = {
  skill: ["excel","python","sql","数据分析","问卷","用户调研","ai","ppt","产品","运营","招聘","人力资源","市场","内容","活动策划"],
  experience: ["实习","项目","社团","校园","调研","运营","活动","数据","用户","管理","公众号","小红书","社群"],
  soft: ["沟通","协作","学习","责任心","执行","表达","分析","复盘","逻辑"],
  industry: ["互联网","咨询","快消","金融","教育","人力资源","电商","科技","新媒体"]
};

function textIncludes(text, keyword){ return text.toLowerCase().includes(keyword.toLowerCase()); }
function getHits(source, target, arr){
  return arr.filter(k => textIncludes(target,k)).map(k => ({ word:k, matched:textIncludes(source,k) }));
}
function unique(arr){ return [...new Set(arr)]; }

function fillExample(){
  document.getElementById('resume').value = `浙江大学工商管理专业大一学生。曾参与校园二手教材市场调研，负责问卷设计、访谈整理、Excel数据分析和报告撰写。担任社团宣传干事，运营公众号和社群，策划线上活动，具备较强沟通协作、内容编辑、PPT展示和项目复盘能力。对互联网产品、用户增长和AI提效HR方向感兴趣。`;
  document.getElementById('jd').value = `产品运营实习生岗位：负责用户调研、竞品分析、数据分析、内容运营和活动策划；协助完成用户增长方案，跟踪运营数据并输出复盘报告。要求熟练使用Excel和PPT，具备良好的沟通能力、逻辑分析能力、学习能力，有校园项目、社群运营或新媒体经验优先。`;
}

function analyzeMatch(){
  const resume = document.getElementById('resume').value.trim();
  const jd = document.getElementById('jd').value.trim();
  if(!resume || !jd){ alert('请先输入简历和岗位JD'); return; }

  const skillHits = getHits(resume,jd,dimensions.skill);
  const expHits = getHits(resume,jd,dimensions.experience);
  const softHits = getHits(resume,jd,dimensions.soft);
  const industryHits = getHits(resume,jd,dimensions.industry);
  const allHits = [...skillHits,...expHits,...softHits,...industryHits];
  const jdKeywords = allHits.filter(x=>x.word);
  const matched = allHits.filter(x=>x.matched).map(x=>x.word);
  const missed = allHits.filter(x=>!x.matched).map(x=>x.word);

  const base = jdKeywords.length ? Math.round(matched.length / jdKeywords.length * 100) : 55;
  const lengthBonus = resume.length > 120 ? 6 : 0;
  const score = Math.min(98, Math.max(35, base + lengthBonus));

  let level = '保底岗 / 可尝试';
  let strategy = '建议作为保底岗位投递，同时优先补齐岗位关键词，避免简历初筛时被系统过滤。';
  if(score >= 82){ level = '高匹配岗位 / 优先投递'; strategy = '建议优先投递，并针对岗位JD微调简历首屏内容，突出最相关的项目成果。'; }
  else if(score >= 65){ level = '推荐投递 / 重点优化'; strategy = '建议投递，但需要在简历中补充岗位关键词，并把相关经历改写得更具体、更数据化。'; }

  const profile = [];
  if(/工商|管理|市场|经济|计算机|法学|传媒/.test(resume)) profile.push('专业背景：已识别到与商业、管理或岗位相关的学习背景');
  if(/实习|项目|社团|校园|调研/.test(resume)) profile.push('经历基础：具备项目、社团或调研类经历，可用于支撑岗位匹配');
  if(/数据|excel|python|sql|分析/.test(resume.toLowerCase())) profile.push('技能标签：具备数据处理或分析相关能力');
  if(/沟通|协作|表达|运营|活动/.test(resume)) profile.push('软性能力：具备沟通协作、活动执行或运营表达能力');
  if(profile.length === 0) profile.push('画像不足：建议补充专业、项目、技能、职业兴趣等信息');

  const keywordHTML = unique(matched).map(k=>`<li>已匹配：${k}</li>`).join('') || '<li>暂无明显匹配关键词</li>';
  const advice = unique(missed).slice(0,8).map(k=>`在简历中补充或强化【${k}】相关经历、技能或成果描述`);
  if(advice.length === 0) advice.push('当前简历关键词覆盖较好，建议继续强化成果量化，例如人数、增长率、转化率、完成周期等。');

  const rewrite = buildRewrite(matched, missed);

  document.getElementById('result').classList.remove('hidden');
  document.getElementById('scoreText').innerText = score + '%';
  document.getElementById('progressBar').style.width = score + '%';
  document.getElementById('jobLevel').innerText = level;
  document.getElementById('profileList').innerHTML = profile.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('keywordList').innerHTML = keywordHTML;
  document.getElementById('adviceList').innerHTML = advice.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('strategyText').innerText = strategy;
  document.getElementById('rewriteText').innerText = rewrite;
  document.getElementById('heroScore').innerText = score + '%';
}

function buildRewrite(matched, missed){
  const m = unique(matched).slice(0,5).join('、') || '岗位相关能力';
  const need = unique(missed).slice(0,3).join('、') || '数据化成果';
  return `建议将经历改写为：围绕${m}等能力，参与/负责相关项目，从需求调研、方案设计、执行推进到结果复盘完整跟进，并通过${need}等关键词强化与岗位JD的对应关系。表达时建议采用“动作 + 方法 + 结果”的结构，例如：负责用户调研与数据整理，使用Excel完成样本分析，输出运营优化建议，支持活动方案迭代。`;
}

function resetAll(){
  document.getElementById('resume').value='';
  document.getElementById('jd').value='';
  document.getElementById('result').classList.add('hidden');
  document.getElementById('heroScore').innerText='86%';
}
