/* Local UI translations. Beach names and forecast values retain their meaning. */
(() => {
  let language = 'pt';
  try { if (localStorage.getItem('mare-language') === 'en') language = 'en'; } catch {}
  const entries = {
    'Conta':'Account','A tua conta MARÉ':'Your MARÉ account','Fechar':'Close','Email':'Email','Palavra-passe':'Password','Entrar':'Sign in','Criar conta':'Create account','Guardar perfil na conta':'Save profile to account','Terminar sessão':'Sign out',
    'Mínimo de 12 caracteres. Esta base ainda não tem recuperação de palavra-passe.':'At least 12 characters. Password recovery is not available in this foundation yet.',
    'Versão de desenvolvimento. Pagamentos e envio de alertas ainda não estão ativos.':'Development version. Payments and alert delivery are not active yet.',
    'Guardado na tua conta':'Saved to your account','Perfil guardado na conta.':'Profile saved to your account.',
    'Não foi possível obter sugestões do servidor. Tenta atualizar.':'Unable to retrieve session suggestions from the server. Try refreshing.',
    'Não foi possível concluir o pedido. Tenta novamente.':'Unable to complete the request. Please try again.',
    'Email ou palavra-passe incorretos.':'Incorrect email or password.','Este email já tem uma conta.':'This email already has an account.',
    'Aguarda um momento antes de tentar novamente.':'Please wait a moment before trying again.',
    'Sessão iniciada.':'Signed in.','Conta criada.':'Account created.','Sessão terminada.':'Signed out.',

    'MARÉ — Sessões na Costa Vicentina': 'MARÉ — Surf sessions on the Vicentina Coast',
    'Previsão de ondas, vento e sugestões de sessões adaptadas ao teu perfil na Costa Vicentina.': 'Wave and wind forecasts with session suggestions tailored to your profile on the Vicentina Coast.',
    'Previsão': 'Forecast',
    'As minhas sessões': 'My sessions',
    'Sobre os dados ↗': 'About the data ↗',
    'PREVISÃO EXPLICÁVEL · BETA': 'EXPLAINABLE FORECAST · BETA',
    'COSTA VICENTINA · SURF À TUA MEDIDA': 'VICENTINA COAST · SURF YOUR WAY',
    'O sítio certo.': 'The right spot.',
    'À tua hora. Ao teu nível.': 'Your time. Your level.',
    'Menos tempo a comparar previsões.': 'Less time comparing forecasts.',
    'Mais tempo a escolher a tua próxima sessão.': 'More time planning your next session.',
    'Encontrar a minha sessão': 'Find my session',
    'COSTA OESTE ↔ COSTA SUL': 'WEST COAST ↔ SOUTH COAST',
    'De Odeceixe a Sagres.': 'From Odeceixe to Sagres.',
    'QUANDO · ONDE · PARA TI': 'WHEN · WHERE · FOR YOU',
    'A tua próxima sessão.': 'Your next session.',
    'Previsões cruzadas com o teu perfil. Cada sugestão tem uma razão.': 'Forecasts matched to your profile. Every suggestion has a reason.',
    'Como escolhemos? ↗': 'How do we choose? ↗',
    'O meu nível': 'My level',
    'Iniciação': 'Beginner',
    'Intermédio': 'Intermediate',
    'Avançado': 'Advanced',
    'Disponibilidade': 'Availability',
    'Qualquer hora com luz': 'Any daylight hours',
    'Manhã · até às 12h': 'Morning · until 12:00',
    'Tarde · depois das 12h': 'Afternoon · from 12:00',
    'Praias': 'Beaches',
    'Toda a Costa Vicentina': 'All Vicentina Coast spots',
    'Só os meus favoritos': 'My favourites only',
    'Encontrar sessões ↗': 'Find sessions ↗',
    'Ajustar as minhas preferências': 'Adjust my preferences',
    'Ondulação mínima ao largo (m)': 'Minimum offshore wave height (m)',
    'Ondulação máxima ao largo (m)': 'Maximum offshore wave height (m)',
    'Vento máximo (km/h)': 'Maximum wind speed (km/h)',
    'Valores iniciais de comparação por perfil, ajustáveis. A ondulação ao largo não é a altura da onda na praia nem uma avaliação de segurança.': 'Adjustable starting values for each profile. Offshore wave height is not breaking-wave height or a safety assessment.',
    'A procurar janelas nos próximos 7 dias…': 'Looking for windows over the next 7 days…',
    'SESSÕES DE 2 HORAS · HORA LOCAL': '2-HOUR SESSIONS · LOCAL TIME',
    'FICA DE OLHO': 'KEEP AN EYE OUT',
    'Uma boa janela nos teus favoritos?': 'A good window at your favourites?',
    'Avalia as tuas praias guardadas com o perfil atual.': 'Check your saved beaches against your current profile.',
    'Compatibilidade mínima': 'Minimum match score',
    'Ativar avisos neste site': 'Enable on-site alerts',
    'Ativa os avisos para consultar as próximas janelas.': 'Enable alerts to check upcoming windows.',
    'Atualização a cada 30 min enquanto esta página estiver aberta. Não envia email, SMS ou notificações com o site fechado.': 'Updates every 30 minutes while this page is open. No email, SMS or notifications are sent while the site is closed.',
    'O meu plano de surf': 'My surf plan',
    'Guardado apenas neste navegador': 'Saved in this browser only',
    'O que significa a compatibilidade de uma sessão?': 'What does a session match score mean?',
    'Esta versão usa regras, não um modelo de inteligência artificial treinado.': 'This version uses rules, not a trained artificial intelligence model.',
    'Compara altura significativa ao largo, vento, período e direção com as tuas preferências e com a orientação aproximada de cada praia. Pontuação: altura 50%, vento 25%, período 15%, exposição 10%. O valor de uma sessão é o pior valor das suas duas horas; os limites têm de ser cumpridos em ambas.': 'We compare offshore significant wave height, wind, period and direction with your preferences and the approximate orientation of each beach. Score weights: height 50%, wind 25%, period 15%, exposure 10%. A session uses the lower score of its two hours; both hours must meet your limits.',
    'Selecionamos até três janelas, sem sobreposição de horários, com luz do dia e pontuação mínima de 60. O horizonte e a ausência de dados locais limitam a confiança. Fundos, marés, correntes, abrigo real e lotação não são avaliados. Uma pontuação alta não garante ondas boas nem condições adequadas ao teu nível. Perfis de iniciação devem confirmar com uma escola local.': 'We select up to three non-overlapping daylight windows with a minimum score of 60. Forecast range and missing local observations limit confidence. Seabed, tides, currents, actual shelter and crowds are not assessed. A high score does not guarantee good waves or suitable conditions for your level. Beginners should check with a local surf school.',
    'O próximo passo para uma previsão hiperlocal com IA é recolher observações reais por praia e usar esse histórico para calibrar e validar a previsão.': 'The next step towards a hyperlocal AI forecast is to collect real observations for each beach and use that history to calibrate and validate forecasts.',
    'O MAR NÃO ESPERA': 'THE SEA WON’T WAIT',
    'Onde vamos surfar?': 'Where shall we surf?',
    'Escolhe a praia. Lê o mar.': 'Pick a beach. Read the sea.',
    'Encontra a tua janela.': 'Find your window.',
    '◌ A consultar a previsão': '◌ Loading the forecast',
    '○ Fonte indisponível': '○ Data source unavailable',
    'Atualizar dados': 'Refresh data',
    'Filtrar praias': 'Filter beaches',
    'Todas as praias': 'All beaches',
    'Costa oeste': 'West coast',
    'Costa sul': 'South coast',
    '♡ Favoritos': '♡ Favourites',
    'Procurar uma praia…': 'Search for a beach…',
    'Procurar uma praia': 'Search for a beach',
    'Altura significativa ao largo.': 'Significant wave height offshore.',
    'As ondas na praia podem ser diferentes.': 'Breaking waves at the beach may differ.',
    'Uma baía entre falésias, virada ao Atlântico.': 'A cliff-lined bay facing the Atlantic.',
    'Costa aberta ao Atlântico, a sul da Carrapateira.': 'Open Atlantic coast, south of Carrapateira.',
    'Uma extensa praia na costa oeste de Vila do Bispo.': 'An extensive beach on the west coast of Vila do Bispo.',
    'Falésias e exposição atlântica, junto à Cordoama.': 'Cliffs and Atlantic exposure, next to Cordoama.',
    'Em Sagres, junto ao cabo. Exposição a oeste, na transição das costas.': 'In Sagres, near the cape. West-facing, where the two coasts meet.',
    'Uma enseada da costa sul, a leste de Sagres.': 'A south-coast cove, east of Sagres.',
    'No extremo norte do Algarve, junto à foz da ribeira de Seixe.': 'At the northern edge of the Algarve, by the mouth of the Seixe river.',
    'Areal atlântico junto à foz da ribeira de Aljezur.': 'An Atlantic beach by the mouth of the Aljezur river.',
    'Praia da costa oeste, a norte da Arrifana.': 'A west-coast beach, north of Arrifana.',
    'Praia aberta da costa oeste, entre a Arrifana e a Carrapateira.': 'An open west-coast beach between Arrifana and Carrapateira.',
    'Areal amplo na Carrapateira, exposto ao Atlântico.': 'A broad beach at Carrapateira, exposed to the Atlantic.',
    'Guardar praia nos favoritos': 'Save beach to favourites',
    'PREVISÃO DO MODELO': 'MODEL FORECAST',
    'Hora local · Portugal': 'Local time · Portugal',
    'Hora da sessão': 'Session time',
    '≈ ONDULAÇÃO': '≈ WAVE HEIGHT',
    '◷ PERÍODO': '◷ PERIOD',
    '↗ VENTO': '↗ WIND',
    'Direção —': 'Direction —',
    'Entre ondas': 'Between waves',
    'O ritmo do dia': 'The rhythm of the day',
    'Ondulação ao largo · m': 'Offshore wave height · m',
    'Hora': 'Time',
    'Ondulação': 'Wave height',
    'Período': 'Period',
    'Vento': 'Wind',
    'Direção do vento': 'Wind direction',
    '↳ Previsão de modelo, sem observação local.': '↳ Model forecast, without local observations.',
    'Ver localização ↗': 'View location ↗',
    'DUAS COSTAS. OUTRO MUNDO.': 'TWO COASTS. ANOTHER WORLD.',
    'Há sempre': 'There’s always',
    'outro horizonte.': 'another horizon.',
    'Onze praias na Costa Vicentina algarvia. Compara a exposição e o vento, de Odeceixe à transição para a costa sul.': 'Eleven beaches on the Algarve’s Vicentina Coast. Compare exposure and wind, from Odeceixe to the south coast.',
    '01 / Costa oeste': '01 / West coast',
    '02 / Costa sul': '02 / South coast',
    'Esquema de localização · seleciona um ponto para ver a praia': 'Location sketch · select a marker to view a beach',
    'Esquema das praias da Costa Vicentina, não é um mapa de navegação': 'Vicentina Coast beach sketch, not a navigation map',
    'MENOS RUÍDO. MAIS MAR.': 'LESS NOISE. MORE OCEAN.',
    'Uma previsão, não uma promessa.': 'A forecast, not a promise.',
    'Dados horários de ondas e vento da': 'Hourly wave and wind data from',
    ', com modelos meteorológicos e marítimos selecionados automaticamente pela fonte. A consulta é feita quando abres o site e pode ser atualizada no botão ↻.': ', using weather and marine models automatically selected by the provider. Data is fetched when you open the site and can be refreshed with the ↻ button.',
    'A altura apresentada é a altura significativa do mar ao largo, não a altura da onda a rebentar. Abrigo, fundos, marés e efeitos locais não são calculados. A indicação offshore/onshore é uma aproximação pela orientação da costa. Confirma as condições no local e os': 'The height shown is offshore significant wave height, not breaking-wave height. Shelter, seabed, tides and local effects are not calculated. Offshore/onshore indications approximate the coastline’s orientation. Check conditions on location and the',
    'avisos do IPMA ↗': 'IPMA marine warnings ↗',
    'Consultar a fonte e os modelos ↗': 'View the data source and models ↗',
    'Fotografia de surf ilustrativa:': 'Illustrative surf photograph:',
    '. Não corresponde a uma webcam local.': '. This is not a local webcam.',
    'Feito para quem vive a Costa Vicentina de prancha debaixo do braço.': 'Made for those who live the Vicentina Coast with a board under their arm.',
    'ATÉ À PRÓXIMA ONDA ↗': 'SEE YOU ON THE NEXT WAVE ↗',
    'Hoje': 'Today',
    'Amanhã': 'Tomorrow',
    'Nenhuma praia encontrada.': 'No beaches found.',
    'Guarda uma praia no coração para a encontrares aqui.': 'Tap a beach’s heart to find it here.',
    'm ao largo': 'm offshore',
    'ao largo': 'offshore',
    'período mín.': 'min. period',
    'vento máx.': 'max. wind',
    'A ler a ondulação…': 'Loading wave data…',
    'Sem dados de ondulação para este dia': 'No wave data for this day',
    'Não foi possível obter dados para esta praia. Tenta atualizar a previsão.': 'Unable to retrieve data for this beach. Try refreshing the forecast.',
    'Ondulação indisponível. Os dados de vento continuam disponíveis.': 'Wave data is unavailable. Wind data is still available.',
    'Vento indisponível. Os dados de ondulação continuam disponíveis.': 'Wind data is unavailable. Wave data is still available.',
    'Previsão horária de ondulação para o dia selecionado': 'Hourly wave-height forecast for the selected day',
    'Vento fraco': 'Light wind',
    'A comparar previsões…': 'Comparing forecasts…',
    'Sem janelas que cumpram os critérios': 'No windows meet your criteria',
    'Perfil de iniciação: comparação indicativa. Confirma a sessão com uma escola; marés, correntes e fundos não são avaliados.': 'Beginner profile: indicative comparison. Check with a surf school; tides, currents and seabed are not assessed.',
    'As sugestões comparam as tuas preferências com dados ao largo. A qualidade local ainda está por validar.': 'Suggestions compare your preferences with offshore data. Local wave quality has yet to be validated.',
    'A LER O ATLÂNTICO': 'READING THE ATLANTIC',
    'A cruzar ondas, vento e o teu perfil…': 'Matching waves, wind and your profile…',
    'As sugestões só aparecem quando os dados necessários estão disponíveis.': 'Suggestions appear only when the required data is available.',
    'SEM FORÇAR UMA ESCOLHA': 'NO FORCED SUGGESTIONS',
    'Escolhe primeiro as tuas praias favoritas.': 'Choose your favourite beaches first.',
    'A previsão está temporariamente indisponível.': 'The forecast is temporarily unavailable.',
    'O mar ainda não encaixa no teu plano.': 'The sea doesn’t fit your plan yet.',
    'Guarda praias no coração, na lista abaixo.': 'Save beaches using the heart in the forecast below.',
    'Não há sugestões sem dados completos de ondas, vento e luz do dia. Tenta atualizar.': 'Complete wave, wind and daylight data is required for suggestions. Try refreshing.',
    'Não encontrámos janelas futuras de duas horas, com luz e compatibilidade mínima de 60, dentro das tuas preferências. Podes consultar os dados de cada praia abaixo.': 'No future two-hour daylight windows match your preferences with a minimum score of 60. You can still check each beach’s forecast below.',
    'Explorar a previsão por praia ↓': 'Explore the forecast by beach ↓',
    '01 / MAIOR COMPATIBILIDADE': '01 / BEST MATCH',
    'Vento fraco · ondulação dentro do teu intervalo em ambas as horas.': 'Light wind · wave height within your range during both hours.',
    'Vento offshore aproximado · ondulação dentro do teu intervalo em ambas as horas.': 'Approximately offshore wind · wave height within your range during both hours.',
    'Vento lateral aproximado · ondulação dentro do teu intervalo em ambas as horas.': 'Approximately cross-shore wind · wave height within your range during both hours.',
    'Vento onshore aproximado · ondulação dentro do teu intervalo em ambas as horas.': 'Approximately onshore wind · wave height within your range during both hours.',
    'Horizonte próximo': 'Near-term forecast',
    'Horizonte mais distante · maior incerteza': 'Longer-range forecast · greater uncertainty',
    'Qualidade local: por validar': 'Local quality: not yet validated',
    'Ver previsão ↗': 'View forecast ↗',
    '+ Guardar': '+ Save',
    'Guardada ✓': 'Saved ✓',
    'Ainda sem sessões guardadas. Escolhe uma sugestão para começares o teu plano.': 'No saved sessions yet. Choose a suggestion to start your plan.',
    'Remover': 'Remove',
    'Não foi possível guardar a alteração neste navegador.': 'Unable to save the change in this browser.',
    'O navegador não permitiu guardar esta sessão.': 'This browser did not allow the session to be saved.',
    'Avisos desligados. Ativa para comparar as tuas praias favoritas.': 'Alerts are off. Enable them to compare your favourite beaches.',
    'Guarda primeiro as tuas praias no coração da previsão.': 'Save your favourite beaches using the heart in the forecast first.',
    'A atualizar as tuas janelas…': 'Updating your windows…',
    'Sem dados suficientes para avaliar avisos. Tenta atualizar a previsão.': 'Not enough data to evaluate alerts. Try refreshing the forecast.',
    'Nenhuma janela cumpre o perfil e o limiar nos favoritos nos próximos 7 dias.': 'No windows at your favourites meet your profile and threshold over the next 7 days.',
    'A ondulação máxima tem de ser maior que a mínima.': 'Maximum wave height must be greater than minimum wave height.',
    'Escolher idioma': 'Choose language'
  };
  const normal = text => text.replace(/\s+/g, ' ').trim();
  const dictionary = new Map(Object.entries(entries).map(([pt,en]) => [normal(pt),en]));
  function translate(text) {
    if (language !== 'en' || !text.trim()) return text;
    const key = normal(text);
    let output = dictionary.get(key);
    if (!output) {
      output = key
        .replace(/^(\d+) janelas com maior compatibilidade · perfil iniciação$/, '$1 best-matching windows · beginner profile')
        .replace(/^(\d+) janelas com maior compatibilidade · perfil intermédio$/, '$1 best-matching windows · intermediate profile')
        .replace(/^(\d+) janelas com maior compatibilidade · perfil avançado$/, '$1 best-matching windows · advanced profile')
        .replace(/^(\d+) \/ OUTRA JANELA$/, '$1 / ANOTHER WINDOW')
        .replace(/^Remover sessão de (.+)$/, 'Remove session at $1')
        .replace(/^Ver previsão de (.+)$/, 'View forecast for $1')
        .replace(/^COSTA OESTE · /, 'WEST COAST · ')
        .replace(/^COSTA SUL · /, 'SOUTH COAST · ')
        .replace(/^SAGRES · EXPOSIÇÃO A OESTE · /, 'SAGRES · WEST-FACING · ')
        .replace(/ · Oeste$/, ' · West')
        .replace(/ · Sul$/, ' · South')
        .replace(/^De ([A-Z—]+)$/, 'From $1')
        .replace(/^Lateral · /, 'Cross-shore · ')
        .replace(/^● Consulta · /, '● Fetched · ')
        .replace(/^◐ Dados parciais · /, '◐ Partial data · ').replace(/^◐ Dados em cache · /,'◐ Cached data · ')
        .replace(/ · Sessão passada$/, ' · Past session')
        .replace(/ \/ 100 na consulta$/, ' / 100 when fetched');
      if (output === key) return text;
    }
    return text.match(/^\s*/)[0] + output + text.match(/\s*$/)[0];
  }
  const textOrigins = new WeakMap(), attrOrigins = new WeakMap();
  const attrs = ['aria-label','placeholder','title','content'];
  function applyTranslations() {
    observer.disconnect();
    document.documentElement.lang = language === 'en' ? 'en-GB' : 'pt-PT';
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT, {acceptNode(node) {
      return node.parentElement?.closest('script,style,[data-no-translate]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }});
    while (walker.nextNode()) {
      const node = walker.currentNode;
      let record = textOrigins.get(node);
      if (!record || node.nodeValue !== record.last) record = {base:node.nodeValue,last:node.nodeValue};
      const translated = translate(record.base);
      if (node.nodeValue !== translated) node.nodeValue = translated;
      record.last = translated;textOrigins.set(node,record);
    }
    document.querySelectorAll('[aria-label],[placeholder],[title],meta[name="description"]').forEach(element => {
      if (element.closest('[data-no-translate]')) return;
      const records = attrOrigins.get(element) || {};
      for (const attr of attrs) {
        const current = element.getAttribute(attr);
        if (current === null || attr === 'content' && element.tagName !== 'META') continue;
        let record = records[attr];
        if (!record || current !== record.last) record = {base:current,last:current};
        const translated = translate(record.base);
        if (current !== translated) element.setAttribute(attr,translated);
        record.last = translated;records[attr]=record;
      }
      attrOrigins.set(element,records);
    });
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.language === language)));
    observer.observe(document.documentElement,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:attrs});
  }
  const observer = new MutationObserver(applyTranslations);
  window.MareI18n = {
    get language(){return language},
    get locale(){return language === 'en' ? 'en-GB' : 'pt-PT'},
    t:translate,
    setLanguage(next) {
      if (!['pt','en'].includes(next)) return;
      language=next;
      try {localStorage.setItem('mare-language',next)}catch{}
      window.dispatchEvent(new CustomEvent('mare:languagechange'));
      applyTranslations();
    },
    apply:applyTranslations
  };
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click',()=>MareI18n.setLanguage(button.dataset.language)));
  applyTranslations();
})();
