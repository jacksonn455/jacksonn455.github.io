// Função para detectar país e determinar idioma
async function detectCountryAndLanguage() {
  // Lista de APIs gratuitas para detecção de geolocalização
  const geoAPIs = [
    {
      url: 'https://ipapi.co/json/',
      countryField: 'country_code'
    },
    {
      url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
      countryField: 'country_code2'
    },
    {
      url: 'https://ipwhois.app/json/',
      countryField: 'country_code'
    }
  ];

  for (const api of geoAPIs) {
    try {
      // Criar timeout manual usando AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos
      
      const response = await fetch(api.url, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) continue;
      
      const data = await response.json();
      const countryCode = data[api.countryField];
      
      if (countryCode) {
        const detectedLanguage = getLanguageFromCountry(countryCode);
        console.log(`País detectado: ${data.country || data.country_name || 'Desconhecido'} (${countryCode}), idioma: ${detectedLanguage}`);
        return detectedLanguage;
      }
    } catch (error) {
      console.log(`Falha na API ${api.url}:`, error);
      continue; // Tenta próxima API
    }
  }
  
  // Fallback final para detecção de idioma do navegador
  console.log('Todas as APIs de geolocalização falharam, usando detecção de idioma do navegador');
  const browserLang = navigator.language || navigator.languages[0];
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('es')) return 'es';
  return 'en';
}

function getLanguageFromCountry(countryCode) {
  // Mapear países para idiomas
  const countryLanguageMap = {
    // Países que falam português
    'BR': 'pt', // Brasil
    'PT': 'pt', // Portugal
    'AO': 'pt', // Angola
    'MZ': 'pt', // Moçambique
    'CV': 'pt', // Cabo Verde
    'GW': 'pt', // Guiné-Bissau
    'ST': 'pt', // São Tomé e Príncipe
    'TL': 'pt', // Timor-Leste
    'MO': 'pt', // Macau
    
    // Países que falam espanhol
    'ES': 'es', // Espanha
    'AR': 'es', // Argentina
    'MX': 'es', // México
    'CO': 'es', // Colômbia
    'PE': 'es', // Peru
    'VE': 'es', // Venezuela
    'CL': 'es', // Chile
    'EC': 'es', // Equador
    'GT': 'es', // Guatemala
    'CU': 'es', // Cuba
    'BO': 'es', // Bolívia
    'DO': 'es', // República Dominicana
    'HN': 'es', // Honduras
    'PY': 'es', // Paraguai
    'SV': 'es', // El Salvador
    'NI': 'es', // Nicarágua
    'CR': 'es', // Costa Rica
    'PA': 'es', // Panamá
    'UY': 'es', // Uruguai
    'GQ': 'es', // Guiné Equatorial
    'PR': 'es', // Porto Rico
    
    // Outros países falam inglês por padrão
  };
  
  return countryLanguageMap[countryCode] || 'en';
}

