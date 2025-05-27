document.addEventListener("DOMContentLoaded", function () {
  i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          translation: {
            // Menu
            university: "UNIVERSITY",
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
            skills: "Skills as a Software Developer",
            bachelorDegree: "BACHELOR'S DEGREE",
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

            // Descriptions
            basedInErechim:
              "Based in Erechim, northern Rio Grande do Sul, Brazil, I hold a Bachelor's degree in Computer Science from <abbr title='Universidade Regional Integrada do Alto Uruguai e das Missões Erechim'>URI-Erechim.</abbr> <br> I am a dedicated Software Engineer and Professor, with completed postgraduate studies in Software Engineering and Database Administration. <br> With the goal of continuous professional development in the field of information technology, aiming to assist companies in maximizing their results through study, dedication, research, and innovation. <br> In recent years, I have consistently improved my skills, contributing to projects I've been a part of, always with a sense of responsibility and professionalism, and actively seeking to learn from and exchange experiences with fellow professionals. I prioritize solving business-related issues, possess a strong sense of ownership and urgency.",
            startupDescription:
              "With three participations in Startup Weekend Erechim/RS, two as a software developer and one as part of the volunteer organization team for the fourth edition. Responsible for managing and executing all event activities and supporting the local entrepreneurial culture.",
            startupExperience:
              "In these editions, I had the opportunity to work in multifunctional teams with incredibly talented and motivated individuals. Together, we tackled complex and exciting challenges, from conceiving an idea to creating a functional prototype and crafting a robust business model. The fast-paced nature of Startup Weekend pushed us to learn how to collaborate effectively, make quick decisions, and efficiently prioritize tasks.",
            virtualRealityDescription:
              "This event was organized for the computer science course, aiming to contribute to the improvement of the professional and civic education of those involved. The project's objective was to model the entire Uri Campus II Erechim University in 3D in less than 24 hours.",

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
              "Web Accessibility: Introduction to Inclusive Designs.",
            webAccessibilityPart1:
              "Web Accessibility Part 1: Making Your Front-End Inclusive.",
            webAccessibilityPart2:
              "Web Accessibility Part 2: Accessible Components with a Bit of JavaScript.",
            androidKotlin: "Android App Development with Kotlin.",
            dartProgramming: "Dart Programming Language.",
            flutterDevelopment: "Android and iOS App Development with Flutter.",
            mysqlDatabase: "MySQL Database.",
            introductionToMySQL: "Introduction to MySQL Database.",
            amazonEC2: "Introduction to Amazon Elastic Compute Cloud (EC2).",
            awsComputeServices: "AWS Compute Services Overview.",
            awsApplicationServices: "AWS Application Services Overview.",
            dockerContainers: "Docker: Creating Containers Without Headaches.",
            kubernetesPods: "Kubernetes: Pods, Services, and ConfigMaps.",
            delphiLazarus: "Learn Delphi and Lazarus from Scratch.",
            webServicesIntegration:
              "Integration of Solutions with Web Services.",
            apiSpecifications: "API Specifications with Swagger and OpenAPI.",
            restApiDocumentation:
              "Understanding and Documenting REST/RESTful APIs.",
            webpackModules: "Webpack: Manipulating Modules in Your Web App.",
            chromeDevTools:
              "Chrome DevTools: Analyze, Inspect, and Debug Your Web Pages.",
            httpUnderstanding: "HTTP: Understanding the Web Under the Hood.",
            lgpdImpacts: "LGPD: Getting to Know and Understanding Its Impacts.",
            webPerformance: "Web Performance I: Optimizing the Front-End.",
            neuralNetworks:
              "Introduction to Neural Networks: Deep Learning with PyTorch.",
            htmlCssPart1: "HTML5 and CSS3 Part 1: The First Web Page.",
            htmlCssPart2:
              "HTML5 and CSS3 Part 2: Positioning, Lists, and Navigation.",
            htmlCssPart3:
              "HTML5 and CSS3 Part 3: Working with Forms and Tables.",
            htmlCssPart4: "HTML5 and CSS3 Part 4: Advancing in CSS.",
            bootstrap3: "Bootstrap 3: Creating a Responsive Single-Page.",
            bootstrap4: "Bootstrap 4: Creating a Responsive Landing Page.",
            cssArchitecture: "CSS Architecture: Simplifying Problems.",
            cssGrid: "CSS Grid: Simplifying Layouts.",
            sassCompass: "Sass and Compass: Demystifying CSS.",
            flexbox: "Flexbox: Position Elements on the Screen.",
            responsiveDesign:
              "Responsive Web Design: Pages that Adapt from Mobile to Desktop.",
            webDevelopment: "Web Development.",
            gitGithub: "Git and Github: Control and Share Your Code.",
            gitBasics: "Git Basics.",
            javaProducts: "Java Products - Specifications vs. Proprietaries.",
            javaSalesSystem: "Sales System with Java Web.",
            javaPharmacySystem: "Pharmacy System with Java Web.",
            javaFundamentals: "Java Programming Fundamentals.",
            programmingParadigms: "Programming Paradigms.",
            unitTestingJava:
              "Unit Testing in Java: Master JUnit, Mockito, and TDD.",
            nodeJsTesting: "Node.JS Testing (TDD) from the Ground Up.",
            javascriptBasics:
              "JavaScript: Programming in the language of the web.",
            advancedJavascript1:
              "Advanced JavaScript I: ES6, object-oriented programming, and design patterns.",
            advancedJavascript2:
              "Advanced JavaScript II: ES6, object-oriented programming, and design patterns.",
            nestjsApi: "NESTJS: Creating a REST API with TypeScript.",
            advancedJavascript3:
              "Advanced JavaScript III: ES6, object-oriented programming, and design patterns.",
            reactPart1: "React part 1: Reusable components for your web app.",
            reactPart2:
              "React part 2: Validation, Routing, and API Integration.",
            vuePart1: "Vue part 1: Building Single Page Applications.",
            vuePart2: "Vue part 2: Building Single Page Applications.",
            jqueryIntroduction: "jQuery: Introduction to jQuery.",
            jqueryPart1:
              "jQuery part 1: Master the most popular library in the market.",
            jqueryPart2:
              "jQuery part 2: Advance with the most popular library in the market.",
            nodeJsApis: "Node.js: Creating APIs.",
            nodeJsMongoDb: "Node.js and MongoDB.",
            angularIntroduction: "Angular 5: Introduction to JavaScript.",
            phpBestPractices: "Best Practices in PHP.",
            scrumMasterCertification:
              "Scrum Master Certification: Preparatory Course.",
            scrumAgility: "Scrum: Agility in Your Project.",
            scrumPart1: "Scrum Part 1: Manage Your Project Agilely.",
            scrumPart2:
              "Scrum Part 2: The Agile Manifesto, Leadership, and Organization in Scrum.",

            // Additional Education
            englishLiterature: "Foreign Language and Literature 'English'.",
            computerTechnician:
              "Computer Technician 'Hardware, Software, Networks'.",
            administrativeAssistant: "Administrative Assistant.",
            basicToAdvancedComputing:
              "Basic to Advanced Computing 'Word, Excel, Powerpoint, Windows, Linux, Typing, Internet'.",

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
            professionalExperience: "Professional Experience",

            //iot
            connectedWardrobe: "Connected Wardrobe",
            smartMailbox: "Smart Mailbox",
            autonomousWardrobe: "Autonomous Wardrobe",
            breweryAutomation: "Brewery Automation",

            //virtual reality
             virtualRealityTitle: "Virtual Reality",
            virtualRealityDescription: "This event was organized for the computer science course, aiming to contribute to the improvement of the professional and civic education of those involved. The project's objective was to model the entire Uri Campus II Erechim University in 3D in less than 24 hours.",

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
          },
        },
        pt: {
          translation: {
            // Menu
            university: "UNIVERSIDADE",
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
            skills: "Habilidades como Desenvolvedor de Software",
            bachelorDegree: "GRADUAÇÃO",
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
              "Acessibilidade Web: Introdução a Designs Inclusivos.",
            webAccessibilityPart1:
              "Acessibilidade Web Parte 1: Tornando Seu Front-End Inclusivo.",
            webAccessibilityPart2:
              "Acessibilidade Web Parte 2: Componentes Acessíveis com um Pouco de JavaScript.",
            androidKotlin: "Desenvolvimento de Aplicativos Android com Kotlin.",
            dartProgramming: "Linguagem de Programação Dart.",
            flutterDevelopment:
              "Desenvolvimento de Aplicativos Android e iOS com Flutter.",
            mysqlDatabase: "Banco de Dados MySQL.",
            introductionToMySQL: "Introdução ao Banco de Dados MySQL.",
            amazonEC2: "Introdução ao Amazon Elastic Compute Cloud (EC2).",
            awsComputeServices:
              "Visão Geral dos Serviços de Computação da AWS.",
            awsApplicationServices:
              "Visão Geral dos Serviços de Aplicação da AWS.",
            dockerContainers:
              "Docker: Criando Contêineres sem Dores de Cabeça.",
            kubernetesPods: "Kubernetes: Pods, Serviços e ConfigMaps.",
            delphiLazarus: "Aprenda Delphi e Lazarus do Zero.",
            webServicesIntegration: "Integração de Soluções com Web Services.",
            apiSpecifications: "Especificações de API com Swagger e OpenAPI.",
            restApiDocumentation:
              "Entendendo e Documentando APIs REST/RESTful.",
            webpackModules:
              "Webpack: Manipulando Módulos em Sua Aplicação Web.",
            chromeDevTools:
              "Chrome DevTools: Analise, Inspecione e Depure Suas Páginas Web.",
            httpUnderstanding: "HTTP: Entendendo a Web por Baixo dos Panos.",
            lgpdImpacts: "LGPD: Conhecendo e Entendendo Seus Impactos.",
            webPerformance: "Desempenho Web I: Otimizando o Front-End.",
            neuralNetworks:
              "Introdução às Redes Neurais: Deep Learning com PyTorch.",
            htmlCssPart1: "HTML5 e CSS3 Parte 1: A Primeira Página Web.",
            htmlCssPart2:
              "HTML5 e CSS3 Parte 2: Posicionamento, Listas e Navegação.",
            htmlCssPart3:
              "HTML5 e CSS3 Parte 3: Trabalhando com Formulários e Tabelas.",
            htmlCssPart4: "HTML5 e CSS3 Parte 4: Avançando no CSS.",
            bootstrap3: "Bootstrap 3: Criando uma Página Única Responsiva.",
            bootstrap4:
              "Bootstrap 4: Criando uma Página de Destino Responsiva.",
            cssArchitecture: "Arquitetura CSS: Simplificando Problemas.",
            cssGrid: "CSS Grid: Simplificando Layouts.",
            sassCompass: "Sass e Compass: Desmistificando CSS.",
            flexbox: "Flexbox: Posicionando Elementos na Tela.",
            responsiveDesign:
              "Design Responsivo: Páginas que se Adaptam do Mobile ao Desktop.",
            webDevelopment: "Desenvolvimento Web.",
            gitGithub: "Git e Github: Controle e Compartilhe Seu Código.",
            gitBasics: "Noções Básicas de Git.",
            javaProducts: "Produtos Java - Especificações vs. Proprietários.",
            javaSalesSystem: "Sistema de Vendas com Java Web.",
            javaPharmacySystem: "Sistema de Farmácia com Java Web.",
            javaFundamentals: "Fundamentos de Programação Java.",
            programmingParadigms: "Paradigmas de Programação.",
            unitTestingJava:
              "Testes Unitários em Java: Domine JUnit, Mockito e TDD.",
            nodeJsTesting: "Testes em Node.JS (TDD) do Zero.",
            javascriptBasics: "JavaScript: Programando na Linguagem da Web.",
            advancedJavascript1:
              "JavaScript Avançado I: ES6, Programação Orientada a Objetos e Padrões de Design.",
            advancedJavascript2:
              "JavaScript Avançado II: ES6, Programação Orientada a Objetos e Padrões de Design.",
            nestjsApi: "NESTJS: Criando uma API REST com TypeScript.",
            advancedJavascript3:
              "JavaScript Avançado III: ES6, Programação Orientada a Objetos e Padrões de Design.",
            reactPart1:
              "React Parte 1: Componentes Reutilizáveis para Sua Aplicação Web.",
            reactPart2:
              "React Parte 2: Validação, Roteamento e Integração com API.",
            vuePart1: "Vue Parte 1: Construindo Aplicações de Página Única.",
            vuePart2: "Vue Parte 2: Construindo Aplicações de Página Única.",
            jqueryIntroduction: "jQuery: Introdução ao jQuery.",
            jqueryPart1:
              "jQuery Parte 1: Domine a Biblioteca Mais Popular do Mercado.",
            jqueryPart2:
              "jQuery Parte 2: Avançando com a Biblioteca Mais Popular do Mercado.",
            nodeJsApis: "Node.js: Criando APIs.",
            nodeJsMongoDb: "Node.js e MongoDB.",
            angularIntroduction: "Angular 5: Introdução ao JavaScript.",
            phpBestPractices: "Melhores Práticas em PHP.",
            scrumMasterCertification:
              "Certificação Scrum Master: Curso Preparatório.",
            scrumAgility: "Scrum: Agilidade em Seu Projeto.",
            scrumPart1: "Scrum Parte 1: Gerencie Seu Projeto de Forma Ágil.",
            scrumPart2:
              "Scrum Parte 2: O Manifesto Ágil, Liderança e Organização no Scrum.",

            // Additional Education
            englishLiterature: "Língua e Literatura Estrangeira 'Inglês'.",
            computerTechnician:
              "Técnico em Informática 'Hardware, Software, Redes'.",
            administrativeAssistant: "Assistente Administrativo.",
            basicToAdvancedComputing:
              "Informática Básica a Avançada 'Word, Excel, Powerpoint, Windows, Linux, Digitação, Internet'.",

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
          },
        },
        es: {
          translation: {
            // Menu
            university: "UNIVERSIDAD",
            certificates: "CERTIFICADOS",
            workshops: "TALLERES",
            experience: "EXPERIENCIA",
            iot: "IoT",
            vr: "VR",
            websites: "SITIOS WEB",
            applications: "APLICACIONES",
            systems: "SISTEMAS",
            contact: "CONTACTO",

            // Titles and Headings
            title: "Jackson F. Magnabosco",
            subtitle:
              "Ingeniero de Software, Profesor Universitario y Creador de Cursos",
            skills: "Habilidades como Desarrollador de Software",
            bachelorDegree: "LICENCIATURA",
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
              "Radicado en Erechim, al norte de Rio Grande do Sul, Brasil, tengo una licenciatura en Ciencias de la Computación de la <abbr title='Universidad Regional Integrada del Alto Uruguay y de las Misiones Erechim'>URI-Erechim.</abbr> <br> Soy un Ingeniero de Software y Profesor dedicado, con estudios de posgrado completados en Ingeniería de Software y Administración de Bases de Datos. <br> Con el objetivo de desarrollo profesional continuo en el campo de la tecnología de la información, buscando ayudar a las empresas a maximizar sus resultados a través del estudio, dedicación, investigación e innovación. <br> En los últimos años, he mejorado constantemente mis habilidades, contribuyendo a los proyectos en los que he participado, siempre con un sentido de responsabilidad y profesionalismo, y buscando activamente aprender e intercambiar experiencias con otros profesionales. Priorizo la resolución de problemas relacionados con los negocios, poseyendo un fuerte sentido de pertenencia y urgencia.",
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
              "Accesibilidad Web: Introducción a Diseños Inclusivos.",
            webAccessibilityPart1:
              "Accesibilidad Web Parte 1: Haciendo Tu Front-End Inclusivo.",
            webAccessibilityPart2:
              "Accesibilidad Web Parte 2: Componentes Accesibles con un Poco de JavaScript.",
            androidKotlin: "Desarrollo de Aplicaciones Android con Kotlin.",
            dartProgramming: "Lenguaje de Programación Dart.",
            flutterDevelopment:
              "Desarrollo de Aplicaciones Android y iOS con Flutter.",
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
            delphiLazarus: "Aprende Delphi y Lazarus desde Cero.",
            webServicesIntegration:
              "Integración de Soluciones con Servicios Web.",
            apiSpecifications: "Especificaciones de API con Swagger y OpenAPI.",
            restApiDocumentation:
              "Comprensión y Documentación de APIs REST/RESTful.",
            webpackModules:
              "Webpack: Manipulando Módulos en Tu Aplicación Web.",
            chromeDevTools:
              "Chrome DevTools: Analiza, Inspecciona y Depura Tus Páginas Web.",
            httpUnderstanding: "HTTP: Entendiendo la Web Bajo el Capó.",
            lgpdImpacts: "LGPD: Conociendo y Entendiendo Sus Impactos.",
            webPerformance: "Rendimiento Web I: Optimizando el Front-End.",
            neuralNetworks:
              "Introducción a las Redes Neuronales: Deep Learning con PyTorch.",
            htmlCssPart1: "HTML5 y CSS3 Parte 1: La Primera Página Web.",
            htmlCssPart2:
              "HTML5 y CSS3 Parte 2: Posicionamiento, Listas y Navegación.",
            htmlCssPart3:
              "HTML5 y CSS3 Parte 3: Trabajando con Formularios y Tablas.",
            htmlCssPart4: "HTML5 y CSS3 Parte 4: Avanzando en CSS.",
            bootstrap3: "Bootstrap 3: Creando una Página Única Responsiva.",
            bootstrap4:
              "Bootstrap 4: Creando una Página de Destino Responsiva.",
            cssArchitecture: "Arquitectura CSS: Simplificando Problemas.",
            cssGrid: "CSS Grid: Simplificando Diseños.",
            sassCompass: "Sass y Compass: Desmitificando CSS.",
            flexbox: "Flexbox: Posicionando Elementos en la Pantalla.",
            responsiveDesign:
              "Diseño Responsivo: Páginas que se Adaptan de Móvil a Escritorio.",
            webDevelopment: "Desarrollo Web.",
            gitGithub: "Git y Github: Controla y Comparte Tu Código.",
            gitBasics: "Conceptos Básicos de Git.",
            javaProducts: "Productos Java - Especificaciones vs. Propietarios.",
            javaSalesSystem: "Sistema de Ventas con Java Web.",
            javaPharmacySystem: "Sistema de Farmacia con Java Web.",
            javaFundamentals: "Fundamentos de Programación Java.",
            programmingParadigms: "Paradigmas de Programación.",
            unitTestingJava:
              "Pruebas Unitarias en Java: Domina JUnit, Mockito y TDD.",
            nodeJsTesting: "Pruebas en Node.JS (TDD) desde Cero.",
            javascriptBasics:
              "JavaScript: Programando en el Lenguaje de la Web.",
            advancedJavascript1:
              "JavaScript Avanzado I: ES6, Programación Orientada a Objetos y Patrones de Diseño.",
            advancedJavascript2:
              "JavaScript Avanzado II: ES6, Programación Orientada a Objetos y Patrones de Diseño.",
            nestjsApi: "NESTJS: Creando una API REST con TypeScript.",
            advancedJavascript3:
              "JavaScript Avanzado III: ES6, Programación Orientada a Objetos y Patrones de Diseño.",
            reactPart1:
              "React Parte 1: Componentes Reutilizables para Tu Aplicación Web.",
            reactPart2:
              "React Parte 2: Validación, Enrutamiento e Integración con API.",
            vuePart1: "Vue Parte 1: Construyendo Aplicaciones de Página Única.",
            vuePart2: "Vue Parte 2: Construyendo Aplicaciones de Página Única.",
            jqueryIntroduction: "jQuery: Introducción a jQuery.",
            jqueryPart1:
              "jQuery Parte 1: Domina la Biblioteca Más Popular del Mercado.",
            jqueryPart2:
              "jQuery Parte 2: Avanza con la Biblioteca Más Popular del Mercado.",
            nodeJsApis: "Node.js: Creando APIs.",
            nodeJsMongoDb: "Node.js y MongoDB.",
            angularIntroduction: "Angular 5: Introducción a JavaScript.",
            phpBestPractices: "Mejores Prácticas en PHP.",
            scrumMasterCertification:
              "Certificación Scrum Master: Curso de Preparación.",
            scrumAgility: "Scrum: Agilidad en Tu Proyecto.",
            scrumPart1: "Scrum Parte 1: Gestiona Tu Proyecto de Manera Ágil.",
            scrumPart2:
              "Scrum Parte 2: El Manifiesto Ágil, Liderazgo y Organización en Scrum.",

            // Additional Education
            englishLiterature: "Lengua y Literatura Extranjera 'Inglés'.",
            computerTechnician:
              "Técnico en Informática 'Hardware, Software, Redes'.",
            administrativeAssistant: "Asistente Administrativo.",
            basicToAdvancedComputing:
              "Informática Básica a Avanzada 'Word, Excel, Powerpoint, Windows, Linux, Mecanografía, Internet'.",

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
            interfaceDesignDescription: "Domina HCI: paradigmas, accesibilidad, usabilidad, prototipado y diseño y experiencia centrados en el usuario.",
            dataMiningTitle: "Minería de Datos con KDD, Python, R y Google Colab",
            dataMiningDescription: "Minería de Datos en la Práctica: KDD, Selección y Preprocesamiento de Datos con Python, R, WEKA y Google Colab.",
            professionalEthicsTitle: "Ética Profesional y Legislación",
            professionalEthicsDescription: "Derechos, Deberes y Código de Ética para Profesionales de TI y Tecnología | Legislación Actualizada.",    
            professionalIoTTitle: "Internet de las Cosas: Fundamentos y Aplicaciones",
            professionalIoTDescription: "Internet de las Cosas (IoT) en la Práctica: Desarrolle Proyectos con Sensores, Protocolos y Plataformas Comerciales",
            programmingLogicDescription: "Aprenda fluxogramas, pseudocódigo, variáveis, condicionais e loops para resolver problemas de programação e desenvolver o raciocínio lógico.",
            programmingLogicTitle: "Lógica de Programación y Algoritmos: Guía Completa",
          },
        },
      },
    })
    .then(function () {
      updateContent();
    });
});

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const key = element.getAttribute("data-i18n");
    element.innerHTML = i18next.t(key);
  });
}

function changeLanguage(lang) {
  i18next.changeLanguage(lang).then(() => {
    updateContent();
  });
}
