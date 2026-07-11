// init-testimonials.js
document.addEventListener('DOMContentLoaded', function(){
  const recSection = document.querySelector('#recommendations');
  if(!recSection) return;

  // find existing Bootstrap carousel items if still present
  const items = Array.from(recSection.querySelectorAll('.carousel-inner .item'));
  const data = items.map(it=>{
    const texto = (it.querySelector('.panel-body p[data-i18n]') || it.querySelector('.panel-body p'))?.textContent.trim() || '';
    const nameEl = it.querySelector('.media-body .media-heading a') || it.querySelector('.media-body h4') || it.querySelector('.media-body .media-heading');
    const nome = nameEl ? nameEl.textContent.trim() : '';
    const roleEl = it.querySelector('.media-body .small') || it.querySelector('.media-body p.small') || it.querySelector('.media-body .media-sub');
    const cargo = roleEl ? roleEl.textContent.trim() : '';
    const avatarEl = it.querySelector('.media-left img') || it.querySelector('img');
    const avatar = avatarEl ? avatarEl.src : '';
    const linkedinEl = it.querySelector('.media-right a') || it.querySelector('.media-body a');
    const linkedin = linkedinEl ? linkedinEl.href : '';
    return {texto, nome, cargo, linkedin, avatar};
  });

  // full multilingual data for recommendations (text per language)
  const suppliedData = [
  {
    nome: "Kentaro Mori",
    cargo: "Startup Builder | Engineering Leader | Scaling Tech for High-Growth Businesses",
    linkedin: "https://www.linkedin.com/in/kenmori/",
    texto: {
      en: "I had the pleasure of working with Jackson on the Kora project, where he contributed as a Java Backend Developer. Jackson is a reliable, technically strong engineer with a practical approach to solving problems. He consistently delivered with speed, collaborated very well with the team, and helped move key project initiatives forward.",
      pt: "Tive o prazer de trabalhar com o Jackson no projeto Kora, onde ele atuou como Desenvolvedor Backend Java. Jackson é um engenheiro confiável, tecnicamente forte e com uma abordagem prática para resolver problemas. Ele entregou consistentemente com rapidez, colaborou muito bem com a equipe e ajudou a impulsionar iniciativas importantes do projeto.",
      es: "Tuve el placer de trabajar con Jackson en el proyecto Kora, donde contribuyó como Desarrollador Backend Java. Jackson es un ingeniero confiable, técnicamente sólido y con un enfoque práctico para resolver problemas. Entregó constantemente con rapidez, colaboró muy bien con el equipo y ayudó a impulsar iniciativas clave del proyecto."
    }
  },
  {nome: "Rômulo Paiva", cargo: "CSPO® | Product Owner | Product Manager at Superbid", linkedin: "https://www.linkedin.com/in/romulopaiva/", texto: { en: "I had the opportunity to work with Jackson for three years at Superbid, during which I served as his PM. He was our backend Java developer and stood out not only for his technical expertise but also for the additional value he brought to the team. As the owner of a programming channel on YouTube and a teacher of both in-person and Udemy courses, Jackson went far beyond coding: he masterfully documented every workflow he was involved in, covering both the technical aspects and the business rules. Without a doubt, he is a complete professional who will make a significant contribution to any company lucky enough to have him on their team.", pt: "Tive a oportunidade de trabalhar com o Jackson por três anos na Superbid, período em que atuei como seu PM. Ele foi nosso desenvolvedor backend Java e se destacou não apenas pela expertise técnica, mas também pelo valor adicional que trouxe para a equipe. Como dono de um canal de programação no YouTube e professor em cursos presenciais e na Udemy, Jackson foi muito além do código: documentou com maestria todos os fluxos de trabalho em que esteve envolvido, cobrindo tanto os aspectos técnicos quanto as regras de negócio. Sem dúvida, é um profissional completo que fará uma contribuição significativa para qualquer empresa que tiver a sorte de tê-lo na equipe.", es: "Tuve la oportunidad de trabajar con Jackson durante tres años en Superbid, período en el que fui su PM. Fue nuestro desarrollador backend Java y se destacó no solo por su experiencia técnica, sino también por el valor adicional que aportó al equipo. Como dueño de un canal de programación en YouTube y profesor en cursos presenciales y en Udemy, Jackson fue mucho más allá del código: documentó magistralmente cada flujo de trabajo en el que participó, cubriendo tanto los aspectos técnicos como las reglas de negocio. Sin duda, es un profesional completo que hará una contribución significativa a cualquier empresa que tenga la suerte de contar con él en su equipo." }},
  {nome: "Francélio Alencar", cargo: "Tech Lead | Engenheiro de Software Sênior | Especialista em Microservices | Java, Spring Boot, NestJS, AWS", linkedin: "https://www.linkedin.com/in/francelio-alencar/", texto: { en: "It is with great enthusiasm that I recommend Jackson Felipe Magnabosco, an exceptional Senior Software Engineer with whom I have the privilege of working directly at Superbid, where I serve as Technical Lead. Jackson stands out for his expertise in back-end development and knowledge of AWS tools, delivering scalable solutions that significantly optimize Superbid's systems, one of the largest digital auction platforms in Latin America. Proactive, collaborative, and always striving for excellence, Jackson is an outstanding professional who adds value to any team.", pt: "É com grande entusiasmo que recomendo Jackson Felipe Magnabosco, um Engenheiro de Software Sênior excepcional com quem tenho o privilégio de trabalhar diretamente na Superbid, onde atuo como Technical Lead. Jackson se destaca por sua expertise em desenvolvimento back-end e conhecimento em ferramentas AWS, entregando soluções escaláveis que otimizam significativamente os sistemas da Superbid, uma das maiores plataformas de leilão digital da América Latina. Proativo, colaborativo e sempre buscando a excelência, Jackson é um profissional excepcional que agrega valor a qualquer equipe.", es: "Es con gran entusiasmo que recomiendo a Jackson Felipe Magnabosco, un Ingeniero de Software Senior excepcional con quien tengo el privilegio de trabajar directamente en Superbid, donde me desempeño como Technical Lead. Jackson se destaca por su experiencia en desarrollo back-end y su conocimiento de herramientas de AWS, entregando soluciones escalables que optimizan significativamente los sistemas de Superbid, una de las plataformas de subastas digitales más grandes de América Latina. Proactivo, colaborativo y siempre buscando la excelencia, Jackson es un profesional excepcional que agrega valor a cualquier equipo." }},
  {nome: "Jonathan Jesus", cargo: "Senior Frontend Engineer | Javascript + Typescript | ReactJS & NextJS | NodeJS | Performance & Clean Code", linkedin: "https://www.linkedin.com/in/jonathan-jesus-173a40145/", texto: { en: "Jackson is one of the most dedicated professionals I've had the pleasure of working with. He's not afraid of a challenge, seeing it as an opportunity to hone his skills. His curiosity and willingness to learn make him a constantly evolving professional. I wouldn't hesitate to recommend him for any role that demands determination, curiosity, and a focus on results.", pt: "Jackson é um dos profissionais mais dedicados com quem já tive o prazer de trabalhar. Ele não tem medo de desafios, vendo-os como uma oportunidade de aprimorar suas habilidades. Sua curiosidade e disposição para aprender fazem dele um profissional em constante evolução. Não hesitaria em recomendá-lo para qualquer função que exija determinação, curiosidade e foco em resultados.", es: "Jackson es uno de los profesionales más dedicados con los que he tenido el placer de trabajar. No le teme a los desafíos, sino que los ve como una oportunidad para perfeccionar sus habilidades. Su curiosidad y disposición para aprender lo convierten en un profesional en constante evolución. No dudaría en recomendarlo para cualquier puesto que exija determinación, curiosidad y enfoque en resultados." }},
  {nome: "Ezequiel Menegas", cargo: "Developer Sr at @AGROTIS | CSPO | AI Agents LangChain | Agro | Spec Driven Development", linkedin: "https://www.linkedin.com/in/ezequiel-me/", texto: { en: "I studied technology with him in college, and I've always admired his dedication and respect for everyone around him. He stood out not only for his technical knowledge, but also for his ability to collaborate and help others understand concepts. Today, as a teacher, I know he brings that same passion for technology and learning to his students.", pt: "Estudei tecnologia com ele na faculdade, e sempre admirei sua dedicação e respeito por todos ao seu redor. Ele se destacou não apenas por seu conhecimento técnico, mas também pela sua capacidade de colaborar e ajudar os outros a entender conceitos. Hoje, como professor, sei que ele leva essa mesma paixão pela tecnologia e pelo aprendizado para seus alunos.", es: "Estudié tecnología con él en la universidad, y siempre admiré su dedicación y respeto por todos a su alrededor. Se destacó no solo por su conocimiento técnico, sino también por su capacidad para colaborar y ayudar a otros a entender conceptos. Hoy, como profesor, sé que lleva esa misma pasión por la tecnología y el aprendizaje a sus alumnos." }},
  {nome: "Lucas Gulart da Silveira", cargo: "Co-founder of Rancho | Software Engineer | NestJS · TypeScript · Node.js · Expo", linkedin: "https://www.linkedin.com/in/gulartlucas/", texto: { en: "Jackson stands out in development with his remarkable skills. He tackles technical challenges effectively, demonstrating consistent mastery in the field. I've had the chance to work with him on different projects and companies, always providing an excellent experience and adding great value to the solutions developed.", pt: "Jackson destaca-se no desenvolvimento com suas habilidades notáveis. Ele enfrenta desafios técnicos com eficácia, demonstrando um domínio consistente nessa área. Tive a oportunidade de trabalhar com ele em diferentes projetos e empresas, sempre proporcionando uma experiência excelente e agregando muito às soluções desenvolvidas.", es: "Jackson se destaca en el desarrollo con sus notables habilidades. Enfrenta los desafíos técnicos con eficacia, demostrando un dominio consistente en esta área. Tuve la oportunidad de trabajar con él en diferentes proyectos y empresas, siempre brindando una experiencia excelente y aportando gran valor a las soluciones desarrolladas." }},
  {nome: "Levi Santos Rocha", cargo: "Senior Fullstack Engineer | React | Next | React Native | NodeJs | Python | AWS", linkedin: "https://www.linkedin.com/in/levi-sr93/", texto: { en: "Jackson is an outstanding professional and a valuable member of our team. Throughout the time we worked together, I saw his enormous dedication and passion for programming. I also want to highlight his work ethic and contagious positive attitude.", pt: "Jackson é um profissional de excelência e um membro valioso em nossa equipe. Em todo o período em que trabalhamos juntos, pude ver sua enorme dedicação e paixão pela programação. Destaco também sua ética de trabalho e atitude positiva contagiosa.", es: "Jackson es un profesional excepcional y un miembro valioso de nuestro equipo. Durante todo el tiempo que trabajamos juntos, pude ver su enorme dedicación y pasión por la programación. También destaco su ética de trabajo y su actitud positiva contagiosa." }},
  {nome: "Patrick Berlatto Piccini", cargo: "Solutions Architect | Back-End Developer | DevOps | Python | Django | DRF | Automation | Cloud", linkedin: "https://www.linkedin.com/in/patrick-berlatto-piccini/", texto: { en: "Jackson is a professional with exceptional skills in software development. His relentless pursuit of excellence leads to continuous improvements in the code. He values collaboration, working harmoniously with colleagues and sharing knowledge through code reviews. Jackson plays a crucial role in the project's success.", pt: "Jackson é um profissional com habilidades excepcionais no desenvolvimento de software. Sua busca incansável pela excelência resulta em melhorias contínuas no código. Ele valoriza a colaboração, trabalhando harmoniosamente com os colegas e compartilhando conhecimento por meio de code reviews. Jackson desempenha um papel crucial no sucesso do projeto.", es: "Jackson es un profesional con habilidades excepcionales en el desarrollo de software. Su búsqueda incansable de la excelencia resulta en mejoras continuas en el código. Valora la colaboración, trabajando en armonía con sus colegas y compartiendo conocimiento a través de revisiones de código. Jackson desempeña un papel crucial en el éxito del proyecto." }}
  ];

  // merge suppliedData where parsed items have missing fields (keeps structure)
  const merged = data.map((d,i)=>{
    const s = suppliedData[i]||{};
    return {
      texto: s.texto || (d.texto?{en:d.texto,pt:d.texto,es:d.texto}: {en:'',pt:'',es:''}),
      nome: d.nome || s.nome || '',
      cargo: d.cargo || s.cargo || '',
      linkedin: d.linkedin || s.linkedin || '',
      avatar: d.avatar || s.avatar || ''
    };
  });

  // remove original carousel markup to avoid duplicate visuals
  const originalCarousel = recSection.querySelector('#carousel-recommendations');
  if(originalCarousel) originalCarousel.remove();

  // create mount point
  const mount = document.createElement('div'); mount.id='testimonials-root'; recSection.appendChild(mount);

  // if no items found, use a small fallback (keeps site stable)
  const fallback = [
    {texto:'Excelente profissional e educadora.', nome:'Arthur Oliveira Alves', cargo:'Senior Frontend Engineer', linkedin:'#', avatar:'https://via.placeholder.com/150'}
  ];

  const carousel = TestimonialsCarousel.init('#testimonials-root', merged.length?merged:fallback, {autoplay:true, interval:5500, loop:true});

  // update testimonial texts when language changes
  if(window.i18next && window.i18next.on){
    i18next.on('languageChanged', function(lang){
      document.querySelectorAll('#testimonials-root .testimonial-text').forEach(el=>{
        const val = (lang==='pt') ? el.dataset.textPt : (lang==='es' ? el.dataset.textEs : el.dataset.textEn);
        if(val!==undefined) el.textContent = val;
      });
      // also update section title via i18next updateContent call already performed elsewhere
    });
  }
});