document.addEventListener("DOMContentLoaded", async function () {
  // Verificar se usuário já tem preferência salva
  const savedLanguage = localStorage.getItem('userPreferredLanguage');
  
  let detectedLanguage;
  if (savedLanguage) {
    // Usar idioma salvo pelo usuário
    detectedLanguage = savedLanguage;
    console.log(`Usando idioma salvo pelo usuário: ${savedLanguage}`);
  } else {
    // Detectar idioma baseado no país do usuário
    detectedLanguage = await detectCountryAndLanguage();
  }
  
  i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
      lng: detectedLanguage, // Usar idioma detectado por país ou salvo pelo usuário
      fallbackLng: "en",
      detection: {
        // Desabilitar detecção automática do navegador já que estamos usando detecção por país
        order: ['querystring', 'cookie', 'localStorage'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage', 'cookie'],
      },
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          translation: {
            // Menu
            portfolio: "PORTFOLIO",
            education: "EDUCATION",
            curriculum: "RESUME",
            certificates: "CERTIFICATES",
            workshops: "WORKSHOPS",
            experience: "EXPERIENCE",
            iot: "IoT",
            vr: "VR",
            websites: "WEBSITES",
            applications: "APPLICATIONS",
            systems: "SYSTEMS",
            contact: "CONTACT",

            // Titles and Headings
            title: "Jackson F. Magnabosco",
            subtitle:
              "Software Engineer, University Professor, and Course Creator",
            courseAuthorityText: "Mentoring 350+ students across 25 countries in Latin America and worldwide through online courses on Udemy. Specialized in professional development in software engineering, data science, artificial intelligence, and web technologies with an average rating of 4.5/5 stars.",
            skills: "Skills as a Software Developer",
            bachelorDegree: "BACHELOR'S DEGREE",
            curriculumTitle: "RESUME",
            curriculumSection: "Professional Resume & Presentation",
            presentationVideo: "Presentation Video",
            aboutPresentation: "About My Presentation", 
            presentationDescription: "Watch my professional presentation video to learn more about my background, skills, and experience as a Software Engineer, University Professor, and Course Creator.",
            resumeDownload: "Resume Download",
            downloadResume: "Download Resume",
            resumeDescription: "Download my complete resume in PDF format to view my professional experience, education, and skills in detail.",
            postgraduateStudies: "POSTGRADUATE STUDIES",
            connectedWardrobe: "Connected Wardrobe",
            smartMailbox: "Smart Mailbox",
            autonomousWardrobe: "Autonomous Wardrobe",
            breweryAutomation: "Brewery Automation",
            virtualReality: "Virtual Reality",
            chooseYourTeam: "Choose Your Team",
            ticTacToeGame: "Tic-Tac-Toe Game",
            cronus: "Cronus",
            realEstateMagnus: "Real Estate Magnus",
            uri: "Integrated Regional University of Alto Uruguai and Missions",
            bachelor:
              "<strong>2016-2021/01:</strong> Bachelor's in Computer Science",
            softwareEngineering:
              "<strong>2022-2023/01:</strong> Software Engineering",
            databaseAdmin:
              "<strong>2023-2024/02:</strong> Database Administration",
            collegeName: "Metropolitan College",

            // Recommendations
            recommendationsTitle: "RECOMMENDATIONS",
            viewLinkedIn: "View on LinkedIn",

            // Descriptions
            basedInErechim:
              "Based in Erechim, northern Rio Grande do Sul, Brazil, I hold a Bachelor's degree in Computer Science from <abbr title='Universidade Regional Integrada do Alto Uruguai e das Missões Erechim'>URI-Erechim.</abbr> <br> I am a dedicated Software Engineer and Professor, with completed postgraduate studies in Software Engineering and Database Administration. <br> With the goal of continuous professional development in the field of information technology, aiming to assist companies in maximizing their results through study, dedication, research, and innovation. <br> In recent years, I have consistently improved my skills, contributing to projects I've been a part of, always with a sense of responsibility and professionalism, and actively seeking to learn from and exchange experiences with fellow professionals. I prioritize solving business-related issues, possess a strong sense of ownership and urgency.",
            startupDescription:
              "With three participations in Startup Weekend Erechim/RS, two as a software developer and one as part of the volunteer organization team for the fourth edition. Responsible for managing and executing all event activities and supporting the local entrepreneurial culture.",
            startupExperience:
              "In these editions, I had the opportunity to work in multifunctional teams with incredibly talented and motivated individuals. Together, we tackled complex and exciting challenges, from conceiving an idea to creating a functional prototype and crafting a robust business model. The fast-paced nature of Startup Weekend pushed us to learn how to collaborate effectively, make quick decisions, and efficiently prioritize tasks.",
            virtualRealityDescription:
              "This event was organized for the computer science course, with the goal of contributing to the improvement of professional and civic education for those involved. The project's objective was to model the entire Campus II of URI Erechim University in 3D in less than 24 hours.",

            // Certificates
            scrumFoundations:
              "Scrum Foundations Professional Certificate SFPC.",
            scrumFundamentals: "Scrum Fundamentals Certified SFC.",
            veracodeAdvisor: "Veracode Certified Advisor.",
            wevoTechnical: "Wevo Technical Certification.",
            awsCloudPractitioner: "AWS Certified Cloud Practitioner.",
            oracleCloud:
              "Oracle Cloud Infrastructure Certified Foundations Associate.",

            // Workshops
            webAccessibility:
              "Web Accessibility: Introduction to Inclusive Designs (Duration: 6 hours) Alura.",
            webAccessibilityPart1:
              "Web Accessibility Part 1: Making Your Front-End Inclusive (Duration: 6 hours) Alura.",
            webAccessibilityPart2:
              "Web Accessibility Part 2: Accessible Components with a Bit of JavaScript (Duration: 4 hours) Alura.",
            androidKotlin: "Android App Development with Kotlin (Duration: 12.5 hours) Udemy.",
            dartProgramming: "Dart Programming Language (Duration: 2 hours) Udemy.",
            flutterDevelopment: "Android and iOS App Development with Flutter (Duration: 33 hours) Udemy.",
            mysqlDatabase: "MySQL Database (Duration: 3.5 hours) Udemy.",
            introductionToMySQL: "Introduction to MySQL Database.",
            amazonEC2: "Introduction to Amazon Elastic Compute Cloud (EC2).",
            awsComputeServices: "AWS Compute Services Overview.",
            awsApplicationServices: "AWS Application Services Overview.",
            dockerContainers: "Docker: Creating Containers Without Headaches.",
            kubernetesPods: "Kubernetes: Pods, Services, and ConfigMaps.",
            delphiLazarus: "Learn Delphi and Lazarus from Scratch (Duration: 6.5 hours) Udemy.",
            webServicesIntegration:
              "Integration of Solutions with Web Services (Duration: 1 hour) Udemy.",
            apiSpecifications: "API Specifications with Swagger and OpenAPI (Duration: 3.5 hours) Udemy.",
            restApiDocumentation:
              "Understanding and Documenting REST/RESTful APIs (Duration: 5 hours) Udemy.",
            webpackModules: "Webpack: Manipulating Modules in Your Web App (Duration: 8 hours) Alura.",
            chromeDevTools:
              "Chrome DevTools: Analyze, Inspect, and Debug Your Web Pages (Duration: 9 hours) Alura.",
            httpUnderstanding: "HTTP: Understanding the Web Under the Hood (Duration: 14 hours) Alura.",
            lgpdImpacts: "LGPD: Getting to Know and Understanding Its Impacts (Duration: 10 hours) Alura.",
            webPerformance: "Web Performance I: Optimizing the Front-End (Duration: 20 hours) Alura.",
            neuralNetworks:
              "Introduction to Neural Networks: Deep Learning with PyTorch (Duration: 6 hours) Alura.",
            htmlCssPart1: "HTML5 and CSS3 Part 1: The First Web Page (Duration: 8 hours) Alura.",
            htmlCssPart2:
              "HTML5 and CSS3 Part 2: Positioning, Lists, and Navigation (Duration: 8 hours) Alura.",
            htmlCssPart3:
              "HTML5 and CSS3 Part 3: Working with Forms and Tables (Duration: 8 hours) Alura.",
            htmlCssPart4: "HTML5 and CSS3 Part 4: Advancing in CSS (Duration: 8 hours) Alura.",
            bootstrap3: "Bootstrap 3: Creating a Responsive Single-Page (Duration: 12 hours) Alura.",
            bootstrap4: "Bootstrap 4: Creating a Responsive Landing Page (Duration: 8 hours) Alura.",
            cssArchitecture: "CSS Architecture: Simplifying Problems (Duration: 8 hours) Alura.",
            cssGrid: "CSS Grid: Simplifying Layouts (Duration: 8 hours) Alura.",
            sassCompass: "Sass and Compass: Demystifying CSS (Duration: 8 hours) Alura.",
            flexbox: "Flexbox: Position Elements on the Screen (Duration: 9 hours) Alura.",
            responsiveDesign:
              "Responsive Web Design: Pages that Adapt from Mobile to Desktop (Duration: 10 hours) Alura.",
            webDevelopment: "Web Development (Duration: 12 hours) URI Campus Erechim.",
            gitGithub: "Git and Github: Control and Share Your Code (Duration: 6 hours) Alura.",
            gitBasics: "Git (Duration: 3.4 hours) Udemy.",
            javaProducts: "Java Products - Specifications vs. Proprietaries (Duration: 1 hour) Udemy.",
            javaSalesSystem: "Sales System with Java Web (Duration: 10.5 hours) Udemy.",
            javaPharmacySystem: "Pharmacy System with Java Web (Duration: 8 hours) Udemy.",
            javaFundamentals: "Java Programming Fundamentals (Duration: 12 hours) Udemy.",
            programmingParadigms: "Programming Paradigms (Duration: 180 hours) Faculdade Metropolitana.",
            unitTestingJava:
              "Unit Testing in Java: Master JUnit, Mockito, and TDD (Duration: 8 hours) Udemy.",
            nodeJsTesting: "Node.JS Testing (TDD) from the Ground Up (Duration: 15.5 hours) Udemy.",
            javascriptBasics:
              "JavaScript: Programming in the language of the web (Duration: 20 hours) Alura.",
            advancedJavascript1:
              "Advanced JavaScript I: ES6, object-oriented programming, and design patterns (Duration: 12 hours) Alura.",
            advancedJavascript2:
              "Advanced JavaScript II: ES6, object-oriented programming, and design patterns (Duration: 12 hours) Alura.",
            nestjsApi: "NESTJS: Creating a REST API with TypeScript (Duration: 6 hours) Alura.",
            advancedJavascript3:
              "Advanced JavaScript III: ES6, object-oriented programming, and design patterns (Duration: 12 hours) Alura.",
            reactPart1: "React part 1: Reusable components for your web app (Duration: 6 hours) Alura.",
            reactPart2:
              "React part 2: Validation, Routing, and API Integration (Duration: 8 hours) Alura.",
            vuePart1: "Vue part 1: Building Single Page Applications (Duration: 16 hours) Alura.",
            vuePart2: "Vue part 2: Building Single Page Applications (Duration: 16 hours) Alura.",
            jqueryIntroduction: "jQuery: Introduction to jQuery (Duration: 1 hour) Udemy.",
            jqueryPart1:
              "jQuery part 1: Master the most popular library in the market (Duration: 12 hours) Alura.",
            jqueryPart2:
              "jQuery part 2: Advance with the most popular library in the market (Duration: 12 hours) Alura.",
            nodeJsApis: "Node.js: Creating APIs (Duration: 2 hours) Udemy.",
            nodeJsMongoDb: "Node.js and MongoDB (Duration: 15.5 hours) Udemy.",
            angularIntroduction: "Angular 5: Introduction to JavaScript (Duration: 4 hours) URI Campus Erechim.",
            phpBestPractices: "Best Practices in PHP (Duration: 30 minutes) Professor Diego Mariano.",
            scrumMasterCertification:
              "Scrum Master Certification: Preparatory Course (Duration: 11 hours) Udemy.",
            scrumAgility: "Scrum: Agility in Your Project (Duration: 10 hours) Alura.",
            scrumPart1: "Scrum Part 1: Manage Your Project Agilely (Duration: 5 hours) Alura.",
            scrumPart2:
              "Scrum Part 2: The Agile Manifesto, Leadership, and Organization in Scrum (Duration: 5 hours) Alura.",

            // Additional Education
            englishLiterature: "Foreign Language and Literature 'English' (Duration: 250 hours) Topway English School, Erechim and Passo Fundo.",
            computerTechnician:
              "Computer Technician 'Hardware, Software, Networks' (Duration: 192 hours) SENAC Erechim.",
            administrativeAssistant: "Administrative Assistant (Duration: 180 hours) SENAC Erechim.",
            basicToAdvancedComputing:
              "Basic to Advanced Computing 'Word, Excel, Powerpoint, Windows, Linux, Typing, Internet' (Duration: 160 hours) Escola JB Informática.",

            // Professional Experience
            uriProfessor:
              "Professor of Computer Science & Systems Analysis and Development.",
            superbidEngineer: "Software Engineer.",
            globalsysDeveloper: "Back-End Developer.",
            compassDevOps: "Cloud & DevSecOps.",
            smartLockersIntern: "Intern.",

            // Contact
            email: "E-mail:",
            whatsapp: "Whatsapp:",
            professionalExperience: "PROFESSIONAL EXPERIENCE",

            // Articles
            publishedArticles: "PUBLISHED ARTICLES",
            digitalInnovationTitle: "Digital Innovation for Microbreweries: An Integrated Tool for Production Monitoring and Management",
            publishedIn: "Published in",
            brazilianJournalTech: "Brazilian Journal of Technology",
            authors: "Authors:",
            description: "Description:",
            readFullArticle: "Read the Full Article",
            articleDescription: "This article introduces a mobile application called <em>Velha Guarda</em>, designed to automate and optimize the beer production process for microbreweries. The solution integrates real-time monitoring using ESP8266 NodeMCU with temperature sensors, object-oriented methodology, and tools such as Flutter, Firebase, and Scrum-based project management. The goal is to improve safety, efficiency, productivity, and cost reduction in craft beer production of up to 100 liters.",

            // Professional Experience Technical Terms
            programmingLanguages: "Programming Languages:",
            applicationServer: "Application server:",
            testing: "Testing:",
            messagingSystem: "Messaging System:",
            databases: "Databases:",
            sourceCodeManagement: "Source Code Management:",
            cloud: "Cloud:",
            agileMethods: "Agile methods:",
            generalTooling: "General tooling:",
            softwareEngineeringBestPractices: "Software Engineering Best Practices:",
            aiEvaluationWork: "AI & Evaluation Work:",
            collaborationTools: "Collaboration Tools:",
            cloudDevOps: "Cloud & DevOps:",
            event: "Event",

            // Job Titles
            seniorSoftwareEngineer: "Senior Software Engineer",
            productEngineer: "Product Engineer (Contract via Oowlish)",
            codingAgentExperience: "AI Coding Agent Trainer",
            professorComputerScience: "Professor of Computer Science",
            tempoFullStackDeveloper: "Full Stack Developer",

            // Technical Skills - Covetrus
            backendArchitecture: "Backend & Architecture:",
            productEngineering: "Product Engineering:",
            businessSolutionsTranslation: "Translating business needs into production-ready solutions",
            aiFirstDevelopment: "AI-first Development:",
            qualitySDLC: "Quality & SDLC:",
            testAutomationProcess: "Test automation, CI/CD improvements, faster and reliable releases",
            frontend: "Frontend:",
            practices: "Practices:",
            agileSystemDesign: "Agile (Scrum, Kanban), system design, high ownership mindset",

            // Subjects/Courses
            interfaceDesign: "Interface Design",
            webDevelopment: "Web Development",
            ethicsAndLegislation: "Ethics and Professional Legislation",
            specialTopicsComputing1: "Special Topics in Computing I",
            specialTopicsComputing2: "Special Topics in Computing II",
            computationalThinking: "Computational Thinking",

            // Workshop Categories
            cloudCategory: "CLOUD",
            applicationsCategory: "APPLICATIONS",
            accessibilityCategory: "ACCESSIBILITY",
            devopsCategory: "DEVOPS",
            devToolsCategory: "DEV TOOLS",
            htmlCssCategory: "HTML AND CSS",
            additionalEducationCategory: "ADDITIONAL EDUCATION",
            gitGithubCategory: "GIT AND GITHUB",
            javaCategory: "JAVA",
            testsCategory: "TESTS",
            javascriptCategory: "JAVASCRIPT",
            phpCategory: "PHP",
            scrumCategory: "SCRUM",

            // Common Terms
            duration: "Duration:",
            year: "Year:",
            doi: "DOI:",
            hours: "hours",
            minutes: "minutes",

            // Websites
            architecture: "Architecture",
            cuisine: "Cuisine",
            journalism: "Journalism",
            games: "Games",
            agency: "Agency",

            // Applications
            smartLockers: "Smart Lockers",
            virtualStore: "Virtual Store",
            aestheticClinic: "Aesthetic Clinic",
            systemsSection: "SYSTEMS",

            // Database Category
            databaseCategory: "DATABASE",

            // Sections
            startups: "STARTUPS",
            projects: "PROJECTS",
            websitesSection: "WEBSITES",
            iotSection: "IoT",

            // Recommendations
            recommendationsTitle: "RECOMMENDATIONS",
            viewLinkedIn: "View on LinkedIn",
            
            rec1: {
              name: "Kentaro Mori",
              role: "Startup Builder | Engineering Leader | Scaling Tech for High-Growth Businesses",
              date: "9 de julio de 2026",
              relationship: "Gestionó a Jackson directamente",
              text: "Tuve el placer de trabajar con Jackson en el proyecto Kora, donde contribuyó como Desarrollador Backend Java.\n\nJackson es un ingeniero técnicamente fuerte y confiable con un enfoque práctico para resolver problemas. Entregó de forma consistente con rapidez, colaboró muy bien con el equipo y ayudó a impulsar iniciativas clave del proyecto."
            },
            rec2: {
              name: "Rômulo Paiva",
              role: "CSPO® | Product Owner | Product Manager at Superbid",
              date: "21 de agosto de 2025",
              relationship: "Gestionó a Jackson directamente",
              text: "Tuve la oportunidad de trabajar con Jackson durante tres años en Superbid, período en el que fui su PM. Fue nuestro desarrollador backend Java y se destacó no solo por su experiencia técnica sino también por el valor adicional que aportó al equipo.\n\nComo propietario de un canal de programación en YouTube y docente de cursos presenciales y en Udemy, Jackson fue más allá del código: documentó magistralmente cada flujo de trabajo en el que participó, cubriendo tanto los aspectos técnicos como las reglas de negocio.\n\nAdemás de ser un profesional destacado, Jackson es una persona admirable: calmada, atenta y siempre dispuesta a ayudar."
            },
            rec3: {
              name: "Francélio Alencar",
              role: "Tech Lead | Engenheiro de Software Sênior | Especialista em Microservices | Java, Spring Boot, NestJS, AWS",
              date: "20 de agosto de 2025",
              relationship: "Gestionó a Jackson directamente",
              text: "Con gran entusiasmo recomiendo a Jackson Felipe Magnabosco, un excepcional Senior Software Engineer con quien tengo el privilegio de trabajar directamente en Superbid.\n\nJackson se destaca por su experiencia en desarrollo backend y por su conocimiento de herramientas AWS, entregando soluciones escalables que optimizan significativamente los sistemas.\n\nDemuestra un dominio impresionante en Java, JavaScript, TypeScript y Node.js, combinado con un enfoque ágil que asegura entregables de alta calidad.\n\nProactivo, colaborador y siempre en busca de la excelencia, Jackson es un profesional sobresaliente que aporta valor a cualquier equipo."
            },
            rec4: {
              name: "Jonathan Jesus",
              role: "Senior Frontend Engineer | Javascript + Typescript | ReactJS & NextJS | NodeJS | Performance & Clean Code",
              date: "19 de agosto de 2025",
              relationship: "Trabajó con Jackson en el mismo equipo",
              text: "Jackson es uno de los profesionales más dedicados con los que he tenido el placer de trabajar.\n\nNo le teme a un desafío, viéndolo como una oportunidad para perfeccionar sus habilidades. Su curiosidad y voluntad de aprender lo convierten en un profesional en constante evolución.\n\nEsta combinación de iniciativa y mentalidad de crecimiento lo hace un miembro de equipo de gran valor."
            },
            rec5: {
              name: "Ezequiel Menegas",
              role: "Developer Sr at AGROTIS | CSPO | AI Agents LangChain | Agro | Spec Driven Development",
              date: "17 de marzo de 2025",
              relationship: "Estudiamos juntos",
              text: "Estudié tecnología con él en la universidad, y siempre admiré su dedicación y respeto por todos a su alrededor.\n\nDurante nuestros años juntos, se destacó no solo por su conocimiento técnico, sino también por su capacidad de colaborar y ayudar a otros a entender conceptos.\n\nSu habilidad para transmitir conocimiento de forma clara y atractiva es inspiradora."
            },
            rec6: {
              name: "Lucas Gulart da Silveira",
              role: "Co-founder of Rancho | Software Engineer | NestJS · TypeScript · Node.js · Expo",
              date: "11 de diciembre de 2023",
              relationship: "Trabajó con Jackson en el mismo equipo",
              text: "Jackson destaca en el desarrollo con sus notables habilidades.\n\nEnfrenta desafíos técnicos con eficacia, demostrando un dominio consistente en el área.\n\nSu enfoque colaborativo y disposición para compartir conocimiento contribuyen positivamente al entorno de trabajo."
            },
            rec7: {
              name: "Levi Santos Rocha",
              role: "Senior Fullstack Engineer | React | Next | React Native | NodeJs | Python | AWS",
              date: "19 de septiembre de 2023",
              relationship: "Trabajó con Jackson en el mismo equipo",
              text: "Jackson es un profesional de excelencia y un miembro valioso en nuestro equipo.\n\nDurante todo el tiempo que trabajamos juntos, pude ver su enorme dedicación y pasión por la programación.\n\nTambién destaco su ética de trabajo y actitud positiva, convirtiéndolo en una contribución importante para los proyectos."
            },
            rec8: {
              name: "Patrick Berlatto Piccini",
              role: "Solutions Architect | Back-End Developer | DevOps | Python | Django | DRF | Automation | Cloud | Git | Docker",
              date: "10 de septiembre de 2023",
              relationship: "Trabajó con Jackson en el mismo equipo",
              text: "Jackson es un profesional con habilidades excepcionales en el desarrollo de software.\n\nSu incansable búsqueda de la excelencia conduce a mejoras continuas en la calidad del código.\n\nValora la colaboración, trabajando de manera armoniosa con los colegas y compartiendo conocimiento a través de revisiones de código.\n\nSu dedicación y compromiso con la mejora lo convierten en un activo clave para los equipos de desarrollo de software."
            },

            // English (en) translations will be added below in the resources block further down
            rec1: {
              name: "Kentaro Mori",
              role: "Startup Builder | Engineering Leader | Scaling Tech for High-Growth Businesses",
              date: "July 9, 2026",
              relationship: "Managed Jackson directly",
              text: "I had the pleasure of working with Jackson on the Kora project, where he contributed as a Java Backend Developer.\n\nJackson is a reliable, technically strong engineer with a practical approach to solving problems. He consistently delivered with speed, collaborated very well with the team, and helped move key project initiatives forward."
            },
            rec2: {
              name: "Rômulo Paiva",
              role: "CSPO® | Product Owner | Product Manager at Superbid",
              date: "August 21, 2025",
              relationship: "Managed Jackson directly",
              text: "I had the opportunity to work with Jackson for three years at Superbid, during which I served as his PM. He was our backend Java developer and stood out not only for his technical expertise but also for the additional value he brought to the team.\n\nAs the owner of a programming channel on YouTube and a teacher of both in-person and Udemy courses, Jackson went far beyond coding: he masterfully documented every workflow he was involved in, covering both the technical aspects and the business rules.\n\nIn addition to being an outstanding professional, Jackson is an admirable person: calm, attentive, and always willing to help."
            },
            rec3: {
              name: "Francélio Alencar",
              role: "Tech Lead | Engenheiro de Software Sênior | Especialista em Microservices | Java, Spring Boot, NestJS, AWS",
              date: "August 20, 2025",
              relationship: "Managed Jackson directly",
              text: "It is with great enthusiasm that I recommend Jackson Felipe Magnabosco, an exceptional Senior Software Engineer with whom I have the privilege of working directly at Superbid.\n\nJackson stands out for his expertise in back-end development and knowledge of AWS tools, delivering scalable solutions that significantly optimize systems.\n\nHe demonstrates impressive mastery in Java, JavaScript, TypeScript, and Node.js, combined with an agile approach that ensures high-quality deliverables.\n\nProactive, collaborative, and always striving for excellence, Jackson is an outstanding professional who adds value to any team."
            },
            rec4: {
              name: "Jonathan Jesus",
              role: "Senior Frontend Engineer | Javascript + Typescript | ReactJS & NextJS | NodeJS | Performance & Clean Code",
              date: "August 19, 2025",
              relationship: "Worked with Jackson on the same team",
              text: "Jackson is one of the most dedicated professionals I've had the pleasure of working with.\n\nHe's not afraid of a challenge, seeing it as an opportunity to hone his skills. His curiosity and willingness to learn make him a constantly evolving professional.\n\nThis combination of initiative and a growth mindset makes him a highly valuable team member."
            },
            rec5: {
              name: "Ezequiel Menegas",
              role: "Developer Sr at AGROTIS | CSPO | AI Agents LangChain | Agro | Spec Driven Development",
              date: "March 17, 2025",
              relationship: "Studied together",
              text: "Estudei tecnologia com ele na faculdade, e sempre admirei sua dedicação e respeito por todos ao seu redor.\n\nDurante os nossos anos juntos, ele se destacou não apenas por seu conhecimento técnico, mas também pela sua capacidade de colaborar e ajudar os outros a entender conceitos.\n\nSua habilidade de transmitir conhecimento de forma clara e envolvente é inspiradora."
            },
            rec6: {
              name: "Lucas Gulart da Silveira",
              role: "Co-founder of Rancho | Software Engineer | NestJS · TypeScript · Node.js · Expo",
              date: "December 11, 2023",
              relationship: "Worked with Jackson on the same team",
              text: "Jackson destaca-se no desenvolvimento com suas habilidades notáveis.\n\nEle enfrenta desafios técnicos com eficácia, demonstrando um domínio consistente nessa área.\n\nSua abordagem colaborativa e disposição para compartilhar conhecimento contribuem positivamente para o ambiente de trabalho."
            },
            rec7: {
              name: "Levi Santos Rocha",
              role: "Senior Fullstack Engineer | React | Next | React Native | NodeJs | Python | AWS",
              date: "September 19, 2023",
              relationship: "Worked with Jackson on the same team",
              text: "Jackson é um profissional de excelência e um membro valioso em nossa equipe.\n\nEm todo o período em que trabalhamos juntos, pude ver sua enorme dedicação e paixão pela programação.\n\nDestaco também sua ética de trabalho e atitude positiva, tornando-o uma contribuição importante para os projetos."
            },
            rec8: {
              name: "Patrick Berlatto Piccini",
              role: "Solutions Architect | Back-End Developer | DevOps | Python | Django | DRF | Automation | Cloud | Git | Docker",
              date: "September 10, 2023",
              relationship: "Worked with Jackson on the same team",
              text: "Jackson is a professional with exceptional skills in software development.\n\nHis relentless pursuit of excellence leads to continuous improvements in code quality.\n\nHe values collaboration, working harmoniously with colleagues and sharing knowledge through code reviews.\n\nHis dedication and commitment to improvement make him a key asset to software development teams."
            },

            //iot
            connectedWardrobe: "Connected Wardrobe",
            smartMailbox: "Smart Mailbox",
            autonomousWardrobe: "Autonomous Wardrobe",
            breweryAutomation: "Brewery Automation",

            //virtual reality
            virtualRealityTitle: "Virtual Reality",
            virtualRealityDescription: "This event was organized for the computer science course, with the goal of contributing to the improvement of professional and civic education for those involved. The project's objective was to model the entire Campus II of URI Erechim University in 3D in less than 24 hours.",

            //course for sale
            coursesForSale: "Courses for Sale",
            webDevelopmentTitle: "Web Development",
            webDevelopmentDescription: "Learn to build complete web applications from scratch, mastering HTML, CSS, JavaScript, and database management.",
            interfaceDesignTitle: "Interface Design",
            interfaceDesignDescription: "Master HCI: paradigms, accessibility, usability, prototyping, and user-centered design and experience.",
            dataMiningTitle: "Data Mining with KDD, Python, R, and Google Colab",
            dataMiningDescription: "Data Mining in Practice: KDD, Data Selection, and Preprocessing with Python, R, WEKA, and Google Colab.",
            professionalEthicsTitle: "Professional Ethics and Legislation",
            professionalEthicsDescription: "Rights, Duties, and Code of Ethics for IT and Technology Professionals | Updated Legislation.",    
            professionalIoTTitle: "Internet of Things: Fundamentals and Applications",
            professionalIoTDescription: "Internet of Things (IoT) in Practice: Develop Projects with Sensors, Protocols, and Commercial Platforms",
            programmingLogicDescription: "Learn flowcharts, pseudocode, variables, conditionals, and loops to solve programming problems and build logical thinking.",
            programmingLogicTitle: "Programming Logic and Algorithms: Complete Guide",
            databaseAdministrationTitle: "Database Administration: SQL, MySQL, and DBA",
            databaseAdministrationDescription: "Learn security, performance, backup, and recovery to work as a professional DBA and master DBMSs",
            globalProfileCourseTitle: "Build Your Global Professional Profile",
            globalProfileCourseDescription: "Position your resume and LinkedIn to stand out in remote and international hiring processes.",
            aiPromptEngineeringTitle: "AI Prompt Engineering in Practice",
            aiPromptEngineeringDescription: "Understand how generative AI works and learn to design powerful prompts for real-world applications.",
            liveCodingInterviewsTitle: "Live Coding JavaScript Interviews",
            liveCodingInterviewsDescription: "Learn how to solve algorithm challenges and think out loud during international technical interviews.",
            underConstruction: "🚧 Under Construction 🚧",
            universityName: "Integrated Regional University <br> of Alto Uruguai and Missions (2024 - 2025)",
            // Projects
            project1: {
              title: "Great Pet Care Platform - Pet Parent & Practice Management",
              period: "Apr 2026 – Present",
              description: "Contributed to the Great Pet Care platform, a Covetrus solution connecting veterinary practices and pet parents by enabling appointment scheduling, prescription management, and centralized pet health tracking. Worked on backend features for both the pet parent-facing dashboard and the platform's administrative panel, using Node.js and TypeScript. Contributed to the evolution of account management flows and pet/practice data handling, applying an AI-first development approach. Participated in architecture decisions focused on scalability and maintainability as the platform grew.",
              company: "Covetrus"
            },
            project2: {
              title: "KORA",
              period: "May 2025 – Apr 2026",
              associated: "Tempo",
              description: "KORA is a next-generation Field Service Management (FSM) platform developed by Tempo, one of Brazil's leading companies in assistance, convenience, and specialized services. The platform modernizes post-purchase service operations, including furniture assembly, home appliance installation, and telecom services, connecting retailers, manufacturers, customers, and service providers. As a Senior Backend Software Engineer, contributed to the architecture, technical discovery, and development of scalable microservices responsible for scheduling, dispatching, and executing field services. Worked with API-first and event-driven architecture using Java, Spring Boot, Kafka, AWS, and Kubernetes.",
              company: "Tempo"
            },
            project3: {
              title: "BidTv",
              period: "Sep 2022 – Sep 2025",
              associated: "Superbid Exchange",
              description: "Worked within one of the largest digital auction transaction platforms in Latin America, connecting buyers and sellers across different industries and market segments. Contributed to the evolution of platform features and backend solutions supporting digital auction operations.",
              company: "Superbid Exchange"
            },
            project4: {
              title: "Brewery Automation",
              period: "Feb 2020 – Dec 2020",
              associated: "Universidade Regional Integrada do Alto Uruguai e das Missões - URI",
              description: "Developed the \"Velha Guarda\" mobile application, an automated control solution for craft beer production processes. The project aimed to improve productivity, safety, and efficiency by monitoring temperature throughout different brewing stages using IoT technology. The application was developed with Flutter, Dart, Firebase, and integrated with ESP8266 NodeMCU V3 using C programming and DS18B20 temperature sensors. The solution enabled recipe management, temperature monitoring, and improved control over brewing operations.",
              skills: "Breadboard, DS18B20, IoT, Flutter, Firebase"
            },
            project5: {
              title: "Smart Locker",
              period: "Jan 2020 – Dec 2020",
              associated: "Armários Inteligentes",
              description: "Developed a smart locker application based on the Internet of Things (IoT) concept, controlled through a mobile application and API. The system allows locker configuration, user management, door opening control, compartment allocation, and occupancy management. A web-based management interface provides occupancy reports and access logs.",
              skills: "SQL, Flutter, IoT"
            },
          },
        },
        pt: {
          translation: {
            // Menu
            portfolio: "PORTFÓLIO",
            education: "EDUCAÇÃO",
            curriculum: "CURRÍCULO",
            certificates: "CERTIFICADOS",
            workshops: "CURSOS",
            experience: "EXPERIÊNCIA",
            iot: "IoT",
            vr: "VR",
            websites: "SITES",
            applications: "APLICAÇÕES",
            systems: "SISTEMAS",
            contact: "CONTATO",

            // Titles and Headings
            title: "Jackson F. Magnabosco",
            subtitle:
              "Engenheiro de Software, Professor Universitário e Criador de Cursos",
            courseAuthorityText: "Mentoreando mais de 350 estudantes em 25 países da América Latina e do mundo através de cursos online na Udemy. Especializado em desenvolvimento profissional em engenharia de software, ciência de dados, inteligência artificial e tecnologias web com avaliação média de 4.5/5 estrelas.",
            skills: "Habilidades como Desenvolvedor de Software",
            bachelorDegree: "GRADUAÇÃO",
            curriculumTitle: "CURRÍCULO",
            curriculumSection: "Apresentação Profissional e Currículo",
            presentationVideo: "Vídeo de Apresentação",
            aboutPresentation: "Sobre Minha Apresentação",
            presentationDescription: "Assista ao meu vídeo de apresentação profissional para saber mais sobre minha formação, habilidades e experiência como Engenheiro de Software, Professor Universitário e Criador de Cursos.",
            resumeDownload: "Download do Currículo",
            downloadResume: "Baixar Currículo",
            resumeDescription: "Baixe meu currículo completo em formato PDF para visualizar minha experiência profissional, formação e habilidades em detalhes.",
            postgraduateStudies: "PÓS-GRADUAÇÃO",
            connectedWardrobe: "Guarda-Roupa Conectado",
            smartMailbox: "Caixa de Correio Inteligente",
            autonomousWardrobe: "Guarda-Roupa Autônomo",
            breweryAutomation: "Automação de Cervejaria",
            virtualReality: "Realidade Virtual",
            chooseYourTeam: "Escolha Seu Time",
            ticTacToeGame: "Jogo da Velha",
            cronus: "Cronus",
            realEstateMagnus: "Magnus Imóveis",
            uri: "Universidade Regional Integrada do Alto Uruguai e das Missões",
            bachelor:
              "<strong>2016-2021/01:</strong> Bacharelado em Ciência da Computação",
            softwareEngineering:
              "<strong>2022-2023/01:</strong> Engenharia de Software",
            databaseAdmin:
              "<strong>2023-2024/02:</strong> Administração de Banco de Dados",
            collegeName: "Faculdade Metropolitana",

            // Recommendations
            recommendationsTitle: "RECOMENDAÇÕES",
            viewLinkedIn: "Ver no LinkedIn",

            // Descriptions
            basedInErechim:
              "Nascido em Erechim, no norte do Rio Grande do Sul, Brasil, sou formado em Ciência da Computação pela <abbr title='Universidade Regional Integrada do Alto Uruguai e das Missões Erechim'>URI-Erechim.</abbr> <br> Sou um Engenheiro de Software e Professor dedicado, com pós-graduação concluída em Engenharia de Software e Administração de Banco de Dados. <br> Com o objetivo de desenvolvimento profissional contínuo na área de tecnologia da informação, visando auxiliar empresas a maximizar seus resultados por meio de estudo, dedicação, pesquisa e inovação. <br> Nos últimos anos, tenho aprimorado constantemente minhas habilidades, contribuindo para os projetos dos quais faço parte, sempre com senso de responsabilidade e profissionalismo, e buscando ativamente aprender e trocar experiências com outros profissionais. Priorizo a resolução de problemas relacionados aos negócios, possuindo um forte senso de dono e urgência.",
            startupDescription:
              "Com três participações no Startup Weekend Erechim/RS, duas como desenvolvedor de software e uma como parte da equipe de organização voluntária da quarta edição. Responsável por gerenciar e executar todas as atividades do evento e apoiar a cultura empreendedora local.",
            startupExperience:
              "Nessas edições, tive a oportunidade de trabalhar em equipes multifuncionais com indivíduos incrivelmente talentosos e motivados. Juntos, enfrentamos desafios complexos e emocionantes, desde a concepção de uma ideia até a criação de um protótipo funcional e a elaboração de um modelo de negócios robusto. O ritmo acelerado do Startup Weekend nos levou a aprender como colaborar de forma eficaz, tomar decisões rápidas e priorizar tarefas com eficiência.",
            virtualRealityDescription:
              "Este evento foi organizado para o curso de ciência da computação, com o objetivo de contribuir para a melhoria da educação profissional e cívica dos envolvidos. O objetivo do projeto era modelar todo o Campus II da Universidade URI Erechim em 3D em menos de 24 horas.",

            // Certificates
            scrumFoundations:
              "Certificado Profissional de Fundamentos do Scrum SFPC.",
            scrumFundamentals: "Scrum Fundamentals Certified SFC.",
            veracodeAdvisor: "Consultor Certificado Veracode.",
            wevoTechnical: "Certificação Técnica Wevo.",
            awsCloudPractitioner: "AWS Certified Cloud Practitioner.",
            oracleCloud:
              "Associado Certificado em Infraestrutura de Nuvem Oracle.",

            // Workshops
            webAccessibility:
              "Acessibilidade Web: Introdução a Designs Inclusivos (Duração: 6 horas) Alura.",
            webAccessibilityPart1:
              "Acessibilidade Web Parte 1: Tornando Seu Front-End Inclusivo (Duração: 6 horas) Alura.",
            webAccessibilityPart2:
              "Acessibilidade Web Parte 2: Componentes Acessíveis com um Pouco de JavaScript (Duração: 4 horas) Alura.",
            androidKotlin: "Desenvolvimento de Aplicativos Android com Kotlin (Duração: 12.5 horas) Udemy.",
            dartProgramming: "Linguagem de Programação Dart (Duração: 2 horas) Udemy.",
            flutterDevelopment: "Desenvolvimento de Aplicativos Android e iOS com Flutter (Duração: 33 horas) Udemy.",
            mysqlDatabase: "Banco de Dados MySQL (Duração: 3.5 horas) Udemy.",
            introductionToMySQL: "Introdução ao Banco de Dados MySQL.",
            amazonEC2: "Introdução ao Amazon Elastic Compute Cloud (EC2).",
            awsComputeServices:
              "Visão Geral dos Serviços de Computação da AWS.",
            awsApplicationServices:
              "Visão Geral dos Serviços de Aplicação da AWS.",
            dockerContainers:
              "Docker: Criando Contêineres sem Dores de Cabeça.",
            kubernetesPods: "Kubernetes: Pods, Serviços e ConfigMaps.",
            delphiLazarus: "Aprenda Delphi e Lazarus do Zero (Duração: 6.5 horas) Udemy.",
            webServicesIntegration: "Integração de Soluções com Web Services (Duração: 1 hora) Udemy.",
            apiSpecifications: "Especificações de API com Swagger e OpenAPI (Duração: 3.5 horas) Udemy.",
            restApiDocumentation:
              "Entendendo e Documentando APIs REST/RESTful (Duração: 5 horas) Udemy.",
            webpackModules:
              "Webpack: Manipulando Módulos em Sua Aplicação Web (Duração: 8 horas) Alura.",
            chromeDevTools:
              "Chrome DevTools: Analise, Inspecione e Depure Suas Páginas Web (Duração: 9 horas) Alura.",
            httpUnderstanding: "HTTP: Entendendo a Web por Baixo dos Panos (Duração: 14 horas) Alura.",
            lgpdImpacts: "LGPD: Conhecendo e Entendendo Seus Impactos (Duração: 10 horas) Alura.",
            webPerformance: "Desempenho Web I: Otimizando o Front-End (Duração: 20 horas) Alura.",
            neuralNetworks:
              "Introdução às Redes Neurais: Deep Learning com PyTorch (Duração: 6 horas) Alura.",
            htmlCssPart1: "HTML5 e CSS3 Parte 1: A Primeira Página Web (Duração: 8 horas) Alura.",
            htmlCssPart2:
              "HTML5 e CSS3 Parte 2: Posicionamento, Listas e Navegação (Duração: 8 horas) Alura.",
            htmlCssPart3:
              "HTML5 e CSS3 Parte 3: Trabalhando com Formulários e Tabelas (Duração: 8 horas) Alura.",
            htmlCssPart4: "HTML5 e CSS3 Parte 4: Avançando no CSS (Duração: 8 horas) Alura.",
            bootstrap3: "Bootstrap 3: Criando uma Página Única Responsiva (Duração: 12 horas) Alura.",
            bootstrap4:
              "Bootstrap 4: Criando uma Página de Destino Responsiva (Duração: 8 horas) Alura.",
            cssArchitecture: "Arquitetura CSS: Simplificando Problemas (Duração: 8 horas) Alura.",
            cssGrid: "CSS Grid: Simplificando Layouts (Duração: 8 horas) Alura.",
            sassCompass: "Sass e Compass: Desmistificando o CSS (Duração: 8 horas) Alura.",
            flexbox: "Flexbox: Posicionando Elementos na Tela (Duração: 9 horas) Alura.",
            responsiveDesign:
              "Design Responsivo: Páginas que se Adaptam de Móvel para Desktop (Duração: 10 horas) Alura.",
            webDevelopment: "Desenvolvimento Web (Duração: 12 horas) URI Campus Erechim.",
            gitGithub: "Git e Github: Controle e Compartilhe Seu Código (Duração: 6 horas) Alura.",
            gitBasics: "Noções Básicas de Git (Duração: 3.4 horas) Udemy.",
            javaProducts: "Produtos Java - Especificações vs. Proprietários (Duração: 1 hora) Udemy.",
            javaSalesSystem: "Sistema de Vendas com Java Web (Duração: 10.5 horas) Udemy.",
            javaPharmacySystem: "Sistema de Farmácia com Java Web (Duração: 8 horas) Udemy.",
            javaFundamentals: "Fundamentos de Programação Java (Duração: 12 horas) Udemy.",
            programmingParadigms: "Paradigmas de Programação (Duração: 180 horas) Faculdade Metropolitana.",
            unitTestingJava:
              "Testes Unitários em Java: Domine JUnit, Mockito e TDD (Duração: 8 horas) Udemy.",
            nodeJsTesting: "Testes em Node.JS (TDD) do Zero (Duração: 15.5 horas) Udemy.",
            javascriptBasics: "JavaScript: Programando na Linguagem da Web (Duração: 20 horas) Alura.",
            advancedJavascript1:
              "JavaScript Avançado I: ES6, Programação Orientada a Objetos e Padrões de Design (Duração: 12 horas) Alura.",
            advancedJavascript2:
              "JavaScript Avançado II: ES6, Programação Orientada a Objetos e Padrões de Design (Duração: 12 horas) Alura.",
            nestjsApi: "NESTJS: Criando uma API REST com TypeScript (Duração: 6 horas) Alura.",
            advancedJavascript3:
              "JavaScript Avançado III: ES6, Programação Orientada a Objetos e Padrões de Design (Duração: 12 horas) Alura.",
            reactPart1:
              "React Parte 1: Componentes Reutilizáveis para Sua Aplicação Web (Duração: 6 horas) Alura.",
            reactPart2:
              "React Parte 2: Validação, Roteamento e Integração com API (Duração: 8 horas) Alura.",
            vuePart1: "Vue Parte 1: Construindo Aplicações de Página Única (Duração: 16 horas) Alura.",
            vuePart2: "Vue Parte 2: Construindo Aplicações de Página Única (Duração: 16 horas) Alura.",
            jqueryIntroduction: "jQuery: Introdução ao jQuery (Duração: 1 hora) Udemy.",
            jqueryPart1:
              "jQuery Parte 1: Domine a Biblioteca Mais Popular do Mercado (Duração: 12 horas) Alura.",
            jqueryPart2:
              "jQuery Parte 2: Avançando com a Biblioteca Mais Popular do Mercado (Duração: 12 horas) Alura.",
            nodeJsApis: "Node.js: Criando APIs (Duração: 2 horas) Udemy.",
            nodeJsMongoDb: "Node.js e MongoDB (Duração: 15.5 horas) Udemy.",
            angularIntroduction: "Angular 5: Introdução ao JavaScript (Duração: 4 horas) URI Campus Erechim.",
            phpBestPractices: "Melhores Práticas em PHP (Duração: 30 minutos) Professor Diego Mariano.",
            scrumMasterCertification:
              "Certificação Scrum Master: Curso Preparatório (Duração: 11 horas) Udemy.",
            scrumAgility: "Scrum: Agilidade em Seu Projeto (Duração: 10 horas) Alura.",
            scrumPart1: "Scrum Parte 1: Gerencie Seu Projeto de Forma Ágil (Duração: 5 horas) Alura.",
            scrumPart2:
              "Scrum Parte 2: O Manifesto Ágil, Liderança e Organização no Scrum (Duração: 5 horas) Alura.",

            // Additional Education
            englishLiterature: "Língua e Literatura Estrangeira 'Inglês' (Duração: 250 horas) Topway English School, Erechim e Passo Fundo.",
            computerTechnician:
              "Técnico em Informática 'Hardware, Software, Redes' (Duração: 192 horas) SENAC Erechim.",
            administrativeAssistant: "Assistente Administrativo (Duração: 180 horas) SENAC Erechim.",
            basicToAdvancedComputing:
              "Informática Básica a Avançada 'Word, Excel, Powerpoint, Windows, Linux, Digitação, Internet' (Duração: 160 horas) Escola JB Informática.",

            // Professional Experience
            uriProfessor:
              "Professor de Ciência da Computação & Análise e Desenvolvimento de Sistemas.",
            superbidEngineer: "Engenheiro de Software.",
            globalsysDeveloper: "Desenvolvedor Back-End.",
            compassDevOps: "Cloud & DevSecOps.",
            smartLockersIntern: "Estagiário.",

            // Contact
            email: "E-mail:",
            whatsapp: "Whatsapp:",
            professionalExperience: "Experiência Profissional",

            // Articles
            publishedArticles: "ARTIGOS PUBLICADOS",
            digitalInnovationTitle: "Inovação Digital para Microcervejarias: Uma Ferramenta Integrada para Monitoramento e Gestão da Produção",
            publishedIn: "Publicado na",
            brazilianJournalTech: "Brazilian Journal of Technology",
            authors: "Autores:",
            description: "Descrição:",
            readFullArticle: "Leia o Artigo Completo",
            articleDescription: "Este artigo apresenta uma aplicação móvel chamada <em>Velha Guarda</em>, projetada para automatizar e otimizar o processo de produção de cerveja para microcervejarias. A solução integra monitoramento em tempo real usando ESP8266 NodeMCU com sensores de temperatura, metodologia orientada a objetos e ferramentas como Flutter, Firebase e gerenciamento de projetos baseado no Scrum. O objetivo é melhorar a segurança, eficiência, produtividade e redução de custos na produção de cerveja artesanal de até 100 litros.",

            // Professional Experience Technical Terms
            programmingLanguages: "Linguagens de Programação:",
            applicationServer: "Servidor de aplicação:",
            testing: "Testes:",
            messagingSystem: "Sistema de Mensagens:",
            databases: "Bancos de Dados:",
            sourceCodeManagement: "Gerenciamento de Código Fonte:",
            cloud: "Nuvem:",
            agileMethods: "Métodos Ágeis:",
            generalTooling: "Ferramentas Gerais:",
            softwareEngineeringBestPractices: "Melhores Práticas de Engenharia de Software:",
            aiEvaluationWork: "Trabalho de IA e Avaliação:",
            collaborationTools: "Ferramentas de Colaboração:",
            cloudDevOps: "Nuvem & DevOps:",
            event: "Evento",

            // Job Titles
            seniorSoftwareEngineer: "Engenheiro de Software Sênior",
            productEngineer: "Engenheiro de Produto (Contrato via Oowlish)",
            codingAgentExperience: "Treinamento de Agente de Codificação",
            professorComputerScience: "Professor de Ciência da Computação",
            tempoFullStackDeveloper: "Desenvolvedor Full Stack",

            // Technical Skills - Covetrus
            backendArchitecture: "Backend & Arquitetura:",
            productEngineering: "Engenharia de Produto:",
            businessSolutionsTranslation: "Traduzindo necessidades de negócio em soluções prontas para produção",
            aiFirstDevelopment: "Desenvolvimento com IA:",
            qualitySDLC: "Qualidade & SDLC:",
            testAutomationProcess: "Automação de testes, melhorias CI/CD, releases mais rápidos e confiáveis",
            frontend: "Frontend:",
            practices: "Práticas:",
            agileSystemDesign: "Ágil (Scrum, Kanban), design de sistema, mentalidade de alta responsabilidade",

            // Subjects/Courses
            interfaceDesign: "Design de Interface",
            webDevelopment: "Desenvolvimento Web",
            ethicsAndLegislation: "Ética e Legislação Profissional",
            specialTopicsComputing1: "Tópicos Especiais em Computação I",
            specialTopicsComputing2: "Tópicos Especiais em Computação II",
            computationalThinking: "Pensamento Computacional",

            // Workshop Categories
            cloudCategory: "NUVEM",
            applicationsCategory: "APLICAÇÕES",
            accessibilityCategory: "ACESSIBILIDADE",
            devopsCategory: "DEVOPS",
            devToolsCategory: "FERRAMENTAS DE DEV",
            htmlCssCategory: "HTML E CSS",
            additionalEducationCategory: "EDUCAÇÃO ADICIONAL",
            gitGithubCategory: "GIT E GITHUB",
            javaCategory: "JAVA",
            testsCategory: "TESTES",
            javascriptCategory: "JAVASCRIPT",
            phpCategory: "PHP",
            scrumCategory: "SCRUM",

            // Database Category
            databaseCategory: "BANCO DE DADOS",

            // Sections
            startups: "STARTUPS",
            projects: "PROJETOS",
            websitesSection: "SITES",
            iotSection: "IoT",

            // Websites
            architecture: "Arquitetura",
            cuisine: "Culinária",
            journalism: "Jornalismo",
            games: "Jogos",
            agency: "Agência",

            // Applications
            smartLockers: "Armários Inteligentes",
            virtualStore: "Loja Virtual",
            aestheticClinic: "Clínica Estética",
            systemsSection: "SISTEMAS",

            // Common Terms
            duration: "Duração:",
            year: "Ano:",
            doi: "DOI:",
            hours: "horas",
            minutes: "minutos",

            //iot
            connectedWardrobe: "Conectado",
            smartMailbox: "Caixa de Correio Inteligente",
            autonomousWardrobe: "Autônomo",
            breweryAutomation: "Automação para Cervejarias",

            //virtual reality
            virtualRealityTitle: "Realidade Virtual",
            virtualRealityDescription: "Este evento foi organizado para o curso de ciência da computação, com o objetivo de contribuir para a melhoria da educação profissional e cívica dos envolvidos. O objetivo do projeto era modelar todo o Campus II da Universidade URI Erechim em 3D em menos de 24 horas.",

            //course for sale
            coursesForSale: "Cursos à Venda",
            webDevelopmentTitle: "Desenvolvimento Web",
            webDevelopmentDescription: "Aprenda a construir aplicações web completas do zero, dominando HTML, CSS, JavaScript e gerenciamento de banco de dados.",
            interfaceDesignTitle: "Design de Interface",
            interfaceDesignDescription: "Domine IHC: paradigmas, acessibilidade, usabilidade, prototipagem e design e experiência centrados no usuário.",
            dataMiningTitle: "Mineração de Dados com KDD, Python, R e Google Colab",
            dataMiningDescription: "Mineração de Dados na Prática: KDD, Seleção e Pré-processamento de Dados com Python, R, WEKA e Google Colab.",
            professionalEthicsTitle: "Ética Profissional e Legislação",
            professionalEthicsDescription: "Direitos, Deveres e Código de Ética para Profissionais de TI e Tecnologia | Legislação Atualizada.",
            professionalIoTTitle: "Internet das Coisas: Fundamentos e Aplicações",
            professionalIoTDescription: "Internet das Coisas (IoT) na Prática: Desenvolva Projetos com Sensores, Protocolos e Plataformas Comerciais",
            programmingLogicDescription: "Aprenda fluxogramas, pseudocódigo, variáveis, condicionais e loops para resolver problemas de programação e desenvolver o raciocínio lógico.",
            programmingLogicTitle: "Lógica de Programação e Algoritmos: Guia Completo",
            databaseAdministrationTitle: "Administração de Banco de Dados: SQL, MySQL e DBA",
            databaseAdministrationDescription: "Aprenda segurança, performance, backup e recovery para trabalhar como DBA profissional e dominar SGBDs",
            globalProfileCourseTitle: "Construa Seu Perfil Profissional Global",
            globalProfileCourseDescription: "Posicione seu currículo e LinkedIn para se destacar em processos seletivos remotos e internacionais.",
            aiPromptEngineeringTitle: "Engenharia de Prompts de IA na Prática",
            aiPromptEngineeringDescription: "Entenda como a IA generativa funciona e aprenda a projetar prompts poderosos para aplicações do mundo real.",
            liveCodingInterviewsTitle: "Entrevistas de Live Coding JavaScript",
            liveCodingInterviewsDescription: "Aprenda a resolver desafios de algoritmos e pensar em voz alta durante entrevistas técnicas internacionais.",
            underConstruction: "🚧 Em construção 🚧",
            universityName: "Universidade Regional Integrada <br> do Alto Uruguai e das Missões (2024 - 2025)",
            // Projects
            project1: {
              title: "Great Pet Care Platform - Gestão para Tutores e Clínicas",
              period: "Abr 2026 – Presente",
              description: "Contribuí para a plataforma Great Pet Care, uma solução da Covetrus conectando clínicas veterinárias e tutores de pets, permitindo agendamento de consultas, gerenciamento de prescrições e centralização do histórico de saúde dos animais. Trabalhei em funcionalidades de backend tanto no dashboard voltado para tutores quanto no painel administrativo da plataforma, utilizando Node.js e TypeScript. Contribuí para a evolução dos fluxos de gestão de contas e tratamento de dados de pets/clinicas, aplicando uma abordagem de desenvolvimento AI-first. Participei de decisões de arquitetura focadas em escalabilidade e manutenibilidade à medida que a plataforma crescia.",
              company: "Covetrus"
            },
            project2: {
              title: "KORA",
              period: "Mai 2025 – Abr 2026",
              associated: "Tempo",
              description: "KORA é uma plataforma de Field Service Management (FSM) de próxima geração desenvolvida pela Tempo, uma das principais empresas do Brasil em assistência, conveniência e serviços especializados. A plataforma moderniza operações de pós-venda, incluindo montagem de móveis, instalação de eletrodomésticos e serviços de telecom, conectando varejistas, fabricantes, clientes e prestadores de serviço. Como Engenheiro de Software Back-end Sênior, colaborei na arquitetura, descoberta técnica e desenvolvimento de microsserviços escaláveis responsáveis por agendamento, despacho e execução dos serviços de campo. Trabalhei com arquitetura API-first e orientada a eventos usando Java, Spring Boot, Kafka, AWS e Kubernetes.",
              company: "Tempo"
            },
            project3: {
              title: "BidTv",
              period: "Set 2022 – Set 2025",
              associated: "Superbid Exchange",
              description: "Atuei em uma das maiores plataformas de transações por leilão digital da América Latina, conectando compradores e vendedores de diferentes indústrias e segmentos de mercado. Contribuí para a evolução de funcionalidades da plataforma e soluções de backend que sustentam operações de leilão digital.",
              company: "Superbid Exchange"
            },
            project4: {
              title: "Automação para Cervejaria",
              period: "Fev 2020 – Dez 2020",
              associated: "Universidade Regional Integrada do Alto Uruguai e das Missões - URI",
              description: "Desenvolvi o aplicativo móvel \"Velha Guarda\", uma solução de controle automatizado para processos de produção de cerveja artesanal. O projeto buscou melhorar produtividade, segurança e eficiência por meio do monitoramento de temperatura nas diferentes etapas da brassagem utilizando tecnologia IoT. A aplicação foi desenvolvida com Flutter, Dart, Firebase e integrada com ESP8266 NodeMCU V3 em C e sensores DS18B20. A solução possibilitou gerenciamento de receitas, monitoramento de temperatura e melhor controle das operações de produção.",
              skills: "Breadboard, DS18B20, IoT, Flutter, Firebase"
            },
            project5: {
              title: "Armário Inteligente",
              period: "Jan 2020 – Dez 2020",
              associated: "Armários Inteligentes",
              description: "Desenvolvi uma aplicação de armário inteligente baseada no conceito de Internet das Coisas (IoT), controlada por aplicativo móvel e API. O sistema permite configuração de armários, gestão de usuários, controle de abertura de portas, alocação de compartimentos e gerenciamento de ocupação. Uma interface de gestão web fornece relatórios de ocupação e logs de acesso.",
              skills: "SQL, Flutter, IoT"
            },
          },
        },
        es: {
          translation: {
            // Menu
            portfolio: "PORTAFOLIO",
            education: "EDUCACIÓN",
            curriculum: "CURRÍCULUM",
            certificates: "CERTIFICADOS",
            workshops: "TALLERES",
            experience: "EXPERIENCIA",
            iot: "IoT",
            vr: "VR",
            websites: "SITIOS WEB",
            applications: "APLICACIONES",
            systems: "SISTEMAS",
            contact: "CONTACTO",

            // Recommendations
            recommendationsTitle: "RECOMENDACIONES",
            viewLinkedIn: "Ver en LinkedIn",

            // Titles and Headings
            title: "Jackson F. Magnabosco",
            subtitle:
              "Ingeniero de Software, Profesor Universitario y Creador de Cursos",
            courseAuthorityText: "Mentoreando a más de 350 estudiantes en 25 países de América Latina y el mundo a través de cursos online en Udemy. Especializado en desarrollo profesional en ingeniería de software, ciencia de datos, inteligencia artificial y tecnologías web con calificación promedio de 4.5/5 estrellas.",
            skills: "Habilidades como Desarrollador de Software",
            bachelorDegree: "LICENCIATURA",
            curriculumTitle: "CURRÍCULUM",
            curriculumSection: "Presentación Profesional y Currículum",
            presentationVideo: "Video de Presentación",
            aboutPresentation: "Acerca de Mi Presentación",
            presentationDescription: "Mira mi video de presentación profesional para conocer más sobre mi formación, habilidades y experiencia como Ingeniero de Software, Profesor Universitario y Creador de Cursos.",
            resumeDownload: "Descarga del Currículum",
            downloadResume: "Descargar Currículum",
            resumeDescription: "Descarga mi currículum completo en formato PDF para ver mi experiencia profesional, educación y habilidades en detalle.",
            postgraduateStudies: "ESTUDIOS DE POSGRADO",
            connectedWardrobe: "Armario Conectado",
            smartMailbox: "Buzón Inteligente",
            autonomousWardrobe: "Armario Autónomo",
            breweryAutomation: "Automatización de Cervecería",
            virtualReality: "Realidad Virtual",
            chooseYourTeam: "Elige Tu Equipo",
            ticTacToeGame: "Juego de Tres en Raya",
            cronus: "Cronus",
            realEstateMagnus: "Magnus Bienes Raíces",
            uri: "Universidad Regional Integrada del Alto Uruguay y de las Misiones",
            bachelor:
              "<strong>2016-2021/01:</strong> Licenciatura en Ciencias de la Computación",
            softwareEngineering:
              "<strong>2022-2023/01:</strong> Ingeniería de Software",
            databaseAdmin:
              "<strong>2023-2024/02:</strong> Administración de Bases de Datos",
            collegeName: "Facultad Metropolitana",

            // Descriptions
            basedInErechim:
              "Radicado en Erechim, al norte de Rio Grande do Sul, Brasil, soy Licenciado en Ciencias de la Computación por la <abbr title='Universidad Regional Integrada del Alto Uruguay y de las Misiones Erechim'>URI-Erechim</abbr>. Soy Ingeniero de Software y Profesor con posgrados en Ingeniería de Software y Administración de Bases de Datos. Busco desarrollo profesional continuo en TI, ayudando a las empresas a maximizar resultados mediante estudio, dedicación, investigación e innovación. En los últimos años, he fortalecido mis habilidades contribuyendo a proyectos con responsabilidad y profesionalismo, aprendiendo e intercambiando experiencias con otros profesionales, y priorizando la resolución de problemas de negocio con sentido de pertenencia y urgencia.",
            startupDescription:
              "Con tres participaciones en Startup Weekend Erechim/RS, dos como desarrollador de software y una como parte del equipo de organización voluntaria de la cuarta edición. Responsable de gestionar y ejecutar todas las actividades del evento y apoyar la cultura emprendedora local.",
            startupExperience:
              "En estas ediciones, tuve la oportunidad de trabajar en equipos multifuncionales con personas increíblemente talentosas y motivadas. Juntos, enfrentamos desafíos complejos y emocionantes, desde la concepción de una idea hasta la creación de un prototipo funcional y la elaboración de un modelo de negocio sólido. El ritmo acelerado del Startup Weekend nos impulsó a aprender a colaborar de manera efectiva, tomar decisiones rápidas y priorizar tareas de manera eficiente.",
            virtualRealityDescription:
              "Este evento fue organizado para el curso de ciencias de la computación, con el objetivo de contribuir a la mejora de la educación profesional y cívica de los involucrados. El objetivo del proyecto era modelar todo el Campus II de la Universidad URI Erechim en 3D en menos de 24 horas.",

            // Certificates
            scrumFoundations:
              "Certificado Profesional de Fundamentos de Scrum SFPC.",
            scrumFundamentals: "Scrum Fundamentals Certified SFC.",
            veracodeAdvisor: "Asesor Certificado Veracode.",
            wevoTechnical: "Certificación Técnica Wevo.",
            awsCloudPractitioner: "AWS Certified Cloud Practitioner.",
            oracleCloud:
              "Asociado Certificado en Infraestructura de Nube Oracle.",

            // Workshops
            webAccessibility:
              "Accesibilidad Web: Introducción a Diseños Inclusivos (Duración: 6 horas) Alura.",
            webAccessibilityPart1:
              "Accesibilidad Web Parte 1: Haciendo Tu Front-End Inclusivo (Duración: 6 horas) Alura.",
            webAccessibilityPart2:
              "Accesibilidad Web Parte 2: Componentes Accesibles con un Poco de JavaScript (Duración: 4 horas) Alura.",
            androidKotlin: "Desarrollo de Aplicaciones Android con Kotlin (Duración: 12.5 horas) Udemy.",
            dartProgramming: "Lenguaje de Programación Dart (Duración: 2 horas) Udemy.",
            flutterDevelopment:
              "Desarrollo de Aplicaciones Android y iOS con Flutter (Duración: 33 horas) Udemy.",
            mysqlDatabase: "Base de Datos MySQL.",
            introductionToMySQL: "Introducción a la Base de Datos MySQL.",
            amazonEC2: "Introducción a Amazon Elastic Compute Cloud (EC2).",
            awsComputeServices:
              "Descripción General de los Servicios de Computación de AWS.",
            awsApplicationServices:
              "Descripción General de los Servicios de Aplicación de AWS.",
            dockerContainers:
              "Docker: Creando Contenedores sin Dolores de Cabeza.",
            kubernetesPods: "Kubernetes: Pods, Servicios y ConfigMaps.",
            delphiLazarus: "Aprende Delphi y Lazarus desde Cero (Duración: 6.5 horas) Udemy.",
            webServicesIntegration:
              "Integración de Soluciones con Servicios Web (Duración: 1 hora) Udemy.",
            apiSpecifications: "Especificações de API com Swagger e OpenAPI (Duración: 3.5 horas) Udemy.",
            restApiDocumentation:
              "Comprensión y Documentación de APIs REST/RESTful (Duración: 5 horas) Udemy.",
            webpackModules:
              "Webpack: Manipulando Módulos en Tu Aplicación Web (Duración: 8 horas) Alura.",
            chromeDevTools:
              "Chrome DevTools: Analiza, Inspecciona y Depure Tus Páginas Web (Duración: 9 horas) Alura.",
            httpUnderstanding: "HTTP: Entendiendo la Web Bajo el Capó (Duración: 14 horas) Alura.",
            lgpdImpacts: "LGPD: Conociendo y Entendiendo Sus Impactos (Duración: 10 horas) Alura.",
            webPerformance: "Rendimiento Web I: Optimizando el Front-End (Duración: 20 horas) Alura.",
            neuralNetworks:
              "Introducción a las Redes Neuronales: Deep Learning con PyTorch (Duración: 6 horas) Alura.",
            htmlCssPart1: "HTML5 y CSS3 Parte 1: La Primera Página Web (Duración: 8 horas) Alura.",
            htmlCssPart2:
              "HTML5 y CSS3 Parte 2: Posicionamiento, Listas y Navegación (Duración: 8 horas) Alura.",
            htmlCssPart3:
              "HTML5 y CSS3 Parte 3: Trabajando con Formularios y Tablas (Duración: 8 horas) Alura.",
            htmlCssPart4: "HTML5 y CSS3 Parte 4: Avanzando en CSS (Duración: 8 horas) Alura.",
            bootstrap3: "Bootstrap 3: Creando una Página Única Responsiva (Duración: 12 horas) Alura.",
            bootstrap4:
              "Bootstrap 4: Creando una Página de Destino Responsiva (Duración: 8 horas) Alura.",
            cssArchitecture: "Arquitectura CSS: Simplificando Problemas (Duración: 8 horas) Alura.",
            cssGrid: "CSS Grid: Simplificando Diseños (Duración: 8 horas) Alura.",
            sassCompass: "Sass y Compass: Desmitificando CSS (Duración: 8 horas) Alura.",
            flexbox: "Flexbox: Posicionando Elementos en la Pantalla (Duración: 9 horas) Alura.",
            responsiveDesign:
              "Diseño Responsivo: Páginas que se Adaptan de Móvil a Escritorio (Duración: 10 horas) Alura.",
            webDevelopment: "Desarrollo Web (Duración: 12 horas) URI Campus Erechim.",
            gitGithub: "Git y Github: Controla y Comparte Tu Código (Duración: 6 horas) Alura.",
            gitBasics: "Conceptos Básicos de Git (Duración: 3.4 horas) Udemy.",
            javaProducts: "Productos Java - Especificaciones vs. Propietarios (Duración: 1 hora) Udemy.",
            javaSalesSystem: "Sistema de Ventas con Java Web (Duración: 10.5 horas) Udemy.",
            javaPharmacySystem: "Sistema de Farmacia con Java Web (Duración: 8 horas) Udemy.",
            javaFundamentals: "Fundamentos de Programación Java (Duración: 12 horas) Udemy.",
            programmingParadigms: "Paradigmas de Programación (Duración: 180 horas) Faculdade Metropolitana.",
            unitTestingJava:
              "Pruebas Unitarias en Java: Domina JUnit, Mockito y TDD (Duración: 8 horas) Udemy.",
            nodeJsTesting: "Pruebas en Node.JS (TDD) desde Cero (Duración: 15.5 horas) Udemy.",
            javascriptBasics:
              "JavaScript: Programando en el Lenguaje de la Web (Duración: 20 horas) Alura.",
            advancedJavascript1:
              "JavaScript Avanzado I: ES6, Programación Orientada a Objetos y Patrones de Diseño (Duración: 12 horas) Alura.",
            advancedJavascript2:
              "JavaScript Avanzado II: ES6, Programación Orientada a Objetos y Patrones de Diseño (Duración: 12 horas) Alura.",
            nestjsApi: "NESTJS: Creando una API REST con TypeScript (Duración: 6 horas) Alura.",
            advancedJavascript3:
              "JavaScript Avanzado III: ES6, Programación Orientada a Objetos y Patrones de Diseño (Duración: 12 horas) Alura.",
            reactPart1:
              "React Parte 1: Componentes Reutilizables para Tu Aplicación Web (Duración: 6 horas) Alura.",
            reactPart2:
              "React Parte 2: Validación, Enrutamiento e Integración con API (Duración: 8 horas) Alura.",
            vuePart1: "Vue Parte 1: Construyendo Aplicaciones de Página Única (Duración: 16 horas) Alura.",
            vuePart2: "Vue Parte 2: Construyendo Aplicaciones de Página Única (Duración: 16 horas) Alura.",
            jqueryIntroduction: "jQuery: Introducción a jQuery (Duración: 1 hora) Udemy.",
            jqueryPart1:
              "jQuery Parte 1: Domine la Biblioteca Más Popular del Mercado (Duración: 12 horas) Alura.",
            jqueryPart2:
              "jQuery Parte 2: Avanza con la Biblioteca Más Popular del Mercado (Duración: 12 horas) Alura.",
            nodeJsApis: "Node.js: Creando APIs (Duración: 2 horas) Udemy.",
            nodeJsMongoDb: "Node.js y MongoDB (Duración: 15.5 horas) Udemy.",
            angularIntroduction: "Angular 5: Introducción a JavaScript (Duración: 4 horas) URI Campus Erechim.",
            phpBestPractices: "Mejores Prácticas en PHP (Duración: 30 minutos) Professor Diego Mariano.",
            scrumMasterCertification:
              "Certificación Scrum Master: Curso de Preparación (Duración: 11 horas) Udemy.",
            scrumAgility: "Scrum: Agilidad en Tu Proyecto (Duración: 10 horas) Alura.",
            scrumPart1: "Scrum Parte 1: Gestiona Tu Proyecto de Manera Ágil (Duración: 5 horas) Alura.",
            scrumPart2:
              "Scrum Parte 2: El Manifiesto Ágil, Liderazgo y Organización en Scrum (Duración: 5 horas) Alura.",

            // Additional Education
            englishLiterature: "Lengua y Literatura Extranjera 'Inglés' (Duración: 250 horas) Topway English School, Erechim y Passo Fundo.",
            computerTechnician:
              "Técnico em Informática 'Hardware, Software, Redes' (Duración: 192 horas) SENAC Erechim.",
            administrativeAssistant: "Asistente Administrativo (Duración: 180 horas) SENAC Erechim.",
            basicToAdvancedComputing:
              "Informática Básica a Avanzada 'Word, Excel, Powerpoint, Windows, Linux, Mecanografía, Internet' (Duración: 160 horas) Escola JB Informática.",

            // Professional Experience
            uriProfessor:
              "Profesor de Ciencias de la Computación y Análisis y Desarrollo de Sistemas.",
            superbidEngineer: "Ingeniero de Software.",
            globalsysDeveloper: "Desarrollador Back-End.",
            compassDevOps: "Cloud & DevSecOps.",
            smartLockersIntern: "Pasante.",

            // Contact
            email: "Correo Electrónico:",
            whatsapp: "Whatsapp:",
            professionalExperience: "Experiencia Profesional",

            // Articles
            publishedArticles: "ARTÍCULOS PUBLICADOS",
            digitalInnovationTitle: "Innovación Digital para Microcervecerías: Una Herramienta Integrada para Monitoreo y Gestión de la Producción",
            publishedIn: "Publicado en",
            brazilianJournalTech: "Brazilian Journal of Technology",
            authors: "Autores:",
            description: "Descripción:",
            readFullArticle: "Lea el Artículo Completo",
            articleDescription: "Este artículo presenta una aplicación móvil llamada <em>Velha Guarda</em>, diseñada para automatizar y optimizar el proceso de producción de cerveza para microcervecerías. La solución integra monitoreo en tiempo real usando ESP8266 NodeMCU con sensores de temperatura, metodología orientada a objetos y herramientas como Flutter, Firebase y gestión de proyectos basada en Scrum. El objetivo es mejorar la seguridad, eficiencia, productividad y reducción de costos en la producción de cerveza artesanal de hasta 100 litros.",

            // Professional Experience Technical Terms
            programmingLanguages: "Lenguajes de Programación:",
            applicationServer: "Servidor de aplicaciones:",
            testing: "Pruebas:",
            messagingSystem: "Sistema de Mensajería:",
            databases: "Bases de Datos:",
            sourceCodeManagement: "Gestión de Código Fuente:",
            cloud: "Nube:",
            agileMethods: "Métodos Ágiles:",
            generalTooling: "Herramientas Generales:",
            softwareEngineeringBestPractices: "Mejores Prácticas de Ingeniería de Software:",
            aiEvaluationWork: "Trabajo de IA y Evaluación:",
            collaborationTools: "Herramientas de Colaboración:",
            cloudDevOps: "Nube & DevOps:",
            event: "Evento",

            // Job Titles
            seniorSoftwareEngineer: "Ingeniero de Software Sénior",
            productEngineer: "Ingeniero de Producto (Contrato vía Oowlish)",
            codingAgentExperience: "Treinador de Agente de Codificación",
            professorComputerScience: "Profesor de Ciencias de la Computación",
            tempoFullStackDeveloper: "Desarrollador Full Stack",

            // Technical Skills - Covetrus
            backendArchitecture: "Backend & Arquitectura:",
            productEngineering: "Ingeniería de Producto:",
            businessSolutionsTranslation: "Traduciendo necesidades de negocio en soluciones listas para producción",
            aiFirstDevelopment: "Desarrollo con IA:",
            qualitySDLC: "Calidad & SDLC:",
            testAutomationProcess: "Automatización de pruebas, mejoras CI/CD, lanzamientos más rápidos y confiables",
            frontend: "Frontend:",
            practices: "Prácticas:",
            agileSystemDesign: "Ágil (Scrum, Kanban), diseño de sistema, mentalidad de alta responsabilidad",

            // Subjects/Courses
            interfaceDesign: "Diseño de Interfaz",
            webDevelopment: "Desarrollo Web",
            ethicsAndLegislation: "Ética y Legislación Profesional",
            specialTopicsComputing1: "Temas Especiales en Computación I",
            specialTopicsComputing2: "Temas Especiais en Computación II",
            computationalThinking: "Pensamiento Computacional",

            // Workshop Categories
            cloudCategory: "NUBE",
            applicationsCategory: "APLICAÇÕES",
            accessibilityCategory: "ACCESIBILIDADE",
            devopsCategory: "DEVOPS",
            devToolsCategory: "HERRAMIENTAS DE DEV",
            htmlCssCategory: "HTML Y CSS",
            additionalEducationCategory: "EDUCAÇÃO ADICIONAL",
            gitGithubCategory: "GIT Y GITHUB",
            javaCategory: "JAVA",
            testsCategory: "PRUEBAS",
            javascriptCategory: "JAVASCRIPT",
            phpCategory: "PHP",
            scrumCategory: "SCRUM",

            // Database Category
            databaseCategory: "BASE DE DATOS",

            // Sections
            startups: "STARTUPS",
            projects: "PROYECTOS",
            websitesSection: "SITIOS WEB",
            iotSection: "IoT",

            // Websites
            architecture: "Arquitectura",
            cuisine: "Gastronomía",
            journalism: "Periodismo",
            games: "Juegos",
            agency: "Agencia",

            // Applications
            smartLockers: "Armarios Inteligentes",
            virtualStore: "Tienda Virtual",
            aestheticClinic: "Clínica Estética",
            systemsSection: "SISTEMAS",

            // Common Terms
            duration: "Duración:",
            year: "Año:",
            doi: "DOI:",
            hours: "horas",
            minutes: "minutos",

            //iot
            connectedWardrobe: "Armario Conectado",
            smartMailbox: "Buzón Inteligente",
            autonomousWardrobe: "Armario Autónomo",
            breweryAutomation: "Automatización de Cervecería",

            //virtual reality
            virtualRealityTitle: "Realidad Virtual",
            virtualRealityDescription: "Este evento fue organizado para el curso de ciencias de la computación, con el objetivo de contribuir a la mejora de la educación profesional y cívica de los involucrados. El objetivo del proyecto era modelar todo el Campus II de la Universidad URI Erechim en 3D en menos de 24 horas.",

            //course for sale
            coursesForSale: "Cursos en Venta",
            webDevelopmentTitle: "Desarrollo Web",
            webDevelopmentDescription: "Aprende a construir aplicaciones web completas desde cero, dominando HTML, CSS, JavaScript y gestión de bases de datos.",
            interfaceDesignTitle: "Diseño de Interfaz",
            interfaceDesignDescription: "Domine IHC: paradigmas, accesibilidad, usabilidad, prototipado y diseño y experiencia centrados en el usuario.",
            dataMiningTitle: "Minería de Datos con KDD, Python, R y Google Colab",
            dataMiningDescription: "Minería de Datos en la Práctica: KDD, Selección y Preprocesamiento de Datos con Python, R, WEKA y Google Colab.",
            professionalEthicsTitle: "Ética Profesional y Legislación",
            professionalEthicsDescription: "Derechos, Deberes y Código de Ética para Profesionales de TI y Tecnologia | Legislação Atualizada.",    
            professionalIoTTitle: "Internet de las Cosas: Fundamentos y Aplicaciones",
            professionalIoTDescription: "Internet de las Cosas (IoT) en la Práctica: Desarrolle Proyectos con Sensores, Protocolos y Plataformas Comerciales",
            programmingLogicDescription: "Aprende diagramas de flujo, pseudocódigo, variables, condicionales y bucles para resolver problemas de programación y desarrollar el pensamiento lógico.",
            programmingLogicTitle: "Lógica de Programación y Algoritmos: Guía Completa",
            databaseAdministrationTitle: "Administração de Bases de Dados: SQL, MySQL e DBA",
            databaseAdministrationDescription: "Aprenda segurança, performance, backup e recovery para trabalhar como DBA profissional e dominar SGBDs",
            globalProfileCourseTitle: "Construa Seu Perfil Profissional Global",
            globalProfileCourseDescription: "Posicione seu currículo e LinkedIn para destacar em processos de contratação remotos e internacionais.",
            aiPromptEngineeringTitle: "Ingeniería de Prompts de IA en la Práctica",
            aiPromptEngineeringDescription: "Comprende cómo funciona la IA generativa y aprende a diseñar prompts poderosos para aplicaciones del mundo real.",
            liveCodingInterviewsTitle: "Entrevistas de Live Coding JavaScript",
            liveCodingInterviewsDescription: "Aprende a resolver desafíos de algoritmos y pensar en voz alta durante entrevistas técnicas internacionales.",
            underConstruction: "🚧 En construcción 🚧",
            universityName: "Universidad Regional Integrada <br> del Alto Uruguay y las Misiones (2024 - 2025)",
            // Projects
            project1: {
              title: "Great Pet Care Platform - Gestión para Tutores y Clínicas",
              period: "Abr 2026 – Presente",
              description: "Contribuí a la plataforma Great Pet Care, una solución de Covetrus que conecta clínicas veterinarias y tutores de mascotas, permitiendo la programación de citas, gestión de recetas y el seguimiento centralizado de la salud de las mascotas. Trabajé en funcionalidades de backend tanto para el panel dirigido a tutores como para el panel administrativo de la plataforma, utilizando Node.js y TypeScript. Contribuí a la evolución de los flujos de gestión de cuentas y manejo de datos de mascotas/clinicas, aplicando un enfoque de desarrollo AI-first. Participé en decisiones de arquitectura centradas en la escalabilidad y mantenibilidad conforme la plataforma crecía.",
              company: "Covetrus"
            },
            project2: {
              title: "KORA",
              period: "May 2025 – Abr 2026",
              associated: "Tempo",
              description: "KORA es una plataforma de Field Service Management (FSM) de próxima generación desarrollada por Tempo, una de las principales empresas de Brasil en asistencia, conveniencia y servicios especializados. La plataforma moderniza las operaciones de posventa, incluida la instalación de muebles, montaje de electrodomésticos y servicios de telecomunicaciones, conectando minoristas, fabricantes, clientes y proveedores de servicios. Como Ingeniero de Software Backend Senior, contribuí a la arquitectura, descubrimiento técnico y desarrollo de microservicios escalables responsables de la programación, despacho y ejecución de los servicios de campo. Trabajé con arquitectura API-first y basada en eventos usando Java, Spring Boot, Kafka, AWS y Kubernetes.",
              company: "Tempo"
            },
            project3: {
              title: "BidTv",
              period: "Sep 2022 – Sep 2025",
              associated: "Superbid Exchange",
              description: "Trabajé dentro de una de las mayores plataformas de transacciones de subastas digitales en América Latina, conectando compradores y vendedores en diferentes industrias y segmentos de mercado. Contribuí a la evolución de funcionalidades de la plataforma y soluciones backend que soportan las operaciones de subasta digital.",
              company: "Superbid Exchange"
            },
            project4: {
              title: "Automatización de Cervecería",
              period: "Feb 2020 – Dic 2020",
              associated: "Universidad Regional Integrada del Alto Uruguay y de las Misiones - URI",
              description: "Desarrollé la aplicación móvil \"Velha Guarda\", una solución de control automatizado para los procesos de producción de cerveza artesanal. El proyecto tenía como objetivo mejorar la productividad, seguridad y eficiencia mediante el monitoreo de temperatura en las diferentes etapas de la fabricación utilizando tecnología IoT. La aplicación se desarrolló con Flutter, Dart, Firebase e integrada con ESP8266 NodeMCU V3 en C y sensores DS18B20. La solución permitió la gestión de recetas, monitoreo de temperatura y mejor control de las operaciones de producción.",
              skills: "Breadboard, DS18B20, IoT, Flutter, Firebase"
            },
            project5: {
              title: "Taquilla Inteligente",
              period: "Ene 2020 – Dic 2020",
              associated: "Armários Inteligentes",
              description: "Desarrollé una aplicación de taquilla inteligente basada en el concepto de Internet de las Cosas (IoT), controlada mediante una aplicación móvil y una API. El sistema permite la configuración de taquillas, gestión de usuarios, control de apertura de puertas, asignación de compartimentos y gestión de ocupación. Una interfaz de gestión web proporciona informes de ocupación y registros de acceso.",
              skills: "SQL, Flutter, IoT"
            },
          },
        },
      },
    })
    .then(function () {
      updateContent();
      updateLanguageButtons();
    });
});

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const key = element.getAttribute("data-i18n");
    element.innerHTML = i18next.t(key);
  });
}

function updateLanguageButtons() {
  const currentLang = i18next.language;
  document.querySelectorAll('.language-button').forEach(button => {
    button.classList.remove('active');
    const buttonLang = button.onclick.toString().match(/'(\w{2})'/);
    if (buttonLang && buttonLang[1] === currentLang) {
      button.classList.add('active');
    }
  });
}

function changeLanguage(lang) {
  // Salvar preferência do usuário no localStorage
  localStorage.setItem('userPreferredLanguage', lang);
  
  i18next.changeLanguage(lang).then(() => {
    updateContent();
    updateLanguageButtons();
  });
}
