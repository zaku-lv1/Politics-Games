// Game state
let currentRound = 0;
let votingHistory = [];
let gameScenarios = [];
let allScenarios = [];

// Game configuration constants
const CONSISTENCY_THRESHOLD = 0.6; // Need 60% of votes for same ideology to get specialized ending

// Fisher-Yates shuffle algorithm for proper randomization
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Define all political parties
const POLITICAL_PARTIES = [
    {
        id: 'progressive',
        name: '未来進歩党',
        icon: 'fas fa-rocket',
        color: '#4CAF50',
        ideology: 'progressive',
        policies: [
            'IT産業の育成と若者雇用創出',
            '再生可能エネルギーへの完全移行',
            '教育の完全無償化',
            'ベーシックインカムの導入'
        ],
        isBad: false
    },
    {
        id: 'youth',
        name: '若者第一党',
        icon: 'fas fa-users',
        color: '#2196F3',
        ideology: 'youth-focused',
        policies: [
            '若者の政治参加促進',
            '学生ローン免除制度',
            '起業支援と税制優遇',
            '深夜交通網の拡充'
        ],
        isBad: false
    },
    {
        id: 'green',
        name: '環境保護党',
        icon: 'fas fa-leaf',
        color: '#8BC34A',
        ideology: 'environmental',
        policies: [
            '自然保護区の拡大',
            'プラスチック完全廃止',
            '有機農業の推進',
            'カーボンニュートラル達成'
        ],
        isBad: false
    },
    {
        id: 'moderate',
        name: '中道改革党',
        icon: 'fas fa-balance-scale',
        color: '#FF9800',
        ideology: 'centrist',
        policies: [
            'バランスの取れた予算配分',
            '段階的な改革推進',
            '全世代型社会保障',
            '持続可能な経済成長'
        ],
        isBad: false
    },
    {
        id: 'welfare',
        name: '福祉充実党',
        icon: 'fas fa-heart',
        color: '#E91E63',
        ideology: 'welfare-focused',
        policies: [
            '医療費の完全無料化',
            '高齢者福祉の充実',
            '子育て支援金の増額',
            '障がい者支援の強化'
        ],
        isBad: false
    },
    {
        id: 'conservative',
        name: '伝統保守党',
        icon: 'fas fa-landmark',
        color: '#795548',
        ideology: 'conservative',
        policies: [
            '伝統文化の保護',
            '財政健全化優先',
            '既存インフラの維持',
            '治安強化と秩序維持'
        ],
        isBad: false
    },
    {
        id: 'corrupt',
        name: '利権優先党',
        icon: 'fas fa-money-bill-wave',
        color: '#607D8B',
        ideology: 'corrupt',
        policies: [
            '特定企業への優遇措置',
            '議員報酬の大幅増額',
            '情報公開の制限',
            '既得権益の保護'
        ],
        isBad: true
    },
    {
        id: 'authoritarian',
        name: '強権統制党',
        icon: 'fas fa-gavel',
        color: '#424242',
        ideology: 'authoritarian',
        policies: [
            '監視社会の構築',
            '言論統制の強化',
            '個人の自由の制限',
            '中央集権化の推進'
        ],
        isBad: true
    }
];

// Define all possible scenarios
function initializeAllScenarios() {
    allScenarios = [
        {
            description: "あなたの町では、公園の整備と図書館の改修が課題になっています。",
            theme: 'infrastructure'
        },
        {
            description: "町の財政が厳しい中、教育と環境のどちらに投資すべきか議論になっています。",
            theme: 'budget'
        },
        {
            description: "新しい交通システムの導入について、意見が分かれています。",
            theme: 'transportation'
        },
        {
            description: "若者の流出が深刻化し、町の活性化が急務となっています。",
            theme: 'youth'
        },
        {
            description: "高齢化が進む中、医療・福祉制度の見直しが求められています。",
            theme: 'welfare'
        },
        {
            description: "地域経済の低迷が続き、雇用創出が重要な課題です。",
            theme: 'economy'
        },
        {
            description: "気候変動への対応として、環境政策の強化が議論されています。",
            theme: 'environment'
        },
        {
            description: "教育格差の是正と次世代育成が重要なテーマとなっています。",
            theme: 'education'
        },
        {
            description: "デジタル化の推進と個人情報保護のバランスが問われています。",
            theme: 'digital'
        },
        {
            description: "治安維持と個人の自由のバランスについて意見が分かれています。",
            theme: 'security'
        },
        {
            description: "文化・芸術振興と財政負担について議論が白熱しています。",
            theme: 'culture'
        },
        {
            description: "地方分権と中央集権のどちらを目指すべきか検討されています。",
            theme: 'governance'
        }
    ];
}

// Select random scenarios for the game
function initializeScenarios() {
    initializeAllScenarios();
    
    // Shuffle and select 5 random scenarios using Fisher-Yates
    const shuffled = shuffleArray(allScenarios);
    gameScenarios = shuffled.slice(0, 5);
}

function startGame() {
    initializeScenarios();
    currentRound = 0;
    votingHistory = [];
    showScreen('game-screen');
    loadRound();
}

// Select parties for this round
function selectPartiesForRound() {
    const goodParties = POLITICAL_PARTIES.filter(p => !p.isBad);
    const badParties = POLITICAL_PARTIES.filter(p => p.isBad);
    
    // 10% chance to include a bad party
    const includeBadParty = Math.random() < 0.1;
    
    let selectedParties = [];
    
    if (includeBadParty && badParties.length > 0) {
        // Select 2 good parties and 1 bad party
        const shuffledGood = shuffleArray(goodParties);
        const shuffledBad = shuffleArray(badParties);
        selectedParties = [...shuffledGood.slice(0, 2), shuffledBad[0]];
    } else {
        // Select 3 good parties
        const shuffledGood = shuffleArray(goodParties);
        selectedParties = shuffledGood.slice(0, 3);
    }
    
    // Shuffle final selection
    return shuffleArray(selectedParties);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function loadRound() {
    if (currentRound >= gameScenarios.length) {
        showFinalScreen();
        return;
    }

    const scenario = gameScenarios[currentRound];
    const parties = selectPartiesForRound();
    scenario.parties = parties;
    
    document.getElementById('round-number').textContent = currentRound + 1;
    document.getElementById('scenario-description').textContent = scenario.description;

    // Create party containers dynamically
    const container = document.querySelector('.candidates-container');
    container.innerHTML = '';
    
    // Add party cards
    parties.forEach((party, index) => {
        const partyCard = document.createElement('div');
        partyCard.className = 'candidate party-card';
        partyCard.style.borderColor = party.color;
        
        partyCard.innerHTML = `
            <div class="candidate-header">
                <h3>${party.name}</h3>
                <span class="candidate-icon" style="color: ${party.color}">
                    <i class="${party.icon}"></i>
                </span>
            </div>
            <div class="candidate-info">
                <h4>政策：</h4>
                <ul>
                    ${party.policies.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>
            <button onclick="vote('${party.id}')" class="btn btn-vote" style="background-color: ${party.color}">
                ${party.name}に投票する
            </button>
        `;
        
        container.appendChild(partyCard);
    });
    
    // Add abstain option
    const abstainCard = document.createElement('div');
    abstainCard.className = 'candidate abstain';
    abstainCard.innerHTML = `
        <div class="candidate-header">
            <h3>投票しない</h3>
            <span class="candidate-icon"><i class="fas fa-bed"></i></span>
        </div>
        <div class="candidate-info">
            <p>「忙しいから」「どうせ変わらないから」と投票に行かない...</p>
            <p class="warning"><i class="fas fa-exclamation-triangle"></i> でも、それで本当にいいの？</p>
        </div>
        <button onclick="vote('abstain')" class="btn btn-abstain">投票しない</button>
    `;
    container.appendChild(abstainCard);
}

function vote(choice) {
    votingHistory.push(choice);
    showResults(choice);
}

function showResults(playerChoice) {
    const scenario = gameScenarios[currentRound];
    const parties = scenario.parties;
    
    // Simulate other voters with realistic distribution
    let votes = {};
    let totalVotes = 0;
    
    if (playerChoice === 'abstain') {
        // Low turnout scenario - bad parties have advantage
        const hasBadParty = parties.some(p => p.isBad);
        
        parties.forEach(party => {
            if (party.isBad) {
                // Bad parties get more votes when turnout is low
                votes[party.id] = 15 + Math.random() * 10;
            } else {
                votes[party.id] = 5 + Math.random() * 8;
            }
            totalVotes += votes[party.id];
        });
        
        // Add player's non-vote
        const abstainVotes = 100 - totalVotes;
        votes.abstain = abstainVotes;
    } else {
        // Higher turnout - good parties have better chances
        parties.forEach(party => {
            if (party.id === playerChoice) {
                votes[party.id] = 25 + Math.random() * 10;
            } else if (party.isBad) {
                votes[party.id] = 8 + Math.random() * 7;
            } else {
                votes[party.id] = 18 + Math.random() * 10;
            }
            totalVotes += votes[party.id];
        });
        
        const abstainVotes = 100 - totalVotes;
        votes.abstain = Math.max(0, abstainVotes);
    }

    // Determine winner
    let winner = null;
    let maxVotes = 0;
    parties.forEach(party => {
        if (votes[party.id] > maxVotes) {
            maxVotes = votes[party.id];
            winner = party;
        }
    });

    // Calculate turnout rate
    const turnoutRate = totalVotes;

    // Display results
    const resultDetails = document.getElementById('result-details');
    let resultHTML = '';
    
    parties.forEach(party => {
        const isWinner = party.id === winner.id;
        resultHTML += `
            <div class="result-bar">
                <div class="result-bar-label">
                    <span style="color: ${party.color}">
                        <i class="${party.icon}"></i> ${party.name}
                        ${isWinner ? '<i class="fas fa-crown"></i>' : ''}
                    </span>
                    <span>${votes[party.id].toFixed(1)}%</span>
                </div>
                <div class="result-bar-container">
                    <div class="result-bar-fill" style="width: ${votes[party.id]}%; background-color: ${party.color}"></div>
                </div>
            </div>
        `;
    });
    
    resultHTML += `
        <div class="result-bar">
            <div class="result-bar-label">
                <span>投票せず</span>
                <span>${votes.abstain.toFixed(1)}%</span>
            </div>
            <div class="result-bar-container">
                <div class="result-bar-fill abstain" style="width: ${votes.abstain}%"></div>
            </div>
        </div>
    `;
    
    resultDetails.innerHTML = resultHTML;

    // Display outcome message
    const outcomeMessage = document.getElementById('outcome-message');
    let outcomeText;
    let outcomeClass;

    if (winner.isBad) {
        // Bad party won
        outcomeText = `
            <h3><i class="fas fa-face-frown"></i> 危険な結果...</h3>
            <p><strong>${winner.name}が勝利しました。</strong></p>
            <p>社会が悪い方向に向かっています。透明性が失われ、市民の権利が制限されていきます...</p>
            ${playerChoice === 'abstain' ? '<p class="warning">投票しなかったことで、このような結果を招いてしまいました。</p>' : ''}
        `;
        outcomeClass = 'bad';
    } else if (playerChoice === 'abstain') {
        outcomeText = `
            <h3><i class="fas fa-face-meh"></i> 投票しなかった結果...</h3>
            <p><strong>${winner.name}が勝利しました。</strong></p>
            <p>あなたの声は届きませんでした。もし投票していたら、結果が変わったかもしれません...</p>
        `;
        outcomeClass = 'neutral';
    } else {
        const playerVoted = playerChoice === winner.id;
        outcomeText = `
            <h3><i class="fas fa-${playerVoted ? 'star' : 'thumbs-up'}"></i> ${playerVoted ? '選んだ政党が勝利！' : '投票ありがとう！'}</h3>
            <p><strong>${winner.name}が勝利しました。</strong></p>
            <p>${playerVoted ? '素晴らしい！あなたの一票が社会を良い方向に導きました！' : '残念ながら別の政党が勝利しましたが、投票したことに意味があります。'}</p>
        `;
        outcomeClass = playerVoted ? 'good' : 'neutral';
    }

    outcomeMessage.innerHTML = outcomeText;
    outcomeMessage.className = outcomeClass;

    // Display stats
    document.getElementById('turnout-rate').textContent = turnoutRate.toFixed(1) + '%';
    
    const votingHistoryDisplay = votingHistory.map(v => {
        if (v === 'abstain') return '<i class="fas fa-xmark"></i>';
        const party = POLITICAL_PARTIES.find(p => p.id === v);
        return party ? `<span style="color: ${party.color}">${party.name}</span>` : v;
    }).join(', ');
    
    document.getElementById('your-votes').innerHTML = votingHistoryDisplay;

    // Update button
    const nextBtn = document.getElementById('next-btn');
    if (currentRound < gameScenarios.length - 1) {
        nextBtn.textContent = '次のラウンドへ';
        nextBtn.onclick = nextRound;
    } else {
        nextBtn.textContent = '結果を見る';
        nextBtn.onclick = showFinalScreen;
    }

    showScreen('result-screen');
}

function nextRound() {
    currentRound++;
    showScreen('game-screen');
    loadRound();
}

function showFinalScreen() {
    const votedCount = votingHistory.filter(v => v !== 'abstain').length;
    const totalRounds = gameScenarios.length;
    
    // Count votes by ideology
    let ideologyCounts = {
        progressive: 0,    // 未来進歩党
        'youth-focused': 0,  // 若者第一党
        environmental: 0,  // 環境保護党
        centrist: 0,       // 中道改革党
        'welfare-focused': 0, // 福祉充実党
        conservative: 0,   // 伝統保守党
        corrupt: 0,        // 利権優先党
        authoritarian: 0,  // 強権統制党
        abstain: 0         // 棄権
    };
    
    votingHistory.forEach(vote => {
        if (vote === 'abstain') {
            ideologyCounts.abstain++;
        } else {
            const party = POLITICAL_PARTIES.find(p => p.id === vote);
            if (party) {
                if (party.id === 'corrupt') {
                    ideologyCounts.corrupt++;
                } else if (party.id === 'authoritarian') {
                    ideologyCounts.authoritarian++;
                } else {
                    ideologyCounts[party.ideology]++;
                }
            }
        }
    });
    
    let finalMessage = '';
    let endingNumber = 0;
    let endingTitle = '';
    let endingClass = '';

    // Determine ending based on voting patterns with more granular branching
    // Priority: Specific bad party patterns > Mixed bad > Complete abstain > Partial abstain > Specific good ideologies > Mixed patterns
    
    const totalBadVotes = ideologyCounts.corrupt + ideologyCounts.authoritarian;
    
    if (ideologyCounts.authoritarian >= 3) {
        // ED20: ファシズムの台頭 - Voted for authoritarian party 3+ times
        endingNumber = 20;
        endingTitle = 'ファシズムの台頭';
        endingClass = 'bad';
        finalMessage = `
            <div class="outcome-message bad">
                <h3><i class="fas fa-gavel"></i> ED${endingNumber}: ${endingTitle}</h3>
                <p><strong>強権統制党が政権を掌握しました...</strong></p>
                <p>監視カメラが町中に設置され、個人のプライバシーは失われました。言論の自由が厳しく制限され、反対意見を述べることさえ危険になっています。</p>
                <p>中央集権化が進み、地方の自治は事実上消滅しました。</p>
                <p class="warning">⚠️ これは民主主義の終焉です。自由は一度失うと取り戻すのが困難です。</p>
                <p><strong>もう一度プレイして、自由な社会を守りましょう！</strong></p>
            </div>
        `;
    } else if (ideologyCounts.corrupt >= 3) {
        // ED19: 腐敗の蔓延 - Voted for corrupt party 3+ times
        endingNumber = 19;
        endingTitle = '腐敗の蔓延';
        endingClass = 'bad';
        finalMessage = `
            <div class="outcome-message bad">
                <h3><i class="fas fa-money-bill-wave"></i> ED${endingNumber}: ${endingTitle}</h3>
                <p><strong>利権優先党が支配する腐敗した社会になりました...</strong></p>
                <p>特定企業への優遇措置により、不公平な競争環境が生まれています。議員報酬は大幅に増額されましたが、市民サービスは削減されました。</p>
                <p>情報公開が制限され、政治の透明性は完全に失われています。</p>
                <p class="warning">⚠️ 腐敗した政治は、社会全体の信頼を失わせます。</p>
                <p><strong>クリーンな政治を目指して、もう一度チャレンジしましょう！</strong></p>
            </div>
        `;
    } else if (totalBadVotes >= 2 && ideologyCounts.corrupt > 0 && ideologyCounts.authoritarian > 0) {
        // ED18: 暗黒時代の到来 - Voted for both types of bad parties
        endingNumber = 18;
        endingTitle = '暗黒時代の到来';
        endingClass = 'bad';
        finalMessage = `
            <div class="outcome-message bad">
                <h3><i class="fas fa-skull-crossbones"></i> ED${endingNumber}: ${endingTitle}</h3>
                <p><strong>腐敗と統制が同時に進行する最悪の事態に...</strong></p>
                <p>利権と強権が結びつき、市民は二重の抑圧に苦しんでいます。経済的にも精神的にも自由が失われた社会となりました。</p>
                <p class="warning">⚠️ 複数の危険な勢力が台頭すると、社会の崩壊は加速します。</p>
                <p><strong>希望ある未来のために、もう一度プレイしましょう！</strong></p>
            </div>
        `;
    } else if (totalBadVotes === 1) {
        // ED17: 危機一髪 - Voted for bad party once
        endingNumber = 17;
        endingTitle = '危機一髪';
        endingClass = 'neutral';
        finalMessage = `
            <div class="outcome-message neutral">
                <h3><i class="fas fa-exclamation-triangle"></i> ED${endingNumber}: ${endingTitle}</h3>
                <p>危険な政党に一度だけ投票してしまいましたが、他の投票で何とかバランスが保たれました。</p>
                <p>社会は危うい状態ですが、まだ取り返しがつきます。次の選挙では、より慎重に政策を見極める必要があります。</p>
                <p><strong>一票の重みを忘れずに、次回はより良い選択を！</strong></p>
            </div>
        `;
    } else if (votedCount === 0) {
        // ED16: 完全無関心 - Never voted
        endingNumber = 16;
        endingTitle = '完全無関心';
        endingClass = 'bad';
        finalMessage = `
            <div class="outcome-message bad">
                <h3><i class="fas fa-user-slash"></i> ED${endingNumber}: ${endingTitle}</h3>
                <p><strong>あなたは一度も投票しませんでした...</strong></p>
                <p>無関心は、悪意ある勢力に力を与えてしまいます。投票しなかったことで、社会は望ましくない方向に進んでしまいました。</p>
                <p>あなたの声は届かず、他者の判断に全てを委ねた結果です。</p>
                <p class="warning">⚠️ 「どうせ変わらない」という無関心が、最も危険な選択です。</p>
                <p><strong>次は勇気を出して投票してみましょう！</strong></p>
            </div>
        `;
    } else if (ideologyCounts.abstain === 4) {
        // ED15: 消極的参加 - Abstained 4 times, voted once
        endingNumber = 15;
        endingTitle = '消極的参加';
        endingClass = 'neutral';
        finalMessage = `
            <div class="outcome-message neutral">
                <h3><i class="fas fa-bed"></i> ED${endingNumber}: ${endingTitle}</h3>
                <p>5回中4回も投票を棄権してしまいました。たった1回の投票では、あなたの声は十分に届きません。</p>
                <p>「忙しい」「面倒」といった理由で参加しないことが、社会の停滞を招いています。</p>
                <p><strong>継続的な参加こそが、本当の変化を生み出します。次回はもっと積極的に！</strong></p>
            </div>
        `;
    } else if (votedCount < 3) {
        // ED14: 不完全燃焼 - Voted 2 times only
        endingNumber = 14;
        endingTitle = '不完全燃焼';
        endingClass = 'neutral';
        finalMessage = `
            <div class="outcome-message neutral">
                <h3><i class="fas fa-face-meh"></i> ED${endingNumber}: ${endingTitle}</h3>
                <p>あなたは${votedCount}回しか投票しませんでした。参加することは素晴らしいですが、まだ不十分です。</p>
                <p>継続的な関心と参加が、社会を変える力になります。</p>
                <p><strong>次回は全てのラウンドで投票して、より大きな影響を与えましょう！</strong></p>
            </div>
        `;
    } else {
        // All rounds voted - Check for specific ideology patterns
        const validIdeologies = Object.keys(ideologyCounts)
            .filter(k => k !== 'corrupt' && k !== 'authoritarian' && k !== 'abstain' && ideologyCounts[k] > 0);
        
        if (validIdeologies.length === 0) {
            // Fallback - shouldn't happen
            endingNumber = 13;
            endingTitle = '民主主義の実践';
            endingClass = 'good';
            finalMessage = `
                <div class="outcome-message good">
                    <h3><i class="fas fa-star"></i> ED${endingNumber}: ${endingTitle}</h3>
                    <p><strong>素晴らしい！あなたは全てのラウンドで投票しました！</strong></p>
                    <p>投票することで、社会に参加し、未来を作ることができます。</p>
                    <p><strong>実際の選挙でも、ぜひ投票に行ってください！</strong></p>
                </div>
            `;
        } else {
            const maxIdeology = validIdeologies.reduce((a, b) => 
                ideologyCounts[a] > ideologyCounts[b] ? a : b
            );
            const maxCount = ideologyCounts[maxIdeology];
            const secondHighest = validIdeologies.length > 1 ? 
                Math.max(...validIdeologies.filter(k => k !== maxIdeology).map(k => ideologyCounts[k])) : 0;
            
            // Perfect consistency (5 votes for one ideology)
            if (maxCount === 5) {
                switch(maxIdeology) {
                    case 'progressive':
                        endingNumber = 1;
                        endingTitle = 'テクノロジー革命';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-rocket"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>完璧な一貫性！あなたは革新的な未来を完全に支持しました！</strong></p>
                                <p>IT産業が爆発的に発展し、若者の雇用が急増しています。再生可能エネルギーへの完全移行が達成され、教育の完全無償化により誰もが学べる理想社会が実現しました。</p>
                                <p>ベーシックインカムの導入により、人々は創造的な活動に専念できるようになりました。</p>
                                <p class="highlight">✨ テクノロジーと教育で、町は世界をリードする都市へ！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'youth-focused':
                        endingNumber = 2;
                        endingTitle = '若者革命';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-users"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>完璧！若者の声が政治を完全に変革しました！</strong></p>
                                <p>学生ローンが完全免除され、起業支援により革新的なスタートアップが続々誕生。深夜交通網の拡充で、24時間活動的な都市が実現しました。</p>
                                <p>若者の政治参加が飛躍的に増加し、新しい時代が到来しました。</p>
                                <p class="highlight">✨ 若者が創る、未来志向の活気ある社会！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'environmental':
                        endingNumber = 3;
                        endingTitle = 'エコトピアの実現';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-leaf"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>完璧！地球に最も優しい理想都市が誕生しました！</strong></p>
                                <p>自然保護区が大幅に拡大され、プラスチックは完全に廃止されました。有機農業が主流となり、町はカーボンネガティブを達成し、世界のモデルとなっています。</p>
                                <p class="highlight">✨ 緑豊かな、完璧に持続可能な楽園へ！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'centrist':
                        endingNumber = 4;
                        endingTitle = '黄金の中道';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-balance-scale"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>完璧なバランス！理想的な調和社会が実現しました！</strong></p>
                                <p>段階的な改革により、全ての予算配分が完璧に最適化されました。全世代型社会保障が完全に整備され、誰もが安心して暮らせる持続可能な経済成長を達成しています。</p>
                                <p class="highlight">✨ 極端に偏らない、完璧な安定と繁栄の道へ！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'welfare-focused':
                        endingNumber = 5;
                        endingTitle = '福祉国家の完成';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-heart"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>完璧！誰もが幸せに暮らせる理想の福祉社会が実現しました！</strong></p>
                                <p>医療費が完全無料化され、高齢者福祉が最高水準に。子育て支援金の大幅増額により、安心して子育てができる環境が完璧に整い、障がい者支援も世界トップクラスになりました。</p>
                                <p class="highlight">✨ 温かい心が溢れる、完璧な支え合いの社会へ！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'conservative':
                        endingNumber = 6;
                        endingTitle = '伝統の継承';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-landmark"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>完璧！伝統と秩序が完全に守られた理想社会が実現しました！</strong></p>
                                <p>伝統文化が完璧に保護され、財政が完全健全化。既存インフラが最適に維持され、治安が最高レベルに強化されることで、極めて安全で秩序ある町になりました。</p>
                                <p class="highlight">✨ 歴史と伝統を完璧に大切にする、盤石な社会へ！✨</p>
                            </div>
                        `;
                        break;
                }
            } else if (maxCount >= 4) {
                // Strong consistency (4 votes for one ideology)
                switch(maxIdeology) {
                    case 'progressive':
                        endingNumber = 7;
                        endingTitle = '革新の道';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-rocket"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>素晴らしい！あなたは革新的な未来を強く支持しました！</strong></p>
                                <p>IT産業が発展し、若者の雇用が増加しています。再生可能エネルギーへの移行が進み、教育の無償化により誰もが学べる社会が実現しました。</p>
                                <p class="highlight">✨ テクノロジーと教育で、町は輝かしい未来へ！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'youth-focused':
                        endingNumber = 8;
                        endingTitle = '若者の時代';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-users"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>完璧です！若者の声が政治を大きく変えました！</strong></p>
                                <p>学生ローンが免除され、起業支援により新しいビジネスが次々と生まれています。若者が活動しやすい環境が整いました。</p>
                                <p class="highlight">✨ 若者が主役の、活気ある社会が実現！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'environmental':
                        endingNumber = 9;
                        endingTitle = '緑の未来';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-leaf"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>素晴らしい！地球に優しい社会が実現しました！</strong></p>
                                <p>自然保護区が拡大され、プラスチックの使用が大幅に削減されました。町は環境先進都市として知られるようになりました。</p>
                                <p class="highlight">✨ 緑豊かな、持続可能な未来へ！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'centrist':
                        endingNumber = 10;
                        endingTitle = '調和の社会';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-balance-scale"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>完璧です！バランスの取れた社会が実現しました！</strong></p>
                                <p>段階的な改革により、予算配分が最適化されました。全世代型社会保障が整備され、持続可能な経済成長が達成されています。</p>
                                <p class="highlight">✨ 極端に偏らない、安定した発展の道へ！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'welfare-focused':
                        endingNumber = 11;
                        endingTitle = '優しい社会';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-heart"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>素晴らしい！誰もが安心して暮らせる社会が実現しました！</strong></p>
                                <p>医療費が無料化され、高齢者福祉が充実しています。子育て支援により、安心して子育てができる環境が整いました。</p>
                                <p class="highlight">✨ 温かい心が溢れる、支え合いの社会へ！✨</p>
                            </div>
                        `;
                        break;
                    
                    case 'conservative':
                        endingNumber = 12;
                        endingTitle = '秩序ある発展';
                        endingClass = 'good';
                        finalMessage = `
                            <div class="outcome-message good happy-end">
                                <h3><i class="fas fa-landmark"></i> ED${endingNumber}: ${endingTitle} <i class="fas fa-star"></i></h3>
                                <p><strong>完璧です！伝統と秩序が守られた社会が実現しました！</strong></p>
                                <p>伝統文化が保護され、財政が健全化されています。安全で秩序ある町になりました。</p>
                                <p class="highlight">✨ 歴史と伝統を大切にする、安定した社会へ！✨</p>
                            </div>
                        `;
                        break;
                }
            } else {
                // Multiple ideologies supported - Check for interesting combinations
                const sortedIdeologies = validIdeologies.sort((a, b) => ideologyCounts[b] - ideologyCounts[a]);
                const topTwo = sortedIdeologies.slice(0, 2);
                const maxCount = ideologyCounts[sortedIdeologies[0]];
                
                // Check for moderate consistency with abstentions (3 votes for one ideology)
                if (maxCount === 3 && validIdeologies.length === 1) {
                    endingNumber = 13;
                    endingTitle = '揺らぐ信念';
                    endingClass = 'neutral';
                    finalMessage = `
                        <div class="outcome-message neutral">
                            <h3><i class="fas fa-question"></i> ED${endingNumber}: ${endingTitle}</h3>
                            <p>一つの方向性を持ちながらも、時々投票を棄権してしまいました。</p>
                            <p>信念を持つことは大切ですが、継続的な参加がなければその効果は限定的です。</p>
                            <p><strong>次回は全てのラウンドで投票して、より大きな影響を！</strong></p>
                        </div>
                    `;
                }
                // Check for specific ideology combinations
                else if (topTwo.includes('progressive') && topTwo.includes('environmental')) {
                    endingNumber = 21;
                    endingTitle = 'サステナブル革新';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good">
                            <h3><i class="fas fa-seedling"></i> ED${endingNumber}: ${endingTitle}</h3>
                            <p><strong>素晴らしい組み合わせ！技術と環境の両立を目指しました！</strong></p>
                            <p>クリーンテクノロジーが発展し、環境に優しい革新的な社会が実現しています。</p>
                            <p><strong>持続可能な発展こそが、真の未来です！</strong></p>
                        </div>
                    `;
                } else if (topTwo.includes('youth-focused') && topTwo.includes('progressive')) {
                    endingNumber = 22;
                    endingTitle = '若き革新者たち';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good">
                            <h3><i class="fas fa-lightbulb"></i> ED${endingNumber}: ${endingTitle}</h3>
                            <p><strong>完璧な組み合わせ！若者と技術が融合しました！</strong></p>
                            <p>若い起業家たちが最新技術を駆使し、新しい時代を切り開いています。</p>
                            <p><strong>若さと革新が、未来を創造します！</strong></p>
                        </div>
                    `;
                } else if (topTwo.includes('welfare-focused') && topTwo.includes('centrist')) {
                    endingNumber = 23;
                    endingTitle = '思いやりと現実主義';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good">
                            <h3><i class="fas fa-handshake"></i> ED${endingNumber}: ${endingTitle}</h3>
                            <p><strong>バランスの良い選択！福祉と財政の両立を目指しました！</strong></p>
                            <p>現実的な予算の範囲内で、最大限の福祉が実現されています。</p>
                            <p><strong>理想と現実のバランスが、持続可能な社会を作ります！</strong></p>
                        </div>
                    `;
                } else {
                    // Generic diversity ending
                    endingNumber = 24;
                    endingTitle = '多様性の尊重';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good">
                            <h3><i class="fas fa-star"></i> ED${endingNumber}: ${endingTitle}</h3>
                            <p><strong>素晴らしい！あなたは全てのラウンドで投票しました！</strong></p>
                            <p>様々な政党に投票することで、多角的な視点から政治を考えることができました。</p>
                            <p>柔軟な判断力こそが、複雑な現代社会に必要な資質です。</p>
                            <p><strong>投票を続けることで、社会はより良い方向に進みます！</strong></p>
                        </div>
                    `;
                }
            }
        }
    }

    document.getElementById('final-message').innerHTML = finalMessage;
    showScreen('final-screen');
}

function restartGame() {
    startGame();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeScenarios();
});
